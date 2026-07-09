-- ================================================================
-- DATABASE: ecole_etoiles
-- Complete Updated Schema - All Tables
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================================
-- 1. VILLE (City)
-- ================================================================
CREATE TABLE IF NOT EXISTS `ville` (
  `idVille` INT(11) NOT NULL AUTO_INCREMENT,
  `nomVille` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`idVille`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- ================================================================
-- 2. ADMIN (Administrator / User Account)
-- ================================================================
CREATE TABLE IF NOT EXISTS `admin` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `actif` TINYINT(4) NOT NULL DEFAULT 1,
  `typeAdmin` SMALLINT(6) NOT NULL COMMENT '1=superadmin,2=directeur,3=admin,4=enseignant,5=parent',
  `mobile` VARCHAR(15) DEFAULT NULL,
  `alanyaID` VARCHAR(15) DEFAULT NULL,
  `idPers` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_admin_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 3. PERSONNE (Person - base table for all individuals)
-- ================================================================
CREATE TABLE IF NOT EXISTS `personne` (
  `idPers` INT(11) NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) DEFAULT NULL,
  `prenom` VARCHAR(100) DEFAULT NULL,
  `dateNaissance` DATE DEFAULT NULL,
  `lieuNaissance` VARCHAR(100) DEFAULT NULL,
  `sexe` CHAR(1) DEFAULT NULL COMMENT 'M/F',
  `adresse` VARCHAR(255) DEFAULT NULL,
  `telephone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `photoURL` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idPers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 4. USER (Authentication - new schema)
-- ================================================================
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `person_id` INT(11) DEFAULT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `username` VARCHAR(80) DEFAULT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','directeur','fondateur','enseignant','parent') NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_personne` FOREIGN KEY (`person_id`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 5. ANNEE_ACADEMIQUE (School Year)
-- ================================================================
CREATE TABLE IF NOT EXISTS `annee_academique` (
  `idAnnee` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(100) NOT NULL,
  `periode` VARCHAR(100) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idAnnee`),
  CONSTRAINT `fk_aa_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 6. TRIMESTRE (Term)
-- ================================================================
CREATE TABLE IF NOT EXISTS `trimestre` (
  `idTrimes` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(100) NOT NULL,
  `ordre` TINYINT(4) NOT NULL DEFAULT 1,
  `date_debut` DATE DEFAULT NULL,
  `date_fin` DATE DEFAULT NULL,
  `periode` VARCHAR(100) DEFAULT NULL,
  `idAca` INT(11) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idTrimes`),
  CONSTRAINT `fk_trim_annee` FOREIGN KEY (`idAca`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  CONSTRAINT `fk_trim_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 7. SEQUENCE (Sub-term / Sequence)
-- ================================================================
CREATE TABLE IF NOT EXISTS `sequence` (
  `idSequence` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `date_debut` DATE DEFAULT NULL,
  `date_fin` DATE DEFAULT NULL,
  `idTrimestre` INT(11) NOT NULL,
  `idPers` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idSequence`),
  CONSTRAINT `fk_seq_trimestre` FOREIGN KEY (`idTrimestre`) REFERENCES `trimestre` (`idTrimes`) ON DELETE CASCADE,
  CONSTRAINT `fk_seq_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 8. CYCLE (Educational Cycle)
-- ================================================================
CREATE TABLE IF NOT EXISTS `cycle` (
  `idCycle` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`idCycle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cycle` (`idCycle`, `libelle`) VALUES
(1, 'Cycle Francophone'),
(2, 'Cycle Anglophone'),
(3, 'Cycle Bilingue');

-- ================================================================
-- 9. SALLE (Classroom)
-- ================================================================
CREATE TABLE IF NOT EXISTS `salle` (
  `idSalle` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(50) NOT NULL,
  `capacite` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idSalle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 10. CLASSE (Class)
-- ================================================================
CREATE TABLE IF NOT EXISTS `classe` (
  `idClasse` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(100) NOT NULL,
  `niveau` ENUM('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') NOT NULL,
  `section` ENUM('francophone','anglophone','bilingue') DEFAULT 'francophone',
  `idCycle` INT(11) DEFAULT NULL,
  `idSalle` INT(11) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idClasse`),
  CONSTRAINT `fk_classe_cycle` FOREIGN KEY (`idCycle`) REFERENCES `cycle` (`idCycle`) ON DELETE SET NULL,
  CONSTRAINT `fk_classe_salle` FOREIGN KEY (`idSalle`) REFERENCES `salle` (`idSalle`) ON DELETE SET NULL,
  CONSTRAINT `fk_classe_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 11. ELEVE (Student)
-- ================================================================
CREATE TABLE IF NOT EXISTS `eleve` (
  `matricule` INT(11) NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(60) NOT NULL,
  `prenom` VARCHAR(60) DEFAULT NULL,
  `dateNaissance` DATE DEFAULT NULL,
  `lieuNaissance` VARCHAR(30) DEFAULT NULL,
  `sexe` CHAR(1) DEFAULT NULL COMMENT 'M/F',
  `photoURL` VARCHAR(255) DEFAULT NULL,
  `idClasse` INT(11) DEFAULT NULL,
  `idVilleNaissance` INT(11) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `idPers` INT(11) DEFAULT NULL,
  `actif` TINYINT(4) DEFAULT 1,
  `statut` ENUM('actif','inactif','transfere','diplome','radie') DEFAULT 'actif',
  `date_inscription` DATE DEFAULT NULL,
  `niveau` ENUM('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`matricule`),
  CONSTRAINT `fk_eleve_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE SET NULL,
  CONSTRAINT `fk_eleve_ville` FOREIGN KEY (`idVilleNaissance`) REFERENCES `ville` (`idVille`) ON DELETE SET NULL,
  CONSTRAINT `fk_eleve_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `fk_eleve_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 12. PARENT (Parent/Guardian)
-- ================================================================
CREATE TABLE IF NOT EXISTS `parent` (
  `idParent` INT(11) NOT NULL AUTO_INCREMENT,
  `idPers` INT(11) NOT NULL,
  `matricule` INT(11) NOT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `relation` ENUM('pere','mere','tuteur') DEFAULT 'tuteur',
  `is_primary` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idParent`),
  CONSTRAINT `fk_parent_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE CASCADE,
  CONSTRAINT `fk_parent_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `fk_parent_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `fk_parent_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 13. ENSEIGNANT (Teacher)
-- ================================================================
CREATE TABLE IF NOT EXISTS `enseignant` (
  `idEnseignant` INT(11) NOT NULL AUTO_INCREMENT,
  `idPers` INT(11) NOT NULL,
  `matricule` VARCHAR(30) NOT NULL UNIQUE,
  `specialite` VARCHAR(100) DEFAULT NULL,
  `date_embauche` DATE DEFAULT NULL,
  `telephone` VARCHAR(20) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `actif` TINYINT(4) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idEnseignant`),
  CONSTRAINT `fk_ens_personne` FOREIGN KEY (`idPers`) REFERENCES `personne` (`idPers`) ON DELETE CASCADE,
  CONSTRAINT `fk_ens_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `fk_enseignant_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 14. ENSEIGNER (Teach - Class Teacher Assignment)
-- ================================================================
CREATE TABLE IF NOT EXISTS `enseigner` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idEnseignant` INT(11) NOT NULL,
  `idClasse` INT(11) NOT NULL,
  `idAnnee` INT(11) NOT NULL,
  `is_principal` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ens_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  CONSTRAINT `fk_ens_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  CONSTRAINT `fk_ens_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  UNIQUE KEY `uq_enseigner` (`idEnseignant`, `idClasse`, `idAnnee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 15. MATIERE (Subject)
-- ================================================================
CREATE TABLE IF NOT EXISTS `matiere` (
  `idMatiere` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(255) NOT NULL,
  `code` VARCHAR(20) DEFAULT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `coefficient` FLOAT DEFAULT 1,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idMatiere`),
  CONSTRAINT `fk_matiere_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 16. MATIERE_CLASSE (Junction table - Subject assigned to Class)
-- ================================================================
CREATE TABLE IF NOT EXISTS `matiere_classe` (
  `matiere_id` INT(11) NOT NULL,
  `classe_id` INT(11) NOT NULL,
  `coefficient` FLOAT DEFAULT 1,
  `enseignant_id` INT(11) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`matiere_id`, `classe_id`),
  CONSTRAINT `fk_mc_matiere` FOREIGN KEY (`matiere_id`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  CONSTRAINT `fk_mc_classe` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  CONSTRAINT `fk_mc_enseignant` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 17. ENSEIGNER_MATIERE (Teacher teaches Subject)
-- ================================================================
CREATE TABLE IF NOT EXISTS `enseigner_matiere` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idEnseignant` INT(11) NOT NULL,
  `idMatiere` INT(11) NOT NULL,
  `idClasse` INT(11) NOT NULL,
  `idAnnee` INT(11) NOT NULL,
  `coefficient` FLOAT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_em_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  CONSTRAINT `fk_em_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  CONSTRAINT `fk_em_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  CONSTRAINT `fk_em_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  UNIQUE KEY `uq_enseigner_matiere` (`idEnseignant`, `idMatiere`, `idClasse`, `idAnnee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 18. FREQUENTE (Student attends Class)
-- ================================================================
CREATE TABLE IF NOT EXISTS `frequente` (
  `matricule` INT(11) NOT NULL,
  `idClasse` INT(11) NOT NULL,
  `idAnnee` INT(11) NOT NULL,
  `date_debut` DATE DEFAULT NULL,
  `date_fin` DATE DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`matricule`, `idClasse`, `idAnnee`),
  CONSTRAINT `fk_freq_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `fk_freq_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  CONSTRAINT `fk_freq_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 19. NATURE_EPREUVE (Exam Type)
-- ================================================================
CREATE TABLE IF NOT EXISTS `nature_epreuve` (
  `idNature` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `libelle` VARCHAR(50) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `coefficient` FLOAT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idNature`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nature_epreuve` (`code`, `libelle`, `description`, `coefficient`) VALUES
('DEVOIR', 'Devoir', 'Devoir surveillé ou à la maison', 1.0),
('INTERRO', 'Interrogation', 'Interrogation écrite ou orale', 0.5),
('EXAMEN', 'Examen', 'Examen de fin de trimestre', 2.0),
('COMPO', 'Composition', 'Composition de fin d\'année', 3.0),
('TP', 'Travaux Pratiques', 'Travaux pratiques', 1.0);

-- ================================================================
-- 20. EPREUVE (Exam)
-- ================================================================
CREATE TABLE IF NOT EXISTS `epreuve` (
  `idEpreuve` INT(11) NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `duree_minutes` SMALLINT(6) DEFAULT NULL,
  `coefficient` FLOAT DEFAULT 1,
  `total_points` DECIMAL(5,2) DEFAULT 20.00,
  `date_epreuve` DATE DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 0,
  `date_publication` DATETIME DEFAULT NULL,
  `fichier_sujet` VARCHAR(255) DEFAULT NULL,
  `fichier_correction` VARCHAR(255) DEFAULT NULL,
  `idNature` INT(11) NOT NULL,
  `idMatiere` INT(11) NOT NULL,
  `idClasse` INT(11) NOT NULL,
  `idEnseignant` INT(11) NOT NULL,
  `idTrimestre` INT(11) NOT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`idEpreuve`),
  CONSTRAINT `fk_epreuve_nature` FOREIGN KEY (`idNature`) REFERENCES `nature_epreuve` (`idNature`) ON DELETE RESTRICT,
  CONSTRAINT `fk_epreuve_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  CONSTRAINT `fk_epreuve_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  CONSTRAINT `fk_epreuve_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  CONSTRAINT `fk_epreuve_trimestre` FOREIGN KEY (`idTrimestre`) REFERENCES `trimestre` (`idTrimes`) ON DELETE CASCADE,
  CONSTRAINT `fk_epreuve_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 21. EPREUVE_NOTE (Exam Grade)
-- ================================================================
CREATE TABLE IF NOT EXISTS `epreuve_note` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `note` DECIMAL(5,2) DEFAULT NULL,
  `appreciation` VARCHAR(255) DEFAULT NULL,
  `idEpreuve` INT(11) NOT NULL,
  `matricule` INT(11) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_en_epreuve` FOREIGN KEY (`idEpreuve`) REFERENCES `epreuve` (`idEpreuve`) ON DELETE CASCADE,
  CONSTRAINT `fk_en_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  UNIQUE KEY `uq_epreuve_eleve` (`idEpreuve`, `matricule`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 22. NOTE (Grade - keeps historical record)
-- ================================================================
CREATE TABLE IF NOT EXISTS `note` (
  `idNote` INT(11) NOT NULL AUTO_INCREMENT,
  `note` FLOAT NOT NULL,
  `appreciation` VARCHAR(255) DEFAULT NULL,
  `matricule` INT(11) NOT NULL,
  `idMatiere` INT(11) NOT NULL,
  `idSequence` INT(11) NOT NULL,
  `idEnseignant` INT(11) NOT NULL,
  `idEpreuve` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idNote`),
  CONSTRAINT `fk_note_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `fk_note_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  CONSTRAINT `fk_note_sequence` FOREIGN KEY (`idSequence`) REFERENCES `sequence` (`idSequence`) ON DELETE CASCADE,
  CONSTRAINT `fk_note_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  CONSTRAINT `fk_note_epreuve` FOREIGN KEY (`idEpreuve`) REFERENCES `epreuve` (`idEpreuve`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 23. BULLETIN (Report Card)
-- ================================================================
CREATE TABLE IF NOT EXISTS `bulletin` (
  `idBulletin` INT(11) NOT NULL AUTO_INCREMENT,
  `matricule` INT(11) NOT NULL,
  `idSequence` INT(11) NOT NULL,
  `moyenne_generale` FLOAT DEFAULT NULL,
  `rang` SMALLINT(6) DEFAULT NULL,
  `effectif_classe` SMALLINT(6) DEFAULT NULL,
  `appreciation` TEXT DEFAULT NULL,
  `conduite` VARCHAR(40) DEFAULT NULL,
  `soin` VARCHAR(40) DEFAULT NULL,
  `ponctualite` VARCHAR(40) DEFAULT NULL,
  `absences` SMALLINT(6) DEFAULT 0,
  `retards` SMALLINT(6) DEFAULT 0,
  `date_conseil` DATE DEFAULT NULL,
  `pdf_path` VARCHAR(255) DEFAULT NULL,
  `est_publie` TINYINT(1) DEFAULT 0,
  `date_publication` DATETIME DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idBulletin`),
  CONSTRAINT `fk_bul_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `fk_bul_sequence` FOREIGN KEY (`idSequence`) REFERENCES `sequence` (`idSequence`) ON DELETE CASCADE,
  CONSTRAINT `fk_bul_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 24. BULLETIN_LIGNE (Report Card Line)
-- ================================================================
CREATE TABLE IF NOT EXISTS `bulletin_ligne` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `idBulletin` INT(11) NOT NULL,
  `idMatiere` INT(11) NOT NULL,
  `note` FLOAT DEFAULT NULL,
  `coefficient` FLOAT DEFAULT 1,
  `appreciation` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_bl_bulletin` FOREIGN KEY (`idBulletin`) REFERENCES `bulletin` (`idBulletin`) ON DELETE CASCADE,
  CONSTRAINT `fk_bl_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 25. PRESENCE (Attendance)
-- ================================================================
CREATE TABLE IF NOT EXISTS `presence` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `matricule` INT(11) NOT NULL,
  `date` DATE NOT NULL,
  `statut` ENUM('present','absent','justifie','retard') NOT NULL DEFAULT 'present',
  `motif_absence` VARCHAR(255) DEFAULT NULL,
  `piece_jointe` VARCHAR(255) DEFAULT NULL,
  `justifiee` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pres_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  UNIQUE KEY `uq_presence_eleve_date` (`matricule`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 26. RETARD (Tardiness)
-- ================================================================
CREATE TABLE IF NOT EXISTS `retard` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `matricule` INT(11) NOT NULL,
  `date` DATETIME NOT NULL,
  `duree` INT(11) DEFAULT NULL COMMENT 'en minutes',
  `motif` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_retard_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 27. TYPE_INCIDENT (Incident Type)
-- ================================================================
CREATE TABLE IF NOT EXISTS `type_incident` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `type_incident` (`nom`, `description`) VALUES
('Retard', 'Arrivée en retard en classe'),
('Insolence', 'Manque de respect envers un enseignant'),
('Bagarre', 'Conflit physique avec un autre élève'),
('Dégradation', 'Détérioration de matériel ou de locaux'),
('Absence injustifiée', 'Absence non justifiée'),
('Autre', 'Autre type d\'incident');

-- ================================================================
-- 28. INCIDENT (Disciplinary Incident)
-- ================================================================
CREATE TABLE IF NOT EXISTS `incident` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `gravite` INT(11) DEFAULT 0 COMMENT '1-5',
  `matricule` INT(11) NOT NULL,
  `idTypeIncident` INT(11) NOT NULL,
  `idEnseignant` INT(11) NOT NULL,
  `idAnnee` INT(11) DEFAULT NULL,
  `date_incident` DATE DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_inc_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `fk_inc_type` FOREIGN KEY (`idTypeIncident`) REFERENCES `type_incident` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_inc_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  CONSTRAINT `fk_inc_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 29. SANCTION (Punishment)
-- ================================================================
CREATE TABLE IF NOT EXISTS `sanction` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `type_sanction` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `date` DATE DEFAULT NULL,
  `idIncident` INT(11) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sanction_incident` FOREIGN KEY (`idIncident`) REFERENCES `incident` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 30. FRAIS (Fee Type)
-- ================================================================
CREATE TABLE IF NOT EXISTS `frais` (
  `idFrais` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `libelle` VARCHAR(80) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idFrais`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `frais` (`code`, `libelle`, `description`) VALUES
('INSCRIPTION', 'Frais d\'inscription', 'Frais d\'inscription annuelle'),
('SCOLARITE', 'Scolarité', 'Frais de scolarité'),
('TRANSPORT', 'Transport', 'Frais de transport scolaire');

-- ================================================================
-- 31. ECHEANCIER (Fee Schedule / Tranche)
-- ================================================================
CREATE TABLE IF NOT EXISTS `echeancier` (
  `idEcheancier` INT(11) NOT NULL AUTO_INCREMENT,
  `libelle` VARCHAR(60) NOT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `date_echeance` DATE DEFAULT NULL,
  `ordre` TINYINT(4) DEFAULT 1,
  `idFrais` INT(11) NOT NULL,
  `idAnnee` INT(11) NOT NULL,
  `niveau` ENUM('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idEcheancier`),
  CONSTRAINT `fk_ech_frais` FOREIGN KEY (`idFrais`) REFERENCES `frais` (`idFrais`) ON DELETE CASCADE,
  CONSTRAINT `fk_ech_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  CONSTRAINT `fk_echeancier_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 32. PAIEMENT (Payment)
-- ================================================================
CREATE TABLE IF NOT EXISTS `paiement` (
  `idPaiement` INT(11) NOT NULL AUTO_INCREMENT,
  `matricule` INT(11) NOT NULL,
  `idAnnee` INT(11) NOT NULL,
  `idEcheancier` INT(11) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `montant` DECIMAL(10,2) NOT NULL,
  `mode_paiement` ENUM('especes','mobile_money','virement','cheque') DEFAULT 'especes',
  `statut` ENUM('paye','partiel','annule') DEFAULT 'paye',
  `numero_recu` VARCHAR(50) NOT NULL UNIQUE,
  `operation_ID` VARCHAR(50) DEFAULT NULL,
  `commentaire` VARCHAR(255) DEFAULT NULL,
  `date_paiement` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idPaiement`),
  CONSTRAINT `fk_paiement_eleve` FOREIGN KEY (`matricule`) REFERENCES `eleve` (`matricule`) ON DELETE CASCADE,
  CONSTRAINT `fk_paiement_echeancier` FOREIGN KEY (`idEcheancier`) REFERENCES `echeancier` (`idEcheancier`) ON DELETE SET NULL,
  CONSTRAINT `fk_paiement_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  CONSTRAINT `fk_paiement_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 33. EMPLOI_DU_TEMPS (Timetable)
-- ================================================================
CREATE TABLE IF NOT EXISTS `emploi_du_temps` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `jour` ENUM('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi') NOT NULL,
  `heure_debut` TIME NOT NULL,
  `heure_fin` TIME NOT NULL,
  `idClasse` INT(11) NOT NULL,
  `idMatiere` INT(11) NOT NULL,
  `idEnseignant` INT(11) NOT NULL,
  `idAnnee` INT(11) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_edt_classe` FOREIGN KEY (`idClasse`) REFERENCES `classe` (`idClasse`) ON DELETE CASCADE,
  CONSTRAINT `fk_edt_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  CONSTRAINT `fk_edt_enseignant` FOREIGN KEY (`idEnseignant`) REFERENCES `enseignant` (`idEnseignant`) ON DELETE CASCADE,
  CONSTRAINT `fk_edt_annee` FOREIGN KEY (`idAnnee`) REFERENCES `annee_academique` (`idAnnee`) ON DELETE CASCADE,
  UNIQUE KEY `uq_edt_classe_jour_heure` (`idClasse`, `jour`, `heure_debut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 34. MESSAGE (Internal Messaging)
-- ================================================================
CREATE TABLE IF NOT EXISTS `message` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `sujet` VARCHAR(255) DEFAULT NULL,
  `corps` TEXT NOT NULL,
  `type` ENUM('general','urgence','reclamation') DEFAULT 'general',
  `lu` TINYINT(1) DEFAULT 0,
  `date_envoi` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `date_lecture` DATETIME DEFAULT NULL,
  `idExpediteur` INT(11) NOT NULL,
  `idDestinataire` INT(11) NOT NULL,
  `idParent` INT(11) DEFAULT NULL,
  `reponse_a_id` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_msg_expediteur` FOREIGN KEY (`idExpediteur`) REFERENCES `admin` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_destinataire` FOREIGN KEY (`idDestinataire`) REFERENCES `admin` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_parent` FOREIGN KEY (`idParent`) REFERENCES `parent` (`idParent`) ON DELETE SET NULL,
  CONSTRAINT `fk_msg_reponse` FOREIGN KEY (`reponse_a_id`) REFERENCES `message` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 35. BANQUE_EPREUVES (Exam Bank)
-- ================================================================
CREATE TABLE IF NOT EXISTS `banque_epreuves` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `fichier` VARCHAR(255) DEFAULT NULL,
  `idMatiere` INT(11) NOT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_be_matiere` FOREIGN KEY (`idMatiere`) REFERENCES `matiere` (`idMatiere`) ON DELETE CASCADE,
  CONSTRAINT `fk_be_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 36. CONFIG (System Configuration)
-- ================================================================
CREATE TABLE IF NOT EXISTS `config` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cle` VARCHAR(100) NOT NULL UNIQUE,
  `valeur` TEXT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `config` (`cle`, `valeur`, `description`) VALUES
('ecole_nom', 'École Les Étoiles', 'Nom de l\'école'),
('ecole_ville', 'Yaoundé', 'Ville de l\'école'),
('ecole_email', 'contact@lesetoiles.cm', 'Email de contact'),
('ecole_telephone', '+237 677 000 000', 'Téléphone de contact'),
('annee_courante', '2025-2026', 'Année scolaire en cours'),
('frais_inscription', '25000', 'Frais d\'inscription par défaut'),
('frais_scolarite', '120000', 'Frais de scolarité annuel par défaut'),
('frais_transport', '15000', 'Frais de transport annuel par défaut');

-- ================================================================
-- 37. LOG_ACTIONS (Audit Trail)
-- ================================================================

CREATE TABLE IF NOT EXISTS `log_actions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `action` VARCHAR(100) NOT NULL,
  `table_name` VARCHAR(50) DEFAULT NULL,
  `record_id` VARCHAR(50) DEFAULT NULL,
  `ancienne_valeur` TEXT DEFAULT NULL,
  `nouvelle_valeur` TEXT DEFAULT NULL,
  `ip_adresse` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `idAdmin` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_log_admin` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- MESSAGING MODULE - Database Updates
-- Execute this to update your existing database
-- ================================================================

-- 1. Add new columns to messages table
ALTER TABLE `messages` 
ADD COLUMN `sujet` VARCHAR(255) DEFAULT 'Message' AFTER `destinataire_id`,
ADD COLUMN `type` ENUM('general','urgence','reclamation','notification') DEFAULT 'general' AFTER `corps`,
ADD COLUMN `lu_at` DATETIME DEFAULT NULL AFTER `lu`,
ADD COLUMN `parent_id` INT(11) DEFAULT NULL AFTER `lu_at`,
ADD COLUMN `reponse_a_id` INT(11) DEFAULT NULL AFTER `parent_id`,
ADD INDEX `idx_msg_parent` (`parent_id`),
ADD INDEX `idx_msg_reponse` (`reponse_a_id`),
ADD CONSTRAINT `fk_msg_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`idParent`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_msg_reponse` FOREIGN KEY (`reponse_a_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `type` ENUM('payment_due','payment_overdue','new_message','exam_published','grade_published','incident','system') NOT NULL,
  `titre` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `lien` VARCHAR(255) DEFAULT NULL,
  `lu` TINYINT(1) DEFAULT 0,
  `lu_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user` (`user_id`),
  INDEX `idx_notif_lu` (`lu`),
  INDEX `idx_notif_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ================================================================
-- 38. PERFORMANCE INDEXES
-- ================================================================

-- Payment indexes
CREATE INDEX idx_paiement_matricule ON paiement(matricule);
CREATE INDEX idx_paiement_idAnnee ON paiement(idAnnee);
CREATE INDEX idx_paiement_idEcheancier ON paiement(idEcheancier);
CREATE INDEX idx_paiement_statut ON paiement(statut);
CREATE INDEX idx_paiement_date ON paiement(date_paiement);

-- Exam indexes
CREATE INDEX idx_epreuve_idMatiere ON epreuve(idMatiere);
CREATE INDEX idx_epreuve_idClasse ON epreuve(idClasse);
CREATE INDEX idx_epreuve_idTrimestre ON epreuve(idTrimestre);
CREATE INDEX idx_epreuve_date ON epreuve(date_epreuve);
CREATE INDEX idx_epreuve_idNature ON epreuve(idNature);

-- Student indexes
CREATE INDEX idx_eleve_idClasse ON eleve(idClasse);
CREATE INDEX idx_eleve_actif ON eleve(actif);
CREATE INDEX idx_eleve_nom ON eleve(nom);

-- Note indexes
CREATE INDEX idx_note_matricule ON note(matricule);
CREATE INDEX idx_note_idMatiere ON note(idMatiere);
CREATE INDEX idx_note_idSequence ON note(idSequence);

-- Presence indexes
CREATE INDEX idx_presence_matricule ON presence(matricule);
CREATE INDEX idx_presence_date ON presence(date);

-- Incident indexes
CREATE INDEX idx_incident_matricule ON incident(matricule);
CREATE INDEX idx_incident_idType ON incident(idTypeIncident);
CREATE INDEX idx_incident_idAnnee ON incident(idAnnee);

-- Echeancier indexes
CREATE INDEX idx_echeancier_idAnnee ON echeancier(idAnnee);
CREATE INDEX idx_echeancier_idFrais ON echeancier(idFrais);
CREATE INDEX idx_echeancier_niveau ON echeancier(niveau);

-- Message indexes
CREATE INDEX idx_message_idExpediteur ON message(idExpediteur);
CREATE INDEX idx_message_idDestinataire ON message(idDestinataire);
CREATE INDEX idx_message_date_envoi ON message(date_envoi);

-- Parent indexes
CREATE INDEX idx_parent_matricule ON parent(matricule);
CREATE INDEX idx_parent_idPers ON parent(idPers);

-- Enseignant indexes
CREATE INDEX idx_enseignant_idPers ON enseignant(idPers);
CREATE INDEX idx_enseignant_matricule ON enseignant(matricule);

-- Classe indexes
CREATE INDEX idx_classe_niveau ON classe(niveau);
CREATE INDEX idx_classe_idCycle ON classe(idCycle);

SET FOREIGN_KEY_CHECKS = 1;