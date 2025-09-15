import { Text, View } from 'react-native';
import { theme } from '../../styles/theme';

export default function LoginScreen() {
  return (
    <View
      style={[
        theme.components.screen.centerContent,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Text style={theme.components.screen.title}>SE CONNECTER</Text>
    </View>
  );
}
