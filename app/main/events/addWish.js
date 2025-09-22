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
        {/* Nom du souhait */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={theme.components.input.container}
            placeholder='Nom du souhait'
            placeholderTextColor={theme.colors.text.secondary}
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={theme.errorText}>{errors.name}</Text>}
        </View>

        {/* Lien du souhait (optionnel) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Lien (optionnel)</Text>
          <TextInput
            style={theme.components.input.container}
            placeholder='Lien vers le produit'
            placeholderTextColor={theme.colors.text.secondary}
            value={url}
            onChangeText={setUrl}
            keyboardType='url'
          />
          {errors.url && <Text style={theme.errorText}>{errors.url}</Text>}
        </View>

        {/* Choisir des images */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Images du souhait (optionnelles)</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity
              title="Accéder à l'appareil photo"
              onPress={() => pickImages('camera')}
              disabled={IMAGES_LIMIT <= images.length}
            >
              <FontAwesome5
                style={{
                  ...styles.imageButton,
                  opacity: IMAGES_LIMIT <= images.length ? 0.5 : 1,
                }}
                name='camera'
                size={theme.typography.fontSize.xl}
                color={theme.colors.text.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              title='Accéder à la galerie photo'
              onPress={() => pickImages('gallery')}
              disabled={IMAGES_LIMIT <= images.length}
            >
              <FontAwesome5
                style={{
                  ...styles.imageButton,
                  opacity: IMAGES_LIMIT <= images.length ? 0.5 : 1,
                }}
                name='images'
                size={theme.typography.fontSize.xl}
                color={theme.colors.text.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.imagesText}>
            Choisir des images ({images.length}/{IMAGES_LIMIT})
          </Text>
        </View>

        {/* Aperçu des images sélectionnées */}
        {images && images.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.imagesPreviewLabel}>
              Images sélectionnées :
            </Text>
            <View style={styles.imagesPreviewContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.imagePreviewRemoveButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.imagePreviewRemoveButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {errors.images && <Text style={theme.errorText}>{errors.images}</Text>}

        {/* Description du souhait */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (optionnelle)</Text>
          <TextInput
            style={theme.components.input.container}
            placeholder='Description du souhait'
            placeholderTextColor={theme.colors.text.secondary}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={5}
          />
          {errors.description && (
            <Text style={theme.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Erreur générale */}
        {errors.general && (
          <Text style={theme.errorText}>{errors.general}</Text>
        )}

        {/* Bouton Ajouter le souhait */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading && <ActivityIndicator color={theme.colors.text.white} />}
          <Text style={styles.submitButtonText}>
            {loading ? 'Ajout en cours...' : 'Ajouter à ma liste de souhaits'}
          </Text>
        </TouchableOpacity>
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
