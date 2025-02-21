import dotenv from 'dotenv';
import { response } from 'express';
import { parse } from 'node:path';
import { json } from 'node:stream/consumers';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number, 
  longitude: number, 
}
// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  city: string; 
  tempEl: number; 
  precipitation: string;
  weatherIcon: string; 
  dateTime: Date; 
  windEl: number;
  humidityEl: number; 
  latitude: number;
  longitude: number;
  
  constructor(city: string, tempEl: number, precipitation: string, weatherIcon: string, dateTime: Date, windEl: number, humidityEl: number, latitude: number, longitude: number) {
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
  baseURL: string;
  apiKey: string; 
  cityName: string;
 
  constructor() { 
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
  }

  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method

  private async fetchLocationData(query: string) {
  return fetch(query)
 .then(response => response.json())
 .then(data => {return data})
 .catch(error => console.log(error));
}
// TODO: Create destructureLocationData method
private destructureLocationData(locationData: Coordinates): Coordinates {
    const { latitude, longitude } = locationData;
    return {latitude, longitude};
}
  // TODO: Create buildGeocodeQuery method
 private buildGeocodeQuery() {
  return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
 }
  // TODO: Create buildWeatherQuery method
private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/data/2.5/forecast?lat={lat}&lon={lon}&appid=${this.apiKey}`
}
  // TODO: Create fetchAndDestructureLocationData method
 private async fetchAndDestructureLocationData() {
  const url = this.buildGeocodeQuery();
  const locationData = await this.fetchLocationData(url);
  return this.destructureLocationData(locationData);
 }
  // TODO: Create fetchWeatherData method
private async fetchWeatherData(coordinates: Coordinates) {
  let weatherData = await fetch(this.buildWeatherQuery(coordinates))
  return weatherData.json(data)(
    current: this.parseCurrentWeather(data),
    daily: this.parseDailyWeather(data),
    // hourly: this.parseHourlyWeather(data)
  )
}
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const currentTemp = response.main.temp;
    const maxTemp = response.main.temp_max;
    const minTemp = response.main.temp_min;
    const feelsLike = response.main.feels_like;
    const currentWind = response.wind.speed;
    const precipitation = response.rain ? response.rain['1h'] : 0;
    const humidity = response.main.humidity;
    const icon = response.weather[0].icon;

    return {
      currentTemp: Math.round(currentTemp),
      highTemp: Math.round(maxTemp), 
      lowTemp: Math.round(minTemp), 
      feelsLike: Math.round(feelsLike),
      currentWind: Math.round(currentWind), 
      precipitation: Math.round(precipitation * 100) / 100, 
      humidity: Math.round(humidity),
      icon,
    }
  }
  // TODO: Complete buildForecastArray method
 private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecasts = weatherData[0].list;

    const forecastArray: Weather[] = forecasts.filter(
      
    )
 }
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string) {
  this.cityName = city;
  // use city for coordinates
  const coordinates = this.fetchAndDestructureLocationData();
  // recieve coordinates - get weather data using coordinates 
  // format weather data for front end 
  const forcast = this.buildForecastArray(this.parseCurrentWeather, weatherData);
  // return weather data
  private parseDailyWeather(response: any) {
    return response.list.map((entry: any) => {
      return {
        dateTime: new Date(entry.dt * 1000),
        tempEl: entry.main.temp,
        precipitation: entry.rain ? entry.rain['3h'] : 0,
        weatherIcon: entry.weather[0].icon,
        windEl: entry.wind.speed,
        humidityEl: entry.main.humidity,
      };
    });
  }

  private parseDailyWeatherData(daily: any, currentWeather: any) {
    return daily.time.map((time: any, index: any) => {
      return {
        timestamp: time * 1000,
        icon: daily.weatherIcon[index],
        maxTemp: Math.round(daily.tempEl_2m_max[index]),
      };
    });
  }
   }}

  // const parseHourlyWeather ({ hourly, currentWeather }) {

  // }



export default new WeatherService();
