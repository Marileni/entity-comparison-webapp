import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EntitiesDataService } from 'src/app/services/entitiesData.service';
import {
  ICommonalities,
  ICommonalitiesJson,
  Ientities,
  IentitiesJSON,
  IentitiesPO,
  Ientity,
  IimagesPO,
  SharedService,
} from 'src/app/services/shared.service';

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

//new
interface entitiesFixed {
  allMainEntities: dataContent[];
  allOtherEntities: dataContent[][];
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

  //new
  //tables
  allEntities: any;
  allEntitiesFixedUrl: Ientities = { entities: [] };

  dataEntities: IentitiesJSON = { entities: [] };
  finalEntities: IentitiesPO = { entities: [] };
  finalEntitiesUrl: IentitiesPO = { entities: [] };

  nextCompBtn: boolean = false;
  previousCompBtn: boolean = true;

  nextEntBtn: boolean = false;
  previousEntBtn: boolean = true;

  //images
  dataImages: IentitiesJSON = { entities: [] };
  finalImages: IimagesPO = { entities: [] };

  changeOtherEntityImage: number = 0;

  previousImage1: boolean = true;
  nextImage1: boolean = true;

  previousImage2: boolean = true;
  nextImage2: boolean = true;

  previousImageEntity: boolean = true;
  nextImageEntity: boolean = true;

  previousImageComp: boolean = true;
  nextImageComp: boolean = true;

  errorInImage1: boolean = false;
  errorInImage2: boolean = false;

  changeImagesOnError1: number = 1;
  changeImagesOnError2: number = 1;

  //wikipedia
  changeCompWiki: number = 0;
  changeEntityWiki: number = 0;

  entitiesWithUrl: Ientities = { entities: [] };
  previousWikiEntity: boolean = false;
  nextWikiEntity: boolean = false;

  previousWikiComp: boolean = true;
  nextWikiComp: boolean = true;

  //common entities
  commonEntities: ICommonalities = { entities: [] };
  commonEntitiesUrl: ICommonalities = { entities: [] };
  commonEntitiesJson: any = { entities: { common: [] } };

  commonLength: string = '';

  //specific predicate

  constructor(
    private entitiesService: EntitiesDataService,
    private router: Router,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer
  ) {
    var value: any = localStorage.getItem('data');
    this.allEntities = JSON.parse(value);
    console.log(this.allEntities);
  }

  async ngOnInit(): Promise<void> {
    this.fixUrl();
    await this.fixEntitiesTable();
  }

  async changeMode(value: string) {
    if (value == '1') {
      this.modeChange = 1;
      this.getImages();
    } else if (value == '2') {
      this.modeChange = 2;
      this.fixWikipedia();
    } else if (value == '0') {
      this.modeChange = 0;
      await this.fixEntitiesTable();
    } else if (value == '3') {
      this.modeChange = 3;
      this.getCommonalities();
    } else {
      this.modeChange = 4;
      //this.getCommonalities();
    }
  }

  //Fix the URL
  fixUrl() {
    this.allEntitiesFixedUrl.entities = [];
    for (let i = 0; i < this.allEntities.entities.length; i++) {
      this.allEntitiesFixedUrl.entities[i] = {
        mainEntity: '',
        otherEntity: [],
      };
      this.allEntitiesFixedUrl.entities[i].mainEntity =
        this.allEntities.entities[i].mainEntity.replace(/[/]/gi, '%2F');

      for (
        let j = 0;
        j < this.allEntities.entities[i].otherEntity.length;
        j++
      ) {
        this.allEntitiesFixedUrl.entities[i].otherEntity[j] =
          this.allEntities.entities[i].otherEntity[j].otherEntities.replace(
            /[/]/gi,
            '%2F'
          );
      }
    }
  }

  async fixEntitiesTable() {
    this.loading = true;

    //Get the JSON data
    for (let i = 0; i < this.allEntitiesFixedUrl.entities.length; i++) {
      this.dataEntities.entities[i] = {
        mainEntity: '',
        otherEntity: [],
      };

      this.dataEntities.entities[i].mainEntity = await this.entitiesService
        .getEntity(
          this.database[i],
          this.allEntitiesFixedUrl.entities[i].mainEntity
        )
        .toPromise();

      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        console.log(this.allEntitiesFixedUrl.entities[i].otherEntity[j]);

        this.dataEntities.entities[i].otherEntity[j] =
          await this.entitiesService
            .getEntity(
              this.database[i],
              this.allEntitiesFixedUrl.entities[i].otherEntity[j]
            )
            .toPromise();
      }
    }

