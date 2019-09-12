import { Weather } from './../../app/model/weather';
import { Cities } from './../../app/model/cities';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, Platform, NavParams, ViewController, ToastController } from 'ionic-angular';
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
  loading = false;

  private weatherService: WeatherService;



  constructor(public navCtrl: NavController,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
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
            this.weatherService.findOneByCityId(this.selectedCity.Key, 'fr').subscribe(response => {
              this.currentWeather = this.DateParse(response.body);
              this.loading = false;
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
      value.Date = moment(value.Date).format('MM/DD/YYYY');
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
      Choisie une ville :
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
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
    public toastCtrl: ToastController

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
      this.cityService.findAll(this.params.get('data'), 'fr')
        .subscribe(
          response => {
            this.cities = response.body;
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
          } // success path
        );
    }
  }

  choose_cities(item: Cities) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }
}