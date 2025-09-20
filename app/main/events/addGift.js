import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants'; // pour gérer la status bar sur différents téléphones

import { useState } from 'react';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import AsyncStorage from '@react-native-async-storage/async-storage'; // stockage local (ici pour récupérer le token utilisateur)
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; // libriaire Expo pour accéder à la galerie/photos
import { theme } from '../../../styles/theme';

export default function AddGiftScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  // Récupère l'id de l'évènement transmis depuis la navigation
  const { eventId } = route.params;
  const [errors, setErrors] = useState({});

  // États pour stocker les valeurs saisies par l’utilisateur
  const [name, setName] = useState(''); // nom du cadeau
  const [price, setPrice] = useState(''); // prix du cadeau
  const [url, setUrl] = useState(''); // lien vers le cadeau (optionnel)
  const [image, setImage] = useState(null); // image sélectionnée dans la galerie
  const [loading, setLoading] = useState(false); // état du chargement (évite plusieurs clics)

  // Fonction qui ouvre la galerie du téléphone
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // uniquement images
      // mediaTypes: [ImagePicker.MediaType.IMAGE], requiert mise à jour Expo SDK 51+
    });

    if (!result.canceled) {
      // on vérifie que l'utilisateur n'a pas annulé son choix d'image
      setImage(result.assets[0]); // si une image est choisie, on prend la première en on la sauvegarde dans le state
    }
  };

  // Fonction qui envoie le formulaire au back
  const handleSubmit = async () => {
    // Vérifie que les champs obligatoires sont remplis
    if (!name || !price || !image?.uri) {
      Alert.alert('Erreur', 'Nom, prix et image sont obligatoires.');
      return;
    }

    try {
      setLoading(true);

      // Récupère le token stocké lors du login
      const token = await AsyncStorage.getItem('token');

      // Création d’un FormData (format nécessaire pour envoyer fichiers + données)
      let formData = new FormData();
      formData.append('name', name);
      formData.append('price', parseFloat(price)); // transforme le string en nombre
      formData.append('image', {
        uri: image.uri, // chemin local de l’image
        name: 'gift.jpg', // nom arbitraire
        type: 'image/jpeg', // type MIME
      });

      // Appel API pour envoyer le cadeau au back
      const response = await axios.post(
        `http://192.168.1.12:3000/event/${eventId}/gift-list`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // envoie du token dans les headers
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Vérifie si le back répond avec un status 200
      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Erreur lors de l'ajout du cadeau"
        );
      }

      // Succès → affiche une alerte et revient à la liste
      Alert.alert('Succès', 'Cadeau ajouté avec succès !');
      navigation.goBack();
    } catch (error) {
      // En cas d’erreur → affiche dans la console et une alerte utilisateur
      console.error('Erreur API:', error.response?.data || error.message);
      Alert.alert('Erreur', error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // stoppe le loader dans tous les cas
    }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Form */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: Constants.statusBarHeight,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/* Nom du cadeau */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: 8,
            }}
          >
            Nom du cadeau
          </Text>
          <TextInput
            style={theme.components.input.container}
            placeholder='Ex: Livre - Le Seigneur des Anneaux'
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Prix du cadeau */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: 8,
            }}
          >
            Prix
          </Text>
          <TextInput
            style={theme.components.input.container}
            placeholder='Ex: 25'
            value={price}
            onChangeText={setPrice}
            keyboardType='numeric'
          />
        </View>

        {/* Choisir une image */}
        <View style={{ marginBottom: 20 }}>
          <Text>Image du cadeau</Text>
          <TouchableOpacity
            style={[
              theme.components.input.container,
              { justifyContent: 'center' },
              errors.date && { borderColor: theme.colors.text.error },
            ]}
            onPress={pickImage}
          >
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Choisir une image
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aperçu de l’image sélectionnée */}
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{
              width: 150,
              height: 150,
              marginVertical: 10,
              borderRadius: 8,
            }}
          />
        )}

        {/* Lien du cadeau (optionnel) */}
        <View style={{ marginBottom: 20 }}>
          <Text>Lien vers le produit (optionnel)</Text>
          <TextInput
            style={theme.components.input.container}
            placeholder='https://example.com/produit'
            value={url}
            onChangeText={setUrl}
          />
        </View>

        {/* Bouton Ajouter le cadeau */}
        <TouchableOpacity
          style={[
            theme.components.input.container,
            { justifyContent: 'center' },
            errors.date && { borderColor: theme.colors.text.error },
          ]}
          onPress={handleSubmit}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: 8,
            }}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le cadeau'}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
