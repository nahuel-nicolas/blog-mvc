import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostsComponent } from './components/posts/posts.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PostNewComponent } from './components/post-new/post-new.component';
import { PostViewComponent } from './components/post-view/post-view.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/post', 
    pathMatch: 'full' 
  },
  { 
    path: 'post', 
    component: PostsComponent 
  },
  { 
    path: 'post/new', 
    component: PostNewComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'post/:slug', 
    component: PostViewComponent
  },
  { 
    path: 'post/:slug/edit', 
    component: PostEditComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'signin',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
