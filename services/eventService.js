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
export const actionInvitations = async (eventId, action, email) => {
  try {
    const response = await api.put(
      `/event/${eventId}/participant/${action}?email=${email}`
    );
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

//Retire un participant d'un événement (seulement pour l'organisateur)
export const removeParticipant = async (eventId, email) => {
  try {
    const response = await api.delete(`/event/${eventId}/participant/${email}`);
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

// Ajoute un cadeau à un événement
export const addGift = async (eventId, giftData) => {
  try {
    const response = await api.post(`/event/${eventId}/gift-list`, giftData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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

// Fonctions de gestion des données avec mise à jour du state
export const fetchEvents = async (setEvents, setLoading) => {
  try {
    setLoading(true);
    const eventsData = await getEvents();
    setEvents(eventsData);
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
  } finally {
    setLoading(false);
  }
};

export const fetchEvent = async (eventId, setEvents) => {
  try {
    const eventData = await getEvent(eventId);
    setEvents(prevEvents =>
      prevEvents.map(event => (event._id === eventId ? eventData : event))
    );
    return eventData;
  } catch (error) {
    console.error("Erreur lors du chargement de l'événement:", error);
    throw error;
  }
};

export const handleAddParticipant = async (eventId, email, setEvents) => {
  try {
    const updatedEvent = await addParticipant(eventId, email);
    setEvents(prevEvents =>
      prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
    );
    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de l'ajout du participant:", error);
    throw error;
  }
};

export const handleRemoveParticipant = async (eventId, email, setEvents) => {
  try {
    await removeParticipant(eventId, email);
    const updatedEvent = await getEvent(eventId);
    setEvents(prevEvents =>
      prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
    );
    return updatedEvent;
  } catch (error) {
    console.error('Erreur lors de la suppression du participant:', error);
    throw error;
  }
};

export const handleDeleteEvent = async (eventId, setEvents) => {
  try {
    await deleteEvent(eventId);
    setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    throw error;
  }
};

export const handleCreateEvent = async (eventData, setEvents) => {
  try {
    const newEvent = await createEvent(eventData);
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    return newEvent;
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    throw error;
  }
};

export const handleUpdateEvent = async (eventId, eventData, setEvents) => {
  try {
    const updatedEvent = await updateEvent(eventId, eventData);
    setEvents(prevEvents =>
      prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
    );
    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    throw error;
  }
};

// Fonction pour ajouter un cadeau
export const handleAddGift = async (eventId, giftData, setEvents) => {
  try {
    const updatedEvent = await addGift(eventId, giftData);
    setEvents(prevEvents =>
      prevEvents.map(event => (event._id === eventId ? updatedEvent : event))
    );
    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de l'ajout du cadeau:", error);
    throw error;
  }
};
