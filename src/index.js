import { format } from 'date-fns';


// API CALL FUNCTIONS 

let currentTempUnit = 'metric';
let currentUnit = '°C';
let currentLocation = 'Melbourne, AU';


async function fetchWeatherData(city, tempUnit) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=394707f9c9c30dc2b46546dd5405e9a6&units=${tempUnit}`,
        { mode: 'cors' }
    );
    const weatherData = await response.json();

    if (response.status !== 200) {
        console.log('Error')
        return;
    } else {
        return weatherData;
    }
 
}

async function fetchOneCallData(weatherData, tempUnit) {
    const lon = weatherData.coord.lon
    const lat = weatherData.coord.lat 
    const oneCallFetch = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${tempUnit}&appid=394707f9c9c30dc2b46546dd5405e9a6`,
        { mode: 'cors' }
    );
    const oneCallData = await oneCallFetch.json()
    console.log(oneCallData);
} 

// Validate Search Input

(function validateSearch() {
    const searchBar = document.getElementById('searchbar');
    const searchIcon = document.getElementById('searchIcon');
    searchIcon.addEventListener('click', () => {
        return searchBar.validity.valid ? locationSearch(searchBar.value) : searchBar.reportValiidity(); 
    } )
})();

// Change temp unit

(function switchTemp() {
    const unitToggle = document.getElementById('unit-check');
    unitToggle.addEventListener('click', () => {
        changeUnits();    
    });
})();


function changeUnits() {
    if (currentTempUnit === 'metric') {
        currentTempUnit = 'imperial';
        return currentUnit = '°F';
    } else {
        currentTempUnit = 'metric';
        return currentUnit = '°C'
        
    }
}

// Set new location for use when changing temp units 

function setCurrentLocation(newLocation) {
    return currentLocation = newLocation;
}


function getLocalTime(offset) {
    const timeNow = new Date();
    const localTime = timeNow.getTime();
    const localOffset = timeNow.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const newTime = utc + (1000 * offset);
    const destinationLocalTime = new Date(newTime)
    return format(destinationLocalTime, 'EEEE, do LLL yyyy p');
    // console.log(destinationLocalTime)
}



function epochToDate(epoch, offset) {
    const epochTime = new Date(epoch * 1000)
    const localTime = epochTime.getTime()
    const localOffset = epochTime.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const newTime = utc + (1000 * offset)
    const destinationLocalTime = new Date(newTime)
    return format(destinationLocalTime, 'EEEE')
    // console.log(destinationLocalTime)
}


// Extract data 

let extWeatherData = []

function extractWeatherData(obj) {
    extWeatherData.push(`${Math.round(weatherData.main.temp_max)} ${currentUnit}`);
    extWeatherData.push(`${Math.round(weatherData.main.temp_min)} ${currentUnit}`);
    extWeatherData.push(`${obj.name }, ${obj.sys.country}`);
    extWeatherData.push( getLocalTime(obj.timezone) );
    extWeatherData.push( `${Math.round(obj.main.temp)} ${currentUnit}` );
    extWeatherData.push( weatherData.weather[0].description );
    extWeatherData.push( `${Math.round(weatherData.main.feels_like)} ${currentUnit}`);
    extWeatherData.push( `${weatherData.main.humidity} %`);
    extWeatherData.push( `${(weatherData.wind.speed * 3.6).toFixed(1)} km/h`);
    extWeatherData.push( `${weatherData.weather[0].icon}`);
    return extWeatherData
}

let extOneCallData = {}

function extractOneCallData(obj) {
    if (obj.daily[0].pop > 0 ) { 
        extOneCallData.rain = Math.round(obj.daily[0].pop); 
    } else { 
        extOneCallData.rain = obj.daily[0].pop.toFixed(2);
    } 

    const next7Day = obj.daily.slice(1);
    const timeOffset = obj.timezone_offset;
    const dayInfoArr = [];
    
    next7Day.forEach(
        day => dayInfoArr.push(dayInfoObjFactory(epochToDate(day.dt, timeOffset), day.temp.max, day.temp.min, day.weather[0].icon))
    );

    extOneCallData.days = dayInfoArr;

    return extOneCallData;
}

function dayInfoObjFactory(day, maxTemp, minTemp, icon) {
    return {day, maxTemp, minTemp, icon};
}



// DOM Manipulation 


function fillMidSectionContent() {
    const midContent = [...document.querySelectorAll('.mid-content')];
    midContent.forEach((output, index) => output.textContent = extWeatherData[index]);
    
    const mainIcon = document.querySelector('.main-icon > img');
    mainIcon.src = `animated/${extWeatherData[9]}.svg`;

    const rain = document.querySelector('.rain-info');
    rain.textContent = `${extOneCallData.rain} %` 
}


function fillForecastContent() {
    const cards = [...document.querySelectorAll('.card')];
    const cardsContentArr = cards.map(day => [...day.children]);

    cardsContentArr.forEach((group, index) => {
        group[0].textContent = extOneCallData.days[index].day;
        group[1].textContent = `${extOneCallData.days[index].maxTemp} ${currentUnit}`;
        group[2].textContent = `${extOneCallData.days[index].minTemp} ${currentUnit}`;
        group[3].src = `animated/${extOneCallData.days[index].minTemp}.svg`;
    })    
}



// COMPLETE FUNCTION


async function locationSearch(input) {
    setCurrentLocation(input);
    const weatherData = await fetchWeatherData(currentLocation, currentTempUnit);
    const oneCallData = await fetchOneCallData(weatherData, currentTempUnit);
    
    // fillForecaseContent();
    // fillLeftSectionContent();
}