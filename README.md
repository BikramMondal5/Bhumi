# Bhumi - Let's grow together

An AI-powered assistant that helps farmers with sustainable agriculture advice, best farming practices, and crop-specific guidance using Google Gemini.

---

## 🌟 Features
- AI-driven chat assistant for farmers
- Crop-specific advice (soil, watering, diseases, fertilization, weather, post-harvest)
- General farming tips (soil fertility, pest control, composting, etc.)
- Simple, farmer-friendly responses
- Step-by-step instructions for common queries
- Weather-based and eco-friendly suggestions
- Web-based interface for easy access

## 🛠️ Technologies Used
- Python 3
- Flask (web framework)
- Google Gemini (genai) API
- HTML, CSS, JavaScript (frontend)
- Markdown (for AI response formatting)

## ⚙️ Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Bhumi
   ```
2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install flask google-generativeai markdown
   ```
4. **Set up your Google Gemini API key:**
   - Get your API key from Google.
   - Set it as an environment variable:
     ```bash
     export gemini-api=YOUR_API_KEY  # On Windows: set gemini-api=YOUR_API_KEY
     ```

## 🚀 How to Use
1. Start the Flask server:
   ```bash
   python Bhumi/app.py
   ```
2. Open your browser and go to `http://localhost:5000`
3. Ask your farming questions in the chat interface and get instant, AI-powered advice!

## 🤝 Contribution
Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

## 📜 License
This project is licensed under the `MIT License`.
