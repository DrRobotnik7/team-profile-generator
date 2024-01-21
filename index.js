const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");

const render = require("./src/page-template.js"); // Imports the function from page-template and creates the content that is passed to writeFile 

let team = []; // This is the array that will be populated with the employee objects created from the user's answers. This is passed to the render function which is ultimately used to generate the HTML in page-template.js

function runTeamBuilder() { // This is the core application logic which is called when node index.js is run
    function createManager() { // This asks the user questions, creates the Manager and pushes to the team array. Then calls the menu function.
        inquirer.prompt([
            {
                type: 'input',
                message: "What is the Team Manager's name?",
                name: 'name',
            },
            {
                type: 'input',
                message: "What is the Team Manager's employee ID?",
                name: 'id',
            },
            {
                type: 'input',
                message: "What is the Team Manager's email address?",
                name: 'email',
            },
            {
                type: 'input',
                message: "What is the Team Manager's office phone number?",
                name: 'officeNumber',
            },
        ]).then(answers => {
            const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            team.push(manager);
            menu();
        })
    }

    function menu() { // This menu asks the user if they would like to add another employee or finish building the team
        inquirer.prompt([
            {
                type: 'list',
                message: "Would you like to:",
                choices: ["Add an Engineer's profile?", "Add an Intern's profile?", "Finish building team profile?"],
                name: 'menu'
            },
        ]).then(answer => {
            if (answer.menu === "Add an Engineer's profile?") {
                addEngineer();
                return;
            } else if (answer.menu === "Add an Intern's profile?") {
                addIntern();
                return;
            } else {
                buildTeam();
                return;
            }       
        })
    }

    function addEngineer() { // This asks the user questions, creates the Engineer and pushes to the team array. Then calls the menu function.
        inquirer.prompt([
            {
                type: 'input',
                message: "What is the Engineer's name?",
                name: 'name',
            },
            {
                type: 'input',
                message: "What is the Engineer's employee ID?",
                name: 'id',
            },
            {
                type: 'input',
                message: "What is the Engineer's email address?",
                name: 'email',
            },
            {
                type: 'input',
                message: "What is the Engineer's GitHub username?",
                name: 'github',
            },
        ]).then(answers => {
            const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
            team.push(engineer);
            menu();
        })
    }

    function addIntern() { // This asks the user questions, creates the Intern and pushes to the team array. Then calls the menu function.
        inquirer.prompt([
        {
            type: 'input',
            message: "What is the Intern's name?",
            name: 'name',
        },
        {
            type: 'input',
            message: "What is the Intern's employee ID?",
            name: 'id',
        },
        {
            type: 'input',
            message: "What is the Intern's email address?",
            name: 'email',
        },
        {
            type: 'input',
            message: "Which school is the Intern enrolled with?",
            name: 'school',
        }
    ]).then(answers => {
        const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        team.push(intern);
        menu();
    })
    }

    function buildTeam() { // Once the user is finished building the team, this function asks for the team name and creates the HTML file
        inquirer.prompt([
            {
                type: 'input',
                message: "What is the Team's name?",
                name: 'teamname',
            },
        ]).then(answer => {
            if (!fs.existsSync(OUTPUT_DIR)) { // This code block checks if the "output" folder already exists and creates it if it doesn't
                makeDirectory()
                writeFile(answer) // This then writes the file using the answer to the "output" directory
            } else writeFile(answer)
        })
    }

    function makeDirectory() { // This makes the "output" directory and informs the user if successful or not
        fs.mkdir(OUTPUT_DIR, err => 
            err ? console.error(err) : console.log('Directory created successfully!'))
    }
    
    function writeFile(answer) { // This function takes in the teamname answer as a parameter and writes a file called ${answer.teamname}.html
        const outputPath = path.join(OUTPUT_DIR, `${answer.teamname}.html`) // This stores the file path to pass to the writeFile method
        if (!fs.existsSync(outputPath)) { // Checks if the file already exists, if it does the file won't be created to prevent overwriting file
        fs.writeFile(outputPath, render(team, answer.teamname), err => // The team array and the team name are passed in to the render function
            err ? console.error(err) : console.log('File created successfully!'))
        } else console.log("Team with that name already exists!") // This informs the user 
    }

    createManager(); // This calls the createManager function which triggers the start of the application
}

runTeamBuilder(); // This runs the logic for the application