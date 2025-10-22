export interface Quiz {
  id: number;
  title: string;
  description?: string;
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  correct_answer: string;
  reason?: string;
  order_index: number;
  options?: QuizOption[];
}

export interface QuizOption {
  id: number;
  question_id: number;
  option_key: string;
  text: string;
}

export interface QuizWithQuestions extends Quiz {
  quiz_questions?: QuizQuestionWithOptions[];
}

export interface QuizQuestionWithOptions extends QuizQuestion {
  quiz_options?: QuizOption[];
}
