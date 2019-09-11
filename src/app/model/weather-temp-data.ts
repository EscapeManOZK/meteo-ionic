export interface IWeatherTempData {
    Value?: number,
    Unit?: string,
    UnitType?: number
}

export class WeatherTempData implements IWeatherTempData {
    constructor(
        public Value?: number,
        public Unit?: string,
        public UnitType?: number
    ) {}
}