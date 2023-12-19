require("dotenv").config();
const inquirer = require("inquirer");
const { OpenAI } = require("langchain/llms/openai");

// Setup OpenAI model
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

// Define your PromptTemplate structure
class PromptTemplate {
  constructor({ template, inputVariables }) {
    this.template = template;
    this.inputVariables = inputVariables;
  }

  format(variables) {
    let prompt = this.template;
    this.inputVariables.forEach((variable) => {
      prompt = prompt.replace(`{${variable}}`, variables[variable]);
    });
    return prompt;
  }
}

// Create an instance of PromptTemplate
const promptTemplate = new PromptTemplate({
  template:
    "You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\nQuestion: {question}",
  inputVariables: ["question"],
});

// Function to generate prompt and call OpenAI model
const promptFunc = async (input) => {
  try {
    const formattedPrompt = promptTemplate.format({ question: input });
    const res = await model.call(formattedPrompt);
    console.log(res);
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
      promptFunc(inquirerResponse.name); // Pass the response to promptFunc
    });
};

// Call init function
init();
``;
