#!/bin/bash

set -e

echo "🚀 Configuration de Minikube pour Pluvio"

# Vérifier si Minikube est installé
if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube n'est pas installé"
    echo "📦 Installation de Minikube..."
    echo "   macOS: brew install minikube"
    echo "   Linux: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Détecter le driver disponible
DRIVER=""
if command -v docker &> /dev/null; then
    DRIVER="docker"
    echo "✅ Docker trouvé, utilisation du driver docker"
elif command -v hyperkit &> /dev/null; then
    DRIVER="hyperkit"
    echo "✅ HyperKit trouvé, utilisation du driver hyperkit"
elif command -v virtualbox &> /dev/null; then
    DRIVER="virtualbox"
    echo "✅ VirtualBox trouvé, utilisation du driver virtualbox"
elif command -v qemu-system-x86_64 &> /dev/null || command -v qemu-system-aarch64 &> /dev/null; then
    DRIVER="qemu"
    echo "✅ QEMU trouvé, utilisation du driver qemu"
else
    echo "❌ Aucun driver compatible trouvé"
    echo ""
    echo "📦 Options d'installation:"
    echo "   1. Docker Desktop: https://www.docker.com/products/docker-desktop"
    echo "   2. HyperKit (macOS): brew install hyperkit"
    echo "   3. VirtualBox: https://www.virtualbox.org/"
    echo "   4. QEMU: brew install qemu"
    echo ""
    echo "💡 Ou utilisez Docker Compose directement: make docker-compose-up"
    exit 1
fi

# Démarrer Minikube si ce n'est pas déjà fait
if ! minikube status &> /dev/null; then
    echo "🔄 Démarrage de Minikube avec le driver $DRIVER..."
    # Utiliser moins de mémoire pour compatibilité avec Colima par défaut
    minikube start --driver=$DRIVER --memory=2048 --cpus=2
else
    echo "✅ Minikube est déjà démarré"
    CURRENT_DRIVER=$(minikube config get driver 2>/dev/null || echo "")
    if [ "$CURRENT_DRIVER" != "$DRIVER" ]; then
        echo "⚠️  Le driver actuel ($CURRENT_DRIVER) diffère du driver détecté ($DRIVER)"
    fi
fi

# Configurer Docker pour utiliser le daemon de Minikube (si docker est disponible)
if [ "$DRIVER" = "docker" ] && command -v docker &> /dev/null; then
    echo "🐳 Configuration de Docker pour Minikube..."
    eval $(minikube docker-env)
else
    echo "ℹ️  Utilisation du driver $DRIVER (pas de configuration docker-env nécessaire)"
fi

# Construire les images Docker dans Minikube
echo "🔨 Construction des images Docker dans Minikube..."

# Utiliser le daemon Docker de Minikube pour construire les images
if [ "$DRIVER" = "docker" ] && command -v docker &> /dev/null; then
    # Docker est disponible, utiliser directement
    docker build -t pluvio:latest -f Dockerfile .
    docker build -t pluvio-dev:latest -f Dockerfile.dev .
else
    # Utiliser minikube image build (fonctionne avec tous les drivers)
    echo "   Utilisation de minikube image build..."
    minikube image build -t pluvio:latest -f Dockerfile .
    minikube image build -t pluvio-dev:latest -f Dockerfile.dev .
fi

echo "✅ Images Docker construites"

# Appliquer les manifests Kubernetes
echo "📦 Déploiement dans Kubernetes..."
kubectl apply -f k8s/deployment.yaml

# Attendre que les pods soient prêts
echo "⏳ Attente du déploiement..."
kubectl wait --for=condition=available --timeout=300s deployment/pluvio

# Obtenir l'URL du service
echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🌐 Pour accéder à l'application:"
echo "   minikube service pluvio-service"
echo ""
echo "📊 Pour voir les logs:"
echo "   kubectl logs -f deployment/pluvio"
echo ""
