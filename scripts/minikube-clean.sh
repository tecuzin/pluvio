#!/bin/bash

set -e

echo "🧹 Nettoyage de l'environnement Minikube"

# Supprimer les déploiements
echo "🗑️  Suppression des déploiements..."
kubectl delete -f k8s/deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/deployment-dev.yaml --ignore-not-found=true

# Supprimer les services
echo "🗑️  Suppression des services..."
kubectl delete service pluvio-service --ignore-not-found=true
kubectl delete service pluvio-dev-service --ignore-not-found=true

echo "✅ Nettoyage terminé"
echo ""
echo "💡 Pour arrêter Minikube complètement:"
echo "   minikube stop"
echo "   ou"
echo "   minikube delete"
