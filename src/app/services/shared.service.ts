import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

//Before the request
export interface Ientity {
  mainEntity: string;
  otherEntity: string[];
}

export interface Ientities {
  entities: Ientity[];
}

//For the JSON
export interface IentityJSON {
  mainEntity: any;
  otherEntity: any[];
}

export interface IentitiesJSON {
  entities: IentityJSON[];
}

//After the request for tables
export interface dataPO {
  predicate: string;
  object: string;
}

export interface IentityPO {
  mainEntity: dataPO[];
  otherEntity: dataPO[][];
}

export interface IentitiesPO {
  entities: IentityPO[];
}

//After the request for images
export interface dataImages {
  images: string[];
}

export interface IimagePO {
  mainEntity: dataImages;
  otherEntity: dataImages[];
}

export interface IimagesPO {
  entities: IimagePO[];
}

//For Commonalities

export interface ICommonalitiesJson {
  entities: any[];
}

export interface ICommonData {
  common: dataPO[][];
}

export interface ICommonalities {
  entities: ICommonData[];
}

//For specific Predicates
export interface IPredicate {
  predicate: string;
}
export interface ISpecificPred {
  entities: IPredicate[][];
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  entitiesTransfer!: Ientities;
  _entitiesTransferueBS = new BehaviorSubject<Ientities>({ entities: [] });

  constructor() {
    this.entitiesTransfer = { entities: [] };
    this._entitiesTransferueBS.next(this.entitiesTransfer);
  }

  updateEntitiesTransfer(val: Ientity) {
    this.entitiesTransfer.entities.push(val);
    this._entitiesTransferueBS.next(this.entitiesTransfer);
  }

  clearEntitiesTransfer() {
    this.entitiesTransfer.entities = [];
  }
}
