export type GeminiNavigate = {
  type: "navigate";
  route: string;
};

export type GeminiAnswer = {
  type: "answer";
  text: string;
};

export type GeminiResponse = GeminiNavigate | GeminiAnswer;