    //Get the final data with the URL
    for (let i = 0; i < this.dataEntities.entities.length; i++) {
      this.finalEntities.entities[i] = {
        mainEntity: [],
        otherEntity: [],
      };

      this.finalEntities.entities[i].mainEntity = JSON.parse(
        this.dataEntities.entities[i].mainEntity
      );
      for (
        let j = 0;
        j < this.dataEntities.entities[i].otherEntity.length;
        j++
      ) {
        this.finalEntities.entities[i].otherEntity[j] = JSON.parse(
          this.dataEntities.entities[i].otherEntity[j]
        );
      }
    }

    //Get the final data without the URL
    for (let i = 0; i < this.finalEntities.entities.length; i++) {
      this.finalEntitiesUrl.entities[i] = {
        mainEntity: [],
        otherEntity: [],
      };
      for (
        let k = 0;
        k < this.finalEntities.entities[i].mainEntity.length;
        k++
      ) {
        this.finalEntitiesUrl.entities[i].mainEntity[k] = {
          predicate: '',
          object: '',
        };

        var words =
          this.finalEntities.entities[i].mainEntity[k].predicate.split('/');
        this.finalEntitiesUrl.entities[i].mainEntity[k].predicate =
          words[words.length - 1];

        words = this.finalEntities.entities[i].mainEntity[k].object.split('/');
        this.finalEntitiesUrl.entities[i].mainEntity[k].object =
          words[words.length - 1];
      }

      for (
        let j = 0;
        j < this.finalEntities.entities[i].otherEntity.length;
        j++
      ) {
        this.finalEntitiesUrl.entities[i].otherEntity[j] = [];

        for (
          let k = 0;
          k < this.finalEntities.entities[i].otherEntity[j].length;
          k++
        ) {
          this.finalEntitiesUrl.entities[i].otherEntity[j][k] = {
            predicate: '',
            object: '',
          };

          var words =
            this.finalEntities.entities[i].otherEntity[j][k].predicate.split(
              '/'
            );
          this.finalEntitiesUrl.entities[i].otherEntity[j][k].predicate =
            words[words.length - 1];

          words =
            this.finalEntities.entities[i].otherEntity[j][k].object.split('/');
          this.finalEntitiesUrl.entities[i].otherEntity[j][k].object =
            words[words.length - 1];
        }
      }
    }

    console.log(this.finalEntities);
    console.log(this.finalEntitiesUrl);

    if (this.changeEntity + 1 == this.allEntitiesFixedUrl.entities.length) {
      this.nextCompBtn = true;
    } else {
      this.nextCompBtn = false;
    }

    if (
      this.changeOtherEntity + 1 ==
      this.allEntitiesFixedUrl.entities[0].otherEntity.length
    ) {
      this.nextEntBtn = true;
    } else {
      this.nextEntBtn = false;
    }

