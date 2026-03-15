import axios from 'axios';

// Aici definim URL-ul backend-ului tău
// Când vei urca pe net, schimbi doar aici
export const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});