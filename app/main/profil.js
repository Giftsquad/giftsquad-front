import { FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ProfilScreen() {
  const { logout, user } = useContext(AuthContext);
  const [firstname, setFirstname] = useState(user ? user.firstname : '');
  const [lastname, setLastname] = useState(user ? user.lastname : '');
  const [nickname, setNickname] = useState(user ? user.nickname : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
      <Header title='Mon profil' />

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
        {/* Avatar */}
        <View style={{ alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 50,
              width: 100,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesome5 name='user-alt' size={46} color='white' />
          </View>

          {/* Nom & Prénom */}
          <Text>{`${firstname.toUpperCase()} ${lastname.toUpperCase()}`}</Text>

          {/* Pseudo */}
          <Text>{`@${nickname}`}</Text>
        </View>

        {/* Form */}
        <View style={theme.components.card.container}>
          <Text style={{ marginBottom: 20 }}>INFORMATIONS PERSONNELLES</Text>

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
              value={firstname}
              onChangeText={setFirstname}
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
              value={lastname}
              onChangeText={setLastname}
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
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize='none'
            />
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
              value={email}
              onChangeText={setEmail}
              autoCapitalize='none'
            />
          </View>
        </View>

        {/* Bouton Enregistrer les modifications */}
        <TouchableOpacity
          style={[
            theme.components.button.primary,
            { marginVertical: 20, width: '90%', alignSelf: 'center' },
          ]}
          onPress={handleUpdate}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator color={theme.colors.text.white} />
            ) : (
              <FontAwesome6 name='save' size={24} color='white' />
            )}
            <Text
              style={[theme.components.button.text.primary, { marginLeft: 10 }]}
            >
              {loading
                ? 'Enregistrement en cours ...'
                : 'Enregistrer les modifications'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            theme.components.button.accent,
            {
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
          onPress={logout}
        >
          <MaterialIcons name='logout' size={24} color='white' />
          <Text
            style={[theme.components.button.text.primary, { marginLeft: 10 }]}
          >
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
