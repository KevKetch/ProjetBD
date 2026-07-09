-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 08:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecole_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `ID` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `actif` tinyint(4) NOT NULL DEFAULT 1,
  `typeAdmin` smallint(6) NOT NULL COMMENT '1=superadmin,2=directeur,3=admin,4=enseignant,5=parent',
  `mobile` varchar(15) DEFAULT NULL,
  `alanyaID` varchar(15) DEFAULT NULL,
  `idPers` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ID`, `nom`, `username`, `password`, `actif`, `typeAdmin`, `mobile`, `alanyaID`, `idPers`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@ecole.cm', '$2a$10$6PbgBvvyWSTarvh4QzkdEezQQ5aBR/Zv/pBag4oEcOKXmWnxzjuVS', 1, 3, '600000001', NULL, NULL, '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(6, 'Jean Abena', 'jean.abena@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 5, '677112233', NULL, 3, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(7, 'Pierre Bella', 'pierre.bella@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 5, '677445566', NULL, 5, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(8, 'Fatoumata Camara', 'fatoumata.camara@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 5, '699223344', NULL, 7, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(9, 'Charles Dongmo', 'charles.dongmo@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 5, '655667788', NULL, 9, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(10, 'Samuel Sr Eto\'o', 'samuel.etoo@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 5, '699009900', NULL, 11, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(11, 'Tchamba Rose', 'directeur@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 2, '677001122', NULL, 13, '2026-07-09 16:44:33', '2026-07-09 16:44:33'),
(12, 'Kamga Emmanuel', 'fondateur@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 1, '699887766', NULL, 14, '2026-07-09 16:44:33', '2026-07-09 16:44:33'),
(13, 'Nkomo Albert', 'enseignant@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 4, '655443322', NULL, 15, '2026-07-09 16:44:33', '2026-07-09 16:44:33'),
(14, 'Ebongue Marie', 'parent@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 1, 5, '676543210', NULL, 16, '2026-07-09 16:44:33', '2026-07-09 16:44:33');

-- --------------------------------------------------------

--
-- Table structure for table `annee_academique`
--

CREATE TABLE `annee_academique` (
  `idAnnee` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `periode` varchar(100) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banque_epreuves`
--

