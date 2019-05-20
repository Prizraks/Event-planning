using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class ApplicationUserModel
    {
        public string userName { get; set; }
        public string fullName {get;set;}
        public DateTime dob {get;set;}
        public string email { get; set; }
        public string password { get; set; }
        public string role { get; set; }
    }
}