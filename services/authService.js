/**
 * Service d'authentification
 */

import api from './api';

// Connecte un utilisateur avec email et mot de passe
export const login = async (email, password) => {
  try {
    const response = await api.post('/user/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crée un nouveau compte utilisateur
export const signup = async userData => {
  try {
    const response = await api.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Valide un token existant
export const validateToken = async () => {
  try {
    const response = await api.post('/user/validate');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Met à jour le profil utilisateur
export const updateProfile = async userData => {
  try {
    const response = await api.put('/user/update', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonctions de gestion des données avec mise à jour du state
export const handleLogin = async (userData, setUser) => {
  try {
    setUser(userData);
    return userData;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

export const handleLogout = async setUser => {
  try {
    // console.log('Déconnexion en cours...');
    setUser(null);
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
  }
};

// Fonction pour récupérer l'utilisateur avec ses événements populés
export const getUserWithEvents = async () => {
  try {
    const response = await api.get('/user/me/events');
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur avec ses événements:",
      error
    );
    throw error;
  }
};
