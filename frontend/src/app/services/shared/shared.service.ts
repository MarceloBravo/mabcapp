import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public globalRemenberUser: boolean = false;
  public globalURL: string = 'http://127.0.0.1:8000/api/';
  public token: string = '';

  constructor() { }

  header(){
    return new HttpHeaders({
      'Content-type':'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  }
}
