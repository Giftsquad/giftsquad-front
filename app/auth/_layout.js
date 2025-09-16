import { FontAwesome, Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { theme } from '../../styles/theme';

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.components.tabBar.activeTintColor,
        tabBarInactiveTintColor: theme.components.tabBar.inactiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.components.tabBar.backgroundColor,
        },
      }}
    >
      <Tabs.Screen
        name='./main/event'
        options={{
          title: 'Mes évènements',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='calendar' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='login'
        options={{
          title: 'Se connecter',
          tabBarIcon: ({ color }) => (
            <FontAwesome name='user' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='signup'
        options={{
          title: "Se connecter",
          tabBarIcon: ({ color }) => (
            <Octicons name='sign-in' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
