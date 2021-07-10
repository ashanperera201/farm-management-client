import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClubMemberComponent } from './club-member.component';
import { ClubMemberAddComponent } from './club-member-add/club-member-add.component';

const routes: Routes = [
    {
        path: '', component: ClubMemberComponent,
        children: [
            // { path: 'create', component: ClubMemberAddComponent }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubMemberdRoutingModule { }
