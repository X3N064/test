// app.js (Node.js server-side code)

const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const markdown = require('markdown-it')();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const OPENROUTER_API_KEY = "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";
const MODEL_NAME = "openchat/openchat-7b:free";
// mistralai/mistral-7b-instruct:free
// openchat/openchat-7b:free
// nousresearch/nous-capybara-7b:free
// huggingfaceh4/zephyr-7b-beta:free

app.use(express.static(path.join(__dirname, 'public')));

app.post('/summarize', async (req, res) => {
    try {
        const textInput = req.body.textInput;
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: MODEL_NAME,
                messages: [{ role: "user", content: `Make the ${textInput} to diary.` }]
            },
            {
                headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}` }
            }
        );

        const answer = response.data.choices[0].message.content;
        res.send(answer);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("An error occurred");
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
