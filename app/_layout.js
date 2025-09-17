import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { getUserById, updateUser } from '../services/authService';
import { theme } from '../styles/theme';

// State user pour gérer l'utilisateur complet et savoir si on a fini d'initialiser
const RootLayout = () => {
  const [user, setUser] = useState(null);
  const [isInit, setIsInit] = useState(false);

  // Fonction login qui met à jour le state local et sauvegarde le token et l'ID utilisateur
  const login = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('token', userData.token);
    await AsyncStorage.setItem('userId', userData._id);
  };

  // Fonction logout qui réinitialise le state et supprime le token et l'ID utilisateur stockés
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
  };

  // Fonction update qui met à jour l'utilisateur via l'API
  const update = async userData => {
    if (!user) {
      throw new Error('Aucun utilisateur connecté');
    }

    try {
      const updatedUserData = await updateUser(user._id, userData);
      setUser(updatedUserData);
      return updatedUserData;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Fonction lancée au démarrage pour initialiser l'app
    const fetchAsyncItem = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          // Récupérer l'ID utilisateur depuis le token stocké
          const userId = await AsyncStorage.getItem('userId');

          if (userId) {
            // Récupérer l'objet utilisateur complet depuis le backend via getUserById
            // console.log(
            //   '✅ Token trouvé, récupération des données utilisateur...'
            // );
            const userData = await getUserById(userId);
            // console.log('✅ Utilisateur récupéré:', userData);
            setUser(userData);
          } else {
            // Pas d'ID utilisateur stocké, supprimer le token
            await AsyncStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.log(
            '❌ Erreur lors de la récupération des données utilisateur'
          );
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userId');
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

  // Si les données ont bien été récupérées, on fournit le contexte d'authentification (user, login, logout, update, isInit) à toute l'application via <Slot />
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, login, logout, update, isInit }}>
        <Slot />
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
