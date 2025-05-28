import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Initialize Supabase client
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ingest() {
  const rawData = JSON.parse(fs.readFileSync("data-injest/trivia_facts.json", "utf8"));

  const docs = rawData.map((fact, i) => ({
    pageContent: fact,
    metadata: { index: i },
  }));

  const embeddings = new OpenAIEmbeddings();

  const store = await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client,
    tableName: "trivia_facts",
    queryName: "match_trivia", // You created this function in Supabase
  });

  console.log(`✅ Ingested ${docs.length} documents into Supabase`);
}

ingest().catch(console.error);