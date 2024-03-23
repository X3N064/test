// script.js (Frontend JavaScript code)

document.getElementById("textInputForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const textInput = document.getElementById("textInput").value;
    const response = await fetch("/summarize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ textInput })
    });
    const data = await response.text();
    document.getElementById("summaryResult").textContent = data;
});
