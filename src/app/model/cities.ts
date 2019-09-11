import { ICountries, Countries } from './countries';

export interface ICities {
    Version?: number;
    Key?: string;
    Type?: string;
    Rank?: string;
    LocalizedName?: string;
    Country?: ICountries;
    AdministrativeArea?: ICountries;
}

export class Cities implements ICities {
    constructor(
        public Version?: number,
        public Key?: string,
        public Type?: string,
        public Rank?: string,
        public LocalizedName?: string,
        public Country?: Countries,
        public AdministrativeArea?: Countries
    ) {}
}