import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { signup } from '../../services/authService';
import { handleApiError } from '../../services/errorService';
import { theme } from '../../styles/theme';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Récupération du contexte d'authentification
  const { login } = useContext(AuthContext);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Données du formulaire:', formData);
    setErrors({}); // Reset des erreurs

    // Validation basique frontend
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.nickname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrors({ general: 'Veuillez remplir tous les champs' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }

    try {
      setLoading(true);

      const userData = await signup({
        firstname: formData.firstname,
        lastname: formData.lastname,
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
      });

      // Connecter l'utilisateur automatiquement après l'inscription
      console.log('Données utilisateur reçues:', userData);

      if (userData._id && userData.token) {
        console.log('Connexion automatique après inscription');
        await login(userData);
        router.replace('/main/events');
      } else {
        console.log('Données utilisateur manquantes');
      }
    } catch (error) {
      const errors = handleApiError(error);
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header arrowShow={true} title='Créer un compte' />

      {/* Form */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 15,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={theme.components.card.container}>
          {/* Prénom */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Prénom
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Votre prénom'
              value={formData.firstname}
              onChangeText={value => handleInputChange('firstname', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.firstname && (
              <Text style={theme.errorText}>{errors.firstname}</Text>
            )}
          </View>

          {/* Nom */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Nom
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Votre nom'
              value={formData.lastname}
              onChangeText={value => handleInputChange('lastname', value)}
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.lastname && (
              <Text style={theme.errorText}>{errors.lastname}</Text>
            )}
          </View>

          {/* Pseudo */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Pseudo
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Choisissez un pseudo unique'
              value={formData.nickname}
              onChangeText={value => handleInputChange('nickname', value)}
              placeholderTextColor={theme.colors.text.secondary}
              autoCapitalize='none'
            />
            {errors.nickname && (
              <Text style={theme.errorText}>{errors.nickname}</Text>
            )}
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                marginTop: 5,
              }}
            >
              Ce pseudo sera visible par les autres utilisateurs
            </Text>
          </View>

          {/* Email */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Votre email'
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType='email-address'
              autoCapitalize='none'
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.email && (
              <Text style={theme.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Mot de passe */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Mot de passe
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Votre mot de passe'
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              secureTextEntry
              autoCapitalize='none'
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.password && (
              <Text style={theme.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirmer le mot de passe */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Confirmer le mot de passe
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Confirmez votre mot de passe'
              value={formData.confirmPassword}
              onChangeText={value =>
                handleInputChange('confirmPassword', value)
              }
              secureTextEntry
              autoCapitalize='none'
              placeholderTextColor={theme.colors.text.secondary}
            />
            {errors.confirmPassword && (
              <Text style={theme.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Affichage des erreurs générales */}
          {errors.general && (
            <Text style={theme.errorText}>{errors.general}</Text>
          )}
          {/* Bouton Créer mon compte */}
          <TouchableOpacity
            style={[
              theme.components.button.primary,
              { marginVertical: 20, alignSelf: 'center', width: '90%' },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {loading ? (
                <ActivityIndicator color={theme.colors.text.white} />
              ) : (
                <Ionicons
                  name='person-add'
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
                {loading ? 'Création...' : 'Créer mon compte'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
