import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 import
import { theme } from "../../styles/theme";
import Header from "../../components/Header";

export default function CreateTypeEventScreen() {
  const navigation = useNavigation(); // 👈 hook pour accéder au Drawer/Stack

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header title="CRÉER UN ÉVÈNEMENT" />

      <Text>CRÉER UN ÉVÈNEMENT</Text>
      <Text>QUEL TYPE D'ÉVÈNEMENT SOUHAITEZ-VOUS CRÉER ?</Text>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={theme.components.button.primary}
          onPress={() => navigation.navigate("CreateEvent")} // useNavigation (Stack) ne fonctione qu'avec le <Drawer.Screen> dans _layout.js
        >
          <Text style={theme.components.button.text.primary}>SECRET SANTA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
