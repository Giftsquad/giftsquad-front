import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';

export default function GiftListScreen({ route, navigation }) {
  const { eventId } = route.params; // récupéré via navigation.navigate('addGift', { eventId })}
  const { events, fetchEvent } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        // D'abord chercher dans la liste locale des événements
        const localEvent = events.find(e => e._id === eventId);
        if (localEvent) {
          setEvent(localEvent);
        } else {
          // Si pas trouvé localement, récupérer via l'API
          const eventData = await fetchEvent(eventId);
          setEvent(eventData);
        }
      } catch (error) {
        console.error('Erreur fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId, events, fetchEvent]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size='large' color='#007AFF' />
      </View>
    );
  }

  if (!event?.giftList || event.giftList.length === 0) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: 8,
          }}
        >
          Aucun cadeau ajouté pour l’instant
        </Text>
        {/* Bouton d’ajout affiché même si la liste est vide */}
        <TouchableOpacity
          onPress={() => navigation.navigate('addGift', { eventId })}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: 8,
            }}
          >
            + Ajouter un cadeau
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1, padding: 20 }}
        data={event.giftList}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
            }}
          >
            {/* Affichage des images */}
            {item.images && item.images.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}
                >
                  {item.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.secure_url || image.url }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </View>
              </View>
            )}

            <View>
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}
              >
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
                {item.price} €
              </Text>
              {item.url ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                  <Text
                    style={{
                      color: '#007AFF',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Voir le produit
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      />

      {/* Bouton d’ajout */}
      <TouchableOpacity
        style={theme.components.card.container}
        onPress={() => navigation.navigate('addGift', { eventId })}
      >
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          + Ajouter un cadeau
        </Text>
      </TouchableOpacity>
    </View>
  );
}
