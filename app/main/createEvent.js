import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // menu de type d'event déroulant
import Constants from 'expo-constants';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../components/Header';
import { handleApiError } from '../../services/errorService';
import { createEvent } from '../../services/eventService';
import { theme } from '../../styles/theme';

export default function CreateEventScreen() {
  const [formData, setFormData] = useState({
    type: 'Secret Santa',
    name: '',
    date: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Récupération du contexte d'authentification
  // const { event } = useContext(EventContext);

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

  const handleSubmit = async () => {
    console.log('Données du formulaire:', formData);
    setErrors({}); // Reset des erreurs

    // Validation basique frontend
    if (!formData.name || !formData.date || !formData.budget) {
      setErrors({ general: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      setLoading(true);

      // Formater la date au format jj/mm/aaaa pour l'envoi
      const eventData = await createEvent({
        type: formData.type,
        name: formData.name,
        date: formatDateForAPI(formData.date),
        budget: formData.budget,
      });
    } catch (error) {
      const errors = handleApiError(error);
      setErrors(errors);
    } finally {
      setLoading(false);
    }

    //     if (eventData?._id) {
    //   console.log("✅ Évènement créé :", eventData);
    //   router.replace("/main/events");
    // }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='CRÉER UN SECRET SANTA' />

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
        <View style={theme.components.card.container}>
          {/* Type de l'évènement */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Type de l'évènement
            </Text>
            {/* <TextInput
              style={theme.components.input.container}
              value={formData.type}
              onChangeText={value => handleInputChange('type', value)}
              placeholderTextColor={theme.colors.text.secondary}
            /> */}
            <Picker
              selectedValue={formData.type}
              onValueChange={value => handleInputChange('type', value)}
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                borderColor: '#ccc',
                borderWidth: 1,
              }}
            >
              <Picker.Item label='Secret Santa' value='Secret Santa' />
              <Picker.Item label='Christmas List' value='Christmas List' />
              <Picker.Item label='Birthday' value='Birthday' />
            </Picker>
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          {/* Nom de l'évènement */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Nom de l'évènement
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Ex : Secret Santa Bureau'
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Date de l'évènement */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Date de l'évènement
            </Text>
            <TextInput
              style={[
                theme.components.input.container,
                errors.date && { borderColor: theme.colors.text.error },
              ]}
              placeholder='jj/mm/aaaa'
              value={formData.date}
              onChangeText={value => handleInputChange('date', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {/* Budget */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Budget conseillé
            </Text>
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

          {/* Affichage des erreurs générales */}
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}

          {/* Bouton de création de l'évènement*/}
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
});
