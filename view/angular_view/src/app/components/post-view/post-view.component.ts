import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Post } from '../../interfaces/post.interface';
import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { wordToUpperCase, getLocalDateString } from 'src/app/utilities';
@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  post: Post | undefined;
  posts: Post[] = [];
  slug: string | null = null
  author: String | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
      posts.map(current_post => {
        if (current_post.slug == this.slug) {
          this.post = current_post;
          if (this.post.created && this.post.updated) {
            this.post.created = getLocalDateString(this.post.created);
            this.post.updated = getLocalDateString(this.post.updated);
          }
          
          this.userService.getUser(current_post.author)
            .subscribe(user => this.author = wordToUpperCase(user.username))
        }
      })
    });
  }
}