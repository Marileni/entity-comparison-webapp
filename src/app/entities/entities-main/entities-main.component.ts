import { Component, OnInit } from '@angular/core';
import { EntitiesDataService } from 'src/app/services/entitiesData.service';
import { environment } from 'src/environments/environment';

interface entitiesComp {
  entity: string;
  downloadData: string;
  triplesOfEntity: any[];
  images: any[];
}

interface JSONInput {
  id: number;
  mainEntity: string;
  downloadData: string;
  triplesOfMainEntity: any[];
  images: any[];
  entitiesForComparison: entitiesComp[];
}

interface dataContent {
  predicate: string;
  object: string;
}

interface Images {
  images: string[];
}

@Component({
  selector: 'app-entities-main',
  templateUrl: './entities-main.component.html',
  styleUrls: ['./entities-main.component.css'],
})
export class EntitiesMainComponent implements OnInit {
  data: string = '';
  appearError: boolean = false;
  message: string = '';

  entityMain: string[] = [];
  database: string[] = [];

  dataJSON: any[] = [];
  otherDataJSON: any[] = [];
  text!: string;
  dataDB: dataContent[][] = [];
  oneJSON: dataContent[][] = [];
  otherJSON: dataContent[][] = [];

  mainLinks: string[][] = [];
  nameMainEntities: string[] = [];
  otherLinks: string[][] = [];
  nameOtherEntities: string[] = [];

  loading: boolean = false;
  tableHeader: any;

  changeEntity: number = 0;
  changeOtherEntity: number = 0;

  modeChange: number = 0;
  imageData!: Images[];

  mainImages: string[] = [];
  otherImages: string[] = [];
  changeImages: number = 0;
  changeOtherImages: number = 0;

  constructor(private entitiesService: EntitiesDataService) {
    this.data = environment.currentJSON;
  }

  async ngOnInit(): Promise<void> {
    await this.getMainEntity();
    this.getOtherEntity();
  }

  async getMainEntity() {
    this.loading = true;
    if (!this.data) {
      this.data =
        '[{"id": 1,"mainEntity": "http://dbpedia.org/resource/Aristotle","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Socrates","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Plato","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]},{ "id": 2,"mainEntity": "http://dbpedia.org/resource/Heraklion","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Chania","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Naxos","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]}]';
    }
    let obj: JSONInput[] = JSON.parse(this.data);
    for (let i in obj) {
      this.nameMainEntities[i] = obj[i].mainEntity;
      this.entityMain[i] = obj[i].mainEntity.replace(/[/]/gi, '%2F');
      this.database[i] = obj[i].downloadData.replace(/[/]/gi, '%2F');

      this.dataJSON[i] = await this.entitiesService
        .getEntity(this.database[i], this.entityMain[i])
        .toPromise();
    }

    for (let i in this.dataJSON) {
      this.dataDB[i] = JSON.parse(this.dataJSON[i]);
    }

    for (let i in this.dataDB) {
      this.oneJSON[i] = this.dataDB[i];
      this.mainLinks[i] = [];
      for (let j in this.dataDB[i]) {
        this.mainLinks[i][j] = this.dataDB[i][j].object;
        var words = this.dataDB[i][j].predicate.split('/');
        this.dataDB[i][j].predicate = words[words.length - 1];
        words = this.dataDB[i][j].object.split('/');
        this.dataDB[i][j].object = words[words.length - 1];
      }
    }

    console.log(this.oneJSON);

    console.log(this.mainLinks);
    // this.makeTable(this.dataDB);
  }

  async getOtherEntity() {
    let obj: JSONInput[] = JSON.parse(this.data);
    var k = 0;
    for (let i in obj) {
      for (let j in obj[i].entitiesForComparison) {
        this.nameOtherEntities[k] = obj[i].entitiesForComparison[j].entity;
        this.entityMain[k] = obj[i].entitiesForComparison[j].entity.replace(
          /[/]/gi,
          '%2F'
        );
        this.database[k] = obj[i].entitiesForComparison[j].downloadData.replace(
          /[/]/gi,
          '%2F'
        );
        k += 1;
      }
    }

    for (let i in this.entityMain) {
      this.otherDataJSON[i] = await this.entitiesService
        .getEntity(this.database[i], this.entityMain[i])
        .toPromise();
    }

    for (let i in this.otherDataJSON) {
      this.dataDB[i] = JSON.parse(this.otherDataJSON[i]);
    }

    for (let i in this.dataDB) {
      this.otherJSON[i] = this.dataDB[i];
      this.otherLinks[i] = [];
      for (let j in this.dataDB[i]) {
        this.otherLinks[i][j] = this.dataDB[i][j].object;
        var words = this.dataDB[i][j].predicate.split('/');
        this.dataDB[i][j].predicate = words[words.length - 1];
        words = this.dataDB[i][j].object.split('/');
        this.dataDB[i][j].object = words[words.length - 1];
      }
    }

    console.log(this.otherJSON);
    console.log(this.otherLinks);
    // this.makeTable(this.dataDB);
    this.loading = false;
  }

