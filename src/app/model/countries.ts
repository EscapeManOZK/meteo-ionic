export interface ICountries {
    ID?: string;
    LocalizedName?: String
}

export class Countries implements ICountries {
    constructor(
        public ID?: string,
        public LocalizedName?: String
    ) {}
}
