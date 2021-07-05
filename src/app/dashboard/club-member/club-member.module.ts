import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubMemberComponent } from './club-member.component';
import { ClubMemberListComponent } from './club-member-list/club-member-list.component';
import { ClubMemberAddComponent } from './club-member-add/club-member-add.component';
import { ClubMemberCardComponent } from './club-member-card/club-member-card.component';
import { ClubMemberdRoutingModule } from './club-member.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClubMemberComponent,
    ClubMemberListComponent,
    ClubMemberAddComponent,
    ClubMemberCardComponent
  ],
  imports: [
    CommonModule,
    ClubMemberdRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class ClubMemberModule { }