  // makeTable(myObj: dataContent[][]) {
  //   this.text = "<table class='table table-hover table-bordered'>";
  //   this.text += '<tr><th>Predicate</th><th>Object</th></tr>';
  //   for (let i in myObj) {
  //     for (let j in myObj[i]) {
  //       this.text += '<tr><td>' + myObj[i][j].predicate + '</td>';
  //       this.text += '<td>' + myObj[i][j].object + '</td></tr>';
  //     }
  //   }
  //   this.text += '</table>';

  //   console.log(this.text);
  // }

  IsJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  beautify() {
    if (this.IsJsonString(this.data)) {
      var obj = JSON.parse(this.data);
      var pretty = JSON.stringify(obj, undefined, 4);
      this.appearError = false;
      this.data = pretty;
    } else {
      this.appearError = true;
      if (this.data == '' || this.data == undefined)
        this.message = 'Enter a JSON format.';
      else
        this.message =
          'You entered a wrong JSON format. Please enter a valid one.';
    }
  }

  change() {
    this.getMainEntity();
    this.getOtherEntity();
  }

  nextEntity() {
    this.changeEntity += 1;
    this.changeOtherEntity = 2;
    console.log(this.changeEntity);
  }

  prvEntity() {
    this.changeEntity -= 1;
    this.changeOtherEntity = 0;
    console.log(this.changeEntity);
  }

  nextOtherEntity() {
    this.changeOtherEntity += 1;
    console.log(this.changeOtherEntity);
  }

  prvOtherEntity() {
    this.changeOtherEntity -= 1;
    console.log(this.changeOtherEntity);
  }

  changeMode(value: string) {
    console.log(value);
    if (value == '1') {
      this.modeChange = 1;
      this.getMainImages();
    } else if (value == '2') {
      this.modeChange = 2;
      console.log(value);
    } else if (value == '0') {
      this.getMainEntity();
      this.getOtherEntity();
    } else {
    }
  }

  changePreviousImage() {
    this.changeImages -= 1;
  }

  changeNextImage() {
    this.changeImages += 1;
  }

  changeOtherPreviousImage() {
    this.changeOtherImages -= 1;
  }

  changeOtherNextImage() {
    this.changeOtherImages += 1;
  }

  async getMainImages() {
    this.loading = true;
    if (!this.data) {
      this.data =
        '[{"id": 1,"mainEntity": "http://dbpedia.org/resource/Aristotle","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Socrates","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Plato","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]},{ "id": 2,"mainEntity": "http://dbpedia.org/resource/Heraklion","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Chania","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Naxos","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]}]';
    }
    let obj: JSONInput[] = JSON.parse(this.data);
    for (let i in obj) {
      this.nameMainEntities[i] = obj[i].mainEntity;
      this.entityMain[i] = obj[i].mainEntity.replace(/[/]/gi, '%2F');
      this.database[i] = obj[i].downloadData.replace(/[/]/gi, '%2F');

      this.dataJSON[i] = await this.entitiesService
        .getEntityImage(this.database[i], this.entityMain[i])
        .toPromise();
    }

    // console.log(this.dataJSON);
    var temporary: any[] = [];
    for (let i in this.dataJSON) {
      temporary[i] = JSON.parse(this.dataJSON[i]);
    }

    var m: number = 0;
    //console.log(temporary);
    for (let i in temporary) {
      for (let j in temporary[i]) {
        for (let k in temporary[i][j]) {
          //console.log(temporary[i][j][k]);
          this.mainImages[m] = temporary[i][j][k];
          m = m + 1;
        }
      }
    }

    //console.log(this.mainImages);
    //this.loading = false;
    this.getOtherImages();
  }

  async getOtherImages() {
    let obj: JSONInput[] = JSON.parse(this.data);
    var k = 0;
    for (let i in obj) {
      for (let j in obj[i].entitiesForComparison) {
        this.nameOtherEntities[k] = obj[i].entitiesForComparison[j].entity;
        this.entityMain[k] = obj[i].entitiesForComparison[j].entity.replace(
          /[/]/gi,
          '%2F'
        );
        this.database[k] = obj[i].entitiesForComparison[j].downloadData.replace(
          /[/]/gi,
          '%2F'
        );
        k += 1;
      }
    }

    for (let i in this.entityMain) {
      this.otherDataJSON[i] = await this.entitiesService
        .getEntityImage(this.database[i], this.entityMain[i])
        .toPromise();
    }

    var temporary: any[] = [];
    for (let i in this.otherDataJSON) {
      temporary[i] = JSON.parse(this.otherDataJSON[i]);
    }

    var m: number = 0;
    console.log(temporary);
    for (let i in temporary) {
      for (let j in temporary[i]) {
        for (let k in temporary[i][j]) {
          console.log(temporary[i][j][k]);
          this.otherImages[m] = temporary[i][j][k];
          m = m + 1;
        }
      }
    }

    console.log(this.otherImages);
    this.loading = false;
  }
}
