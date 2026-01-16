# Converting Collections to API-Driven

This guide shows how to convert your Nunjucks/Decap collections to fetch data from an external API.

## What Was Created

### 1. **collections-api.js** (`src/assets/js/collections-api.js`)
A JavaScript class that:
- Fetches data from your API
- Renders events, calendar views, and communications
- Handles loading states and errors
- Works with your existing modal/interaction JavaScript

### 2. **collections-section-api.html** (`src/_includes/components/collections-section-api.html`)
A simplified Nunjucks template that:
- Renders empty containers
- Shows loading states
- Gets populated by JavaScript at runtime

## How to Switch to API-Driven Collections

### Step 1: Include the API JavaScript

Add this to your base layout (before the closing `</body>` tag):

```html
<!-- In src/_includes/layouts/base.html -->
<script src="/assets/js/collections-api.js"></script>
```

### Step 2: Replace the Collection Component

**Option A: Replace the existing file (recommended for full API)**

```bash
# Backup the old file
mv src/_includes/components/collections-section.html src/_includes/components/collections-section-backup.html

# Use the API version
mv src/_includes/components/collections-section-api.html src/_includes/components/collections-section.html
```

**Option B: Use both (for gradual migration)**

In your page templates, change from:
```liquid
{% from "components/collections-section.html" import render as collectionsSection %}
```

To:
```liquid
{% from "components/collections-section-api.html" import render as collectionsSection %}
```

### Step 3: Configure Your API URL

By default, `collections-api.js` uses `/api/database` (your local PHP API).

To use an external server, edit `collections-api.js`:

```javascript
// In collections-api.js, around line 408
document.addEventListener('DOMContentLoaded', () => {
    // Change this to your external API URL
    const apiUrl = 'https://your-api-server.com/api';
    
    const collectionsAPI = new CollectionsAPI(apiUrl);
    collectionsAPI.initializeAll();
});
```

### Step 4: Rebuild and Test

```bash
npm run build
npm run preview
```

Visit http://localhost:8080 and check:
- Events section loads
- Communications load
- Calendar view works

## API Requirements

Your external API must respond to POST requests with this format:

### Request Format:
```json
{
    "functionname": "get",
    "collection": "events",
    "arguments": {}
}
```

### Response Format:
```json
{
    "success": true,
    "result": [
        {
            "id": "unique-id",
            "title": "Event Title",
            "date": "2026-01-15T20:00:00Z",
            "location": "Church Chapel",
            "details": "Event details here",
            "created_at": "2026-01-15T12:00:00+00:00"
        }
    ],
    "error": null
}
```

### Supported Collections:
- `events`
- `communications`
- `event_requests`

## Migrating to External Server

### Current Setup (Local PHP):
```
Your Site → /api/database/index.php → data.json
```

### Future Setup (External Server):
```
Your Site → https://api.yourserver.com → MongoDB/PostgreSQL/etc
```

### Steps to Migrate:

1. **Set up your external API server** (Node.js, Python, PHP, etc.)

2. **Implement the same endpoints**:
   - POST `/api` or similar
   - Accept: `functionname`, `collection`, `arguments`
   - Return: `{success, result, error}`

3. **Update the API URL** in `collections-api.js`:
   ```javascript
   const apiUrl = 'https://api.yourserver.com';
   ```

4. **Add CORS headers** on your API server:
   ```javascript
   // Node.js/Express example
   app.use((req, res, next) => {
       res.header('Access-Control-Allow-Origin', 'https://yoursite.com');
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
   });
   ```

5. **Test and deploy**

## Advantages of API-Driven Approach

✅ **No rebuild needed** - Update data without rebuilding the site  
✅ **Real-time updates** - Data changes appear immediately  
✅ **Centralized data** - One API serves multiple sites  
✅ **Scalable** - Add more data sources easily  
✅ **Admin-friendly** - Non-technical users can update via admin panel  

## Testing

Use the test page to verify API connectivity:

```
http://localhost:8080/api-test/
```

Or use browser DevTools:
```javascript
const api = new CollectionsAPI('/api/database');
const events = await api.getEvents();
console.log(events);
```

## Fallback to Static Data

If you want to keep static data as fallback:

```javascript
// In collections-api.js
async fetchCollection(collectionName) {
    try {
        // Try API first
        const response = await fetch(`${this.apiBaseUrl}/index.php`, {...});
        // ... existing code
    } catch (error) {
        // Fallback to static JSON
        const staticData = await fetch(`/data/${collectionName}.json`);
        return await staticData.json();
    }
}
```

## Troubleshooting

**Events not loading:**
- Check browser console for errors
- Verify API URL is correct
- Check CORS headers if using external API
- Ensure API returns proper JSON format

**404 errors:**
- Make sure `collections-api.js` is in `/public/assets/js/`
- Run `npm run build` to copy files

**Data not updating:**
- Clear browser cache
- Check that API is returning new data
- Verify cache isn't stuck (try in incognito mode)

## Next Steps

1. ✅ Test with local API (`/api/database`)
2. Set up your external API server
3. Migrate data from `data.json` to external database
4. Update API URL in `collections-api.js`
5. Deploy!
