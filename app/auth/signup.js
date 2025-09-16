import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../components/Header';
import { theme } from '../../styles/theme';
import axios from "axios";

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log('Données du formulaire:', formData);

    // Validation basique
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.nickname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await axios.post(
        'http://VOTRE-IP-LOCALE:3000/user/signup',
        formData
      );
      Alert.alert('Succès', 'Compte créé avec succès !');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de créer le compte');
    }

   
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header
        arrowShow={true}
        title='Créer un compte'
        onBackPress={() => console.log('Retour')}
      />

      {/* Form */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
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
            />
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
              placeholderTextColor={theme.colors.text.secondary}
            />
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
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          {/* Bouton de création */}
          <TouchableOpacity
            style={[theme.components.button.primary, { marginBottom: 20 }]}
            onPress={handleSubmit}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name='person-add'
                size={20}
                color={theme.colors.text.white}
              />
              <Text
                style={[
                  theme.components.button.text.primary,
                  { marginLeft: 10 },
                ]}
              >
                Créer mon compte
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
