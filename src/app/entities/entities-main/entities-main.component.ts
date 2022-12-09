import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EntitiesDataService } from 'src/app/services/entitiesData.service';
import {
  ICommonalities,
  Ientities,
  IentitiesJSON,
  IentitiesPO,
  IimagesPO,
  ISpecificPred,
} from 'src/app/services/shared.service';

interface totalNmuber {
  total: number[];
}

interface totalCommon {
  entities: totalNmuber[];
}

@Component({
  selector: 'app-entities-main',
  templateUrl: './entities-main.component.html',
  styleUrls: ['./entities-main.component.css'],
})
export class EntitiesMainComponent implements OnInit {
  loading: boolean = false;
  modeChange: number = 2;

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

  changeEntity: number = 0;
  changeOtherEntity: number = 0;

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

  changeImages: number = 0;
  changeOtherImages: number = 0;
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
  commonEntitiesJson: any = { entities: [] };

  commonLength: totalCommon = { entities: [] };

  changeCompCommon: number = 0;
  changeEntityCommon: number = 0;

  previousCommonComp: boolean = true;
  nextCommonComp: boolean = true;

  previousCommonEntity: boolean = true;
  nextCommonEntity: boolean = true;

  //specific predicate
  specificPredUrl: ISpecificPred = { entities: [] };
  specificPredJson: any = { entities: [] };

  specificPred: ISpecificPred = { entities: [] };

  specificComp: number = 0;
  loadingChange: boolean = false;

  specificPrEntities: IentitiesJSON = { entities: [] };
  specificPrFinalUrl: IentitiesPO = { entities: [] };
  specificPrFinal: IentitiesPO = { entities: [] };

  changeCompSpec: number = 0;
  changeEntitySpec: number = 0;

  previousSpecComp: boolean = true;
  nextSpecComp: boolean = true;

  previousSpecEntity: boolean = true;
  nextSpecEntity: boolean = true;

  constructor(
    private entitiesService: EntitiesDataService,
    private router: Router
  ) {
    var value: any = localStorage.getItem('data');
    this.allEntities = JSON.parse(value);
  }

