import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EntitiesDataService {
  constructor(private http: HttpClient) {}

  getEntity(endpoint: string, entity: string) {
    console.log(environment.URLDBpedia + endpoint + '/' + entity);
    return this.http.get(
      environment.URLDBpedia + endpoint + '/' + entity,
      this.createHeader('application/json')
    );
  }

  getEntityImage(endpoint: string, entity: string) {
    return this.http.get(
      environment.URLDBpedia + 'images/' + endpoint + '/' + entity,
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
