const searchTab = document.querySelector('.tab1');
const mainTab = document.querySelector('.tab2');
const searchBtn = document.querySelector('.search-icon');
const searchInput = document.querySelector('#search-input');
const backBtn = document.querySelector('.back-icon');
const dropDownBlock = document.getElementById('dropdown');
const nameBlock = document.querySelector('.country-name')
const timeBlock = document.querySelector('.time-wrapper');
const infoBlock = document.querySelector('.info-title');
const highTempBlock = document.querySelector('#hightemp__wrapper')
const lowTempBlock = document.querySelector('#lowtemp__wrapper')
const pressureBlock = document.querySelector('#pressure__wrapper');
const humidBlock = document.querySelector('#humid__wrapper');
const visibBlock = document.querySelector('#visib__wrapper');
const sunriseBlock = document.querySelector('#sunrise__wrapper');
const sunsetBlock = document.querySelector('#sunset__wrapper');
const windirectBlock = document.querySelector('#windirect__wrapper');
const windSpeedBlock = document.querySelector('#windspeed__wrapper');
const cloudBlock = document.querySelector('#cloudiness__wrapper');


function start() {
    getTime(handleAndRenderTime);
}

start();

function getWeather(callback, countryName) {
    const encodedCountryName = encodeURIComponent(countryName) ; // Xử lý URL encoding
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCountryName}&APPID=dfb3d21a79ee175beca80052e75173c3`;
    fetch(weatherAPI)
        .then(function(response) {
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error fetching weather data:', error));
}

function getTime(callback) {
    const timeAPI = 'https://api.timezonedb.com/v2.1/list-time-zone?key=UUT5F9KU3HRT&format=json';
    fetch(timeAPI)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function handleWeather(weatherData) {
    // Chuyển đổi dữ liệu thời tiết
    const countryName = weatherData.name;
    const weatherDesc = weatherData.weather;
    const description = weatherDesc[0].description
    const mainWeather = weatherData.main;
    const windData = weatherData.wind;
    const sunData = weatherData.sysx
    const temperature = (mainWeather.temp - 273.15).toFixed();
    const feelsLike = (mainWeather.feels_like - 273.15).toFixed();
    const maxTemp = (mainWeather.temp_max - 273.15).toFixed();
    const minTemp = (mainWeather.temp_min - 273.15).toFixed();
    const pressure = (mainWeather.pressure);
    const humidity = (mainWeather.humidity);
    const visibility = weatherData.visibility / 1000;
    const windDirect = windData.deg;
    const windSpeed = windData.speed;
    const cloudiness = weatherData.clouds.all
    const sunrise = new Date(weatherData.sys.sunrise * 1000);
    const sunset = new Date(weatherData.sys.sunset * 1000);

    const timeZone = weatherData.timezone / 3600; // Múi giờ tính bằng giây -> giờ
    const timeZoneName = `GMT${timeZone >= 0 ? '+' : ''}${timeZone.toFixed()}`;
    const timeZoneOffset = weatherData.timezone; // Offset in seconds
    // Format thời gian
    const formattedSunrise = new Intl.DateTimeFormat("en-GB", {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
    }).format(new Date(sunrise.getTime() + timeZoneOffset * 1000));
    
    const formattedSunset = new Intl.DateTimeFormat("en-GB", {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
    }).format(new Date(sunset.getTime() + timeZoneOffset * 1000));


    nameBlock.innerText = countryName;
    infoBlock.innerHTML = `
        <h2 class="weather-temp">${temperature}&deg;C</h2>
        <h2>${description}</h2>
        <h2>Feel likes ${feelsLike}&deg;C</h2>
    `
    highTempBlock.innerHTML = `
        <h4>Highest Temperature</h4>
        <h2 class="degree">${maxTemp}&deg;C</h2>
    `
    lowTempBlock.innerHTML = `
        <h4>Lowest Temperature</h4>
        <h2 class="degree">${minTemp}&deg;C</h2>
    `
    pressureBlock.innerHTML = `
        <h4>Pressure</h4>
        <h2 class="item-stats">${pressure} PhA</h2>
    `
    humidBlock.innerHTML = `
        <h4>Humidity</h4>
        <h2 class="item-stats">${humidity}%</h2>
    `
    visibBlock.innerHTML = `
        <h4>Visibility</h4>
        <h2 class="item-stats">${visibility}km</h2>
    `
    sunriseBlock.innerHTML = `
        <h4>Sunrise</h4>
        <h2 class="item-stats">${formattedSunrise}</h2>
    `
    sunsetBlock.innerHTML = `
        <h4>Sunset</h4>
        <h2 class="item-stats">${formattedSunset}</h2>
    `
    windirectBlock.innerHTML = `
        <h4>Wind Direction</h4>
        <h2 class="item-stats">${windDirect}&deg;</h2>
    `
    windSpeedBlock.innerHTML = `
        <h4>Wind Speed</h4>
        <h2 class="item-stats">${windSpeed}m/s</h2>
    `
    cloudBlock.innerHTML = `
        <h4>Cloudiness</h4>
        <h2 class="item-stats">${cloudiness}%</h2>
    `
}

function handleAndRenderTime(timeData) {
    const countries = timeData.zones;
    const formattedCountries = countries.map((country) => {
        const localTime = new Date(country.timestamp * 1000);
        return {
            ...country,
            localTime: new Intl.DateTimeFormat("en-GB", {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: country.timezone || "UTC"
            }).format(localTime)
        };
    });

    
    // Lọc và hiển thị dropdown
    const uniqueCountries = [...new Set(
        formattedCountries.map(country => country.countryName)
    )].sort();


    dropDownBlock.innerHTML = uniqueCountries
        .map(country => `<h1 class="dropdown-options" data-country="${country}">${country}</h1>`)
        .join('');

    dropDownBlock.onclick = function(event) {
        if (event.target.tagName === 'H1') {
            const selectedCountry = event.target.dataset.country;
            const selectedTime = formattedCountries.find(country => country.countryName === selectedCountry).localTime;
            
            timeBlock.innerHTML = `<h2>${selectedTime}</h2>`;
            getWeather(handleWeather, selectedCountry);
            
            searchTab.style.display = 'none';
            mainTab.style.display = 'flex';
        } 
    }

    searchInput.oninput = function(event) {
        let searchValue = event.target.value;
        const filteredCountries = uniqueCountries.filter(country => country.toLowerCase().includes(searchValue.toLowerCase()));
        dropDownBlock.innerHTML = filteredCountries
            .map(country => `<h1 class="dropdown-options" data-country="${country}">${country}</h1>`)
            .join('');
    }
}









// UI interacting
searchBtn.onclick = function() {
    searchTab.style.display = 'none';
    mainTab.style.display = 'flex';
}

backBtn.onclick = function() {
    mainTab.style.display = 'none';
    searchTab.style.display = 'flex';
}