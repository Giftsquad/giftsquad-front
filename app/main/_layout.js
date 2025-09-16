import { Tabs } from 'expo-router';
import { FontAwesome, Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function EventLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#6fd34e',
        },
      }}
    >
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

      {/* Onglet Tabs qui permet de diriger vers la page /main/event */}
      <Tabs.Screen
        name='event'
        options={{
          title: 'Mes évènements',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='calendar' size={24} color={color} />
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
