// src/App.js
import React from 'react';
import './App.css';
import WeatherWidget from './Components/wheather'; // Import the WeatherWidget component
import Header from './Components/Header';
function App() {
  return (
    <div className="App">
      
      <WeatherWidget /> {/* Include the WeatherWidget component */}
      
    </div>
  );
}

export default App;