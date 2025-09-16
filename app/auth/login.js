import Header from '../../components/Header';
import { theme } from '../../styles/theme';

import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthContext from '../../contexts/AuthContext';
import { handleApiError } from '../../services/errorService';

const LoginScreen = () => {
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

      const response = await axios.post('http://10.0.2.2:3000/user/login', {
        email,
        password,
      });

      // On récupère bien l'ID et le token de l'utilisateur
      const userId = response.data._id;
      const userToken = response.data.token;

      // on appelle la fonction login déclarée dans le fichier app/_layout.js
      if (userId && userToken) {
        login(userId, userToken);
        router.replace('/main/events');
      }
    } catch (error) {
      console.log('Erreur de connexion:', error.response?.data);
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
      <Header arrowShow={false} title='SE CONNECTER' />
      <View style={theme.components.screen.centerContent}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Mot de passe'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} // crypte le password avec des points au lieu de caractères
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {errors.general && (
          <Text style={styles.errorText}>{errors.general}</Text>
        )}

        {/* déclenche l'envoi au back du mail + password puis récupère la réponse */}
        <TouchableOpacity onPress={handleSubmit}>
          {loading ? <ActivityIndicator /> : <Text>Se connecter</Text>}
        </TouchableOpacity>

        <View style={styles.backButton}>
          <Ionicons name='person-add' size={24} color='#ccc' />
          <TouchableOpacity onPress={() => router.navigate('/auth/signup')}>
            <Text> Pas encore de compte ? Créez-en un !</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {
    width: '60%',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    color: theme.colors.text.error,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  backButton: {
    alignItems: 'center',
    gap: 5,
    marginVertical: 15,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: '#ccc',
  },
});
