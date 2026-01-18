#!/bin/bash

set -e

echo "🐳 Installation de Docker pour macOS"

# Vérifier si on est sur macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Ce script est pour macOS uniquement"
    exit 1
fi

# Vérifier si Homebrew est installé
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew n'est pas installé"
    echo "📦 Installation de Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo "📦 Options d'installation Docker:"
echo ""
echo "1. Docker Desktop (recommandé - interface graphique)"
echo "   brew install --cask docker"
echo ""
echo "2. Colima (léger, alternative à Docker Desktop)"
echo "   brew install colima docker docker-compose"
echo ""
echo "3. HyperKit (pour Minikube sans Docker)"
echo "   brew install hyperkit"
echo ""

read -p "Choisissez une option (1/2/3) ou 'q' pour quitter: " choice

case $choice in
    1)
        echo "📦 Installation de Docker Desktop..."
        brew install --cask docker
        echo "✅ Docker Desktop installé"
        echo "🚀 Démarrez Docker Desktop depuis Applications"
        echo "💡 Après démarrage, exécutez: make minikube-setup"
        ;;
    2)
        echo "📦 Installation de Colima..."
        brew install colima docker docker-compose
        echo "✅ Colima installé"
        echo "🚀 Démarrage de Colima..."
        colima start
        echo "✅ Colima démarré"
        echo "💡 Vous pouvez maintenant exécuter: make minikube-setup"
        ;;
    3)
        echo "📦 Installation de HyperKit..."
        brew install hyperkit
        echo "✅ HyperKit installé"
        echo "💡 Vous pouvez maintenant exécuter: make minikube-setup"
        ;;
    q|Q)
        echo "❌ Installation annulée"
        exit 0
        ;;
    *)
        echo "❌ Option invalide"
        exit 1
        ;;
esac