  async ngOnInit(): Promise<void> {
    this.fixUrl();
    this.fixWikipedia();
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
      this.fixEntitiesTable();
    } else if (value == '3') {
      this.modeChange = 3;
      this.getCommonalities();
    } else {
      this.modeChange = 4;
      await this.fixEntitiesTable();
      this.getSpecificPredicate();
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
      this.allEntitiesFixedUrl.entities[i].mainEntity =
        this.allEntitiesFixedUrl.entities[i].mainEntity.replace(/[#]/gi, '%23');
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

        this.allEntitiesFixedUrl.entities[i].otherEntity[j] =
          this.allEntitiesFixedUrl.entities[i].otherEntity[j].replace(
            /[#]/gi,
            '%23'
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
        .getEntity(this.allEntitiesFixedUrl.entities[i].mainEntity)
        .toPromise();

      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.dataEntities.entities[i].otherEntity[j] =
          await this.entitiesService
            .getEntity(this.allEntitiesFixedUrl.entities[i].otherEntity[j])
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

        //Split with /
        var words =
          this.finalEntities.entities[i].mainEntity[k].predicate.split('/');
        this.finalEntitiesUrl.entities[i].mainEntity[k].predicate =
          words[words.length - 1];

        //Split with ^^
        if (
          this.finalEntities.entities[i].mainEntity[k].object.includes('^^')
        ) {
          words =
            this.finalEntities.entities[i].mainEntity[k].object.split('^^');
          this.finalEntitiesUrl.entities[i].mainEntity[k].object = words[0];
        } else {
          words =
            this.finalEntities.entities[i].mainEntity[k].object.split('/');
          this.finalEntitiesUrl.entities[i].mainEntity[k].object =
            words[words.length - 1];

          if (this.finalEntitiesUrl.entities[i].mainEntity[k].object == '') {
            this.finalEntitiesUrl.entities[i].mainEntity[k].object =
              words[words.length - 2];
          }
        }
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

          //Split with ^^
          if (
            this.finalEntities.entities[i].otherEntity[j][k].object.includes(
              '^^'
            )
          ) {
            words =
              this.finalEntities.entities[i].otherEntity[j][k].object.split(
                '^^'
              );
            this.finalEntitiesUrl.entities[i].otherEntity[j][k].object =
              words[0];
          } else {
            words =
              this.finalEntities.entities[i].otherEntity[j][k].object.split(
                '/'
              );
            this.finalEntitiesUrl.entities[i].otherEntity[j][k].object =
              words[words.length - 1];

            if (
              this.finalEntitiesUrl.entities[i].otherEntity[j][k].object == ''
            ) {
              this.finalEntitiesUrl.entities[i].otherEntity[j][k].object =
                words[words.length - 2];
            }
          }
        }
      }
    }

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
      if (link.includes('^^')) {
        return false;
      }
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
  }

  prvEntity() {
    this.changeEntity -= 1;
    this.changeOtherEntity = 0;

    if (this.changeEntity == 0) {
      this.previousCompBtn = true;
    } else {
      this.previousCompBtn = false;
    }
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
        .getEntityImage(this.allEntitiesFixedUrl.entities[i].mainEntity)
        .toPromise();

      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.dataImages.entities[i].otherEntity[j] = await this.entitiesService
          .getEntityImage(this.allEntitiesFixedUrl.entities[i].otherEntity[j])
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

    this.changeImageOtherEntities();

    this.changeImagesCarousel1();
    this.changeImagesCarousel2();

    this.loading = false;
  }

  imageError1(e: any) {
    this.changeImages += this.changeImagesOnError1;
    this.changeImagesCarousel1();
  }

  imageError2(e: any) {
    this.changeOtherImages += this.changeImagesOnError2;
    this.changeImagesCarousel2();
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

    //Get JSON data
    for (let i = 0; i < this.allEntitiesFixedUrl.entities.length; i++) {
      this.commonEntitiesJson.entities[i] = [];
      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.commonEntitiesJson.entities[i][j] = '';
        this.commonEntitiesJson.entities[i][j] = await this.entitiesService
          .getEntityCommonalities(
            this.allEntitiesFixedUrl.entities[i].mainEntity,
            this.allEntitiesFixedUrl.entities[i].otherEntity[j]
          )
          .toPromise();
      }
    }

    //Get the final data with the URL
    for (let i = 0; i < this.commonEntitiesJson.entities.length; i++) {
      this.commonEntities.entities[i] = { common: [] };
      for (let j = 0; j < this.commonEntitiesJson.entities[i].length; j++) {
        this.commonEntities.entities[i].common[j] = [];

        this.commonEntities.entities[i].common[j] = JSON.parse(
          this.commonEntitiesJson.entities[i][j]
        );
      }
    }

    //Get the final data without the URL
    for (let i = 0; i < this.commonEntities.entities.length; i++) {
      this.commonEntitiesUrl.entities[i] = { common: [] };
      this.commonLength.entities[i] = { total: [] };
      for (let j = 0; j < this.commonEntities.entities[i].common.length; j++) {
        this.commonEntitiesUrl.entities[i].common[j] = [];

        this.commonLength.entities[i].total[j] =
          this.commonEntities.entities[i].common[j].length;
        for (
          let k = 0;
          k < this.commonEntities.entities[i].common[j].length;
          k++
        ) {
          this.commonEntitiesUrl.entities[i].common[j][k] = {
            predicate: '',
            object: '',
          };

          var words =
            this.commonEntities.entities[i].common[j][k].predicate.split('/');

          this.commonEntitiesUrl.entities[i].common[j][k].predicate =
            words[words.length - 1];

          //Split with ^^
          if (
            this.commonEntities.entities[i].common[j][k].object.includes('^^')
          ) {
            words =
              this.commonEntities.entities[i].common[j][k].object.split('^^');
            this.commonEntitiesUrl.entities[i].common[j][k].object = words[0];
          } else {
            words =
              this.commonEntities.entities[i].common[j][k].object.split('/');

            this.commonEntitiesUrl.entities[i].common[j][k].object =
              words[words.length - 1];

            if (this.commonEntitiesUrl.entities[i].common[j][k].object == '') {
              this.commonEntitiesUrl.entities[i].common[j][k].object =
                words[words.length - 2];
            }
          }
        }
      }
    }

    this.changesCommonEntity();
    this.loading = false;
  }

