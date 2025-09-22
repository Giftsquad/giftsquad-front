import Constants from 'expo-constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';
import Header from '../../../components/Header';
import { FontAwesome5 } from '@expo/vector-icons';

const IMAGES_LIMIT = 5;

export default function AddWishScreen({ route, navigation }) {
  // Récupère l'événement complet transmis depuis la navigation
  const { event } = route.params;
  const { handleAddGift } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  // États pour stocker les valeurs saisies par l'utilisateur
  const [name, setName] = useState(''); // Nom du souhait
  const [description, setDescription] = useState(''); // Description du souhait
  const [url, setUrl] = useState(''); // lien vers le souhait (optionnel)
  const [images, setImages] = useState([]); // images sélectionnées dans la galerie (optionnel)
  const [loading, setLoading] = useState(false); // état du chargement (évite plusieurs clics)

  // Fonction qui ouvre la galerie du téléphone ou l'appareil photo pour sélectionner plusieurs images
  const pickImages = async type => {
    const options = {
      mediaTypes: 'images', // uniquement images
      allowsMultipleSelection: true, // permet la sélection multiple
      selectionLimit: IMAGES_LIMIT, // limite à 5 images maximum
    };

    const result =
      'gallery' === type
        ? await ImagePicker.launchImageLibraryAsync(options)
        : await ImagePicker.launchCameraAsync(options);

    if (!result.canceled) {
      if (IMAGES_LIMIT < images.length + result.assets.length) {
        Alert.alert(
          'Erreur',
          `Veuillez choisir ${IMAGES_LIMIT} images maximum.`
        );
        return;
      }
      // on vérifie que l'utilisateur n'a pas annulé son choix d'images
      setImages(prevImages => [...prevImages, ...result.assets]); // ajouter les nouvelles images aux existantes
    }
  };

  // Fonction pour la permission d'ouvrir la caméra
  const takeAPhoto = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      //Ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();

      if (result.canceled === true) {
        alert('Pas de photo sélectionnée');
      } else {
        // Ajouter directement l'image à ton tableau images
        setImages(prevImages => [...prevImages, result.assets[0]]);
      }
    } else {
      alert('Permission refusée');
    }
  };

  // Fonction pour supprimer une image
  const removeImage = index => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Fonction qui envoie le formulaire au back
  const handleSubmit = async () => {
    setErrors({}); // on remet les erreurs à zéro

    // Vérifie que les champs obligatoires sont remplis
    if (!name) {
      setErrors({ general: 'Le nom est obligatoire' });
      return;
    }

    // Vérifier que l'événement est valide
    if (!event || !event._id) {
      setErrors({ general: 'Événement invalide.' });
      return;
    }

    try {
      setLoading(true);

      // Création d'un FormData (format nécessaire pour envoyer fichiers + données)
      let formData = new FormData();
      formData.append('name', name);
      formData.append('description', description); // transforme le string en nombre

      // Ajouter les images seulement si elles sont sélectionnées
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', {
            uri: image.uri, // chemin local de l'image
            name: `wish_${index}.jpg`, // nom arbitraire avec index
            type: image.mimeType, // type MIME
          });
        });
      }

      // Ajouter l'URL si fournie
      if (url) {
        formData.append('url', url);
      }

      // Ajouter le type d'événement pour déterminer la bonne route
      if (event && event.event_type) {
        formData.append('eventType', event.event_type);
      }

      // Appel API via le contexte - pour les wishList, on utilise la route wish-list
      await handleAddGift(event._id, formData, true); // isWish = true pour wishList
      setErrors({});

      // Succès → affiche une alerte et revient à la liste
      Alert.alert('Succès', 'Souhait ajouté avec succès !');
      navigation.goBack();
    } catch (error) {
      // En cas d'erreur → affiche dans la console et une alerte utilisateur
      console.error('Erreur API:', error.response?.data || error.message);
      Alert.alert('Erreur', error.response?.data?.message || error.message);
      const errors = handleApiError(error);
      setErrors(errors);
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
      <Header title='Ajouter un souhait' arrowShow={true} />

      {/* Form */}
      <KeyboardAwareScrollView
        contentContainerStyle={theme.components.card.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        enableOnAndroid={true}
        extraScrollHeight={20}
      >

        <View style={theme.components.card.container}>
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
              Nom du cadeau souhaité
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
              Prix approximatif
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Ex: 25'
              value={price}
              onChangeText={setPrice}
              keyboardType='numeric'
            />
          </View>

          {/* Choisir des images */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Images du cadeau (optionnel)
            </Text>

            {/* Accès à la caméra */}
            <TouchableOpacity
              style={[
                theme.components.input.container,
                {
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                  marginBottom: 20,
                },
                errors.date && { borderColor: theme.colors.text.error },
              ]}
              onPress={takeAPhoto}
            >
              <FontAwesome name='camera' size={24} color='black' />
              <Text
                style={{
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                }}
              >
                Accéder à l'appareil photo ({images.length}/5)
              </Text>
            </TouchableOpacity>

            {/* Accès à la gallerie photo */}
            <TouchableOpacity
              style={[
                theme.components.input.container,
                { flexDirection: 'row', gap: 10, justifyContent: 'center' },
                errors.date && { borderColor: theme.colors.text.error },
              ]}
              onPress={pickImages}
            >
              <AntDesign name='picture' size={24} color='black' />
              <Text
                style={{
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  
                  textAlign: 'center',
                }}
              >
                Choisir des images ({images.length}/5)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Aperçu des images sélectionnées */}
          {images && images.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: 10,
                }}
              >
                Images sélectionnées :
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {images.map((image, index) => (
                  <View key={index} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: image.uri }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        backgroundColor: theme.colors.text.error,
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => removeImage(index)}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </View>
          )}


          {/* Lien du cadeau (optionnel) */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Lien vers le produit (optionnel)
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='https://example.com/produit'
              value={url}
              onChangeText={setUrl}
            />
          </View>

          {/* Bouton Ajouter le souhait */}
          <TouchableOpacity
            style={[
              theme.components.button.primary,
              { justifyContent: 'center', marginTop: 20 },
              errors.date && { borderColor: theme.colors.text.error },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text
              style={[
                theme.components.button.text.primary,
                { textAlign: 'center' },
              ]}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter à ma liste de souhaits'}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  imageButton: {
    ...theme.components.button.primary,
  },
  imagesText: {
    marginTop: 10,
    textAlign: 'center',
  },
  imagesPreviewLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  imagesPreviewContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imagePreviewContainer: { position: 'relative' },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePreviewRemoveButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.text.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewRemoveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitButton: {
    ...theme.components.button.primary,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    ...theme.components.button.text.primary,
    marginLeft: 10,
  },
});
