import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';
import Header from '../../../components/Header';

export default function WishListScreen({ navigation }) {
  const route = useRoute();
  const { event, participant } = route.params;
  const {
    user,
    events,
    refreshEvents,
    loading,
    handleDeleteGift,
    handlePurchaseWishGift,
  } = useContext(AuthContext);
  const [wishListGifts, setWishListGifts] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentParticipant, setCurrentParticipant] = useState(null);

  // Utiliser useEffect pour charger les cadeaux de la wishList du participant spécifique
  // et se mettre à jour quand le contexte global change
  useEffect(() => {
    if (!event || !user) {
      setWishListGifts([]);
      setCurrentEvent(null);
      setCurrentParticipant(null);
      return;
    }

    // Chercher l'événement mis à jour dans le contexte global (user.events)
    const updatedEvent = events.find(e => e._id === event._id) || event;
    setCurrentEvent(updatedEvent);

    // Si un participant spécifique est passé, utiliser ses souhaits
    let targetParticipant = participant;

    // Si pas de participant spécifique, utiliser l'utilisateur connecté
    if (!targetParticipant && user) {
      targetParticipant = updatedEvent.event_participants?.find(
        p => p.user?._id === user._id
      );
    }

    setCurrentParticipant(targetParticipant);

    // Collecter les cadeaux de la wishList du participant
    const gifts = [];

    // Essayer de trouver le participant dans l'événement mis à jour
    let actualParticipant = targetParticipant;
    if (updatedEvent?.event_participants && targetParticipant) {
      const foundParticipant = updatedEvent.event_participants.find(
        p => p.user?._id === targetParticipant.user?._id
      );
      if (foundParticipant) {
        actualParticipant = foundParticipant;
      }
    }

    if (
      actualParticipant &&
      actualParticipant.wishList &&
      actualParticipant.wishList.length > 0
    ) {
      actualParticipant.wishList.forEach(gift => {
        gifts.push({
          ...gift,
          source: 'wishList',
          eventId: updatedEvent._id,
          eventName: updatedEvent.event_name,
          addedByParticipantName:
            actualParticipant.user?.firstname ||
            actualParticipant.user?.nickname ||
            'Participant',
          // Ajouter les informations pour l'affichage
          isPersonalWishList: actualParticipant.user?._id === user?._id,
          addedByUser: gift.addedBy,
          addedAt: gift.createdAt || gift.addedAt,
        });
      });
    }

    setWishListGifts(gifts);
  }, [event?._id, participant?._id, user?._id, events, events.length]);

  // Recharger les événements quand on revient sur l'écran
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshEvents();
    });

    return unsubscribe;
  }, [navigation, refreshEvents]);

  // Fonction pour supprimer un cadeau
  const handleDeleteWishGift = async giftId => {
    try {
      await handleDeleteGift(currentEvent._id, giftId, true); // isWish = true
    } catch (error) {
      console.error('Erreur lors de la suppression du cadeau:', error);
    }
  };

  // Fonction pour mettre une option sur un cadeau
  const handlePurchaseWish = async giftId => {
    try {
      await handlePurchaseWishGift(currentEvent._id, giftId, true);
    } catch (error) {
      console.error("Erreur lors de l'option sur le cadeau:", error);
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

  // Vérifier si c'est l'utilisateur actuel par ID ou par email
  const isCurrentUser =
    currentParticipant?.user?._id === user?._id ||
    currentParticipant?.email === user?.email;

  if (wishListGifts.length === 0) {
    const participantName =
      currentParticipant?.user?.firstname ||
      currentParticipant?.user?.nickname ||
      'Ce participant';

    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Header
          title={
            isCurrentUser
              ? 'Ma liste de souhaits'
              : `Liste de ${participant.user.firstname} ${participant.user.lastname}`
          }
          arrowShow={true}
        />

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
          {isCurrentUser
            ? 'Votre liste de souhaits est vide'
            : `La liste de souhaits de ${participantName} est vide`}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          {isCurrentUser
            ? 'Ajoutez des cadeaux que vous souhaitez recevoir'
            : `${participantName} n'a pas encore ajouté de souhaits`}
        </Text>
        {/* Bouton d'ajout affiché seulement si c'est l'utilisateur connecté */}
        {isCurrentUser && (
          <TouchableOpacity
            style={[
              theme.components.button.primary,
              { alignSelf: 'center', paddingHorizontal: 20 },
            ]}
            onPress={() => {
              navigation.navigate('addWish', {
                event: currentEvent,
              });
            }}
          >
            <Text
              style={[
                theme.components.button.text.primary,
                { textAlign: 'center' },
              ]}
            >
              + Ajouter un souhait
            </Text>
          </TouchableOpacity>
        )}
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
      <Header
        title={
          isCurrentUser
            ? 'Ma liste de souhaits'
            : `Liste de ${participant.user.firstname} ${participant.user.lastname}`
        }
        arrowShow={true}
      />

      <FlatList
        style={{ flex: 1, padding: 20 }}
        data={wishListGifts}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('gift', {
                gift: item,
                event: currentEvent,
              });
            }}
          >
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
                {/* Afficher qui a ajouté le cadeau selon le type de wishlist */}
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
                    )}`}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.bold,
                    marginBottom: 5,
                  }}
                >
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.md,
                      color: theme.colors.text.secondary,
                      marginBottom: 5,
                    }}
                  >
                    {item.description}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: item.url ? 'space-between' : 'flex-end',
                  }}
                >
                  {item.url ? (
                    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                      <Text
                        style={{
                          backgroundColor: theme.colors.primary,
                          ...styles.button,
                        }}
                      >
                        Voir le produit
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {/* Bouton de suppression pour l'utilisateur connecté */}
                  {(currentParticipant?.user?._id === user?._id ||
                    currentParticipant?.email === user?.email) && (
                    <TouchableOpacity
                      onPress={() => handleDeleteWishGift(item._id)}
                    >
                      <Text
                        style={{
                          backgroundColor: theme.colors.text.error,
                          ...styles.button,
                        }}
                      >
                        Supprimer
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {!isCurrentUser && !item.purchasedBy && (
                  <TouchableOpacity
                    onPress={() => handlePurchaseWish(item._id)}
                  >
                    <Text
                      style={{
                        backgroundColor: theme.colors.secondary,
                        textAlign: 'center',
                        ...styles.button,
                      }}
                    >
                      Je m'occupe de ce cadeau
                    </Text>
                  </TouchableOpacity>
                )}
                {!isCurrentUser &&
                  item.purchasedBy &&
                  item.purchasedBy._id === user._id && (
                    <Text
                      style={{
                        backgroundColor: theme.colors.primary,
                        textAlign: 'center',
                        ...styles.button,
                      }}
                    >
                      Vous vous occupez de ce cadeau
                    </Text>
                  )}
                {!isCurrentUser &&
                  item.purchasedBy &&
                  item.purchasedBy._id !== user._id && (
                    <Text
                      style={{
                        backgroundColor: theme.colors.text.primary,
                        textAlign: 'center',
                        ...styles.button,
                      }}
                    >
                      Quelqu'un s'occupe de ce cadeau
                    </Text>
                  )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bouton d'ajout - seulement si c'est l'utilisateur connecté */}
      {isCurrentUser && (
        <TouchableOpacity
          style={[
            theme.components.button.primary,
            { margin: 20, alignSelf: 'center', paddingHorizontal: 20 },
          ]}
          onPress={() => {
            navigation.navigate('addWish', {
              event: currentEvent,
            });
          }}
        >
          <Text
            style={[
              theme.components.button.text.primary,
              { textAlign: 'center' },
            ]}
          >
            + Ajouter un souhait
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
