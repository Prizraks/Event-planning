import {Component,OnInit} from '@angular/core';
import {FormGroup,FormControl, Validators,FormBuilder} from '@angular/forms';
import {LoginServices} from '../../../services/services';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component ({
  selector: 'app-addEvent',
  templateUrl: './addEvent.component.html',
})
export class AddEventComponent implements OnInit{

  formData: FormGroup;
  submitted=false;

  isMeridian = false;
  showSpinners = false;
  myTime: Date = new Date();

    constructor(private localeService: BsLocaleService,private router:Router,private services:LoginServices, private formBuilder:FormBuilder,private toastr:ToastrService){}
   
    ngOnInit(){
      this.formData=this.formBuilder.group({
        nameEvent:['',Validators.required],
        adress:['',Validators.required],
        theme:['',Validators.required],
        date:['',Validators.required],
        time:['',Validators.required],
        count:['',[Validators.required,Validators.min(2),this.chekInteger]]
      })
      this.localeService.use('ru');

    }

    get f(){
      return this.formData.controls;
   }

    addEvent(){
      this.submitted=true;

      if(this.formData.valid)
      {
        console.log("ff", this.formData.value.time);
         const event={
          nameEvent: this.formData.value.nameEvent,
          adress: this.formData.value.adress,
          theme: this.formData.value.theme,
          date: this.formData.value.date,
          time:this.formData.value.time,
          count: this.formData.value.count,
          userId:localStorage.getItem('userId')
        }
        this.services.addEvent(event).subscribe(
          (res: any) => {
            if(res.message=="success")
            { this.toastr.success('Мероприятие добавлено', 'Успешно.', {timeOut:3000});
              this.router.navigate(['/home/listEvent']);}
          },
          err => console.log(err)
        )
        console.log("eee", event);
      }
     
    }
    chekInteger(control:FormControl):{[s:string]:boolean}{
      if(!Number.isInteger(control.value)){
        return {"isDouble":true}
      }
      return null;
    }
}