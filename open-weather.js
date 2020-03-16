const key = require('./key');
const http = require('http-wrapper');
const WeatherUrl = 'api.openweathermap.org/data/2.5/weather';

module.exports = (city, country) => new Promise(resolve => {
    let search = city;
    if (!!country) {
        search += ',' + country;
    }
    http.get(`${WeatherUrl}?q=${search}&appid=${key}&units=imperial`).then(res => {
        let weatherobj = {};
        try {
            weatherobj = JSON.parse(res.content.toString());
        } catch (e) {
            return console.error(`could not parse the json return`);
        }
        if (!weatherobj.weather || !weatherobj.weather[0] || !weatherobj.weather[0].description) {
            return resolve({ error: 'city not found' });
        }
        resolve({
            city: weatherobj.name,
            country: weatherobj.sys.country,
            celsius: Math.round((weatherobj.main.temp - 32) / 1.8),
            fahrenheit: Math.round(weatherobj.main.temp),
            description: weatherobj.weather[0].description,
            wind: `${weatherobj.wind.speed} mph`,
        });
    });
});
