import { Redirect } from 'expo-router';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export default function Index() {
  const { user } = useContext(AuthContext);

  console.log('🔄 Index - État de connexion:', { user });

  // Si l'utilisateur est connecté, rediriger vers les événements
  if (user) {
    return <Redirect href='/main/events' />;
  }

  // Sinon, rediriger vers la page de login
  return <Redirect href='/auth/login' />;
}