CREATE TABLE `banque_epreuves` (
  `id` int(11) NOT NULL,
  `titre` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `idMatiere` int(11) NOT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bulletin`
--

CREATE TABLE `bulletin` (
  `idBulletin` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `idSequence` int(11) NOT NULL,
  `moyenne_generale` float DEFAULT NULL,
  `rang` smallint(6) DEFAULT NULL,
  `effectif_classe` smallint(6) DEFAULT NULL,
  `appreciation` text DEFAULT NULL,
  `conduite` varchar(40) DEFAULT NULL,
  `soin` varchar(40) DEFAULT NULL,
  `ponctualite` varchar(40) DEFAULT NULL,
  `absences` smallint(6) DEFAULT 0,
  `retards` smallint(6) DEFAULT 0,
  `date_conseil` date DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `est_publie` tinyint(1) DEFAULT 0,
  `date_publication` datetime DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bulletin_ligne`
--

CREATE TABLE `bulletin_ligne` (
  `id` int(11) NOT NULL,
  `idBulletin` int(11) NOT NULL,
  `idMatiere` int(11) NOT NULL,
  `note` float DEFAULT NULL,
  `coefficient` float DEFAULT 1,
  `appreciation` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classe`
--

CREATE TABLE `classe` (
  `idClasse` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `niveau` enum('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') NOT NULL,
  `section` enum('francophone','anglophone','bilingue') DEFAULT 'francophone',
  `idCycle` int(11) DEFAULT NULL,
  `idSalle` int(11) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classe`
--

INSERT INTO `classe` (`idClasse`, `libelle`, `niveau`, `section`, `idCycle`, `idSalle`, `idAdmin`, `created_at`, `updated_at`) VALUES
(6, 'SIL A', 'PS', 'francophone', 1, NULL, 1, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(7, 'CP B', 'PS', 'francophone', 1, NULL, 1, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(8, 'CE1 C', 'PS', 'francophone', 1, NULL, 1, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(9, 'CE2 D', 'PS', 'francophone', 1, NULL, 1, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(10, 'CM1 E', 'PS', 'francophone', 1, NULL, 1, '2026-07-09 16:44:32', '2026-07-09 16:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `id` int(11) NOT NULL,
  `cle` varchar(100) NOT NULL,
  `valeur` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `cle`, `valeur`, `description`, `created_at`, `updated_at`) VALUES
(1, 'ecole_nom', 'École Les Étoiles', 'Nom de l\'école', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(2, 'ecole_ville', 'Yaoundé', 'Ville de l\'école', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(3, 'ecole_email', 'contact@lesetoiles.cm', 'Email de contact', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(4, 'ecole_telephone', '+237 677 000 000', 'Téléphone de contact', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(5, 'annee_courante', '2025-2026', 'Année scolaire en cours', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(6, 'frais_inscription', '25000', 'Frais d\'inscription par défaut', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(7, 'frais_scolarite', '120000', 'Frais de scolarité annuel par défaut', '2026-07-09 16:35:12', '2026-07-09 16:35:12'),
(8, 'frais_transport', '15000', 'Frais de transport annuel par défaut', '2026-07-09 16:35:12', '2026-07-09 16:35:12');

-- --------------------------------------------------------

--
-- Table structure for table `cycle`
--

CREATE TABLE `cycle` (
  `idCycle` int(11) NOT NULL,
  `libelle` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cycle`
--

INSERT INTO `cycle` (`idCycle`, `libelle`) VALUES
(1, 'Cycle Francophone'),
(2, 'Cycle Anglophone'),
(3, 'Cycle Bilingue');

-- --------------------------------------------------------

--
-- Table structure for table `echeancier`
--

CREATE TABLE `echeancier` (
  `idEcheancier` int(11) NOT NULL,
  `libelle` varchar(60) NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `date_echeance` date DEFAULT NULL,
  `ordre` tinyint(4) DEFAULT 1,
  `idFrais` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `niveau` enum('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eleve`
--

CREATE TABLE `eleve` (
  `matricule` int(11) NOT NULL,
  `nom` varchar(60) NOT NULL,
  `prenom` varchar(60) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `lieuNaissance` varchar(30) DEFAULT NULL,
  `sexe` char(1) DEFAULT NULL COMMENT 'M/F',
  `photoURL` varchar(255) DEFAULT NULL,
  `idClasse` int(11) DEFAULT NULL,
  `idVilleNaissance` int(11) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `idPers` int(11) DEFAULT NULL,
  `actif` tinyint(4) DEFAULT 1,
  `statut` enum('actif','inactif','transfere','diplome','radie') DEFAULT 'actif',
  `date_inscription` date DEFAULT NULL,
  `niveau` enum('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `eleve`
--

INSERT INTO `eleve` (`matricule`, `nom`, `prenom`, `dateNaissance`, `lieuNaissance`, `sexe`, `photoURL`, `idClasse`, `idVilleNaissance`, `idAdmin`, `idPers`, `actif`, `statut`, `date_inscription`, `niveau`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Abena', 'Marc', '2015-05-15', 'Yaoundé', '1', NULL, 6, 1, 1, 2, 1, 'actif', NULL, 'SIL', '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(2, 'Bella', 'Marie', '2015-05-15', 'Yaoundé', '2', NULL, 7, 1, 1, 4, 1, 'actif', NULL, 'CP', '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(3, 'Camara', 'Ousmane', '2015-05-15', 'Yaoundé', '1', NULL, 8, 1, 1, 6, 1, 'actif', NULL, 'CE1', '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(4, 'Dongmo', 'Arthur', '2015-05-15', 'Yaoundé', '1', NULL, 9, 1, 1, 8, 1, 'actif', NULL, 'CE2', '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(5, 'Eto\'o', 'Samuel Jr', '2015-05-15', 'Yaoundé', '1', NULL, 10, 1, 1, 10, 1, 'actif', NULL, 'CM1', '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `emploi_du_temps`
--

CREATE TABLE `emploi_du_temps` (
  `id` int(11) NOT NULL,
  `jour` enum('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi') NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `idClasse` int(11) NOT NULL,
  `idMatiere` int(11) NOT NULL,
  `idEnseignant` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enseignant`
--

CREATE TABLE `enseignant` (
  `idEnseignant` int(11) NOT NULL,
  `idPers` int(11) NOT NULL,
  `matricule` varchar(30) NOT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `date_embauche` date DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `actif` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enseigner`
--

CREATE TABLE `enseigner` (
  `id` int(11) NOT NULL,
  `idEnseignant` int(11) NOT NULL,
  `idClasse` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `is_principal` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enseigner_matiere`
--

CREATE TABLE `enseigner_matiere` (
  `id` int(11) NOT NULL,
  `idEnseignant` int(11) NOT NULL,
  `idMatiere` int(11) NOT NULL,
  `idClasse` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `coefficient` float DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `epreuve`
--

CREATE TABLE `epreuve` (
  `idEpreuve` int(11) NOT NULL,
  `titre` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `duree_minutes` smallint(6) DEFAULT NULL,
  `coefficient` float DEFAULT 1,
  `total_points` decimal(5,2) DEFAULT 20.00,
  `date_epreuve` date DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `date_publication` datetime DEFAULT NULL,
  `fichier_sujet` varchar(255) DEFAULT NULL,
  `fichier_correction` varchar(255) DEFAULT NULL,
  `idNature` int(11) NOT NULL,
  `idMatiere` int(11) NOT NULL,
  `idClasse` int(11) NOT NULL,
  `idEnseignant` int(11) NOT NULL,
  `idTrimestre` int(11) NOT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `epreuve_note`
--

CREATE TABLE `epreuve_note` (
  `id` int(11) NOT NULL,
  `note` decimal(5,2) DEFAULT NULL,
  `appreciation` varchar(255) DEFAULT NULL,
  `idEpreuve` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `frais`
--

CREATE TABLE `frais` (
  `idFrais` int(11) NOT NULL,
  `code` varchar(30) NOT NULL,
  `libelle` varchar(80) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `frais`
--

INSERT INTO `frais` (`idFrais`, `code`, `libelle`, `description`, `created_at`, `updated_at`) VALUES
(1, 'INSCRIPTION', 'Frais d\'inscription', 'Frais d\'inscription annuelle', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(2, 'SCOLARITE', 'Scolarité', 'Frais de scolarité', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(3, 'TRANSPORT', 'Transport', 'Frais de transport scolaire', '2026-07-09 16:35:11', '2026-07-09 16:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `frequente`
--

CREATE TABLE `frequente` (
  `matricule` int(11) NOT NULL,
  `idClasse` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incident`
--

CREATE TABLE `incident` (
  `id` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `gravite` int(11) DEFAULT 0 COMMENT '1-5',
  `matricule` int(11) NOT NULL,
  `idTypeIncident` int(11) NOT NULL,
  `idEnseignant` int(11) NOT NULL,
  `idAnnee` int(11) DEFAULT NULL,
  `date_incident` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_actions`
--

CREATE TABLE `log_actions` (
  `id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` varchar(50) DEFAULT NULL,
  `ancienne_valeur` text DEFAULT NULL,
  `nouvelle_valeur` text DEFAULT NULL,
  `ip_adresse` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matiere`
--

CREATE TABLE `matiere` (
  `idMatiere` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `coefficient` float DEFAULT 1,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matiere_classe`
--

CREATE TABLE `matiere_classe` (
  `matiere_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  `coefficient` float DEFAULT 1,
  `enseignant_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `sujet` varchar(255) DEFAULT NULL,
  `corps` text NOT NULL,
  `type` enum('general','urgence','reclamation') DEFAULT 'general',
  `lu` tinyint(1) DEFAULT 0,
  `date_envoi` datetime DEFAULT current_timestamp(),
  `date_lecture` datetime DEFAULT NULL,
  `idExpediteur` int(11) NOT NULL,
  `idDestinataire` int(11) NOT NULL,
  `idParent` int(11) DEFAULT NULL,
  `reponse_a_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nature_epreuve`
--

CREATE TABLE `nature_epreuve` (
  `idNature` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `coefficient` float DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nature_epreuve`
--

INSERT INTO `nature_epreuve` (`idNature`, `code`, `libelle`, `description`, `coefficient`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'DEVOIR', 'Devoir', 'Devoir surveillé ou à la maison', 1, 1, '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(2, 'INTERRO', 'Interrogation', 'Interrogation écrite ou orale', 0.5, 1, '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(3, 'EXAMEN', 'Examen', 'Examen de fin de trimestre', 2, 1, '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(4, 'COMPO', 'Composition', 'Composition de fin d\'année', 3, 1, '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(5, 'TP', 'Travaux Pratiques', 'Travaux pratiques', 1, 1, '2026-07-09 16:35:11', '2026-07-09 16:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `idNote` int(11) NOT NULL,
  `note` float NOT NULL,
  `appreciation` varchar(255) DEFAULT NULL,
  `matricule` int(11) NOT NULL,
  `idMatiere` int(11) NOT NULL,
  `idSequence` int(11) NOT NULL,
  `idEnseignant` int(11) NOT NULL,
  `idEpreuve` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paiement`
--

CREATE TABLE `paiement` (
  `idPaiement` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `idEcheancier` int(11) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `montant` decimal(10,2) NOT NULL,
  `mode_paiement` enum('especes','mobile_money','virement','cheque') DEFAULT 'especes',
  `statut` enum('paye','partiel','annule') DEFAULT 'paye',
  `numero_recu` varchar(50) NOT NULL,
  `operation_ID` varchar(50) DEFAULT NULL,
  `commentaire` varchar(255) DEFAULT NULL,
  `date_paiement` date NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

CREATE TABLE `parent` (
  `idParent` int(11) NOT NULL,
  `idPers` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `relation` enum('pere','mere','tuteur') DEFAULT 'tuteur',
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parent`
--

INSERT INTO `parent` (`idParent`, `idPers`, `matricule`, `idAdmin`, `user_id`, `relation`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, NULL, 'tuteur', 0, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(2, 5, 2, 1, NULL, 'tuteur', 0, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(3, 7, 3, 1, NULL, 'tuteur', 0, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(4, 9, 4, 1, NULL, 'tuteur', 0, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(5, 11, 5, 1, NULL, 'tuteur', 0, '2026-07-09 16:44:32', '2026-07-09 16:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `personne`
--

CREATE TABLE `personne` (
  `idPers` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `lieuNaissance` varchar(100) DEFAULT NULL,
  `sexe` char(1) DEFAULT NULL COMMENT 'M/F',
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `photoURL` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personne`
--

INSERT INTO `personne` (`idPers`, `nom`, `prenom`, `dateNaissance`, `lieuNaissance`, `sexe`, `adresse`, `telephone`, `email`, `photoURL`, `created_at`, `updated_at`) VALUES
(2, 'Abena', 'Marc', NULL, NULL, '1', NULL, NULL, NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(3, 'Abena', 'Jean', NULL, NULL, '1', NULL, '677112233', NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(4, 'Bella', 'Marie', NULL, NULL, '2', NULL, NULL, NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(5, 'Bella', 'Pierre', NULL, NULL, '1', NULL, '677445566', NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(6, 'Camara', 'Ousmane', NULL, NULL, '1', NULL, NULL, NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(7, 'Camara', 'Fatoumata', NULL, NULL, '2', NULL, '699223344', NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(8, 'Dongmo', 'Arthur', NULL, NULL, '1', NULL, NULL, NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(9, 'Dongmo', 'Charles', NULL, NULL, '1', NULL, '655667788', NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(10, 'Eto\'o', 'Samuel Jr', NULL, NULL, '1', NULL, NULL, NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(11, 'Eto\'o', 'Samuel Sr', NULL, NULL, '1', NULL, '699009900', NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(12, 'Super Admin', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(13, 'Tchamba', 'Rose', NULL, NULL, NULL, NULL, '677001122', NULL, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32'),
(14, 'Kamga', 'Emmanuel', NULL, NULL, NULL, NULL, '699887766', NULL, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33'),
(15, 'Nkomo', 'Albert', NULL, NULL, NULL, NULL, '655443322', NULL, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33'),
(16, 'Ebongue', 'Marie', NULL, NULL, NULL, NULL, '676543210', NULL, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33');

-- --------------------------------------------------------

--
-- Table structure for table `presence`
--

CREATE TABLE `presence` (
  `id` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `date` date NOT NULL,
  `statut` enum('present','absent','justifie','retard') NOT NULL DEFAULT 'present',
  `motif_absence` varchar(255) DEFAULT NULL,
  `piece_jointe` varchar(255) DEFAULT NULL,
  `justifiee` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `retard`
--

CREATE TABLE `retard` (
  `id` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `duree` int(11) DEFAULT NULL COMMENT 'en minutes',
  `motif` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salle`
--

CREATE TABLE `salle` (
  `idSalle` int(11) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `capacite` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sanction`
--

CREATE TABLE `sanction` (
  `id` int(11) NOT NULL,
  `type_sanction` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `idIncident` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequence`
--

CREATE TABLE `sequence` (
  `idSequence` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `idTrimestre` int(11) NOT NULL,
  `idPers` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trimestre`
--

CREATE TABLE `trimestre` (
  `idTrimes` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `ordre` tinyint(4) NOT NULL DEFAULT 1,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `periode` varchar(100) DEFAULT NULL,
  `idAca` int(11) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `type_incident`
--

CREATE TABLE `type_incident` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `type_incident`
--

INSERT INTO `type_incident` (`id`, `nom`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Retard', 'Arrivée en retard en classe', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(2, 'Insolence', 'Manque de respect envers un enseignant', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(3, 'Bagarre', 'Conflit physique avec un autre élève', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(4, 'Dégradation', 'Détérioration de matériel ou de locaux', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(5, 'Absence injustifiée', 'Absence non justifiée', '2026-07-09 16:35:11', '2026-07-09 16:35:11'),
(6, 'Autre', 'Autre type d\'incident', '2026-07-09 16:35:11', '2026-07-09 16:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(80) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','directeur','fondateur','enseignant','parent') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `person_id`, `email`, `username`, `password_hash`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 'jean.abena@parent.ecole.cm', 'jean.abena@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'parent', 1, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(2, 5, 'pierre.bella@parent.ecole.cm', 'pierre.bella@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'parent', 1, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(3, 7, 'fatoumata.camara@parent.ecole.cm', 'fatoumata.camara@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'parent', 1, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(4, 9, 'charles.dongmo@parent.ecole.cm', 'charles.dongmo@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'parent', 1, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(5, 11, 'samuel.etoo@parent.ecole.cm', 'samuel.etoo@parent.ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'parent', 1, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(6, 12, 'admin@ecole.cm', 'admin@ecole.cm', '$2a$10$wge0cr9CbZtZPfnfzj.nPe0u2VDEIaz5swKMfj59MVG3VXfD8VlmK', 'admin', 1, NULL, '2026-07-09 16:44:32', '2026-07-09 16:44:32', NULL),
(7, 13, 'directeur@ecole.cm', 'directeur@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'directeur', 1, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33', NULL),
(8, 14, 'fondateur@ecole.cm', 'fondateur@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'fondateur', 1, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33', NULL),
(9, 15, 'enseignant@ecole.cm', 'enseignant@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'enseignant', 1, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33', NULL),
(10, 16, 'parent@ecole.cm', 'parent@ecole.cm', '$2a$10$hehKKruxYQLTt6OX4dx5U.nlskmx/fCD8UdA1lU1spEETpKs74Uc6', 'parent', 1, NULL, '2026-07-09 16:44:33', '2026-07-09 16:44:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ville`
--

CREATE TABLE `ville` (
  `idVille` int(11) NOT NULL,
  `nomVille` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ville`
--

INSERT INTO `ville` (`idVille`, `nomVille`) VALUES
(1, 'Yaoundé'),
(2, 'Douala'),
(3, 'Bafoussam'),
(4, 'Bamenda'),
(5, 'Kribi'),
(6, 'Ebolowa'),
(7, 'Garoua'),
(8, 'Maroua'),
(9, 'Ngaoundéré'),
(10, 'Bertoua');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_admin_personne` (`idPers`);

--
-- Indexes for table `annee_academique`
--
ALTER TABLE `annee_academique`
  ADD PRIMARY KEY (`idAnnee`),
  ADD KEY `fk_aa_admin` (`idAdmin`);

--
-- Indexes for table `banque_epreuves`
--
ALTER TABLE `banque_epreuves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_be_matiere` (`idMatiere`),
  ADD KEY `fk_be_admin` (`idAdmin`);

--
-- Indexes for table `bulletin`
--
ALTER TABLE `bulletin`
  ADD PRIMARY KEY (`idBulletin`),
  ADD KEY `fk_bul_eleve` (`matricule`),
  ADD KEY `fk_bul_sequence` (`idSequence`),
  ADD KEY `fk_bul_admin` (`idAdmin`);

--
-- Indexes for table `bulletin_ligne`
--
ALTER TABLE `bulletin_ligne`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bl_bulletin` (`idBulletin`),
  ADD KEY `fk_bl_matiere` (`idMatiere`);

--
-- Indexes for table `classe`
--
ALTER TABLE `classe`
  ADD PRIMARY KEY (`idClasse`),
  ADD KEY `fk_classe_salle` (`idSalle`),
  ADD KEY `fk_classe_admin` (`idAdmin`),
  ADD KEY `idx_classe_niveau` (`niveau`),
  ADD KEY `idx_classe_idCycle` (`idCycle`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cle` (`cle`);

--
-- Indexes for table `cycle`
--
ALTER TABLE `cycle`
  ADD PRIMARY KEY (`idCycle`);

--
-- Indexes for table `echeancier`
--
ALTER TABLE `echeancier`
  ADD PRIMARY KEY (`idEcheancier`),
  ADD KEY `fk_echeancier_admin` (`idAdmin`),
  ADD KEY `idx_echeancier_idAnnee` (`idAnnee`),
  ADD KEY `idx_echeancier_idFrais` (`idFrais`),
  ADD KEY `idx_echeancier_niveau` (`niveau`);

--
-- Indexes for table `eleve`
--
ALTER TABLE `eleve`
  ADD PRIMARY KEY (`matricule`),
  ADD KEY `fk_eleve_ville` (`idVilleNaissance`),
  ADD KEY `fk_eleve_admin` (`idAdmin`),
  ADD KEY `fk_eleve_personne` (`idPers`),
  ADD KEY `idx_eleve_idClasse` (`idClasse`),
  ADD KEY `idx_eleve_actif` (`actif`),
  ADD KEY `idx_eleve_nom` (`nom`);

--
-- Indexes for table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_edt_classe_jour_heure` (`idClasse`,`jour`,`heure_debut`),
  ADD KEY `fk_edt_matiere` (`idMatiere`),
  ADD KEY `fk_edt_enseignant` (`idEnseignant`),
  ADD KEY `fk_edt_annee` (`idAnnee`);

--
-- Indexes for table `enseignant`
--
ALTER TABLE `enseignant`
  ADD PRIMARY KEY (`idEnseignant`),
  ADD UNIQUE KEY `matricule` (`matricule`),
  ADD KEY `fk_ens_admin` (`idAdmin`),
  ADD KEY `fk_enseignant_user` (`user_id`),
  ADD KEY `idx_enseignant_idPers` (`idPers`),
  ADD KEY `idx_enseignant_matricule` (`matricule`);

--
-- Indexes for table `enseigner`
--
ALTER TABLE `enseigner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_enseigner` (`idEnseignant`,`idClasse`,`idAnnee`),
  ADD KEY `fk_ens_classe` (`idClasse`),
  ADD KEY `fk_ens_annee` (`idAnnee`);

--
-- Indexes for table `enseigner_matiere`
--
ALTER TABLE `enseigner_matiere`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_enseigner_matiere` (`idEnseignant`,`idMatiere`,`idClasse`,`idAnnee`),
  ADD KEY `fk_em_matiere` (`idMatiere`),
  ADD KEY `fk_em_classe` (`idClasse`),
  ADD KEY `fk_em_annee` (`idAnnee`);

--
-- Indexes for table `epreuve`
--
ALTER TABLE `epreuve`
  ADD PRIMARY KEY (`idEpreuve`),
  ADD KEY `fk_epreuve_enseignant` (`idEnseignant`),
  ADD KEY `fk_epreuve_admin` (`idAdmin`),
  ADD KEY `idx_epreuve_idMatiere` (`idMatiere`),
  ADD KEY `idx_epreuve_idClasse` (`idClasse`),
  ADD KEY `idx_epreuve_idTrimestre` (`idTrimestre`),
  ADD KEY `idx_epreuve_date` (`date_epreuve`),
  ADD KEY `idx_epreuve_idNature` (`idNature`);

--
-- Indexes for table `epreuve_note`
--
ALTER TABLE `epreuve_note`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_epreuve_eleve` (`idEpreuve`,`matricule`),
  ADD KEY `fk_en_eleve` (`matricule`);

--
-- Indexes for table `frais`
--
ALTER TABLE `frais`
  ADD PRIMARY KEY (`idFrais`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `frequente`
--
ALTER TABLE `frequente`
  ADD PRIMARY KEY (`matricule`,`idClasse`,`idAnnee`),
  ADD KEY `fk_freq_classe` (`idClasse`),
  ADD KEY `fk_freq_annee` (`idAnnee`);

--
-- Indexes for table `incident`
--
ALTER TABLE `incident`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_inc_enseignant` (`idEnseignant`),
  ADD KEY `idx_incident_matricule` (`matricule`),
  ADD KEY `idx_incident_idType` (`idTypeIncident`),
  ADD KEY `idx_incident_idAnnee` (`idAnnee`);

--
-- Indexes for table `log_actions`
--
ALTER TABLE `log_actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_log_admin` (`idAdmin`);

--
-- Indexes for table `matiere`
--
ALTER TABLE `matiere`
  ADD PRIMARY KEY (`idMatiere`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `fk_matiere_admin` (`idAdmin`);

--
-- Indexes for table `matiere_classe`
--
ALTER TABLE `matiere_classe`
  ADD PRIMARY KEY (`matiere_id`,`classe_id`),
  ADD KEY `fk_mc_classe` (`classe_id`),
  ADD KEY `fk_mc_enseignant` (`enseignant_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_msg_parent` (`idParent`),
  ADD KEY `fk_msg_reponse` (`reponse_a_id`),
  ADD KEY `idx_message_idExpediteur` (`idExpediteur`),
  ADD KEY `idx_message_idDestinataire` (`idDestinataire`),
  ADD KEY `idx_message_date_envoi` (`date_envoi`);

--
-- Indexes for table `nature_epreuve`
--
ALTER TABLE `nature_epreuve`
  ADD PRIMARY KEY (`idNature`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`idNote`),
  ADD KEY `fk_note_enseignant` (`idEnseignant`),
  ADD KEY `fk_note_epreuve` (`idEpreuve`),
  ADD KEY `idx_note_matricule` (`matricule`),
  ADD KEY `idx_note_idMatiere` (`idMatiere`),
  ADD KEY `idx_note_idSequence` (`idSequence`);

--
-- Indexes for table `paiement`
--
ALTER TABLE `paiement`
  ADD PRIMARY KEY (`idPaiement`),
  ADD UNIQUE KEY `numero_recu` (`numero_recu`),
  ADD KEY `fk_paiement_admin` (`idAdmin`),
  ADD KEY `idx_paiement_matricule` (`matricule`),
  ADD KEY `idx_paiement_idAnnee` (`idAnnee`),
  ADD KEY `idx_paiement_idEcheancier` (`idEcheancier`),
  ADD KEY `idx_paiement_statut` (`statut`),
  ADD KEY `idx_paiement_date` (`date_paiement`);

--
-- Indexes for table `parent`
--
ALTER TABLE `parent`
  ADD PRIMARY KEY (`idParent`),
  ADD KEY `fk_parent_admin` (`idAdmin`),
  ADD KEY `fk_parent_user` (`user_id`),
  ADD KEY `idx_parent_matricule` (`matricule`),
  ADD KEY `idx_parent_idPers` (`idPers`);

--
-- Indexes for table `personne`
--
ALTER TABLE `personne`
  ADD PRIMARY KEY (`idPers`);

--
-- Indexes for table `presence`
--
ALTER TABLE `presence`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_presence_eleve_date` (`matricule`,`date`),
  ADD KEY `idx_presence_matricule` (`matricule`),
  ADD KEY `idx_presence_date` (`date`);

--
-- Indexes for table `retard`
--
ALTER TABLE `retard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_retard_eleve` (`matricule`);

--
-- Indexes for table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`idSalle`);

--
-- Indexes for table `sanction`
--
ALTER TABLE `sanction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sanction_incident` (`idIncident`);

--
-- Indexes for table `sequence`
--
ALTER TABLE `sequence`
  ADD PRIMARY KEY (`idSequence`),
  ADD KEY `fk_seq_trimestre` (`idTrimestre`),
  ADD KEY `fk_seq_personne` (`idPers`);

--
-- Indexes for table `trimestre`
--
ALTER TABLE `trimestre`
  ADD PRIMARY KEY (`idTrimes`),
  ADD KEY `fk_trim_annee` (`idAca`),
  ADD KEY `fk_trim_admin` (`idAdmin`);

--
-- Indexes for table `type_incident`
--
ALTER TABLE `type_incident`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_user_personne` (`person_id`);

--
-- Indexes for table `ville`
--
ALTER TABLE `ville`
  ADD PRIMARY KEY (`idVille`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `annee_academique`
--
ALTER TABLE `annee_academique`
  MODIFY `idAnnee` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banque_epreuves`
--
ALTER TABLE `banque_epreuves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bulletin`
--
ALTER TABLE `bulletin`
  MODIFY `idBulletin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bulletin_ligne`
--
ALTER TABLE `bulletin_ligne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classe`
--
ALTER TABLE `classe`
  MODIFY `idClasse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cycle`
--
ALTER TABLE `cycle`
  MODIFY `idCycle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `echeancier`
--
ALTER TABLE `echeancier`
  MODIFY `idEcheancier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eleve`
--
ALTER TABLE `eleve`
  MODIFY `matricule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enseignant`
--
ALTER TABLE `enseignant`
  MODIFY `idEnseignant` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enseigner`
--
ALTER TABLE `enseigner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enseigner_matiere`
--
ALTER TABLE `enseigner_matiere`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `epreuve`
--
ALTER TABLE `epreuve`
  MODIFY `idEpreuve` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `epreuve_note`
--
ALTER TABLE `epreuve_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `frais`
--
ALTER TABLE `frais`
  MODIFY `idFrais` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `incident`
--
ALTER TABLE `incident`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_actions`
--
ALTER TABLE `log_actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matiere`
--
ALTER TABLE `matiere`
  MODIFY `idMatiere` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nature_epreuve`
--
ALTER TABLE `nature_epreuve`
  MODIFY `idNature` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `idNote` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paiement`
--
ALTER TABLE `paiement`
  MODIFY `idPaiement` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parent`
--
ALTER TABLE `parent`
  MODIFY `idParent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `personne`
--
ALTER TABLE `personne`
  MODIFY `idPers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `presence`
--
ALTER TABLE `presence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retard`
--
ALTER TABLE `retard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salle`
--
ALTER TABLE `salle`
  MODIFY `idSalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sanction`
--
ALTER TABLE `sanction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sequence`
--
ALTER TABLE `sequence`
  MODIFY `idSequence` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trimestre`
--
ALTER TABLE `trimestre`
  MODIFY `idTrimes` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `type_incident`
--
ALTER TABLE `type_incident`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ville`
--
ALTER TABLE `ville`
  MODIFY `idVille` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `fk_admin_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL;

--
-- Constraints for table `annee_academique`
--
ALTER TABLE `annee_academique`
  ADD CONSTRAINT `fk_aa_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL;

--
-- Constraints for table `banque_epreuves`
--
ALTER TABLE `banque_epreuves`
  ADD CONSTRAINT `fk_be_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_be_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE;

--
-- Constraints for table `bulletin`
--
ALTER TABLE `bulletin`
  ADD CONSTRAINT `fk_bul_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_bul_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bul_sequence` FOREIGN KEY (`idSequence`) REFERENCES `sequence` (`idSequence`) ON DELETE CASCADE;

--
-- Constraints for table `bulletin_ligne`
--
ALTER TABLE `bulletin_ligne`
  ADD CONSTRAINT `fk_bl_bulletin` FOREIGN KEY (`idBulletin`) REFERENCES `bulletin` (`idBulletin`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bl_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE;

--
-- Constraints for table `classe`
--
ALTER TABLE `classe`
  ADD CONSTRAINT `fk_classe_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_classe_cycle` FOREIGN KEY (`idCycle`) REFERENCES `cycle` (`idCycle`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_classe_salle` FOREIGN KEY (`idSalle`) REFERENCES `salle` (`idSalle`) ON DELETE SET NULL;

--
-- Constraints for table `echeancier`
--
ALTER TABLE `echeancier`
  ADD CONSTRAINT `fk_ech_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ech_frais` FOREIGN KEY (`idFrais`) REFERENCES `frais` (`idFrais`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_echeancier_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL;

--
-- Constraints for table `eleve`
--
ALTER TABLE `eleve`
  ADD CONSTRAINT `fk_eleve_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_eleve_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_eleve_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_eleve_ville` FOREIGN KEY (`idVilleNaissance`) REFERENCES `ville` (`idVille`) ON DELETE SET NULL;

--
-- Constraints for table `emploi_du_temps`
--
ALTER TABLE `emploi_du_temps`
  ADD CONSTRAINT `fk_edt_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_edt_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_edt_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_edt_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE;

--
-- Constraints for table `enseignant`
--
ALTER TABLE `enseignant`
  ADD CONSTRAINT `fk_ens_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ens_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enseignant_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `enseigner`
--
ALTER TABLE `enseigner`
  ADD CONSTRAINT `fk_ens_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ens_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ens_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE;

--
-- Constraints for table `enseigner_matiere`
--
ALTER TABLE `enseigner_matiere`
  ADD CONSTRAINT `fk_em_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_em_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_em_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_em_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE;

--
-- Constraints for table `epreuve`
--
ALTER TABLE `epreuve`
  ADD CONSTRAINT `fk_epreuve_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_epreuve_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_epreuve_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_epreuve_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_epreuve_nature` FOREIGN KEY (`idNature`) REFERENCES `nature_epreuve` (`idNature`),
  ADD CONSTRAINT `fk_epreuve_trimestre` FOREIGN KEY (`idTrimestre`) REFERENCES `trimestre` (`idTrimes`) ON DELETE CASCADE;

--
-- Constraints for table `epreuve_note`
--
ALTER TABLE `epreuve_note`
  ADD CONSTRAINT `fk_en_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_en_epreuve` FOREIGN KEY (`idEpreuve`) REFERENCES `epreuve` (`idEpreuve`) ON DELETE CASCADE;

--
-- Constraints for table `frequente`
--
ALTER TABLE `frequente`
  ADD CONSTRAINT `fk_freq_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_freq_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_freq_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE;

--
-- Constraints for table `incident`
--
ALTER TABLE `incident`
  ADD CONSTRAINT `fk_inc_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_inc_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inc_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inc_type` FOREIGN KEY (`idTypeIncident`) REFERENCES `type_incident` (`id`);

--
-- Constraints for table `log_actions`
--
ALTER TABLE `log_actions`
  ADD CONSTRAINT `fk_log_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL;

--
-- Constraints for table `matiere`
--
ALTER TABLE `matiere`
  ADD CONSTRAINT `fk_matiere_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL;

--
-- Constraints for table `matiere_classe`
--
ALTER TABLE `matiere_classe`
  ADD CONSTRAINT `fk_mc_classe` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mc_enseignant` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_mc_matiere` FOREIGN KEY (`matiere_id`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `fk_msg_destinataire` FOREIGN KEY (`idDestinataire`) REFERENCES `admin` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_msg_expediteur` FOREIGN KEY (`idExpediteur`) REFERENCES `admin` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_msg_parent` FOREIGN KEY (`idParent`) REFERENCES `parent` (`idParent`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_msg_reponse` FOREIGN KEY (`reponse_a_id`) REFERENCES `message` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `note`
--
ALTER TABLE `note`
  ADD CONSTRAINT `fk_note_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_note_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_note_epreuve` FOREIGN KEY (`idEpreuve`) REFERENCES `epreuve` (`idEpreuve`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_note_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_note_sequence` FOREIGN KEY (`idSequence`) REFERENCES `sequence` (`idSequence`) ON DELETE CASCADE;

--
-- Constraints for table `paiement`
--
ALTER TABLE `paiement`
  ADD CONSTRAINT `fk_paiement_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_paiement_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_paiement_echeancier` FOREIGN KEY (`idEcheancier`) REFERENCES `echeancier` (`idEcheancier`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_paiement_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE;

--
-- Constraints for table `parent`
--
ALTER TABLE `parent`
  ADD CONSTRAINT `fk_parent_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_parent_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_parent_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_parent_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `presence`
--
ALTER TABLE `presence`
  ADD CONSTRAINT `fk_pres_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE;

--
-- Constraints for table `retard`
--
ALTER TABLE `retard`
  ADD CONSTRAINT `fk_retard_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE;

--
-- Constraints for table `sanction`
--
ALTER TABLE `sanction`
  ADD CONSTRAINT `fk_sanction_incident` FOREIGN KEY (`idIncident`) REFERENCES `incident` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sequence`
--
ALTER TABLE `sequence`
  ADD CONSTRAINT `fk_seq_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_seq_trimestre` FOREIGN KEY (`idTrimestre`) REFERENCES `trimestre` (`idTrimes`) ON DELETE CASCADE;

--
-- Constraints for table `trimestre`
--
ALTER TABLE `trimestre`
  ADD CONSTRAINT `fk_trim_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_trim_annee` FOREIGN KEY (`idAca`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_personne` FOREIGN KEY (`person_id`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
