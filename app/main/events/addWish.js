import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
import Header from '../../../components/Header';
import AuthContext from '../../../contexts/AuthContext';
import { theme } from '../../../styles/theme';

const IMAGES_LIMIT = 5;

export default function AddWishScreen({ route, navigation }) {
  // Récupère l'événement complet transmis depuis la navigation
  const { event } = route.params;
  const { handleAddGift } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  // États pour stocker les valeurs saisies par l'utilisateur
  const [name, setName] = useState(''); // Nom du souhait
  const [price, setPrice] = useState(''); // Nom du souhait
  const [description, setDescription] = useState(''); // Description du souhait
  const [url, setUrl] = useState(''); // lien vers le souhait (optionnel)
  const [images, setImages] = useState([]); // images sélectionnées dans la galerie (optionnel)
  const [loading, setLoading] = useState(false); // état du chargement (évite plusieurs clics)

  const canPickImage = () => images.length < IMAGES_LIMIT;

  // Fonction qui ouvre la galerie du téléphone ou l'appareil photo pour sélectionner plusieurs images
  const pickImages = async type => {
    const { status } =
      'gallery' === type
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();

    if ('granted' !== status) {
      Alert.alert(
        `Vous devez autoriser l\'application à accéder à la ${
          'gallery' === type ? 'la galerie' : "l'appareil"
        } photo`
      );

      return;
    }

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
      setErrors({ name: 'Le nom est obligatoire' });
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
      formData.append('price', Number(price) || 0);
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
        <View style={{ marginVertical: 20 }}>
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
              placeholder="Ex : Livre - L'Alchimiste"
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={theme.errorText}>{errors.name}</Text>}
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
              placeholder='Ex : 25'
              value={price}
              onChangeText={setPrice}
              keyboardType='numeric'
            />
            {errors.price && (
              <Text style={theme.errorText}>{errors.price}</Text>
            )}
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
                  opacity: canPickImage() ? 1 : 0.5,
                },
                errors.date && { borderColor: theme.colors.text.error },
              ]}
              onPress={() => pickImages('camera')}
              disabled={!canPickImage()}
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

            {/* Accès à la galerie photo */}
            <TouchableOpacity
              style={[
                theme.components.input.container,
                {
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                  opacity: canPickImage() ? 1 : 0.5,
                },
                errors.date && { borderColor: theme.colors.text.error },
              ]}
              onPress={() => pickImages('gallery')}
              disabled={!canPickImage()}
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
          {errors.images && (
            <Text style={theme.errorText}>{errors.images}</Text>
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
            {errors.url && <Text style={theme.errorText}>{errors.url}</Text>}
          </View>

          {/* Description du cadeau */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Description
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Description du souhait'
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
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
            style={[
              theme.components.button.primary,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
              },
              errors.date && { borderColor: theme.colors.text.error },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading && <ActivityIndicator color={theme.colors.text.white} />}
            <Text
              style={[
                theme.components.button.text.primary,
                { textAlign: 'center' },
              ]}
            >
              {loading
                ? ' Ajout en cours...'
                : 'Ajouter à ma liste de souhaits'}
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
});
