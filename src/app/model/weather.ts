import { IWeatherHead, WeatherHead } from './weather-head';
import { IWeatherDealy, WeatherDealy } from './weather-dealy';

export interface IWeather {
    Headline?: IWeatherHead,
    DailyForecasts?: IWeatherDealy[],
}

export class Weather implements IWeather {
    constructor(
        public Headline?: WeatherHead,
        public DailyForecasts?: WeatherDealy[],
    ) {
        
    }
}