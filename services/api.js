/**
 * Configuration Axios avec interceptors
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';

// Récupération de l'URL de l'API depuis les variables publiques Expo et extras
// Priorité: EXPO_PUBLIC_API_URL (inlinée au build) -> extra d'Expo (expo/dev) -> extra d'Expo Go
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_URL =
  ENV_API_URL ||
  Constants.expoConfig?.extra?.API_URL ||
  Constants.expoGoConfig?.extra?.API_URL;

if (!API_BASE_URL) {
  // Aide au debug: éviter les appels relatifs qui échouent en production Android
  console.warn('[API] Aucune API_BASE_URL définie. Vérifiez EXPO_PUBLIC_API_URL ou extra.API_URL');
}

// Créer une instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  // Render/Northflank peuvent avoir un cold start: on laisse plus de marge
  timeout: 20_000,
});

// Interceptor pour ajouter automatiquement le token
api.interceptors.request.use(
  async config => {
    // Récupérer le token depuis AsyncStorage
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les réponses et rediriger si token invalide
api.interceptors.response.use(
  response => {
    // Vérifier si le backend a fourni un nouveau token
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      AsyncStorage.setItem('token', newToken);
    }

    return response;
  },
  async error => {
    // Si erreur 401 (Unauthorized), supprimer le token et rediriger vers login
    if (error.response?.status === 401) {
      // Supprimer le token d'authentification
      await AsyncStorage.removeItem('token');

      // Rediriger vers la page de login
      router.replace('/auth/login');
    }

    return Promise.reject(error);
  }
);

export default api;
