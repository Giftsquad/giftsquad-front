import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../../components/Header';
import AuthContext from '../../../contexts/AuthContext';
import { handleApiError } from '../../../services/errorService';
import { getEvent } from '../../../services/eventService';
import { theme } from '../../../styles/theme';

export default function EventDetailsScreen() {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Récupérer l'événement spécifique via l'API /event/:id
        const eventData = await getEvent(id);
        setEvent(eventData);
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        setError(handleApiError(error).general || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, []);

  // Calculer le montant collecté pour les anniversaires
  const calculateCollectedAmount = () => {
    if (event.event_type !== 'Birthday') return 0;
    return (
      event.event_participants?.reduce((total, participant) => {
        return total + (participant.participationAmount || 0);
      }, 0) || 0
    );
  };

  // Compter les participants qui participent (ont un montant)
  const getParticipatingCount = () => {
    if (event.event_type !== 'Birthday') return 0;
    return (
      event.event_participants?.filter(
        participant =>
          participant.participationAmount && participant.participationAmount > 0
      ).length || 0
    );
  };

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

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title={event.event_name.toUpperCase()} arrowShow={true} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Informations principales - Date (toujours affichée) */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <FontAwesome5
              name='calendar'
              size={20}
              color={theme.colors.text.white}
            />
            <Text style={styles.infoText}>
              le{' '}
              {new Date(event.event_date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          {/* Budget conseillé - Secret Santa seulement */}
          {event.event_type === 'Secret Santa' && event.event_budget && (
            <View style={[styles.infoCard, styles.budgetCard]}>
              <FontAwesome5
                name='euro-sign'
                size={20}
                color={theme.colors.text.white}
              />
              <Text style={styles.infoText}>
                BUDGET CONSEILLÉ : {event.event_budget}€
              </Text>
            </View>
          )}

          {/* Somme collectée - Anniversaire seulement */}
          {event.event_type === 'Birthday' && (
            <View style={[styles.infoCard, styles.collectedCard]}>
              <FontAwesome5
                name='euro-sign'
                size={20}
                color={theme.colors.text.white}
              />
              <View style={styles.collectedInfo}>
                <Text style={styles.collectedAmount}>
                  {calculateCollectedAmount()}€ COLLECTÉS
                </Text>
                <Text style={styles.participantsCount}>
                  ({getParticipatingCount()} participants)
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Bouton Liste de cadeaux - Anniversaire seulement */}
        {event.event_type === 'Birthday' && (
          <TouchableOpacity style={styles.giftListButton}>
            <FontAwesome5
              name='gift'
              size={20}
              color={theme.colors.text.white}
            />
            <Text style={styles.giftListButtonText}>Liste de cadeaux</Text>
          </TouchableOpacity>
        )}

        {/* Section Participants */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>PARTICIPANTS</Text>

          {event.event_participants?.map((participant, index) => (
            <View key={index} style={styles.participantRow}>
              <Text style={styles.participantName}>
                {participant.participant?.user?.firstname}
                {participant.participant?.user?._id === user?._id && ' (vous)'}
              </Text>

              {/* Affichage selon le type d'événement */}
              <View style={styles.participantStatus}>
                {event.event_type === 'Birthday' ? (
                  // Pour les anniversaires : montant ou bouton participer
                  participant.participationAmount ? (
                    <View style={styles.amountTag}>
                      <Text style={styles.amountText}>
                        {participant.participationAmount}€
                      </Text>
                    </View>
                  ) : participant.participant?.user?._id === user?._id ? (
                    <TouchableOpacity style={styles.participateButton}>
                      <Text style={styles.participateButtonText}>
                        Participer
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <FontAwesome5
                      name='clock'
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                  )
                ) : (
                  // Pour les autres types : icône d'attente
                  <FontAwesome5
                    name='clock'
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                )}
              </View>

              <View style={styles.participantSeparator} />
            </View>
          ))}

          {/* Ajouter un participant */}
          <View style={styles.addParticipantSection}>
            <Text style={styles.addParticipantLabel}>
              Ajouter un participant
            </Text>
            <View style={styles.addParticipantInput}>
              <TextInput
                style={styles.emailInput}
                placeholder='Email du participant'
                placeholderTextColor={theme.colors.text.secondary}
              />
              <TouchableOpacity style={styles.addButton}>
                <FontAwesome5
                  name='plus'
                  size={16}
                  color={theme.colors.text.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Avertissement - Secret Santa seulement */}
          {event.event_type === 'Secret Santa' && (
            <Text style={styles.warningText}>
              Attention : Une fois le tirage effectué, il ne sera plus possible
              de modifier la liste des participants.
            </Text>
          )}
        </View>

        {/* Bouton de tirage au sort - Secret Santa seulement */}
        {event.event_type === 'Secret Santa' && !event.drawnAt && (
          <TouchableOpacity style={styles.drawButton}>
            <Text style={styles.drawButtonText}>
              Effectuer le tirage au sort
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container pour les informations principales
  infoContainer: {
    marginBottom: 20,
  },

  // Cartes d'information (date et budget)
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B35', // Orange comme dans l'image
  },

  budgetCard: {
    backgroundColor: '#4CAF50', // Vert comme dans l'image
  },

  collectedCard: {
    backgroundColor: '#FFE082', // Jaune clair comme dans l'image
  },

  collectedInfo: {
    marginLeft: 10,
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

  infoText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 10,
  },

  // Section participants
  participantsSection: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 15,
  },

  // Ligne de participant
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  participantName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },

  participantStatus: {
    alignItems: 'flex-end',
  },

  participantSeparator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginTop: 8,
  },

  // Styles pour les anniversaires
  amountTag: {
    backgroundColor: '#C8E6C9', // Vert clair
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  amountText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },

  participateButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },

  participateButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },

  // Bouton Liste de cadeaux
  giftListButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  giftListButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 10,
  },

  // Section ajouter participant
  addParticipantSection: {
    marginTop: 20,
  },

  addParticipantLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 10,
  },

  addParticipantInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.md,
  },

  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texte d'avertissement
  warningText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 15,
    textAlign: 'center',
  },

  // Bouton de tirage au sort
  drawButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  drawButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },

  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});
