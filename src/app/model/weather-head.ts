export interface IWeatherHead {
    EffectiveDate?: string,
    EffectiveEpochDate?: number,
    Severity?: number,
    Text?: string,
    Category?: string,
    MobileLink?: string,
    Link?: string
}

export class WeatherHead implements IWeatherHead {
    constructor(
        public EffectiveDate?: string,
        public EffectiveEpochDate?: number,
        public Severity?: number,
        public Text?: string,
        public Category?: string,
        public MobileLink?: string,
        public Link?: string
    ) {}
}