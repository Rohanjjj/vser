import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);

  useEffect(() => {
    fetchData();
    loadVoices();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://server-webk.onrender.com');
      const result = await response.json();
      setData(result.gesture || 'No data available');
    } catch (error) {
      console.error('Error fetching data:', error);
      setData('Failed to fetch data.');
    }
  };

  const loadVoices = () => {
    const voicesList = window.speechSynthesis.getVoices();
    setVoices(voicesList);
    if (voicesList.length) setSelectedVoice(voicesList[0].name);
  };

  const speakData = () => {
    const speech = new SpeechSynthesisUtterance(data);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) speech.voice = voice;
    speech.rate = rate;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Text-to-Speech Converter</h1>
      <p className="mb-4">Received Data: <strong>{data}</strong></p>
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Fetch Data
      </button>
      <br />

      <label className="block mb-2">Voice:</label>
      <select
        onChange={(e) => setSelectedVoice(e.target.value)}
        value={selectedVoice}
        className="border p-2 mb-4"
      >
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>{voice.name} ({voice.lang})</option>
        ))}
      </select>

      <label className="block mb-2">Speed:</label>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="mb-4"
      />
      <span>{rate.toFixed(1)}x</span>

      <br />
      <button
        onClick={speakData}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Speak
      </button>
      <button
        onClick={() => window.speechSynthesis.cancel()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Stop
      </button>
    </div>
  );
};

export default App;
