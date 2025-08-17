import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Brain, 
  RotateCcw, 
  Check, 
  X, 
  Clock, 
  Target,
  BookOpen,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Upload,
  Star,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../stores/useAppStore';

const Flashcards = () => {
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, notes } = useAppStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedCards, setSelectedCards] = useState([]);
  const [studySession, setStudySession] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    subject: '',
    difficulty: 'medium',
    tags: []
  });

  // Get cards due for review (spaced repetition)
  const getDueCards = () => {
    const now = new Date();
    return flashcards.filter(card => {
      const nextReview = new Date(card.nextReview);
      return nextReview <= now;
    });
  };

  // Get study session cards
  const getStudyCards = () => {
    if (selectedCards.length > 0) {
      return flashcards.filter(card => selectedCards.includes(card.id));
    }
    return getDueCards();
  };

  const studyCards = getStudyCards();

  // Start study session
  const startStudySession = () => {
    if (studyCards.length === 0) {
      toast.error('No cards available for study!');
      return;
    }
    
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudySession({
      id: Date.now(),
      startTime: new Date(),
      totalCards: studyCards.length,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
  };

  // Handle card response
  const handleCardResponse = (isCorrect) => {
    const currentCard = studyCards[currentCardIndex];
    
    // Update card statistics
    const updatedCard = {
      ...currentCard,
      reviewCount: currentCard.reviewCount + 1,
      correctCount: currentCard.correctCount + (isCorrect ? 1 : 0),
      lastReviewed: new Date()
    };

    // Calculate next review date using spaced repetition
    const intervals = [1, 3, 7, 14, 30, 90]; // days
    const currentInterval = Math.min(currentCard.reviewCount, intervals.length - 1);
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervals[currentInterval]);
    
    updatedCard.nextReview = nextReview;
    
    updateFlashcard(currentCard.id, updatedCard);

    // Update session stats
    setStudySession(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1)
    }));

    // Move to next card or end session
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      endStudySession();
    }
  };

  // End study session
  const endStudySession = () => {
    const accuracy = Math.round((studySession.correctAnswers / studySession.totalCards) * 100);
    toast.success(`Study session completed! Accuracy: ${accuracy}%`);
    setStudyMode(false);
    setStudySession(null);
    setSelectedCards([]);
  };

  // Create new flashcard
  const handleCreateCard = () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in both question and answer fields.');
      return;
    }

    const newCard = {
      ...formData,
      subject: formData.subject || 'General',
      tags: formData.tags.length > 0 ? formData.tags : ['general']
    };

    addFlashcard(newCard);
    setFormData({
      question: '',
      answer: '',
      subject: '',
      difficulty: 'medium',
      tags: []
    });
    setShowCreateForm(false);
    toast.success('Flashcard created successfully!');
  };

  // Generate flashcards from notes
  const generateFromNotes = () => {
    if (notes.length === 0) {
      toast.error('No notes available to generate flashcards from.');
      return;
    }

    // Mock AI generation (replace with actual OpenAI implementation)
    const generatedCards = notes.slice(0, 3).map((note) => ({
      question: `What is the main concept of "${note.title}"?`,
      answer: note.summary.substring(0, 100) + '...',
      subject: note.subject || 'General',
      difficulty: 'medium',
      tags: ['generated', 'ai']
    }));

    generatedCards.forEach(card => addFlashcard(card));
    toast.success(`Generated ${generatedCards.length} flashcards from your notes!`);
  };

  // Filter cards
  const filteredCards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || card.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(flashcards.map(card => card.subject))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, study, and master your knowledge with spaced repetition
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={generateFromNotes}
            className="btn-secondary flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>Generate from Notes</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Card</span>
          </button>
        </div>
      </div>

      {/* Study Mode */}
      {studyMode && studyCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8"
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Progress: {currentCardIndex + 1} / {studyCards.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {studySession && Math.round((studySession.correctAnswers / studySession.totalCards) * 100)}% accuracy
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / studyCards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div className="relative">
            <motion.div
              key={currentCardIndex}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: showAnswer ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="perspective-1000"
            >
              <div className={`card p-8 min-h-64 flex items-center justify-center cursor-pointer ${
                showAnswer ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
              onClick={() => setShowAnswer(!showAnswer)}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {showAnswer ? 'Answer' : 'Question'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {showAnswer ? studyCards[currentCardIndex].answer : studyCards[currentCardIndex].question}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to {showAnswer ? 'hide' : 'show'} answer
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Response Buttons */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center space-x-4 mt-6"
              >
                <button
                  onClick={() => handleCardResponse(false)}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Incorrect</span>
                </button>
                <button
                  onClick={() => handleCardResponse(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Correct</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* End Session Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={endStudySession}
              className="btn-secondary"
            >
              End Session
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      {!studyMode && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Cards</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{flashcards.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{getDueCards().length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mastered</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {flashcards.filter(card => card.correctCount >= 5).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">7 days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Options */}
      {!studyMode && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={startStudySession}
              disabled={studyCards.length === 0}
              className="card p-4 text-left hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Study Due Cards</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {studyCards.length} cards ready for review
                  </p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="card p-4 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Create New Cards</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add custom flashcards
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {!studyMode && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search flashcards..."
            />
          </div>
          
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      )}

      {/* Flashcards Grid */}
      {!studyMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {card.question}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {card.answer}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Next: {new Date(card.nextReview).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>{card.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCards([card.id]);
                      startStudySession();
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Study this card"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFlashcard(card.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                    {card.subject}
                  </span>
                  {card.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className={`w-4 h-4 ${card.correctCount >= 5 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {card.correctCount}/{card.reviewCount}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Card Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Flashcard
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Question
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="input-field h-24 resize-none"
                    placeholder="Enter your question..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="input-field h-24 resize-none"
                    placeholder="Enter the answer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Mathematics, Science..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="input-field"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCard}
                  className="btn-primary"
                >
                  Create Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flashcards;