# ✅ Collections API System - Complete!

## What You Now Have

### 1. **API-Driven Collections System**
Your collections (events, communications) can now be populated from an external API server instead of static Nunjucks/Decap data.

### 2. **Key Files Created**

#### JavaScript (`src/assets/js/collections-api.js`)
- Fetches data from `/api/database` (local) or any external URL
- Renders events, calendar views, and communications dynamically
- Handles loading states, errors, and caching
- Works with your existing modal/interaction scripts

#### Template (`src/_includes/components/collections-section-api.html`)
- Simplified version that renders empty containers
- JavaScript populates them at runtime
- No more Nunjucks loops for events/communications

#### Documentation
- `API-MIGRATION-GUIDE.md` - Full migration instructions
- `DATABASE-API-GUIDE.md` - Database usage examples
- `DATABASE-SETUP-COMPLETE.md` - PHP API setup info

## How It Works Now

### Current Flow (Local API):
```
Browser → collections-api.js → /api/database/index.php → data.json → Browser
```

### Future Flow (External Server):
```
Browser → collections-api.js → https://your-api-server.com → Database → Browser
```

## To Switch from Decap to API

### Option 1: Replace Template (Full API mode)

```bash
# Backup current template
mv src/_includes/components/collections-section.html \
   src/_includes/components/collections-section-decap-backup.html

# Use API version
mv src/_includes/components/collections-section-api.html \
   src/_includes/components/collections-section.html

# Rebuild
npm run build
```

### Option 2: Keep Both (Gradual Migration)

In your page templates, change:
```liquid
{% from "components/collections-section.html" import render as collectionsSection %}
```
To:
```liquid
{% from "components/collections-section-api.html" import render as collectionsSection %}
```

## Current State

✅ **collections-api.js** is loaded on all pages  
✅ **Auto-initializes** on page load  
✅ **Uses local API** at `/api/database/index.php`  
⏳ **Still using Nunjucks templates** (until you switch)

## To Use External API Server

Edit `src/assets/js/collections-api.js` (line ~408):

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Change this URL to your external server
    const apiUrl = 'https://api.yourchurch.com';  // ← CHANGE THIS
    
    const collectionsAPI = new CollectionsAPI(apiUrl);
    collectionsAPI.initializeAll();
});
```

Then rebuild:
```bash
npm run build
```

## External API Requirements

Your server must accept POST requests like this:

**Request:**
```json
POST /api
Content-Type: application/json

{
    "functionname": "get",
    "collection": "events",
    "arguments": {}
}
```

**Response:**
```json
{
    "success": true,
    "result": [
        {
            "id": "unique-id",
            "title": "Sunday Service",
            "date": "2026-01-15T20:00:00Z",
            "location": "Church Chapel",
            "details": "Event description",
            "created_at": "2026-01-15T12:00:00+00:00"
        }
    ],
    "error": null
}
```

## Supported Collections

- ✅ **events** - Church events with title, date, location, details
- ✅ **communications** - Church announcements
- ✅ **event_requests** - Contact form submissions
- ⚠️ **staff** - Still using Nunjucks (can be migrated later)

## Testing

### Test Local API:
```
http://localhost:8080/api-test/
```

### Test in Browser Console:
```javascript
const api = new CollectionsAPI('/api/database');
const events = await api.getEvents();
console.log(events);
```

### Check Current Mode:
```javascript
// Are you still using Nunjucks or API?
// Open page source and search for:
// - If you see event data in HTML = Nunjucks mode
// - If you see "Loading events..." = API mode
```

## Benefits of This Setup

✅ **No Rebuild Required** - Update events without rebuilding site  
✅ **Real-Time Updates** - Changes appear immediately  
✅ **Centralized Data** - One API can serve multiple sites  
✅ **Easy Migration** - Switch API URL anytime  
✅ **Fallback Ready** - Can still use Decap if needed

## Next Steps

### Immediate:
1. Test current setup with local API
2. Verify events and communications load correctly
3. Check browser console for any errors

### Later:
1. Set up your external API server (Node.js, Python, PHP, etc.)
2. Implement the same endpoint format
3. Add CORS headers
4. Update API URL in `collections-api.js`
5. Switch to `collections-section-api.html` template
6. Remove Decap CMS (optional)

## Rollback

To go back to Decap/Nunjucks mode:

```bash
# Remove API script from base.html
# OR just don't switch to collections-section-api.html

# Your site will work as before
```

## Configuration File

Create a config file for easy API switching:

```javascript
// src/assets/js/api-config.js
window.API_CONFIG = {
    baseUrl: '/api/database',  // Local
    // baseUrl: 'https://api.yourserver.com',  // External
    timeout: 5000,
    retries: 3
};
```

Then update `collections-api.js` to use it:
```javascript
const apiUrl = window.API_CONFIG?.baseUrl || '/api/database';
```

## Support

- Check `API-MIGRATION-GUIDE.md` for detailed instructions
- Check `DATABASE-API-GUIDE.md` for database usage
- Test page: `/api-test/`
- Browser DevTools console for errors

---

**You're all set!** 🎉 

The system is ready to use your local API, and you can easily point it to an external server whenever you're ready.
