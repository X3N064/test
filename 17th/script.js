// Function to send a message
function sendMessage() {
    var message = document.getElementById("message").value.trim();
    if (message !== "") {
        // Append message to chat history
        var chatHistoryElement = document.getElementById("chatHistory");
        chatHistoryElement.innerHTML += "<p><strong>You:</strong> " + message + "</p>";

        // Clear the input field
        document.getElementById("message").value = "";

        // Scroll to the bottom of chat history
        chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }
}