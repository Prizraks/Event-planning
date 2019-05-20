import {Component,OnInit} from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';
import {LoginServices} from '../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component ({
  selector: 'app-comfirmemail',
  templateUrl: './comfirmEmail.component.html',
})
export class ConfirmEmailComponent implements OnInit{

    id:string;
    token:string;

    constructor(private router:Router,private activateRoute: ActivatedRoute,public service:LoginServices, private toastr:ToastrService){
        this.id = activateRoute.snapshot.params['id'];
        this.token = activateRoute.snapshot.params['token'];
        const data={
            userId:this.id,
            tokenUser:this.token
        }

        this.service.confirmEmail(data).subscribe(
            (res: any) => {
                if(res.message=="UserOrTokenNull"){
                    this.toastr.error('Пользователь отсутсвует!', 'Ошибка.', {timeOut:3000,positionClass:'toast-top-full-width'});
                    this.router.navigate(['/user/login']);}
                else if(res.message=="IsEmailConfirmed"){
                    this.toastr.error('@mail подтвержден ранее!', 'Ошибка.', {timeOut:3000,positionClass:'toast-top-full-width'});
                    this.router.navigate(['/user/login']);}
                else if(res.succeeded){ 
                    this.toastr.success('@mail подтвержден!', 'Успех.', {timeOut:3000,positionClass:'toast-top-full-width'});
                    this.router.navigate(['/user/login']);}
                else {this.toastr.error('Неверный токен!','Ошибка.',{timeOut:3000,positionClass:'toast-top-full-width'});
                    this.router.navigate(['/user/login']);}
            }
        );
    }
   
    ngOnInit(){}
}