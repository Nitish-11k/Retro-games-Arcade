# EmailJS Troubleshooting Guide

## 🚨 Current Issue
Your contact form is not sending emails to either the retro inbox or user mailbox.

## 🔧 What We've Fixed

1. **Installed EmailJS dependency**: Added `@emailjs/browser` package
2. **Proper client-side implementation**: Moved from server-side REST API to client-side SDK
3. **Global initialization**: EmailJS is now initialized globally in your app
4. **Better error handling**: Added comprehensive logging and error handling
5. **Test functionality**: Added a test button to debug EmailJS connection

## 📋 Next Steps to Fix Your Issue

### 1. Verify Your EmailJS Template IDs

**IMPORTANT**: The current code uses these template IDs:
- `template_contact` (for admin emails)
- `template_auto_reply` (for user auto-replies)

**You need to verify these match your actual EmailJS templates:**

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Check your **Email Templates** section
3. Note the exact **Template ID** for each template
4. Update `src/config/emailjs.ts` with the correct IDs

### 2. Check Your EmailJS Service Configuration

1. In EmailJS Dashboard, go to **Email Services**
2. Verify your Gmail service is properly configured
3. Check that `service_s8rllyw` is correct
4. Ensure your Gmail account has "Less secure app access" enabled or use App Passwords

### 3. Test EmailJS Connection

1. Go to your contact page: `/contact`
2. Click the **"🧪 Test EmailJS Connection"** button
3. Check the browser console for detailed logs
4. Look for success/error messages

### 4. Common Issues and Solutions

#### Issue: "Template not found" error
**Solution**: Update template IDs in `src/config/emailjs.ts`

#### Issue: "Service not found" error  
**Solution**: Verify service ID in EmailJS dashboard

#### Issue: "Authentication failed" error
**Solution**: Check your EmailJS User ID and Gmail service configuration

#### Issue: Emails sent but not received
**Solution**: 
- Check spam/junk folders
- Verify Gmail service is properly configured
- Check EmailJS dashboard for delivery status

### 5. Update Configuration

Edit `src/config/emailjs.ts` and update these values:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',
  TEMPLATE_ID_CONTACT: 'your_actual_contact_template_id',
  TEMPLATE_ID_AUTO_REPLY: 'your_actual_auto_reply_template_id',
  USER_ID: 'your_actual_user_id',
  ADMIN_EMAIL: 'retroarcade1410@gmail.com',
};
```

### 6. Test the Contact Form

1. Fill out the contact form
2. Submit with real data
3. Check browser console for logs
4. Check both email inboxes (admin and user)

## 🐛 Debug Information

The updated code includes extensive logging. Check your browser console for:

- ✅ EmailJS initialization status
- 📧 Configuration details
- 📤 Email sending attempts
- ✅ Success confirmations
- ❌ Error details

## 📞 If Still Not Working

1. **Check EmailJS Dashboard**: Look for any error messages or failed deliveries
2. **Verify Gmail Settings**: Ensure your Gmail account can send emails via third-party services
3. **Check Network Tab**: Look for failed API calls in browser dev tools
4. **EmailJS Status**: Check if EmailJS service is experiencing issues

## 🔄 Alternative Solutions

If EmailJS continues to have issues, we can implement:

1. **Nodemailer**: Server-side email sending
2. **SendGrid**: Professional email service
3. **Resend**: Modern email API
4. **Direct Gmail API**: Using Google's official API

## 📝 Template Variables

Your EmailJS templates should include these variables:

**Contact Template:**
- `{{to_email}}` - Admin email
- `{{from_name}}` - User's full name
- `{{from_email}}` - User's email
- `{{subject}}` - Message subject
- `{{message}}` - User's message
- `{{reply_to}}` - Reply-to email

**Auto-Reply Template:**
- `{{to_email}}` - User's email
- `{{to_name}}` - User's first name
- `{{subject}}` - Auto-reply subject
- `{{message}}` - Auto-reply message

## 🎯 Quick Test

1. Update your template IDs in the config
2. Click the test button on the contact page
3. Check console for success/error messages
4. If successful, try the actual contact form

Let me know what you see in the console and we can debug further!


