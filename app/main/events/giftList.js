import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../../contexts/AuthContext';
import { handleApiError } from '../../../services/errorService';
import { getEvent } from '../../../services/eventService';
import { theme } from '../../../styles/theme';

export default function GiftListScreen() {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventData = await getEvent(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        setError(handleApiError(error).general || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const renderGift = ({ item }) => (
    <View style={styles.giftCard}>
      <View style={styles.giftImageContainer}>
        {item.image?.url ? (
          <View
            style={[
              styles.giftImage,
              { backgroundImage: `url(${item.image.url})` },
            ]}
          />
        ) : (
          <View style={[styles.giftImage, styles.placeholderImage]}>
            <FontAwesome5
              name='gift'
              size={30}
              color={theme.colors.text.secondary}
            />
          </View>
        )}
      </View>
      <View style={styles.giftInfo}>
        <Text style={styles.giftName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.giftDescription}>{item.description}</Text>
        )}
        {item.price && <Text style={styles.giftPrice}>{item.price}€</Text>}
        {item.url && (
          <TouchableOpacity style={styles.urlButton}>
            <Text style={styles.urlText}>Voir le produit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
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
        <View style={theme.components.screen.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
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
        <View style={theme.components.screen.centerContent}>
          <Text style={styles.errorText}>Événement introuvable</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Liste de cadeaux</Text>
        <Text style={styles.headerSubtitle}>{event.event_name}</Text>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('addGift', { eventId: event._id })}
        >
          <FontAwesome5 name='plus' size={16} color={theme.colors.text.white} />
          <Text style={styles.addButtonText}>Ajouter un cadeau</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.giftList}
        data={event.giftList || []}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderGift}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome5
              name='gift'
              size={50}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.emptyText}>Aucun cadeau dans la liste</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez des cadeaux pour que les participants puissent voir ce qui
              est souhaité
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  addButtonContainer: {
    padding: 20,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 10,
  },
  giftList: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  giftCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftImageContainer: {
    marginRight: 15,
  },
  giftImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftInfo: {
    flex: 1,
  },
  giftName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 5,
  },
  giftDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 5,
  },
  giftPrice: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  urlButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  urlText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: 15,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});
