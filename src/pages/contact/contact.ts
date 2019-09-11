import { Weather } from './../../app/model/weather';
import { Cities } from './../../app/model/cities';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CityService } from '../../app/services/city.service';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../../app/services/weather.service';
import * as moment from 'moment';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  city: Cities;
  cities: Cities[];
  selectedCity: Cities;
  currentWeather: Weather;
  loading= false;

  private cityService: CityService;
  private weatherService: WeatherService;



  constructor(public navCtrl: NavController,
    private http: HttpClient
  ) {
    this.city = new Cities();
    this.cityService = new CityService(http);
    this.weatherService = new WeatherService(http);
    this.cities = [];
  }

  logForm() {
    if (this.city.LocalizedName == "") {
      this.cities = [];
    } else {
      this.cityService.findAll(this.city.LocalizedName, 'en')
        .subscribe(
          response => {
            this.cities = response.body;
          } // success path
        );
    }
  }
  choose_cities(item: Cities) {
    this.selectedCity = item;
    this.weatherService.findOneByCityId(this.selectedCity.Key, 'en').subscribe(response => { 
      this.currentWeather = this.DateParse(response.body);
      this.loading= false;
    });
  }

  DateParse(body: Weather): Weather {
    body.Headline.EffectiveDate =  moment(body.Headline.EffectiveDate).format('MM/DD/YYYY');
    body.DailyForecasts.forEach((value) => {
      console.log(value);
      value.Date = moment(value.Date).format('MM/DD/YYYY');
    });
    return body;
}
}
