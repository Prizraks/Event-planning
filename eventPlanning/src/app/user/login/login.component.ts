import {Component,OnInit} from '@angular/core';
import {FormGroup, Validators,FormBuilder} from '@angular/forms';
import {LoginServices} from '../../../services/services';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'

@Component ({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit{

  formLogin: FormGroup;
  submitted=false;
  UsersList:any[];

  constructor(private services: LoginServices,private formBuilder: FormBuilder, private toastr:ToastrService,private router:Router){}

  ngOnInit(){
    if (localStorage.getItem('token') != null)
    this.router.navigate(['/home']);

    this.formLogin = this.formBuilder.group({
      username :['',Validators.required],
      password: ['', [Validators.required,Validators.minLength(6)]],
    });
  }

  test(){
    this.services.getUsersList()
            .subscribe(
                (data: any[]) => (this.UsersList = data)
            );
  }

  logIn(){
    this.submitted=true;

    const data={
      userName:this.formLogin.value.username,
      password: this.formLogin.value.password
    }

    this.services.login(data).subscribe(
      (res: any) => {
        if(res.message=="IsEmailNotConfirmed")
        {this.toastr.error('Электронный адрес не подтвержден!', 'Ошибка.', {timeOut:3000});}
        else{
        localStorage.setItem('token', res.token);
        var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
        localStorage.setItem('userId',payLoad.userId);
        localStorage.setItem('userName',payLoad.userName);
        // localStorage.setItem('role',payLoad.role);
        // localStorage.setItem('fio',payLoad.fio);
        // localStorage.setItem('dob',payLoad.dob);
        // localStorage.setItem('email',payLoad.email);
        this.toastr.success('Пользователь верный', 'Успешно.', {timeOut:3000});
          this.router.navigate(['/home/listEvent']);}
      },
      err => {
        if (err.status == 400){
          this.toastr.error('Incorrect username or password.', 'Authentication failed.', {timeOut:3000});}
        else
          console.log(err);
      }
    );
  }
  get f(){
    return this.formLogin.controls;
  }
}