  changesCommonEntity() {
    if (this.changeEntityCommon == 0) {
      this.previousCommonEntity = true;
    } else {
      this.previousCommonEntity = false;
    }

    if (
      this.changeEntityCommon + 1 ==
      this.commonEntitiesUrl.entities[0].common.length
    ) {
      this.nextCommonEntity = true;
    } else {
      this.nextCommonEntity = false;
    }
  }

  commonPrvComp() {}

  commonNextComp() {}

  commonPrvEntity() {
    this.changeEntityCommon -= 1;
    this.changesCommonEntity();
  }

  commonNextEntity() {
    this.changeEntityCommon += 1;
    this.changesCommonEntity();
  }

  changePredicate(predicate: string) {
    this.getEntitiesSpecificPre(predicate);
  }

  async getSpecificPredicate() {
    this.loading = true;
    //Get JSON data
    for (let i = 0; i < this.allEntitiesFixedUrl.entities.length; i++) {
      this.specificPredJson.entities[i] = '';
      this.specificPredJson.entities[i] = await this.entitiesService
        .getEntityAllProperties(this.allEntitiesFixedUrl.entities[i].mainEntity)
        .toPromise();
    }

    //Get the final data with the URL
    for (let i = 0; i < this.specificPredJson.entities.length; i++) {
      this.specificPredUrl.entities[i] = [];
      this.specificPredUrl.entities[i] = JSON.parse(
        this.specificPredJson.entities[i]
      );
    }
    //Get the final data with out the URL
    for (let i = 0; i < this.specificPredUrl.entities.length; i++) {
      this.specificPred.entities[i] = [];

      for (let j = 0; j < this.specificPredUrl.entities[i].length; j++) {
        this.specificPred.entities[i][j] = { predicate: '' };
        var words = this.specificPredUrl.entities[i][j].predicate.split('/');
        this.specificPred.entities[i][j].predicate = words[words.length - 1];
      }
    }
    this.getEntitiesSpecificPre('22-rdf-syntax-ns#type');

    this.loading = false;
  }

