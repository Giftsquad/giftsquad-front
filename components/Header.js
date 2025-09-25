import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

import InvitationsBadge from '../components/InvitationsBadge';

import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Header({
  arrowShow = true, // Affiche la flèche retour si true
  title = '', // Titre affiché au centre du header
  showHamburger = false, // Affiche le menu hamburger si true
  onHamburgerPress, // Fonction exécutée au clic sur le hamburger
  showInvitations = false, // Affiche l'icône d'invitations si true
}) {
  // Récupération de l'utilisateur via le contexte global
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* Zone gauche : Menu burger ou flèche retour */}
      {showHamburger ? (
        <TouchableOpacity onPress={onHamburgerPress}>
          <Ionicons name='menu' size={24} color={theme.colors.text.white} />
        </TouchableOpacity>
      ) : arrowShow ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={theme.colors.text.white}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // Espace réservé si aucun bouton
      )}

      {/* Zone centrale : Titre */}
      <Text style={styles.title}>{title}</Text>

      {/* Zone droite : Icône invitations avec badge */}
      {showInvitations ? (
        <TouchableOpacity
          onPress={() => router.push('/main/invitations')}
          style={{ marginLeft: 10 }}
        >
          <View style={{ position: 'relative' }}>
            {/* Icône enveloppe */}
            <MaterialIcons
              name='local-post-office'
              size={28}
              color={theme.colors.text.white}
            />
            <InvitationsBadge />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // Espace réservé si pas d'invitations
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Conteneur global du header
  container: {
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Style du titre centré
  title: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
  },
});
