import OpenAI from 'openai';

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found. Using mock responses.');
    return null;
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });
};

const openai = getOpenAIClient();

// Mock responses for when API key is not available
const mockResponses = {
  summarizeText: (text) => {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return {
      summary: sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 3))).join('. ') + '.',
      keyPoints: [
        'Main concept explained in detail',
        'Important methodology discussed',
        'Practical applications highlighted',
        'Future implications considered'
      ].slice(0, Math.min(4, Math.ceil(sentences.length / 5))),
      wordCount: text.split(' ').length,
      readingTime: Math.ceil(text.split(' ').length / 200)
    };
  },
  
  generateFlashcards: () => [
    {
      question: 'What is the main concept discussed in this text?',
      answer: 'The text discusses key concepts and their practical applications.',
      difficulty: 'medium'
    },
    {
      question: 'What are the important methodologies mentioned?',
      answer: 'The text covers various methodologies and their implementations.',
      difficulty: 'medium'
    }
  ],
  
  answerQuestion: (question) => {
    const responses = [
      `Based on your study materials, I can help you understand this concept. The key points are related to your question about "${question}".`,
      `Great question! Let me break this down for you in a way that's easy to understand, considering the context from your notes.`,
      `This is an important topic. Here's what you need to know based on your study materials and the question about "${question}".`,
      `I can see from your context that you've been studying this. Let me provide some additional insights about "${question}".`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

// Text Summarization Service
export const summarizeText = async (text) => {
  try {
    if (!openai) {
      // Use mock response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return mockResponses.summarizeText(text);
    }

    const systemPrompt = `You are an AI study assistant. Summarize the following text in a clear, concise manner. 
    Provide key points and estimate reading time. Format your response as a structured summary.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please summarize this text: ${text}` }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const summary = response.choices[0].message.content;
    
    // Extract key points from the summary (simple implementation)
    const keyPoints = summary.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .slice(0, 4);

    return {
      summary: summary.replace(/Key points?:[\s\S]*$/i, '').trim(),
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        'Main concepts identified',
        'Important details highlighted',
        'Key relationships explained'
      ],
      wordCount: text.split(' ').length,
      readingTime: Math.ceil(text.split(' ').length / 200)
    };

  } catch (error) {
    console.error('Error summarizing text:', error);
    // Fallback to mock response
    return mockResponses.summarizeText(text);
  }
};

// Flashcard Generation Service
export const generateFlashcardsFromText = async (text, count = 5) => {
  try {
    if (!openai) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return mockResponses.generateFlashcards(text);
    }

    const systemPrompt = `You are an AI tutor that creates effective flashcards for studying. 
    Create ${count} flashcards from the given text. Each flashcard should have a clear question and a concise answer.
    Format as JSON array with objects containing "question", "answer", and "difficulty" (easy/medium/hard).`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create flashcards from this text: ${text}` }
      ],
      max_tokens: 800,
      temperature: 0.4,
    });

    const content = response.choices[0].message.content;
    
    try {
      // Try to parse as JSON
      const flashcards = JSON.parse(content);
      return Array.isArray(flashcards) ? flashcards : mockResponses.generateFlashcards(text);
    } catch {
      // If JSON parsing fails, extract Q&A pairs manually
      const lines = content.split('\n').filter(line => line.trim());
      const flashcards = [];
      
      for (let i = 0; i < lines.length - 1; i += 2) {
        const question = lines[i].replace(/^\d+\.\s*Q:\s*/i, '').trim();
        const answer = lines[i + 1].replace(/^\s*A:\s*/i, '').trim();
        
        if (question && answer) {
          flashcards.push({
            question,
            answer,
            difficulty: 'medium'
          });
        }
      }
      
      return flashcards.length > 0 ? flashcards : mockResponses.generateFlashcards(text);
    }

  } catch (error) {
    console.error('Error generating flashcards:', error);
    return mockResponses.generateFlashcards(text);
  }
};

// Q&A Service
export const answerQuestion = async (question, context = '') => {
  try {
    if (!openai) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mockResponses.answerQuestion(question, context);
    }

    const systemPrompt = `You are a helpful AI tutor. Answer the student's question based on the provided context from their study materials. 
    Be clear, educational, and encouraging. If the context doesn't contain relevant information, provide a general educational response.`;

    const contextMessage = context ? 
      `Context from study materials: ${context}\n\nQuestion: ${question}` : 
      `Question: ${question}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contextMessage }
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error('Error answering question:', error);
    return mockResponses.answerQuestion(question, context);
  }
};

// Explain Concept Service
export const explainConcept = async (concept, level = 'intermediate') => {
  try {
    if (!openai) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `Here's an explanation of "${concept}" at the ${level} level: This concept involves understanding the fundamental principles and their practical applications in various contexts.`;
    }

    const systemPrompt = `You are an educational AI assistant. Explain concepts clearly at the specified difficulty level:
    - beginner: Simple terms, basic examples
    - intermediate: More detail, some technical terms
    - advanced: Comprehensive, technical depth`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Explain "${concept}" at ${level} level` }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error('Error explaining concept:', error);
    return `Here's an explanation of "${concept}": This is an important concept that involves understanding key principles and their practical applications.`;
  }
};

// Generate Study Questions
export const generateStudyQuestions = async (topic, count = 5, difficulty = 'medium') => {
  try {
    if (!openai) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return [
        `What are the key principles of ${topic}?`,
        `How does ${topic} apply in practical situations?`,
        `What are the main challenges in understanding ${topic}?`,
        `Can you compare ${topic} with related concepts?`,
        `What are the future implications of ${topic}?`
      ].slice(0, count);
    }

    const systemPrompt = `Generate ${count} study questions about "${topic}" at ${difficulty} difficulty level. 
    Questions should be thought-provoking and help with deep understanding. Return as a simple array of questions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate study questions for: ${topic}` }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const questions = content.split('\n')
      .filter(line => line.trim() && (line.includes('?') || /^\d+\./.test(line.trim())))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, count);

    return questions.length > 0 ? questions : [
      `What are the fundamental concepts of ${topic}?`,
      `How can you apply ${topic} in practice?`,
      `What are common misconceptions about ${topic}?`
    ];

  } catch (error) {
    console.error('Error generating study questions:', error);
    return [
      `What are the key aspects of ${topic}?`,
      `How does ${topic} work in practice?`,
      `What should you remember about ${topic}?`
    ];
  }
};

export default {
  summarizeText,
  generateFlashcardsFromText,
  answerQuestion,
  explainConcept,
  generateStudyQuestions
};