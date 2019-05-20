using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class UserInfo
    {
        public string user { get; set; }
        public string fullName {get;set;}
        public string dob {get;set;}
        public string email { get; set; }
       
        public IList<string> roles { get; set; }
    }
}