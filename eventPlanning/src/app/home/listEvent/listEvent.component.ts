import {Component,OnInit, ViewChild} from '@angular/core';
import {LoginServices} from '../../../services/services';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component ({
  selector: 'app-listEvent',
  templateUrl: './listEvent.component.html',
})
export class ListEventComponent implements OnInit{
    displayedColumns: string[] = ['nameEvent','theme','adress', 'date','time','count','id','isUser'];
    dataSource = new MatTableDataSource();
    userId:string;  
    qwe:boolean;
         

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private router:Router,private services:LoginServices,private toastr:ToastrService){
      this.userId=localStorage.getItem('userId');
    }
    
    ngOnInit(){
      this.loadEvents();      
      this.dataSource.paginator = this.paginator;
      this.qwe=true; 
    }
    loadEvents(){
      var datePipe = new DatePipe('ru');
      this.services.getEvents(this.userId).subscribe(
        (data:any[]) => {
           for (let item of data)
            {  item.date=datePipe.transform(item.date+'Z',"dd MMM yyyy");
               item.time = datePipe.transform(item.time+'Z',"HH:mm");
            }            
          this.dataSource.data=data;          
    }
    )
  }
  registrForEvent(idEvent:string,idUser:string){
    const data={
      userId:idUser,
      evId:idEvent
    } 
    console.log("dd",data);
    this.services.registrForEvent(data).subscribe((res:any)=>{
    if(res.message=="countFull")
      this.toastr.error("Нет свободных мест","Отказ",{timeOut:2000});
    if(res.message=="rowIsInDb")
      this.toastr.error("Вы уже зарегестрированы на мероприятие","Отказ", {timeOut:2000});
    if(res.message=="success"){
      this.toastr.success("Вы зарегистрированы", "Успех", {timeOut:2000});
      this.loadEvents();
    }
    }
    ) 
  }
}