    this.loading = false;
  }

  ValidURL(link: any) {
    var regex =
      /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(link)) {
      return false;
    } else {
      return true;
    }
  }

  nextEntity() {
    this.changeEntity += 1;
    this.changeOtherEntity = 2;

    if (this.changeEntity == this.allEntitiesFixedUrl.entities.length) {
      this.nextCompBtn = true;
    } else {
      this.nextCompBtn = false;
    }

    console.log(this.changeEntity);
  }

  prvEntity() {
    this.changeEntity -= 1;
    this.changeOtherEntity = 0;

    if (this.changeEntity == 0) {
      this.previousCompBtn = true;
    } else {
      this.previousCompBtn = false;
    }

    console.log(this.changeEntity);
  }

  nextOtherEntity() {
    this.changeOtherEntity += 1;
    this.previousEntBtn = false;
    if (
      this.changeOtherEntity + 1 ==
      this.allEntitiesFixedUrl.entities[0].otherEntity.length
    ) {
      this.nextEntBtn = true;
    }
    console.log(this.changeOtherEntity);
  }

  prvOtherEntity() {
    this.changeOtherEntity -= 1;

    if (this.changeOtherEntity == 0) {
      this.previousEntBtn = true;
    }

    if (
      this.changeOtherEntity + 1 !=
      this.allEntitiesFixedUrl.entities[0].otherEntity.length
    ) {
      this.nextEntBtn = false;
    }
    console.log(this.changeOtherEntity);
  }

  async getImages() {
    this.loading = true;

    //Get the JSON data
    for (let i = 0; i < this.allEntitiesFixedUrl.entities.length; i++) {
      this.dataImages.entities[i] = {
        mainEntity: '',
        otherEntity: [],
      };
      this.dataImages.entities[i].mainEntity = await this.entitiesService
        .getEntityImage(
          this.database[i],
          this.allEntitiesFixedUrl.entities[i].mainEntity
        )
        .toPromise();

      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.dataImages.entities[i].otherEntity[j] = await this.entitiesService
          .getEntityImage(
            this.database[i],
            this.allEntitiesFixedUrl.entities[i].otherEntity[j]
          )
          .toPromise();
      }
    }

    //Get the final data with the URL
    for (let i = 0; i < this.dataImages.entities.length; i++) {
      this.finalImages.entities[i] = {
        mainEntity: { images: [] },
        otherEntity: [],
      };

      this.finalImages.entities[i].mainEntity = JSON.parse(
        this.dataImages.entities[i].mainEntity
      );
      for (let j = 0; j < this.dataImages.entities[i].otherEntity.length; j++) {
        this.finalImages.entities[i].otherEntity[j] = JSON.parse(
          this.dataImages.entities[i].otherEntity[j]
        );
      }
    }

    console.log(this.finalImages);

    this.changeImageOtherEntities();

    this.changeImagesCarousel1();
    this.changeImagesCarousel2();

    this.loading = false;
  }

  imageError1(e: any) {
    console.log('Error');
    console.log(e);
    this.changeImages += this.changeImagesOnError1;
    this.changeImagesCarousel1();
    //this.errorInImage1 = true;
  }

  imageError2(e: any) {
    console.log('Error');
    console.log(e);
    this.changeOtherImages += this.changeImagesOnError2;
    this.changeImagesCarousel2();
    //this.errorInImage2 = true;
  }

  changeImageOtherEntities() {
    if (this.changeOtherEntityImage == 0) {
      this.previousImageEntity = true;
    } else {
      this.previousImageEntity = false;
    }

    if (
      this.changeOtherEntityImage + 1 ==
      this.finalImages.entities[0].otherEntity.length
    ) {
      this.nextImageEntity = true;
    } else {
      this.nextImageEntity = false;
    }
  }

  changeImagesCarousel1() {
    this.errorInImage1 = false;
    if (this.changeImages == 0) {
      this.changeImagesOnError1 = 1;
      this.previousImage1 = true;
    } else {
      this.previousImage1 = false;
    }

    if (
      this.changeImages + 1 ==
      this.finalImages.entities[0].mainEntity.images.length
    ) {
      this.changeImagesOnError1 = -1;
      this.nextImage1 = true;
    } else {
      this.nextImage1 = false;
    }
  }

  changeImagesCarousel2() {
    this.errorInImage2 = false;
    if (this.changeOtherImages == 0) {
      this.changeImagesOnError2 = 1;
      this.previousImage2 = true;
    } else {
      this.previousImage2 = false;
    }

    if (
      this.changeOtherImages + 1 ==
      this.finalImages.entities[0].otherEntity[0].images.length
    ) {
      this.changeImagesOnError2 = -1;
      this.nextImage2 = true;
    } else {
      this.nextImage2 = false;
    }
  }

  changePreviousImage() {
    this.changeImagesOnError1 = -1;
    this.changeImages -= 1;
    this.changeImagesCarousel1();
  }

  changeNextImage() {
    this.changeImagesOnError1 = 1;
    this.changeImages += 1;
    this.changeImagesCarousel1();
  }

  changeOtherPreviousImage() {
    this.changeImagesOnError2 = -1;
    this.changeOtherImages -= 1;
    this.changeImagesCarousel2();
  }

  changeOtherNextImage() {
    this.changeImagesOnError2 = 1;
    this.changeOtherImages += 1;
    this.changeImagesCarousel2();
  }

  imagesPrvEntity() {}

  imagesNextEntity() {}

  imagesPrvOtherEntity() {
    this.changeOtherImages = 0;
    this.changeOtherEntityImage -= 1;
    this.changeImageOtherEntities();
    this.changeImagesCarousel2();
  }

  imagesNextOtherEntity() {
    this.changeOtherImages = 0;
    this.changeOtherEntityImage += 1;
    this.changeImageOtherEntities();
    this.changeImagesCarousel2();
  }

  fixWikipedia() {
    this.loading = true;

    for (let i = 0; i < this.allEntities.entities.length; i++) {
      this.entitiesWithUrl.entities[i] = {
        mainEntity: '',
        otherEntity: [],
      };

      let words = this.allEntities.entities[i].mainEntity.split('/');

      this.entitiesWithUrl.entities[i].mainEntity =
        'https://en.wikipedia.org/wiki/' + words[words.length - 1];

      for (
        let j = 0;
        j < this.allEntities.entities[i].otherEntity.length;
        j++
      ) {
        let words =
          this.allEntities.entities[i].otherEntity[j].otherEntities.split('/');

        this.entitiesWithUrl.entities[i].otherEntity[j] =
          'https://en.wikipedia.org/wiki/' + words[words.length - 1];
      }
    }

    this.changeWikiOtherEntities();
    this.loading = false;
  }

  changeWikiOtherEntities() {
    if (this.changeEntityWiki == 0) {
      this.previousWikiEntity = true;
    } else {
      this.previousWikiEntity = false;
    }

    if (
      this.changeEntityWiki + 1 ==
      this.entitiesWithUrl.entities[0].otherEntity.length
    ) {
      this.nextWikiEntity = true;
    } else {
      this.nextWikiEntity = false;
    }
  }

  wikipediaPrvComp() {}

  wikipediaNextComp() {}

  wikipediaPrvEntity() {
    this.changeEntityWiki -= 1;
    this.changeWikiOtherEntities();
  }

  wikipediaNextEntity() {
    this.changeEntityWiki += 1;
    this.changeWikiOtherEntities();
  }

  async getCommonalities() {
    this.loading = true;

    console.log(this.allEntitiesFixedUrl);
    //Get the JSON data
    for (let i = 0; i < this.allEntitiesFixedUrl.entities.length; i++) {
      this.commonEntitiesJson.entities[i] = { common: [] };
      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.commonEntitiesJson.entities[i].common[j] = [];
        // console.log(
        //   await this.entitiesService
        //     .getEntityCommonalities(
        //       this.allEntitiesFixedUrl.entities[i].mainEntity,
        //       this.allEntitiesFixedUrl.entities[i].otherEntity[j]
        //     )
        //     .toPromise()
        // );
        this.commonEntitiesJson.entities[i].common[j] =
          await this.entitiesService
            .getEntityCommonalities(
              this.allEntitiesFixedUrl.entities[i].mainEntity,
              this.allEntitiesFixedUrl.entities[i].otherEntity[j]
            )
            .toPromise();
      }
    }

    console.log(this.commonEntitiesJson);

    //Get the final data with the URL
    for (let i = 0; i < this.commonEntitiesJson.entities.length; i++) {
      this.commonEntities.entities[i] = { common: [] };
      for (
        let j = 0;
        j < this.commonEntitiesJson.entities[i].common.length;
        j++
      ) {
        this.commonEntities.entities[i].common[j] = {
          predicate: '',
          object: '',
        };

        console.log(
          JSON.parse(this.commonEntitiesJson.entities[i].common[j].predicate)
        );
        this.commonEntities.entities[i].common[j].predicate = JSON.parse(
          this.commonEntitiesJson.entities[i].common[j].predicate
        );

        this.commonEntities.entities[i].common[j].object = JSON.parse(
          this.commonEntitiesJson.entities[i].common[j].object
        );
      }
    }

    console.log(this.commonEntities);

    //Get the final data without the URL

    // this.commonEntitiesUrl = this.commonEntities;

    // for (let i = 0; i < this.commonEntities.entities.length; i++) {
    //   for (let k = 0; k < this.commonEntities.entities[i].length; k++) {
    //     console.log(this.commonEntities.entities[i][k].predicate);

    //     var words = this.commonEntities.entities[i][k].predicate.split('/');

    //     this.commonEntitiesUrl.entities[i][k].predicate =
    //       words[words.length - 1];

    //     words = this.commonEntities.entities[i][k].object.split('/');
    //     this.commonEntitiesUrl.entities[i][k].object = words[words.length - 1];
    //   }
    // }

    // console.log(this.commonEntities.entities[0].length);
    // this.commonLength = this.commonEntities.entities[0].length.toString();

    // if (this.changeEntity + 1 == this.allEntitiesFixedUrl.entities.length) {
    //   this.nextCompBtn = true;
    // } else {
    //   this.nextCompBtn = false;
    // }

    // if (
    //   this.changeOtherEntity + 1 ==
    //   this.allEntitiesFixedUrl.entities[0].otherEntity.length
    // ) {
    //   this.nextEntBtn = true;
    // } else {
    //   this.nextEntBtn = false;
    // }

    this.loading = false;
  }

  getSpecificPredicate() {}

  back() {
    this.router.navigateByUrl('/entities');
  }
}
