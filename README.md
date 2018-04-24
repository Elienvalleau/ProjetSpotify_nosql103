# Projet Spotiroom
*Elien Valleau, Jules Persch, Pierre Bourges, Benoit Estival, Thomas Baudou*

## Resumé du projet:

Application web d'écoute de musique en groupe via l'application spotify des utilisateurs

### Idées fonctionnalités

0. Profil utilisateur
0. Salles d'écoute
0. Niveaux de privilèges (salles et site)
0. Gestion de l'appareil qui utilise spotify pour l'écoute
0. Chat de salle
0. Interface player
0. Gestion de liste d'attente des musiques
0. Listes de salles
0. Choix automatique des musiques en fonction des utilisateurs
0. Proposition de salles
0. Ineraction des utilisateurs dans une salle (proposition, vote, like)
0. Créer une playlist avec les titres like de l'utilisateur 

### Taches

* Système d'inscription connexion en utilisant le compte Spotify de l'utilisateur
* Schema de la base de donnée:
    * Utilisateurs
    * Salles
    * Musiques
* Faire les interfaces:
    * Inscription / Connexion
    * Main:
        * Choix d'une salle
    * Salle:
        * Player
        * Liste des utilisateurs
        * Historique des commandes
        * File d'attente des musiques
* Faire les controlleurs:
    * Inscription / Connexion
    * Main:
        * Choix d'une salle
    * Salle:
        * Player
        * Liste des utilisateurs
        * Historique des commandes
        * File d'attente des musiques
* Associer les appels api aux fonctionnalités
* Gestion des privilèges (page admin)
* Gestion de l'appareil qui utilise spotify (recherche des appareils dispo, mise en cache de l'apareil utilisé (idApareil))
* Faire un chat
* Bouton 'mettre les 5 musiques les plus écouté de chaque utilisateur'