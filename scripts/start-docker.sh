#!/bin/bash

set -e

echo "🐳 Démarrage de Docker..."

# Vérifier si Docker Desktop est installé
if [ -d "/Applications/Docker.app" ]; then
    echo "✅ Docker Desktop trouvé"
    echo "🚀 Démarrage de Docker Desktop..."
    open -a Docker
    
    echo "⏳ Attente que Docker démarre (cela peut prendre 30-60 secondes)..."
    
    # Attendre que Docker soit prêt
    MAX_WAIT=120
    ELAPSED=0
    while [ $ELAPSED -lt $MAX_WAIT ]; do
        if docker ps &> /dev/null; then
            echo "✅ Docker est prêt!"
            docker ps
            exit 0
        fi
        sleep 2
        ELAPSED=$((ELAPSED + 2))
        echo -n "."
    done
    
    echo ""
    echo "⚠️  Docker n'a pas démarré dans le délai imparti"
    echo "💡 Vérifiez manuellement que Docker Desktop est démarré"
    exit 1
fi

# Sinon, essayer Colima
if command -v colima &> /dev/null; then
    echo "✅ Colima trouvé"
    echo "🚀 Démarrage de Colima..."
    
    # Nettoyer les instances problématiques
    colima stop 2>/dev/null || true
    
    # Essayer de démarrer
    if colima start; then
        echo "✅ Colima est prêt!"
        docker ps
        exit 0
    else
        echo "❌ Colima n'a pas pu démarrer"
        echo "💡 Essayez de redémarrer votre machine ou installez Docker Desktop"
        exit 1
    fi
fi

echo "❌ Aucun Docker trouvé"
echo "💡 Installez Docker Desktop ou Colima"
exit 1
