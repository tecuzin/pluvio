#!/bin/bash

set -e

echo "🚀 Démarrage de l'environnement de développement avec Minikube"

# Vérifier si Minikube est installé
if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube n'est pas installé"
    exit 1
fi

# Détecter le driver disponible
DRIVER=""
if command -v docker &> /dev/null; then
    DRIVER="docker"
elif command -v hyperkit &> /dev/null; then
    DRIVER="hyperkit"
elif command -v virtualbox &> /dev/null; then
    DRIVER="virtualbox"
elif command -v qemu-system-x86_64 &> /dev/null || command -v qemu-system-aarch64 &> /dev/null; then
    DRIVER="qemu"
else
    echo "❌ Aucun driver compatible trouvé"
    echo "💡 Installez Docker, HyperKit, VirtualBox ou QEMU"
    exit 1
fi

# Démarrer Minikube si nécessaire
if ! minikube status &> /dev/null; then
    echo "🔄 Démarrage de Minikube avec le driver $DRIVER..."
    # Utiliser moins de mémoire pour compatibilité avec Colima par défaut
    minikube start --driver=$DRIVER --memory=2048 --cpus=2
fi

# Configurer Docker pour utiliser le daemon de Minikube (si docker est disponible)
if [ "$DRIVER" = "docker" ] && command -v docker &> /dev/null; then
    echo "🐳 Configuration de Docker pour Minikube..."
    eval $(minikube docker-env)
else
    echo "ℹ️  Utilisation du driver $DRIVER"
fi

# Construire l'image de développement dans Minikube
echo "🔨 Construction de l'image de développement..."

if [ "$DRIVER" = "docker" ] && command -v docker &> /dev/null; then
    docker build -t pluvio-dev:latest -f Dockerfile.dev .
else
    minikube image build -t pluvio-dev:latest -f Dockerfile.dev .
fi

# Appliquer le déploiement de développement
echo "📦 Déploiement en mode développement..."
kubectl apply -f k8s/deployment-dev.yaml

# Attendre que le pod soit prêt
echo "⏳ Attente du déploiement..."
kubectl wait --for=condition=available --timeout=300s deployment/pluvio-dev || true

# Obtenir l'URL
echo ""
echo "✅ Environnement de développement prêt!"
echo ""
echo "🌐 Pour accéder à l'application:"
NODE_PORT=$(kubectl get service pluvio-dev-service -o jsonpath='{.spec.ports[0].nodePort}')
MINIKUBE_IP=$(minikube ip)
echo "   http://${MINIKUBE_IP}:${NODE_PORT}"
echo ""
echo "📊 Pour voir les logs:"
echo "   kubectl logs -f deployment/pluvio-dev"
echo ""
echo "🔄 Pour redémarrer après modifications:"
echo "   kubectl rollout restart deployment/pluvio-dev"
echo ""
