export default {
  expo: {
    name: 'giftsquad',
    slug: 'giftsquad',
    scheme: 'giftsquad',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.giftsquad.app',
      versionCode: 4, 
      adaptiveIcon: {
        foregroundImage: './assets/favicon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router'],
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: '2f0473dd-d49f-4fe8-8644-8ae4516c7d09',
      },
    },
    // EAS Update configuration
    updates: {
      url: 'https://u.expo.dev/2f0473dd-d49f-4fe8-8644-8ae4516c7d09',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
  cli: {
    version: '>= 16.19.3',
    appVersionSource: 'remote',
  },
  build: {
    development: {
      developmentClient: true,
      distribution: 'internal',
    },
    preview: {
      distribution: 'internal',
      android: {
        buildType: 'apk',
      },
    },
    production: {
      autoIncrement: true,
    },
  },
  submit: {
    production: {},
  },
};
