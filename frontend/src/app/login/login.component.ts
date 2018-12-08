import {Component, Input, OnInit} from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../_services';
import { User } from './user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() user: User;
  loading = false;

  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.currentAuthValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.initUser();
  }

  login() {

    if (!this.user.username || !this.user.password){
      return;
    }

    this.loading = true;
    this.authService.login(this.user.username, this.user.password)
      .pipe(first()).subscribe(
        data => {
          this.loading = false;
          this.router.navigate(['/']);
        },
      error => {
          console.log(error);
          this.loading = false;
      });
  }

  logout() {
    this.authService.logout();
  }

  private initUser() {
    this.user = {
      username: '',
      password: ''
    };
  }
}
