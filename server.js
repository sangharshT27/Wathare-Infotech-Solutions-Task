const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/mydb.', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


const dataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true },
});

const Data = mongoose.model('Data', dataSchema);


app.get('/api/data', async (req, res) => {
  try {
    const { startTime, endTime, frequency } = req.query;
    const query = {};

    
    if (startTime && endTime) {
      query.timestamp = {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      };
    }


    if (frequency) {
      const frequencyMillis = getFrequencyMillis(frequency);
      query.timestamp.$lte = new Date();
      query.timestamp.$gte = new Date(Date.now() - frequencyMillis);
    }

    const data = await Data.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/summary', async (req, res) => {
  try {
    const data = await Data.find();
    const summary = {
      numOnes: 0,
      numZeros: 0,
      continuousOnesMax: 0,
      continuousZerosMax: 0,
    };

    let currentOnesCount = 0;
    let currentZerosCount = 0;

    for (const item of data) {
      if (item.value === 1) {
        summary.numOnes++;
        currentZerosCount = 0;
        currentOnesCount++;
        summary.continuousOnesMax = Math.max(summary.continuousOnesMax, currentOnesCount);
      } else if (item.value === 0) {
        summary.numZeros++;
        currentOnesCount = 0;
        currentZerosCount++;
        summary.continuousZerosMax = Math.max(summary.continuousZerosMax, currentZerosCount);
      } else {
        currentOnesCount = 0;
        currentZerosCount = 0;
      }
    }

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/temperature', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const apiKey = 'ac12823ea5bb5922c408d560a19f687f'; 

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const { name, main } = response.data;

    res.json({
      location: name,
      temperature: main.temp,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


function getFrequencyMillis(frequency) {
  const frequencies = {
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
  };
  return frequencies[frequency] || 0;
}


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});