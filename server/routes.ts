import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createCommunitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create community and send to Discord
  app.post("/api/communities", async (req, res) => {
    try {
      const validatedData = createCommunitySchema.parse(req.body);
      
      // Generate community file content
      const generatedContent = generateCommunityFile(
        validatedData.textContent,
        validatedData
      );

      // Get webhook URL from environment
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Discord webhook URL not configured");
      }

      // Send to Discord webhook
      await sendToDiscordWebhook(
        webhookUrl,
        generatedContent,
        validatedData.rename
      );

      // Store in database
      const community = await storage.createCommunity({
        rename: validatedData.rename,
        robuxFund: validatedData.robuxFund,
        communitiesMember: validatedData.communitiesMember,
        ownerUsername: validatedData.ownerUsername,
        originalContent: validatedData.textContent,
        generatedContent: generatedContent,
      });

      res.json({ 
        success: true, 
        message: "Community file generated and sent to Discord successfully!",
        communityId: community.id 
      });
    } catch (error) {
      console.error("Error creating community:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to create community"
      });
    }
  });

  // Get all communities
  app.get("/api/communities", async (req, res) => {
    try {
      const communities = await storage.getAllCommunities();
      res.json(communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch communities"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateCommunityFile(
  originalContent: string,
  formData: {
    rename: string;
    robuxFund: string;
    communitiesMember: string;
    ownerUsername: string;
  }
): string {
  const lines = originalContent.split('\n').filter(line => line.trim());
  
  let generatedContent = `# Community Configuration Generated on ${new Date().toISOString()}\n`;
  generatedContent += `# Rename: ${formData.rename}\n`;
  generatedContent += `# Robux Fund: ${formData.robuxFund}\n`;
  generatedContent += `# Communities Member: ${formData.communitiesMember}\n`;
  generatedContent += `# Owner Username: ${formData.ownerUsername}\n\n`;
  generatedContent += `# Original Communities Data:\n`;
  
  lines.forEach((line, index) => {
    generatedContent += `${index + 1}. ${line}\n`;
  });

  generatedContent += `\n# Processing Complete\n`;
  generatedContent += `# Total Communities: ${lines.length}\n`;
  
  return generatedContent;
}

async function sendToDiscordWebhook(
  webhookUrl: string,
  content: string,
  rename: string
): Promise<void> {
  const FormData = require('form-data');
  const form = new FormData();
  
  // Create buffer from content
  const buffer = Buffer.from(content, 'utf-8');
  
  form.append('file', buffer, {
    filename: `${rename}_communities.txt`,
    contentType: 'text/plain'
  });
  
  form.append('content', `Community file generated: **${rename}**`);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error("Discord webhook error:", error);
    throw new Error(`Failed to send to Discord: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
