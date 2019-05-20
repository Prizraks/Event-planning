import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {LoginServices} from '../../../services/services'
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component ({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent implements OnInit{
    
formRegistr:FormGroup;
submitted = false;

    constructor(private localeService: BsLocaleService,public service:LoginServices,public router: Router, private formBuilder:FormBuilder, private toastr:ToastrService){}
    ngOnInit(){
        this.formRegistr=this.formBuilder.group({
            userName:['',[Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')]],
            fullName:['',Validators.required],
            dob:['',Validators.required],
            email:['',[Validators.required,Validators.email]],
            password:['',[Validators.required, Validators.minLength(6)]],
            confirmPassword:['',Validators.required],
        },{validator:this.chekPassword('password','confirmPassword')});

        this.localeService.use('ru');
    }

    get f(){
        return this.formRegistr.controls;
    }
    
    chekPassword(pass:string,passConfirm:string){
        return (group: FormGroup) => {
            const passwordInput = group.controls[pass];
            const passwordConfirmationInput = group.controls[passConfirm];
            if (passwordInput.value !== passwordConfirmationInput.value) {
              return passwordConfirmationInput.setErrors({passErr: true})
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
          }
    }
    registration(){
        this.submitted=true;
        if (this.formRegistr.invalid) {
            return;
        }
        var datePipe = new DatePipe('en-US');
        const user = {
            UserName: this.formRegistr.value.userName,
            FullName: this.formRegistr.value.fullName,
            Dob: datePipe.transform(this.formRegistr.value.dob,"dd/MMM/yyyy"),
            Email: this.formRegistr.value.email,
            Password: this.formRegistr.value.password,
        };
        console.log('XXXX', user);

        this.service.registr(user).subscribe(
            (res: any) => {
              if (res.succeeded) {
                this.formRegistr.reset();
                this.toastr.success('Учетная запись создана!', 'Регистрация выполнена', {timeOut:3000});
                this.toastr.info('Подтвердите электронный адрес перед входом в аккаунт!','Важно!',{timeOut:3000});
                this.router.navigate(['/user/login']);
              }
              else{
                res.errors.forEach(element => {
                  switch (element.code) {
                    case 'DuplicateUserName':
                      this.toastr.error('Пользователь существует!','Ошибка регистрации');
                      break;
                    case 'DuplicateEmail':
                      this.toastr.error('Email существует','Ошибка регистрации');
                      break;

                    default:
                    console.log('YYY',element.code);
                    this.toastr.error(element.description,'Ошибка регистрации');
                      break;
                  }
                });
              }
            },
            err => {
              console.log(err);
            }
          );
    }
}