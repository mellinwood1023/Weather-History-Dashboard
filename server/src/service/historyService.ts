import { stringify } from "querystring";
import { text } from "stream/consumers";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  city: string;
  state: string;
  id: string;
  
  constructor (city: string, state: string, id: string) {
    this.city = city; 
    this.state = state;
    this.id = id ?? uuidv4(); 
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.resolve(__dirname, '../routes/searchHistory/searchHistory.json');

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
   try { 
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to write to file');
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects

  async getCities(): Promise<City[]> {
    return await this.read();
  }
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: City): Promise<void> {
    const cities = await this.getCities();
    const cityExists = cities.some(c => c.city === city.city && c.state === city.state);
    if (!cityExists) {
      const newCity = new City(city.city, city.state, uuidv4());
      cities.push(newCity);
      await this.write(cities);
    } 
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file

  async removeCity(id: string): Promise<void> {
    try {
      let cities = await this.getCities();
      cities = cities.filter(city => city.id !== id);
      await this.write(cities);
    } catch (error) {
      console.error('Error:', error);
      throw new Error('City not removed');
    }
  }
}

export default new HistoryService();
