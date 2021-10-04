-- users
CREATE SEQUENCE clients_seq;
CREATE TABLE clients (
  "id" INT NOT NULL DEFAULT NEXTVAL ('clients_seq'),
  "name" VARCHAR(255) NOT NULL,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id));
CREATE INDEX "clients_email" ON clients ("name" ASC);  