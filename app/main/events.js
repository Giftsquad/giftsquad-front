import { router } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AuthContext from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

export default function EventScreen() {
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    console.log('Page Events - Objet utilisateur:', user);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View
      style={[
        theme.components.screen.centerContent,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Text style={theme.components.screen.title}>MES ÉVÈNEMENTS</Text>
      {user?.email && (
        <Text style={theme.components.screen.title}>{user.email}</Text>
      )}

      <TouchableOpacity
        style={[theme.components.button.primary, { marginTop: 10 }]}
        onPress={handleLogout}
      >
        <Text style={theme.components.button.text.primary}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
