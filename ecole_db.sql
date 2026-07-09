-- ================================================================
-- MERGED DATABASE: Ecole Les Étoiles
-- Combines ecole_db.sql + schema.sql
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================================
-- 1. VILLES (from ecole_db)
-- ================================================================
CREATE TABLE IF NOT EXISTS villenaissance (
  idVille INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nomVille VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO villenaissance (idVille, nomVille) VALUES
(1, 'Yaoundé'),
(2, 'Douala'),
(3, 'Bafoussam');

-- ================================================================
-- 2. ADMIN / USERS (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS admin (
  ID INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  actif TINYINT(4) NOT NULL DEFAULT 1,
  typeAdmin SMALLINT(6) NOT NULL,
  mobile VARCHAR(15) DEFAULT NULL,
  alanyaID VARCHAR(15) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users (new schema style with person_id)
CREATE TABLE IF NOT EXISTS users (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  person_id INT(11) NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  username VARCHAR(80) NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','directeur','fondateur','enseignant','parent') NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  -- Keep old fields for compatibility
  nom VARCHAR(100) NULL,
  prenom VARCHAR(100) NULL,
  actif TINYINT(4) DEFAULT 1,
  typeAdmin SMALLINT(6) DEFAULT 2,
  mobile VARCHAR(15) NULL,
  CONSTRAINT fk_users_person FOREIGN KEY (person_id) REFERENCES personne(idPers) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 3. PERSONNE (from ecole_db)
-- ================================================================
CREATE TABLE IF NOT EXISTS personne (
  idPers INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) DEFAULT NULL,
  prenom VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 4. ROLES (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (id, name) VALUES
(1, 'fondateur'),
(2, 'directeur'),
(3, 'admin'),
(4, 'enseignant'),
(5, 'parent');

CREATE TABLE IF NOT EXISTS userroles (
  UserId INT(11) DEFAULT NULL,
  RoleId INT(11) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_ur_user FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (RoleId) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 5. REFRESH TOKENS (from schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME NULL,
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================================================
-- 6. ANNEES SCOLAIRES (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS anneeacademique (
  idAnnee INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(100) NOT NULL,
  periode VARCHAR(100) DEFAULT NULL,
  idAdmin INT(11) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_aa_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- school_years (new schema style)
CREATE TABLE IF NOT EXISTS school_years (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================================================================
-- 7. CYCLES / CLASSES (from ecole_db)
-- ================================================================
CREATE TABLE IF NOT EXISTS cycle (
  idCycle INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO cycle (idCycle, libelle) VALUES
(1, 'Cycle Francophone'),
(2, 'Cycle Anglophone');

CREATE TABLE IF NOT EXISTS classes (
  idClasse INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(100) NOT NULL,
  idCycle INT(11) NOT NULL,
  idAdmin INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_classe_cycle FOREIGN KEY (idCycle) REFERENCES cycle(idCycle),
  CONSTRAINT fk_classe_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- school_classes (new schema style)
CREATE TABLE IF NOT EXISTS school_classes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  school_year_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(40) NOT NULL,
  level ENUM('PS','MS','GS','SIL','CP','CE1','CE2','CM1','CM2') NOT NULL,
  section ENUM('francophone','anglophone','bilingue') NOT NULL DEFAULT 'francophone',
  room_id BIGINT UNSIGNED NULL,
  main_teacher_id BIGINT UNSIGNED NULL,
  capacity SMALLINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sc_year FOREIGN KEY (school_year_id) REFERENCES school_years(id) ON DELETE CASCADE,
  CONSTRAINT fk_sc_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
  CONSTRAINT fk_sc_teacher FOREIGN KEY (main_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  UNIQUE KEY uq_sc_name_year (school_year_id, name)
) ENGINE=InnoDB;

-- ================================================================
-- 8. SALLES (ROOMS) (from schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS rooms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE,
  capacity SMALLINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================================================================
-- 9. ENSEIGNANTS (TEACHERS) (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS enseignants (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NULL,
  matricule VARCHAR(30) NOT NULL UNIQUE,
  specialite VARCHAR(100) NULL,
  telephone VARCHAR(20) NULL,
  actif TINYINT(4) DEFAULT 1,
  idAdmin INT(11) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_ens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_ens_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- teachers (new schema style)
CREATE TABLE IF NOT EXISTS teachers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  person_id BIGINT UNSIGNED NOT NULL,
  matricule VARCHAR(30) NOT NULL UNIQUE,
  date_embauche DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teachers_person FOREIGN KEY (person_id) REFERENCES personne(idPers) ON DELETE CASCADE
) ENGINE=InnoDB;

-- teacher_class_assignments (from schema.sql)
CREATE TABLE IF NOT EXISTS teacher_class_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  teacher_id BIGINT UNSIGNED NOT NULL,
  school_class_id BIGINT UNSIGNED NOT NULL,
  school_year_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tca_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  CONSTRAINT fk_tca_class FOREIGN KEY (school_class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_tca_year FOREIGN KEY (school_year_id) REFERENCES school_years(id) ON DELETE CASCADE,
  UNIQUE KEY uq_tca (teacher_id, school_class_id, school_year_id)
) ENGINE=InnoDB;

-- ================================================================
-- 10. ELEVES (STUDENTS) (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS eleves (
  matricule INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(60) NOT NULL,
  prenom VARCHAR(60) DEFAULT NULL,
  dateNaissance DATE DEFAULT NULL,
  lieuNaissance VARCHAR(30) DEFAULT NULL,
  sexe SMALLINT(6) DEFAULT NULL,
  langue VARCHAR(30) DEFAULT NULL,  -- classe_id in new schema
  photoURL VARCHAR(255) DEFAULT NULL,
  actif TINYINT(4) DEFAULT 1,
  idVilleNaissance INT(11) DEFAULT NULL,
  idAdmin INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  deleted_at DATETIME DEFAULT NULL,
  CONSTRAINT fk_eleve_ville FOREIGN KEY (idVilleNaissance) REFERENCES villenaissance(idVille),
  CONSTRAINT fk_eleve_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- students (new schema style)
CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  person_id BIGINT UNSIGNED NOT NULL,
  matricule VARCHAR(30) NOT NULL UNIQUE,
  school_class_id BIGINT UNSIGNED NULL,
  status ENUM('actif','inactif','transfere','diplome') NOT NULL DEFAULT 'actif',
  enrollment_date DATE NOT NULL,
  uses_bus TINYINT(1) NOT NULL DEFAULT 0,
  bus_line VARCHAR(80) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_person FOREIGN KEY (person_id) REFERENCES personne(idPers) ON DELETE CASCADE,
  CONSTRAINT fk_students_class FOREIGN KEY (school_class_id) REFERENCES school_classes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ================================================================
-- 11. PARENTS (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS parents (
  idParent INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idPers INT(11) NOT NULL,
  matricule INT(11) NOT NULL,
  idAdmin INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_parent_person FOREIGN KEY (idPers) REFERENCES personne(idPers),
  CONSTRAINT fk_parent_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule),
  CONSTRAINT fk_parent_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- parent_students (new schema style)
CREATE TABLE IF NOT EXISTS parent_students (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  relation ENUM('pere','mere','tuteur') NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ps_parent FOREIGN KEY (parent_id) REFERENCES parents(idParent) ON DELETE CASCADE,
  CONSTRAINT fk_ps_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_parent_student (parent_id, student_id)
) ENGINE=InnoDB;

-- student_class_history (from schema.sql)
CREATE TABLE IF NOT EXISTS student_class_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  school_class_id BIGINT UNSIGNED NOT NULL,
  school_year_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sch_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_sch_class FOREIGN KEY (school_class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_sch_year FOREIGN KEY (school_year_id) REFERENCES school_years(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================================================
-- 12. MATIERES (SUBJECTS) (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS matieres (
  idMatiere INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(255) NOT NULL,
  coefficient FLOAT DEFAULT 1,
  description TEXT NULL,
  idAdmin INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_matiere_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- subjects (new schema style)
CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- class_subjects (from schema.sql)
CREATE TABLE IF NOT EXISTS class_subjects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  school_class_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  teacher_id BIGINT UNSIGNED NULL,
  coefficient DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  order_index TINYINT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cs_class FOREIGN KEY (school_class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_cs_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  CONSTRAINT fk_cs_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  UNIQUE KEY uq_class_subject (school_class_id, subject_id)
) ENGINE=InnoDB;

-- ================================================================
-- 13. TRIMESTRES / SEQUENCES (from ecole_db)
-- ================================================================
CREATE TABLE IF NOT EXISTS trimestre (
  idTrimes INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(100) NOT NULL,
  periode VARCHAR(100) DEFAULT NULL,
  date_debut DATE NULL,
  date_fin DATE NULL,
  ordre TINYINT(4) DEFAULT 1,
  idAca INT(11) DEFAULT NULL,
  idAdmin INT(11) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_trim_annee FOREIGN KEY (idAca) REFERENCES anneeacademique(idAnnee),
  CONSTRAINT fk_trim_admin FOREIGN KEY (idAdmin) REFERENCES admin(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- terms (new schema style)
CREATE TABLE IF NOT EXISTS terms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  school_year_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(40) NOT NULL,
  order_index TINYINT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_terms_year FOREIGN KEY (school_year_id) REFERENCES school_years(id) ON DELETE CASCADE,
  UNIQUE KEY uq_term_year_order (school_year_id, order_index)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sequences (
  idSequence INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(255) NOT NULL,
  description TEXT NULL,
  idTrimestre INT(11) NOT NULL,
  date_debut DATE NULL,
  date_fin DATE NULL,
  idPers INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_seq_trimestre FOREIGN KEY (idTrimestre) REFERENCES trimestre(idTrimes),
  CONSTRAINT fk_seq_person FOREIGN KEY (idPers) REFERENCES personne(idPers)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 14. EPREUVES (EXAMS) (from ecole_db + new)
-- ================================================================
-- Nature épreuve (new)
CREATE TABLE IF NOT EXISTS nature_epreuve (
  idNature INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  libelle VARCHAR(50) NOT NULL,
  description TEXT NULL,
  coefficient FLOAT NOT NULL DEFAULT 1.00,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO nature_epreuve (code, libelle, description, coefficient) VALUES
('DEVOIR', 'Devoir', 'Devoir surveillé ou à la maison', 1.0),
('INTERRO', 'Interrogation', 'Interrogation écrite ou orale', 0.5),
('EXAMEN', 'Examen', 'Examen de fin de trimestre', 2.0),
('COMPO', 'Composition', 'Composition de fin d\'année', 3.0),
('TP', 'Travaux Pratiques', 'Travaux pratiques', 1.0);

-- Epreuves (new)
CREATE TABLE IF NOT EXISTS epreuve (
  idEpreuve INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idTrimestre INT(11) NOT NULL,
  idNature INT(11) NOT NULL,
  idMatiere INT(11) NOT NULL,
  idClasse INT(11) NOT NULL,
  idPers INT(11) NOT NULL,
  titre VARCHAR(200) NOT NULL,
  description TEXT NULL,
  duree_minutes SMALLINT(6) NULL,
  coefficient FLOAT NOT NULL DEFAULT 1.00,
  total_points DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  date_epreuve DATE NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  date_publication DATETIME NULL,
  fichier_sujet VARCHAR(255) NULL,
  fichier_correction VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_epreuve_trimestre FOREIGN KEY (idTrimestre) REFERENCES trimestre(idTrimes) ON DELETE CASCADE,
  CONSTRAINT fk_epreuve_nature FOREIGN KEY (idNature) REFERENCES nature_epreuve(idNature) ON DELETE RESTRICT,
  CONSTRAINT fk_epreuve_matiere FOREIGN KEY (idMatiere) REFERENCES matieres(idMatiere) ON DELETE CASCADE,
  CONSTRAINT fk_epreuve_classe FOREIGN KEY (idClasse) REFERENCES classes(idClasse) ON DELETE CASCADE,
  CONSTRAINT fk_epreuve_personne FOREIGN KEY (idPers) REFERENCES personne(idPers) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Epreuve notes
CREATE TABLE IF NOT EXISTS epreuve_notes (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idEpreuve INT(11) NOT NULL,
  matricule INT(11) NOT NULL,
  note DECIMAL(5,2) NULL,
  appreciation VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_en_epreuve FOREIGN KEY (idEpreuve) REFERENCES epreuve(idEpreuve) ON DELETE CASCADE,
  CONSTRAINT fk_en_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule) ON DELETE CASCADE,
  UNIQUE KEY uq_epreuve_eleve (idEpreuve, matricule)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 15. EVALUATIONS / NOTES / BULLETINS (from schema.sql)
-- ================================================================
-- grade_components
CREATE TABLE IF NOT EXISTS grade_components (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  class_subject_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(60) NOT NULL,
  weight_percent DECIMAL(5,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gc_class_subject FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- assessments
CREATE TABLE IF NOT EXISTS assessments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  class_subject_id BIGINT UNSIGNED NOT NULL,
  term_id BIGINT UNSIGNED NOT NULL,
  component_id BIGINT UNSIGNED NULL,
  title VARCHAR(120) NOT NULL,
  type ENUM('devoir','examen','interrogation','tp','autre') NOT NULL DEFAULT 'devoir',
  date DATE NOT NULL,
  max_points DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  created_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_assess_cs FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE,
  CONSTRAINT fk_assess_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  CONSTRAINT fk_assess_component FOREIGN KEY (component_id) REFERENCES grade_components(id) ON DELETE SET NULL,
  CONSTRAINT fk_assess_user FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- grades
CREATE TABLE IF NOT EXISTS grades (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  assessment_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  score DECIMAL(5,2) NULL,
  comment VARCHAR(255) NULL,
  created_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_grades_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT fk_grades_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_grades_user FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_grade_assessment_student (assessment_id, student_id)
) ENGINE=InnoDB;

-- notes (from ecole_db)
CREATE TABLE IF NOT EXISTS notes (
  idNote INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  note FLOAT NOT NULL,
  appreciation VARCHAR(255) DEFAULT NULL,
  matricule INT(11) NOT NULL,
  idEpreuve INT(11) NOT NULL,
  idMatiere INT(11) NOT NULL,
  idSequence INT(11) NOT NULL,
  idPers INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_note_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule),
  CONSTRAINT fk_note_epreuve FOREIGN KEY (idEpreuve) REFERENCES epreuve(idEpreuve),
  CONSTRAINT fk_note_matiere FOREIGN KEY (idMatiere) REFERENCES matieres(idMatiere),
  CONSTRAINT fk_note_sequence FOREIGN KEY (idSequence) REFERENCES sequences(idSequence),
  CONSTRAINT fk_note_person FOREIGN KEY (idPers) REFERENCES personne(idPers)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bulletins (from ecole_db)
CREATE TABLE IF NOT EXISTS bulletins (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  matricule INT(11) NOT NULL,
  idSequence INT(11) NOT NULL,
  moyenne_generale FLOAT DEFAULT NULL,
  appreciation TEXT DEFAULT NULL,
  pdf_path VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_bul_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule),
  CONSTRAINT fk_bul_sequence FOREIGN KEY (idSequence) REFERENCES sequences(idSequence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- report_cards (from schema.sql)
CREATE TABLE IF NOT EXISTS report_cards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  term_id BIGINT UNSIGNED NOT NULL,
  general_average DECIMAL(5,2) NULL,
  class_rank SMALLINT UNSIGNED NULL,
  class_size SMALLINT UNSIGNED NULL,
  conduct VARCHAR(40) NULL,
  neatness VARCHAR(40) NULL,
  punctuality VARCHAR(40) NULL,
  absences_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  lateness_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  general_comment VARCHAR(500) NULL,
  generated_by_user_id BIGINT UNSIGNED NULL,
  published_at DATETIME NULL,
  pdf_path VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rc_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_rc_term FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  CONSTRAINT fk_rc_user FOREIGN KEY (generated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_rc_student_term (student_id, term_id)
) ENGINE=InnoDB;

-- report_card_lines
CREATE TABLE IF NOT EXISTS report_card_lines (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  report_card_id BIGINT UNSIGNED NOT NULL,
  class_subject_id BIGINT UNSIGNED NOT NULL,
  average DECIMAL(5,2) NULL,
  coefficient DECIMAL(4,2) NOT NULL,
  teacher_comment VARCHAR(255) NULL,
  CONSTRAINT fk_rcl_report FOREIGN KEY (report_card_id) REFERENCES report_cards(id) ON DELETE CASCADE,
  CONSTRAINT fk_rcl_class_subject FOREIGN KEY (class_subject_id) REFERENCES class_subjects(id) ON DELETE CASCADE,
  UNIQUE KEY uq_rcl (report_card_id, class_subject_id)
) ENGINE=InnoDB;

-- ================================================================
-- 16. INCIDENTS / SANCTIONS (from ecole_db)
-- ================================================================
CREATE TABLE IF NOT EXISTS typeincidents (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO typeincidents (id, nom, description) VALUES
(1, 'Retard', 'Arrivée en retard en classe'),
(2, 'Insolence', 'Manque de respect envers un enseignant'),
(3, 'Bagarre', 'Conflit physique avec un autre élève'),
(4, 'Dégradation', 'Détérioration de matériel ou de locaux'),
(5, 'Absence injustifiée', 'Absence non justifiée'),
(6, 'Autre', 'Autre type d\'incident');

CREATE TABLE IF NOT EXISTS incidents (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(100) NOT NULL,
  points INT(11) DEFAULT 0,
  matricule INT(11) NOT NULL,
  idAnnee INT(11) NOT NULL,
  commentaire TEXT NULL,
  event_date DATE NULL,
  idPers INT(11) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_inc_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule),
  CONSTRAINT fk_inc_annee FOREIGN KEY (idAnnee) REFERENCES anneeacademique(idAnnee),
  CONSTRAINT fk_inc_person FOREIGN KEY (idPers) REFERENCES personne(idPers)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sanctions (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  incident_id INT(11) NOT NULL,
  type_sanction VARCHAR(100) NOT NULL,
  description TEXT NULL,
  date DATE DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_sanction_incident FOREIGN KEY (incident_id) REFERENCES incidents(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 17. PRESENCES / RETARDS (from ecole_db + schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS presences (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  matricule INT(11) NOT NULL,
  date DATE NOT NULL,
  statut ENUM('present','absent','justifie') NOT NULL,
  motif_absence VARCHAR(255) DEFAULT NULL,
  piece_jointe VARCHAR(255) DEFAULT NULL,
  justifiee TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_pres_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- attendances (from schema.sql)
CREATE TABLE IF NOT EXISTS attendances (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  school_class_id BIGINT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent','retard','excuse') NOT NULL DEFAULT 'present',
  comment VARCHAR(255) NULL,
  recorded_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_att_class FOREIGN KEY (school_class_id) REFERENCES school_classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_att_user FOREIGN KEY (recorded_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_att_student_date (student_id, date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS retards (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  matricule INT(11) NOT NULL,
  date DATETIME NOT NULL,
  duree INT(11) DEFAULT NULL COMMENT 'en minutes',
  motif VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
  CONSTRAINT fk_retard_eleve FOREIGN KEY (matricule) REFERENCES eleves(matricule)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 18. FRAIS SCOLAIRES / PAIEMENTS (from schema.sql)
-- ================================================================
CREATE TABLE IF NOT EXISTS fee_types (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fee_schedules (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  school
