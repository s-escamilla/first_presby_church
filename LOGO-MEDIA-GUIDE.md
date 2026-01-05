# Logo & Media Management Guide

## 📚 How Decap CMS Stores Media

### Media Storage Basics

Decap CMS stores images and media files in two ways:

1. **Physical Storage Location** (`media_folder`):
   - Files are actually saved here in your repository
   - Example: `src/assets/images/blog`

2. **Public URL Path** (`public_folder`):
   - The URL path used in your HTML/content
   - Example: `/assets/images/blog`

### Current Media Configuration

In `/src/admin/config.yml`:

```yaml
media_folder: "src/assets/images/blog"
public_folder: "/assets/images/blog"
```

This means:
- ✅ Files uploaded via CMS → saved to `src/assets/images/blog/`
- ✅ In your content → referenced as `/assets/images/blog/filename.jpg`
- ✅ Visible in CMS "Media" tab

## 🎨 Logo Management Setup

### What We've Configured

1. **New Site Settings Collection**
   - Navigate in CMS: `Settings` → `Site Configuration`
   - Contains all global site settings
   - Includes dedicated logo management section

2. **Logo Configuration Fields**:
   - **Primary Logo**: Main logo (combined icon + text)
   - **Logo Icon**: Icon-only version
   - **Logo Text**: Text-only version  
   - **Alt Text**: Accessibility description
   - **Width/Height**: Logo dimensions

3. **Special Logo Media Folder**:
   ```yaml
   media_folder: "/src/assets/svgs"
   public_folder: "/assets/svgs"
   ```
   - Logos stored separately in SVG folder
   - Can upload SVG, PNG, or other image formats

## 🚀 How to Use

### From the Admin Dashboard

1. **Access Dashboard**: `http://localhost:8080/admin/dashboard/`
2. Click **"Logo & Branding"** card
3. Or click **"Site Settings"** for all settings

### From the CMS Directly

1. **Access CMS**: `http://localhost:8080/admin/`
2. Click **"Site Settings"** in left sidebar
3. Click **"Site Configuration"**
4. Scroll to **"Logo Images"** section

### Uploading a New Logo

**Option 1: Via Site Settings (Recommended)**
```
Dashboard → Logo & Branding → Logo Images section
→ Click "Choose an image" → Upload new file
→ File saved to /src/assets/svgs/
→ Save changes
```

**Option 2: Via Media Library**
```
CMS → Media (top right)
→ Upload File → Choose /assets/svgs/ folder
→ Go to Site Settings → Select uploaded file
```

**Option 3: Manual Upload**
```
1. Place file in: /src/assets/svgs/fpcGoshen_combined.svg
2. In CMS Site Settings, reference: /assets/svgs/fpcGoshen_combined.svg
```

## 📁 File Locations

### Current Logo Files
```
src/assets/svgs/
├── fpcGoshen_combined.svg  ← Full logo (icon + text)
├── fpcGoshen_logo.svg      ← Icon only
├── fpcGoshen_text.svg      ← Text only
└── [other svg files]
```

### Data File (Editable via CMS)
```
src/_data/client.json
{
  "logo": {
    "primary": "/assets/svgs/fpcGoshen_combined.svg",
    "icon": "/assets/svgs/fpcGoshen_logo.svg",
    "text": "/assets/svgs/fpcGoshen_text.svg",
    "alt": "FPC Goshen Logo",
    "width": 210,
    "height": 40
  }
}
```

### Template File (Auto-updates)
```
src/_includes/sections/header.html
→ Reads from {{ client.logo.primary }}
→ Automatically updates when CMS changes client.json
```

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────┐
│ 1. Client uploads logo via CMS                          │
│    /admin/#/collections/settings/entries/site           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. File saved to: src/assets/svgs/new-logo.svg         │
│    Path saved in: src/_data/client.json                 │
│    { "logo": { "primary": "/assets/svgs/new-logo.svg" }}│
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. 11ty rebuilds site (auto on save in dev mode)        │
│    Reads client.json → injects into templates           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Header template renders with new logo                │
│    <img src="/assets/svgs/new-logo.svg" ...>            │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Client Workflow

### Step-by-Step: Change the Logo

1. **Login to Admin**
   - Visit: `yourdomain.com/admin/`
   - Use credentials to login

2. **Access Logo Settings**
   - Click **"Logo & Branding"** on dashboard
   - Or: Settings → Site Configuration in CMS

3. **Upload New Logo**
   - Scroll to "Logo Images" section
   - Click "Choose an image" under "Primary Logo"
   - Upload new file (SVG, PNG, JPG supported)
   - Or select from existing media library

4. **Configure Logo Properties**
   - Update Alt Text if needed
   - Adjust Width/Height if needed
   - Preview changes

