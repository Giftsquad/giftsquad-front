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
import Header from '../../../components/Header';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';

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
  const handlePurchaseWish = async (participantUserId, giftId) => {
    try {
      await handlePurchaseWishGift(currentEvent._id, participantUserId, giftId);
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
              {
                alignSelf: 'center',
                paddingHorizontal: 20,
                width: '90%',
                marginBottom: 50,
              },
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
            {/* Miniatures des images */}
            {item.images && item.images.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}
                >
                  {item.images.slice(0, 3).map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.secure_url || image.url }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 4,
                        resizeMode: 'cover',
                      }}
                    />
                  ))}
                  {item.images.length > 3 && (
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 4,
                        backgroundColor: theme.colors.text.secondary,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        +{item.images.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View>
              {/* Titre du cadeau */}
              <Text
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  marginBottom: 5,
                }}
              >
                {item.name}
              </Text>

              {/* Description tronquée */}
              {item.description && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: 5,
                  }}
                  numberOfLines={2}
                  ellipsizeMode='tail'
                >
                  {item.description}
                </Text>
              )}

              {/* Prix */}
              {item.price && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.primary.main,
                    fontWeight: theme.typography.fontWeight.bold,
                    marginBottom: 5,
                  }}
                >
                  {item.price} €
                </Text>
              )}

              {/* Ajouté le createdAt par nom prénom du créateur */}
              {item.createdAt && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: 5,
                  }}
                >
                  {`Ajouté le ${new Date(item.createdAt).toLocaleDateString(
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

              {/* Qui s'occupe du cadeau */}
              <Text
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: 5,
                }}
              >
                {!isCurrentUser && item.purchasedBy
                  ? (() => {
                      // Si purchasedBy est un objet avec les données utilisateur
                      const name =
                        item.purchasedBy.firstname ||
                        item.purchasedBy.nickname ||
                        "Quelqu'un";
                      const lastname = item.purchasedBy.lastname || '';
                      return `${name} ${lastname}`.trim() + " s'en occupe";
                    })()
                  : !isCurrentUser && "Personne ne s'en occupe"}
              </Text>

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

              {/* Bouton pour acheter le cadeau - seulement si l'utilisateur n'est pas le créateur et que personne ne s'en occupe */}
              {/*!isCurrentUser && !item.purchasedBy*/}
              {item.addedBy?._id !== user?._id && !item.purchasedBy && (
                <TouchableOpacity
                  onPress={() =>
                    handlePurchaseWish(participant.user._id, item._id)
                  }
                  style={{
                    backgroundColor: 'black',
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
                    Je m'occupe de ce cadeau
                  </Text>
                </TouchableOpacity>
              )}

              {/* Bouton de suppression pour l'utilisateur connecté */}
              {/*(currentParticipant?.user?._id === user?._id ||
                    currentParticipant?.email === user?.email)*/}
              {item.addedBy?._id === user?._id && (
                <TouchableOpacity
                  onPress={() => handleDeleteWishGift(item._id)}
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

      {/* Bouton d'ajout - seulement si c'est l'utilisateur connecté */}
      {isCurrentUser && (
        <TouchableOpacity
          style={[
            theme.components.button.primary,
            { marginBottom: 50, width: '90%', alignSelf: 'center' },
          ]}
          onPress={() => {
            navigation.navigate('addWish', {
              event: currentEvent,
            });
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[theme.components.button.text.primary, { marginLeft: 10 }]}
            >
              + Ajouter un souhait
            </Text>
          </View>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    padding: 22,
    alignItems: 'flex-start',
    gap: 20,
    shadowColor: '#020202ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  modalText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.accent,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  confirmButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
