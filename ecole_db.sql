-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 09:23 AM
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
  `typeAdmin` smallint(6) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `alanyaID` varchar(15) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ID`, `nom`, `username`, `password`, `actif`, `typeAdmin`, `mobile`, `alanyaID`, `created_at`) VALUES
(1, 'Administrateur', 'admin@ecole.cm', '$2a$10$yoJKEm19fx9/k68bDLIOdO7.dZW4sNZ1M9jMc7b3h/k9gpRKyjjLG', 1, 3, '000000000', '000000000', '2026-07-09 05:01:34'),
(2, 'Thomas Fouda', 'thomas.fouda@parent.ecole.cm', '$2a$10$VEvBspHjlph3oSeGOosu4O.xh4EsDDej7R2pL9xOGoCgB.O9Lu7Ti', 1, 5, NULL, NULL, '2026-07-09 07:30:11'),
(3, 'Joseph Mbarga', 'joseph.mbarga@parent.ecole.cm', '$2a$10$VEvBspHjlph3oSeGOosu4O.xh4EsDDej7R2pL9xOGoCgB.O9Lu7Ti', 1, 5, NULL, NULL, '2026-07-09 07:30:11'),
(4, 'Albert Nkomo', 'albert.nkomo@parent.ecole.cm', '$2a$10$VEvBspHjlph3oSeGOosu4O.xh4EsDDej7R2pL9xOGoCgB.O9Lu7Ti', 1, 5, NULL, NULL, '2026-07-09 07:30:11'),
(5, 'Gabriel Mbom', 'gabriel.mbom@parent.ecole.cm', '$2a$10$ZVE4xk1Q6Oe3WuUXo0roqOOX/EqMsz6mdKs1qNX2Cb80ldpNLljOK', 1, 5, '691366621', NULL, '2026-07-09 07:30:11'),
(6, 'Magarette Nsoh', 'magarette.nsoh@parent.ecole.cm', '$2a$10$VEvBspHjlph3oSeGOosu4O.xh4EsDDej7R2pL9xOGoCgB.O9Lu7Ti', 1, 5, NULL, NULL, '2026-07-09 07:30:11'),
(7, 'Parent Test', 'testparent@gmail.com', '$2a$10$RHbAbBmwpMBccfsviPIPAOj4aami8RdmTQGLvDdXpK5Xg7Oi27D66', 1, 5, '699000111', NULL, '2026-07-09 07:08:27'),
(8, 'Leo Sanja', 'sanjaleo@gmail.com', '$2a$10$/kHz/7d416EmFOLhpvdIc.Q/LbPAy4BSsMWhTD8T8/05z1fEcls4O', 1, 5, '691366621', NULL, '2026-07-09 07:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `anneeacademique`
--

CREATE TABLE `anneeacademique` (
  `idAnnee` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `periode` varchar(100) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anneeacademique`
--

