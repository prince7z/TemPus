# Google Sheets Setup Guide

This guide will help you set up Google Sheets as the backend for your DSA Growth Tracker.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Name your sheet (e.g., "DSA Problems Tracker")

## Step 2: Set Up the Sheet Structure

Add these headers in the first row (Row 1):

| Column | Header | Description |
|--------|--------|-------------|
| A1 | id | Unique identifier |
| B1 | problemNo | Problem number |
| C1 | problemName | Name of the problem |
| D1 | problemLink | URL to the problem |
| E1 | topic | Topic/category |
| F1 | coreIdea | Core idea/approach |
| G1 | mistake | Mistakes made |
| H1 | status | Solved/Unsolved |
| I1 | helpUsed | TRUE/FALSE |
| J1 | revisit | TRUE/FALSE |
| K1 | dateSolved | Date solved |
| L1 | notes | Additional notes |

**Important:** Start adding data from Row 2 onwards. Row 1 is reserved for headers.

## Step 3: Make Sheet Publicly Accessible

1. Click the **"Share"** button (top right)
2. Under "General access", click **"Restricted"**
3. Change to **"Anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

⚠️ **Note:** The sheet will be read-only for the public. Only API requests can write data.

## Step 4: Get Your Sheet ID

1. Look at your Google Sheet URL
2. It will look like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit#gid=0`
3. Copy the part between `/d/` and `/edit`
4. Example: If your URL is:
   ```
   https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789/edit#gid=0
   ```
   Your Sheet ID is: `1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789`

## Step 5: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project:
   - Click the project dropdown (top left)
   - Click "New Project"
   - Name it (e.g., "DSA Tracker")
   - Click "Create"

3. Enable the Sheets API:
   - In the search bar, type "Google Sheets API"
   - Click on "Google Sheets API"
   - Click **"Enable"**

## Step 6: Create API Key

1. In Google Cloud Console, go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials"** (top)
3. Select **"API Key"**
4. A popup will show your API key - **copy it immediately**
5. (Optional but recommended) Click "Restrict Key":
   - Name it (e.g., "DSA Tracker Key")
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API" from the dropdown
   - Under "Website restrictions", add your domain (e.g., `yourapp.vercel.app`)
   - Click "Save"

## Step 7: Configure Your App

1. In your project folder, create a `.env` file:
   ```env
   VITE_GOOGLE_SHEET_ID=your-sheet-id-here
   VITE_GOOGLE_API_KEY=your-api-key-here
   ```

2. Replace `your-sheet-id-here` with your Sheet ID from Step 4
3. Replace `your-api-key-here` with your API Key from Step 6

## Step 8: Test Locally

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 (or the port shown)
3. Try adding a problem - it should appear in your Google Sheet!

## Step 9: Deploy to Vercel

1. Push your code to GitHub (don't commit `.env`)
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_GOOGLE_SHEET_ID` = your Sheet ID
   - `VITE_GOOGLE_API_KEY` = your API Key
5. Deploy!

## 🔒 Security Best Practices

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Restrict your API key** to your domain in Google Cloud Console
3. **Keep sheet as Viewer-only** - don't allow public editing
4. **Regenerate API key** if accidentally exposed
5. **Monitor API usage** in Google Cloud Console

## 🎯 Quick Checklist

- [ ] Created Google Sheet with headers in Row 1
- [ ] Made sheet publicly accessible (Viewer permission)
- [ ] Copied Sheet ID from URL
- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created and copied API Key
- [ ] Created `.env` file with both values
- [ ] Tested locally
- [ ] Added environment variables in Vercel
- [ ] Deployed successfully

## 🆘 Common Issues

### "Failed to fetch data from Google Sheets"
- Check if sheet is publicly accessible
- Verify Sheet ID is correct
- Ensure API is enabled in Google Cloud Console

### "API key not valid"
- Make sure API key is copied correctly (no extra spaces)
- Check if Google Sheets API is enabled
- Verify API key restrictions aren't blocking your domain

### "No data showing"
- Confirm headers are in Row 1 (A1-L1)
- Check sheet name is "Sheet1" (default name)
- Try adding a test row manually in the sheet

### Data not saving
- Verify you have write access to the sheet
- Check browser console for errors
- Ensure all required fields are filled in the form

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

---

**That's it! You're all set up.** 🎉

Your DSA tracker is now using Google Sheets as a simple, free database. No complex backend needed!
