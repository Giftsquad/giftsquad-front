import { useContext, useEffect, useState } from 'react';
import {
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
  const { event } = route.params; // récupéré via navigation.navigate('giftList', { event })}
  const { events } = useContext(AuthContext);
  const [allGifts, setAllGifts] = useState([]);

  // Toujours utiliser l'événement mis à jour depuis le contexte global
  const currentEvent = events.find(e => e._id === event._id) || event;

  // Utiliser useEffect pour mettre à jour la liste des cadeaux quand l'événement change
  useEffect(() => {
    // Vérifier si l'événement existe, sinon retourner un tableau vide
    if (!currentEvent) {
      setAllGifts([]);
      return;
    }

    // Initialiser un tableau vide pour stocker tous les cadeaux
    const gifts = [];

    // Ajouter les cadeaux de la giftList (pour les anniversaires)
    // Vérifier si l'événement a une giftList et qu'elle n'est pas vide
    if (currentEvent.giftList && currentEvent.giftList.length > 0) {
      // Parcourir chaque cadeau de la giftList
      currentEvent.giftList.forEach(gift => {
        // Ajouter le cadeau au tableau
        gifts.push(gift);
      });
    }

    // Ajouter les cadeaux des wishList des participants (pour Secret Santa et Christmas List)
    // Vérifier si l'événement a des participants et qu'il y en a au moins un
    if (
      currentEvent.event_participants &&
      currentEvent.event_participants.length > 0
    ) {
      // Parcourir chaque participant de l'événement
      currentEvent.event_participants.forEach(participant => {
        // Vérifier si le participant a une wishList et qu'elle n'est pas vide
        if (participant.wishList && participant.wishList.length > 0) {
          // Parcourir chaque cadeau de la wishList du participant
          participant.wishList.forEach(gift => {
            // Ajouter le cadeau au tableau
            gifts.push(gift);
          });
        }
      });
    }

    // Mettre à jour l'état avec le tableau contenant tous les cadeaux (giftList + wishList)
    setAllGifts(gifts);
  }, [currentEvent, events]); // Dépendance sur currentEvent ET events pour garantir la réactivité

  // Si l'événement n'est pas trouvé, afficher un message d'erreur
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
          }}
        >
          Aucun cadeau ajouté pour l'instant
        </Text>
        {/* Bouton d'ajout affiché même si la liste est vide */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('addGift', { eventId: currentEvent._id })
          }
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
            onPress={() =>
              navigation.navigate('gift', {
                gift: item,
                event: currentEvent,
              })
            }
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
              {item.addedBy && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: 5,
                  }}
                >
                  Ajouté par :{' '}
                  {item.addedBy.firstname ||
                    item.addedBy.nickname ||
                    'Utilisateur inconnu'}
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

      {/* Bouton d’ajout */}
      <TouchableOpacity
        style={theme.components.card.container}
        onPress={() =>
          navigation.navigate('addGift', { eventId: currentEvent._id })
        }
      >
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          + Ajouter un cadeau
        </Text>
      </TouchableOpacity>
    </View>
  );
}
