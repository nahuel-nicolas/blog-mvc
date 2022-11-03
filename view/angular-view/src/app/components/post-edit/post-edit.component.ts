import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Post } from '../../interfaces/post.interface';
import { PostService } from '../../services/post.service';

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

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getPosts()
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        this.posts = posts
        posts.map(current_post => {
          if (current_post.slug == this.slug) {
            this.post = current_post;
            return;
          }
          this.already_used_slugs.add(current_post.slug)
          console.log(this.post)
        })
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.post) {
      this.postService.updatePost(this.post)
        .subscribe(() => this.goBack());
    }
  }
}
