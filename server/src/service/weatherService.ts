import dotenv from 'dotenv';
import { response } from 'express';
import { parse } from 'node:path';
// import { json } from 'node:stream/consumers';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number; 
  lon: number; 
}
// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  city: string; 
  weather: object
  temp: number; 
  feels_like: number;
  weatherIcon: string; 
  dateTime: Date; 
  wind: number;
  humidity: number; 
  visibility: number;
  lat: number;
  lon: number;
  
  constructor(
    city: string, 
    weather: object,
    temp: number, 
    feels_like: number,
    weatherIcon: string, 
    dateTime: Date, 
    wind: number, 
    humidity: number, 
    visibility: number,
    lat: number, 
    lon: number) {
    this.city = city; 
    this.weather = weather;
    this.temp = temp;
    this.feels_like = feels_like;
    this.weatherIcon = weatherIcon; 
    this.dateTime = dateTime;
    this.wind = wind; 
    this.humidity = humidity;
    this.visibility = visibility;
    this.lat = lat; 
    this.lon = lon;
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
  const fetchLocation = await fetch(query)
 .then(response => response.json())
//  .then(data => {return data})
//  .catch(error => console.log(error));
  console.log("fetch location response: ", fetchLocation);
  return fetchLocation;
 
}
// TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
}
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery() {
    console.log("Inside build geocode query: ", this.cityName);
  return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
 }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
}
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const url = this.buildGeocodeQuery();
    const locationDataArray = await this.fetchLocationData(url);
    if (!locationDataArray || locationDataArray.length === 0) {
      throw new Error("Location data not found.");
    }
    return this.destructureLocationData(locationDataArray[0]); 

  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
  console.log(coordinates);
  let response = await fetch(this.buildWeatherQuery(coordinates))
  let data = await response.json();
  console.log(data);
  if (!data || !data.list) {
    throw new Error("Weather data not found.");
  }
  const currentWeather = this.parseCurrentWeather(data);
  const dailyWeather = this.parseDailyWeather(data);
  return {
    current: currentWeather,
    daily: dailyWeather,
  };
}
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const {list} = response;
    console.log("list: ", list);
    const { temp, speed, rain, humidity } = list[0].main;
    const currentTemp = temp;
    const currentWind = speed;
    const precipitation = rain ? rain['1h'] : 0;
    const icon = list[0].weather.icon;

    return new Weather(
      this.cityName,
      response.weather,
      currentTemp,
      response.main.feels_like,
      icon,
      new Date(response.dt * 1000),
      currentWind,
      humidity,
      response.visibility,
      response.coord.lat,
      response.coord.lon
    );
  }
   // TODO: Complete buildForecastArray method 
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    console.log(weatherData);
    const forecasts = weatherData.list || []; 
    return forecasts.map((entry: any) => new Weather(
        this.cityName,
        entry.weather,
        entry.main.temp,
        entry.main.feels_like,
        entry.weather[0].icon,
        new Date(entry.dt * 1000),
        entry.wind.speed,
        entry.main.humidity,
        entry.visibility,
        entry.coord.lat,
        entry.coord.lon
    ));
} 
  private parseDailyWeather(response: any) {
    if (!response || !response.list) {
      console.error("Invalid response data", response);
      return [];
    }
    return response.list?.map((entry: any) => ({
      dateTime: new Date(entry.dt * 1000),
      temp: entry.main.temp,
      feels_like: entry.main.feels_like,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon,
      weatherIcon: entry.weather[0].icon,
      wind: entry.wind.speed,
      humidity: entry.main.humidity,
    })) || [];


  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
   try { 
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates); 
    const forecast = this.buildForecastArray(weatherData.current,  weatherData.daily) || []
    ;

    return {
      city: this.cityName,
      current: weatherData.current,
      forecast: forecast,
    };
  } catch (error: unknown) {
    console.error("Error fetching weather data:", error);
    throw new Error("Could not retrieve weather data");
  }
}

  static getWeatherData(city: string) {
    const weatherService = new WeatherService();
    return weatherService.getWeatherForCity(city);
  }
}

export default new WeatherService();
