import { Component, OnInit } from '@angular/core';
import {LoginServices} from '../../../services/services';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  id:string;
  user:string;
  email:string;
  fullName:string;
  roles:string[];
  dob:string;

  constructor(private services: LoginServices, private toastr:ToastrService,private router:Router) {}

  ngOnInit() {
    this.userInfo();
  }
  userInfo(){
    var datePipe = new DatePipe('ru');
    this.id=localStorage.getItem('userId');
    this.services.getUserInfo(this.id).subscribe((data:any)=>{
      this.user=data.user;
      this.email=data.email;
      this.fullName=data.fullName;
      this.roles=data.roles;
      this.dob=data.dob;
      //console.log("fff",this.info);
    });
    this.id="dsdsds";
  }

}
