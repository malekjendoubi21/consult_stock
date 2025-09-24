﻿namespace comsult_stock.Services
{
    public class SmtpSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public string Username { get; set; } = string.Empty; // anciennement User
        public string Password { get; set; } = string.Empty;
        public string From { get; set; } = string.Empty; // expéditeur
    }
}