5. **Save & Publish**
   - Click "Save" button
   - Wait for site to rebuild (automatic)
   - Refresh website to see new logo

### Tips for Best Results

- ✅ **Use SVG format** for logos (scales perfectly)
- ✅ **Optimize file size** before uploading
- ✅ **Name files descriptively**: `company-logo-2024.svg`
- ✅ **Keep aspect ratio** when setting dimensions
- ✅ **Test on mobile** after changing logo

## 📊 Media Library

### Accessing All Media

**From Dashboard:**
```
Dashboard → CMS Collections → Media (icon in header)
```

**From CMS:**
```
Top right corner → "Media" button
```

### What You'll See

The Media Library shows ALL files from:
- `/src/assets/images/blog/` (blog images)
- Any files referenced in collections
- Uploaded via any CMS field with `widget: "image"`

### Media Organization

**Current folders:**
```
src/assets/
├── images/
│   └── blog/          ← Blog post images
├── svgs/              ← Logos & icons
├── fonts/             ← Web fonts
└── favicons/          ← Site icons
```

**In CMS Media Library:**
- Shows all uploaded media
- Searchable by filename
- Filterable by upload date
- Click to insert into content

## 🛠️ Advanced: Per-Collection Media Folders

You can specify different media folders for different collections:

```yaml
# In config.yml
collections:
  - name: "blog"
    media_folder: "src/assets/images/blog"    # Blog images here
    public_folder: "/assets/images/blog"
    
  - name: "settings"
    fields:
      - name: "logo"
        widget: "image"
        media_folder: "/src/assets/svgs"      # Logos here
        public_folder: "/assets/svgs"
```

## 🐛 Troubleshooting

### Logo Not Showing Up

1. **Check file path**:
   ```bash
   # Should exist:
   ls src/assets/svgs/your-logo.svg
   ```

2. **Check client.json**:
   ```json
   // Should have correct path:
   "logo": {
     "primary": "/assets/svgs/your-logo.svg"  // Leading slash!
   }
   ```

3. **Rebuild site**:
   ```bash
   npm start  # Rebuilds and watches
   ```

### CMS Not Finding Uploaded Files

1. **Check media_folder path** in `config.yml`
2. **Ensure folder exists** in repository
3. **Check file permissions** (read/write access)
4. **Restart CMS** (reload `/admin/` page)

### Logo Dimensions Wrong

Update in Site Settings:
```json
"logo": {
  "width": 210,    // Adjust as needed
  "height": 40     // Maintain aspect ratio
}
```

## 📝 Making Changes

### Add More Logo Variants

Edit `/src/admin/config.yml`:

```yaml
- label: "Logo Images"
  name: "logo"
  widget: "object"
  fields:
      - { label: "Primary Logo", name: "primary", widget: "image" }
      - { label: "Dark Mode Logo", name: "dark", widget: "image" }  # NEW
      - { label: "Mobile Logo", name: "mobile", widget: "image" }   # NEW
      - { label: "Favicon", name: "favicon", widget: "image" }      # NEW
```

### Change Media Upload Location

Edit `/src/admin/config.yml`:

```yaml
# Move to different folder
media_folder: "src/assets/uploads"
public_folder: "/assets/uploads"
```

## 🎨 Dashboard Integration

The dashboard now includes:

1. **"Logo & Branding" Card**
   - Quick access to logo management
   - Direct link to Site Settings
   - Shows what can be updated

2. **"Site Settings" Card**
   - Full site configuration
   - Contact info, social links
   - Domain settings

Both link directly to the CMS with deep links:
- `/admin/#/collections/settings` → Settings list
- `/admin/#/collections/settings/entries/site` → Direct to form

## 🔐 Security Note

**Important**: Only authenticated users can:
- Access the dashboard
- Open the CMS
- Upload/change media files
- Modify site settings

The authentication system protects:
- `/admin/dashboard/` - Main dashboard
- `/admin/` - CMS interface
- All media management features

## 🎓 Summary

**You now have**:
✅ Centralized logo management in CMS
✅ Client-friendly interface for logo changes
✅ Multiple logo variants support (icon, text, combined)
✅ Automatic site updates when logo changes
✅ Protected admin access
✅ Direct links from dashboard

**Client can**:
✅ Upload new logos via web interface
✅ Swap logos without code changes
✅ Manage all site branding assets
✅ Preview changes before saving
✅ Access via intuitive dashboard

**You can**:
✅ Focus on development
✅ Let clients manage content
✅ Extend with more media types
✅ Customize per project needs

---

**Need Help?**
- Check: `ADMIN-AUTH-README.md` for authentication
- Check: `/src/admin/config.yml` for CMS configuration
- Check: `/src/_data/client.json` for current data
