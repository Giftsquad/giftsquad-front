import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../styles/theme';

const DrawerContent = ({ navigation }) => {
  const menuItems = [
    {
      title: 'Mes Événements',
      icon: 'calendar-outline',
      onPress: () => {
        console.log('Navigation vers: events');
        router.push('/main/events');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Créer un Événement',
      icon: 'add-circle-outline',
      onPress: () => {
        console.log('Navigation vers: createTypeEvent');
        router.push('/main/createTypeEvent');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Invitations',
      icon: 'mail-outline',
      onPress: () => {
        console.log('Navigation vers: invitations (désactivé)');
        // router.push('/main/invitations');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Mon Profil',
      icon: 'person-outline',
      onPress: () => {
        console.log('Navigation vers: profil');
        router.push('/main/profil');
        navigation.closeDrawer();
      },
    },
    {
      title: 'Test User',
      icon: 'flask-outline',
      onPress: () => {
        console.log('Navigation vers: testUser');
        router.push('/main/testUser');
        navigation.closeDrawer();
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>MENU</Text>
      </View>

      {/* Menu items */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={theme.colors.text.primary}
            />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.white,
    textTransform: 'uppercase',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 15,
  },
});

export default DrawerContent;
