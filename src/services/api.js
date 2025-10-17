import axios from 'axios';

const API_BASE_URL = "http://localhost:8004";
const COMMENT_API_BASE_URL = "http://localhost:8005";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
});

const commentApi = axios.create({
  baseURL: COMMENT_API_BASE_URL,
  timeout: 10000, // 10 seconds
});

export const fetchMangas = async () => {
  try {
    const response = await api.get('/manga');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchMangaById = async (id) => {
  try {
    const response = await api.get(`/manga/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchMangaBySlug = async (slug) => {
  try {
    
    const response = await api.get(`/mangasl/${slug}`);
    
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchChaptersByMangaId = async (mangaId) => {
  try {
    const response = await api.get(`/manga/${mangaId}/chapters`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchChaptersByMangaSlug = async (mangaSlug) => {
  try {
    const response = await api.get(`/mangasl/${mangaSlug}/chapters`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchChapterImagesByNumber = async (mangaId, chapterNumber) => {
  try {
    const response = await api.get(`/mangasl/${mangaId}/chapter/${chapterNumber}/images`);
    return response.data.images;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/category');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchLatestChapters = async (limit = 6) => {
  try {
    const response = await api.get(`/latest-chapters?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/token', new URLSearchParams(loginData));
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchComments = async (mangaId) => {
  try {
    const response = await commentApi.get(`/comments?manga_slug=${mangaId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createComment = async (comment) => {
  try {
    const response = await commentApi.post('/comments', comment);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};