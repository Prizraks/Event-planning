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
    public class ProfileController : Controller
    {
        private readonly ApplicationContext db;
        private UserManager<ApplicationUser> _userManager;
        public ProfileController(UserManager<ApplicationUser> userManager, ApplicationContext context)
        {
            db = context;
            _userManager=userManager;
        }

        [Authorize]
        [HttpGet]
        [Route("api/profile/")]
        public async Task <Object> GetUserInfo(string id)
        {
            UserInfo data=new UserInfo();
            var user=await _userManager.FindByIdAsync(id);

            data.user=user.UserName;
            data.fullName=user.FullName;
            data.dob=user.Dob.ToString("dd.MM.yyyy");
            data.email=user.Email;
            data.roles= await _userManager.GetRolesAsync(user);
            return Ok(data);
        }
    }
}
