const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");

const render = require("./src/page-template.js");

// WISHLIST: 
    // Add validation to ensure the input is correct for each question
    // Change the My Team in HTML to be the teamName, ${teamName} export a variable from here? or push teamName to the team array and access it in the page template if the array is being sent there via render?
    // Ask Ivan - how is the render(team) working? Is it exporting the team array to the page-template?
                        // html.push(team
                        //     .filter(employee => employee.getRole() === "Manager")
                        //     .map(manager => generateManager(manager))
                        //     );
        // The page template exports the function that makes the whole HTML
                                // module.exports = team => {  }        

let team = [];

function runTeamBuilder() {
    function createManager() {
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
            createTeam();
        })
    }

    function createTeam() {
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

    function addEngineer() {
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
            createTeam();
        })
    }

    function addIntern() {
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
        createTeam();
    })
    }

    function buildTeam() {
        inquirer.prompt([
            {
                type: 'input',
                message: "What is the Team's name?",
                name: 'teamname',
            },
        ]).then(answers => {
            if (!fs.existsSync(OUTPUT_DIR)) {
                makeDirectory()
                writeFile(answers)
            } else writeFile(answers)
        })
    }

    function makeDirectory() {
        fs.mkdir(OUTPUT_DIR, err => 
            err ? console.error(err) : console.log('Directory created successfully!'))
    }
    
    function writeFile(answers) {
        const outputPath = path.join(OUTPUT_DIR, `${answers.teamname}.html`)
        if (!fs.existsSync(outputPath)) {
        fs.writeFile(outputPath, render(team), err =>
            err ? console.error(err) : console.log('File created successfully!'))
        } else console.log("Team with that name already exists!")
    }

    createManager();
}

runTeamBuilder();