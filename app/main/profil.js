import { FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

const Profil = () => {
  const { logout, user } = useContext(AuthContext);
  const [firstname, setFirstname] = useState(user ? user.firstname : '');
  const [lastname, setLastname] = useState(user ? user.lastname : '');
  const [nickname, setNickname] = useState(user ? user.nickname : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [isUpdating, setIsUpdating] = useState(false);

  //Utilisateur récupéré: {"_id": "68ca7655cf64393658222f01", "email": "iseline@gmail.com", "events": [], "firstname": "Iseline", "lastname": "Voison", "nickname": "Iseline", "token": "AEZxtpQaE4NQ5Z40R2eDh6or7za2llGFCuM-wLEPF269_9b4YoDXzxnbzOyZn6xh"}

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
        `${API_URL}/user/update`,
        {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          nickname: nickname.trim(),
          email: email.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
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

  return (
    <View style={styles.main}>
      <Header title='MON PROFIL' />
      <View style={styles.container}>
        <View style={styles.logoProfil}>
          <FontAwesome5 name='user-alt' size={46} color='white' />
        </View>
        <Text>{`${firstname.toUpperCase()} ${lastname.toUpperCase()}`}</Text>
        <View style={styles.section}>
          <View style={styles.details}>
            <Text>INFORMATIONS PERSONNELLES</Text>
            <View style={styles.containerInput}>
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
    </View>
  );
};

export default Profil;

const styles = StyleSheet.create({
  main: { backgroundColor: theme.colors.background.primary, height: '100%' },
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
  containerInput: {
    gap: 8,
  },
  details: {
    gap: 10,
  },
  input: {
    ...theme.components.input.container,
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.m,
  },
});
