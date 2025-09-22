import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';
import Header from '../../../components/Header';

export default function GiftDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { gift, event } = route.params;
  const { events, user, handleDeleteGift } = useContext(AuthContext);
  const [deleting, setDeleting] = useState(false);

  // Utiliser l'événement passé en paramètres ou le chercher dans le contexte
  const currentEvent = event || events.find(e => e._id === gift?.eventId);

  // Vérifier si l'utilisateur peut supprimer le cadeau
  const canDeleteGift = () => {
    if (!user || !currentEvent || !gift || !gift._id) return false;

    // Vérifier si l'utilisateur est l'organisateur
    const isOrganizer = currentEvent.event_participants?.some(
      participant =>
        participant.user?._id === user._id && participant.role === 'organizer'
    );

    // Vérifier si l'utilisateur est l'auteur du cadeau
    const isAuthor = gift.addedBy?._id === user._id;

    return isOrganizer || isAuthor;
  };

  const handleDelete = () => {
    // Vérifier que le cadeau existe avant de continuer
    if (!gift || !gift._id) {
      Alert.alert('Erreur', 'Cadeau introuvable.');
      return;
    }

    Alert.alert(
      'Supprimer le cadeau',
      'Êtes-vous sûr de vouloir supprimer ce cadeau ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            setDeleting(true);
            try {
              // Déterminer si c'est un gift de wishlist ou giftList
              const isWish = gift.source === 'wishList';
              await handleDeleteGift(currentEvent._id, gift._id, isWish);
              // Naviger vers la liste des cadeaux après suppression
              // La liste sera mise à jour automatiquement via le contexte
              navigation.goBack();
              // Afficher l'alerte de succès après la navigation
              setTimeout(() => {
                Alert.alert('Succès', 'Cadeau supprimé avec succès.');
              }, 100);
            } catch (error) {
              console.error('Erreur lors de la suppression du cadeau:', error);
              Alert.alert(
                'Erreur',
                'Impossible de supprimer le cadeau. Veuillez réessayer.'
              );
            } finally {
              setDeleting(false);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Déterminer la source du cadeau et le nom du participant
  let giftSource = null;
  let participantName = null;

  if (currentEvent && gift) {
    // Vérifier si le cadeau est dans la giftList de l'événement
    if (
      currentEvent.giftList &&
      currentEvent.giftList.some(g => g._id === gift._id)
    ) {
      giftSource = 'giftList';
    }
    // Sinon, vérifier dans les wishList des participants
    else if (
      currentEvent.event_participants &&
      currentEvent.event_participants.length > 0
    ) {
      for (const participant of currentEvent.event_participants) {
        if (
          participant.wishList &&
          participant.wishList.some(g => g._id === gift._id)
        ) {
          giftSource = 'wishList';
          participantName = participant.user?.firstname || participant.email;
          break;
        }
      }
    }
  }

  // Si le cadeau n'est pas trouvé ou si on est en train de supprimer
  if (!gift || deleting) {
    return (
      <View
        style={[
          theme.components.screen.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.error,
            textAlign: 'center',
            marginTop: 50,
          }}
        >
          {deleting ? 'Suppression en cours...' : 'Cadeau introuvable'}
        </Text>
        {deleting && (
          <ActivityIndicator
            size='large'
            color={theme.colors.primary}
            style={{ marginTop: 20 }}
          />
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
      <Header title='Détail du cadeau' arrowShow={true} />
      {/* Images du cadeau */}
      {gift.images && gift.images.length > 0 && (

        <View style={{ marginBottom: 20, alignItems: "center", }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>


            {gift.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.secure_url || image.url }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  marginRight: 10,
                  resizeMode: 'cover',
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Informations du cadeau */}
      <View style={theme.components.card.container}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: 10,
          }}
        >
          {gift.name}
        </Text>

        {gift.description && (
          <Text
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.primary.main,
              marginBottom: 15,
            }}
          >
            {gift.description}
          </Text>
        )}

        {gift.price && (
          <Text
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.primary.main,
              marginBottom: 15,
            }}
          >
            {gift.price} €
          </Text>
        )}

        {/* Qui a ajouté le cadeau */}
        {gift.addedBy && (
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                marginBottom: 5,
              }}
            >
              Ajouté par :
            </Text>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              {gift.addedBy.firstname ||
                gift.addedBy.nickname ||
                'Utilisateur inconnu'}
            </Text>
          </View>
        )}

        {/* Nom du participant si c'est un souhait */}
        {participantName && (
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                marginBottom: 5,
              }}
            >
              Souhaité par :
            </Text>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              {participantName}
            </Text>
          </View>
        )}

        {/* Lien vers le produit */}
        {gift.url && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary.main,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={() => Linking.openURL(gift.url)}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
              }}
            >
              Voir le produit
            </Text>
          </TouchableOpacity>
        )}

        {/* Bouton de suppression */}
        {canDeleteGift() && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.text.error,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              opacity: deleting ? 0.7 : 1,
            }}
            onPress={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <>
                <FontAwesome5
                  name='trash-alt'
                  size={16}
                  color='#fff'
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: theme.typography.fontSize.md,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}
                >
                  Supprimer le cadeau
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
