# DSA Growth Tracker

A minimalist, single-page web application to track your Data Structures & Algorithms learning journey. Built with React and Google Sheets API.

## 🚀 Features

- **Single Page Application** - No backend, pure frontend
- **Google Sheets Integration** - Direct database operations via Sheets API
- **Clean UI** - Material-UI components with smooth animations
- **Responsive Design** - Works perfectly on mobile and desktop
- **Real-time Stats** - Auto-updating problem statistics
- **Color-Coded Tracking** - Visual feedback for problem status
- **Fast & Lightweight** - Static deployment on Vercel

## 📋 What You Can Track

- Problem number and name
- Problem link (clickable)
- Topic/category
- Core idea/approach
- Mistakes made
- Status (Solved/Unsolved)
- Whether you used help
- Problems that need revisiting
- Date solved
- Additional notes

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **UI Library:** Material-UI (MUI)
- **Animations:** Framer Motion
- **Database:** Google Sheets (via Sheets API)
- **Deployment:** Vercel (static hosting)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   cd dsagrowttracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Google Sheets:**
   
   a. Create a new Google Sheet at [Google Sheets](https://sheets.google.com)
   
   b. Add the following headers in the first row (A1-L1):
      - A1: `id`
      - B1: `problemNo`
      - C1: `problemName`
      - D1: `problemLink`
      - E1: `topic`
      - F1: `coreIdea`
      - G1: `mistake`
      - H1: `status`
      - I1: `helpUsed`
      - J1: `revisit`
      - K1: `dateSolved`
      - L1: `notes`
   
   c. Make the sheet publicly accessible:
      - Click "Share" button
      - Change access to "Anyone with the link" with "Viewer" permission
      - Copy the Sheet ID from the URL (the long string between /d/ and /edit)
      - Example: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   
   d. Enable Google Sheets API:
      - Go to [Google Cloud Console](https://console.cloud.google.com)
      - Create a new project (or select existing)
      - Enable "Google Sheets API"
      - Create credentials → API Key
      - Copy your API Key

4. **Configure environment variables:**
   
   Create a `.env` file in the project root:
   ```bash
   echo > .env
   ```
   
   Add your Google Sheets credentials:
   ```env
   VITE_GOOGLE_SHEET_ID=your-google-sheet-id-here
   VITE_GOOGLE_API_KEY=your-google-api-key-here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   
   Option A - Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
   
   Option B - GitHub Integration:
   - Push code to GitHub
   - Import project in Vercel dashboard
   - Add environment variables in Vercel settings
   - Deploy

3. **Add environment variables in Vercel:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add both variables from your `.env` file:
     - `VITE_GOOGLE_SHEET_ID`
     - `VITE_GOOGLE_API_KEY`

## 📱 Usage

1. **Add a Problem:**
   - Fill in the form at the top
   - Select topic from dropdown
   - Mark status (Solved/Unsolved)
   - Check "Help Used" if you looked at solutions
   - Check "Revisit" if you need to practice again
   - Click "Save Problem"

2. **View Your Progress:**
   - See all problems in the table below
   - Color coding:
     - 🟢 Green = Solved
     - 🔴 Red = Unsolved
     - 🟡 Yellow = Needs revisit
   - Click problem links to open them

3. **Track Stats:**
   - View total problems
   - See solved vs unsolved count
   - Monitor problems needing revisit
   - Track how often you used help

## 🎨 Color Coding

- **Solved problems:** Light green background
- **Unsolved problems:** Light red background
- **Revisit flagged:** Yellow highlight (overrides status color)

## 🔧 Project Structure

```
dsagrowttracker/
├── src/
│   ├── components/
│   │   ├── Form.jsx          # Input form component
│   │   ├── Table.jsx         # Problems table component
│   │   └── Stats.jsx         # Statistics cards component
│   ├── services/
│   │   └── sheetsApi.js      # Google Sheets API integration
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── styles.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment variables template
└── README.md
```

## 🔐 Security Notes

- **API Key:** Never commit `.env` to version control
- **Sheets Access:** Keep your sheet publicly readable (Viewer access only)
- **Personal Use:** This app has no authentication - suitable for personal use only
- **API Key Restrictions:** Consider restricting your Google API key to specific domains in Google Cloud Console

## 📊 Google Sheets API Endpoints Used

- `GET /values/{range}` - Fetch all problems
- `POST /values/{range}:append` - Add new problem
- `PUT /values/{range}` - Update existing problem
- `POST /values/{range}:clear` - Delete problem

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your needs!

## 📄 License

MIT License - Use freely for personal projects.

## 💡 Tips

- Use consistent problem numbering for easy tracking
- Write detailed mistakes to learn from them
- Review "Revisit" flagged problems weekly
- Track your help usage to measure independence
- Export data regularly (future feature)

## 🐛 Troubleshooting

**Can't connect to Google Sheets?**
- Verify your Sheet ID is correct
- Check API key is valid in Google Cloud Console
- Ensure sheet is publicly accessible (Anyone with the link - Viewer)
- Confirm Google Sheets API is enabled in your project
- Check that headers are in row 1 (A1-L1)

**Build errors?**
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf .vite`

**Deployment issues?**
- Ensure both environment variables are set in Vercel
- Check build logs for specific errors
- Verify `vercel.json` configuration

---

**Happy Learning! Track every problem, track every mistake, and watch yourself grow.** 🚀
