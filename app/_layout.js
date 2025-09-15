import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { theme } from '../styles/theme';

const RootLayout = () => {
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isInit, setIsInit] = useState(false);

  // LOGIN/LOGOUT AMMENE A CHANGE CAR ON VA SE BASER UN TOKEN VALIDE

  const login = async (id, token) => {
    setUserId(id);
    setUserToken(token);
    await AsyncStorage.setItem('id', id);
    await AsyncStorage.setItem('token', token);
  };

  const logout = async () => {
    setUserId(null);
    setUserToken(null);
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('token');
  };

  useEffect(() => {
    const fetchAsyncItem = async () => {
      const id = await AsyncStorage.getItem('id');
      const token = await AsyncStorage.getItem('token');

      if (id && token) {
        setUserId(id);
        setUserToken(token);
      } else {
        setUserId(null);
        setUserToken(null);
      }

      setIsInit(true);
    };

    fetchAsyncItem();
  }, []);

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

  return (
    <AuthContext.Provider value={{ userId, userToken, login, logout }}>
      <Slot />
    </AuthContext.Provider>
  );
};

export default RootLayout;
