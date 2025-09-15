export const theme = {
  // Couleurs principales
  colors: {
    primary: '#6fd34e',
    secondary: '#4a90e2',
    accent: '#ff6b6b',

    // Couleurs de texte
    text: {
      primary: '#333333',
      secondary: '#666666',
      white: '#ffffff',
      error: '#e74c3c',
    },

    // Couleurs de fond
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
    },

    // Couleurs de bordure
    border: {
      light: '#e0e0e0',
      medium: '#cccccc',
    },
  },

  // Typographie
  typography: {
    fontSize: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
    fontWeight: {
      normal: '400',
      bold: '700',
    },
  },

  // Espacement
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },

  // Bordures
  borderRadius: {
    sm: 8,
    md: 12,
  },

  // Composants
  components: {
    button: {
      primary: {
        backgroundColor: '#6fd34e',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        primary: {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '700',
        },
      },
    },

    input: {
      container: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 15,
        backgroundColor: '#ffffff',
        fontSize: 16,
      },
      focused: {
        borderColor: '#6fd34e',
        borderWidth: 2,
      },
    },

    tabBar: {
      backgroundColor: '#6fd34e',
      activeTintColor: '#ffffff',
      inactiveTintColor: '#999999',
    },

    // Styles prédéfinis pour les écrans
    screen: {
      container: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
      centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
      },
    },
  },

  // Layout
  layout: {
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
};
