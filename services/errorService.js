/**
 * Service de gestion centralisée des erreurs
 */
export const handleApiError = (error) => {
  console.log("❌ Axios full error dump:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

  // Cas 1 : le backend a renvoyé une réponse avec un status d'erreur
  if (error.response) {
    console.error("Erreur API:", error.response.data);

    const { message, errors } = error.response.data;

    if (errors) {
      // Erreurs d'express-validator - mapper par champ
      const validationErrors = {};
      errors.forEach((err) => {
        validationErrors[err.path] = err.msg;
      });
      return validationErrors;
    } else {
      // Erreur générale du backend
      return { general: message || "Erreur inconnue côté serveur" };
    }
  }

  // Cas 2 : requête envoyée mais aucune réponse (timeout, serveur inaccessible…)
  if (error.request) {
    console.error("Erreur API: Aucun serveur n'a répondu", error.message);
    return { general: "Impossible de contacter le serveur. Vérifiez votre connexion." };
  }

  // Cas 3 : erreur autre (bug JS, mauvaise config…)
  console.error("Erreur interne:", error.message || error);
  return { general: error.message || "Une erreur est survenue" };
};
