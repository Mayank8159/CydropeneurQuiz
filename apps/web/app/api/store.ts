export interface StoredQuestion {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}

const questions: Map<string, StoredQuestion> = new Map();

export function getAllQuestions(): StoredQuestion[] {
  return Array.from(questions.values()).sort((a, b) => a.qNumber - b.qNumber);
}

export function getQuestion(qId: string): StoredQuestion | undefined {
  return questions.get(qId);
}

export function setQuestion(q: StoredQuestion): void {
  questions.set(q.qId, q);
}

export function deleteQuestion(qId: string): boolean {
  return questions.delete(qId);
}
