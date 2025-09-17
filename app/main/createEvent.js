import Constants from 'expo-constants'; // pour gérer la status bar sur différents téléphones
import { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../components/Header';
import { handleApiError } from '../../services/errorService'; // fonction qui transforme les erreurs API
import { theme } from '../../styles/theme'; // styles globaux (couleurs, polices, etc.)
import { Picker } from '@react-native-picker/picker'; // menu déroulant pour choisir le type d’évènement
import { Ionicons } from '@expo/vector-icons';
import { createEvent } from '../../services/eventService'; // fonction qui envoie les données au back
import { router } from 'expo-router';

export default function CreateEventScreen() {
  // état pour stocker les infos du formulaire
  const [formData, setFormData] = useState({
    type: 'Secret Santa', // valeur par défaut pour l'instant qu'on a qu'un seul type
    name: '',
    date: '',
    budget: '',
  });

  // état qui dit si on est en train de créer l’évènement
  const [loading, setLoading] = useState(false);

  // état pour stocker les erreurs (ex : champ vide, erreur API, etc.)
  const [errors, setErrors] = useState({});

  // fonction qui met à jour les champs du formulaire
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // fonction qui s’exécute quand on clique sur "Créer l’évènement"
  const handleSubmit = async () => {
    // console.log('Données du formulaire:', formData);
    setErrors({}); // on remet les erreurs à zéro

    // Vérifie que tous les champs sont remplis
    if (!formData.name || !formData.date || !formData.budget) {
      setErrors({ general: 'Veuillez remplir tous les champs' });
      return;
    }
    try {
      setLoading(true); // on affiche le loader

      // on envoie les données à l’API
      const eventData = await createEvent({
        type: formData.type,
        name: formData.name,
        date: formData.date,
        budget: formData.budget,
      });

      // si l’évènement est bien créé, on pourra rediriger vers la liste des évènements
      if (eventData?._id) {
        // console.log("Évènement créé :", eventData);
        router.replace('/main/events');
      }
    } catch (error) {
      // si l’API renvoie une erreur, on l’affiche
      const errors = handleApiError(error);
      setErrors(errors);
    } finally {
      setLoading(false); // on cache le loader
    }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Header avec le titre */}
      <Header title='CRÉER UN ÉVÈNEMENT' />

      {/* ScrollView qui gère bien le clavier */}
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
        <View style={theme.components.card.container}>
          {/* Type de l'évènement */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Type de l'évènement</Text>

            {/* Menu déroulant de suggestion de types d'évènement */}
            <Picker
              selectedValue={formData.type}
              onValueChange={value => handleInputChange('type', value)}
              style={styles.picker}
            >
              <Picker.Item label='Secret Santa' value='Secret Santa' />
              <Picker.Item label='Christmas List' value='Christmas List' />
              <Picker.Item label='Birthday' value='Birthday' />
            </Picker>

            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          {/* Nom de l'évènement */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Nom de l'évènement</Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Ex : Secret Santa Bureau'
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Date */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Date de l'évènement</Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='jj/mm/aaaa'
              value={formData.date}
              onChangeText={value => handleInputChange('date', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {/* Budget */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Budget conseillé</Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Ex : 20€'
              value={formData.budget}
              onChangeText={value => handleInputChange('budget', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.budget && (
              <Text style={styles.errorText}>{errors.budget}</Text>
            )}
          </View>

          {/* Erreur générale */}
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}

          {/* Bouton de création */}
          <TouchableOpacity
            style={[theme.components.button.primary, { marginBottom: 20 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {loading ? (
                <ActivityIndicator color={theme.colors.text.white} />
              ) : (
                <Ionicons
                  name='add-circle'
                  size={20}
                  color={theme.colors.text.white}
                />
              )}
              <Text
                style={[
                  theme.components.button.text.primary,
                  { marginLeft: 10 },
                ]}
              >
                {loading ? 'Création...' : "Créer l'évènement"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: theme.colors.text.error,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
