// useCurrentLocationWeather.js
import { useState, useEffect } from 'react';

const useCurrentLocationWeather = (apiKey) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentLocationWeather = async (latitude, longitude) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setCurrentWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Get current location using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCurrentLocationWeather(latitude, longitude);
        },
        (err) => {
          setError('Geolocation not supported or denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported by this browser');
      setLoading(false);
    }
  }, [apiKey]);

  return { currentWeather, loading, error };
};

export default useCurrentLocationWeather;
