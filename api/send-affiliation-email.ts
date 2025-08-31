import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, userName, siteLink, message, timestamp } = req.body;

    // Validate required fields
    if (!userEmail || !userName || !siteLink) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email content
    const emailContent = `
New Affiliation Partnership Application

User Details:
- Name: ${userName}
- Email: ${userEmail}
- Submitted: ${new Date(timestamp).toLocaleString()}

Application Details:
- Website/Tool Link: ${siteLink}
- Message: ${message || 'No message provided'}

---
This application was submitted through the Validationly Partnership Program.
    `.trim();

    // Send email using a service like Resend, SendGrid, or similar
    // For now, we'll use a simple fetch to a webhook or email service
    
    // Example with Resend (you'll need to install resend package)
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    
    // For demonstration, I'll show how to structure the email sending
    // You can replace this with your preferred email service
    
    const emailData = {
      to: 'kaptan3k@gmail.com',
      from: 'noreply@validationly.com', // Your verified domain
      subject: `New Partnership Application - ${userName}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Affiliation Partnership Application</h2>
          
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1E293B; margin-top: 0;">User Details</h3>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
          </div>

          <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1E293B; margin-top: 0;">Application Details</h3>
            <p><strong>Website/Tool Link:</strong> <a href="${siteLink}" target="_blank">${siteLink}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #4F46E5;">
              ${message || 'No message provided'}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteLink}" target="_blank" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Visit Website
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">
          <p style="color: #64748B; font-size: 14px; text-align: center;">
            This application was submitted through the Validationly Partnership Program.
          </p>
        </div>
      `
    };

    // Send email using simple fetch to a webhook service
    // This is a simple implementation - in production you might want to use a dedicated email service
    
    try {
      // For now, we'll use a simple email service or webhook
      // You can replace this with Resend, SendGrid, or any other email service
      
      // Simple email sending via webhook (you can set this up with services like Zapier, Make.com, etc.)
      const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
      
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'kaptan3k@gmail.com',
            subject: `New Partnership Application - ${userName}`,
            html: emailData.html,
            text: emailData.text
          })
        });
      } else {
        // Fallback: Log to console for development
        console.log('Email would be sent to kaptan3k@gmail.com:', emailData);
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing affiliation application:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process application'
    });
  }
}
