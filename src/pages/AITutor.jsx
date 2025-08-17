import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Brain, 
  MessageCircle, 
  BookOpen, 
  Search,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  User,
  Bot,
  Clock,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../stores/useAppStore';
import { answerQuestion, explainConcept, generateStudyQuestions } from '../services/openaiService';

const AITutor = () => {
  const { notes, flashcards } = useAppStore();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample conversation starters
  const conversationStarters = [
    "Can you explain the main concepts from my recent notes?",
    "Help me understand this topic better",
    "What are the key points I should focus on?",
    "Can you create practice questions for me?",
    "Explain this in simpler terms",
    "What are the common mistakes to avoid?"
  ];

  // Enhanced AI response function using OpenAI service
  const generateAIResponse = async (message, context) => {
    try {
      // Create context from user's study materials
      const contextText = context
        .map(item => {
          if (item.title && item.content) {
            return `Title: ${item.title}\nContent: ${item.content}`;
          } else if (item.question && item.answer) {
            return `Q: ${item.question}\nA: ${item.answer}`;
          }
          return '';
        })
        .filter(Boolean)
        .slice(0, 10) // Limit context to prevent token overflow
        .join('\n\n');

      // Determine the type of question and use appropriate service
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('define')) {
        // Extract concept to explain
        const concept = message.replace(/(explain|what is|define)/gi, '').trim();
        return await explainConcept(concept, 'intermediate');
      } else if (lowerMessage.includes('question') || lowerMessage.includes('practice') || lowerMessage.includes('test')) {
        // Generate study questions
        const topic = message.replace(/(question|practice|test|generate|create)/gi, '').trim() || 'general study topics';
        const questions = await generateStudyQuestions(topic, 3);
        return `Here are some practice questions for you:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}\n\nTake your time to think through these, and feel free to ask me to explain any of them!`;
      } else {
        // General question answering
        return await answerQuestion(message, contextText);
      }
    } catch {
      // Fallback to encouraging response
      return "I'm here to help you with your studies! While I'm processing that, feel free to ask me about any specific concepts from your notes or flashcards. I can explain topics, generate practice questions, or help clarify anything you're studying.";
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get relevant context from notes and flashcards
      const context = selectedContext === 'all' 
        ? [...notes, ...flashcards]
        : selectedContext === 'notes' 
        ? notes 
        : flashcards;

      const aiResponse = await generateAIResponse(inputMessage, context);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        helpful: null // for feedback
      };

      setMessages(prev => [...prev, botMessage]);
    } catch {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feedback
  const handleFeedback = (messageId, isHelpful) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, helpful: isHelpful }
          : msg
      )
    );
    
    toast.success(`Thank you for your feedback!`);
  };

  // Copy message to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Start new conversation
  const startNewConversation = () => {
    setMessages([]);
    setShowSuggestions(true);
    toast.success('New conversation started!');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Tutor
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ask questions about your study materials
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Materials</option>
            <option value="notes">Notes Only</option>
            <option value="flashcards">Flashcards Only</option>
          </select>
          
          <button
            onClick={startNewConversation}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && showSuggestions ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to AI Tutor!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ask me anything about your study materials. I'm here to help you learn better.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {conversationStarters.map((starter, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSuggestionClick(starter)}
                  className="p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{starter}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`card p-4 ${
                    message.sender === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white dark:bg-gray-800'
                  }`}>
                    <p className={`text-sm ${
                      message.sender === 'user' 
                        ? 'text-white' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {message.text}
                    </p>
                    
                    {message.sender === 'bot' && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(message.text)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                            title="Copy response"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className={`p-1 rounded ${
                              message.helpful === true 
                                ? 'text-green-500' 
                                : 'text-gray-400 hover:text-green-500'
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className={`p-1 rounded ${
                              message.helpful === false 
                                ? 'text-red-500' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="card p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your study materials..."
              className="input-field resize-none h-12 max-h-32"
              rows={1}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed p-3"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </p>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-3 h-3" />
            <span>AI powered by your study materials</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor; 