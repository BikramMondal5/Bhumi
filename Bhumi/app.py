import base64
import os
from google import genai
from google.genai import types
from flask import Flask, render_template, request, jsonify
import markdown

# Initializing the app
app = Flask(__name__)

# Configure Google Gemini API Key securely
API_KEY = "google-api-key"  # Use an environment variable
client = genai.Client(api_key=API_KEY)

# Function to generate AI response
def generate(user_message):
    model = "gemini-2.0-flash"
    
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=user_message)],
        ),
    ]
    
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(
                text="""You are Bhumi, an expert AI farming assistant focused on sustainable agriculture. Your goal is to help farmers grow healthier crops by providing the best farming practices, organic solutions, and weather-based tips. Answer in a simple, farmer-friendly tone. Give step-by-step instructions where needed. Provide eco-friendly and low-cost solutions if possible. Here’s the query:

 #  {Farmer's Question}

 #  💡 If the farmer asks about a specific crop (e.g., rice, wheat, tomatoes), provide: 1. Best soil type & preparation methods.
 #  2. Ideal watering schedule & techniques.
 #  3. Common diseases & natural/chemical treatments.
 #  4. Fertilization & organic composting tips.
 #  5. Weather-based precautions & pest control strategies.
 #  6. Post-harvest handling & storage advice.

 #  🚜 If the farmer asks a general question (e.g., how to improve soil fertility, how to control pests), provide:
 #  1. Easy-to-follow techniques (e.g., crop rotation, mulching, composting).
 #  2. Low-cost or organic alternatives.
 #  3. A brief explanation of why the method works.

 #  🗣️ If the input is in voice format, respond in a friendly conversational tone.
 #  🔄 Keep responses concise yet informative (150-200 words max).
 #  📌 If the farmer needs step-by-step guidance, list the steps clearly."""
            ),
        ],
    )

    # Stream AI Response
    response_text = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response_text += chunk.text

    return markdown.markdown(response_text)  # Convert to HTML


@app.route('/api/chat', methods=["POST"])
def chat():
    data = request.json
    user_input = data.get('message', '')

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    ai_response = generate(user_input)
    return jsonify({"response": ai_response})


@app.route('/', methods=["GET"])
def home_page():
    html_response = generate("What is the best way to control pests in tomato plants?")
    return render_template('index.html', html_response=html_response)


if __name__ == "__main__":
    app.run(debug=True)
