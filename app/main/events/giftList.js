import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function GiftListScreen({ navigation }) {
  const route = useRoute();
  const { event } = route.params;
  const { user, events, refreshEvents, loading, handleDeleteGift } =
    useContext(AuthContext);
  const [allGifts, setAllGifts] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [localEvent, setLocalEvent] = useState(event);

  // Calculer le montant collecté pour les anniversaires
  // Calcule la somme des participations
  const calculateCollectedAmount = () => {
    return (
      localEvent.event_participants?.reduce((total, participant) => {
        return total + (participant.participationAmount || 0);
      }, 0) || 0
    );
  };

  // Calcule le total des prix des cadeaux
  const calculateTotalAmount = () => {
    return (
      (currentEvent?.giftList || []).reduce((total, gift) => {
        return total + (gift.price || 0);
      }, 0) || 0
    );
  };

  // Utiliser useEffect pour charger les cadeaux depuis l'événement passé en paramètres
  // et se mettre à jour quand le contexte global change
  useEffect(() => {
    if (!event || !user) {
      setAllGifts([]);
      setCurrentEvent(null);
      return;
    }

    // Chercher l'événement mis à jour dans le contexte global (user.events)
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
            ? gift.addedBy.firstname || gift.addedBy.nickname || 'Inconnu'
            : 'Inconnu',
          // Ajouter les informations pour l'affichage
          isPersonalGiftList: gift.addedBy?._id === user?._id,
          addedByUser: gift.addedBy,
          addedAt: gift.createdAt || gift.addedAt,
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
                ? participant.user.firstname ||
                  participant.user.nickname ||
                  'Inconnu'
                : 'Inconnu',
              // Ajouter les informations pour l'affichage
              isPersonalWishList: participant.user?._id === user?._id,
              addedByUser: gift.addedBy,
              addedAt: gift.createdAt || gift.addedAt,
            });
          });
        }
      });
    }

    setAllGifts(gifts);
  }, [event, user, events]);

  // Fonction pour supprimer un cadeau
  const handleDeleteGiftListGift = async giftId => {
    try {
      await handleDeleteGift(currentEvent._id, giftId, false); // isWish = false pour giftList
    } catch (error) {
      console.error('Erreur lors de la suppression du cadeau:', error);
    }
  };

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
          style={[
            theme.components.button.primary,
            { marginVertical: 30, width: '90%', alignSelf: 'center' },
          ]}
          onPress={() => {
            navigation.navigate('addGift', {
              event: currentEvent,
            });
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator color={theme.colors.text.white} />
            ) : (
              <Ionicons
                name='add-circle'
                size={20}
                color={theme.colors.text.white}
              />
            )}
            <Text
              style={[theme.components.button.text.primary, { marginLeft: 10 }]}
            >
              + Ajouter un cadeau
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Somme collectée - Anniversaire seulement */}
      <View style={[styles.infoCard, styles.collectedCard]}>
        <View style={styles.collectedInfo}>
          <Text style={styles.collectedAmount}>
            Montant total collecté : {calculateCollectedAmount()} € sur{' '}
            {calculateTotalAmount()} €
          </Text>
        </View>
      </View>

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

              {/* Afficher qui a ajouté le cadeau selon le type */}
              {item.addedAt && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: 5,
                  }}
                >
                  {`Ajouté le ${new Date(item.addedAt).toLocaleDateString(
                    'fr-FR'
                  )} par ${
                    item.addedByUser?.firstname && item.addedByUser?.lastname
                      ? `${item.addedByUser.firstname} ${item.addedByUser.lastname}`
                      : item.addedByUser?.firstname ||
                        item.addedByUser?.nickname ||
                        'Inconnu'
                  }`}
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
              {/* Bouton de suppression pour l'utilisateur connecté */}
              {item.addedBy?._id === user?._id && (
                <TouchableOpacity
                  onPress={() => handleDeleteGiftListGift(item._id)}
                  style={{
                    backgroundColor: theme.colors.text.error,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 6,
                    marginTop: 10,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.bold,
                    }}
                  >
                    Supprimer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bouton d'ajout */}
      <TouchableOpacity
        style={[
          theme.components.button.primary,
          { marginVertical: 30, width: '90%', alignSelf: 'center' },
        ]}
        onPress={() => {
          navigation.navigate('addGift', {
            event: currentEvent,
          });
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
              style={[theme.components.button.text.primary, { marginLeft: 10 }]}
            >
            + Ajouter un cadeau
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Cartes d'information (date et montant collecté)
  infoCard: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FF6B35', // Orange pour la date
  },

  collectedCard: {
    backgroundColor: '#FFE082', // Orange clair pour le montant collecté
  },

  collectedAmount: {
    color: '#FF6B35', // Orange
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },

  participantsCount: {
    color: '#FF6B35', // Orange
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
