import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../styles/theme';

export default function CreateTypeEventScreen() {
  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='CRÉER UN ÉVÈNEMENT' />

      <Text>CRÉER UN ÉVÈNEMENT</Text>
      <Text>QUEL TYPE D'ÉVÈNEMENT SOUHAITEZ-VOUS CRÉER ?</Text>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={theme.components.button.primary}
          onPress={() => router.push('/main/createEvent')} // Navigation vers la page createEvent
        >
          <Text style={theme.components.button.text.primary}>SECRET SANTA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
