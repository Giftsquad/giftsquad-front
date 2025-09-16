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
};

export default LoginScreen;

const styles = StyleSheet.create({
  input: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 15
  },
  backButton: {
    alignItems: "center",
    gap: 5,
    marginVertical: 15,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: "#ccc",
  }
});
