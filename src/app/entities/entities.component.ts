import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Ientity, SharedService } from '../services/shared.service';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css'],
})
export class EntitiesComponent implements OnInit {
  messageUrl: string = '';
  checkUrl: boolean = true;

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
    this.sharedService.clearEntitiesTransfer();
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
    localStorage.setItem(
      'data',
      JSON.stringify(this.sharedService.entitiesTransfer)
    );

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
    var regex =
      /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(link)) {
      return false;
    } else {
      var value = link.includes('http://dbpedia.org');
      if (value) {
        return true;
      } else {
        return false;
      }
    }
  }
}
