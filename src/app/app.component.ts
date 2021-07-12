import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggedUserService } from './shared/services/logged-user.service';
import { TokenManagementService } from './shared/services/token-management.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  routerOnSubscription!: Subscription;

  constructor(
    private tokenManagementService: TokenManagementService,
    private router: Router,
    private loggedUserService: LoggedUserService
  ) { }

  ngOnInit() {
    this.checkOnRouterChange();
    this.checkOnExistsToken()
  }

  checkOnRouterChange = () => {
    this.routerOnSubscription = this.router.events.subscribe((result: any) => {
      if (result && result.url === '/auth/login') {
        const isUserLoggedIn = this.loggedUserService.isUserLoggedIn();
        if (isUserLoggedIn) {
          this.router.navigate(['/dashboard'])
        }
      }
    })
  }

  checkOnExistsToken = () => {
    const token = !!this.tokenManagementService.getItem();
    if (token) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  ngOnDestroy() {
    if (this.routerOnSubscription) {
      this.routerOnSubscription.unsubscribe();
    }
  }
}
