import { router } from 'expo-router';
import { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AuthContext from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

export default function EventScreen() {
  const { logout, user } = useContext(AuthContext);

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

      <TouchableOpacity
        style={[theme.components.button.primary, { marginTop: 10 }]}
        onPress={handleLogout}
      >
        <Text style={theme.components.button.text.primary}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
