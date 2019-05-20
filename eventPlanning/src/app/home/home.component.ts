import {Component,OnInit} from '@angular/core';
import {FormGroup,FormControl, Validators,FormBuilder} from '@angular/forms';
import {LoginServices} from '../../services/services';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router'

@Component ({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
    userName: string;

    constructor(private router:Router,private services:LoginServices){
      this.userName=localStorage.getItem('userName');
    }
   
    ngOnInit(){
      
    }
    logout(){
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      this.router.navigate(['/user/login']);
    }
}