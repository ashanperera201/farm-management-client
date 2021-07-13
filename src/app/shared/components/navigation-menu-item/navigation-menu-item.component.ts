import { Component, OnInit } from '@angular/core';
import { MenuItemService } from '../../services/menu-item.service';

@Component({
  selector: 'app-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styleUrls: ['./navigation-menu-item.component.scss']
})
export class NavigationMenuItemComponent implements OnInit {

  asideMenuDropdown: any = 1;
  asideMenuScroll = 1;

  menuItems: any[] = [];
  currentIndex!: number;

  constructor(private menuItemService: MenuItemService) { }

  ngOnInit(): void {
    this.menuItems = this.menuItemService.getMenuItems();
  }


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