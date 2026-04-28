# Quick Setup Guide - Google Apps Script

## What You Need

1. Your Google Sheet with headers in Row 1
2. A Google Apps Script deployed as a Web App (acts as your API)

## Setup Steps

### Step 1: Create the Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/14-gzuQ4T9RDjjuKPkUFD6ujY5jyi29f38WBf874UDGc/edit

2. Click **Extensions** → **Apps Script**

3. Delete any existing code and paste the contents from `google-apps-script.gs` file in this project

4. **IMPORTANT**: In the script, update line 5 with your Sheet ID:
   ```javascript
   const SHEET_ID = '14-gzuQ4T9RDjjuKPkUFD6ujY5jyi29f38WBf874UDGc';
   ```

5. Click **Save** (disk icon or Ctrl+S)

6. Name your project (e.g., "DSA Tracker API")

### Step 2: Deploy as Web App

1. Click **Deploy** → **New deployment**

2. Click the gear icon ⚙️ next to "Select type"

3. Choose **Web app**

4. Fill in the settings:
   - **Description**: DSA Tracker API
   - **Execute as**: Me
   - **Who has access**: Anyone

5. Click **Deploy**

6. **Authorize the script**:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [project name] (unsafe)"
   - Click "Allow"

7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/ABCDEFG...XYZ/exec
   ```

### Step 3: Update Your .env File

1. Open `.env` in your project

2. Replace with:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
   ```

3. Paste your actual Web App URL

### Step 4: Run Your App

```bash
cd project/dsagrowttracker
npm run dev
```

Open http://localhost:5173 and test!

## Testing

1. Try adding a problem
2. Check your Google Sheet - the row should appear automatically
3. Try editing or deleting a problem

## Updating the Script

If you need to make changes to the script:

1. Edit the code in Apps Script editor
2. Click **Save**
3. Click **Deploy** → **Manage deployments**
4. Click the pencil icon ✏️ to edit
5. Change "Version" to **New version**
6. Click **Deploy**

The URL stays the same, so no need to update your `.env`!

## Security

- The script runs as YOU, so only you can read/write the sheet
- Anyone with the URL can use the API, but they can't access other sheets
- Keep your URL private (don't commit `.env` to Git)

## Troubleshooting

**"Authorization required"**
- Make sure you completed the authorization step
- Try redeploying and authorizing again

**"Script not found"**
- Check your Web App URL is correct
- Make sure you clicked "Deploy", not just "Save"

**Data not saving**
- Verify the Sheet ID in the script matches your actual sheet
- Check the sheet name is "Sheet1" (or update SHEET_NAME in script)

---

**You're done!** Your app now works with Google Sheets through Apps Script. ✨
