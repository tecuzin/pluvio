# Déploiement avec Docker et Minikube

Ce projet est configuré pour fonctionner entièrement dans des containers Docker, avec support pour Minikube (Kubernetes local).

## Prérequis

- **Docker** OU **HyperKit** OU **VirtualBox** OU **QEMU** : Au moins un driver pour Minikube
- **Minikube** : Pour le déploiement Kubernetes (optionnel mais recommandé)
- **kubectl** : Pour interagir avec Kubernetes (installé avec Minikube)

> ⚠️ **Si Docker n'est pas installé**, voir [README-INSTALL.md](README-INSTALL.md) pour les options d'installation.

### Installation de Minikube

**macOS:**
```bash
brew install minikube
```

**Linux:**
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

**Windows:**
```bash
# Via Chocolatey
choco install minikube
```

## Déploiement avec Minikube (Recommandé)

### 1. Configuration initiale (Production)

```bash
make minikube-setup
```

Cette commande :
- Démarre Minikube si nécessaire
- Configure Docker pour utiliser le daemon de Minikube
- Construit les images Docker
- Déploie l'application dans Kubernetes
- Configure le service LoadBalancer

**Accéder à l'application:**
```bash
minikube service pluvio-service
```

### 2. Mode Développement

```bash
make minikube-dev
```

Cette commande :
- Déploie l'application en mode développement avec hot-reload
- Configure le service NodePort
- Affiche l'URL d'accès

**Accéder à l'application:**
L'URL sera affichée à la fin du script, ou :
```bash
NODE_PORT=$(kubectl get service pluvio-dev-service -o jsonpath='{.spec.ports[0].nodePort}')
MINIKUBE_IP=$(minikube ip)
echo "http://${MINIKUBE_IP}:${NODE_PORT}"
```

### 3. Nettoyage

```bash
make minikube-clean
```

## Déploiement avec Docker Compose

### Développement

```bash
make docker-compose-up
```

L'application sera accessible sur `http://localhost:3000`

### Arrêter

```bash
make docker-compose-down
```

## Déploiement avec Docker seul

### Construire les images

```bash
make docker-build
```

### Lancer en production

```bash
make docker-run
```

L'application sera accessible sur `http://localhost:8080`

### Arrêter

```bash
docker stop pluvio
docker rm pluvio
```

## Commandes utiles

### Minikube

```bash
# Voir le statut
minikube status

# Voir les services
minikube service list

# Accéder au dashboard
minikube dashboard

# Arrêter Minikube
minikube stop

# Supprimer Minikube
minikube delete
```

### Kubernetes

```bash
# Voir les pods
kubectl get pods

# Voir les services
kubectl get services

# Voir les logs
kubectl logs -f deployment/pluvio

# Redémarrer un déploiement
kubectl rollout restart deployment/pluvio

# Supprimer un déploiement
kubectl delete deployment pluvio
```

### Docker

```bash
# Voir les images
docker images

# Voir les containers
docker ps -a

# Voir les logs
docker logs pluvio-dev

# Entrer dans un container
docker exec -it pluvio-dev sh
```

## Structure des fichiers

```
pluvio/
├── Dockerfile              # Image de production
├── Dockerfile.dev          # Image de développement
├── docker-compose.yml      # Configuration Docker Compose
├── nginx.conf              # Configuration Nginx
├── k8s/
│   ├── deployment.yaml     # Déploiement Kubernetes (production)
│   └── deployment-dev.yaml # Déploiement Kubernetes (dev)
└── scripts/
    ├── minikube-setup.sh   # Script de configuration Minikube
    ├── minikube-dev.sh     # Script de développement Minikube
    └── minikube-clean.sh   # Script de nettoyage
```

## Notes importantes

1. **Minikube et Docker** : Quand vous utilisez Minikube, Docker doit pointer vers le daemon de Minikube. Le script configure cela automatiquement avec `eval $(minikube docker-env)`.

2. **Images locales** : Les manifests Kubernetes utilisent `imagePullPolicy: Never` pour utiliser les images construites localement dans Minikube.

3. **Persistance** : Les données SQLite sont stockées dans le localStorage du navigateur, donc elles persistent même après redémarrage des containers.

4. **Hot-reload** : En mode développement avec Minikube, les modifications de code nécessitent un redémarrage du pod :
   ```bash
   kubectl rollout restart deployment/pluvio-dev
   ```

5. **Ports** :
   - Production : 80 (container) → 80 (service)
   - Développement : 3000 (container) → NodePort (Kubernetes)

## Dépannage

### Minikube ne démarre pas

```bash
minikube delete
minikube start --driver=docker --memory=4096 --cpus=2
```

### Les images ne sont pas trouvées

Assurez-vous que Docker pointe vers Minikube :
```bash
eval $(minikube docker-env)
docker images
```

### Les pods ne démarrent pas

Vérifiez les logs :
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```
