import { createContext } from 'react';

const AuthContext = createContext(); 
// On crée le contexte pour l’authentification qui servira à stocker userId, userToken, login, logout
//    → tout composant "enfant" pourra utiliser ce contexte via useContext(AuthContext)

export default AuthContext; 
// On exporte le contexte pour l’utiliser ailleurs (page /auth/login, page /main/_layout)
