import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EntitiesDataService {
  constructor(private http: HttpClient) {}

  getEntity(entity: string) {
    return this.http.get(
      environment.URLDBpedia + entity,
      this.createHeader('application/json')
    );
  }

  getEntityImage(entity: string) {
    return this.http.get(
      environment.URLDBpedia + 'images/' + entity,
      this.createHeader('application/json')
    );
  }

  getEntityCommonalities(endpoint1: string, endpoint2: string) {
    return this.http.get(
      environment.URLDBpedia + 'common/entity/' + endpoint1 + '/' + endpoint2,
      this.createHeader('application/json')
    );
  }

  getEntityAllProperties(endpoint: string) {
    return this.http.get(
      environment.URLDBpedia + 'all/properties/of/entity/' + endpoint,
      this.createHeader('application/json')
    );
  }

  getEntitySpecificProperty(endpoint: string, property: string) {
    console.log(
      environment.URLDBpedia + 'specific/' + property + '/' + endpoint
    );
    return this.http.get(
      environment.URLDBpedia + 'specific/' + property + '/' + endpoint,
      this.createHeader('application/json')
    );
  }

  private createHeader(contentType: string): any {
    return {
      headers: new HttpHeaders({ 'Content-Type': contentType }),
      responseType: 'text',
    };
  }
}
