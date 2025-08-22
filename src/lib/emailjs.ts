import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

// Initialize EmailJS
export const initEmailJS = () => {
  try {
    emailjs.init(EMAILJS_CONFIG.USER_ID);
    console.log('✅ EmailJS initialized successfully');
    console.log('📧 EmailJS Config:', EMAILJS_CONFIG);
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error);
  }
};

// Send contact form email to admin
export const sendContactEmail = async (templateParams: any) => {
  try {
    console.log('📤 Sending contact email with params:', templateParams);
    console.log('📧 Using template:', EMAILJS_CONFIG.TEMPLATE_ID_CONTACT);
    console.log('🔧 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
    console.log('👤 User ID:', EMAILJS_CONFIG.USER_ID);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_CONTACT,
      templateParams,
      EMAILJS_CONFIG.USER_ID
    );
    
    console.log('✅ Contact email sent successfully:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ EmailJS contact email error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return { success: false, error };
  }
};

// Send auto-reply email to user
export const sendAutoReplyEmail = async (templateParams: any) => {
  try {
    console.log('📤 Sending auto-reply email with params:', templateParams);
    console.log('📧 Using template:', EMAILJS_CONFIG.TEMPLATE_ID_AUTO_REPLY);
    console.log('🔧 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
    console.log('👤 User ID:', EMAILJS_CONFIG.USER_ID);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_AUTO_REPLY,
      templateParams,
      EMAILJS_CONFIG.USER_ID
    );
    
    console.log('✅ Auto-reply email sent successfully:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ EmailJS auto-reply email error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return { success: false, error };
  }
};

// Test EmailJS connection
export const testEmailJS = async () => {
  try {
    console.log('🧪 Testing EmailJS connection...');
    console.log('📧 Current config:', EMAILJS_CONFIG);
    
    // Try to send a test email
    const testParams = {
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      from_name: 'Test User',
      from_email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email to verify EmailJS is working.',
      reply_to: 'test@example.com'
    };
    
    const result = await sendContactEmail(testParams);
    return result;
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    return { success: false, error };
  }
};
