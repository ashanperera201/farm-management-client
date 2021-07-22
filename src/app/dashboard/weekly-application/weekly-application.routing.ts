import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklyApplicationListComponent } from './weekly-application-list/weekly-application-list.component';
import { WeeklyApplicationComponent } from './weekly-application.component';

const routes: Routes = [
  {
    path: '', component: WeeklyApplicationComponent, children:
      [
        { path: '', redirectTo: 'view-all', pathMatch: 'full' },
        { path: 'view-all', component: WeeklyApplicationListComponent },
        { path: '**', redirectTo: 'view-all' }
      ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeeklyApplicationRoutingModule { }
