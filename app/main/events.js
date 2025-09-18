import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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

{
  /* Import des icônes */
}

export default function EventsScreen() {
  // on récupère l'utilisateur connecté
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  // state pour stocker la liste des évènements
  const [events, setEvents] = useState([]);

  // state qui indique si ça charge (true = on attend les données)
  const [loading, setLoading] = useState(true);

  // state pour le menu hamburger
  const [menuVisible, setMenuVisible] = useState(false);

  // useEffect classique qui se déclenche au montage du composant
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
      {/* Header avec le titre et menu hamburger */}
      <Header
        title='MES ÉVÈNEMENTS'
        arrowShow={false}
        showHamburger={true}
        onHamburgerPress={() => setMenuVisible(true)}
      />

      {/* Menu hamburger personnalisé */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      {/* Zone principale */}
      <View style={{ flex: 1 }}>
        {loading ? (
          // si loading est true → on affiche le loader
          <ActivityIndicator size='large' color={theme.colors.primary} />
        ) : events.length > 0 ? (
          // si on a des évènements → on affiche la liste
          <FlatList
            style={{ flex: 1, padding: 20 }}
            data={events}
            keyExtractor={item => item._id.toString()} // chaque item doit avoir une clé unique
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
                      color='#4CAF50'
                    />
                  )}
                  {item.event_type === 'Christmas List' && (
                    <FontAwesome name='tree' size={30} color='#2196F3' />
                  )}
                </View>

                {/* Colonne milieu avec le nom, le type d'évènement et la date */}
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{item.event_name}</Text>
                  <View
                    style={[
                      styles.eventTypeTag,
                      {
                        backgroundColor:
                          item.event_type === 'Secret Santa'
                            ? '#FF6B35'
                            : item.event_type === 'Birthday'
                            ? '#4CAF50'
                            : item.event_type === 'Christmas List'
                            ? '#2196F3'
                            : '#ccc',
                      },
                    ]}
                  >
                    <Text style={styles.eventTypeText}>{item.event_type}</Text>
                  </View>
                  <View style={styles.eventDate}>
                    <FontAwesome
                      name='calendar'
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                    <Text style={styles.eventDateText}>
                      le {new Date(item.event_date).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>

                {/* Colonne droite avec la petite flèche */}
                <View>
                  <MaterialIcons
                    name='arrow-forward-ios'
                    size={24}
                    color='black'
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          // si on n’a pas d’évènements : message par défaut
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Aucun évènement trouvé.
          </Text>
        )}
      </View>
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
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  eventTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  eventTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventDateText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
});
