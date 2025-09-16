import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Header({ arrowShow = true, title = '', onBackPress }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {arrowShow && (
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={theme.colors.text.white}
          />
        </TouchableOpacity>
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
