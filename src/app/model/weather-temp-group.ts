import { IWeatherTempData, WeatherTempData } from './weather-temp-data';

export interface IWeatherTempGroup {
    Minimum?: IWeatherTempData,
    Maximum?: IWeatherTempData
}

export class WeatherTempGroup implements IWeatherTempGroup {
    constructor(
        public Minimum?: WeatherTempData,
        public Maximum?: WeatherTempData
    ) {}
}