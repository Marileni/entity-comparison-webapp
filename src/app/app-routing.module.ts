import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EntitiesMainComponent } from './entities/entities-main/entities-main.component';
import { EntitiesComponent } from './entities/entities.component';
import { InstructionsComponent } from './instructions/instructions.component';

const routes: Routes = [
  { path: '', redirectTo: '/entities', pathMatch: 'full' },
  {
    path: 'instructions',
    component: InstructionsComponent,
  },
  {
    path: 'entities',
    component: EntitiesComponent,
  },
  {
    path: 'entities/select',
    component: EntitiesMainComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
