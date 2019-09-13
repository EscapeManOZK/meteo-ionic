import { Weather } from './../../app/model/weather';
import { Cities } from './../../app/model/cities';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, Platform, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
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

  private weatherService: WeatherService;



  constructor(public navCtrl: NavController,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.city = new Cities();
    this.city.LocalizedName = '';
    this.weatherService = new WeatherService(http);
    this.cities = [];
  }

  logForm() {
    if (this.city.LocalizedName !== "") {
      let modal = this.modalCtrl.create(ModalContentPage, { data: this.city.LocalizedName });
      modal.present();
      modal.onWillDismiss(data => {
        if (data !== null) {
          if (data === '') {
            this.city.LocalizedName = '';
          } else {
            this.selectedCity = data
            this.city.LocalizedName = this.selectedCity.LocalizedName;
            const loader = this.loadingCtrl.create({
              content: "Chargement",
            });
            loader.present();
            this.weatherService.findOneByCityId(this.selectedCity.Key, 'fr').subscribe(response => {
              this.currentWeather = this.DateParse(response.body);
              loader.dismiss();
            },
              error => {
                loader.dismiss();
                let toast = this.toastCtrl.create({
                  message: 'Une erreur c\'est produite. Impossible de récupérer la météo',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present(toast);
              });
          }
        }
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Rentrer un nom de ville non vide',
        duration: 2000,
        position: 'bottom'
      });

      toast.present(toast);
    }
  }

  DateParse(body: Weather): Weather {
    body.Headline.EffectiveDate = moment(body.Headline.EffectiveDate).format('MM/DD/YYYY');
    body.DailyForecasts.forEach((value) => {
      value.Date = moment(value.Date).format('DD/MM/YYYY');
    });
    return body;
  }
}

@Component({
  selector: 'ModalContentPage',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      <button ion-button outline (click)="dismiss()">
        Cancel
        <ion-icon name="md-close"></ion-icon>
      </button>
      <h2 style="display: inline-block;margin: 1vh 0px 0px;">
        Choisie une ville :
      </h2>
    </ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-title></ion-title>
  <ion-list *ngIf="cities.length>0" inset>
    <button class="center" ion-item *ngFor="let item of cities;"
      (click)="choose_cities(item)">{{item.LocalizedName}}</button>
  </ion-list>
  <ion-list *ngIf="cities.length==0" inset>
    <ion-item> no-data
    </ion-item>
  </ion-list>
</ion-content>
`
})
export class ModalContentPage implements OnInit {


  cities: Cities[];

  private cityService: CityService;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private http: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController

  ) {
    this.cityService = new CityService(http);
    this.cities = [];
  }

  ngOnInit(): void {
    if (this.params.get('data') == "") {
      this.cities = [];
      this.viewCtrl.dismiss(null);
      let toast = this.toastCtrl.create({
        message: 'Rentrer un nom de ville non vide',
        duration: 2000,
        position: 'bottom'
      });

      toast.present(toast);
    } else {
      const loader = this.loadingCtrl.create({
        content: "Chargement",
      });
      loader.present();
      this.cityService.findAllWithName(this.params.get('data'), 'fr')
        .subscribe(
          response => {
            this.cities = response.body;
            this.cityService.findAll(this.params.get('data'), 'fr')
              .subscribe(
                response => {
                  this.cities = this.fusion(response.body);
                  loader.dismiss();
                  if (this.cities.length === 0) {
                    let toast = this.toastCtrl.create({
                      message: 'Aucune ville trouver pour ' + this.params.get('data'),
                      duration: 2000,
                      position: 'bottom'
                    });
                    toast.present(toast);
                    toast.onWillDismiss(() => {
                    });
                    this.viewCtrl.dismiss('');
                  }
                }, // success path
                error => {
                  loader.dismiss();
                  let toast = this.toastCtrl.create({
                    message: 'Une erreur c\'est produite. Impossible de récupérer les villes',
                    duration: 2000,
                    position: 'bottom'
                  });

                  toast.present(toast);
                }
              );
          }, // success path
          error => {
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Une erreur c\'est produite. Impossible de récupérer les villes',
              duration: 2000,
              position: 'bottom'
            });

            toast.present(toast);
          }
        );
    }
  }
  fusion(body: Cities[]): Cities[] {
    let data = this.cities;
    body.forEach(city => {
      let find = false;
      this.cities.forEach(value => {
        if (value.Key === city.Key) {
          find = true;
        }
      });
      if (!find) {
        data.push(city);
      }
    });
    return data;
  }

  choose_cities(item: Cities) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }
}