import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { groupBy } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ientity, SharedService } from '../services/shared.service';
@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css'],
})
export class EntitiesComponent implements OnInit {
  data!: string;
  appearError: boolean = false;
  message: string = '';

  model: string = '';
  add: boolean = false;
  add2: boolean = false;

  messageUrl: string = '';
  checkUrl: boolean = true;

  countValidUrls: number = 0;

  entities = {
    mainEntity: 'http://dbpedia.org/resource/Aristotle',
    otherEntity: [
      {
        otherEntities: 'http://dbpedia.org/resource/Socrates',
      },
    ],
  };

  form: FormGroup = this.formBuilder.group({
    mainEntity: this.entities.mainEntity,
    otherEntity: this.buildEntities(this.entities.otherEntity),
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.data =
      '[{"id": 1,"mainEntity": "http://dbpedia.org/resource/Aristotle","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Socrates","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Plato","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]},{ "id": 2,"mainEntity": "http://dbpedia.org/resource/Heraklion","downloadData":"http://dbpedia.org/sparql","triplesOfMainEntity": [],"images":[],"entitiesForComparison": [{"entity": "http://dbpedia.org/resource/Chania","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]},{  "entity": "http://dbpedia.org/resource/Naxos","downloadData":"http://dbpedia.org/sparql","triplesOfEntity": [],"images":[]}]}]';
  }

  ngOnInit(): void {}

  get otherEntity(): FormArray {
    return this.form.get('otherEntity') as FormArray;
  }

  buildEntities(otherEntity: { otherEntities: string }[] = []) {
    return this.formBuilder.array(
      otherEntity.map((entities) => this.formBuilder.group(entities))
    );
  }

  addEntityField() {
    this.otherEntity.push(this.formBuilder.group({ otherEntities: null }));
    this.focusOutFunction();
  }

  addMainEntityField() {
    // var main_entity_input = document.getElementById('main-entity');
    // console.log(main_entity_input?.ariaValueNow);
    var choice: boolean = confirm(
      'Do you want to add another main entity ? This pair of main entity and other entities cannot be edited afterwards. Do you want to continue?'
    );

    if (choice == false) return;

    var main: string = this.form.get('mainEntity')?.value;
    var other: string[] = this.form.get('otherEntity')?.value;

    var allEntities: Ientity = {
      mainEntity: '',
      otherEntity: [],
    };

    allEntities.mainEntity = main;
    allEntities.otherEntity = other;

    this.sharedService.updateEntitiesTransfer(allEntities);

    // Clear form
    this.form.reset();
    this.otherEntity.clear();
    this.addEntityField();
    this.focusOutFunction();
  }

  removeEntityField(index: number): void {
    if (this.otherEntity.length > 1) {
      this.otherEntity.removeAt(index);
    } else {
      this.otherEntity.patchValue([{ otherEntities: null }]);
    }
    this.focusOutFunction();
  }

  submit(value: any): void {
    this.sharedService.updateEntitiesTransfer(value);
    this.router.navigateByUrl('/entities/select');
  }

  reset(): void {
    this.form.reset();
    this.otherEntity.clear();
    this.addEntityField();
    this.focusOutFunction();
  }

  clearAll(): void {
    this.sharedService.clearEntitiesTransfer();
    this.focusOutFunction();
  }

  focusOutFunction() {
    var main: string = this.form.get('mainEntity')?.value;
    var other: any[] = this.form.get('otherEntity')?.value;
    //  this.ValidURL(e.target.value);
    this.checkUrl = true;
    if (!this.ValidURL(main)) this.checkUrl = false;
    for (let i in other) {
      if (!this.ValidURL(other[i].otherEntities)) {
        this.checkUrl = false;
      }
    }
    if (!this.checkUrl) {
      this.messageUrl = 'Please enter a valid url with "http://dbpedia.org".';
    } else {
      this.messageUrl = '';
    }
  }

  ValidURL(link: any) {
    console.log(this.messageUrl);

    var regex =
      /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(link)) {
      // this.messageUrl = 'Please enter a valid url.';
      return false;
    } else {
      var value = link.includes('http://dbpedia.org');
      if (value) {
        // this.messageUrl = '';
        return true;
      } else {
        // this.messageUrl = 'Please enter a valid url with "http://dbpedia.org".';
        return false;
      }
    }
  }
}

// select() {
//   //environment.currentJSON = this.data;
//   localStorage.setItem('input', this.data);
//   this.router.navigateByUrl('/entities/select');
// }

// IsJsonString(str: string) {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// }

// beautify() {
//   if (this.IsJsonString(this.data)) {
//     var obj = JSON.parse(this.data);
//     var pretty = JSON.stringify(obj, undefined, 4);
//     this.appearError = false;
//     this.data = pretty;
//   } else {
//     this.appearError = true;
//     if (this.data == '' || this.data == undefined)
//       this.message = 'Enter a JSON format.';
//     else
//       this.message =
//         'You entered a wrong JSON format. Please enter a valid one.';
//   }
// }

// onSubmit() {
//   this.router.navigateByUrl('/entities/select');
// }

// addOtherEntity() {
//   this.add = true;
// }

// addmainEntity() {
//   this.add2 = true;
// }
