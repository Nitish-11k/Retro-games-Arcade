import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create email data for admin
    const adminEmailData = {
      to: 'retroarcade1410@gmail.com',
      from: email,
      subject: `Contact Form: ${subject} - ${firstName} ${lastName}`,
      message: `
        New contact form submission:
        
        Name: ${firstName} ${lastName}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
        
        Submitted at: ${new Date().toISOString()}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `
    };

    // Create automatic response based on user intent
    const userIntent = subject.toLowerCase();
    let autoResponseSubject = '';
    let autoResponseMessage = '';

    if (userIntent.includes('feedback') || userIntent.includes('suggestion')) {
      autoResponseSubject = 'Thank you for your feedback! 🎮';
      autoResponseMessage = `
        Hi ${firstName},
        
        Thank you so much for taking the time to share your feedback with us! We really appreciate hearing from our players.
        
        Your input helps us make Retro Arcade Zone even better. We'll review your message carefully and take your suggestions into consideration for future updates.
        
        If you have any additional thoughts or want to discuss this further, feel free to reply to this email.
        
        Happy gaming!
        The Retro Arcade Zone Team
      `;
    } else if (userIntent.includes('support') || userIntent.includes('bug') || userIntent.includes('technical')) {
      autoResponseSubject = 'We\'re on it! 🛠️ Technical Support Request Received';
      autoResponseMessage = `
        Hi ${firstName},
        
        Thank you for reaching out about the technical issue you're experiencing. We understand how frustrating it can be when games don't work as expected.
        
        Our support team has been notified and will investigate this matter. We typically respond to technical issues within 24 hours.
        
        In the meantime, you can try:
        - Refreshing your browser
        - Clearing your browser cache
        - Using a different browser
        
        We'll get back to you as soon as possible with a solution!
        
        Best regards,
        The Retro Arcade Zone Support Team
      `;
    } else if (userIntent.includes('partnership') || userIntent.includes('business')) {
      autoResponseSubject = 'Partnership Opportunity - Let\'s Connect! 🤝';
      autoResponseMessage = `
        Hi ${firstName},
        
        Thank you for your interest in partnering with Retro Arcade Zone! We're always excited to explore new opportunities and collaborations.
        
        Our team will review your proposal and get back to you within 2-3 business days to discuss how we can work together.
        
        In the meantime, feel free to check out our current games and features to get a better understanding of what we offer.
        
        We look forward to potentially working with you!
        
        Best regards,
        The Retro Arcade Zone Business Team
      `;
    } else if (userIntent.includes('complaint') || userIntent.includes('issue') || userIntent.includes('problem')) {
      autoResponseSubject = 'We\'re sorry to hear that 😔 - Issue Report Received';
      autoResponseMessage = `
        Hi ${firstName},
        
        We're truly sorry that you've had a negative experience with Retro Arcade Zone. Your satisfaction is important to us, and we want to make things right.
        
        We've received your complaint and our team will investigate this matter immediately. We take all feedback seriously and will address your concerns promptly.
        
        Please expect a detailed response from us within 24 hours. If this is urgent, please reply to this email with "URGENT" in the subject line.
        
        Thank you for bringing this to our attention, and we apologize for any inconvenience caused.
        
        Sincerely,
        The Retro Arcade Zone Team
      `;
    } else {
      // General inquiry
      autoResponseSubject = 'Thank you for contacting us! 📧';
      autoResponseMessage = `
        Hi ${firstName},
        
        Thank you for reaching out to Retro Arcade Zone! We've received your message and appreciate you taking the time to contact us.
        
        Our team will review your inquiry and get back to you with a detailed response within 24 hours.
        
        In the meantime, feel free to explore our collection of retro games and enjoy some nostalgic gaming!
        
        Best regards,
        The Retro Arcade Zone Team
      `;
    }

    const userEmailData = {
      to: email,
      from: 'retroarcade1410@gmail.com',
      subject: autoResponseSubject,
      message: autoResponseMessage,
      html: autoResponseMessage.replace(/\n/g, '<br>')
    };

    // Log both emails (for development/testing)
    console.log('Admin email data:', adminEmailData);
    console.log('User auto-response data:', userEmailData);

    // For now, we'll simulate success
    // The emails are logged above and can be sent via your preferred email service
    
    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        autoResponse: 'Automatic response sent to user',
        adminEmail: adminEmailData,
        userEmail: userEmailData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
