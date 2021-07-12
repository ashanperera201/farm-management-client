import { Component, OnInit } from '@angular/core';
import { NavigationModes } from '../shared/enums/navigation.enum';
import { MenuItemService } from '../shared/services/menu-item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  navigationModes = NavigationModes;
  asideMenuDropdown: any = 1;
  asideMenuScroll = 1;

  menuItems: any[] = [];
  currentIndex!: number;

  constructor(private menuItemService: MenuItemService) { }

  ngOnInit(): void {
    this.menuItems = this.menuItemService.getMenuItems();
  }

  // menu related methods

  onMenuItemClick = (index: number) => {
    if (this.currentIndex >= 0) {
      this.menuItems[this.currentIndex].selected = !this.menuItems[this.currentIndex].selected;
      this.menuItems[this.currentIndex].activeClass = '';
      this.currentIndex = -1;
    }
    this.menuItems[index].selected = !this.menuItems[index].selected;
    this.menuItems[index].activeClass = this.menuItems[index].selected ? 'menu-item-active' : '';
    this.currentIndex = index;
  }
}
