// Add hover effect to tool items
document.querySelectorAll('.bhumi-tool-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px)';
        item.style.transition = 'transform 0.2s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// Add click effect to action buttons
document.querySelectorAll('.bhumi-action-button').forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
});

// Select elements for main chat
const chatInput = document.querySelector('.bhumi-bottom-bar .bhumi-chat-input');
const sendButton = document.getElementById("bhumi-send-button");
const contentArea = document.getElementById("bhumi-content-area");

// Select elements for chat widget
const chatButton = document.getElementById("bhumi-chat-button");
const chatWidget = document.getElementById("bhumi-chat-widget");
const closeChat = document.getElementById("bhumi-close-chat");
const widgetChatInput = document.getElementById("bhumi-widget-chat-input");
const widgetSendButton = document.getElementById("bhumi-widget-send-button");
const chatWidgetMessages = document.getElementById("bhumi-chat-widget-messages");

// Toggle chat widget visibility
chatButton.addEventListener("click", () => {
    chatWidget.classList.toggle("active");
});

// Close chat widget
closeChat.addEventListener("click", () => {
    chatWidget.classList.remove("active");
});

// Create chat history container for main chat
let chatHistory = document.querySelector(".bhumi-content-area .bhumi-chat-history");
if (!chatHistory) {
    chatHistory = document.createElement("div");
    chatHistory.className = "bhumi-chat-history";
    contentArea.appendChild(chatHistory);
}

// Send message function for main chat
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        if (contentArea.querySelector('.bhumi-heading')) {
            contentArea.innerHTML = '';
            contentArea.appendChild(chatHistory);
        }
        
        addMessageToHistory(message, true, chatHistory);
        
        const loadingDiv = document.createElement("div");
        loadingDiv.textContent = "Thinking...";
        loadingDiv.className = "bhumi-loading-message";
        chatHistory.appendChild(loadingDiv);
        
        chatInput.value = '';
        
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            chatHistory.removeChild(loadingDiv);
            
            if (data.error) {
                addMessageToHistory("Error: " + data.error, false, chatHistory);
            } else {
                addAIMessageToHistory(data.response, chatHistory);
            }
        } catch (error) {
            chatHistory.removeChild(loadingDiv);
            addMessageToHistory("Error: Unable to connect to the server. Please try again.", false, chatHistory);
        }
    }
}

// Send message function for chat widget
async function sendWidgetMessage() {
    const message = widgetChatInput.value.trim();
    if (message) {
        addMessageToHistory(message, true, chatWidgetMessages);
        
        const loadingDiv = document.createElement("div");
        loadingDiv.textContent = "Thinking...";
        loadingDiv.className = "bhumi-loading-message";
        chatWidgetMessages.appendChild(loadingDiv);
        
        widgetChatInput.value = '';
        
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            chatWidgetMessages.removeChild(loadingDiv);
            
            if (data.error) {
                addMessageToHistory("Error: " + data.error, false, chatWidgetMessages);
            } else {
                addAIMessageToHistory(data.response, chatWidgetMessages);
            }
        } catch (error) {
            chatWidgetMessages.removeChild(loadingDiv);
            addMessageToHistory("Error: Unable to connect to the server. Please try again.", false, chatWidgetMessages);
        }
    }
}

// Append user message to chat history
function addMessageToHistory(message, isUser = false, container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "bhumi-user-message" : "bhumi-ai-message";
    messageDiv.textContent = message;
    messageDiv.style.animation = "fadeIn 0.3s ease-in-out";
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Append AI message to chat history
function addAIMessageToHistory(htmlContent, container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "bhumi-ai-message";
    messageDiv.innerHTML = htmlContent;
    messageDiv.style.animation = "fadeIn 0.3s ease-in-out";
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Handle send button click for main chat
if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}

// Handle Enter key in chat input
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Handle send button click for chat widget
widgetSendButton.addEventListener("click", sendWidgetMessage);

// Handle Enter key in chat widget input
widgetChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendWidgetMessage();
    }
});
