using Microsoft.Extensions.Logging;
using PishingSimulation.Core.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PishingSimulation.Infrastructure.Templates
{
    public class TemplateService : ITemplateService
    {
        private readonly ILogger<TemplateService> _logger;
        private readonly Dictionary<string, string> _templateStore;

        public TemplateService(ILogger<TemplateService> logger)
        {
            _logger = logger;
            _templateStore = new Dictionary<string, string>
            {
                { "PhishingTemplate", GetDefaultPhishingTemplate() },
                { "ResetPasswordTemplate", GetResetPasswordTemplate() },
                { "SecurityAlertTemplate", GetSecurityAlertTemplate() }
            };
        }

        public Task<string> GetTemplateAsync(string templateName)
        {
            if (_templateStore.TryGetValue(templateName, out string? template))
            {
                return Task.FromResult(template);
            }
            
            _logger.LogWarning($"Template {templateName} not found");
            return Task.FromResult(string.Empty);
        }

        public string ReplaceTemplateVariables(string template, Dictionary<string, string> variables)
        {
            if (string.IsNullOrEmpty(template))
            {
                return template;
            }

            foreach (var variable in variables)
            {
                template = template.Replace($"{{{{{variable.Key}}}}}", variable.Value);
            }

            return template;
        }

        private string GetDefaultPhishingTemplate()
        {
            return @"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Important Security Update</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='border-bottom: 2px solid #0066cc; padding-bottom: 10px;'>
        <h1 style='color: #0066cc;'>Security Department</h1>
    </div>
    
    <div style='padding: 20px 0;'>
        <p>Dear {{name}},</p>
        
        <p>{{emailContent}}</p>
        
        <p style='text-align: center;'>
            <a href='{{trackingUrl}}' style='display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Verify My Identity</a>
        </p>
        
        <p>If you did not request this verification, please ignore this email. However, be aware that your account access may be limited until verification is complete.</p>
        
        <p>Thank you for your cooperation.</p>
        
        <p>Regards,<br>
        Security Team</p>
    </div>
    
    <div style='border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #666;'>
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>";
        }

        private string GetResetPasswordTemplate()
        {
            return @"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Password Reset Request</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='border-bottom: 2px solid #2ecc71; padding-bottom: 10px;'>
        <h1 style='color: #2ecc71;'>Password Reset</h1>
    </div>
    
    <div style='padding: 20px 0;'>
        <p>Hello {{name}},</p>
        
        <p>We received a request to reset your password. Please click the link below to create a new password:</p>
        
        <p style='text-align: center;'>
            <a href='{{trackingUrl}}' style='display: inline-block; background-color: #2ecc71; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Reset My Password</a>
        </p>
        
        <p>This link will expire in 24 hours. If you did not request a password reset, please ignore this email.</p>
        
        <p>Best regards,<br>
        Support Team</p>
    </div>
    
    <div style='border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #666;'>
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>";
        }

        private string GetSecurityAlertTemplate()
        {
            return @"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Security Alert: Action Required</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='border-bottom: 2px solid #e74c3c; padding-bottom: 10px;'>
        <h1 style='color: #e74c3c;'>Security Alert</h1>
    </div>
    
    <div style='padding: 20px 0;'>
        <p>Dear {{name}},</p>
        
        <p>We have detected unusual login activity on your account from a new device. If this was you, please confirm by clicking the link below:</p>
        
        <p style='text-align: center;'>
            <a href='{{trackingUrl}}' style='display: inline-block; background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Confirm New Device</a>
        </p>
        
        <p>If you did not attempt to log in recently, please click the link to secure your account immediately.</p>
        
        <p>For security reasons, we recommend changing your password regularly.</p>
        
        <p>Thank you,<br>
        Security Department</p>
    </div>
    
    <div style='border-top: 1px solid #ddd; padding-top: 15px; font-size: 12px; color: #666;'>
        <p>This message contains sensitive information. Please do not forward it.</p>
    </div>
</body>
</html>";
        }
    }
}
