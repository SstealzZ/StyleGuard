# Configuration Docker pour StyleGuard

Ce document explique comment configurer et exécuter l'application StyleGuard avec Docker.

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git pour cloner le dépôt

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

3. Modifiez les variables d'environnement dans le fichier `.env` selon vos besoins

## Lancement de l'application

Pour démarrer l'application complète (API + Frontend):

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