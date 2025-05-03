const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle form submissions
app.post('/send-message', async (req, res) => {
  const { emailValue, nameValue, messageValue, dateValue, songValue } = req.body.message;
  if (!emailValue|| !nameValue) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_API_KEY}/sendMessage`;

  const payload = {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: `New message from ${nameValue} (${emailValue}) via DanceFirstThinkLater: ${messageValue}, Date of the event: ${dateValue}, Wedding song: ${songValue}`,
  };

  try {
    await axios.post(telegramApiUrl, payload);
    res.status(200).json({ success: true, message: 'Message sent to Telegram bot' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
