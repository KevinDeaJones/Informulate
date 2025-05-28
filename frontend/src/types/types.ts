export type Question = {
  id: string;
  question: string;
  options: string[];
};

export type AnswerResponse = {
  correct: boolean;
  explanation: string;
  correct_index: number;
};
