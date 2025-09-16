import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import { FontAwesome5, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { theme } from '../../styles/theme';

const Profil = () => {
  const { logout, userToken, userId, user } = useContext(AuthContext);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleUpdate = async () => {
    if (!email.trim() || !nickname.trim()) {
      Alert.alert(
        'Erreur',
        "L'email et le nom d'utilisateur sont obligatoires"
      );
      return;
    }
    try {
      setIsUpdating(true);
      const response = await axios.put(
        'http://192.168.86.97:3000/update',
        {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          nickname: nickname.trim(),
          email: email.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log('Profil mis à jour:', response.data);
      Alert.alert('Succès', 'Profil mis à jour avec succès !');
    } catch (error) {
      console.log('Erreur mise à jour:', error.message);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    Alert.alert('user déjà présent', JSON.stringify(user));
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.86.97:3000/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setFirstname(response.data.firstname || '');
        setLastname(response.data.lastname || '');
        setNickname(response.data.nickname || '');
        setEmail(response.data.email || '');
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };
    if (userId && userToken) {
      fetchData();
    } else {
      console.log('userId ou userToken manquant');
      setIsLoading(false);
    }
  }, [userId, userToken]);

  return isLoading ? (
    <ActivityIndicator size='large' color={theme.colors.primary} />
  ) : (
    <ScrollView>
      <Header title='MON PROFIL' />
      <View style={styles.container}>
        <View style={styles.logoProfil}>
          <FontAwesome5 name='user-alt' size={46} color='white' />
        </View>
        <Text>
          `${firstname} ${lastname}`
        </Text>
        <View style={styles.section}>
          <View style={styles.details}>
            <Text>INFORMATIONS PERSONNELLES</Text>
            <Text>Prénom</Text>
            <TextInput
              style={styles.input}
              value={firstname}
              onChangeText={setFirstname}
            />
            <Text>Nom</Text>
            <TextInput
              style={styles.input}
              value={lastname}
              onChangeText={setLastname}
            />
            <Text>Pseudo</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
            />
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <Pressable style={styles.updateButton} onPress={handleUpdate}>
            {isUpdating ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <FontAwesome6 name='save' size={24} color='white' />
            )}
            <Text style={styles.text}>
              {isUpdating
                ? 'Enregistrement en cours ...'
                : 'Enregistrer les modifications'}
            </Text>
          </Pressable>
          <Pressable style={styles.logoutButton} onPress={logout}>
            <MaterialIcons name='logout' size={24} color='white' />
            <Text style={styles.text}>Se déconnecter</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profil;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoProfil: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { gap: 20 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    height: 40,
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    gap: 5,
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    gap: 5,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
