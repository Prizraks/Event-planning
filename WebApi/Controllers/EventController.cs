using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebApi.Models;
using MimeKit;
using MailKit.Net.Smtp;
using WebApi.Services;
using System.Web;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    public class EventController : Controller
    {
        private readonly ApplicationContext db;
        public EventController(ApplicationContext context)
        {
            db = context;
        }

        [HttpPost]
        [Route("api/event/add")]
        public IActionResult AddEvent([FromBody] Event Obj)
        {
            db.Events.Add(Obj);
            db.SaveChanges();
            return Ok(new {message="success"});
        }

        [HttpPost]
        [Route("api/event/registration")]
        [Authorize]
        public IActionResult registrationForEvent([FromBody] UserEvent Obj)
        {
            var isData=db.UserEvents.FirstOrDefault(p=>p.evId==Obj.evId&&p.userId==Obj.userId);
            if(isData!=null)
                return Ok(new{message="rowIsInDb"});
                
            int countItem=db.UserEvents.Where(p=>p.evId==Obj.evId).Count();
            var eventItem=db.Events.FirstOrDefault(p=>p.Id==Obj.evId);
            if(countItem==eventItem.count)
                return Ok(new{message="countFull"});           

            db.UserEvents.Add(Obj);
            db.SaveChanges();
            return Ok(new {message="success"});
        }

        [HttpGet]
        [Route("api/event/get")]
        [Authorize]
         public IActionResult GetEvents( string idUser)
        {
            List <Event> data= new List<Event>();
            List<EventsUserModel> result=new List<EventsUserModel>();
            data=db.Events.ToList();   
            data.ForEach(x=>{
                EventsUserModel obj=new EventsUserModel();
                bool isUser;

                if(db.UserEvents.Count(p=>p.userId==idUser&&p.evId==x.Id)==0)
                    isUser=false;
                else isUser=true;
                
                obj.Id=x.Id;
                obj.adress=x.adress;
                obj.count=x.count;
                obj.date=x.date;
                obj.isUser=isUser;
                obj.nameEvent=x.nameEvent;
                obj.theme=x.theme;
                obj.time=x.time;
                obj.userId=x.userId;
                result.Add(obj);
            });
                return Ok(result);
            }                        
        }
}