import { useNavigation, useFocusEffect } from '@react-navigation/native'; // pour gérer la navigation (ouvrir le menu latéral)
import { router } from 'expo-router';
import { useContext, useState, useCallback } from 'react'; // hooks React (state, context, effet)
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header'; // notre header réutilisable
import AuthContext from '../../contexts/AuthContext'; // contexte qui contient l’utilisateur connecté
import { theme } from '../../styles/theme'; // styles globaux
import { getEvents } from '../../services/eventService'; // fonction pour récupérer les évènements

{
  /* Import des icônes */
}
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

export default function EventsScreen() {
  // on récupère l’utilisateur connecté
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  // state pour stocker la liste des évènements
  const [events, setEvents] = useState([]);

  // state qui indique si ça charge (true = on attend les données)
  const [loading, setLoading] = useState(true);

  // fonction pour aller chercher les évènements depuis l’API
  const fetchEvents = async () => {
    try {
      setLoading(true); // on affiche le loader
      const data = await getEvents(user.id); // on appelle l’API pour récupérer les évènements de l’utilisateur
      setEvents(data); // on stocke les évènements dans le state
    } catch (error) {
      console.error('Erreur lors du chargement des évènements:', error);
    } finally {
      setLoading(false); // on cache le loader
    }
  };

  // se déclenche à chaque retour sur l’écran
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchEvents();
      }
    }, [user])
  );

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Header avec le titre et le menu burger */}
      <Header
        title='MES ÉVÈNEMENTS'
        showHamburger={true}
        onHamburgerPress={() => navigation.openDrawer()}
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
              keyExtractor={item => item._id.toString()} // chaque item doit avoir une clé unique
              renderItem={({ item }) => (
                <View
                  style={{
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    justifyContent: 'space-around',
                  }}
                >
                  {/* Colonne gauche avec l’icône selon le type d’évènement */}
                  <View>
                    {item.event_type === 'Secret Santa' && (
                      <FontAwesome6 name='gift' size={30} color='black' />
                    )}
                    {item.event_type === 'Anniversary' && (
                      <FontAwesome6
                        name='cake-candles'
                        size={30}
                        color='black'
                      />
                    )}
                    {item.event_type === 'Christmas' && (
                      <FontAwesome name='tree' size={30} color='black' />
                    )}
                  </View>

                  {/* Colonne milieu avec le nom, le type d'évènement et la date */}
                  <View>
                    <Text style={styles.eventName}>{item.event_name}</Text>
                    <Text>{item.event_type}</Text>
                    <View style={styles.eventDate}>
                      <FontAwesome name='calendar' size={20} color='black' />
                      <Text>
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
                      color='black'
                    />
                  </View>
                </View>
              )}
              // si la liste est vide → message d’information
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                  Aucun évènement pour l'instant. Tu peux créer un évènement.
                </Text>
              )}
              contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            />

            {/* Bouton "Ajouter un évènement", toujours visible */}
            <TouchableOpacity
              style={[theme.components.button.primary, { margin: 40 }]}
              disabled={loading}
              onPress={() => router.push('/main/createEvent')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {loading ? (
                  <ActivityIndicator color={theme.colors.text.white} />
                ) : (
                  <Ionicons name='add' size={24} color='white' />
                )}
                <Text
                  style={[
                    theme.components.button.text.primary,
                    { marginLeft: 10 },
                  ]}
                >
                  {loading ? 'Création...' : 'Ajouter un évènement'}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
});
