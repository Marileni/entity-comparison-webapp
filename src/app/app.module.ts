import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntitiesComponent } from './entities/entities.component';
import { EntitiesMainComponent } from './entities/entities-main/entities-main.component';
import { EntitiesOtherComponent } from './entities/entities-main/entities-other/entities-other.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    EntitiesComponent,
    EntitiesMainComponent,
    EntitiesOtherComponent,
    InstructionsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
