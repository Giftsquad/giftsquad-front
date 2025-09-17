import { Text, View } from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../styles/theme';

export default function CreateEventScreen() {
  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='CRÉER UN SECRET SANTA' />
      <Text>CRÉER UN SECRET SANTA</Text>
      <Text>INFORMATIONS</Text>
    </View>
  );
}
