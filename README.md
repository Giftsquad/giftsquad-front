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
