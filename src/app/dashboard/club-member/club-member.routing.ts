import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClubMemberComponent } from './club-member.component';
import { ClubMemberListComponent } from './club-member-list/club-member-list.component';

const routes: Routes = [
    {
        path: '', component: ClubMemberComponent,
        children: [
            { path: '', redirectTo: 'view-all', pathMatch: 'full' },
            { path: 'view-all', component: ClubMemberListComponent },
            { path: '**', redirectTo: 'view-all' }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubMemberdRoutingModule { }
