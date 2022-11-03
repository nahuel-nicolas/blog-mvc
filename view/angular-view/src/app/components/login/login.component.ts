import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {username: "", password: ""};

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signIn() {
    console.log(this.user)
    this.authService.signInUser(this.user)
      .subscribe(token => {
          console.log(token);
          localStorage.setItem('token', JSON.stringify(token));
          this.router.navigate(['/']);
        }
      )
  }

}