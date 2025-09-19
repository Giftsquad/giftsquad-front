import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HamburgerMenu from '../../components/HamburgerMenu';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { getEvents } from '../../services/eventService';
import { theme } from '../../styles/theme';

// Import des icônes
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function EventsScreen() {
  // on récupère l'utilisateur connecté
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  // state pour stocker la liste des évènements
  const [events, setEvents] = useState([]);

  // state qui indique si ça charge (true = on attend les données)
  const [loading, setLoading] = useState(true);

  // state pour gérer l'ouverture/fermeture du menu hamburger
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Erreur lors du chargement des évènements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, []);

  return (
    <View
      style={[
        theme.components.screen.container,
        {
          backgroundColor: theme.colors.background.primary,
          paddingBottom: Constants.statusBarHeight + 20,
        },
      ]}
    >
      {/* Header avec le titre et le menu burger */}
      <Header
        title='Mes évènements'
        showHamburger={true}
        onHamburgerPress={() => setMenuVisible(true)}
        arrowShow={false}
      />

      {/* Zone principale */}
      <View style={{ flex: 1 }}>
        {loading ? (
          // si loading est true → on affiche le loader
          <ActivityIndicator size='large' color={theme.colors.primary} />
        ) : (
          <>
            {/* Liste des évènements */}
            <FlatList
              style={{ flex: 1, padding: 20 }}
              data={events}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[theme.components.card.container, styles.eventCard]}
                  onPress={() => navigation.navigate('event', { id: item._id })}
                >
                  {/* Colonne gauche avec l'icône selon le type d'évènement */}
                  <View>
                    {item.event_type === 'Secret Santa' && (
                      <FontAwesome6 name='gift' size={30} color='#FF6B35' />
                    )}
                    {item.event_type === 'Birthday' && (
                      <FontAwesome6
                        name='cake-candles'
                        size={30}
                        color='#2196F3'
                      />
                    )}
                    {item.event_type === 'Christmas List' && (
                      <FontAwesome name='tree' size={30} color='#4CAF50' />
                    )}
                  </View>

                  {/* Colonne milieu avec le nom, le type d'évènement et la date */}
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{item.event_name}</Text>
                    <View style={styles.eventTypeContainer}>
                      <View
                        style={[
                          styles.eventTypeBadge,
                          item.event_type === 'Secret Santa' &&
                            styles.secretSantaBadge,
                          item.event_type === 'Birthday' &&
                            styles.birthdayBadge,
                          item.event_type === 'Christmas List' &&
                            styles.christmasListBadge,
                        ]}
                      >
                        <Text style={styles.eventTypeText}>
                          {item.event_type}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dateContainer}>
                      <FontAwesome
                        name='calendar'
                        size={20}
                        color={theme.colors.text.secondary}
                      />
                      <Text style={styles.dateText}>
                        le{' '}
                        {new Date(item.event_date).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                  </View>

                  {/* Colonne droite avec la petite flèche */}
                  <View>
                    <MaterialIcons
                      name='arrow-forward-ios'
                      size={24}
                      color={theme.colors.text.secondary}
                    />
                  </View>
                </TouchableOpacity>
              )}
              // si la liste est vide → message d’information
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                  Aucun évènement pour l'instant. Tu peux créer un évènement.
                </Text>
              )}
            />
          </>
        )}
      </View>

      {/* Menu hamburger */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 5,
  },
  eventTypeContainer: {
    marginBottom: 8,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  secretSantaBadge: {
    backgroundColor: '#FF6B35',
  },
  birthdayBadge: {
    backgroundColor: '#2196F3',
  },
  christmasListBadge: {
    backgroundColor: '#4CAF50',
  },
  eventTypeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
