import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css'],
})
export class EntitiesComponent implements OnInit {
  data!: string;
  appearError: boolean = false;
  message: string = '';

  constructor(private router: Router) {
    this.data =
      '[{"id": 1,"mainEntity": "http://dbpedia.org/resource/Aristotle","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Socrates","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Plato","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]},{ "id": 2,"mainEntity": "http://dbpedia.org/resource/Heraklion","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Chania","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Naxos","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]}]';
  }

  ngOnInit(): void {}

  select() {
    environment.currentJSON = this.data;
    this.router.navigateByUrl('/entities/select');
  }

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
}
