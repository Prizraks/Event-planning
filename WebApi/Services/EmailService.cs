using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;

namespace WebApi.Services
{
    public class EmailService
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
 
            emailMessage.From.Add(new MailboxAddress("Администрация сайта", "ivanbrenov1991@gmail.com"));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = message
            };
             
            using (var client = new SmtpClient())
            {   
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync("ivanbrenov1991@gmail.com", "C9fO0eZzQ46");
                await client.SendAsync(emailMessage);                
 
                await client.DisconnectAsync(true);
            }
        }
    }
}