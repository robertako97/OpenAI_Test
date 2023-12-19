require("dotenv").config();
const inquirer = require("inquirer");
const { OpenAI } = require("langchain/llms/openai");
const { StructuredOutputParser } = require("langchain/output_parsers");

// Setup OpenAI model
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

// Define your PromptTemplate structure
class PromptTemplate {
  constructor({ template, inputVariables, partialVariables = {} }) {
    this.template = template;
    this.inputVariables = inputVariables;
    this.partialVariables = partialVariables;
  }

  format(variables) {
    let prompt = this.template;
    this.inputVariables.forEach((variable) => {
      prompt = prompt.replace(`{${variable}}`, variables[variable]);
    });
    for (const [key, value] of Object.entries(this.partialVariables)) {
      prompt = prompt.replace(`{${key}}`, value);
    }
    return prompt;
  }
}

// Create a parser instance and define the names and descriptions of the output variables
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "Javascript code that answers the user's question",
  explanation: "detailed explanation of the example code provided",
});

// Get the format instructions
const formatInstructions = parser.getFormatInstructions();

// Create an instance of PromptTemplate
const promptTemplate = new PromptTemplate({
  template:
    "You are a javascript expert and will answer the user’s coding questions as thoroughly as possible.\n{format_instructions}\nQuestion: {question}",
  inputVariables: ["question"],
  partialVariables: { format_instructions: formatInstructions },
});

// Function to generate prompt and call OpenAI model
const promptFunc = async (input) => {
  try {
    const formattedPrompt = promptTemplate.format({ question: input });
    const res = await model.call(formattedPrompt);
    const parsedResponse = await parser.parse(res); // Parse the response
    console.log(parsedResponse);
  } catch (err) {
    console.error(err);
  }
};

// Init function
const init = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Ask a coding question:",
      },
    ])
    .then((inquirerResponse) => {
      promptFunc(inquirerResponse.name);
    });
};

// Call init function
init();
