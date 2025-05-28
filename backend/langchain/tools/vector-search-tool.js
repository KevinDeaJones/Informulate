import { Tool } from 'langchain/tools';
import supabase from '../../utils/supabaseClient.js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export default class VectorSearchTool extends Tool {
    constructor() {
        super();
        this.vectorStore = new SupabaseVectorStore(
            new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
            }),
            {
                client: supabase,
                tableName: 'trivia_facts',
                queryName: 'match_trivia',  // your RLS policy & SQL function in Supabase
            }
        );
    }

    name = 'VectorSearch';
    description = 'Search for sentences similar to a given topic. Input is a topic string, output is concatenated sentences.';

    async _call(topic) {
        // console.log(topic);
        const results = await this.vectorStore.similaritySearch(topic);
        return results.map((r) => r.pageContent).join("\n");
    }
}