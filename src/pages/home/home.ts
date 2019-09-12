import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { Cities } from '../../app/model/cities';
import { Weather } from '../../app/model/weather';
import { CityService } from '../../app/services/city.service';
import { WeatherService } from '../../app/services/weather.service';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedCity: Cities;
  currentWeather: Weather;

  private cityService: CityService;
  private weatherService: WeatherService;

  constructor(public navCtrl: NavController,
    private http: HttpClient,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController
  ) {
    this.cityService = new CityService(http);
    this.weatherService = new WeatherService(http);

    this.getPosition();
  }

  getPosition() {
    const loader = this.loadingCtrl.create({
      content: "Récupération de votre position",
    });
    loader.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      loader.dismiss();
      this.getData(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.error(error);
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Une erreur c\'est produite. Impossible de récupérer les données GPS',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    });
  }

  getData(latitude: any, longitude: any) {
    console.log(latitude + " "+longitude)
    const loader2 = this.loadingCtrl.create({
      content: "Chargement des données",
    });
    loader2.present();
    this.cityService.findOneWtihGeo(latitude, longitude, 'fr').subscribe(
      response => {
        this.selectedCity = response.body;
        if (this.selectedCity) {
          this.weatherService.findOneByCityId(this.selectedCity.Key, 'fr').subscribe(response => {
            this.currentWeather = this.DateParse(response.body);
            loader2.dismiss();
          },
            error => {
              loader2.dismiss();
              let toast1 = this.toastCtrl.create({
                message: 'Une erreur c\'est produite. Impossible de récupérer la météo',
                duration: 2000,
                position: 'bottom'
              });
              toast1.present(toast1);
            });
        } else {
          loader2.dismiss();
          let toast2 = this.toastCtrl.create({
            message: 'Aucune ville trouver à vos coordonées',
            duration: 2000,
            position: 'bottom'
          });
          toast2.present(toast2);
        }
      }, // success path
      error => {
        loader2.dismiss();
        let toast3 = this.toastCtrl.create({
          message: 'Une erreur c\'est produite. Impossible de récupérer les villes',
          duration: 2000,
          position: 'bottom'
        });

        toast3.present(toast3);
      }
    );
  }
  DateParse(body: Weather): Weather {
    body.Headline.EffectiveDate = moment(body.Headline.EffectiveDate).format('MM/DD/YYYY');
    body.DailyForecasts.forEach((value) => {
      value.Date = moment(value.Date).format('MM/DD/YYYY');
    });
    return body;
  }
}
