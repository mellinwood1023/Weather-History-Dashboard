import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface coordinates {

}
// TODO: Define a class for the Weather object
class Weather {
  city: string; 
  temp: number; 
  precipitation: string;
  
  constructor(city: string, temp: number, precipitation: string) {
    this.city = city; 
    this.temp = temp;
    this.precipitation = precipitation;
  }

}

// TODO: Complete the WeatherService class
class WeatherService {


  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
