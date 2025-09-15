import { Text, View } from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../styles/theme';

export default function LoginScreen() {
  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header arrowShow={false} title='Login' />
      <View style={theme.components.screen.centerContent}>
        <Text style={theme.components.screen.title}>SE CONNECTER</Text>
      </View>
    </View>
  );
}
