import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../../components/DrawerContent';

// Import des écrans
import CreateEventScreen from './createEvent';
import EventsScreen from './events';
import ProfilScreen from './profil';
import InvitationsScreen from './invitations';

const Drawer = createDrawerNavigator();

export default function EventLayout() {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name='events'
        component={EventsScreen}
        options={{
          title: 'Mes événements',
        }}
      />

      <Drawer.Screen
        name='createEvent'
        component={CreateEventScreen}
        options={{
          title: 'Créer un événement',
        }}
      />
      <Drawer.Screen
        name='invitations'
        component={InvitationsScreen}
        options={{
          title: 'invitations',
        }}
      />
      <Drawer.Screen
        name='profil'
        component={ProfilScreen}
        options={{
          title: 'Mon Profil',
        }}
      />
    </Drawer.Navigator>
  );
}
