import { useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';

export default function GiftDetailScreen() {
  const route = useRoute();
  const { gift, event } = route.params;
  const { events } = useContext(AuthContext);

  // Utiliser l'événement passé en paramètres ou le chercher dans le contexte
  const currentEvent = event || events.find(e => e._id === event?._id);

  // Déterminer la source du cadeau et le nom du participant
  let giftSource = null;
  let participantName = null;

  if (currentEvent) {
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

  // Si le cadeau n'est pas trouvé
  if (!gift) {
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
          Cadeau introuvable
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Images du cadeau */}
      {gift.images && gift.images.length > 0 && (
        <View style={{ marginBottom: 20 }}>
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
      </View>
    </ScrollView>
  );
}
