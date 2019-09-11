import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apikey } from '../global';
import { IWeather } from '../model/weather';

type EntityResponseType = HttpResponse<IWeather>;
type EntityArrayResponseType = HttpResponse<IWeather[]>;

export class WeatherService {

  public resourceUrl = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day';

  constructor(protected http: HttpClient) { }

  findOneByCityId(id: string, language: string): Observable<EntityResponseType> {
    return this.http
      .get<IWeather>(`${this.resourceUrl}/${id}?apikey=${apikey}&language=${language}&metric=true`, { observe: 'response' });
  }
}
