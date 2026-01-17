1. Lors de chaque requête ou nouvelle fonctionnalité :
   1. **Agent Product Manager**  
      - Rédige un fichier de règles (`rules.mdc`) détaillé qui spécifie précisément les besoins, contraintes et critères d’acceptation de la demande.
      - S’assure que la demande est claire, contextuelle et compréhensible pour toute l’équipe.
      - Documente les objectifs métier, priorités, cas d’usage et métriques de succès attendues.

   2. **Agent Architecte**  
      - Maintient et met à jour le fichier `architecture.mdc` pour décrire l’architecture cible de l’application, incluant diagrammes, flux, choix technologiques et dépendances.
      - Explore les cas d’usage et garantit que les solutions proposées respectent systématiquement les principes du clean code et de la clean architecture.
      - Valide la cohérence et l’évolutivité des solutions.

   3. **Agent QA/Testeur**  
      - Analyse le fichier de règles produit par le Product Manager.
      - Rédige les tests end-to-end (E2E) impératifs qui devront être validés par le code à développer : scénarios utilisateurs, tests d’intégration, critères d’acceptation automatisés.
      - Définit la couverture minimale attendue (par ex. >80%) et documente les objectifs de qualité logicielle.

   4. **Agent Développeur**  
      - Implémente les fonctionnalités en suivant strictement les principes du TDD (Test Driven Development).
      - S’assure que chaque nouveau code est motivé par un ou plusieurs tests E2E précédemment définis.
      - Respecte les conventions de nommage, les règles de validation, et la documentation technique.

   5. **Agent d’Intégration/CI**  
      - Exécute automatiquement l’ensemble des tests (E2E, unitaires, d’intégration) après chaque livraison de code.
      - Vérifie que la couverture de code reste supérieure à 80% et qu’aucun test ne faille.
      - Si des tests échouent ou si la couverture est insuffisante : identifie les causes et corrige le code ou les tests pour garantir le passage et la qualité.
      - Génère et conserve les rapports de test et de couverture pour traçabilité.

**Conseils d’organisation supplémentaires :**
- Chaque agent doit consigner ses actions et décisions dans des fichiers horodatés pour assurer la traçabilité.
- La communication entre agents peut se faire à travers un journal d’équipe (`team-log.md`) pour garder l’historique des échanges et arbitrages.
- Préciser les canaux et formats d’échanges pour fluidifier la collaboration inter-agents (fichiers Markdown, conventions de nom de fichier, etc).
- Prévoir des revues régulières des processus pour identifier des axes d’amélioration continue de la chaîne de développement.

