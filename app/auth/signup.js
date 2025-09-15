import { Text, View } from 'react-native';
import { theme } from '../../styles/theme';

export default function SignupScreen() {
  return (
    <View
      style={[
        theme.components.screen.centerContent,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Text style={theme.components.screen.title}>S'INSCRIRE</Text>
    </View>
  );
}
