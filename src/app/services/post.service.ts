import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { DataSnapshot, SnapshotAction } from '@angular/fire/database/interfaces';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import Post from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsPath : string = '/posts';
  postsRef: AngularFireList<Post>;

  constructor(private db: AngularFireDatabase, @Inject(String) private groupID: string) {
    this.postsRef = db.list(groupID + this.postsPath);
  }

  observable(): Observable<Post[]> {
    return this.postsRef.valueChanges();
  }

  getAll(): Promise<DataSnapshot>{
    return this.postsRef.query.once('value', (value) => value.val())
  }

  create(post: any): any {
    return this.postsRef.push(post);
  }

  update(postID: string, value: any): Promise<DataSnapshot> {
    var query = this.postsRef.query.orderByChild("postID").equalTo(postID);
    return query.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        child.ref.update(value);
      })
    })
  }

  delete(postID: string): Promise<DataSnapshot> {
    var query = this.postsRef.query.orderByChild("postID").equalTo(postID);
    return query.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        child.ref.remove();
      })
    })
  }

  deleteAll(): Promise<void> {
    return this.postsRef.remove();
  }
}