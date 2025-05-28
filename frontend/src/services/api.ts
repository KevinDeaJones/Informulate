import axios, { AxiosError } from 'axios';
import { AnswerResponse, Question } from 'types/types';

const API_BASE = 'http://localhost:3001/api';

export const fetchQuestion = async () => {
  try {
    const response = await axios.get<Question>(`${API_BASE}/next-question`);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    throw new Error(
      `Question fetch failed: ${axiosError.response?.status || 'Network Error'}`
    );
  }
};

export const submitAnswer = async (
  questionId: string,
  selectedIndex: number
) => {
  try {
    const response = await axios.post<AnswerResponse>(
      `${API_BASE}/submit-answer`,
      {
        id: questionId,
        selectedIndex,
      }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    throw new Error(
      `Answer submission failed: ${axiosError.response?.status || 'Network Error'}`
    );
  }
};
