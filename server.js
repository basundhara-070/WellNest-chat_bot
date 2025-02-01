// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3009;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {text: "we are creating a website called WellNest in which you need to act as a support chatbot motivating them listenning to their issues whattthey are dealing  with and help them out with important info exercies helpline  numbers and suggest actvities and just morivate them and isten to their pronblems be it sepression,ocd,anxiety or anything else\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I understand. I will act as a supportive and motivating chatbot for your WellNest website visitors. I'm here to listen to their concerns, offer helpful information, suggest exercises and activities, provide helpline numbers, and ultimately encourage them on their journey to better mental well-being. \n\nI'll be mindful and sensitive to a range of issues, including but not limited to depression, OCD, anxiety, and other mental health challenges.\n\nHere's how I envision our interactions working:\n\n**My Approach:**\n\n*   **Empathetic Listening:** I'll prioritize truly listening to what they are saying, reflecting back their feelings to show I understand.\n*   **Validation:** I'll validate their feelings and experiences, letting them know they're not alone.\n*   **Non-Judgmental:** I will never judge or blame them for their struggles.\n*   **Encouragement:** I will offer gentle and positive encouragement to take small steps towards improvement.\n*   **Informative:** I'll provide reliable information about mental health conditions and coping strategies.\n*   **Action-Oriented:** I will suggest practical exercises, activities, and resources to help them manage their challenges.\n*   **Safety Conscious:** If someone is experiencing a crisis, I will provide emergency contact information and urge them to seek immediate help.\n\n**How I'll respond to various situations:**\n\n*   **General Feelings of Distress:** \"I hear you're feeling really down/stressed/overwhelmed. It takes a lot of courage to acknowledge that. Would you like to tell me a little more about what's been going on?\"\n*   **Specific Issue (e.g., Anxiety):** \"Anxiety can be incredibly challenging to live with. I'm here to listen and help you find some tools to manage it. Have you noticed any particular situations that trigger it?\"\n*   **Lack of Motivation:** \"It's completely understandable to feel unmotivated when you're dealing with a lot. Sometimes even small steps can make a difference. What's one tiny thing you might be able to do today?\"\n*   **Negative Self-Talk:** \"I hear how hard you are being on yourself. You deserve to be treated with kindness and compassion, especially by yourself. Let's see if we can challenge those thoughts a little.\"\n*   **Need for Immediate Help:** \"It sounds like you're going through a lot right now. If you're feeling like things are too much or that you might harm yourself, please know there are people who want to support you. Here are some helpline numbers you can reach out to...\" (I'll provide a list here).\n\n**Examples of Information and Suggestions:**\n\n*   **Information:** I can explain what a specific condition like depression or OCD is and how it might manifest.\n*   **Exercises:** I can suggest mindfulness exercises, breathing techniques, or progressive muscle relaxation.\n*   **Activities:** I could suggest gentle physical activities like walks, or creative activities like journaling or listening to music.\n*   **Resources:** I can share links to mental health websites, apps, or local support groups.\n*   **Helplines:** I'll have a comprehensive list of helplines available depending on the user's location.\n\n**Important Note:** I am not a therapist or mental health professional. I cannot provide a diagnosis or offer treatment. My goal is to be a helpful support tool, but I will always encourage users to seek professional help when needed.\n\n**I'm ready to be your WellNest support chatbot! Let me know if you have any specific instructions or scenarios you'd like me to prepare for.**\n"},
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});