INSERT INTO `anneeacademique` (`idAnnee`, `libelle`, `periode`, `idAdmin`, `created_at`) VALUES
(1, '2025-2026', 'Septembre 2025 - Juin 2026', 1, '2026-07-09 05:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `bulletins`
--

CREATE TABLE `bulletins` (
  `id` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `idSequence` int(11) NOT NULL,
  `moyenne_generale` float DEFAULT NULL,
  `appreciation` text DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `idClasse` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `idCycle` int(11) NOT NULL,
  `idAdmin` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`idClasse`, `libelle`, `idCycle`, `idAdmin`, `created_at`, `updated_at`) VALUES
(1, 'SIL A', 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(2, 'CP A', 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(3, 'CE1 A', 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(4, 'CE2 A', 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(5, 'CM1 A', 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(6, 'CM2 A', 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(7, 'CLASS 6A', 1, 1, '2026-07-09 05:42:36', '2026-07-09 05:42:36'),
(8, 'CLASS 6B', 1, 1, '2026-07-09 07:07:55', '2026-07-09 07:07:55');

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
(2, 'Cycle Anglophone');

-- --------------------------------------------------------

--
-- Table structure for table `eleves`
--

CREATE TABLE `eleves` (
  `matricule` int(11) NOT NULL,
  `nom` varchar(60) NOT NULL,
  `prenom` varchar(60) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `lieuNaissance` varchar(30) DEFAULT NULL,
  `sexe` smallint(6) DEFAULT NULL,
  `langue` varchar(30) DEFAULT NULL,
  `photoURL` varchar(255) DEFAULT NULL,
  `actif` tinyint(4) DEFAULT 1,
  `idVilleNaissance` int(11) DEFAULT NULL,
  `idAdmin` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `eleves`
--

INSERT INTO `eleves` (`matricule`, `nom`, `prenom`, `dateNaissance`, `lieuNaissance`, `sexe`, `langue`, `photoURL`, `actif`, `idVilleNaissance`, `idAdmin`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Fouda', 'Jean', '2016-04-12', 'Yaoundé', 1, '1', NULL, 1, NULL, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43', NULL),
(2, 'Mbarga', 'Marie', '2016-09-25', 'Douala', 2, '1', NULL, 1, NULL, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43', NULL),
(3, 'Nkomo', 'Pierre', '2015-02-14', 'Yaoundé', 1, '2', NULL, 1, NULL, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43', NULL),
(4, 'Sanda', 'Sophie', '2015-07-22', 'Bafoussam', 2, '2', NULL, 1, NULL, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43', NULL),
(5, 'Mengue', 'Kevin', '2014-11-05', 'Yaoundé', 1, '3', NULL, 1, NULL, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43', NULL),
(6, 'Mbom', 'Maeva', '2000-11-11', 'Douala', 2, '3', NULL, 1, NULL, 1, '2026-07-09 05:35:00', '2026-07-09 05:35:00', NULL),
(7, 'Matipa', 'Loic', '2000-04-12', 'Yaoundé', 1, '2', NULL, 1, NULL, 1, '2026-07-09 05:39:08', '2026-07-09 05:39:37', NULL),
(11, 'Test', 'Inscription', '2015-05-10', 'Douala', 1, '1', NULL, 0, NULL, 1, '2026-07-09 07:08:27', '2026-07-09 07:09:48', NULL),
(12, 'Sanja ', 'Marc', '2000-11-22', 'Yaoundé', 1, '3', NULL, 1, NULL, 1, '2026-07-09 07:10:57', '2026-07-09 07:10:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `epreuve`
--

CREATE TABLE `epreuve` (
  `idEpreuve` int(11) NOT NULL,
  `libelle` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `points` int(11) DEFAULT 0,
  `matricule` int(11) NOT NULL,
  `idAnnee` int(11) NOT NULL,
  `commentaire` text DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `idPers` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `matieres`
--

CREATE TABLE `matieres` (
  `idMatiere` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `coefficient` float DEFAULT 1,
  `description` text DEFAULT NULL,
  `idAdmin` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `matieres`
--

INSERT INTO `matieres` (`idMatiere`, `libelle`, `coefficient`, `description`, `idAdmin`, `created_at`, `updated_at`) VALUES
(1, 'Mathématiques', 3, 'Calcul, géométrie, opérations', 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(2, 'Français', 3, 'Grammaire, conjugaison, orthographe', 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(3, 'Sciences', 2, 'Éveil scientifique, sciences de la vie', 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(4, 'Histoire-Géographie', 2, 'Histoire et géographie du Cameroun', 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(5, 'Anglais', 1, 'Bilinguisme anglais', 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(6, 'Mathématiques', 1, NULL, 1, '2026-07-09 05:46:19', '2026-07-09 05:46:19');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `idNote` int(11) NOT NULL,
  `note` float NOT NULL,
  `appreciation` varchar(255) DEFAULT NULL,
  `matricule` int(11) NOT NULL,
  `idEpreuve` int(11) NOT NULL,
  `idMatiere` int(11) NOT NULL,
  `idSequence` int(11) NOT NULL,
  `idPers` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parents`
--

CREATE TABLE `parents` (
  `idParent` int(11) NOT NULL,
  `idPers` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `idAdmin` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parents`
--

INSERT INTO `parents` (`idParent`, `idPers`, `matricule`, `idAdmin`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(2, 3, 2, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(3, 4, 3, 1, '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(4, 5, 6, 1, '2026-07-09 05:35:00', '2026-07-09 05:35:00'),
(5, 6, 7, 1, '2026-07-09 05:39:08', '2026-07-09 05:39:08'),
(9, 10, 11, 1, '2026-07-09 07:08:27', '2026-07-09 07:08:27'),
(10, 11, 12, 1, '2026-07-09 07:10:57', '2026-07-09 07:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `personne`
--

CREATE TABLE `personne` (
  `idPers` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personne`
--

INSERT INTO `personne` (`idPers`, `nom`, `prenom`) VALUES
(1, 'Directeur', 'Général'),
(2, 'Fouda', 'Thomas'),
(3, 'Mbarga', 'Joseph'),
(4, 'Nkomo', 'Albert'),
(5, 'Mbom', 'Gabriel'),
(6, 'Nsoh', 'Magarette'),
(10, 'Test', 'Parent'),
(11, 'Sanja', 'Leo');

-- --------------------------------------------------------

--
-- Table structure for table `presences`
--

CREATE TABLE `presences` (
  `id` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `date` date NOT NULL,
  `statut` enum('present','absent','justifie') NOT NULL,
  `motif_absence` varchar(255) DEFAULT NULL,
  `piece_jointe` varchar(255) DEFAULT NULL,
  `justifiee` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `retards`
--

CREATE TABLE `retards` (
  `id` int(11) NOT NULL,
  `matricule` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `duree` int(11) DEFAULT NULL COMMENT 'en minutes',
  `motif` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'fondateur', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(2, 'directeur', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(3, 'admin', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(4, 'enseignant', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(5, 'parent', '2026-07-09 05:01:42', '2026-07-09 05:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `sanctions`
--

CREATE TABLE `sanctions` (
  `id` int(11) NOT NULL,
  `incident_id` int(11) NOT NULL,
  `type_sanction` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20231231000000-create-base-tables.js'),
('20240101000000-create-users.js'),
('20240101000001-create-roles.js'),
('20240101000002-create-eleves.js'),
('20240101000003-create-parents.js'),
('20240101000004-create-classes.js'),
('20240101000005-create-matieres.js'),
('20240101000006-create-sequences.js'),
('20240101000007-create-types-incidents.js'),
('20240101000008-create-notes.js'),
('20240101000009-create-incidents.js'),
('20240101000010-create-presences.js'),
('20240101000011-create-bulletins.js'),
('20240101000012-create-sanctions.js'),
('20240101000013-create-retards.js');

-- --------------------------------------------------------

--
-- Table structure for table `sequences`
--

CREATE TABLE `sequences` (
  `idSequence` int(11) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `idTrimestre` int(11) NOT NULL,
  `idPers` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sequences`
--

INSERT INTO `sequences` (`idSequence`, `libelle`, `description`, `idTrimestre`, `idPers`, `created_at`, `updated_at`) VALUES
(1, 'Séquence 1 - T1', 'Première séquence du trimestre 1', 1, 1, '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(2, 'Séquence 2 - T1', 'Deuxième séquence du trimestre 1', 1, 1, '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(3, 'Séquence 1 - T2', 'Première séquence du trimestre 2', 2, 1, '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(4, 'Séquence 2 - T2', 'Deuxième séquence du trimestre 2', 2, 1, '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(5, 'Séquence 1 - T3', 'Première séquence du trimestre 3', 3, 1, '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(6, 'Séquence 2 - T3', 'Deuxième séquence du trimestre 3', 3, 1, '2026-07-09 05:01:42', '2026-07-09 05:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `trimestre`
--

CREATE TABLE `trimestre` (
  `idTrimes` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `periode` varchar(100) DEFAULT NULL,
  `idAca` int(11) DEFAULT NULL,
  `idAdmin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trimestre`
--

INSERT INTO `trimestre` (`idTrimes`, `libelle`, `periode`, `idAca`, `idAdmin`, `created_at`) VALUES
(1, 'Trimestre 1', 'Sept - Nov', 1, 1, '2026-07-09 05:01:42'),
(2, 'Trimestre 2', 'Déc - Fév', 1, 1, '2026-07-09 05:01:42'),
(3, 'Trimestre 3', 'Mar - Juin', 1, 1, '2026-07-09 05:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `typeincidents`
--

CREATE TABLE `typeincidents` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `typeincidents`
--

INSERT INTO `typeincidents` (`id`, `nom`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Retard', 'Arrivée en retard en classe', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(2, 'Insolence', 'Manque de respect envers un enseignant', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(3, 'Bagarre', 'Conflit physique avec un autre élève', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(4, 'Dégradation', 'Détérioration de matériel ou de locaux', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(5, 'Absence injustifiée', 'Absence non justifiée', '2026-07-09 05:01:42', '2026-07-09 05:01:42'),
(6, 'Autre', 'Autre type d\'incident', '2026-07-09 05:01:42', '2026-07-09 05:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `UserId` int(11) DEFAULT NULL,
  `RoleId` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `actif` tinyint(4) DEFAULT 1,
  `typeAdmin` smallint(6) DEFAULT 2,
  `mobile` varchar(15) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `nom`, `prenom`, `actif`, `typeAdmin`, `mobile`, `created_at`, `updated_at`) VALUES
(1, 'directeur@ecole.cm', '$2a$10$bh1r/YDGi4r0tITjr6MQje2hEDcavY/zJNpCsldZb/rl6Xd1dRCH.', 'Tchamba', 'Rose', 1, 2, '677001122', '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(2, 'fondateur@ecole.cm', '$2a$10$bh1r/YDGi4r0tITjr6MQje2hEDcavY/zJNpCsldZb/rl6Xd1dRCH.', 'Kamga', 'Emmanuel', 1, 1, '699887766', '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(3, 'enseignant@ecole.cm', '$2a$10$bh1r/YDGi4r0tITjr6MQje2hEDcavY/zJNpCsldZb/rl6Xd1dRCH.', 'Nkomo', 'Albert', 1, 4, '655443322', '2026-07-09 05:01:43', '2026-07-09 05:01:43'),
(4, 'parent@ecole.cm', '$2a$10$bh1r/YDGi4r0tITjr6MQje2hEDcavY/zJNpCsldZb/rl6Xd1dRCH.', 'Ebongue', 'Marie', 1, 5, '676543210', '2026-07-09 05:01:43', '2026-07-09 05:01:43');

-- --------------------------------------------------------

--
-- Table structure for table `villenaissance`
--

CREATE TABLE `villenaissance` (
  `idVille` int(11) NOT NULL,
  `nomVille` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `villenaissance`
--

INSERT INTO `villenaissance` (`idVille`, `nomVille`) VALUES
(1, 'Yaoundé'),
(2, 'Douala'),
(3, 'Bafoussam');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `anneeacademique`
--
ALTER TABLE `anneeacademique`
  ADD PRIMARY KEY (`idAnnee`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indexes for table `bulletins`
--
ALTER TABLE `bulletins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricule` (`matricule`),
  ADD KEY `idSequence` (`idSequence`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`idClasse`),
  ADD KEY `idCycle` (`idCycle`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indexes for table `cycle`
--
ALTER TABLE `cycle`
  ADD PRIMARY KEY (`idCycle`);

--
-- Indexes for table `eleves`
--
ALTER TABLE `eleves`
  ADD PRIMARY KEY (`matricule`),
  ADD KEY `idVilleNaissance` (`idVilleNaissance`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indexes for table `epreuve`
--
ALTER TABLE `epreuve`
  ADD PRIMARY KEY (`idEpreuve`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricule` (`matricule`),
  ADD KEY `idAnnee` (`idAnnee`),
  ADD KEY `idPers` (`idPers`);

--
-- Indexes for table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`idMatiere`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`idNote`),
  ADD KEY `matricule` (`matricule`),
  ADD KEY `idEpreuve` (`idEpreuve`),
  ADD KEY `idMatiere` (`idMatiere`),
  ADD KEY `idSequence` (`idSequence`),
  ADD KEY `idPers` (`idPers`);

--
-- Indexes for table `parents`
--
ALTER TABLE `parents`
  ADD PRIMARY KEY (`idParent`),
  ADD KEY `idPers` (`idPers`),
  ADD KEY `matricule` (`matricule`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indexes for table `personne`
--
ALTER TABLE `personne`
  ADD PRIMARY KEY (`idPers`);

--
-- Indexes for table `presences`
--
ALTER TABLE `presences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricule` (`matricule`);

--
-- Indexes for table `retards`
--
ALTER TABLE `retards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `matricule` (`matricule`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sanctions`
--
ALTER TABLE `sanctions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incident_id` (`incident_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sequences`
--
ALTER TABLE `sequences`
  ADD PRIMARY KEY (`idSequence`),
  ADD KEY `idTrimestre` (`idTrimestre`),
  ADD KEY `idPers` (`idPers`);

--
-- Indexes for table `trimestre`
--
ALTER TABLE `trimestre`
  ADD PRIMARY KEY (`idTrimes`),
  ADD KEY `idAca` (`idAca`),
  ADD KEY `idAdmin` (`idAdmin`);

--
-- Indexes for table `typeincidents`
--
ALTER TABLE `typeincidents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD KEY `UserId` (`UserId`),
  ADD KEY `RoleId` (`RoleId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `villenaissance`
--
ALTER TABLE `villenaissance`
  ADD PRIMARY KEY (`idVille`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `anneeacademique`
--
ALTER TABLE `anneeacademique`
  MODIFY `idAnnee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bulletins`
--
ALTER TABLE `bulletins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `idClasse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cycle`
--
ALTER TABLE `cycle`
  MODIFY `idCycle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `eleves`
--
ALTER TABLE `eleves`
  MODIFY `matricule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `epreuve`
--
ALTER TABLE `epreuve`
  MODIFY `idEpreuve` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `idMatiere` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `idNote` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parents`
--
ALTER TABLE `parents`
  MODIFY `idParent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personne`
--
ALTER TABLE `personne`
  MODIFY `idPers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `presences`
--
ALTER TABLE `presences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retards`
--
ALTER TABLE `retards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sanctions`
--
ALTER TABLE `sanctions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sequences`
--
ALTER TABLE `sequences`
  MODIFY `idSequence` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `trimestre`
--
ALTER TABLE `trimestre`
  MODIFY `idTrimes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `typeincidents`
--
ALTER TABLE `typeincidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `villenaissance`
--
ALTER TABLE `villenaissance`
  MODIFY `idVille` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anneeacademique`
--
ALTER TABLE `anneeacademique`
  ADD CONSTRAINT `anneeacademique_ibfk_1` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`);

--
-- Constraints for table `bulletins`
--
ALTER TABLE `bulletins`
  ADD CONSTRAINT `bulletins_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `eleves` (`matricule`),
  ADD CONSTRAINT `bulletins_ibfk_2` FOREIGN KEY (`idSequence`) REFERENCES `sequences` (`idSequence`);

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`idCycle`) REFERENCES `cycle` (`idCycle`),
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`);

--
-- Constraints for table `eleves`
--
ALTER TABLE `eleves`
  ADD CONSTRAINT `eleves_ibfk_1` FOREIGN KEY (`idVilleNaissance`) REFERENCES `villenaissance` (`idVille`),
  ADD CONSTRAINT `eleves_ibfk_2` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`);

--
-- Constraints for table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `eleves` (`matricule`),
  ADD CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`idAnnee`) REFERENCES `anneeacademique` (`idAnnee`),
  ADD CONSTRAINT `incidents_ibfk_3` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`);

--
-- Constraints for table `matieres`
--
ALTER TABLE `matieres`
  ADD CONSTRAINT `matieres_ibfk_1` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`);

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `eleves` (`matricule`),
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`idEpreuve`) REFERENCES `epreuve` (`idEpreuve`),
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`idMatiere`) REFERENCES `matieres` (`idMatiere`),
  ADD CONSTRAINT `notes_ibfk_4` FOREIGN KEY (`idSequence`) REFERENCES `sequences` (`idSequence`),
  ADD CONSTRAINT `notes_ibfk_5` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`);

--
-- Constraints for table `parents`
--
ALTER TABLE `parents`
  ADD CONSTRAINT `parents_ibfk_1` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`),
  ADD CONSTRAINT `parents_ibfk_2` FOREIGN KEY (`matricule`) REFERENCES `eleves` (`matricule`),
  ADD CONSTRAINT `parents_ibfk_3` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`);

--
-- Constraints for table `presences`
--
ALTER TABLE `presences`
  ADD CONSTRAINT `presences_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `eleves` (`matricule`);

--
-- Constraints for table `retards`
--
ALTER TABLE `retards`
  ADD CONSTRAINT `retards_ibfk_1` FOREIGN KEY (`matricule`) REFERENCES `eleves` (`matricule`);

--
-- Constraints for table `sanctions`
--
ALTER TABLE `sanctions`
  ADD CONSTRAINT `sanctions_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`);

--
-- Constraints for table `sequences`
--
ALTER TABLE `sequences`
  ADD CONSTRAINT `sequences_ibfk_1` FOREIGN KEY (`idTrimestre`) REFERENCES `trimestre` (`idTrimes`),
  ADD CONSTRAINT `sequences_ibfk_2` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`);

--
-- Constraints for table `trimestre`
--
ALTER TABLE `trimestre`
  ADD CONSTRAINT `trimestre_ibfk_1` FOREIGN KEY (`idAca`) REFERENCES `anneeacademique` (`idAnnee`),
  ADD CONSTRAINT `trimestre_ibfk_2` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`);

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
