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
export const addGift = async (
  eventId,
  giftData,
  eventType = null,
  isWish = false
) => {
  try {
    // Déterminer la route selon le type d'événement et si c'est un wish
    let route;
    if (isWish) {
      // Pour les wishes, utiliser la route wish-list
      route = `/event/${eventId}/wish-list`;
    } else if (eventType === 'secret_santa') {
      route = `/event/${eventId}/gift`;
    } else if (eventType === 'birthday') {
      route = `/event/${eventId}/gift-list`;
    } else if (eventType === 'christmas_list') {
      route = `/event/${eventId}/wish-list`;
    } else {
      // Par défaut, utiliser la route gift-list
      route = `/event/${eventId}/gift-list`;
    }

    const response = await api.post(route, giftData, {
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

// Fonction pour supprimer un cadeau
export const deleteGift = async (eventId, giftId, isWish = false) => {
  try {
    let response;
    if (isWish) {
      // Pour les wishlists, utiliser la route spécifique
      response = await api.delete(`/gifts/${eventId}/wish-list/${giftId}`);
    } else {
      // Pour les giftLists, utiliser la route générique
      response = await api.delete(`/gifts/gift/${giftId}`);
    }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du cadeau:', error);
    throw error;
  }
};

// Fonction pour supprimer un cadeau avec mise à jour du contexte
export const handleDeleteGift = async (
  eventId,
  giftId,
  isWish = false,
  setEvents
) => {
  try {
    const response = await deleteGift(eventId, giftId, isWish);
    // console.log('Réponse de suppression:', response);

    // Vérifier si la réponse contient l'événement mis à jour
    const updatedEvent = response?.event || response;

    if (setEvents && updatedEvent && updatedEvent._id) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    }

    return updatedEvent;
  } catch (error) {
    console.error('Erreur lors de la suppression du cadeau:', error);
    throw error;
  }
};

// Fonction pour mettre une option sur un cadeau
export const purchaseWishGift = async (eventId, participantUserId, giftId) => {
  try {
    const response = await api.put(
      `/gifts/${eventId}/wish-list/${participantUserId}/${giftId}/purchase`
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'option sur le cadeau:", error);
    throw error;
  }
};

// Fonction pour mettre une option sur un cadeau de la giftList
export const purchaseGiftListGift = async (eventId, giftId) => {
  try {
    const response = await api.put(
      `/gifts/${eventId}/gift-list/${giftId}/purchase`
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'option sur le cadeau:", error);
    throw error;
  }
};

// Fonction pour mettre une option sur un cadeau avec mise à jour du contexte
export const handlePurchaseWishGift = async (
  eventId,
  participantUserId,
  giftId,
  setEvents
) => {
  try {

    const response = await purchaseWishGift(eventId, giftId);
    // console.log("Réponse d'option:", response);


    // Vérifier si la réponse contient l'événement mis à jour
    const updatedEvent = response?.event || response;

    if (setEvents && updatedEvent && updatedEvent._id) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    }

    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de l'option sur le cadeau:", error);
    throw error;
  }
};

// Fonction pour mettre une option sur un cadeau de la giftList avec mise à jour du contexte
export const handlePurchaseGiftListGift = async (
  eventId,
  giftId,
  setEvents
) => {
  try {
    const response = await purchaseGiftListGift(eventId, giftId);
    // console.log("Réponse d'option giftList:", response);

    // Vérifier si la réponse contient l'événement mis à jour
    const updatedEvent = response?.event || response;

    if (setEvents && updatedEvent && updatedEvent._id) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    }

    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de l'option sur le cadeau:", error);
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

export const handleAddParticipant = async (eventId, email) => {
  try {
    const response = await addParticipant(eventId, email);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'ajout du participant:", error);
    throw error;
  }
};

export const handleRemoveParticipant = async (eventId, email) => {
  try {
    await removeParticipant(eventId, email);
    const updatedEvent = await getEvent(eventId);
    return updatedEvent;
  } catch (error) {
    console.error('Erreur lors de la suppression du participant:', error);
    throw error;
  }
};

export const handleDeleteEvent = async eventId => {
  try {
    await deleteEvent(eventId);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    throw error;
  }
};

export const handleCreateEvent = async eventData => {
  try {
    const newEvent = await createEvent(eventData);
    return newEvent;
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    throw error;
  }
};

export const handleUpdateEvent = async (eventId, eventData) => {
  try {
    const updatedEvent = await updateEvent(eventId, eventData);
    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    throw error;
  }
};

// Fonction pour ajouter un cadeau
export const handleAddGift = async (eventId, giftData, isWish = false) => {
  try {
    // Récupérer l'événement pour connaître son type
    const eventResponse = await api.get(`/event/${eventId}`);
    const event = eventResponse.data;

    // Vérifier que l'événement existe et a un type
    if (!event || !event.event_type) {
      throw new Error("Événement introuvable ou type d'événement manquant");
    }

    const updatedEvent = await addGift(
      eventId,
      giftData,
      event.event_type,
      isWish
    );

    return updatedEvent;
  } catch (error) {
    console.error("Erreur lors de l'ajout du cadeau:", error);
    throw error;
  }
};

// Fonction pour récupérer l'événement complet avec ses cadeaux
export const fetchEventWithGifts = async eventId => {
  try {
    const response = await api.get(`/event/${eventId}/event`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    throw error;
  }
};

// Fonction pour récupérer tous les cadeaux d'un événement
export const fetchEventGifts = async eventId => {
  try {
    const response = await api.get(`/event/${eventId}/gifts`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cadeaux:', error);
    throw error;
  }
};

//Fonction pour effectuer le tirage au sort
export const handleDrawParticipant = async eventId => {
  try {
    const response = await api.post(`/event/${eventId}/draw`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du tirage au sort:', error);
    throw error;
  }
};

// Fonction pour mettre à jour le montant de participation pour les anniversaires
export const updateParticipationAmount = async (eventId, amount) => {
  try {
    const response = await api.put(`/event/${eventId}/participate`, { amount });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la participation:', error);
    throw error;
  }
};
