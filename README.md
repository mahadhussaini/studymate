# StudyMate - AI Tutor 2.0 🧠

An Interactive Study Assistant built with React + Vite + TailwindCSS that empowers students with personalized learning tools and AI-powered features.

## ✨ Features

### 🔑 Core Features
- **Smart Notes Summarizer** – Upload PDFs, Word docs, or paste text to generate AI-powered summaries
- **Flashcard Generator** – Convert study notes into interactive flashcards with spaced repetition
- **AI Q&A Tutor** – Ask context-based questions and get instant AI responses
- **Study Scheduler** – Create personalized study plans with reminders
- **Progress Analytics** – Visual dashboards showing study hours and performance
- **Gamification** – Achievements, streaks, and rewards for study habits
- **Multi-theme Support** – Light/dark modes and customizable themes

### 🎨 UI/UX Features
- Modern, responsive design built with TailwindCSS
- Smooth animations using Framer Motion
- Dashboard layout with sidebar navigation
- Mobile-friendly interface
- Clean and intuitive user experience

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** TailwindCSS with custom design system
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **File Upload:** React Dropzone
- **Notifications:** React Hot Toast
- **AI Integration:** OpenAI API
- **Backend:** Firebase (Auth & Storage)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studymate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.jsx
│   └── ui/
├── pages/
│   ├── Dashboard.jsx
│   ├── SmartNotes.jsx
│   ├── Flashcards.jsx
│   ├── StudySchedule.jsx
│   ├── Analytics.jsx
│   ├── Achievements.jsx
│   └── Settings.jsx
├── stores/
│   └── useAppStore.js
├── services/
├── hooks/
├── utils/
├── types/
├── App.jsx
└── main.jsx
```

## 🎯 Current Implementation Status

### ✅ Completed
- [x] Project setup with React + Vite + TailwindCSS
- [x] Zustand state management configuration
- [x] Dashboard layout with sidebar navigation
- [x] Smart Notes Summarizer module
- [x] Responsive design and dark mode
- [x] Dashboard with overview widgets and charts

### ✅ Recently Completed
- [x] **Flashcard Generator** with spaced repetition algorithm
- [x] **AI Q&A Tutor** interface with context-aware responses
- [x] **Study Scheduler** with calendar and task management
- [x] **Enhanced Analytics** with multiple chart types and AI insights
- [x] **Achievements & Gamification** with XP, levels, and rewards
- [x] **Comprehensive Settings** with 6 categories of preferences
- [x] **OpenAI API Integration** with fallback mock responses
- [x] **Firebase Authentication & Storage** services
- [x] **Mobile Optimization** with responsive navigation
- [x] **PWA Support** with service workers and offline capabilities
- [x] **Performance Optimizations** with caching and lazy loading
- [x] **Error Handling** with boundary components
- [x] **Complete Mobile Navigation** with bottom tabs and gestures

### 🚧 Future Enhancements
- [ ] Real-time collaboration features
- [ ] Voice-to-text integration
- [ ] Advanced AI tutoring modes
- [ ] Multi-language support
- [ ] Native mobile apps

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Highlights

### Smart Notes Summarizer
- Drag & drop file upload (PDF, DOC, DOCX, TXT)
- Text input for manual content
- AI-powered summarization
- Key points extraction
- Reading time estimation
- Searchable and filterable notes

### Dashboard Analytics
- Study hours tracking
- Weekly progress charts
- Subject distribution visualization
- Study streak monitoring
- Achievement system
- Goal setting and tracking

### Modern UI Components
- Responsive card layouts
- Smooth hover animations
- Loading states and feedback
- Toast notifications
- Dark/light theme support
- Mobile-optimized sidebar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Tailwind CSS for the design system
- Recharts for data visualization
- Framer Motion for smooth animations
- Lucide React for beautiful icons

---

**StudyMate** - Making learning faster, smarter, and more fun! 🎓