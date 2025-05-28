// Simple in-memory store for questionId -> { question, options, answer_index, facts }

const store = new Map();

export function saveQuestion(id, data) {
  store.set(id, { ...data });
}

export function getQuestion(id) {
  return store.get(id);
}

export function removeQuestion(id) {
  store.delete(id);
}
