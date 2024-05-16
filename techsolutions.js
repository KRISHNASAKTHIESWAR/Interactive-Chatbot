// Toggle Chatbot Visibility
function toggleChat() {
    var chatContainer = document.getElementById("chat-container");
    chatContainer.style.display = chatContainer.style.display === "none" ? "flex" : "none";
}

// Start voice recognition
function startListening() {
    // Add code to start voice recognition here
}

// Send message
function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    if (userInput.trim() !== "") {
        appendMessage("You: " + userInput, "right-message");
        document.getElementById("user-input").value = "";
        fetch("/send-message", {
            method: "POST",
            body: JSON.stringify({ message: userInput }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                appendMessage("Bot: " + data.response, "left-message");
                speak(data.response); // Speak the response
            } else {
                appendMessage("Bot: I'm sorry, I didn't understand that.", "left-message");
                speak("I'm sorry, I didn't understand that."); // Speak a generic response
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            appendMessage("Bot: Oops! Something went wrong.", "left-message"); // Display error message
        });
    }
}

// Function to create and display a notification
function showNotification() {
    const chatContainer = document.querySelector(".chat-container");
    const notification = document.createElement("div");
    notification.textContent = "Microphone is on";
    notification.classList.add("notification");
    chatContainer.appendChild(notification);

    // Trigger reflow to restart transition
    notification.offsetHeight;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            chatContainer.removeChild(notification);
        }, 500);
    }, 3000);
}

// Append message to chat box
function appendMessage(message, side) {
    var chatBox = document.getElementById("chat-box");
    var newMessage = document.createElement("div");
    newMessage.textContent = message;
    newMessage.classList.add("message", side);
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Speak text
function speak(text) {
    var utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    speechSynthesis.speak(utterance);
}
