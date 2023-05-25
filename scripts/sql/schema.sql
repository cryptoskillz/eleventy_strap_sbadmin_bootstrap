DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS projectData;
DROP TABLE IF EXISTS projectSchema;

DROP TABLE IF EXISTS projectImages;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS userAccess;
DROP TABLE IF EXISTS userSettings;

CREATE TABLE "projects" (
	"id"	INTEGER,
	"guid" INTEGER,
	"name"	TEXT,
	"template"	TEXT,
	"templateName" TEXT,
	"schema" TEXT,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "projects" ("id","guid","name","template","templateName") VALUES(1, '99ad01ac-062d-44f1-3c9d-69e1bf815700','Project 1','<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>HTML 5 Boilerplate</title>
    first name {{firstName}} <br>
    second name {{secondName}} <br>
  </head>
  <body>
  </body>
</html>','html5 Template');

CREATE TABLE "projectData" (
	"id" INTEGER,
	"projectId" INTEGER,
	"projectDataId" TEXT,
	"schemaId" INTEGER,
	"fieldValue" TEXT,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "projectData" ("projectId","projectDataId","schemaId","fieldValue") VALUES(1,'402b4c09-41d7-4159-a69a-165a887f5baa',1,'Chris');
INSERT INTO "projectData" ("projectId","projectDataId","schemaId","fieldValue") VALUES(1,'402b4c09-41d7-4159-a69a-165a887f5baa',2,'McC');
INSERT INTO "projectData" ("projectId","projectDataId","schemaId","fieldValue") VALUES(1,'57d8de63-6eac-4e10-bee3-8a2ab853b623',1,'Chris2');
INSERT INTO "projectData" ("projectId","projectDataId","schemaId","fieldValue") VALUES(1,'57d8de63-6eac-4e10-bee3-8a2ab853b623',2,'Mc2');


CREATE TABLE "projectSchema" (
	"id" INTEGER,
	"projectId" INTEGER,
	"fieldName" TEXT,
	"isUsed" INTEGER DEFAULT 1,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "projectSchema" ("projectId","fieldName") VALUES(1,'firstName');
INSERT INTO "projectSchema" ("projectId","fieldName") VALUES(1,'secondName');




CREATE TABLE "projectImages" (
	"id"	INTEGER,
	"propertyId" INTEGER,
	"cfid"	INTEGER,
	"filename"	TEXT,
	"url" TEXT,
	"draft" INTEGER DEFAULT 1,
	"isDeleted" INTEGER DEFAULT 0,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);


INSERT INTO "project_images" ("propertyId","cfid","filename","url") VALUES(1, '99ad01ac-062d-44f1-3c9d-69e1bf815700','Dcondo-Sign-Chiang-Mai-rental-condos-1.webp','https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/99ad01ac-062d-44f1-3c9d-69e1bf815700/public');



CREATE TABLE "user" (
	"id"	INTEGER,
	"name"	TEXT,
	"email" TEXT,
	"phone" TEXT,
	"cryptoAddress" TEXT,
	"username" TEXT,
	"password" TEXT,
	"apiSecret" TEXT,
	"confirmed" TEXT DEFAULT 0,
	"verifyCode" TEXT,
	"isVerified" INTEGER DEFAULT 0,
	"isBlocked" INTEGER DEFAULT 0,
	"isAdmin" INTEGER DEFAULT 0,
	"resetPassword" INTEGER DEFAULT 0,
	"adminId" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('cryptoskillz','test@orbitlabs.xyz','123456789','0x1521a6B56fFF63c9e97b9adA59716efF9D3A60eB','cryptoskillz','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,1,0,0);
INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('seller 2','test@test.com','123456789','0x060A17B831BFB09Fe95B244aaf4982ae7E8662B7','test','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,0,0,1);


CREATE TABLE "userAccess" (
	"id"	INTEGER,
	"userId"	INTEGER,
	"foreignId" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userAccess" ("userId","foreignId") VALUES (1,1);
INSERT INTO "userAccess" ("userId","foreignId") VALUES (2,1);


CREATE TABLE "userSettings" (
	"id"	INTEGER,
	"companyName"  TEXT,
	"userId" INTEGER,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userSettings" ("companyName","userId") VALUES ('good company',1);
