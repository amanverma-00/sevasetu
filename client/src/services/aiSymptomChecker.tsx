// services/aiSymptomChecker.ts
export class AISymptomChecker {
  private symptomKeywords = {
    headache: {
      questions: [
        "How long have you had the headache?",
        "Is it a dull ache or sharp pain?",
        "Where is the pain located?",
        "Does anything make it better or worse?"
      ],
      advice: "For mild headaches, rest in a quiet, dark room and consider over-the-counter pain relievers. If severe or persistent, consult a doctor."
    },
    fever: {
      questions: [
        "What is your temperature?",
        "How long have you had the fever?",
        "Do you have chills or sweating?",
        "Are you taking any medication for it?"
      ],
      advice: "Stay hydrated and rest. Consider fever-reducing medication if appropriate. If fever is high or persists, seek medical attention."
    },
    cough: {
      questions: [
        "Is it a dry cough or are you producing phlegm?",
        "How long have you had the cough?",
        "Does it worsen at certain times of day?",
        "Do you have any other respiratory symptoms?"
      ],
      advice: "Stay hydrated and consider cough drops or honey for relief. If cough persists or is severe, consult a healthcare provider."
    }
  };

  generateResponse(userMessage: string, conversationHistory: any[]): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your AI health assistant. How can I help you today? Please describe any symptoms you're experiencing.";
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about your symptoms?";
    }
    
    // Check for specific symptoms
    for (const [symptom, data] of Object.entries(this.symptomKeywords)) {
      if (lowerMessage.includes(symptom)) {
        // Find a question that hasn't been asked yet
        const askedQuestions = conversationHistory
          .filter(msg => msg.sender === 'ai')
          .map(msg => msg.text);
        
        const unansweredQuestion = data.questions.find(
          question => !askedQuestions.includes(question)
        );
        
        return unansweredQuestion || data.advice;
      }
    }
    
    // Default response if no specific symptom is detected
    return "Thank you for sharing that information. Can you tell me more about your symptoms? For example, when they started, how severe they are, and if anything makes them better or worse.";
  }
}

export const aiSymptomChecker = new AISymptomChecker();