  getEntitiesSpecificPre(predicate: string) {
    var predicateUrl: string = '';
    for (let i = 0; i < this.specificPredUrl.entities.length; i++) {
      for (let j = 0; j < this.specificPredUrl.entities[i].length; j++) {
        var words = this.specificPredUrl.entities[i][j].predicate.split('/');
        if (words.includes(predicate)) {
          predicateUrl = this.specificPredUrl.entities[i][j].predicate.replace(
            /[/]/gi,
            '%2F'
          );
          predicateUrl = predicateUrl.replace(/[#]/gi, '%23');
          this.fixTablesPredicate(predicateUrl);
        }
      }
    }
  }

  async fixTablesPredicate(pred: string) {
    this.loadingChange = true;

    //Get the JSON data
    for (let i = 0; i < this.allEntitiesFixedUrl.entities.length; i++) {
      this.specificPrEntities.entities[i] = {
        mainEntity: '',
        otherEntity: [],
      };

      this.specificPrEntities.entities[i].mainEntity =
        await this.entitiesService
          .getEntitySpecificProperty(
            this.allEntitiesFixedUrl.entities[i].mainEntity,
            pred
          )
          .toPromise();

      for (
        let j = 0;
        j < this.allEntitiesFixedUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.specificPrEntities.entities[i].otherEntity[j] =
          await this.entitiesService
            .getEntitySpecificProperty(
              this.allEntitiesFixedUrl.entities[i].otherEntity[j],
              pred
            )
            .toPromise();
      }
    }

    //Get the final data with the URL
    for (let i = 0; i < this.specificPrEntities.entities.length; i++) {
      this.specificPrFinalUrl.entities[i] = {
        mainEntity: [],
        otherEntity: [],
      };

      if (this.specificPrEntities.entities[i].mainEntity != 'Error') {
        this.specificPrFinalUrl.entities[i].mainEntity = JSON.parse(
          this.specificPrEntities.entities[i].mainEntity
        );
      } else {
        this.specificPrFinalUrl.entities[i].mainEntity = [];
      }

      for (
        let j = 0;
        j < this.specificPrEntities.entities[i].otherEntity.length;
        j++
      ) {
        if (this.specificPrEntities.entities[i].otherEntity[j] != 'Error') {
          this.specificPrFinalUrl.entities[i].otherEntity[j] = JSON.parse(
            this.specificPrEntities.entities[i].otherEntity[j]
          );
        } else {
          this.specificPrFinalUrl.entities[i].otherEntity[j] = [];
        }
      }
    }

    //Get the final data without the URL
    for (let i = 0; i < this.specificPrFinalUrl.entities.length; i++) {
      this.specificPrFinal.entities[i] = {
        mainEntity: [],
        otherEntity: [],
      };
      for (
        let k = 0;
        k < this.specificPrFinalUrl.entities[i].mainEntity.length;
        k++
      ) {
        this.specificPrFinal.entities[i].mainEntity[k] = {
          predicate: '',
          object: '',
        };

        var words =
          this.specificPrFinalUrl.entities[i].mainEntity[k].predicate.split(
            '/'
          );
        this.specificPrFinal.entities[i].mainEntity[k].predicate =
          words[words.length - 1];

        //Split with ^^
        if (
          this.specificPrFinalUrl.entities[i].mainEntity[k].object.includes(
            '^^'
          )
        ) {
          words =
            this.specificPrFinalUrl.entities[i].mainEntity[k].object.split(
              '^^'
            );
          this.specificPrFinal.entities[i].mainEntity[k].object = words[0];
        } else {
          words =
            this.specificPrFinalUrl.entities[i].mainEntity[k].object.split('/');
          this.specificPrFinal.entities[i].mainEntity[k].object =
            words[words.length - 1];

          if (this.specificPrFinal.entities[i].mainEntity[k].object == '') {
            this.specificPrFinal.entities[i].mainEntity[k].object =
              words[words.length - 2];
          }
        }
      }

      for (
        let j = 0;
        j < this.specificPrFinalUrl.entities[i].otherEntity.length;
        j++
      ) {
        this.specificPrFinal.entities[i].otherEntity[j] = [];

        for (
          let k = 0;
          k < this.specificPrFinalUrl.entities[i].otherEntity[j].length;
          k++
        ) {
          this.specificPrFinal.entities[i].otherEntity[j][k] = {
            predicate: '',
            object: '',
          };

          var words =
            this.specificPrFinalUrl.entities[i].otherEntity[j][
              k
            ].predicate.split('/');
          this.specificPrFinal.entities[i].otherEntity[j][k].predicate =
            words[words.length - 1];

          //Split with ^^
          if (
            this.specificPrFinalUrl.entities[i].otherEntity[j][
              k
            ].object.includes('^^')
          ) {
            words =
              this.specificPrFinalUrl.entities[i].otherEntity[j][
                k
              ].object.split('^^');
            this.specificPrFinal.entities[i].otherEntity[j][k].object =
              words[0];
          } else {
            words =
              this.specificPrFinalUrl.entities[i].otherEntity[j][
                k
              ].object.split('/');
            this.specificPrFinal.entities[i].otherEntity[j][k].object =
              words[words.length - 1];

            if (
              this.specificPrFinal.entities[i].otherEntity[j][k].object == ''
            ) {
              this.specificPrFinal.entities[i].otherEntity[j][k].object =
                words[words.length - 2];
            }
          }
        }
      }
    }

    this.changesSpecificPr();
    this.loadingChange = false;
  }

  changesSpecificPr() {
    if (this.changeEntitySpec == 0) {
      this.previousSpecEntity = true;
    } else {
      this.previousSpecEntity = false;
    }

    if (
      this.changeEntitySpec + 1 ==
      this.specificPrFinal.entities[0].otherEntity.length
    ) {
      this.nextSpecEntity = true;
    } else {
      this.nextSpecEntity = false;
    }
  }

  previousCompSpec() {
    this.changeCompSpec -= 1;
  }

  nextCompSpec() {
    this.changeCompSpec += 1;
  }

  previousEntitySpec() {
    this.changeEntitySpec -= 1;
    this.changesSpecificPr();
  }

  nextEntitySpec() {
    this.changeEntitySpec += 1;
    this.changesSpecificPr();
  }

  back() {
    this.router.navigateByUrl('/entities');
  }
}
