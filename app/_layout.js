import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { theme } from '../styles/theme';

// State user pour gérer l'utilisateur complet et savoir si on a fini d'initialiser
const RootLayout = () => {
  const [user, setUser] = useState(null);
  const [isInit, setIsInit] = useState(false);

  // Fonction login qui met à jour le state local et sauvegarde seulement le token
  const login = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('token', userData.token);
  };

  // Fonction logout qui réinitialise le state et supprime le token stocké
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('token');
  };

  useEffect(() => {
    // Fonction lancée au démarrage pour initialiser l'app
    const fetchAsyncItem = async () => {
      console.log("🔄 Initialisation de l'application...");

      const token = await AsyncStorage.getItem('token');

      console.log('📱 Token récupéré:', token ? 'présent' : 'absent');

      // Si on trouve un token, on considère que l'utilisateur est connecté
      // La validation du token se fera automatiquement lors du prochain appel API
      if (token) {
        console.log('✅ Token trouvé, utilisateur considéré comme connecté');
        // On met un objet temporaire avec le token pour indiquer la connexion
        // Les vraies données utilisateur seront récupérées lors du prochain appel API
        setUser({ token });
      } else {
        console.log('❌ Aucun token trouvé');
        setUser(null);
      }

      // Initialisation terminée
      setIsInit(true);
      console.log('✅ Initialisation terminée');
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

  // Si les données ont bien été récupérées, on fournit le contexte d'authentification (user, login, logout) à toute l'application via <Slot />
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Slot />
    </AuthContext.Provider>
  );
};

export default RootLayout;
