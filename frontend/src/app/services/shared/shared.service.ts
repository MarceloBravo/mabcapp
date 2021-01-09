import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../class/User/user';
import { Rol } from 'src/app/class/rol/rol';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public globalRememberUser: boolean = false;
  public globalURL: string = 'http://127.0.0.1:8000/api/';
  public user: User = new User();
  public roles!: Rol[];

  constructor() { }

  header(token: string){
    return new HttpHeaders({
      'Content-type':'application/json',
      'Authorization': `Bearer ${token}`
    })
  }
}
