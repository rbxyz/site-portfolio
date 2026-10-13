-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "edition" TEXT,
    "year" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Participante',
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "description" TEXT,
    "link" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventImage" (
    "id" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_position_idx" ON "Event"("position");

-- CreateIndex
CREATE INDEX "EventImage_eventId_position_idx" ON "EventImage"("eventId", "position");

-- AddForeignKey
ALTER TABLE "EventImage" ADD CONSTRAINT "EventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Eventos que já estavam fixos no código da home.
INSERT INTO "Event" ("name", "edition", "role", "highlight", "position", "updatedAt") VALUES
    ('Hackathon', '1ª edição', 'Participante', false, 0, CURRENT_TIMESTAMP),
    ('Hackathon', '2ª edição', 'Participante', false, 1, CURRENT_TIMESTAMP),
    ('Hackathon', '3ª edição', 'Campeão', true, 2, CURRENT_TIMESTAMP),
    ('South Summit', NULL, 'Participante', false, 3, CURRENT_TIMESTAMP),
    ('Semana Caldeira', NULL, 'Participante', false, 4, CURRENT_TIMESTAMP);
