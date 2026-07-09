# Guide de démarrage (Collaborateur)

Ce guide explique les étapes simples pour lancer le projet (Frontend et Backend) sur votre machine.

---

## 📋 Prérequis

Avoir installé sur votre machine :
1. **Node.js** (version 18 ou supérieure recommandée)
2. **MySQL / MariaDB** (via XAMPP, WampServer ou MySQL Workbench)

---

## 🗄️ Étape 1 : Préparation de la Base de Données

Vous pouvez importer la base de données de deux manières :

### Option A : Importer le fichier SQL (Recommandé)
1. Démarrez MySQL (via le panneau de contrôle XAMPP par exemple).
2. Allez sur **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Créez une nouvelle base de données nommée **`ecole_db`**.
4. Sélectionnez la base de données `ecole_db`, cliquez sur l'onglet **Importer**, choisissez le fichier `.sql` exporté qui se trouve à la racine ou sur GitHub, puis validez.

### Option B : Utiliser les Migrations & Seeds Sequelize
Si vous n'avez pas de fichier SQL sous la main, vous pouvez générer et peupler la base de données via la ligne de commande :
1. Ouvrez un terminal dans le dossier `Node-Backend`.
2. Créez la base de données vide `ecole_db` dans phpMyAdmin.
3. Exécutez :
   ```bash
   npm run db:migrate
   npm run db:seed
   node src/utils/seedParentAccounts.js
   ```

---

## 🚀 Étape 2 : Lancer le Backend (`Node-Backend`)

Le serveur backend tourne sur le port `3000`.

1. Ouvrez un terminal dans le dossier **`Node-Backend`**.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Assurez-vous que votre fichier `.env` à la racine contient les bonnes informations de connexion MySQL (exemples) :
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=ecole_db
   JWT_SECRET=dev_secret
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

---

## 💻 Étape 3 : Lancer le Frontend (`Projet-de-BD`)

Le site web frontend tourne sur le port `5173`.

1. Ouvrez un **nouveau** terminal dans le dossier **`Projet-de-BD`**.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrez votre navigateur sur **`http://localhost:5173`**.

---

## 🔐 Identifiants de connexion par défaut (MySQL)

Une fois les serveurs lancés, vous pouvez utiliser ces comptes pour tester :

* **Administrateur / Directeur :**
  * **Email :** `admin@ecole.cm`
  * **Mot de passe :** `root`
* **Parent d'élève (ex: Gabriel Mbom) :**
  * **Email :** `gabriel.mbom@parent.ecole.cm`
  * **Mot de passe :** `1234`
