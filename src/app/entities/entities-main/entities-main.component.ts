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

  loading: boolean = false;
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
      this.entityMain[i] = obj[i].mainEntity.replace(/[/]/gi, '%2F');
      this.database[i] = obj[i].downloadData.replace(/[/]/gi, '%2F');

      this.dataJSON[i] = await this.entitiesService
        .getEntity(this.database[i], this.entityMain[i])
        .toPromise();
    }

    // console.log(this.entityMain);
    // console.log(this.database);

    for (let i in this.dataJSON) {
      this.dataDB[i] = JSON.parse(this.dataJSON[i]);
    }

    for (let i in this.dataDB) {
      this.oneJSON[i] = this.dataDB[i];
      for (let j in this.dataDB[i]) {
        console.log(this.dataDB[i][j]);
        //this.mainLinks[i][j] = this.dataDB[i][j].object;
        var words = this.dataDB[i][j].predicate.split('/');
        this.dataDB[i][j].predicate = words[words.length - 1];
        words = this.dataDB[i][j].object.split('/');
        this.dataDB[i][j].object = words[words.length - 1];
      }
    }

    //console.log(this.mainLinks);
    // console.log(this.dataDB);
    // this.makeTable(this.dataDB);
  }

  async getOtherEntity() {
    let obj: JSONInput[] = JSON.parse(this.data);
    var k = 0;
    for (let i in obj) {
      for (let j in obj[i].entitiesForComparison) {
        console.log(obj[i].entitiesForComparison[j].entity);
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

    console.log(this.entityMain[0]);
    for (let i in this.entityMain) {
      this.otherDataJSON[i] = await this.entitiesService
        .getEntity(this.database[i], this.entityMain[i])
        .toPromise();
    }

    for (let i in this.otherDataJSON) {
      this.dataDB[i] = JSON.parse(this.otherDataJSON[i]);
    }

    console.log(this.dataDB[0]);
    for (let i in this.dataDB) {
      this.otherJSON[i] = this.dataDB[i];
      for (let j in this.dataDB[i]) {
        var words = this.dataDB[i][j].predicate.split('/');
        this.dataDB[i][j].predicate = words[words.length - 1];
        words = this.dataDB[i][j].object.split('/');
        this.dataDB[i][j].object = words[words.length - 1];
      }
    }

    console.log(this.dataDB);
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
}
