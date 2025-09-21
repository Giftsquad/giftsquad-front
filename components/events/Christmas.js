import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../contexts/AuthContext';
import { handleApiError } from '../../services/errorService';
import { theme } from '../../styles/theme';

export default function Christmas({ event, user }) {
  const navigation = useNavigation();
  const { handleAddParticipant, handleRemoveParticipant, handleDeleteEvent } =
    useContext(AuthContext);
  const [participantEmail, setParticipantEmail] = useState('');
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [localEvent, setLocalEvent] = useState(event);

  // Vérifier si l'utilisateur connecté est l'organisateur
  const isOrganizer = localEvent.event_participants?.some(
    participant =>
      participant.user?._id === user?._id && participant.role === 'organizer'
  );

  // Fonction pour ajouter un participant
  const addParticipant = async () => {
    if (!participantEmail.trim()) {
      return;
    }

    try {
      setAddingParticipant(true);
      const updatedEvent = await handleAddParticipant(
        localEvent._id,
        participantEmail
      );
      setLocalEvent(updatedEvent);
      setParticipantEmail('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du participant:", error);
      const errors = handleApiError(error);
      // Les erreurs seront affichées via le système de gestion d'erreurs global
    } finally {
      setAddingParticipant(false);
    }
  };

  // Fonction pour retirer un participant
  const removeParticipant = async email => {
    try {
      const updatedEvent = await handleRemoveParticipant(localEvent._id, email);
      setLocalEvent(updatedEvent);
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error);
      handleApiError(error);
    }
  };

  // Fonction pour supprimer l'événement
  const deleteEvent = () => {
    Alert.alert(
      "Supprimer l'événement",
      'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action supprimera tous les participants et est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await handleDeleteEvent(localEvent._id);
              // Rediriger vers la liste des événements
              navigation.goBack();
            } catch (error) {
              console.error(
                "Erreur lors de la suppression de l'événement:",
                error
              );
              handleApiError(error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {/* Informations principales - Date */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <FontAwesome5
            name='calendar'
            size={20}
            color={theme.colors.text.white}
          />
          <Text style={styles.infoText}>
            le{' '}
            {new Date(localEvent.event_date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Bouton Liste de cadeaux - Christmas List */}
      <TouchableOpacity
        style={styles.giftListButton}
        onPress={() => {
          navigation.navigate('GiftList', { event: localEvent });
        }}
      >
        <FontAwesome5 name='gift' size={20} color={theme.colors.text.white} />
        <Text style={styles.giftListButtonText}>Liste de cadeaux</Text>
      </TouchableOpacity>

      {/* Section Participants */}
      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>PARTICIPANTS</Text>

        {localEvent.event_participants?.map((participant, index) => {
          // Déterminer le style de l'email selon le statut
          const getEmailStyle = () => {
            if (participant.role === 'organizer') {
              return styles.participantName; // Style normal pour l'organisateur
            }
            if (participant.status === 'accepted') {
              return styles.participantName; // Style normal pour accepté
            }
            if (participant.status === 'declined') {
              return styles.participantNameGreyed; // Style grisé pour refusé
            }
            return styles.participantNameGreyed; // Style grisé pour en attente
          };

          return (
            <View key={index} style={styles.participantRow}>
              <Text style={getEmailStyle()}>{participant.email}</Text>

              <View style={styles.participantActions}>
                <View style={styles.participantStatus}>
                  {participant.role === 'organizer' ? (
                    // Icône de couronne pour l'organisateur
                    <FontAwesome5 name='crown' size={16} color='#FFD700' />
                  ) : // Pour Christmas List : statut d'invitation
                  participant.status === 'declined' ? (
                    <FontAwesome5
                      name='times-circle'
                      size={16}
                      color={theme.colors.text.error}
                    />
                  ) : (
                    // Icône de sablier pour les participants en attente
                    <FontAwesome5
                      name='hourglass-half'
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                  )}
                </View>

                {/* Bouton de suppression pour les participants non-organisateurs (seulement pour l'organisateur) */}
                {isOrganizer && participant.role !== 'organizer' && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeParticipant(participant.email)}
                  >
                    <FontAwesome5
                      name='trash'
                      size={14}
                      color={theme.colors.accent}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.participantSeparator} />
            </View>
          );
        })}

        {/* Ajouter un participant (seulement pour l'organisateur) */}
        {isOrganizer && (
          <View style={styles.addParticipantSection}>
            <Text style={styles.addParticipantLabel}>
              Ajouter un participant
            </Text>
            <View style={styles.addParticipantInput}>
              <TextInput
                style={styles.emailInput}
                placeholder='Email du participant'
                placeholderTextColor={theme.colors.text.secondary}
                value={participantEmail}
                onChangeText={setParticipantEmail}
                autoCapitalize='none'
                keyboardType='email-address'
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  (addingParticipant || !participantEmail.trim()) &&
                    styles.addButtonDisabled,
                ]}
                onPress={addParticipant}
                disabled={addingParticipant || !participantEmail.trim()}
              >
                {addingParticipant ? (
                  <ActivityIndicator
                    size='small'
                    color={theme.colors.text.white}
                  />
                ) : (
                  <FontAwesome5
                    name='plus'
                    size={16}
                    color={theme.colors.text.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Bouton de suppression d'événement - Seulement pour les administrateurs */}
      {isOrganizer && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteEvent}>
          <FontAwesome5
            name='trash'
            size={16}
            color={theme.colors.text.white}
          />
          <Text style={styles.deleteButtonText}>Supprimer l'événement</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Container pour les informations principales
  infoContainer: {
    marginBottom: 20,
  },

  // Cartes d'information (date)
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B35', // Orange pour la date
  },

  infoText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 10,
  },

  // Bouton Liste de cadeaux
  giftListButton: {
    backgroundColor: '#4CAF50', // Vert pour la liste de cadeaux
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

  participantNameGreyed: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    flex: 1,
  },

  participantActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  participantStatus: {
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },

  participantSeparator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginTop: 8,
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

  addButtonDisabled: {
    backgroundColor: theme.colors.text.secondary,
    opacity: 0.6,
  },

  // Bouton de suppression d'événement
  deleteButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 8,
  },
});
