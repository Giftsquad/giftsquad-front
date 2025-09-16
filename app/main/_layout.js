import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationIndependentTree } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import DrawerContent from '../../components/DrawerContent';

const Drawer = createDrawerNavigator();

export default function EventLayout() {
  return (
    <NavigationIndependentTree>
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen name='MainTabs' component={MainTabs} />
      </Drawer.Navigator>
    </NavigationIndependentTree>
  );
}

function MainTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#6fd34e',
        },
        headerShown: false, // Désactiver les headers automatiques
      }}
    >
      {/* Onglet Tabs qui permet de diriger vers la page /main/event */}
      <Tabs.Screen
        name='events'
        options={{
          title: 'Mes évènements',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='calendar' size={24} color={color} />
          ),
        }}
      />

      {/* Onglet Tabs qui permet de diriger vers la page /main/creatEvent */}
      <Tabs.Screen
        name='createEvent'
        options={{
          title: 'Créer un évènement',
          tabBarIcon: ({ color }) => (
            <Ionicons name='create' size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='profil'
        options={{
          title: 'Mon Profil',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name='user-alt' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
