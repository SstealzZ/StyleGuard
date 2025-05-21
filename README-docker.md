# Configuration Docker pour StyleGuard

Ce document explique comment configurer et exécuter l'application StyleGuard avec Docker.

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git pour cloner le dépôt
- (Optionnel) GPU compatible NVIDIA avec drivers installés pour accélérer Ollama

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
   - `MODEL_NAME`: Choisissez le modèle Ollama à utiliser

## Préparation d'Ollama

Le service Ollama sera automatiquement téléchargé et lancé via Docker. Lors du premier démarrage, vous devrez télécharger le modèle spécifié:

```bash
# Une fois les conteneurs démarrés
docker exec -it styleguard-ollama ollama pull gemma3:1b
```

Remplacez `gemma3:1b` par le modèle que vous avez spécifié dans la variable `MODEL_NAME`.

## Lancement de l'application

Pour démarrer l'application complète (API + Frontend + Ollama):

```bash
docker-compose up -d
```

Pour arrêter l'application:

```bash
docker-compose down
```

## Accès à l'application

- Frontend: http://localhost:80
- API: http://localhost:8000
- Documentation API: http://localhost:8000/docs
- Ollama API: http://localhost:11434/api

## Gestion des conteneurs

Voir les logs:

```bash
# Pour tous les services
docker-compose logs -f

# Pour un service spécifique
docker-compose logs -f api
docker-compose logs -f front
docker-compose logs -f ollama
```

Redémarrer un service:

```bash
docker-compose restart api
docker-compose restart front
docker-compose restart ollama
```

## Développement

Pour reconstruire les images après modifications:

```bash
docker-compose up -d --build
```

## Configuration GPU (Optionnel)

Si vous disposez d'un GPU NVIDIA, le service Ollama est déjà configuré pour l'utiliser. Assurez-vous simplement que:

1. Les drivers NVIDIA sont installés sur votre machine hôte
2. Le NVIDIA Container Toolkit est installé (nvidia-docker)

Pour vérifier que le GPU est bien détecté:

```bash
docker exec -it styleguard-ollama nvidia-smi
``` 