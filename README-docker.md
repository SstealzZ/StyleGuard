# Configuration Docker pour StyleGuard

Ce document explique comment configurer et exécuter l'application StyleGuard avec Docker.

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git pour cloner le dépôt
- Instance Ollama existante accessible à l'adresse http://192.168.1.73:11434

## Configuration initiale

1. Clonez le dépôt et accédez au répertoire du projet:

```bash
git clone https://github.com/your-username/StyleGuard.git
cd StyleGuard
```

2. Créez un fichier `.env` à partir de l'exemple:

```bash
cp .env.example .env
```

3. Modifiez les variables d'environnement dans le fichier `.env` selon vos besoins:
   - `SECRET_KEY`: Générez une clé secrète forte
   - `MODEL_NAME`: Vérifiez que le modèle spécifié est disponible sur votre instance Ollama
   - `API_PORT`, `FRONTEND_PORT`: Personnalisez les ports selon vos besoins

## Prérequis pour Ollama

Cette configuration utilise une instance Ollama existante sur le réseau. Assurez-vous que:

1. Votre instance Ollama est accessible à l'adresse http://192.168.1.73:11434
2. Le modèle spécifié dans la variable `MODEL_NAME` est déjà téléchargé sur cette instance
3. L'API d'Ollama est accessible depuis les containers Docker (réseau autorisé)

## Lancement de l'application

Pour démarrer l'application (API + Frontend):

```bash
docker-compose up -d
```

Pour arrêter l'application:

```bash
docker-compose down
```

## Accès à l'application

Par défaut, avec les ports personnalisés:
- Frontend: http://localhost:9081
- API: http://localhost:9080
- Documentation API: http://localhost:9080/docs
- Ollama API: http://192.168.1.73:11434/api (instance externe)

Vous pouvez modifier les ports du frontend et de l'API dans le fichier `.env` selon vos besoins.

## Gestion des conteneurs

Voir les logs:

```bash
# Pour tous les services
docker-compose logs -f

# Pour un service spécifique
docker-compose logs -f api
docker-compose logs -f front
```

Redémarrer un service:

```bash
docker-compose restart api
docker-compose restart front
```

## Développement

Pour reconstruire les images après modifications:

```bash
docker-compose up -d --build
``` 