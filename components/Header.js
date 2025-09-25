import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { getInvitations } from '../services/eventService';

import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Header({
  arrowShow = true,      // Affiche la flèche retour si true
  title = '',            // Titre affiché au centre du header
  showHamburger = false, // Affiche le menu hamburger si true
  onHamburgerPress,      // Fonction exécutée au clic sur le hamburger
  showInvitations = false, // Affiche l'icône d'invitations si true
}) {
  // State local pour stocker les invitations
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Récupération de l'utilisateur via le contexte global
  const { user } = useContext(AuthContext);

  // Récupération des invitations dès que l'utilisateur change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // On démarre le chargement
        const allInvitations = await getInvitations(); // Appel à l’API
        setInvitations(allInvitations); // Mise à jour du state
      } catch (error) {
        // console.log('Erreur de récupération des invitations', error);
      } finally {
        setIsLoading(false); // Fin du chargement
      }
    };

    if (user) {
      fetchData(); // On récupère les invitations seulement si l'utilisateur est connecté
    } else {
      setInvitations([]); // Si pas d'utilisateur, on vide la liste
    }
  }, [user]);

  return (
    <View style={styles.container}>

      {/* Zone gauche : Menu burger ou flèche retour */}
      {showHamburger ? (
        <TouchableOpacity onPress={onHamburgerPress}>
          <Ionicons name='menu' size={24} color={theme.colors.text.white} />
        </TouchableOpacity>
      ) : arrowShow ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color={theme.colors.text.white} />
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
            <MaterialIcons name='local-post-office' size={28} color={theme.colors.text.white} />

            {/* Badge de notifications */}
            {isLoading ? (
              // Loader si les invitations sont en cours de récupération
              <ActivityIndicator size="small" color="white" style={styles.badgeLoader} />
            ) : invitations.length > 0 && (
              // Badge rouge affichant le nombre d'invitations
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{invitations.length}</Text>
              </View>
            )}
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
  // Style du badge rouge
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10, // cercle (moitié de width/height)
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Texte centré dans le badge
  badgeText: {
    color: theme.colors.text.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Position du loader pendant la récupération
  badgeLoader: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
});
