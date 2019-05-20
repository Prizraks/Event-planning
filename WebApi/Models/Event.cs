using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Event
    {
        public int Id {get;set;}
        public string nameEvent {get;set;}
        public string adress {get;set;}
        public string theme {get;set;}
        public DateTime date {get;set;}
        public DateTime time {get;set;}
        public int count {get;set;}
        public string userId {get;set;}
        public ApplicationUser user {get;set;}
    }
}