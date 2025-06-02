import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  rename: text("rename").notNull(),
  robloxFriend: text("roblox_friend").notNull(),
  communitiesMember: text("communities_member").notNull(),
  ownerUsername: text("owner_username").notNull(),
  originalFileName: text("original_file_name").notNull(),
  originalContent: text("original_content").notNull(),
  generatedContent: text("generated_content").notNull(),
  discordWebhook: text("discord_webhook").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCommunitySchema = createInsertSchema(communities).omit({
  id: true,
  createdAt: true,
});

export const createCommunitySchema = z.object({
  rename: z.string().min(1, "Rename is required"),
  robloxFriend: z.string().min(1, "Roblox Friend is required"),
  communitiesMember: z.string().min(1, "Communities Member is required"),
  ownerUsername: z.string().min(1, "Owner Username is required"),
  discordWebhook: z.string().url("Invalid webhook URL").refine(
    (url) => url.includes('discord.com/api/webhooks'),
    "Must be a valid Discord webhook URL"
  ),
  fileContent: z.string().min(1, "File content is required"),
  fileName: z.string().min(1, "File name is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communities.$inferSelect;
export type CreateCommunityRequest = z.infer<typeof createCommunitySchema>;
