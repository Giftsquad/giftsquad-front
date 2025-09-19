import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../../styles/theme';
import { useIsFocused } from '@react-navigation/native'; // pemet d'utiliser isFocused

export default function GiftListScreen({ route, navigation }) {
  const { eventId } = route.params; // récupéré via navigation.navigate('addGift', { eventId })}
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // permet de relancer le fetch si goback()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(
          `http://192.168.1.12:3000/event/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer l'événement");
        }

        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Erreur fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchEvent(); // se relance à chaque retour sur la page
    }
  }, [eventId, isFocused]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size='large' color='#007AFF' />
      </View>
    );
  }

  if (!event?.giftList || event.giftList.length === 0) {
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
            color: theme.colors.text.primary,
            marginBottom: 8,
          }}
        >
          Aucun cadeau ajouté pour l’instant
        </Text>
        {/* Bouton d’ajout affiché même si la liste est vide */}
        <TouchableOpacity
          onPress={() => navigation.navigate('addGift', { eventId })}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: 8,
            }}
          >
            + Ajouter un cadeau
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1, padding: 20 }}
        data={event.giftList}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <View>
            {item.image && <Image source={{ uri: item.image }} />}
            <View>
              <Text>{item.name}</Text>
              <Text>{item.price} €</Text>
              {item.url ? (
                <Text onPress={() => Linking.openURL(item.url)}>
                  Voir le produit
                </Text>
              ) : null}
            </View>
          </View>
        )}
      />

      {/* Bouton d’ajout */}
      <TouchableOpacity
        style={theme.components.card.container}
        onPress={() => navigation.navigate('addGift', { eventId })}
      >
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          + Ajouter un cadeau
        </Text>
      </TouchableOpacity>
    </View>
  );
}
