import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ICities } from '../model/cities';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<ICities>;
type EntityArrayResponseType = HttpResponse<ICities[]>;


export class CityService {
  
  
  public resourceUrl = 'http://dataservice.accuweather.com/locations/v1';
  public apikey: string = 'QH9vsDA9DBp2FqOonT1ahoyLBsVvA0eC';


  constructor(private http: HttpClient) { }

  findOne(id: string, language: string): Observable<EntityResponseType> {
    return this.http
      .get<ICities>(`${this.resourceUrl}/${id}?apikey=${this.apikey}&language=${language}`, { observe: 'response' });
  }

  findOneWtihGeo(latitude: any, longitude: any, language: string): Observable<EntityResponseType> {
    return this.http
      .get<ICities>(`${this.resourceUrl}/cities/geoposition/search?apikey=${this.apikey}&q=${latitude},${longitude}&language=${language}`, { observe: 'response' });
  }

  findAll(str: string, language: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICities[]>(`${this.resourceUrl}/cities/autocomplete?apikey=${this.apikey}&q=${str}&language=${language}`, { observe: 'response' });
  }

  findAllWithName(str: string, language: string): Observable<EntityArrayResponseType> {
    return this.http
      .get<ICities[]>(`${this.resourceUrl}/cities/search?apikey=${this.apikey}&q=${str}&language=${language}`, { observe: 'response' });
  }
}
