const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;


const synthesis = window.speechSynthesis;


let isListening = false;


const startListeningButton = document.getElementById("start-listening-button");

document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

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
                speak(data.response); 
            } else {
                appendMessage("Bot: I'm sorry, I didn't understand that.", "left-message");
                speak("I'm sorry, I didn't understand that."); 
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            appendMessage("Bot: Oops! Something went wrong.", "left-message"); 
        });
    }
}

function speak(text) {
    var utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synthesis.speak(utterance);
}

function showNotification() {
    const chatContainer = document.querySelector(".chat-container");
    const notification = document.createElement("div");
    notification.textContent = "Microphone is on";
    notification.classList.add("notification");
    chatContainer.appendChild(notification);

   
    notification.offsetHeight; 
    notification.classList.add("show"); 
    setTimeout(() => {
        notification.classList.remove("show"); 
        setTimeout(() => {
            chatContainer.removeChild(notification);
        }, 500); 
    }, 3000); 
}

function startListening() {
    recognition.start();
    isListening = true;
    showNotification();
}


recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    appendMessage("You: " + transcript, "right-message");
    fetch("/send-message", {
        method: "POST",
        body: JSON.stringify({ message: transcript }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            appendMessage("Bot: " + data.response, "left-message");
            speak(data.response); 
        } else {
            appendMessage("Bot: I'm sorry, I didn't understand that.", "left-message");
            speak("I'm sorry, I didn't understand that.");
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
        appendMessage("Bot: Oops! Something went wrong.", "left-message"); 
    });
}

recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    isListening = false;
}

function appendMessage(message, side) {
    var chatBox = document.getElementById("chat-box");
    var newMessage = document.createElement("div");
    newMessage.textContent = message;
    newMessage.classList.add("message", side);
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleChat() {
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.style.display = chatContainer.style.display === "flex" ? "none" : "flex";
}
