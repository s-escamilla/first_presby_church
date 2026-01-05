# Admin Authentication System - README

## 🔐 Overview
Your admin area now has a complete authentication system with login/logout functionality and protected routes.

## 📁 File Structure

```
src/
├── admin/
│   ├── login.html          # Login page (entry point)
│   ├── dashboard.html      # Main admin dashboard (protected)
│   └── index.html          # Decap CMS collections (protected)
├── admin.html              # Redirect fallback to dashboard
├── _redirects              # Netlify redirect rules
└── assets/
    └── js/
        └── admin-auth.js   # Authentication utility library
```

## 🚀 How It Works

### 1. **Login Flow**
- User visits `/admin/` → redirects to `/admin/dashboard/`
- Dashboard checks authentication → redirects to `/admin/login/` if not logged in
- User enters credentials → session created → redirected to dashboard

### 2. **Session Management**
- Sessions stored in `localStorage` with expiration time
- "Remember Me" extends session to 24 hours (vs 4 hours default)
- Auto-logout when session expires
- Activity tracking extends session automatically

### 3. **Protected Routes**
- Dashboard (`/admin/dashboard/`)
- CMS Collections (`/admin/`)
- Both check authentication on page load
- Unauthorized users redirected to login

## 🔑 Default Credentials

**⚠️ IMPORTANT: Change these in production!**

```
Username: admin
Password: admin123

Username: editor
Password: editor123
```

### To Add/Change Credentials:
Edit `/src/admin/login.html` around line 163:

```javascript
credentials: [
    { username: 'admin', password: 'admin123', name: 'Admin User' },
    { username: 'editor', password: 'editor123', name: 'Editor User' },
    // Add more users here
]
```

## 🎯 URL Structure

| URL | Destination | Auth Required |
|-----|-------------|---------------|
| `/admin/` | Dashboard | ✅ Yes |
| `/admin/dashboard/` | Dashboard | ✅ Yes |
| `/admin/login/` | Login Page | ❌ No |
| `/admin/cms/` | CMS Collections | ✅ Yes |
| `/admin/collections/` | CMS Collections | ✅ Yes |

## 🛠️ Customization

### Change Session Duration
Edit `/src/assets/js/admin-auth.js`:

```javascript
const CONFIG = {
    sessionKey: 'adminSession',
    loginPath: '/admin/login/',
    dashboardPath: '/admin/dashboard/'
};
```

### Add Authentication to New Pages
Add to any admin page's `<head>`:

```html
<script src="/assets/js/admin-auth.js"></script>
<script>
    if (!AdminAuth.requireAuth()) {
        document.body.style.display = 'none';
    }
    AdminAuth.init();
</script>
```

### Add Logout Button
```html
<button onclick="AdminAuth.logout()">Logout</button>
```

### Check Auth Status Programmatically
```javascript
if (AdminAuth.isAuthenticated()) {
    // User is logged in
    const user = AdminAuth.getCurrentUser();
    console.log('Logged in as:', user.name);
}
```

## ✨ Features

### Dashboard Features
- 📊 Site statistics overview
- 🔗 Quick link to CMS collections
- 👤 User info with session time remaining
- 🚪 Logout button
- 📱 Fully responsive design
- ⌨️ Keyboard shortcuts

### Login Page Features
- 🔒 Secure credential validation
- 💾 "Remember Me" option
- ⏱️ Session expiration
- 📱 Mobile-friendly
- ⚠️ Error messages
- ✨ Smooth animations

### CMS Protection
- 🔐 Auth check before CMS loads
- 🏠 Dashboard link in header
- 👤 User name display
- 🚪 Logout from CMS

## 🔧 Production Setup

### 1. **Change Default Credentials**
Update the credentials array in `login.html`

### 2. **Consider Backend Authentication**
For production, consider:
- Server-side authentication (Node.js, PHP, etc.)
- OAuth (Google, GitHub, etc.)
- Decap CMS Git Gateway authentication
- JWT tokens
- Database user storage

### 3. **Enable HTTPS**
Always use HTTPS in production for secure authentication

### 4. **Add Rate Limiting**
Prevent brute force attacks by limiting login attempts

### 5. **Implement Password Reset**
Add email-based password recovery

## 📝 API Reference

### AdminAuth Object

```javascript
// Check if authenticated
AdminAuth.isAuthenticated() // → boolean

// Get current user
AdminAuth.getCurrentUser() // → { username, name, loginTime, expiresAt }

// Get session
AdminAuth.getSession() // → session object or null

// Logout
AdminAuth.logout() // → redirects to login

// Require auth (use on protected pages)
AdminAuth.requireAuth(currentPath) // → boolean

// Get time remaining
AdminAuth.getTimeRemaining() // → "2h 30m"

// Initialize auth monitoring
AdminAuth.init()

// Clear session
AdminAuth.clearSession()
```

## 🐛 Troubleshooting

### Issue: Redirects not working
- Check that `_redirects` file is in the build output (`public/`)
- Netlify-specific redirects work best on Netlify
- Use `admin.html` as fallback for other hosts

### Issue: Session lost on refresh
- Check browser localStorage is enabled
- Check for JavaScript errors in console
- Verify `admin-auth.js` is loading correctly

### Issue: Can't access CMS
- Ensure you're logged in first
- Check `/admin/` redirects to CMS (not dashboard)
- Verify Decap CMS configuration in `config.yml`

## 🔄 Workflow

1. Visit `/admin/`
2. Redirected to `/admin/dashboard/`
3. Auth check → redirected to `/admin/login/` if needed
4. Login with credentials
5. Redirected back to dashboard
6. Click "Open CMS Collections" to manage content
7. Use logout button when done

## 🎨 Styling

All styles are inline for easy portability. To customize:

- **Dashboard**: Edit styles in `/src/admin/dashboard.html`
- **Login**: Edit styles in `/src/admin/login.html`
- **CMS overlay**: Edit styles in `/src/admin/index.html`

## 📚 Next Steps

Consider adding:
- [ ] Two-factor authentication (2FA)
- [ ] Password strength requirements
- [ ] Login attempt logging
- [ ] User roles and permissions
- [ ] Activity audit trail
- [ ] API key management
- [ ] Backup and restore functionality

---

**Built with ❤️ for Intermediate Website Kit**
