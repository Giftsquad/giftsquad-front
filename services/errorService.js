/**
 * Service de gestion centralisée des erreurs
 */

export const handleApiError = error => {
  console.error('Erreur API:', error.response?.data || error.message); // erreur dans bandeau natif en bas de l'ecran (disparait en prod)

  // Retourner directement les données d'erreur du backend
  if (error.response?.data) {
    const { message, errors } = error.response.data;

    if (errors) {
      // Erreurs d'express-validator - mapper par champ
      const validationErrors = {};
      errors.forEach(err => {
        validationErrors[err.path] = err.msg;
      });
      return validationErrors;
    } else {
      // Erreur générale du backend
      return { general: message };
    }
  }

  // Erreur réseau
  if (!error.response) {
    return { general: 'Erreur de connexion, vérifiez votre réseau' };
  }

  // Erreur par défaut
  return { general: error.message || 'Une erreur est survenue' };
};
