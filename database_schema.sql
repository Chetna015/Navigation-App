-- ==========================================================================
-- CSJMU Smart Campus & AI Summit 2026 Database Schema Script (SQL)
-- Target Engines: PostgreSQL, MySQL, SQLite3
-- ==========================================================================

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Locations Table (Outdoor GIS Map Pins)
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    category VARCHAR(100) DEFAULT 'Academic Block',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    x INTEGER,
    y INTEGER,
    floors INTEGER DEFAULT 2,
    description TEXT,
    cover_image VARCHAR(255),
    video_url VARCHAR(255),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Departments Table (Housed Departments inside Buildings)
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- SQLite syntax (for PostgreSQL use SERIAL, for MySQL AUTO_INCREMENT)
    location_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- 4. Rooms Table (Indoor Rooms on Floor plans)
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(100) PRIMARY KEY,
    location_id VARCHAR(100) NOT NULL,
    floor_level VARCHAR(50) NOT NULL, -- e.g. 'ground', 'floor1', 'floor2'
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Classroom',
    capacity VARCHAR(100),
    equipment TEXT,
    current_event TEXT,
    status VARCHAR(100) DEFAULT 'Active',
    coord_x INTEGER DEFAULT 0,
    coord_y INTEGER DEFAULT 0,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- 5. Watercoolers Table (Purifiers network inside Buildings)
CREATE TABLE IF NOT EXISTS water_coolers (
    id VARCHAR(100) PRIMARY KEY,
    location_id VARCHAR(100) NOT NULL,
    floor_level VARCHAR(50) NOT NULL, -- e.g. 'ground', 'floor1', 'floor2'
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'RO + UV Purifier',
    temperature VARCHAR(50) DEFAULT '6.0°C',
    purity VARCHAR(50) DEFAULT '99.9%',
    capacity VARCHAR(50) DEFAULT '80 L/hr',
    status VARCHAR(100) DEFAULT 'Operational',
    image VARCHAR(255) DEFAULT '/assets/buildings/watercooler_ro.jpg',
    location_description TEXT,
    coord_x INTEGER DEFAULT 0,
    coord_y INTEGER DEFAULT 0,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- 6. Panorama Nodes Table (360 Degree Virtual Reality Nodes)
CREATE TABLE IF NOT EXISTS panorama_nodes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    panorama_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Panorama Hotspots Table (Navigation Arrows inside 360 Views)
CREATE TABLE IF NOT EXISTS hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_node_id VARCHAR(100) NOT NULL,
    target_node_id VARCHAR(100) NOT NULL,
    text VARCHAR(255),
    yaw INTEGER DEFAULT 0,
    pitch INTEGER DEFAULT 0,
    FOREIGN KEY (source_node_id) REFERENCES panorama_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (target_node_id) REFERENCES panorama_nodes(id) ON DELETE CASCADE
);

-- ==========================================================================
-- SEED DATA (DEFAULT ENTRIES)
-- ==========================================================================

-- Insert Default Admin (Password is 'admin2026' hashed or plaintext for fallback check)
-- Hash generated using standard bcrypt algorithms
INSERT INTO admins (id, username, password_hash, email, role) 
VALUES ('usr_admin_01', 'admin', '$2b$10$7Z8q3sB0V9yQ/R1X/oT4De2FmF0hLp7Z9yQ8xO1tE4oV6p3sR8e/G', 'admin@csjmu.ac.in', 'superadmin');

-- Insert CSJM Grand Auditorium Example
INSERT INTO locations (id, name, code, category, lat, lng, x, y, floors, description)
VALUES ('loc_auditorium', 'CSJM Auditorium', 'BLD-650', 'Summit Venue', 26.504193, 80.268463, 490, 397, 1, 'Primary venue for the CSJMU AI Summit 2026 containing classrooms, keynote spaces, and exhibitions.');

-- Insert Departments
INSERT INTO departments (location_id, name) VALUES ('loc_auditorium', 'General Dept');
INSERT INTO departments (location_id, name) VALUES ('loc_auditorium', 'Faculty Offices');

-- Insert Room G-01
INSERT INTO rooms (id, location_id, floor_level, name, type, capacity, equipment, current_event, status, coord_x, coord_y)
VALUES ('G-01', 'loc_auditorium', 'ground', 'G-01: Reception & Visitor Registration', 'Lobby', '50 Seats', 'Ramp Access, Smart Terminals', 'Visitor check-in & delegate badging', 'Active Session', 120, 140);
