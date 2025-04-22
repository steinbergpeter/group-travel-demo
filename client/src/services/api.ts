import axios from 'axios';
import {
  User,
  UserPreferences,
  Group,
  Itinerary,
  Vote,
  Comment,
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints and services
export const userService = {
  // User related API calls
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (userData: User) => api.post('/users', userData),
  update: (id: string, userData: Partial<User>) =>
    api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
  getPreferences: (id: string) => api.get(`/users/${id}/preferences`),
  updatePreferences: (id: string, preferences: Partial<UserPreferences>) =>
    api.put(`/users/${id}/preferences`, preferences),
};

export const groupService = {
  // Group related API calls
  getAll: () => api.get('/groups'),
  getById: (id: string) => api.get(`/groups/${id}`),
  create: (groupData: Group) => api.post('/groups', groupData),
  update: (id: string, groupData: Partial<Group>) =>
    api.put(`/groups/${id}`, groupData),
  delete: (id: string) => api.delete(`/groups/${id}`),
  getMembers: (id: string) => api.get(`/groups/${id}/members`),
  addMember: (id: string, userId: string) =>
    api.post(`/groups/${id}/members`, { userId }),
  removeMember: (id: string, userId: string) =>
    api.delete(`/groups/${id}/members/${userId}`),
};

export const itineraryService = {
  // Itinerary related API calls
  getAll: (groupId?: string) =>
    api.get('/itineraries', { params: { groupId } }),
  getById: (id: string) => api.get(`/itineraries/${id}`),
  create: (itineraryData: Itinerary) => api.post('/itineraries', itineraryData),
  update: (id: string, itineraryData: Partial<Itinerary>) =>
    api.put(`/itineraries/${id}`, itineraryData),
  delete: (id: string) => api.delete(`/itineraries/${id}`),
  generate: (generationData: {
    groupId: string;
    destination: string;
    startDate?: string;
    endDate?: string;
  }) => api.post('/itineraries/generate', generationData),
  vote: (id: string, voteData: Vote) =>
    api.post(`/itineraries/${id}/votes`, voteData),
  comment: (id: string, commentData: Comment) =>
    api.post(`/itineraries/${id}/comments`, commentData),
};

export default api;
