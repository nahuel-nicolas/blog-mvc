import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Post } from '../../interfaces/post.interface';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  post: Post | undefined;
  posts: Post[] = [];
  already_used_slugs = new Set();
  slug: string | null = null
  isValidSlug = true;
  canSubmit: boolean = false;
  initPost: Post | undefined;
  author: String | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getPosts()
    
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts
      posts.map(current_post => {
        if (current_post.slug == this.slug) {
          this.post = current_post;
          this.initPost = JSON.parse(JSON.stringify(current_post))
          this.userService.getUser(current_post.author).subscribe(user => this.author = user.username)
          return;
        }
        this.already_used_slugs.add(current_post.slug)
      })
    });
  }

  inputChange(): void {
    if (this.post) {
      this.canSubmit = false;
      this.isValidSlug = !this.already_used_slugs.has(this.post.slug)
      if (this.isValidSlug) {
        if (this.post.title && this.post.body && this.post.slug) {
          // this.post has no null attr values
          if (JSON.stringify(this.post) != JSON.stringify(this.initPost)) {
            // this.post has changes
            this.canSubmit = true;
          }
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  delete() {
    if (this.post) {
      this.postService.deletePost(this.post)
        .subscribe(() => this.goBack());
    }
  }

  save(): void {
    if (this.post) {
      this.postService.updatePost(this.post)
        .subscribe(() => this.goBack());
    }
  }
}
