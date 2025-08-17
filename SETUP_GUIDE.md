# StudyMate Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project (optional, for cloud features)
- OpenAI API key (optional, for AI features)

## Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Firebase Configuration (Optional - app works offline without these)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # OpenAI Configuration (Optional - fallback to mock responses without this)
   VITE_OPENAI_API_KEY=your_openai_api_key

   # App Configuration
   VITE_APP_NAME=StudyMate
   VITE_APP_VERSION=1.0.0
   VITE_APP_ENVIRONMENT=development
   ```

## Firebase Setup (Optional)

If you want to enable cloud features (user authentication, data sync):

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore Database

2. **Configure Authentication:**
   - Enable Email/Password authentication
   - Enable Google authentication (optional)
   - Add your domain to authorized domains

3. **Configure Firestore:**
   - Create a Firestore database
   - Set up security rules:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only access their own data
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // User profile documents
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

4. **Get Firebase Configuration:**
   - Go to Project Settings > General
   - Find your app's Firebase configuration
   - Copy the config values to your `.env` file

## OpenAI Setup (Optional)

If you want to enable AI features:

1. **Get OpenAI API Key:**
   - Go to [OpenAI API](https://platform.openai.com/api-keys)
   - Create an account and generate an API key
   - Add the key to your `.env` file

2. **Note on API Usage:**
   - The app includes built-in fallbacks for when OpenAI is not available
   - AI features will use mock responses without the API key
   - Be aware of OpenAI API costs and usage limits

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Features Available Without Configuration

The app is designed to work fully offline with local storage:

- ✅ **Core Features:** All study tools work locally
- ✅ **Data Storage:** Uses browser local storage
- ✅ **PWA:** Install as mobile/desktop app
- ✅ **Dark Mode:** Theme switching
- ✅ **Responsive:** Mobile and desktop optimized

## Features Enabled with Configuration

### With Firebase:
- ✅ **User Authentication:** Email/password and Google sign-in
- ✅ **Cloud Sync:** Data synchronization across devices
- ✅ **Multi-device:** Access from anywhere
- ✅ **Backup:** Automatic cloud backup

### With OpenAI:
- ✅ **Smart Summarization:** AI-powered note summaries
- ✅ **Flashcard Generation:** Auto-generate flashcards from text
- ✅ **AI Tutor:** Interactive question answering
- ✅ **Study Questions:** AI-generated practice questions

## Deployment Options

### Vercel (Recommended)
1. Fork this repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure environment variables

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Troubleshooting

### App won't start
- Check Node.js version (18+ required)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Firebase errors
- Verify all Firebase config values are correct
- Check Firebase project settings
- Ensure Firestore and Authentication are enabled

### OpenAI errors
- Verify API key is correct
- Check OpenAI account has credits
- Ensure you're not hitting rate limits

### PWA not installing
- Check manifest.json is valid
- Ensure service worker is running
- Try in different browser/incognito mode

## Support

For issues or questions:
1. Check this setup guide
2. Look at console errors in browser dev tools
3. Verify environment variables are set correctly
4. Test with Firebase/OpenAI features disabled first

The app is designed to gracefully handle missing configurations, so you can always start with the basic offline version and add features incrementally.