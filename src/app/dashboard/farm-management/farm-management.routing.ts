import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FarmManagementComponent } from './farm-management.component';
import { FarmListComponent } from './farm-list/farm-list.component';

const routes: Routes = [
    {
        path: '', component: FarmManagementComponent, children:
            [
                { path: '', redirectTo: 'view-farms', pathMatch: 'full' },
                { path: 'view-farms', component: FarmListComponent },
                { path: '**', redirectTo: 'view-farms' }
            ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FarmManagementRoutingModule { }
