const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Dynamic Gesture Mapping Function
function mapToGesture(flex1, flex2, flex3, flex4) {
    const gestures = [
        { name: 'Hello', conditions: [flex1 > 840, flex2 > 810, flex3 > 870, flex4 > 815] },
        { name: 'Yes', conditions: [flex1 < 810, flex2 < 800, flex3 > 850, flex4 < 800] },
        { name: 'No', conditions: [flex1 < 810, flex2 < 770, flex3 < 850, flex4 < 770] },
        { name: 'Stop', conditions: [flex1 > 850, flex2 < 820, flex3 > 870, flex4 < 800] },
        { name: 'Thank You', conditions: [flex1 < 800, flex2 < 770, flex3 < 850, flex4 < 770] }
    ];

    for (const gesture of gestures) {
        if (gesture.conditions.every(Boolean)) {
            return gesture.name;
        }
    }
    return 'I am Rohan';
}

// API Endpoint for Prediction
app.post('/predict', async (req, res) => {
    try {
        const { flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz } = req.body;

        // Input Validation
        if ([flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz].some(value => value === undefined)) {
            return res.status(400).json({ error: 'Missing or invalid sensor data' });
        }

        // Map to Gesture
        const gesture = mapToGesture(flex1, flex2, flex3, flex4);

        // Forward result to external website
        const externalURL = req.query.url || 'http://example.com/result';
        await axios.post(externalURL, { gesture, ax, ay, az, gx, gy, gz });
        console.log(`Gesture and sensor data sent to external site: ${gesture}`);

        res.json({ gesture });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
