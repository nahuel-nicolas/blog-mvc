import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { User } from 'src/app/interfaces/user.interface';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = {username: "", password: ""};

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  signUp() {
    this.authService.signUpUser(this.user)
      .subscribe(
        user => {
          this.authService.signInUser(user)
            .subscribe(token => {
              console.log(token);
              localStorage.setItem('token', JSON.stringify(token));
              this.router.navigate(['/']);
            })
        }
      )
  }
}
