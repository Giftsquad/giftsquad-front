import { router, Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import AuthContext from "../contexts/AuthContext";
import { useEffect, useState } from "react";

// State id + token pour gérer l'utilisateur et savoir si on a fini d'initialiser
const RootLayout = () => {
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isInit, setIsInit] = useState(false);

  // Fonction login qui met à jour les states locaux et sauvegarde les infos dans AsyncStorage (persistance entre les sessions)
  const login = async (id, token) => {
    setUserId(id);
    setUserToken(token);
    await AsyncStorage.setItem("id", id);
    await AsyncStorage.setItem("token", token);
  };

  // Fonction logout qui réinitialise les states et supprime les infos stockées
  const logout = async () => {
    setUserId(null);
    setUserToken(null);
    await AsyncStorage.removeItem("id");
    await AsyncStorage.removeItem("token");
  };

  useEffect(() => {
    // Fonction lancée au démarrage pour récupérer les données de session
    const fetchAsyncItem = async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");

      // Si on trouve un id et un token, on reconnecte l’utilisateur
      if (id && token) {
        setUserId(id);
        setUserToken(token);
      } else {
        setUserId(null);
        setUserToken(null);
      }

      // Si l'initialisation est bien effectuée, on passe ce state à true pour le prochain useEffect
      setIsInit(true);
    };

    fetchAsyncItem();

    
  }, []);

  useEffect(() => {
    // Quand l’initialisation est bien effectuée :
    if (isInit) {
      if (userId && userToken) {
        // On redirige automatiquement vers la page /main/event si utilisateur connecté
        router.replace("/main/event");
      } else {
        // Sinon on redirige vers la page /auth/login
        router.replace("/auth/login"); // évite de pouvoir revenir sur l’écran login après connexion grâce au replace
      }
    }
  }, [userId, userToken, isInit]);

  // Pendant que isInit est false (données pas encore récupérées), on affiche un loader
  if (!isInit) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
