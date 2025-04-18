const apiKey = 'e3a9fd3cd6e79500fe34f31e37a886ef'; // OpenWeatherMap API key
const searchBox = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');
const weatherIcon = document.querySelector('.weather-icon img');
const weatherInfo = document.querySelector('.weather-info');

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Insert error message after search box
    const searchContainer = document.querySelector('.search-box');
    searchContainer.insertAdjacentElement('afterend', errorDiv);
    
    // Hide weather info if it's visible
    weatherInfo.classList.remove('active');
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

async function checkWeather(city) {
    try {
        // Show loading state
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchBtn.disabled = true;
        
        // Encode the city name to handle spaces and special characters
        const encodedCity = encodeURIComponent(city.trim());
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'City not found');
        }

        // Update DOM elements
        document.querySelector('#city-name').innerHTML = data.name;
        document.querySelector('#temp').innerHTML = `${Math.round(data.main.temp)}°C`;
        document.querySelector('#humidity').innerHTML = `${data.main.humidity}%`;
        document.querySelector('#wind').innerHTML = `${data.wind.speed} km/h`;
        document.querySelector('#weather-description').innerHTML = data.weather[0].description;
        
        // Update weather icon
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        // Update date
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.querySelector('#date').innerHTML = date.toLocaleDateString('en-US', options);
        
        // Show weather info
        weatherInfo.classList.add('active');
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        if (error.message.includes('not found')) {
            showError('City not found. Please check the spelling and try again.');
        } else if (error.message.includes('unauthorized')) {
            showError('API key error. Please check your API configuration.');
        } else {
            showError('Unable to fetch weather data. Please try again later.');
        }
    } finally {
        // Reset search button
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.disabled = false;
    }
}

// Clear the search box when clicking into it
searchBox.addEventListener('focus', () => {
    searchBox.value = '';
});

searchBtn.addEventListener('click', () => {
    const city = searchBox.value.trim();
    if (city !== '') {
        checkWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchBox.value.trim();
        if (city !== '') {
            checkWeather(city);
        } else {
            showError('Please enter a city name');
        }
    }
}); 