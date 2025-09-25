import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
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

export default function Santa({ event, setEvent }) {
  const navigation = useNavigation();
  const {
    handleAddParticipant,
    handleRemoveParticipant,
    handleDeleteEvent,
    events,
    refreshEvents,
    handleDrawParticipant,
    user,
  } = useContext(AuthContext);
  const [participantEmail, setParticipantEmail] = useState('');
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [showDraw, setShowdraw] = useState(false);

  // Utiliser useEffect pour se mettre à jour quand les données changent
  useEffect(() => {
    const updatedEvent = events.find(e => e._id === event._id) || event;
    // Éviter la boucle infinie en vérifiant si l'événement a vraiment changé
    if (JSON.stringify(updatedEvent) !== JSON.stringify(event)) {
      setEvent(updatedEvent);
    }
  }, [events, event._id]); // Ajouter event._id pour éviter les dépendances circulaires

  // Vérifier si l'utilisateur connecté est l'organisateur
  const isOrganizer = event.event_participants?.some(
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
      const result = await handleAddParticipant(event._id, participantEmail);

      // Gérer la réponse selon si l'utilisateur a un compte ou non
      if (result.userExists === false) {
        Alert.alert(
          'Invitation envoyée',
          `L'invitation a été envoyée à ${participantEmail}. Cette personne n'a pas encore de compte et devra d'abord en créer un pour accepter l'invitation.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Invitation envoyée',
          `L'invitation a été envoyée avec succès à ${participantEmail}.`,
          [{ text: 'OK' }]
        );
      }

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
      await handleRemoveParticipant(event._id, email);
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
              await handleDeleteEvent(event._id);
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

  //fonction pour comparer l'id du user connecté et de son id participant
  const findOwner = event => {
    const owner = event.event_participants.find(
      participant => participant.user?._id === user._id
    );
    console.log(owner);
    return owner;
  };
  // fonction pour afficher la personne qu'il a tiré au sort
  const findAssigned = (event, owner, type) => {
    if (type === 'assignedBy') {
      const assignedBy = event.event_participants.find(
        participant => participant.user?._id === owner.assignedBy
      );
      console.log('ici =>', assignedBy);
      return `${assignedBy?.user.firstname} ${assignedBy?.user.lastname}`;
    } else if (type === 'assignedTo') {
      // fonction pour révéler le prénom de la personne qu'un autre participant a tiré au sort
      const assignedTo = event.event_participants.find(
        participant => participant.user?._id === owner.assignedTo
      );
      return `${assignedTo?.user.firstname} ${assignedTo?.user.lastname}`;
    }
  };

  return event ? (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {/* Informations principales - Date et Budget */}
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
        {event.event_budget && (
          <View style={[styles.infoCard, styles.budgetCard]}>
            <FontAwesome5
              name='calendar'
              size={20}
              color={theme.colors.text.white}
            />
            <Text style={styles.infoText}>
              BUDGET CONSEILLÉ : {event.event_budget}€
            </Text>
          </View>
        )}
        {/* Résultat du tirage au sort*/}
        {event.event_participants[0].assignedBy && (
          <View style={styles.drawButton}>
            <Text style={styles.drawButtonText}>
              VOUS AVEZ TIRÉ{' '}
              <Text style={{ color: 'black' }}>
                {findAssigned(
                  event,
                  findOwner(event),
                  'assignedBy'
                )?.toUpperCase()}
              </Text>
            </Text>
          </View>
        )}
      </View>
      {/* Section Participants */}
      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>PARTICIPANTS</Text>
        {event.event_participants?.map((participant, index) => {
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

          const wishCount = participant.wishList?.length || 0;

          // Vérifier si c'est l'utilisateur connecté (par ID ou par email si l'ID n'est pas disponible)
          const isCurrentUser =
            participant.user?._id === user?._id ||
            (participant.user?._id === undefined &&
              participant.email === user?.email);

          // Logique d'affichage du nom selon le statut
          const getParticipantName = () => {
            // Si le participant a accepté et a des infos utilisateur complètes
            if (
              participant.status === 'accepted' &&
              participant.user?.firstname &&
              participant.user?.lastname
            ) {
              return `${participant.user.firstname} ${participant.user.lastname}`;
            }
            // Si le participant a accepté mais n'a que le prénom
            if (
              participant.status === 'accepted' &&
              participant.user?.firstname
            ) {
              return participant.user.firstname;
            }
            // Pour l'organisateur, toujours afficher prénom + nom si disponibles
            if (
              participant.role === 'organizer' &&
              participant.user?.firstname &&
              participant.user?.lastname
            ) {
              return `${participant.user.firstname} ${participant.user.lastname}`;
            }
            if (
              participant.role === 'organizer' &&
              participant.user?.firstname
            ) {
              return participant.user.firstname;
            }
            // Sinon, afficher l'email (en attente, refusé, ou pas d'infos utilisateur)
            return participant.email;
          };

          const participantName = getParticipantName();

          return (
            <View key={index} style={styles.participantRow}>
              <Text style={[getEmailStyle(), { flex: 1 }]}>
                {participantName}
              </Text>

              <View style={styles.participantActions}>
                <View style={styles.participantStatus}>
                  {participant.role === 'organizer' ? (
                    // Icône de couronne pour l'organisateur
                    <FontAwesome5 name='crown' size={16} color='#FFD700' />
                  ) : // Pour Secret Santa : statut d'invitation
                  participant.status === 'declined' ? (
                    <FontAwesome5
                      name='times-circle'
                      size={16}
                      color={theme.colors.text.error}
                    />
                  ) : participant.status === 'accepted' ? (
                    // Icône de check vert pour les participants qui ont accepté
                    <FontAwesome5
                      name='check-circle'
                      size={16}
                      color='#4CAF50'
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
                    onPress={e => {
                      e.stopPropagation();
                      removeParticipant(participant.email);
                    }}
                  >
                    <FontAwesome5
                      name='trash'
                      size={14}
                      color={theme.colors.accent}
                    />
                  </TouchableOpacity>
                )}

                {/* Bouton pour voir le tirage au sort des participants si la personne est l'organisatrice de l'event */}
                {isOrganizer && event.event_participants[0].assignedBy && (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentParticipant(participant);
                      setModal2Visible(true);
                    }}
                  >
                    <Ionicons name='eye-outline' size={24} color='green' />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.participantSeparator} />
            </View>
          );
        })}
        {/* Modal 2 pour révéler le tirage au sort de chacun  */}
        <Modal visible={modal2Visible} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{ textTransform: 'uppercase' }}
                >{`TIRAGE DE ${currentParticipant?.user.firstname} ${currentParticipant?.user.lastname}`}</Text>
                <Pressable
                  onPress={() => {
                    setModal2Visible(!modal2Visible), setShowdraw(false);
                  }}
                >
                  <Entypo name='cross' size={24} color='grey' />
                </Pressable>
              </View>
              <Text>{`Voulez vous voir qui ${currentParticipant?.user.firstname} a tiré ?`}</Text>
              {!showDraw ? (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={{
                      width: '50%',
                      height: 40,
                      backgroundColor: theme.colors.accent,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}
                    onPress={() => setModal2Visible(!modal2Visible)}
                  >
                    <Text style={styles.deleteButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '50%',
                      height: 40,
                      backgroundColor: theme.colors.primary,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      setShowdraw(true);
                    }}
                  >
                    <Text style={styles.drawButtonText}>Voir le tirage</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text>
                  {`${currentParticipant?.user.firstname} ${
                    currentParticipant?.user.lastname
                  } a tiré ${
                    currentParticipant &&
                    showDraw &&
                    findAssigned(
                      event,
                      event.event_participants.find(
                        participant =>
                          participant.user?._id ===
                          currentParticipant?.assignedTo
                      ),
                      'assignedTo'
                    )?.toUpperCase()
                  }`}
                </Text>
              )}
            </View>
          </View>
        </Modal>
        {/* Ajouter un participant (seulement pour l'organisateur et si le tirage au sort n'a pas été effectué) */}
        {isOrganizer && !event.event_participants[0].assignedBy && (
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
        {/* Avertissement - Secret Santa seulement (seulement pour l'organisateur) */}
        {isOrganizer && !event.event_participants[0].assignedBy && (
          <Text style={styles.warningText}>
            Attention : Une fois le tirage effectué, il ne sera plus possible de
            modifier la liste des participants.
          </Text>
        )}
      </View>
      {/* Bouton de tirage au sort - Secret Santa seulement (seulement pour l'organisateur) */}
      {isOrganizer && !event.drawnAt ? (
        <TouchableOpacity
          style={styles.drawButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.drawButtonText}>Effectuer le tirage au sort</Text>
        </TouchableOpacity>
      ) : (
        isOrganizer && (
          <View
            style={{
              backgroundColor: theme.components.tabBar.inactiveTintColor,
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: theme.typography.fontSize.md,
              }}
            >
              Tirage au sort effectué
            </Text>
          </View>
        )
      )}
      {/*  Modal pour faire le tirage au sort */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>CONFIRMATION DU TIRAGE</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Entypo name='cross' size={24} color='grey' />
              </Pressable>
            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Ionicons name='warning' size={36} color='orange' />
            </View>
            <Text>Etes-vous sûr de vouloir effectuer le tirage au sort ?</Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Attention :</Text> Cette
              action est irréversible.
            </Text>
            <View style={{ gap: 10 }}>
              <Text>• Tous les participants seront notifiés par email</Text>
              <Text>
                • Il ne sera plus possible d'ajouter de nouveaux participants
              </Text>
              <Text>• Le résultat du tirage sera définitif</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={{
                  width: '50%',
                  height: 40,
                  backgroundColor: theme.colors.accent,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderRadius: 5,
                }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.deleteButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '50%',
                  height: 40,
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderRadius: 5,
                }}
                onPress={async () => {
                  try {
                    await handleDrawParticipant(event._id);
                    setModalVisible(!modalVisible);
                  } catch (error) {
                    console.error('Erreur lors du tirage au sort:', error);
                    handleApiError(error);
                  }
                }}
              >
                <Text style={styles.drawButtonText}>Confirmer le tirage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  ) : (
    <Text>Loading</Text>
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
    backgroundColor: '#FF6B35', // Orange pour la date
    justifyContent: 'center',
  },

  budgetCard: {
    backgroundColor: '#FFE082', // Orange clair pour le budget
    justifyContent: 'center',
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

  participantNameGreyed: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    flex: 1,
  },

  participantActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  drawButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
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

  // Styles pour les boutons de participants
  participantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  participantWishCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  wishCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  wishListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Vert selon le thème
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  wishListButtonDisabled: {
    backgroundColor: theme.colors.text.secondary,
    opacity: 0.6,
  },
  wishListButtonText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.white,
    marginLeft: 4,
    fontWeight: theme.typography.fontWeight.medium,
  },
  noParticipantsText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },

  //style de modal
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
    width: '95%',
    height: 380,
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
  modalButtons: {
    gap: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});
