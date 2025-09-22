# Configuration Prettier

Configuration Prettier pour le projet React Native/Expo.

## Options configurées

- **`semi: true`** - Point-virgules obligatoires
- **`singleQuote: true`** - Guillemets simples
- **`printWidth: 80`** - Largeur de ligne 80 caractères
- **`tabWidth: 2`** - Indentation 2 espaces
- **`useTabs: false`** - Espaces au lieu de tabulations
- **`trailingComma: "es5"`** - Virgules finales ES5
- **`bracketSpacing: true`** - Espaces dans les objets
- **`arrowParens: "avoid"`** - Pas de parenthèses pour les flèches simples
- **`jsxSingleQuote: true`** - Guillemets simples en JSX
- **`bracketSameLine: false`** - Accolades fermantes sur nouvelle ligne
- **`endOfLine: "auto"`** - Fins de ligne automatiques (compatible Windows/Mac)
- **`proseWrap: "preserve"`** - Préserve le formatage Markdown

## Utilisation

```bash
# Formater tous les fichiers
npx prettier --write .

# Vérifier le formatage
npx prettier --check .
```
# Guiftsquad (15/09/25)

Application mobile développée en **React Native** avec **Expo**.  
Ce projet implémente un système d’authentification avec persistance via `AsyncStorage` et une navigation structurée grâce à **expo-router**.

---

## Fonctionnalités principales
- Création et gestion d’un **compte utilisateur** (Signup / Login).  
- **Authentification persistante** : les sessions restent actives même après redémarrage de l’application.  
- **Navigation conditionnelle** :  
  - Redirection vers `/auth/login` si l’utilisateur n’est pas connecté.  
  - Redirection vers `/main/event` si une session est détectée.  
- Gestion du **contexte global** (`AuthContext`) pour partager l’état de connexion dans toute l’application.  
- **Logout** avec suppression sécurisée des données locales (`AsyncStorage`).  

---

## 📂 Structure du projet

app/
├── _layout.js # RootLayout : gestion globale du contexte & redirection
├── auth/ # Écrans liés à l'authentification
│ ├── _layout.js # Layout avec Tabs (login / signup)
│ ├── login.js # Page de connexion
│ └── signup.js # Page d’inscription
├── main/ # Écrans accessibles après connexion
│ ├── _layout.js # Layout avec Tabs (event / createEvent)
│ ├── event.js # Liste des évènements
│ └── createEvent.js # Création d’un évènement
contexts/
└── AuthContext.js # Définition du contexte d’authentification

---

## 🔄 Cycle de vie au démarrage

1. Lancement de l’application → `RootLayout` s’initialise.  
2. Vérification dans `AsyncStorage` des données `id` et `token`.  
3. Deux cas possibles :  
   - Si trouvés → `userId` et `userToken` sont restaurés → redirection vers `/main/event`.  
   - Sinon → redirection vers `/auth/login`.  
4. Pendant l’initialisation, un **loader (`ActivityIndicator`)** est affiché.  
5. `AuthContext.Provider` rend disponibles `userId`, `userToken`, `login()` et `logout()` à toute l’application.  

---

## Technologies utilisées
- [React Native](https://reactnative.dev/)  
- [Expo](https://expo.dev/)  
- [expo-router](https://expo.github.io/router/docs/)  
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)  
- [Axios](https://axios-http.com/)
- [React Native Date Picker](https://github.com/henninghall/react-native-date-picker#datepicker)

---

## Installation & lancement

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Giftsquad/giftsquad-front.git
   cd giftsquad
 

2. **Installer les dépendances**
    ```bash
    yarn add expo

3. **Lancer l’application**
    ```bash
    yarn start

3. **Backend requis**
L’app attend une API REST avec une route POST /login qui renvoie un objet { id, token }.
En simulateur Android, utiliser http://10.0.2.2:3000/login.
En iOS ou sur device réel, remplace par l’IP locale de ta machine (ex: http://192.168.1.xx:3000/login).

---

## Packages à installer

- Picker pour utiliser le menu déroulant de suggestion de type d’évènement : yarn add @react-native-picker/picker 
- Picker pour utiliser le calendrier des dates : npx expo install react-native-date-picker
- Picker pour la gestion des images : yarn add expo-image-picker pour gérer l’image


 


## Développeurs/contributeurs du projet
- Iseline Voisin
- Julien Castejon
- Thomas Laroudie
- Florian Vidal

---




   

