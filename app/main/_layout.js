import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans
import CreateEventScreen from './createEvent';
import CreateTypeEventScreen from './createTypeEvent';
import EventsScreen from './events';
import EventDetailsScreen from './events/[id]';
import ProfilScreen from './profil';

const Stack = createStackNavigator();

export default function EventLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='events'
        component={EventsScreen}
        options={{
          title: 'Mes événements',
        }}
      />
      <Stack.Screen
        name='createTypeEvent'
        component={CreateTypeEventScreen}
        options={{
          title: "Créer un type d'événement",
        }}
      />
      <Stack.Screen
        name='createEvent'
        component={CreateEventScreen}
        options={{
          title: 'Créer un événement',
        }}
      />
      <Stack.Screen
        name='profil'
        component={ProfilScreen}
        options={{
          title: 'Mon Profil',
        }}
      />
      <Stack.Screen
        name='event'
        component={EventDetailsScreen}
        options={{
          title: 'Événement',
        }}
      />
    </Stack.Navigator>
  );
}
