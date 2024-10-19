import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';
import useCurrentLocationWeather from './useCurrentLocationWeather';

const WeatherWidget = () => {
  const [inputValue, setInputValue] = useState('Hyderabad');
  const [city, setCity] = useState('Hyderabad');
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const apiKey = '6607c0ea8322559a0e04e384902344c7';

  const { currentWeather, loading: currentLocationLoading, error: currentLocationError } = useCurrentLocationWeather(apiKey);

  useEffect(() => {
    const fetchWeather = async () => {
      if (city) {
        try {
          setWeather(null);
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
          const data = await response.json();
          setWeather(data);
        } catch (error) {
          console.error(error.message);
        }
      }
    };

    fetchWeather();
  }, [city, apiKey]);

  const fetchCitySuggestions = async (query) => {
    if (query.length > 2) { // Fetch suggestions if the input is longer than 2 characters
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchCitySuggestions(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(inputValue);
    setSuggestions([]); // Clear suggestions after search
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.name);
    setCity(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="weather-container">
      <div className="weather-box">
        <h1 className="weather-app-title">Weather App</h1>

        <div className="search-container">
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter city"
              className="city-input"
              style={{ paddingRight: '30px' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <img
                src="https://img.icons8.com/ios-filled/24/000000/search--v1.png"
                alt="Search icon"
                style={{ marginLeft: '10px', pointerEvents: 'none' }}
              />
            </button>
          </form>
          {/* City Suggestions */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.name}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="weather-display-container">
          <div className="weather-container-box">
            {currentLocationLoading && <div>Loading current location weather...</div>}
            {currentLocationError && <div>{currentLocationError}</div>}
            {currentWeather && (
              <div className="current-weather-container">
                <h2>Current Location: {currentWeather.name}</h2>
                <p className="temperature">Temperature: {Math.round(currentWeather.main.temp)}&#8451;</p>
                <p>Weather Description: {currentWeather.weather[0].description}</p>
              </div>
            )}
          </div>

          <div className="weather-container-box">
            {weather && (
              <div className="searched-weather-container">
                <h2 className="city-name">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/map-marker.png" alt="Map icon" />
                  {weather.name}
                </h2>
                <p className="temperature">Temperature: {Math.round(weather.main.temp)}&#8451;</p>
                <p className="weather-description">Weather Description: {weather.weather[0].description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
