/**
 * Utility functions for working with survey data
 */

/**
 * Transform survey form data into the format expected by the database
 * @param {Object} answers - Object with question IDs as keys and answers as values
 * @param {Array} questions - Array of question objects with id, question, type, and optional options/scale properties
 * @returns {Array} Array of question-answer objects for database storage
 */
export function formatSurveyData(answers, questions) {
  return questions.map(q => {
    // Determine question type based on the question's type property
    let questionType = 'text-input'
    
    if (q.type === 'scale') {
      questionType = 'scale'
    } else if (q.type === 'yesno') {
      questionType = 'yes-no'
    } else if (q.type === 'choice') {
      questionType = 'multiple-choice'
    } else if (q.type === 'text') {
      questionType = 'text-input'
    }
    
    return {
      questionId: q.id,
      question: q.question,
      questionType: questionType,
      answer: answers[q.id] || ''
    }
  })
}

/**
 * Example usage:
 * 
 * const questions = [
 *   { id: 'q1', question: 'How satisfied are you?' },
 *   { id: 'q2', question: 'What features do you like?' }
 * ]
 * 
 * const answers = {
 *   q1: 'Very satisfied',
 *   q2: 'The dashboard is great'
 * }
 * 
 * const formattedData = formatSurveyData(answers, questions)
 * // Result: [
 * //   { questionId: 'q1', question: 'How satisfied are you?', answer: 'Very satisfied' },
 * //   { questionId: 'q2', question: 'What features do you like?', answer: 'The dashboard is great' }
 * // ]
 */

