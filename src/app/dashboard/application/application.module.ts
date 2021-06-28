import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { ApplicationAddComponent } from './application-add/application-add.component';
import { ApplicationRoutingModule } from './application.routing';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationListComponent,
    ApplicationCardComponent,
    ApplicationAddComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule
  ]
})
export class ApplicationModule { }
