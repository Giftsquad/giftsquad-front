import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import AuthContext from '../contexts/AuthContext';
import { theme } from '../styles/theme';

import InvitationsBadge from '../components/InvitationsBadge';

const { width } = Dimensions.get('window');

export default function HamburgerMenu({ visible, onClose }) {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    {
      title: 'Mes événements',
      icon: 'calendar-outline',
      onPress: () => {
        onClose();
        navigation.navigate('events');
      },
    },
    {
      title: 'Créer un événement',
      icon: 'add-circle-outline',
      onPress: () => {
        onClose();
        navigation.navigate('createEvent');
      },
    },
    {
      title: 'Invitations',
      icon: 'mail-outline',
      onPress: () => {
        onClose();
        navigation.navigate('invitations');
      },
    },
    {
      title: 'Mon Profil',
      icon: 'person-outline',
      onPress: () => {
        onClose();
        navigation.navigate('profil');
      },
    },
  ];

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.headerText}>MENU</Text>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={{ position: 'relative' }}>
                  {item.customIcon ? (
                    item.customIcon
                  ) : (
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={theme.colors.text.primary}
                    />
                  )}

                  {/* On affiche le badge si Invitations ets le titre*/}
                  {item.title === 'Invitations' && <InvitationsBadge />}
                </View>

                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: theme.colors.background.secondary,
  },
  menuHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: 10,
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
  menuItems: {
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
