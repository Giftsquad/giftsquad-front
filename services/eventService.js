/**
 * Service pour les événements
 */

import api from './api';

//Récupère tous les événements de l'utilisateur
export const getEvents = async () => {
  try {
    const response = await api.get('/event');
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Récupère un événement spécifique
export const getEvent = async eventId => {
  try {
    const response = await api.get(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Récupère toutes les invitations d'un utilisateur
export const getInvitations = async () => {
  try {
    const response = await api.get('/invitations');
    return response.data;
  } catch (error) {
    error.message;
  }
};

//Crée un nouvel événement
export const createEvent = async eventData => {
  try {
    const response = await api.post('/event/publish', eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Met à jour un événement
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/event/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Supprime un événement
export const deleteEvent = async eventId => {
  try {
    const response = await api.delete(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
