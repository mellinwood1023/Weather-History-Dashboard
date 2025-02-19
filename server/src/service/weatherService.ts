import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number, 
  longitude: number, 
}
// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  city: string; 
  temp: number; 
  precipitation: string;
  icon: string; 
  dateTime: Date; 
  windSpeed: number;
  humidity: number; 
  
  constructor(city: string, temp: number, precipitation: string, icon: string, dateTime: Date, windSpeed: number, humidity: number) {
    this.city = city; 
    this.temp = temp;
    this.precipitation = precipitation;
    this.icon = icon; 
    this.dateTime = dateTime;
    this.windSpeed = windSpeed; 
    this.humidity = humidity;

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
  private parseCurrentWeather(response: any) {
    const {list} = response; 
    const {city, temp, precipitation, date, windSpeed} = list[0];

    return new Weather (
     
    )
    }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
