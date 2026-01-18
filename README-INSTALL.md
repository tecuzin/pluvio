# Guide d'Installation

## Problème : Docker non trouvé

Si vous obtenez l'erreur `PROVIDER_DOCKER_NOT_FOUND`, cela signifie que Docker n'est pas installé ou n'est pas dans votre PATH.

## Solutions

### Option 1 : Installer Docker Desktop (Recommandé)

**macOS:**
```bash
# Via Homebrew
brew install --cask docker

# Ou télécharger depuis: https://www.docker.com/products/docker-desktop
```

**Après installation:**
1. Lancez Docker Desktop depuis Applications
2. Attendez que Docker soit démarré (icône Docker dans la barre de menu)
3. Exécutez: `make minikube-setup`

### Option 2 : Installer Colima (Léger, alternative à Docker Desktop)

Colima est une alternative légère à Docker Desktop qui fonctionne bien avec Minikube.

```bash
brew install colima docker docker-compose
colima start
```

Puis:
```bash
make minikube-setup
```

### Option 3 : Utiliser HyperKit (sans Docker)

Si vous ne voulez pas installer Docker, vous pouvez utiliser HyperKit directement avec Minikube.

```bash
# Installer HyperKit
brew install hyperkit

# Minikube utilisera automatiquement HyperKit
make minikube-setup
```

### Option 4 : Utiliser VirtualBox

```bash
# Installer VirtualBox
brew install --cask virtualbox

# Minikube utilisera VirtualBox
make minikube-setup
```

### Option 5 : Script d'installation automatique (macOS)

```bash
make install-docker
```

Ce script vous guidera à travers l'installation.

## Vérification

Après installation, vérifiez que Docker fonctionne:

```bash
docker --version
docker ps
```

## Utilisation sans Docker

Si vous ne voulez pas installer Docker, vous pouvez utiliser Docker Compose avec Colima, ou utiliser directement les images pré-construites si disponibles.

## Dépannage

### Docker Desktop ne démarre pas

```bash
# Vérifier les permissions
sudo chown -R $(whoami) ~/.docker

# Redémarrer Docker Desktop
```

### Colima ne démarre pas

```bash
# Vérifier l'état
colima status

# Redémarrer
colima stop
colima start
```

### Minikube ne trouve pas le driver

```bash
# Lister les drivers disponibles
minikube config list

# Forcer un driver spécifique
minikube start --driver=hyperkit
# ou
minikube start --driver=virtualbox
```

## Prochaines étapes

Une fois Docker ou un driver alternatif installé:

```bash
make minikube-setup
```
