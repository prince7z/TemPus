# BlackMail

> A fast and secure disposable temporary email service built with Next.js

**[Live Demo →](https://tempus-zvh5.onrender.com)**

## Overview

BlackMail is a privacy-focused temporary email service that generates disposable email addresses instantly—no sign-up required. Perfect for website registrations, online verifications, or testing services while keeping your real inbox safe from spam and unwanted messages.

## Demo

Watch BlackMail in action:

<div align="center">
  <a href="https://tempus-zvh5.onrender.com" target="_blank">
    <img src="https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg" alt="BlackMail Demo" width="600" />
  </a>
</div>

### Video Demo
```html
<iframe width="100%" height="600" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
        gyroscope; picture-in-picture" allowfullscreen></iframe>
```

Or [view the live demo →](https://tempus-zvh5.onrender.com)

### Key Features

- ⚡ **Instant Generation** - Create temporary email addresses in seconds
- 🔒 **Privacy First** - No registration or personal information required
- 📬 **Real-time Updates** - Receive emails instantly with auto-refresh
- 🌓 **Dark/Light Mode** - Customizable theme for comfortable viewing
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⏱️ **Auto-Expiry** - Emails automatically expire after 24 hours
- 📝 **Blog Integration** - Notion-powered blog for updates and guides
- 🎯 **Clean UI** - Modern, intuitive interface built with Tailwind CSS

## About This Project

**BlackMail** is an open-source temporary email service designed for developers and privacy-conscious users. This project demonstrates:

- Building a full-stack application with **Next.js 14** and modern web technologies
- Integration with third-party APIs (MailJS for email, Notion for CMS)
- Real-time data handling and auto-refresh mechanisms
- Responsive, accessible UI design with dark mode support
- Serverless deployment on platforms like Vercel and Render

Whether you're learning about Next.js, API integrations, or building privacy-focused applications, this project is a great reference implementation. Feel free to fork, contribute, or use it as a starting point for your own projects.

**Contributions are welcome!** If you find issues or have feature suggestions, please open an issue or submit a pull request.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Email Service:** [@cemalgnlts/mailjs](https://www.npmjs.com/package/@cemalgnlts/mailjs)
- **CMS:** [Notion API](https://developers.notion.com/)
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/prince7z/tempus.git
cd tempus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables (if needed):
```bash
# Create a .env.local file for Notion integration (optional)
# NOTION_API_KEY=your_notion_api_key
# NOTION_DATABASE_ID=your_notion_database_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
tempus/
├── app/
│   ├── api/              # API routes
│   │   ├── blog/         # Blog API endpoints
│   │   └── temp/         # Temporary email API
│   ├── blog/             # Blog pages
│   ├── components/       # Reusable React components
│   │   ├── Dialog.tsx
│   │   ├── Icons.tsx
│   │   ├── PremiumDialog.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Toast.tsx
│   ├── links/            # Links/resources page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
└── [config files]        # TypeScript, Tailwind, Next.js configs
```

## Features in Detail

### Temporary Email Generation
- Generates disposable email addresses using the MailJS API
- 10-minute countdown timer with visual progress indicator
- Copy email address to clipboard functionality
- Automatic cleanup after expiration

### Email Management
- Real-time email inbox with auto-refresh
- View email details in a modal dialog
- HTML content rendering support
- Message timestamp and sender information

### Theme System
- Light and dark mode support
- Persistent theme preference using localStorage
- Smooth theme transitions

### Blog System
- Integration with Notion as a headless CMS
- Dynamic blog post listing and individual post pages
- Tags and cover image support
- SEO-friendly routing

## API Routes

### `/api/temp`
- **GET:** Generates a new temporary email address
- Returns email address, ID, and authentication token

### `/api/blog`
- **GET:** Fetches all blog posts from Notion database
- Returns array of blog posts with metadata

### `/api/blog/[id]`
- **GET:** Fetches a specific blog post by ID
- Returns detailed blog post content

## Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js` with theme extensions and custom utilities.

### TypeScript
Strict type checking enabled in `tsconfig.json` for enhanced code quality.



Built with ❤️ using Next.js and TypeScript
