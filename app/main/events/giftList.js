import { useRoute } from '@react-navigation/native';
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

export default function GiftListScreen({ navigation }) {
  const route = useRoute();
  const { event } = route.params;
  const { user, events } = useContext(AuthContext);
  const [allGifts, setAllGifts] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Utiliser useEffect pour charger les cadeaux depuis l'événement passé en paramètres
  // et se mettre à jour quand le contexte global change
  useEffect(() => {
    const loadGiftsFromEvent = () => {
      if (!event || !user) {
        setAllGifts([]);
        setCurrentEvent(null);
        return;
      }

      // Chercher l'événement mis à jour dans le contexte global
      const updatedEvent = events.find(e => e._id === event._id) || event;
      setCurrentEvent(updatedEvent);

      // Collecter les cadeaux directement dans le composant
      const gifts = [];

      // Ajouter les cadeaux de la giftList de l'événement
      if (updatedEvent.giftList && updatedEvent.giftList.length > 0) {
        updatedEvent.giftList.forEach(gift => {
          gifts.push({
            ...gift,
            source: 'giftList',
            eventId: updatedEvent._id,
            eventName: updatedEvent.event_name,
            addedByParticipantName: gift.addedBy
              ? gift.addedBy.username
              : 'Inconnu',
          });
        });
      }

      // Ajouter les cadeaux des wishLists des participants
      if (
        updatedEvent.event_participants &&
        updatedEvent.event_participants.length > 0
      ) {
        updatedEvent.event_participants.forEach(participant => {
          if (participant.wishList && participant.wishList.length > 0) {
            participant.wishList.forEach(gift => {
              gifts.push({
                ...gift,
                source: 'wishList',
                eventId: updatedEvent._id,
                eventName: updatedEvent.event_name,
                addedByParticipantName: participant.user
                  ? participant.user.username
                  : 'Inconnu',
              });
            });
          }
        });
      }

      setAllGifts(gifts);
    };

    loadGiftsFromEvent();
  }, [event, user, events]); // Ajouter events aux dépendances

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  // Si aucun événement n'est trouvé
  if (!currentEvent) {
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
            color: theme.colors.text.error,
            marginBottom: 8,
            textAlign: 'center',
            marginTop: 50,
          }}
        >
          Événement introuvable
        </Text>
      </View>
    );
  }

  if (allGifts.length === 0) {
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
            textAlign: 'center',
            marginTop: 50,
          }}
        >
          Aucun cadeau ajouté pour l'instant
        </Text>
        {/* Bouton d'ajout affiché même si la liste est vide */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('addGift', {
              event: currentEvent,
            });
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: 8,
              textAlign: 'center',
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
        data={allGifts}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate('gift', {
                gift: item,
                event: currentEvent,
              });
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
                        width: 80,
                        height: 80,
                        borderRadius: 4,
                        resizeMode: 'cover',
                      }}
                    />
                  ))}
                </View>
              </View>
            )}

            <View>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: 5,
                }}
              >
                {item.name}
              </Text>
              {/* Afficher le nom de l'événement */}
              {item.eventName && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: 5,
                    fontStyle: 'italic',
                  }}
                >
                  Événement: {item.eventName}
                </Text>
              )}
              <Text
                style={{
                  fontSize: theme.typography.fontSize.md,
                  color: theme.colors.text.secondary,
                  marginBottom: 5,
                }}
              >
                {item.price} €
              </Text>
              {/* Afficher qui a ajouté le cadeau */}
              {item.addedByParticipantName && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: 5,
                  }}
                >
                  Ajouté par : {item.addedByParticipantName}
                </Text>
              )}
              {item.url ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                  <Text
                    style={{
                      color: theme.colors.primary.main,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Voir le produit
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bouton d'ajout */}
      <TouchableOpacity
        style={theme.components.card.container}
        onPress={() => {
          navigation.navigate('addGift', {
            event: currentEvent,
          });
        }}
      >
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          + Ajouter un cadeau
        </Text>
      </TouchableOpacity>
    </View>
  );
}
