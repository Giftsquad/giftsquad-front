import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../../components/Header';
import Birthday from '../../../components/events/Birthday';
import Christmas from '../../../components/events/Christmas';
import Santa from '../../../components/events/Santa';
import AuthContext from '../../../contexts/AuthContext';
import { handleApiError } from '../../../services/errorService';
import { theme } from '../../../styles/theme';

export default function EventDetailsScreen() {
  const { user, events, fetchEvent } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer l'événement depuis user.events
        const eventData = await fetchEvent(id);
        setEvent(eventData);
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        setError(handleApiError(error).general || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id]);

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Header title='ÉVÉNEMENT' arrowShow={true} />
        <View style={theme.components.screen.centerContent}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Header title='ÉVÉNEMENT' arrowShow={true} />
        <View style={theme.components.screen.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={[theme.components.button.primary, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={theme.components.button.text.primary}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Header title='ÉVÉNEMENT' arrowShow={true} />
        <View style={theme.components.screen.centerContent}>
          <Text style={styles.errorText}>Événement introuvable</Text>
          <TouchableOpacity
            style={[theme.components.button.primary, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={theme.components.button.text.primary}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Fonction pour rendre le composant approprié selon le type d'événement
  const renderEventComponent = () => {
    switch (event.event_type) {
      case 'secret_santa':
        return <Santa event={event} user={user} />;
      case 'birthday':
        return <Birthday event={event} user={user} />;
      case 'christmas_list':
        return <Christmas event={event} user={user} />;
      default:
        return (
          <View style={theme.components.screen.centerContent}>
            <Text style={styles.errorText}>Type d'événement non supporté</Text>
          </View>
        );
    }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header
        title={event.event_name?.toUpperCase() || 'ÉVÉNEMENT'}
        arrowShow={true}
      />
      {renderEventComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});
