document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const currentWeatherBtn = document.getElementById('currentWeatherBtn');
    const forecastBtn = document.getElementById('forecastBtn');
    const currentWeatherSection = document.getElementById('currentWeather');
    const forecastSection = document.getElementById('forecast');
    const loader = document.getElementById('loader');
    const errorContainer = document.getElementById('errorContainer');
    
    // Chart instance
    let temperatureChart = null;
    
    // Current view state
    let currentView = 'current'; // 'current' or 'forecast'
    let lastCity = '';
    
    // Event Listeners
    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    currentWeatherBtn.addEventListener('click', () => {
        switchView('current');
    });
    
    forecastBtn.addEventListener('click', () => {
        switchView('forecast');
    });
    
    // Function to handle search
    function handleSearch() {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name');
            return;
        }
        
        lastCity = city;
        fetchWeatherData(city, currentView);
    }
    
    // Function to switch between current and forecast views
    function switchView(view) {
        currentView = view;
        
        if (view === 'current') {
            currentWeatherBtn.classList.add('active');
            forecastBtn.classList.remove('active');
            currentWeatherSection.classList.remove('hidden');
            forecastSection.classList.add('hidden');
        } else {
            currentWeatherBtn.classList.remove('active');
            forecastBtn.classList.add('active');
            currentWeatherSection.classList.add('hidden');
            forecastSection.classList.remove('hidden');
        }
        
        if (lastCity) {
            fetchWeatherData(lastCity, view);
        }
    }
    
    // Function to fetch weather data from the servlet
    async function fetchWeatherData(city, type) {
        showLoader();
        hideError();
        
        try {
            const response = await fetch(`weather?city=${encodeURIComponent(city)}&type=${type}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server returned ${response.status}`);
            }
            
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error("Erreur de parsing JSON :", parseError, "Texte reçu :", text);
                throw new Error("Invalid JSON response from server.");
            }

            if (type === 'current') {
                displayCurrentWeather(data);
            } else {
                displayForecast(data);
            }
        } catch (error) {
            showError(error.message || 'Network error. Please try again later.');
            console.error('Error:', error);
        } finally {
            hideLoader();
        }
    }
    
    // Function to display current weather
    function displayCurrentWeather(data) {
        if (!data || !data.city) {
            showError('Invalid data received from server');
            return;
        }
    
        try {
            // Update city name and date
            document.getElementById('cityName').textContent = data.city;
            const currentDate = new Date();
            document.getElementById('currentDate').textContent = formatDate(currentDate);
    
            // Update weather icon
            const iconCode = data.icon || '01d';
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.getElementById('weatherIcon').alt = data.description || 'Weather Icon';
    
            // Update temperature and description
            document.getElementById('temperature').textContent = Math.round(data.temperature || 0);
            document.getElementById('weatherDescription').textContent = data.description || 'Unknown';
    
            // Update weather details
            document.getElementById('feelsLike').textContent = data.feelsLike !== undefined ? `${Math.round(data.feelsLike)}°C` : 'N/A';
            document.getElementById('humidity').textContent = data.humidity !== undefined ? `${data.humidity}%` : 'N/A';
    
            // Precipitation from backend
            const precipitation = data.precipitation !== undefined
                ? `${data.precipitation.toFixed(1)} mm`
                : '0 mm';
            document.getElementById('precipitation').textContent = precipitation;
    
            // Wind
            document.getElementById('wind').textContent = data.wind !== undefined ? `${data.wind} m/s` : 'N/A';
    
            // UV Index
            document.getElementById('uvIndex').textContent = 
                data.uvIndex !== undefined && data.uvIndex !== null 
                    ? data.uvIndex 
                    : 'N/A';
        } catch (error) {
            console.error('Error displaying current weather:', error);
            showError('Error displaying weather data');
        }
    }    
    
    // Function to display forecast
    function displayForecast(data) {
        try {
            const cityName = data.city || 'Unknown city';
            document.getElementById('forecastCityName').textContent = cityName;
    
            const forecastArray = data.forecast || [];
    
            // Clear previous forecast cards
            const forecastContainer = document.getElementById('forecastContainer');
            forecastContainer.innerHTML = '';
    
            const dates = [];
            const maxTemps = [];
            const minTemps = [];
    
            forecastArray.forEach(day => {
                const date = new Date(day.date * 1000);
                const max = Math.round(day.max);
                const min = Math.round(day.min);
    
                dates.push(formatDate(date, true));
                maxTemps.push(max);
                minTemps.push(min);
    
                const card = createForecastCard(day, date);
                forecastContainer.appendChild(card);
            });
    
            updateTemperatureChart(dates, maxTemps, minTemps);
        } catch (error) {
            console.error('Error displaying forecast:', error);
            showError('Error displaying forecast data');
        }
    }    
    
    // Function to create a forecast card
    function createForecastCard(day, date) {
        const card = document.createElement('div');
        card.className = 'forecast-card';
    
        try {
            const weatherIcon = day.icon || '01d';
            const description = day.description || 'Unknown';
            const temp = `${Math.round((day.min + day.max) / 2)}°C`;
    
            card.innerHTML = `
                <div class="forecast-date">${formatDate(date, true)}</div>
                <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${description}">
                <div class="forecast-temp">${temp}</div>
                <div class="forecast-description">${description}</div>
            `;
        } catch (error) {
            console.error('Error creating forecast card:', error);
            card.innerHTML = `<div class="forecast-date">${formatDate(date, true)}</div><p>Data unavailable</p>`;
        }
    
        return card;
    }    
    
    // Function to update the temperature chart
    function updateTemperatureChart(dates, maxTemps, minTemps) {
        try {
            const ctx = document.getElementById('temperatureChart').getContext('2d');
            
            // Destroy previous chart if it exists
            if (temperatureChart) {
                temperatureChart.destroy();
            }
            
            // Create new chart
            temperatureChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Max Temperature (°C)',
                            data: maxTemps,
                            borderColor: '#ff6b6b',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            borderWidth: 2,
                            pointBackgroundColor: '#ff6b6b',
                            pointRadius: 4,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Min Temperature (°C)',
                            data: minTemps,
                            borderColor: '#4a6cf7',
                            backgroundColor: 'rgba(74, 108, 247, 0.1)',
                            borderWidth: 2,
                            pointBackgroundColor: '#4a6cf7',
                            pointRadius: 4,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Temperature Forecast',
                            font: {
                                size: 16
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '°C';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error updating temperature chart:', error);
        }
    }
    
    // Helper function to format date
    function formatDate(date, short = false) {
        try {
            const options = short 
                ? { weekday: 'short', month: 'short', day: 'numeric' } 
                : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date unavailable';
        }
    }
    
    // Functions to show/hide loader
    function showLoader() {
        loader.classList.remove('hidden');
    }
    
    function hideLoader() {
        loader.classList.add('hidden');
    }
    
    // Functions to show/hide error
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }
    
    function hideError() {
        errorContainer.classList.add('hidden');
    }
});