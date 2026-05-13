import mongoose from "mongoose";
import dotenv from "dotenv";
import { Visitor } from "./src/models/visitor.model.js";

dotenv.config();

const fixExistingVisitors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const visitors = await Visitor.find();
    console.log(`Processing ${visitors.length} visitors...`);

    for (let visitor of visitors) {
      // If there are no actions, add a default one
      if (!visitor.actions || visitor.actions.length === 0) {
        visitor.actions = [{
          actionType: 'view',
          name: 'Website Visit',
          timestamp: visitor.createdAt || new Date()
        }];
      } else {
        // Migration: ensure every action has actionType
        visitor.actions = visitor.actions.map(a => ({
           actionType: a.actionType || a.type || 'view',
           name: a.name || 'Activity',
           timestamp: a.timestamp || new Date()
        }));
      }
      await visitor.save();
    }

    console.log("Successfully updated all visitors to actionType schema!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

fixExistingVisitors();
