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

//Récupère les informations de l'utilisateur par son ID
export const getUserById = async userId => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Met à jour les informations utilisateur
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put('/user/update', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
