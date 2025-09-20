import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'; // composant calendrier compatible Expo
import { Picker } from '@react-native-picker/picker'; // menu déroulant pour choisir le type d’évènement
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants'; // pour gérer la status bar sur différents téléphones
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../components/Header';
import { handleApiError } from '../../services/errorService'; // fonction qui transforme les erreurs API
import { createEvent } from '../../services/eventService'; // fonction qui envoie les données au back
import { theme } from '../../styles/theme'; // styles globaux (couleurs, polices, etc.)
export default function CreateEventScreen() {
  // état qui gère l’ouverture/fermeture du calendrier
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  // état pour stocker les infos du formulaire
  const [formData, setFormData] = useState({
    type: 'secret_santa', // valeur par défaut pour l'instant qu'on a qu'un seul type
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

  const formatDateForAPI = dateString => {
    // Convertir le format jj/mm/aaaa vers ISO pour le backend
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const date = new Date(year, month - 1, day);
      // Retourner au format ISO (YYYY-MM-DD) que .isDate() peut valider
      return date.toISOString().split('T')[0];
    }

    // Si c'est déjà une date ISO, la retourner telle quelle
    return dateString;
  };

  // Fonction qui s’exécute quand on clique sur "Créer l’évènement"
  const handleSubmit = async () => {
    setErrors({}); // on remet les erreurs à zéro

    // Vérifie que tous les champs sont remplis
    if (!formData.name || !formData.date || !formData.budget) {
      setErrors({ general: 'Veuillez remplir tous les champs' });
      return;
    }
    try {
      setLoading(true); // on affiche le loader

      // On envoie les données à l’API
      const eventData = await createEvent({
        type: formData.type,
        name: formData.name,
        date: formatDateForAPI(formData.date),
        budget: formData.budget,
      });

      // Si l’évènement est bien créé, on pourra rediriger vers la liste des évènements
      if (eventData?._id) {
        // Réinitialiser les champs et les erreurs
        setFormData({
          type: 'secret_santa',
          name: '',
          date: '',
          budget: '',
        });
        setErrors({});

        navigation.navigate('events');
      }
    } catch (error) {
      // Si l’API renvoie une erreur, on l’affiche
      const errors = handleApiError(error);
      setErrors(errors);
    } finally {
      setLoading(false); // On cache le loader
    }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='Créer un évènement' />

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
        {/* Form */}
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
              <Picker.Item label='Secret Santa' value='secret_santa' />
              <Picker.Item label='Christmas List' value='christmas_list' />
              <Picker.Item label='Birthday' value='birthday' />
            </Picker>

            {errors.type && <Text style={theme.errorText}>{errors.type}</Text>}
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
            {errors.name && <Text style={theme.errorText}>{errors.name}</Text>}
          </View>

          {/* Date de l'évènement */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Date de l'évènement</Text>

            {/* Zone cliquable qui ouvre le DatePicker */}
            <TouchableOpacity
              style={[
                theme.components.input.container,
                { justifyContent: 'center' },
                errors.date && { borderColor: theme.colors.text.error },
              ]}
              onPress={() => setOpen(true)}
            >
              <Text
                style={{
                  color: formData.date
                    ? theme.colors.text.primary
                    : theme.colors.text.secondary,
                }}
              >
                {formData.date || 'Choisir une date'}
              </Text>
            </TouchableOpacity>

            {errors.date && <Text style={theme.errorText}>{errors.date}</Text>}

            {/* DatePicker modal Expo-compatible */}
            {open && (
              <DateTimePicker
                value={formData.date ? new Date(formData.date) : new Date()}
                mode='date'
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()} // interdit les dates passées
                onChange={(event, selectedDate) => {
                  setOpen(false);
                  if (selectedDate) {
                    const formatted = selectedDate.toLocaleDateString('fr-FR'); // jj/mm/aaaa
                    handleInputChange('date', formatted);
                  }
                }}
              />
            )}
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
              <Text style={theme.errorText}>{errors.budget}</Text>
            )}
          </View>

          {/* Erreur générale */}
          {errors.general && (
            <Text style={theme.errorText}>{errors.general}</Text>
          )}
        </View>

        {/* Bouton Créer l'évènement */}
        <TouchableOpacity
          style={[
            theme.components.button.primary,
            { marginVertical: 30, width: '90%', alignSelf: 'center' },
          ]}
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
              style={[theme.components.button.text.primary, { marginLeft: 10 }]}
            >
              {loading ? 'Création...' : "Créer l'évènement"}
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
