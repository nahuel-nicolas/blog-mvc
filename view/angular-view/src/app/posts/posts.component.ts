import { Component, OnInit } from '@angular/core';

import { Post } from '../post.interface';
import { PostService } from '../post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    console.log('nba2')
    this.postService.getPosts()
    .subscribe(posts => this.posts = posts);
  }

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.postService.addPost({ name } as Post)
  //     .subscribe(post => {
  //       this.posts.push(post);
  //     });
  // }

  // delete(post: Post): void {
  //   this.postService.deletePost(post._id).subscribe();
  // }

}
