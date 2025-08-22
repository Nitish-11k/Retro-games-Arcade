// EmailJS Configuration
// Update these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (from EmailJS dashboard)
  SERVICE_ID: 'service_s8rllyw',
  
  // Your EmailJS Template ID for contact form (from EmailJS dashboard)
  TEMPLATE_ID_CONTACT: 'template_yh1seyc',
  
  // Your EmailJS Template ID for auto-reply (from EmailJS dashboard)
  TEMPLATE_ID_AUTO_REPLY: 'template_gjlmh2t',
  
  // Your EmailJS User ID (from EmailJS dashboard)
  USER_ID: 'Aovc9JQTWxGqepmpU',
  
  // Admin email address to receive contact form submissions
  ADMIN_EMAIL: 'retroarcade1410@gmail.com',
};

// Template parameter mapping for contact form
export const CONTACT_TEMPLATE_PARAMS = {
  // These should match the variables in your EmailJS template
  to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
  from_name: '', // Will be filled dynamically
  from_email: '', // Will be filled dynamically
  subject: '', // Will be filled dynamically
  message: '', // Will be filled dynamically
  reply_to: '', // Will be filled dynamically
};

// Template parameter mapping for auto-reply
export const AUTO_REPLY_TEMPLATE_PARAMS = {
  // These should match the variables in your EmailJS template
  to_email: '', // Will be filled dynamically
  to_name: '', // Will be filled dynamically
  subject: '', // Will be filled dynamically
  message: '', // Will be filled dynamically
};
