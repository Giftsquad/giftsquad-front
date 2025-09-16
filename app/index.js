import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthContext from '../contexts/AuthContext';
import { theme } from '../styles/theme';

export default function Index() {
  const { user, isInit } = useContext(AuthContext);

  console.log('🔄 Index - État de connexion:', { user, isInit });

  // Si l'app n'est pas encore initialisée, afficher un loader
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

  // Si l'utilisateur est connecté, rediriger vers les événements
  if (user) {
    return <Redirect href='/main/events' />;
  }

  // Sinon, rediriger vers la page de login
  return <Redirect href='/auth/login' />;
}
