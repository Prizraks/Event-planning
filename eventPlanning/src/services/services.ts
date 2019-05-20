import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';

@Injectable()
export class LoginServices {
    constructor(private http: HttpClient) {

    }
    getUsersList() {
        return this.http.get('http://localhost:5000/api/val');
    }
    registr(userObj:any){
        return this.http.post('http://localhost:5000/api/user/register', userObj);
    }
    
    registrForEvent(userObj:any){
      return this.http.post('http://localhost:5000/api/event/registration', userObj);
    }
    login(userObj:any){
        return this.http.post('http://localhost:5000/api/user/login', userObj);
    }
    confirmEmail(data:any){
        return this.http.post('http://localhost:5000/api/verify/email', data);
    }

    roleMatch(allowedRoles): boolean {
        var isMatch = false;
        var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
        var userRole = payLoad.role;
        localStorage.setItem('userId',payLoad.userId);
        localStorage.setItem('userName',payLoad.userName);
        // localStorage.setItem('role',payLoad.role);
        // // localStorage.setItem('fio',payLoad.fio);
        // localStorage.setItem('dob',payLoad.dob);
        // localStorage.setItem('email',payLoad.email);
        allowedRoles.forEach(element => {
          if (userRole == element) {
            isMatch = true;
            return false;
          }
        });
        return isMatch;
      }
      addEvent(eventObj:any){
        return this.http.post('http://localhost:5000/api/event/add', eventObj);
      }
      getEvents(id:string){
        const params = new HttpParams().set('idUser', id);
        return this.http.get('http://localhost:5000/api/event/get',{params});
      }
      getUserInfo(id: string){
        const params = new HttpParams().set('id', id);
        return this.http.get('http://localhost:5000/api/profile', {params});
    }
}