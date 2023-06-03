import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token: string = null;

  constructor( private http: HttpClient,
               private storage: Storage) { }

  login( username: string, password: string ) {

    console.log( '[login-service] login in ');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        username,
        password
      })
    };

    const headers = {
      'Content-Type':  'application/json',
      username,
      password
    }

    /*return HTTP.get(`${ URL }/api/portfolio/application_user/login`, {
      id: '12',
      message: 'test'
    }, headers);*/


    return this.http.get(`${ URL }/api/portfolio/application_user/login`, httpOptions );
    //return this.http2.get(`${ URL }/api/portfolio/application_user/login`, {},  headers);
  }

  register(user: User) {

    console.log( user );

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/application_user/create`, user )
      .subscribe( resp => {
          console.log(resp);

          if ( resp['ok'] === true ) {
            this.saveToken( resp['token'] );
            resolve(true);
          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
          }

      });
    });
  }

  registerUser(user: User) {

    console.log( user );

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/portfolio/application_user/create`, user )
      .subscribe( resp => {
          console.log(resp);

          if ( resp['ok'] === true ) {
            resolve(true);
          } else {
            resolve(false);
          }

      });
    });
  }

  updateApplicationUser(user: User) {
    console.log( user );

    return new Promise( resolve => {
      this.http.put(`${ URL }/api/portfolio/application_user/${user.application_user_id}`, user )
        .subscribe( resp => {
          console.log(resp);

          if ( resp['application_user_id'] ) {
            resolve(true);
          } else {
            resolve(false);
          }

        });
      });
  }

  async saveToken( token: string ) {

    this.token = token;
    await this.storage.set('token', token);

  }

  getApplicationUsers() {

    console.log( '[Users-service] init getApplicationUsers' );

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.get<User[]>(`${ URL }/api/portfolio/application_user`, httpOptions);
  }

  async inactivate(username: string) {

    const token = await this.storage.get('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: token
      })
    };

    return new Promise( resolve => {
      this.http.put(`${ URL }/api/portfolio/application_user/inactivate?username=${username}`, {}, httpOptions)
        .subscribe( 
          resp => {
            console.log(resp);

            if ( resp['ok'] == true) {
              resolve(true);
            } else {
              resolve(false);
            }
        },
        error => {
          console.log("error consultando la inactivacion del usuario");
          resolve(false);
        }
        )
      });
  }

}
