import dotenv from 'dotenv';
import { response } from 'express';
import { parse } from 'node:path';
// import { json } from 'node:stream/consumers';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number; 
  longitude: number; 
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
  
  constructor(
    city: string, 
    tempEl: number, 
    precipitation: string, 
    weatherIcon: string, 
    dateTime: Date, 
    windEl: number, 
    humidityEl: number, 
    latitude: number, 
    longitude: number) {
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

  static fromJSON(json: any): Weather {
    return new Weather(
      json.city,
      json.tempEl,
      json.precipitation,
      json.weatherIcon,
      new Date(json.dateTime),
      json.windEl,
      json.humidityEl,
      json.latitude,
      json.longitude
    );
  }
  toJSON(): any {
    return {
      city: this.city,
      tempEl: this.tempEl,
      precipitation: this.precipitation,
      weatherIcon: this.weatherIcon,
      dateTime: this.dateTime.toISOString(),
      windEl: this.windEl,
      humidityEl: this.humidityEl,
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
  toString(): string {
    return `City: ${this.city}, Temp: ${this.tempEl}°C, Precipitation: ${this.precipitation}, Weather Icon: ${this.weatherIcon}, Date: ${this.dateTime.toISOString()}, Wind: ${this.windEl} m/s, Humidity: ${this.humidityEl}%, Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
  }
  toObject(): Coordinates {
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
  toArray(): (string | number)[] {
    return [
      this.city,
      this.tempEl,
      this.precipitation,
      this.weatherIcon,
      this.dateTime.toISOString(),
      this.windEl,
      this.humidityEl,
      this.latitude,
      this.longitude
    ];
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
    return { latitude, longitude };
}
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery() {
  return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
 }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
}
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const url = this.buildGeocodeQuery();
    const locationDataArray = await this.fetchLocationData(url);
    if (!locationDataArray || locationDataArray.length === 0) {
      throw new Error("Location data not found.");
    }
    return this.destructureLocationData(locationDataArray[0]); 

  // const coordinates = this.destructureLocationData(locationDataArray[0]);
  // return coordinates;
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
    const { main, weather, wind, rain } = list[0].main;
    const currentTemp = main.temp;
    const currentWind = wind.speed;
    const precipitation = rain ? rain['1h'] : 0;
    const humidity = main.humidity;
    const icon = weather[0].icon;
    const latitude = response.city.coord.lat;
    const longitude = response.city.coord.lon;

    return new Weather(
      this.cityName,
      Math.round(currentTemp),
      precipitation ? `${Math.round(precipitation * 100) / 100} mm` : 'Sunny',
      icon,
      new Date(),
      Math.round(currentWind),
      Math.round(humidity),
      response.locationData.latitude,
      response.locationData.longitude  
    );
  }
   // TODO: Complete buildForecastArray method 
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    console.log(weatherData);
    const forecasts = weatherData.list || []; 
    return forecasts.map((entry: any) => new Weather(
        this.cityName,
        entry.tempEl,
        entry.rain ? entry.rain['3h'] : 'No Rain',
        entry.weather[0].icon,
        new Date(entry.dt * 1000),
        entry.wind.speed,
        entry.main.humidity,
        weatherData.city.coord.lat,
        weatherData.city.coord.lon
    ));
} 
  private parseDailyWeather(response: any) {
    if (!response || !response.list) {
      console.error("Invalid response data", response);
      return [];
    }
    return response.list?.map((entry: any) => ({
      dateTime: new Date(entry.dt * 1000),
      tempEl: entry.main.temp,
      precipitation: entry.rain ? entry.rain['3h'] : 0,
      weatherIcon: entry.weather[0].icon,
      windEl: entry.wind.speed,
      humidityEl: entry.main.humidity,
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
