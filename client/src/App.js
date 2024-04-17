import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/data');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchSummary = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/summary');
        setSummary(result.data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    const fetchTemperature = async () => {
      try {
        const latitude = 18.5850142; 
        const longitude = 73.742601; 
        const result = await axios.get(`http://localhost:3000/api/temperature?latitude=${latitude}&longitude=${longitude}`);
        setTemperature(result.data);
      } catch (error) {
        console.error('Error fetching temperature:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchSummary();
    fetchTemperature();
  }, []);

  return (
    <div>
      <h1>Wathare Task</h1>
      
      
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map(item => (
            <div key={item._id} style={{ display: 'inline-block', marginRight: '10px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  backgroundColor: item.value === 1 ? 'green' : item.value === 0 ? 'yellow' : 'red',
                  borderRadius: '50%',
                }}
              />
              <span>{item.timestamp.toLocaleString()}</span>
            </div>
          ))
        )}
      </div>

      
      {summary && (
        <div>
          <h2>Summary</h2>
          <p>Number of Ones: {summary.numOnes}</p>
          <p>Number of Zeros: {summary.numZeros}</p>
          <p>Maximum Continuous Ones: {summary.continuousOnesMax}</p>
          <p>Maximum Continuous Zeros: {summary.continuousZerosMax}</p>
        </div>
      )}

    
      {temperature && (
        <div>
          <h2>Temperature</h2>
          <p>Location: {temperature.location}</p>
          <p>Temperature: {temperature.temperature}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;
