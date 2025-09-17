import { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { handleApiError } from '../../services/errorService';
import { theme } from '../../styles/theme';

export default function TestUserScreen() {
  // Récupération du contexte global
  const { user, update } = useContext(AuthContext);

  // États locaux pour les modifications
  const [isModifying, setIsModifying] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [errors, setErrors] = useState({});

  // Fonction pour modifier le nickname via l'API
  const updateNickname = async () => {
    setIsModifying(true);
    setErrors({});

    try {
      // Appel à l'API pour mettre à jour le nickname via la fonction update du contexte
      await update({
        firstname: user.firstname,
        lastname: user.lastname,
        nickname: nickname,
        email: user.email,
      });
    } catch (error) {
      const apiErrors = handleApiError(error);
      setErrors(apiErrors);

      Alert.alert('Erreur', 'Impossible de mettre à jour le nickname', [
        { text: 'OK' },
      ]);
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='TEST MODIFICATION USER' />

      <View style={{ padding: 20 }}>
        {/* Affichage du nickname actuel */}
        <Text style={[theme.components.screen.title, { marginBottom: 20 }]}>
          Modifier le nickname :
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
          Nickname actuel :{' '}
          <Text style={{ fontWeight: 'bold' }}>{user?.nickname}</Text>
        </Text>

        {/* Formulaire de modification du nickname */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[theme.components.input.label, { marginBottom: 8 }]}>
            Nouveau nickname
          </Text>
          <TextInput
            style={[
              theme.components.input.container,
              errors.nickname && { borderColor: theme.colors.text.error },
            ]}
            placeholder='Votre nouveau pseudo'
            value={nickname}
            onChangeText={setNickname}
            placeholderTextColor={theme.colors.text.secondary}
          />
          {errors.nickname && (
            <Text style={{ color: theme.colors.text.error, marginTop: 5 }}>
              {errors.nickname}
            </Text>
          )}

          {/* Erreur générale */}
          {errors.general && (
            <Text style={{ color: theme.colors.text.error, marginTop: 10 }}>
              {errors.general}
            </Text>
          )}
        </View>

        {/* Bouton de confirmation */}
        <TouchableOpacity
          style={[
            theme.components.button.primary,
            { marginBottom: 20, opacity: isModifying ? 0.6 : 1 },
          ]}
          onPress={updateNickname}
          disabled={isModifying}
        >
          <Text style={theme.components.button.text.primary}>
            {isModifying ? 'Mise à jour...' : 'Confirmer la mise à jour'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
