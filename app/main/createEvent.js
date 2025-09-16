import { View, Text } from 'react-native';
import { theme } from '../../styles/theme';
import Header from '../../components/Header';

export default function CreateEventScreen() {
  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title='CRÉER UN ÉVÈNEMENT' />
      <Text>CRÉER UN ÉVÈNEMENT</Text>
    </View>
  );
}
