import { IWeatherTempGroup, WeatherTempGroup } from './weather-temp-group';
import { IWeatherDay, WeatherDay } from './weather-day';

export interface IWeatherDealy {
    Date?: string,
    EpochDate?: number,
    Temperature?: IWeatherTempGroup,
    Day?: IWeatherDay,
    Night?: IWeatherDay,
    Sources?: string[],
    MobileLink?: string,
    Link?: string
}

export class WeatherDealy implements IWeatherDealy {
    constructor(
        public Date?: string,
        public EpochDate?: number,
        public Temperature?: WeatherTempGroup,
        public Day?: WeatherDay,
        public Night?: WeatherDay,
        public Sources?: string[],
        public MobileLink?: string,
        public Link?: string
    ) {
    }
}