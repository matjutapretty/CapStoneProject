CREATE TABLE patient_record (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	Firstname TEXT NOT NULL,
	Lastname TEXT NOT NULL,
    DOB DATE NOT NULL,
    Gender TEXT NOT NULL,
    ConNo CHAR(12) NOT NULL,
    LangPref TEXT NOT NULL
);