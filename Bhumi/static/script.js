// Add hover effect to tool items
document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px)';
        item.style.transition = 'transform 0.2s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// Add click effect to action buttons
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
});

// Select elements for main chat (if you want to keep it)
const chatInput = document.querySelector('.bottom-bar .chat-input');
const sendButton = document.getElementById("send-button");
const contentArea = document.getElementById("content-area");

// Select elements for chat widget
const chatButton = document.getElementById("chat-button");
const chatWidget = document.getElementById("chat-widget");
const closeChat = document.getElementById("close-chat");
const widgetChatInput = document.getElementById("widget-chat-input");
const widgetSendButton = document.getElementById("widget-send-button");
const chatWidgetMessages = document.getElementById("chat-widget-messages");

// Toggle chat widget visibility
chatButton.addEventListener("click", () => {
    chatWidget.classList.toggle("active");
});

// Close chat widget
closeChat.addEventListener("click", () => {
    chatWidget.classList.remove("active");
});

// Create chat history container for main chat if you want to keep it
let chatHistory = document.querySelector(".content-area .chat-history");
if (!chatHistory) {
    chatHistory = document.createElement("div");
    chatHistory.className = "chat-history";
    contentArea.appendChild(chatHistory);
}

// Send message function for main chat (if you want to keep it)
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Clear welcome content if this is the first message
        if (contentArea.querySelector('.heading')) {
            contentArea.innerHTML = '';
            contentArea.appendChild(chatHistory);
        }
        
        // Add user message to chat
        addMessageToHistory(message, true, chatHistory);
        
        // Show loading indicator
        const loadingDiv = document.createElement("div");
        loadingDiv.textContent = "Thinking...";
        loadingDiv.className = "loading-message";
        chatHistory.appendChild(loadingDiv);
        
        // Clear input field
        chatInput.value = '';
        
        try {
            // Fetch AI response
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Remove loading indicator
            chatHistory.removeChild(loadingDiv);
            
            if (data.error) {
                addMessageToHistory("Error: " + data.error, false, chatHistory);
            } else {
                // Add AI response to chat
                addAIMessageToHistory(data.response, chatHistory);
            }
        } catch (error) {
            // Remove loading indicator and show error
            chatHistory.removeChild(loadingDiv);
            addMessageToHistory("Error: Unable to connect to the server. Please try again.", false, chatHistory);
        }
    }
}

// Send message function for chat widget
async function sendWidgetMessage() {
    const message = widgetChatInput.value.trim();
    if (message) {
        // Add user message to chat widget
        addMessageToHistory(message, true, chatWidgetMessages);
        
        // Show loading indicator
        const loadingDiv = document.createElement("div");
        loadingDiv.textContent = "Thinking...";
        loadingDiv.className = "loading-message";
        chatWidgetMessages.appendChild(loadingDiv);
        
        // Clear input field
        widgetChatInput.value = '';
        
        try {
            // Fetch AI response
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Remove loading indicator
            chatWidgetMessages.removeChild(loadingDiv);
            
            if (data.error) {
                addMessageToHistory("Error: " + data.error, false, chatWidgetMessages);
            } else {
                // Add AI response to chat
                addAIMessageToHistory(data.response, chatWidgetMessages);
            }
        } catch (error) {
            // Remove loading indicator and show error
            chatWidgetMessages.removeChild(loadingDiv);
            addMessageToHistory("Error: Unable to connect to the server. Please try again.", false, chatWidgetMessages);
        }
    }
}

// Append user message to chat history
function addMessageToHistory(message, isUser = false, container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "user-message" : "ai-message";
    messageDiv.textContent = message;
    
    // Add animation
    messageDiv.style.animation = "fadeIn 0.3s ease-in-out";
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Append AI message to chat history (with HTML support)
function addAIMessageToHistory(htmlContent, container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "ai-message";
    messageDiv.innerHTML = htmlContent;
    
    // Add animation
    messageDiv.style.animation = "fadeIn 0.3s ease-in-out";
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Handle send button click for main chat (if you want to keep it)
if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}

// Handle Enter key in chat input for main chat (if you want to keep it)
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
