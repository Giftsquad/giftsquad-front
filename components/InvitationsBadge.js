// components/InvitationsBadge.js
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AuthContext from '../contexts/AuthContext';
import { getInvitations } from '../services/eventService';
import { theme } from '../styles/theme';

export default function InvitationsBadge({
  iconColor = theme.colors.text.white,
  size = 28,
}) {
  const { user } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allInvitations = await getInvitations();
        setInvitations(allInvitations);
      } catch (error) {
        // console.log("Erreur getInvitations", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setInvitations([]);
    }
  }, [user]);

  return (
    <View style={{ position: 'relative' }}>
      {/* Badge (loader ou nombre) */}
      {isLoading ? (
        <ActivityIndicator
          size='small'
          color='red'
          style={styles.badgeLoader}
        />
      ) : (
        invitations.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{invitations.length}</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: 15,
    right: -6,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.text.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeLoader: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
});
