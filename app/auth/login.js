import Header from '../../components/Header';
import { theme } from '../../styles/theme';
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
import AuthContext from '../../contexts/AuthContext';
import { login as loginUser } from '../../services/authService';
import { handleApiError } from '../../services/errorService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from '@expo/vector-icons/Entypo';
import Constants from 'expo-constants';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Récupération du contexte d’authentification déclaré dans le fichier app/contexts/AuthContext.js
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    setErrors({}); // Reset des erreurs

    try {
      setLoading(true);
      const userData = await loginUser(email, password);

      // On récupère bien l'ID et le token de l'utilisateur
      const userId = userData._id;
      const userToken = userData.token;

      // on appelle la fonction login déclarée dans le fichier app/_layout.js
      if (userId && userToken) {
        await login(userData);
        router.replace('/main/events');
      }
    } catch (error) {
      // console.log('Erreur de connexion:', error.response?.data);
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
        {
          backgroundColor: theme.colors.background.primary,
          paddingBottom: Constants.statusBarHeight + 20,
        },
      ]}
    >
      <Header arrowShow={false} title='Login' />

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
          {/* Email */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Votre email'
              value={email}
              onChangeText={setEmail}
              autoCapitalize='none'
              keyboardType='email-address'
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
                color: theme.colors.text.primary,
                marginBottom: 8,
              }}
            >
              Mot de passe
            </Text>
            <TextInput
              style={theme.components.input.container}
              placeholder='Votre mot de passe'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true} // crypte le password avec des points au lieu de caractères
              autoCapitalize='none'
            />
            {errors.password && (
              <Text style={theme.errorText}>{errors.password}</Text>
            )}
          </View>

          {errors.general && (
            <Text style={theme.errorText}>{errors.general}</Text>
          )}

          {/* Bouton Créer mon compte */}
          <TouchableOpacity
            style={[
              theme.components.button.primary,
              { marginVertical: 20, alignSelf: 'center', width: '100%' },
            ]}
            onPress={handleSubmit}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {loading ? (
                <ActivityIndicator color={theme.colors.text.white} />
              ) : (
                <Entypo name='login' size={24} color='white' />
              )}
              <Text
                style={[
                  theme.components.button.text.primary,
                  { marginLeft: 10 },
                ]}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <Ionicons name='person-add' size={24} color='#6fd34e' />
          <TouchableOpacity onPress={() => router.navigate('/auth/signup')}>
            <Text style={{ color: '#6fd34e' }}>
              {' '}
              Pas encore de compte ? Créez-en un !
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
