import { stringify } from "querystring";
import { SearchHistory } from "../routes/searchHistory/searchHistory.json";
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
  
  // TODO: Define a read method that reads from the searchHistory.json file
 private async read() {
  const fetchData = () => {
    try{
      const res = fetch(SearchHistory.join());
      const data = await res.(JSON.parse());
    } catch(err){
      console.log(err);
    }
  } 
  return fetchData();
 }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
private async write(cities: City[]) {
  const city: any[] = cities 
}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
async getCities() {
  const cities: return join('${this.filePath}')
}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
async addCity(city: string) {

}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
async removeCity(id: string) {}
}

export default new HistoryService();
