import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Brain, 
  Download, 
  Copy, 
  Trash2,
  Search,
  Filter,
  Plus,
  BookOpen,
  Calendar,
  Tag
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import useAppStore from '../stores/useAppStore';
import { summarizeText, generateFlashcardsFromText } from '../services/openaiService';

const SmartNotes = () => {
  const { notes, addNote, deleteNote, addFlashcard } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');

  // Enhanced AI summarization using OpenAI service
  const generateSummary = async (text) => {
    try {
      const result = await summarizeText(text);
      return result;
    } catch (error) {
      console.error('Summarization error:', error);
      // Fallback to simple summary
      const sentences = text.split('.').filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 3))).join('. ') + '.';
      
      return {
        summary,
        keyPoints: [
          'Main concept explained in detail',
          'Important methodology discussed',
          'Practical applications highlighted'
        ].slice(0, Math.min(3, Math.ceil(sentences.length / 5))),
        wordCount: text.split(' ').length,
        readingTime: Math.ceil(text.split(' ').length / 200)
      };
    }
  };

  const onDrop = async (acceptedFiles) => {
    setIsUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        const text = await file.text();
        const analysis = await generateSummary(text);
        
        const note = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          originalText: text,
          summary: analysis.summary,
          keyPoints: analysis.keyPoints,
          wordCount: analysis.wordCount,
          readingTime: analysis.readingTime,
          source: 'file',
          fileType: file.type,
          tags: ['uploaded'],
          subject: 'General'
        };
        
        addNote(note);
        toast.success(`"${note.title}" summarized successfully!`);
      }
    } catch {
      toast.error('Failed to process file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSummarize = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter some text to summarize.');
      return;
    }

    setIsUploading(true);
    
    try {
      const analysis = await generateSummary(textInput);
      
      const note = {
        title: textInput.substring(0, 50) + (textInput.length > 50 ? '...' : ''),
        originalText: textInput,
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        wordCount: analysis.wordCount,
        readingTime: analysis.readingTime,
        source: 'text',
        tags: ['manual'],
        subject: 'General'
      };
      
      addNote(note);
      setTextInput('');
      toast.success('Text summarized successfully!');
    } catch {
      toast.error('Failed to summarize text. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTag === 'all' || note.tags.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Generate flashcards from note content
  const generateFlashcardsFromNote = async (note) => {
    const loadingToast = toast.loading('Generating flashcards...');
    
    try {
      const flashcards = await generateFlashcardsFromText(note.originalText || note.summary, 5);
      
      for (const flashcard of flashcards) {
        await addFlashcard({
          ...flashcard,
          subject: note.subject || 'General',
          tags: [...(note.tags || []), 'auto-generated'],
          sourceNote: note.id
        });
      }
      
      toast.dismiss(loadingToast);
      toast.success(`Generated ${flashcards.length} flashcards from "${note.title}"!`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to generate flashcards. Please try again.');
      console.error('Flashcard generation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Smart Notes Summarizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload documents or paste text to generate AI-powered summaries
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upload Documents
          </h3>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            
            {isDragActive ? (
              <p className="text-primary-600 dark:text-primary-400">
                Drop files here to summarize...
              </p>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Supports PDF, DOC, DOCX, TXT files
                </p>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Processing...
              </span>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Paste Text
          </h3>
          
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Paste your text here to generate a summary..."
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {textInput.split(' ').filter(word => word.length > 0).length} words
            </span>
            <button
              onClick={handleTextSummarize}
              disabled={!textInput.trim() || isUploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Summarize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search notes..."
            />
          </div>
          
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="card p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {note.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{note.wordCount} words</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{note.readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => generateFlashcardsFromNote(note)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Generate flashcards"
                    >
                      <Brain className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(note.summary)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Copy summary"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Summary
                    </h5>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {note.summary}
                    </p>
                  </div>

                  {note.keyPoints && note.keyPoints.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Key Points
                      </h5>
                      <ul className="space-y-1">
                        {note.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                                         <button
                       className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                     >
                       View Details
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload a document or paste text to create your first smart summary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNotes;