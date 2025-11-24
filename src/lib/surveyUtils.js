/**
 * Utility functions for working with survey data
 */

/**
 * Transform survey form data into the format expected by the database
 * @param {Object} answers - Object with question IDs as keys and answers as values
 * @param {Array} questions - Array of question objects with id, question, and optional options properties
 * @returns {Array} Array of question-answer objects for database storage
 */
export function formatSurveyData(answers, questions) {
  return questions.map(q => {
    // Determine question type: if it has options, it's multiple-choice, otherwise it's text-input
    const questionType = q.id === 'q10' || !q.options ? 'text-input' : 'multiple-choice'
    
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

