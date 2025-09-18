import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import { getInvitations } from '../../services/eventService';
import { theme } from '../../styles/theme';
import { FontAwesome, FontAwesome6, Entypo } from '@expo/vector-icons';

const Invitations = () => {
  const [invitations, setInvitations] = useState([
    {
      __v: 0,
      _id: '68cbd7ef38b38db2099875b6',
      createdAt: '2025-09-18T09:59:11.618Z',
      event_budget: 20,
      event_date: '2025-12-20T00:00:00.000Z',
      event_name: 'Secret santa du bureau',
      event_organizer: '68ca7655cf64393658222f01',
      event_participants: [
        {
          participant: { user: { firstname: 'Marcel', lastname: 'Duroy' } },
          role: 'organizer',
        },
      ],
      event_type: 'Secret Santa',
      giftList: [],
      updatedAt: '2025-09-18T09:59:11.627Z',
    },
    {
      __v: 0,
      _id: '68cbd81d38b38db2099875bb',
      createdAt: '2025-09-18T09:59:57.128Z',
      event_budget: 20,
      event_date: '2025-12-20T00:00:00.000Z',
      event_name: "Secret santa de l'asso",
      event_organizer: '68ca7655cf64393658222f01',
      event_participants: [
        {
          participant: { user: { firstname: 'Raoul', lastname: 'Blanchard' } },
          role: 'organizer',
        },
      ],
      event_type: 'Secret Santa',
      giftList: [],
      updatedAt: '2025-09-18T09:59:57.129Z',
    },
    {
      __v: 0,
      _id: '68cbd81d38b38db2099875b',
      createdAt: '2025-09-18T09:59:57.128Z',
      event_budget: 20,
      event_date: '2025-11-15T00:00:00.000Z',
      event_name: 'Anniversaire Joséphine',
      event_organizer: '68ca7655cf64393658222f01',
      event_participants: [
        {
          participant: {
            user: { firstname: 'Mireille', lastname: 'Blanchard' },
          },
          role: 'organizer',
        },
      ],
      event_type: 'Birthday',
      giftList: [],
      updatedAt: '2025-09-18T09:59:57.129Z',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  //Comment récupérer les invitations ? => créer une route invitation en back qui récupère tous les event où l'utilisateur est participant

  // console.log(invitations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allInvitations = await getInvitations(userData); //récupération des toutes les invitations du user
        console.log('Récupération de toutes les invitations');
        return setInvitations(allInvitations); //mise à jour du state avec les invitations d'event récupérées de l'utilisateur
      } catch (error) {
        console.log('Erreur de récupération des invitations', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [invitations]);

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
        {`Vous avez ${invitations.length} invitations`.toUpperCase()}
        {/* //affichage du nombre d'invitations du user */}
      </Text>
      <FlatList
        style={{ padding: 20, width: '100%', height: '80%' }}
        data={invitations}
        keyExtractor={item => String(item._id)}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  {item.event_type === 'Secret Santa' && (
                    <FontAwesome6
                      name='gift'
                      size={30}
                      color={theme.colors.primary}
                    />
                  )}
                  {item.event_type === 'Birthday' && (
                    <FontAwesome6
                      name='cake-candles'
                      size={30}
                      color={theme.colors.primary}
                    />
                  )}
                  {item.event_type === 'Christmas' && (
                    <FontAwesome
                      name='tree'
                      size={30}
                      color={theme.colors.primary}
                    />
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
                  {item.event_participants.map(participant => {
                    console.log(participant);
                    if (participant.role === 'organizer') {
                      return (
                        <Text>
                          {participant.participant.user.firstname}{' '}
                          {participant.participant.user.lastname}
                        </Text>
                      );
                    }
                  })}
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
                <Pressable style={styles.declineButton}>
                  <Entypo name='cross' size={18} color='white' />
                  <Text style={styles.text}>Refuser</Text>
                </Pressable>
                <Pressable style={styles.acceptButton} onPress={() => {}}>
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

//   const handleDeclineButton = async () => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/${idEvent}/:action-invitation`
//       );
//       return setEvents(response.data); //mise à jour du state avec les invitations
//     } catch (error) {
//       console.log(error.message);
//     }
//   }; //action de retrait du state

//   const handleAcceptButton = async () => {
//     // action d'ajout d'event à ma page event
//     try {
//       const response = await axios.put(
//         `${API_URL}/${idEvent}/:action-invitation`
//       );
//       return setEvents(response.data); //mise à jour du state avec les invitations
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
