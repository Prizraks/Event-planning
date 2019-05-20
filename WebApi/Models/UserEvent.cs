using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class UserEvent
    {
        public string Id {get;set;}
        public string userId {get;set;}
        public ApplicationUser user {get;set;}
        public int evId {get;set;}
        public Event ev {get;set;}
    }
}