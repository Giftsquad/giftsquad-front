import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useContext, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import AuthContext from '../../contexts/AuthContext';
import { theme } from '../../styles/theme';

export default function EventScreen() {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Page Events - Objet utilisateur:', user);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View
      style={[
        theme.components.screen.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Header
        title='MES ÉVÈNEMENTS'
        showHamburger={true}
        onHamburgerPress={() => navigation.openDrawer()}
        arrowShow={false}
      />

      <View style={theme.components.screen.centerContent}>
        {user?.email && (
          <Text style={theme.components.screen.title}>{user.email}</Text>
        )}

        <TouchableOpacity
          style={[theme.components.button.primary, { marginTop: 10 }]}
          onPress={handleLogout}
        >
          <Text style={theme.components.button.text.primary}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
