import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useContext } from 'react';
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
        navigation.navigate('MainTabs', { screen: 'events' });
        navigation.closeDrawer();
      },
    },
    {
      title: 'Créer un Événement',
      icon: 'add-circle-outline',
      onPress: () => {
        console.log('Navigation vers: createTypeEvent');
        navigation.navigate('MainTabs', { screen: 'createTypeEvent' });
        navigation.closeDrawer();
      },
    },
   
    {
      title: 'Invitations',
      icon: 'mail-outline',
      onPress: () => {
        console.log('Navigation vers: invitations (désactivé)');
        // navigation.navigate('MainTabs', { screen: 'invitations' });
        navigation.closeDrawer();
      },
    },
    {
      title: 'Mon Profil',
      icon: 'person-outline',
      onPress: () => {
        console.log('Navigation vers: profil');
        navigation.navigate('MainTabs', { screen: 'profil' });
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
