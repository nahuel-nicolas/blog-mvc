import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Post } from '../../interfaces/post.interface';
import { PostService } from '../../services/post.service';
import { User } from 'src/app/interfaces/user.interface';
import { Users } from 'src/app/interfaces/users.interface';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/interfaces/comment.interface';
import { CommentService } from 'src/app/services/comment.service';
import { getLocalDateString, wordToUpperCase, log } from 'src/app/utilities';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent implements OnInit {
  post: Post | undefined;
  posts: Post[] = [];
  slug: string | null = null

  users:  Users | null = null;
  author: User | undefined;

  comments: Comment[] = [];
  comment: Comment = { body: "", author: "", post: "" }

  canSubmit: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    log.debug(this.posts)
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts
      log.debug(this.posts)
      posts.map(current_post => {
        if (current_post.slug == this.slug) {
          this.post = current_post;
          this.getUsers(current_post);
        }
      })
    });
  }

  getUsers(post: Post): void {
    this.userService.getUsers().subscribe(users => {
      log.debug(users)
      this.users = users;
      this.author = users[post.author];
      this.comment.author = this.author.id ? this.author.id : "";
      this.comment.post = post.id ? post.id : "";
      this.getComments(post.id)
    });
  }

  getComments(postId: string | undefined): void {
    this.commentService.getComments().subscribe(comments => {
      this.comments = comments.filter(comment => comment.post === postId)
      .map(comment => this.formatComment(comment));
    });
  }

  formatComment(comment: Comment): Comment {
    let formattedComment = JSON.parse(JSON.stringify(comment));
    if (this.users) {
      formattedComment.author = wordToUpperCase(this.users[comment.author].username);
      formattedComment.created = getLocalDateString(formattedComment.created);
    }
    return formattedComment;
  }

  inputChange(): void {
    if (this.comment) {
      this.canSubmit = false;
      if (this.comment.body) {
        this.canSubmit = true;
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  reload(): void {
    location.reload();
  }

  create(): void {
    if (this.post) {
      this.commentService.addComment(this.comment)
        .subscribe(() => this.reload());
    }
  }
}
