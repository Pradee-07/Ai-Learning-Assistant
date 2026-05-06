import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

// ✅ Load env properly
dotenv.config({ path: './.env' });

// ✅ Check API key BEFORE usage
if (!process.env.GEMINI_API_KEY) {
    console.error('FATAL ERROR: GEMINI_API_KEY is not set');
    process.exit(1);
}

// ✅ Initialize correctly
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ✅ Helper to extract text safely
const extractText = (response) => {
    return response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

/**
 * Generate flashcards
 */
export const generateFlashcards = async (text, count = 10) => {
    const prompt = `Generate exactly ${count} educational flashcards from the following text.
Format each flashcard as:
Q: [Clear question]
A: [Concise answer]
D: [easy | medium | hard]

Separate with "---"

Text:
${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const generatedText = extractText(response);

        const flashcards = [];
        const cards = generatedText.split('---').filter(c => c.trim());

        for (const card of cards) {
            const lines = card.trim().split('\n');

            let question = '', answer = '', difficulty = 'medium';

            for (const line of lines) {
                const trimmed = line.trim();

                if (trimmed.startsWith('Q:')) {
                    question = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('A:')) {
                    answer = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            if (question && answer) {
                flashcards.push({ question, answer, difficulty });
            }
        }

        return flashcards.slice(0, count);

    } catch (error) {
        console.error('Gemini FULL ERROR:', error);
        throw new Error('Failed to generate flashcards');
    }
};

/**
 * Generate quiz
 */
export const generateQuiz = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} MCQs from the text.

Format:
Q:
O1:
O2:
O3:
O4:
C:
E:
D:

Separate with "---"

Text:
${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const generatedText = extractText(response);

        const questions = [];
        const blocks = generatedText.split('---').filter(q => q.trim());

        for (const block of blocks) {
            const lines = block.trim().split('\n');

            let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';
            let rawCorrectAnswer = ''; // Store raw to match later

            for (const line of lines) {
                const trimmed = line.trim();

                if (trimmed.startsWith('Q:')) {
                    question = trimmed.substring(2).trim();
                } else if (/^O\d:/.test(trimmed)) {
                    options.push(trimmed.substring(3).trim());
                } else if (trimmed.startsWith('C:')) {
                    rawCorrectAnswer = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('E:')) {
                    explanation = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            // Normalize correctAnswer to match actual option text
            if (options.length === 4 && rawCorrectAnswer) {
                // Try to match rawCorrectAnswer to an option
                const rawStr = rawCorrectAnswer.toLowerCase().trim();
                
                // 1. Try direct match with option text
                let matched = options.find(opt => opt.toLowerCase() === rawStr);
                if (matched) {
                    correctAnswer = matched;
                } else {
                    // 2. Try to parse "O1", "O2", "Option 1" etc format
                    const optionMatch = rawStr.match(/^o(?:ption)?\s*(\d+)$/i);
                    if (optionMatch) {
                        const optNum = parseInt(optionMatch[1], 10);
                        if (optNum > 0 && optNum <= options.length) {
                            correctAnswer = options[optNum - 1]; // Convert to 0-based index
                        }
                    } else {
                        // 3. Try substring match
                        matched = options.find(opt => 
                            opt.toLowerCase().includes(rawStr) || 
                            rawStr.includes(opt.toLowerCase())
                        );
                        correctAnswer = matched || rawStr; // Fallback to raw if no match
                    }
                }
            }

            if (question && options.length === 4 && correctAnswer) {
                questions.push({ question, options, correctAnswer, explanation, difficulty });
            }
        }

        return questions.slice(0, numQuestions);

    } catch (error) {
        console.error('Gemini FULL ERROR:', error);
        throw new Error('Failed to generate quiz');
    }
};

/**
 * Generate summary
 */
export const generateSummary = async (text) => {
    const prompt = `Summarize the following text clearly:

${text.substring(0, 20000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        return extractText(response);

    } catch (error) {
        console.error('Gemini FULL ERROR:', error);
        throw new Error('Failed to generate summary');
    }
};

/**
 * Chat with context
 */
export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content}`).join('\n\n');

    const prompt = `Answer using ONLY the context.

Context:
${context}

Question: ${question}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        return extractText(response);

    } catch (error) {
        console.error('Gemini FULL ERROR:', error);
        throw new Error('Failed to process chat');
    }
};

/**
 * Explain concept
 */
export const explainConcept = async (concept, context) => {
    const prompt = `Explain "${concept}" clearly with examples.

Context:
${context.substring(0, 10000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        return extractText(response);

    } catch (error) {
        console.error('Gemini FULL ERROR:', error);
        throw new Error('Failed to explain concept');
    }
};