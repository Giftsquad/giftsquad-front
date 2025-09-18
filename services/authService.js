/**
 * Service d'authentification
 */

import api from './api';

//Connecte un utilisateur avec email et mot de passe
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

//Crée un nouveau compte utilisateur
export const signup = async userData => {
  try {
    const response = await api.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Valide un token existant
export const validateToken = async () => {
  try {
    const response = await api.post('/user/validate');
    return response.data;
  } catch (error) {
    throw error;
  }
};


