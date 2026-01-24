CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"dob" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
