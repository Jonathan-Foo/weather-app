const currentTempUnit = 'metric'

async function fetchWeatherData(city, tempUnit) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=394707f9c9c30dc2b46546dd5405e9a6&units=${tempUnit}`,
            { mode: 'cors' }
        );
        const weatherData = await response.json();
        const lon = weatherData.coord.lon
        const lat = weatherData.coord.lat 
        const oneCallFetch = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${tempUnit}&appid=394707f9c9c30dc2b46546dd5405e9a6`,
            { mode: 'cors' }
        );
        const oneCallData = await oneCallFetch.json()
        console.log(weatherData);
        console.log(oneCallData);
    } catch(err) {
        console.log(err)
    }
}

fetchWeatherData('Tokyo', currentTempUnit);


function changeUnits() {
    return currentTempUnit === 'metric' ? currentTempUnit = 'imperial' :  currentTempUnit = 'metric';
}



function getLocalTime(offset) {
    const timeNow = new Date()
    const localTime = timeNow.getTime()
    const localOffset = timeNow.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const newTime = utc + (1000 * offset)
    const destinationLocalTime = new Date(newTime)
    console.log(destinationLocalTime)
}



function epochToDate(epoch, offset) {
    const epochTime = new Date(epoch * 1000)
    const localTime = epochTime.getTime()
    const localOffset = epochTime.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const newTime = utc + (1000 * offset)
    const destinationLocalTime = new Date(newTime)
    console.log(destinationLocalTime)
}

