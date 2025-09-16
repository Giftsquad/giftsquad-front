import { Redirect } from 'expo-router';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export default function Index() {
  const { userId, userToken } = useContext(AuthContext);

  // Si l'utilisateur est connecté, rediriger vers les événements
  if (userId && userToken) {
    return <Redirect href='/main/events' />;
  }

  // Sinon, rediriger vers la page de login
  return <Redirect href='/auth/login' />;
}
