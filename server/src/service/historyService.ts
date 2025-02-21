import { stringify } from "querystring";
import { text } from "stream/consumers";

// TODO: Define a City class with name and id properties
class City {
  city: string;
  state: string;
  id: string;
  
  constructor (city: string, state: string, id: string) {
    this.city = city; 
    this.state = state;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService implements City {
  city: string;
  constructor(city: string, state: string, id: string) {
    this.city = city;
    this.state = state;
    this.id = id;
  }

  private filePath = '../routes/searchHistory/searchHistory.json';

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const response = await fetch(this.filePath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.map((item: any) => new City(item.city, item.state, item.id));
  }

// TODO: Define a write method that writes the updated cities array to the searchHistory.json file

  private async write(cities: City[]): Promise<void> {
    const response = await fetch(this.filePath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cities)
    });
    if (!response.ok) {
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
    cities.push(city);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file

  async removeCity(id: string): Promise<void> {
    try {
      let cities = await this.getCities();
      cities = cities.filter(city => city.id !== id);
      await this.write(cities);
    } catch (error) {
      console.error('Error removing city:', error);
      throw new Error('Failed to remove city');
    }
  }
  state: string;
  id: string;
}

export default new HistoryService('defaultCity', 'defaultState', 'defaultId');
