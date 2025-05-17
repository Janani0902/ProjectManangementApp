namespace ProjectManagementApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; } // "Admin" or "Viewer"
        public string Password { get; set; }
    }

}
