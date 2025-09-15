import { router, Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import AuthContext from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const RootLayout = () => {
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isInit, setIsInit] = useState(false);

  const login = async (id, token) => {
    setUserId(id);
    setUserToken(token);
    await AsyncStorage.setItem("id", id);
    await AsyncStorage.setItem("token", token);
  };

  const logout = async () => {
    setUserId(null);
    setUserToken(null);
    await AsyncStorage.removeItem("id");
    await AsyncStorage.removeItem("token");
  };

  useEffect(() => {
    const fetchAsyncItem = async () => {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");

      if (id && token) {
        setUserId(id);
        setUserToken(token);
      } else {
        setUserId("");
        setUserToken("");
      }

      setIsInit(true);
    };

    fetchAsyncItem();

    
  }, []);

  useEffect(() => {
    if (isInit) {
      if (userId && userToken) {
        router.replace("/main/event");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [userId, userToken, isInit]);

  if (!isInit) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ userId, userToken, login, logout }}>
      <Slot />
    </AuthContext.Provider>
  );
};

export default RootLayout;
