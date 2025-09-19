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

//Récupère un événement spécifique par son ID
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
    const response = await api.get('/event/invitations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Décliner ou Accepter une invitation
export const actionInvitations = async (eventId, action) => {
  try {
    const response = await api.put(`/event/${eventId}/participant/${action}`);
    return response.data;
  } catch (error) {
    throw error;
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

//Ajoute un participant à un événement
export const addParticipant = async (eventId, email) => {
  try {
    const response = await api.post(`/event/${eventId}/participant`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
