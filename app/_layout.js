import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { theme } from '../styles/theme';

// State id + token pour gérer l'utilisateur et savoir si on a fini d'initialiser
const RootLayout = () => {
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isInit, setIsInit] = useState(false);

  // LOGIN/LOGOUT AMMENE A CHANGE CAR ON VA SE BASER UN TOKEN VALIDE

  // LOGIN/LOGOUT AMMENE A CHANGE CAR ON VA SE BASER UN TOKEN VALIDE

  // Fonction login qui met à jour les states locaux et sauvegarde les infos dans AsyncStorage (persistance entre les sessions)
  const login = async (id, token) => {
    setUserId(id);
    setUserToken(token);
    await AsyncStorage.setItem('id', id);
    await AsyncStorage.setItem('token', token);
  };

  // Fonction logout qui réinitialise les states et supprime les infos stockées
  const logout = async () => {
    setUserId(null);
    setUserToken(null);
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('token');
  };

  useEffect(() => {
    // Fonction lancée au démarrage pour récupérer les données de session
    const fetchAsyncItem = async () => {
      const id = await AsyncStorage.getItem('id');
      const token = await AsyncStorage.getItem('token');

      // Si on trouve un id et un token, on reconnecte l’utilisateur
      if (id && token) {
        setUserId(id);
        setUserToken(token);
      } else {
        setUserId(null);
        setUserToken(null);
        setUserId(null);
        setUserToken(null);
      }

      // Si l'initialisation est bien effectuée, on passe ce state à true pour le prochain useEffect
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
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  // Si les données ont bien été récupérées, on fournit le contexte d’authentification (userId, token, login, logout) à toute l’application via <Slot />
  return (
    <AuthContext.Provider value={{ userId, userToken, login, logout }}>
      <Slot />
    </AuthContext.Provider>
  );
};

export default RootLayout;
