import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Slot, router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import {
  getUserWithEvents,
  handleLogin,
  handleLogout,
} from '../services/authService';
import {
  fetchEventGifts,
  fetchEventWithGifts,
  handleAddGift,
  handleAddParticipant,
  handleCreateEvent,
  handleDeleteEvent,
  handleDeleteGift,
  handleDrawParticipant,
  handlePurchaseGiftListGift,
  handlePurchaseWishGift,
  handleRemoveParticipant,
  handleUpdateEvent,
  updateParticipationAmount,
} from '../services/eventService';
import { theme } from '../styles/theme';

// State user pour gérer l'utilisateur complet et savoir si on a fini d'initialiser
const RootLayout = () => {
  const [user, setUser] = useState(null);
  const [isInit, setIsInit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fonction login qui met à jour le state local et sauvegarde seulement le token
  const login = async userData => {
    await handleLogin(userData, setUser);
    await AsyncStorage.setItem('token', userData.token);
    // Recharger les événements après la connexion
    await loadUserWithEvents();
  };

  // Fonction logout qui réinitialise le state et supprime le token stocké
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // supprime le token du login
      await handleLogout(setUser);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Fonction pour charger l'utilisateur avec ses événements
  const loadUserWithEvents = async () => {
    try {
      setLoading(true);
      const userWithEvents = await getUserWithEvents();
      setUser(userWithEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour recharger les événements (utile après ajout de gift)
  const refreshEvents = async () => {
    await loadUserWithEvents();
  };

  // Fonction pour récupérer un événement spécifique depuis user.events
  const loadEvent = async eventId => {
    if (!user || !user.events) return null;
    return user.events.find(event => event._id === eventId);
  };

  // Fonction pour récupérer l'événement complet avec ses cadeaux
  const loadEventWithGifts = async eventId => {
    return await fetchEventWithGifts(eventId);
  };

  // Fonction pour récupérer tous les cadeaux d'un événement
  const loadEventGifts = async eventId => {
    return await fetchEventGifts(eventId);
  };

  // Fonction pour ajouter un participant
  const addParticipantToEvent = async (eventId, email) => {
    const result = await handleAddParticipant(eventId, email);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour supprimer un participant
  const removeParticipantFromEvent = async (eventId, email) => {
    const result = await handleRemoveParticipant(eventId, email);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour supprimer un événement
  const deleteEventById = async eventId => {
    const result = await handleDeleteEvent(eventId);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour créer un événement
  const createNewEvent = async eventData => {
    const result = await handleCreateEvent(eventData);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour mettre à jour un événement
  const updateEventById = async (eventId, eventData) => {
    const result = await handleUpdateEvent(eventId, eventData);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour ajouter un cadeau
  const addGiftToEvent = async (eventId, giftData, isWish = false) => {
    const result = await handleAddGift(eventId, giftData, isWish);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour supprimer un cadeau
  const deleteGiftById = async (eventId, giftId, isWish = false) => {
    const result = await handleDeleteGift(eventId, giftId, isWish);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  //Fonction pour effectuer le tirage au sort
  const drawParticipant = async eventId => {
    const result = await handleDrawParticipant(eventId);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour mettre une option sur un cadeau
  const purchaseWishGiftById = async (eventId, participantUserId, giftId) => {
    const result = await handlePurchaseWishGift(
      eventId,
      participantUserId,
      giftId
    );
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour mettre une option sur un cadeau de la giftList
  const purchaseGiftListGiftById = async (eventId, giftId) => {
    const result = await handlePurchaseGiftListGift(eventId, giftId);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  // Fonction pour mettre à jour le montant de participation
  const updateParticipationAmountById = async (eventId, amount) => {
    const result = await updateParticipationAmount(eventId, amount);
    await refreshEvents(); // Recharger les données après modification
    return result;
  };

  useEffect(() => {
    // Fonction lancée au démarrage pour initialiser l'app
    const fetchAsyncItem = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          // Récupérer l'utilisateur avec ses événements populés
          const userData = await getUserWithEvents();
          setUser(userData);
        } catch (error) {
          // console.log('Erreur lors de la récupération des données utilisateur');
          await AsyncStorage.removeItem('token');
          setUser(null);
        }
      } else {
        // console.log('Aucun token trouvé');
        setUser(null);
      }

      // Initialisation terminée
      setIsInit(true);
    };

    fetchAsyncItem();
  }, []);

  // Les événements sont maintenant directement dans user.events, pas besoin de useEffect séparé

  // Pendant que isInit est false (données pas encore récupérées), on affiche un loader
  if (!isInit) {
    return (
      <View
        style={[
          theme.components.screen.centerContent,
          {
            backgroundColor: theme.colors.background.primary,
            paddingTop: Constants.statusBarHeight,
          },
        ]}
      >
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  // Si les données ont bien été récupérées, on fournit le contexte d'authentification à toute l'application via <Slot />
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          isInit,
          events: user?.events || [],
          loading,
          fetchEvents: refreshEvents,
          refreshEvents: refreshEvents,
          fetchEvent: loadEvent,
          fetchEventWithGifts: loadEventWithGifts,
          fetchEventGifts: loadEventGifts,
          handleAddParticipant: addParticipantToEvent,
          handleRemoveParticipant: removeParticipantFromEvent,
          handleDeleteEvent: deleteEventById,
          handleCreateEvent: createNewEvent,
          handleUpdateEvent: updateEventById,
          handleAddGift: addGiftToEvent,
          handleDeleteGift: deleteGiftById,
          handleDrawParticipant: drawParticipant,
          handlePurchaseWishGift: purchaseWishGiftById,
          handlePurchaseGiftListGift: purchaseGiftListGiftById,
          updateParticipationAmount: updateParticipationAmountById,
        }}
      >
        <Slot />
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
