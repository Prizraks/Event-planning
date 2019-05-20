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

namespace WebApi.Controllers
{
    [ApiController]
    public class ApplicationUserController : Controller
    {
         private UserManager<ApplicationUser> _userManager;
        private readonly ApplicationSettings _appSettings;

        public ApplicationUserController( UserManager<ApplicationUser> userManager, IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _appSettings = appSettings.Value;
        }

        [HttpPost]
        [Route("api/verify/email")]
        public async  Task<Object> ConfirmUserAsync(IdToken data){

            var user= await _userManager.FindByIdAsync(data.userId);
           
            if (user == null)
            {
                return Ok(new{message="UserOrTokenNull"});
            }
            var chek=await _userManager.IsEmailConfirmedAsync(user);
                if (chek)
                {
                    return Ok(new { message="IsEmailConfirmed"});
                }
            var token=data.tokenUser.Replace("%2f","/").Replace("%2F","/");
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if(result.Succeeded)
                return Ok(result);
            else
                return Ok(result);
            
        }

        [HttpPost]
        [Route("api/user/register")]
        public async Task<Object> PostApplicationUserAsync(ApplicationUserModel model)
        {
            model.role = "user";
            var applicationUser = new ApplicationUser() {
                UserName = model.userName,
                Email = model.email,
                FullName = model.fullName,
                Dob=model.dob
            };

            try
            {
                var result= await _userManager.CreateAsync(applicationUser, model.password);
                await _userManager.AddToRoleAsync(applicationUser, model.role);
                if(result.Succeeded){
                    // генерация токена для пользователя
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(applicationUser);
                        var callbackUrl=$"http://localhost:4200/confirmEmail/{HttpUtility.UrlEncode(applicationUser.Id)}/{HttpUtility.UrlEncode(code)}";
                        EmailService emailService = new EmailService();
                        await emailService.SendEmailAsync(applicationUser.Email, "Confirm your account",
                        $"Подтвердите регистрацию, перейдя по ссылке: <a href='{callbackUrl}'>link</a>");
                        return Ok(result);
                }
                return Ok(result);
                
            }
            catch (Exception ex)
            { 

                throw ex;
            }
        }

        [HttpPost]
        [Route("api/user/login")]
        public async Task<IActionResult> Login(LoginModel data)
        {
            var user = await _userManager.FindByNameAsync(data.userName);

            if (user != null && await _userManager.CheckPasswordAsync(user, data.password))
            {
                var chek=await _userManager.IsEmailConfirmedAsync(user);
                if (!chek && user.UserName!="admin")
                    return Ok(new{message="IsEmailNotConfirmed"});

                var role=await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new IdentityOptions();

                 var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("userName",user.UserName),
                        new Claim("userId",user.Id),
                        new Claim(_options.ClaimsIdentity.RoleClaimType,role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
                return BadRequest(new { message = "Username or password is incorrect." });
        }
        
    }
}