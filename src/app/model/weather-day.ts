export interface IWeatherDay {
    Icon?: number,
    IconPhrase?: string,
    HasPrecipitation?: boolean
}

export class WeatherDay implements IWeatherDay {
    constructor(
        public Icon?: number,
        public IconPhrase?: string,
        public HasPrecipitation?: boolean
    ) {}
}