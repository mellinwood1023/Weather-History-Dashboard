import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'Please enter city name' });
    }

   WeatherService.getWeatherData(city)
      .then(async (weatherData) => {
        await HistoryService.addCity(city);
        res.status(200).json(weatherData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
      }); 
  }
  // TODO: GET weather data from city name
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }
    await HistoryService.removeHistory(id);

    res.status(200).json({ message: 'City deleted from search history' });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
