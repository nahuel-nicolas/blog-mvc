import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/interfaces/post.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit {
  post: Post = { body: "", title: "", slug: "", author: "" };
  posts: Post[] = [];
  already_used_slugs = new Set();
  isValidSlug = true;
  canSubmit: boolean = false;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('aba')
    const author = this.authService.getUserId();
    if (author) {
      this.post.author = author;
    }
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts
      posts.map(current_post => {
        this.already_used_slugs.add(current_post.slug)
      })
    });
  }

  inputChange(): void {
    if (this.post) {
      this.canSubmit = false;
      this.isValidSlug = !this.already_used_slugs.has(this.post.slug)
      if (this.isValidSlug) {
        if (this.post.title && this.post.body && this.post.slug && this.post.author) {
          // this.post has no null attr values
          this.canSubmit = true;
        }
      }
    }
  }

goHome(): void {
  this.router.navigate(['/']);
}

  create(): void {
    if (this.post) {
      this.postService.addPost(this.post)
        .subscribe(() => this.goHome());
    }
  }
}