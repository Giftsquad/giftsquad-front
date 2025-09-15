import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useState, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AuthContext from "../../contexts/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("giftsquad758@gmail.com");
  const [password, setPassword] = useState("gitftsquad758@");
  const [loading, setLoading] = useState(false); // permet d'afficher un loader pendant que les données chargent

  // Récupération du contexte d’authentification déclaré dans le fichier app/contexts/AuthContext.js
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // "http://10.0.2.2" ne fonctionne que pour l'émulateur Android
      // Sur iOS ou sur un vrai device, il faudra utiliser l’IP locale de ton Mac
      const response = await axios.post("http://10.0.2.2:3000/login", {
        email,
        password,
      });

      // console.log(response.data);

      // On récupère bien l’ID et le token de l'utilisateur qu'on stocke dans deux props
      const userId = response.data.id;
      const userToken = response.data.token;

      // on appelle la fonction login déclarée dans le fichier app/_layout.js
      if (userId && userToken) {
        login(userId, userToken);
      }
    } catch (error) {
      console.log("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SE CONNECTER</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // crypte le password avec des points au lieu de caractères
      />

     {/* déclenche l'envoi au back du mail + password puis récupère la réponse */}
      <TouchableOpacity onPress={handleSubmit}>
        {loading ? <ActivityIndicator /> : <Text>Sign In</Text>}
      </TouchableOpacity>

      <View style={styles.backButton}>
        <FontAwesome name="user" size={24} color="#ccc" />
        <TouchableOpacity onPress={() => router.navigate("/auth/signup")}>
          <Text> Pas encore de compte ? Créez-en un !</Text>
        </TouchableOpacity>
      </View>
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
