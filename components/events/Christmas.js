import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { handleApiError } from '../../services/errorService';
import { addParticipant } from '../../services/eventService';
import { theme } from '../../styles/theme';

export default function Christmas({ event, user, onEventUpdate }) {
  const navigation = useNavigation();
  const [participantEmail, setParticipantEmail] = useState('');
  const [addingParticipant, setAddingParticipant] = useState(false);

  // Fonction pour ajouter un participant
  const handleAddParticipant = async () => {
    if (!participantEmail.trim()) {
      return;
    }

    try {
      setAddingParticipant(true);
      const updatedEvent = await addParticipant(event._id, participantEmail);
      onEventUpdate(updatedEvent);
      setParticipantEmail('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du participant:", error);
      const errors = handleApiError(error);
      // Les erreurs seront affichées via le système de gestion d'erreurs global
    } finally {
      setAddingParticipant(false);
    }
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
            {new Date(event.event_date).toLocaleDateString('fr-FR', {
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
        onPress={() => navigation.navigate('GiftList', { eventId: event._id })}
      >
        <FontAwesome5 name='gift' size={20} color={theme.colors.text.white} />
        <Text style={styles.giftListButtonText}>Liste de cadeaux</Text>
      </TouchableOpacity>

      {/* Section Participants */}
      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>PARTICIPANTS</Text>

        {event.event_participants?.map((participant, index) => (
          <View key={index} style={styles.participantRow}>
            <Text style={styles.participantName}>{participant.email}</Text>

            <View style={styles.participantStatus}>
              {participant.role === 'organizer' ? (
                // Icône de couronne pour l'organisateur
                <FontAwesome5 name='crown' size={16} color='#FFD700' />
              ) : (
                // Pour Christmas List : icône d'attente
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
          <Text style={styles.addParticipantLabel}>Ajouter un participant</Text>
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
              onPress={handleAddParticipant}
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
      </View>
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

  participantStatus: {
    alignItems: 'flex-end',
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
});
