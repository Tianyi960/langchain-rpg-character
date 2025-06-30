//Load environment variables from .env file
import 'dotenv/config.js';

//import Google Gemini model and Langchain message classes
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize the Gemini model with settings
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
});

// System prompt for step 1: instruct the model to act as a character creator
const characerSystemplate = "You are a character creator for a fantasy RPG game.";

// Create a prompt template for generating the RPG character description
const characterPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", characerSystemplate],
    ["user", "Create a medieval fantasy RPG character. Include the character's name, class, and a short backstory."]
]);

// Call the model with the character prompt and receive the response
const characterPromptValue = await characterPromptTemplate.invoke({});
const characterResponse = await model.invoke(characterPromptValue);
console.log("Character:\n " + characterResponse.content);

// System prompt for step 2: instruct the model to act as a game stat designer
const statsSystemplate = "You are a game designer who generates RPG character stats.";
const statsPromptTemplte = ChatPromptTemplate.fromMessages([
    ["system", statsSystemplate],
    ["user", `Based on the following character description, generate a JSON object with attributes: strength, dexterity, intelligence, constitution, charisma. Also include an array of starting equipment.
      Character Description:
    {character}`]
]);

// Inject the character description into the second prompt
const statsPromptValue = await statsPromptTemplte.invoke({
    character: characterResponse.content
});

// Call the model with the second prompt and receive the JSON stats and equipment
const statsResponse = await model.invoke(statsPromptValue);
console.log("Stats & Equipment:\n" + statsResponse.content);



