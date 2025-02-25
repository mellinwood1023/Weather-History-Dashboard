import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, tempEl, precipitation, weatherIcon, dateTime, windEl, humidityEl, latitude, longitude) {
        this.city = city;
        this.tempEl = tempEl;
        this.precipitation = precipitation;
        this.weatherIcon = weatherIcon;
        this.dateTime = dateTime;
        this.windEl = windEl;
        this.humidityEl = humidityEl;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || "";
        this.apiKey = process.env.API_KEY || "";
        this.cityName = "";
    }
    // TODO: Define the baseURL, API key, and city name properties
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        return fetch(query)
            .then(response => response.json())
            .then(data => { return data; })
            .catch(error => console.log(error));
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        const { latitude, longitude } = locationData;
        return { latitude, longitude };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const url = this.buildGeocodeQuery();
        const locationDataArray = await this.fetchLocationData(url);
        if (!locationDataArray || locationDataArray.length === 0) {
            throw new Error("Location data not found.");
        }
        return this.destructureLocationData(locationDataArray[0]);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        let response = await fetch(this.buildWeatherQuery(coordinates));
        let data = await response.json();
        return {
            current: this.parseCurrentWeather(data),
            daily: this.parseDailyWeather(data),
            // hourly: this.parseHourlyWeather(data)
        };
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const currentTemp = response.main.temp;
        const currentWind = response.wind.speed;
        const precipitation = response.rain ? response.rain['1h'] : 0;
        const humidity = response.main.humidity;
        const icon = response.weather[0].icon;
        return new Weather(this.cityName, Math.round(currentTemp), precipitation ? `${Math.round(precipitation * 100) / 100} mm` : 'No Rain', icon, new Date(), Math.round(currentWind), Math.round(humidity), 0, 0);
    }
    // TODO: Complete buildForecastArray method 
    buildForecastArray(currentWeather, weatherData) {
        const forecasts = weatherData.list || [];
        return forecasts.map((entry) => new Weather(this.cityName, entry.tempEl, entry.rain ? entry.rain['3h'] : 'No Rain', entry.weather[0].icon, new Date(entry.dt * 1000), entry.wind.speed, entry.main.humidity, weatherData.city.coord.lat, weatherData.city.coord.lon));
    }
    parseDailyWeather(response) {
        if (!response || !response.list) {
            console.error("Invalid response data", response);
            return [];
        }
        return response.list?.map((entry) => ({
            dateTime: new Date(entry.dt * 1000),
            tempEl: entry.main.temp,
            precipitation: entry.rain ? entry.rain['3h'] : 0,
            weatherIcon: entry.weather[0].icon,
            windEl: entry.wind.speed,
            humidityEl: entry.main.humidity,
        })) || [];
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        try {
            this.cityName = city;
            const coordinates = await this.fetchAndDestructureLocationData();
            const weatherData = await this.fetchWeatherData(coordinates);
            const forecast = this.buildForecastArray(this.parseCurrentWeather(weatherData.current), weatherData.daily || []);
            return {
                city: this.cityName,
                current: weatherData.current,
                forecast: forecast,
            };
        }
        catch (error) {
            console.error("Error fetching weather data:", error);
            throw new Error("Could not retrieve weather data");
        }
    }
    static getWeatherData(city) {
        const weatherService = new WeatherService();
        return weatherService.getWeatherForCity(city);
    }
}
export default new WeatherService();
