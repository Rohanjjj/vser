const express = require('express');
const bodyParser = require('body-parser');
const say = require('say');

const app = express();
const PORT = 3000;

let latestText = "Waiting for text...";

app.use(bodyParser.json());

// Serve the display page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TTS Display</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding-top: 100px;
          background-color: #f4f4f4;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        #text {
          font-size: 2em;
          color: #333;
          padding: 20px;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <h1>Latest Spoken Text</h1>
      <div id="text">Loading...</div>

      <script>
        async function fetchText() {
          const res = await fetch('/latest-text');
          const data = await res.json();
          document.getElementById('text').innerText = data.text;
        }
        setInterval(fetchText, 1000);
        fetchText();
      </script>
    </body>
    </html>
  `);
});

// Get latest spoken text
app.get('/latest-text', (req, res) => {
  res.json({ text: latestText });
});

// Speak the text
app.post('/speak', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  latestText = text;
  console.log('Speaking:', text);

  say.speak(text, null, 1.0, (err) => {
    if (err) {
      console.error('TTS Error:', err);
      return res.status(500).json({ error: 'Failed to speak text' });
    }
    res.json({ status: 'spoken', text });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
