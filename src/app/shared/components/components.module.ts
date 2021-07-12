import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { NavigationContentComponent } from './navigation-content/navigation-content.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    SideNavigationComponent,
    NavigationContentComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToolbarComponent,
    SideNavigationComponent,
    NavigationContentComponent
  ]
})
export class ComponentsModule { }
