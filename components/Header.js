import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Header({
  arrowShow = true,
  title = '',
  showHamburger = false,
  onHamburgerPress,
}) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        paddingTop: Constants.statusBarHeight + 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {showHamburger ? (
        <TouchableOpacity onPress={onHamburgerPress}>
          <Ionicons name='menu' size={24} color={theme.colors.text.white} />
        </TouchableOpacity>
      ) : arrowShow ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={theme.colors.text.white}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      <Text
        style={{
          color: theme.colors.text.white,
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          textTransform: 'uppercase',
          flex: 1,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </View>
  );
}
