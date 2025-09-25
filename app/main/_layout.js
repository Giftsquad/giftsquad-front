import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity } from 'react-native';

// Import des écrans
import CreateEventScreen from './createEvent';
import EventsScreen from './events';
import EventDetailsScreen from './events/[id]';
import AddGiftScreen from './events/addGift';
import AddWishScreen from './events/addWish';
import GiftListScreen from './events/giftList';
import WishListScreen from './events/wishList';
import GiftDetailScreen from './gifts/[id]';
import InvitationsScreen from './invitations';
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
      <Stack.Screen
        name='eventWishList'
        component={WishListScreen}
        options={{
          title: 'Ma liste de souhaits',
        }}
      />
      <Stack.Screen
        name='eventAddWish'
        component={AddWishScreen}
        options={{
          title: 'Ajouter un souhait',
        }}
      />
      <Stack.Screen
        name='invitations'
        component={InvitationsScreen}
        options={{
          title: 'Invitations',
        }}
      />
      <Stack.Screen
        name='GiftList'
        component={GiftListScreen}
        options={{
          title: 'Liste de cadeaux',
        }}
      />
      <Stack.Screen
        name='addGift'
        component={AddGiftScreen}
        options={{
          title: 'Ajouter un cadeau',
        }}
      />
      <Stack.Screen
        name='addWish'
        component={AddWishScreen}
        options={{
          title: 'Ajouter un souhait',
        }}
      />
      <Stack.Screen
        name='WishList'
        component={WishListScreen}
        options={({ navigation, route }) => {
          const participant = route.params?.participant;
          const participantName =
            participant?.user?.firstname ||
            participant?.user?.nickname ||
            'Participant';
          const isCurrentUser =
            participant?.user?._id === route.params?.user?._id;

          return {
            title: isCurrentUser
              ? 'Ma liste de souhaits'
              : `Liste de ${participantName}`,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Text style={{ fontSize: 18 }}>←</Text>
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Stack.Screen
        name='gift'
        component={GiftDetailScreen}
        options={{
          title: 'Détail du cadeau',
        }}
      />
    </Stack.Navigator>
  );
}
