import { Text, View } from 'react-native';
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
      <Header title='CRÉER UN SECRET SANTA' />
      <Text>CRÉER UN SECRET SANTA</Text>
      <Text>INFORMATIONS</Text>
      
      
    </View>
  );
}
