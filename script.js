//call API key
require("dotenv").config();
//inquirer
const inquirer = require("inquirer");
//setup OpenAI model
const { OpenAI } = require("langchain/llms/openai");
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

//Prompt with inquirer to GPT-3
const promptFunc = async (input) => {
  // Accept 'input' as a parameter
  try {
    const res = await model.call(input);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

//Init function
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

//Call init function
init();
