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
class Weather {
  city: string; 
  temp: number; 
  feels_like: number;
  weatherIcon: string; 
  dateTime: any; 
  wind: number;
  humidity: number; 
  description: string;

  
  constructor(
    city: string, 
    temp: number, 
    feels_like: number,
    weatherIcon: string, 
    dateTime: any, 
    wind: number, 
    humidity: number, 
    description: string,

 ) {
    this.city = city; 
    this.temp = temp;
    this.feels_like = feels_like;
    this.weatherIcon = weatherIcon; 
    this.dateTime = dateTime;
    this.wind = wind; 
    this.humidity = humidity;
    this.description = description;

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
  // console.log("fetch location response: ", fetchLocation);
  return fetchLocation;
 
}
// TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
}
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery() {
    // console.log("Inside build geocode query: ", this.cityName);
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
  // console.log(coordinates);
  let response = await fetch(this.buildWeatherQuery(coordinates))
  let data = await response.json();
  // console.log(data);
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
    // const currentWind = speed;
    const icon = list[0].weather[0].icon;
    // const currentRain = rain;
    // const currentHumidity = humidity;
    // console.log("current temp: ", currentTemp);
    // console.log("current wind: ", currentWind);
    // console.log("current rain: ", currentRain);
    // console.log("current humidity: ", currentHumidity);

    return new Weather(
      this.cityName,
      list[0].weather,
      currentTemp,
      list[0].main.feels_like,
      list[0].dt_text,
      icon,
      list[0].wind.speed,
      list[0].main.humidity,

    );
  }
   // TODO: Complete buildForecastArray method 
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    // console.log(weatherData);
    const forecasts = weatherData || []; 
   return forecasts.map((entry: any) => new Weather(
        this.cityName,
        entry.temp,
        entry.feels_like,
        entry.icon,
        entry.dateTime,
        entry.wind,
        entry.humidity,
        entry.description
    ));
    // console.log("forecast: ", forecasts);
    // return forecasts;
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
    // console.log("weather data in get weather: ", weatherData.current, weatherData.daily);
    const forecast = await this.buildForecastArray(weatherData.current,  weatherData.daily) || []
    // console.log("forecast: ", forecast);
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
