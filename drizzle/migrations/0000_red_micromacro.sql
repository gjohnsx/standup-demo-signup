CREATE TABLE `demo_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week` integer NOT NULL,
	`day` text NOT NULL,
	`name` text NOT NULL,
	`demo_title` text
);
