import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Entities';
  data!: string;
  entered: boolean = false;
  sideNavStyles: any;
  mainStyles: any;

  opened: boolean = false;

  constructor() {
    this.mainStyles = {
      transition: 'margin-left .5s',
      padding: '16px',
      'z-index': 100,
    };
  }

  openNav() {
    this.entered = this.entered ? false : true;
    if (this.entered) {
      this.sideNavStyles = {
        width: '180px',
      };
      this.mainStyles = {
        marginLeft: '180px',
        transition: 'margin-left .5s',
        padding: '16px',
      };
    } else {
      this.sideNavStyles = {
        width: '0',
      };
      this.mainStyles = {
        marginLeft: '0',
        transition: 'margin-left .5s',
        padding: '16px',
      };
    }
  }
}
