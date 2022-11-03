import { Injectable } from '@angular/core';
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

//After the request
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
