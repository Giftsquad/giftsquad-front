import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Slot, router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import {
  handleLogin,
  handleLogout,
  validateToken,
} from '../services/authService';
import {
  fetchEvent,
  fetchEvents,
  handleAddGift,
  handleAddParticipant,
  handleCreateEvent,
  handleDeleteEvent,
  handleRemoveParticipant,
  handleUpdateEvent,
} from '../services/eventService';
import { theme } from '../styles/theme';

// State user pour gérer l'utilisateur complet et savoir si on a fini d'initialiser
const RootLayout = () => {
  const [user, setUser] = useState(null);
  const [isInit, setIsInit] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fonction login qui met à jour le state local et sauvegarde seulement le token
  const login = async userData => {
    await handleLogin(userData, setUser);
    await AsyncStorage.setItem('token', userData.token);
  };

  // Fonction logout qui réinitialise le state et supprime le token stocké
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // supprime le token du login
      await handleLogout(setUser, setEvents);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Fonction pour charger les événements
  const loadEvents = async () => {
    if (!user) return;
    await fetchEvents(setEvents, setLoading);
  };

  // Fonction pour récupérer un événement spécifique
  const loadEvent = async eventId => {
    return await fetchEvent(eventId, setEvents);
  };

  // Fonction pour ajouter un participant
  const addParticipantToEvent = async (eventId, email) => {
    return await handleAddParticipant(eventId, email, setEvents);
  };

  // Fonction pour supprimer un participant
  const removeParticipantFromEvent = async (eventId, email) => {
    return await handleRemoveParticipant(eventId, email, setEvents);
  };

  // Fonction pour supprimer un événement
  const deleteEventById = async eventId => {
    return await handleDeleteEvent(eventId, setEvents);
  };

  // Fonction pour créer un événement
  const createNewEvent = async eventData => {
    return await handleCreateEvent(eventData, setEvents);
  };

  // Fonction pour mettre à jour un événement
  const updateEventById = async (eventId, eventData) => {
    return await handleUpdateEvent(eventId, eventData, setEvents);
  };

  // Fonction pour ajouter un cadeau
  const addGiftToEvent = async (eventId, giftData) => {
    return await handleAddGift(eventId, giftData, setEvents);
  };

  useEffect(() => {
    // Fonction lancée au démarrage pour initialiser l'app
    const fetchAsyncItem = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          // Récupérer l'objet utilisateur complet depuis le backend via validateToken
          const userData = await validateToken();
          setUser(userData);
        } catch (error) {
          console.log('Erreur lors de la récupération des données utilisateur');
          await AsyncStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log('Aucun token trouvé');
        setUser(null);
      }

      // Initialisation terminée
      setIsInit(true);
    };

    fetchAsyncItem();
  }, []);

  // Charger les événements quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadEvents();
    } else {
      setEvents([]);
    }
  }, [user]);

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
          events,
          loading,
          fetchEvents: loadEvents,
          fetchEvent: loadEvent,
          handleAddParticipant: addParticipantToEvent,
          handleRemoveParticipant: removeParticipantFromEvent,
          handleDeleteEvent: deleteEventById,
          handleCreateEvent: createNewEvent,
          handleUpdateEvent: updateEventById,
          handleAddGift: addGiftToEvent,
        }}
      >
        <Slot />
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
