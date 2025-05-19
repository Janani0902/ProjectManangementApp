using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectManagementApp.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProjectManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            // Check if the user exists based on the username
            var user = _context.Users.FirstOrDefault(u => u.Username == login.Username);

            if (user == null)
            {
                return Unauthorized(new { message = "Username does not exist" });
            }

          
            if (user.Password != login.Password)
            {
                return Unauthorized(new { message = "Incorrect password" });
            }

          
            if (user.Role != login.Role)
            {
                return Unauthorized(new { message = "You selected an incorrect role" });
            }

            var token = GenerateJwtToken(user.Username, user.Role);
            return Ok(new { token });
        }


        private string GenerateJwtToken(string username, string role)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.Role, role) 
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],   
                audience: _configuration["Jwt:Audience"], 
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class LoginDto
        {
            public string Username { get; set; }
            public string Role { get; set; }
            public string Password { get; set; }
        }

    }
}
