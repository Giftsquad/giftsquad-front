import { Entypo, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header';
import { getInvitations } from '../../services/eventService';
import { actionInvitations } from '../../services/eventService';
import { theme } from '../../styles/theme';
import AuthContext from '../../contexts/AuthContext';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  console.log(invitations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allInvitations = await getInvitations(); //récupération des toutes les invitations du user
        console.log('Récupération de toutes les invitations');
        setInvitations(allInvitations); //mise à jour du state avec les invitations d'event récupérées de l'utilisateur
      } catch (error) {
        console.log('Erreur de récupération des invitations', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchData();
    } else {
      // Si pas d'utilisateur, vider la liste des invitations
      setInvitations([]);
      setIsLoading(false);
    }
  }, [user]);

  const handleDeclineButton = async id => {
    console.log(id);
    try {
      const response = await actionInvitations(id, 'decline', user.email);
      console.log('Invitation déclinée :', response);
      if (response) {
        setIsLoading(true);
        const allInvitations = await getInvitations(); //récupération de toutes les invitations mise à jour du user
        console.log(
          "Récupération de toutes les invitations sans l'événement qui a été décliné"
        );
        setInvitations(allInvitations); //mise à jour du state avec les invitations d'event récupérées de l'utilisateur
      }
    } catch (error) {
      console.log('Impossible de décliner l’invitation :', error.response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptButton = async id => {
    //lorsque j'accepte l'invitation je veux que l'événement apparaisse sur ma page mes events et disparaisse de ma page invitation
    try {
      const response = await actionInvitations(id, 'accept', user.email);
      console.log('Invitation acceptée :', response);
      if (response) {
        setIsLoading(true);
        const allInvitations = await getInvitations(); //récupération de toutes les invitations mise à jour du user
        console.log(
          "Récupération de toutes les invitations sans l'événement qui a été accepté"
        );
        setInvitations(allInvitations); //mise à jour du state avec les invitations d'event récupérées de l'utilisateur
      }
    } catch (error) {
      console.log("Impossible d'accepter l’invitation :", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <ActivityIndicator size='large' color={theme.colors.primary} />
  ) : (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='INVITATIONS' />
      <Text style={{ fontSize: 24, padding: 20 }}>
        {`Vous avez ${invitations?.length || 0} invitations`.toUpperCase()}
        {/* //affichage du nombre d'invitations du user */}
      </Text>
      <FlatList
        style={{ padding: 20, width: '100%', height: '80%' }}
        data={invitations || []}
        keyExtractor={item => String(item._id)}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  {item.event_type === 'Secret Santa' && (
                    <FontAwesome6 name='gift' size={30} color='#FF6B35' />
                  )}
                  {item.event_type === 'Birthday' && (
                    <FontAwesome6
                      name='cake-candles'
                      size={30}
                      color='#2196F3'
                    />
                  )}
                  {item.event_type === 'Christmas List' && (
                    <FontAwesome name='tree' size={30} color='#4CAF50' />
                  )}
                </View>
                <View>
                  <Text
                    style={styles.eventName}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {item.event_name.toUpperCase()}
                  </Text>
                  <View style={styles.eventTypeContainer}>
                    <View
                      style={[
                        styles.eventTypeBadge,
                        item.event_type === 'Secret Santa' &&
                          styles.secretSantaBadge,
                        item.event_type === 'Birthday' && styles.birthdayBadge,
                        item.event_type === 'Christmas List' &&
                          styles.christmasListBadge,
                      ]}
                    >
                      <Text style={styles.eventTypeText}>
                        {item.event_type}
                      </Text>
                    </View>
                  </View>
                  {/*  la fonction .map() ne retourne pas toujours un élément (quand participant.role !== 'organizer'), ce qui peut causer des problèmes de key */}
                  {item.event_participants
                    .filter(participant => participant.role === 'organizer')
                    .map((participant, index) => (
                      <Text key={participant.user._id || `organizer-${index}`}>
                        {`De ${participant.user.firstname} ${participant.user.lastname}`}
                      </Text>
                    ))}
                  <View style={styles.eventDate}>
                    <FontAwesome name='calendar' size={20} color='black' />
                    <Text>
                      le {new Date(item.event_date).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  gap: 10,
                }}
              >
                <Pressable
                  style={styles.declineButton}
                  onPress={() => handleDeclineButton(item._id)}
                >
                  <Entypo name='cross' size={18} color='white' />
                  <Text style={styles.text}>Refuser</Text>
                </Pressable>
                <Pressable
                  style={styles.acceptButton}
                  onPress={() => handleAcceptButton(item._id)}
                >
                  <Entypo name='check' size={18} color='white' />
                  <Text style={styles.text} onPress={() => {}}>
                    Accepter
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};
export default Invitations;

const styles = StyleSheet.create({
  eventDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  eventName: {
    fontSize: 16,
    marginBottom: 10,
  },
  eventTypeContainer: {
    marginBottom: 8,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  secretSantaBadge: {
    backgroundColor: '#FF6B35',
  },
  birthdayBadge: {
    backgroundColor: '#2196F3',
  },
  christmasListBadge: {
    backgroundColor: '#4CAF50',
  },
  eventTypeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  declineButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 135,
    height: 40,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  acceptButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 135,
    height: 40,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.white,
  },
  card: { ...theme.components.card.container },
});
