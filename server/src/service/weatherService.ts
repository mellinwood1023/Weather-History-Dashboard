import dotenv from 'dotenv';
import { response } from 'express';
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
  //get URL from geocode query
  const url = this.buildGeocodeQuery();
  //pass URL through fetchlocationdata
  const locationData = await this.fetchLocationData(url);
  // destructure location data and return it 
  return this.destructureLocationData(locationData);

 }
  // TODO: Create fetchWeatherData method
private async fetchWeatherData(coordinates: Coordinates) {
  let weatherData = await fetch(this.buildWeatherQuery(coordinates))
  return weatherData.json();
}
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    
    }
  // TODO: Complete buildForecastArray method
 private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

 }
  // TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string) {
  this.cityName = city;
  // use city for coordinates
  const coordinates = this.fetchAndDestructureLocationData();
  // recieve coordinates - get weather data using coordinates 
  // format weather data for front end 
  // return weather data

}
}

export default new WeatherService();
