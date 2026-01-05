# Event Contact Form Component

## Overview
A reusable contact form component for visitors to request event scheduling. The form collects visitor information and event details, then sends the data to a configurable API endpoint.

## Features
- ✅ Client-side form validation
- ✅ Phone number auto-formatting
- ✅ Date validation (prevents past dates)
- ✅ Loading states during submission
- ✅ Success/error messaging
- ✅ Fully responsive design
- ✅ Accessible HTML with proper labels
- ✅ Customizable via CMS

## Form Fields
1. **Name** (required) - Text input
2. **Phone Number** (required) - Auto-formatted as (123) 456-7890
3. **Email Address** (required) - Validated email format
4. **Event Type** (required) - Dropdown with options:
   - Wedding
   - Baptism
   - Funeral
   - Special Service
   - Meeting
   - Other
5. **Preferred Event Date** (required) - Date picker (future dates only)
6. **Event Description** (required) - Textarea for details

## Adding to a Page via CMS

1. Navigate to **Admin → Pages**
2. Edit the page where you want the form
3. Click **Add Section** → **Event Contact Form**
4. Configure:
   - **Heading**: Form title (default: "Request an Event")
   - **Subheading**: Optional description text
   - **API Endpoint**: Server endpoint URL (default: "/api/event-contact")
   - **CSS Class**: Optional custom styling class
   - **Section ID**: Optional HTML ID for anchoring

5. Save and publish

## API Integration

### Default Endpoint
The form submits to `/api/event-contact` by default. You can change this in the CMS.

### Request Format
```javascript
POST /api/event-contact
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "(555) 123-4567",
  "email": "john@example.com",
  "eventType": "wedding",
  "eventDate": "2025-06-15",
  "eventDescription": "Looking to schedule a wedding ceremony...",
  "submittedAt": "2025-12-28T10:30:00.000Z"
}
```

### Expected Response
```javascript
// Success
{
  "success": true,
  "message": "Event request received"
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## Server-Side Setup

### Example Node.js/Express Handler
```javascript
app.post('/api/event-contact', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      eventType,
      eventDate,
      eventDescription,
      submittedAt
    } = req.body;

    // Validate data
    if (!name || !email || !phone || !eventType || !eventDate || !eventDescription) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Process the submission
    // - Save to database
    // - Send email notification
    // - Add to calendar
    // etc.

    res.json({
      success: true,
      message: 'Event request received'
    });

  } catch (error) {
    console.error('Event contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error processing request'
    });
  }
});
```

### Email Notification Example
```javascript
const nodemailer = require('nodemailer');

async function sendEventRequestEmail(formData) {
  const transporter = nodemailer.createTransport({
    // Your email configuration
  });

  await transporter.sendMail({
    from: 'noreply@yourchurch.org',
    to: 'events@yourchurch.org',
    subject: `New Event Request: ${formData.eventType}`,
    html: `
      <h2>New Event Request</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Event Type:</strong> ${formData.eventType}</p>
      <p><strong>Preferred Date:</strong> ${formData.eventDate}</p>
      <p><strong>Description:</strong></p>
      <p>${formData.eventDescription}</p>
      <hr>
      <p><small>Submitted: ${new Date(formData.submittedAt).toLocaleString()}</small></p>
    `
  });
}
```

## Customization

### Custom API Endpoint
Set the `data-api-endpoint` attribute on the form, or configure it in the CMS:
```javascript
// In CMS: API Endpoint field
// Value: https://yourserver.com/api/custom-endpoint
```

### Custom Styling
Add custom CSS class via CMS or target the default classes:
```scss
.event-contact-form-section {
  // Override background
  background: #fff;
  
  .event-contact-form {
    // Override form container
  }
  
  .submit-btn {
    // Override submit button
  }
}
```

### Modify Event Types
Edit `/src/_includes/components/event-contact-form.html`:
```html
<select id="eventType" name="eventType" required>
  <option value="">Select event type</option>
  <option value="wedding">Wedding</option>
  <option value="baptism">Baptism</option>
  <!-- Add your custom options here -->
  <option value="retreat">Retreat</option>
  <option value="conference">Conference</option>
</select>
```

## Validation Rules

- **Name**: Required, any text
- **Phone**: Required, 10 digits, auto-formatted
- **Email**: Required, valid email format
- **Event Type**: Required, must select from dropdown
- **Event Date**: Required, must be future date
- **Event Description**: Required, minimum 1 character

## Files Modified/Created

### Created
- `/src/_includes/components/event-contact-form.html` - Component template
- `/src/assets/js/event-contact-form.js` - Form handler JavaScript
- `/src/assets/sass/root.scss` - Form styles (appended)

### Modified
- `/src/_includes/layouts/page-with-sections.html` - Added form component import
- `/src/_includes/layouts/base.html` - Added JavaScript include
- `/src/admin/config.yml` - Added CMS configuration

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses native form validation + custom validation
- Fetch API for submission (polyfill if needed for older browsers)

## Accessibility
- Proper label associations
- Required field indicators
- Error messages announced to screen readers
- Keyboard navigable
- Focus management
- ARIA attributes where needed

## Testing Checklist
- [ ] Form validation works for all fields
- [ ] Phone number formats correctly
- [ ] Date picker prevents past dates
- [ ] Success message displays after submission
- [ ] Error message displays on failure
- [ ] Loading state shows during submission
- [ ] Form resets after successful submission
- [ ] Works on mobile devices
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Troubleshooting

### Form not submitting
1. Check browser console for errors
2. Verify API endpoint is correct
3. Check network tab for failed requests
4. Ensure server is handling CORS if on different domain

### Validation not working
1. Ensure JavaScript file is loaded
2. Check for JavaScript errors in console
3. Verify HTML field names match JavaScript selectors

### Styling issues
1. Check if CSS file is loaded
2. Verify no conflicting styles
3. Check browser dev tools for applied styles
4. Clear browser cache

## Future Enhancements
- [ ] Add reCAPTCHA spam protection
- [ ] File upload for event documents
- [ ] Multi-step form for complex events
- [ ] Save draft functionality
- [ ] Auto-save to localStorage
- [ ] Integration with Google Calendar
- [ ] SMS confirmation option
