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
    // Sort CSS so it looks better
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
                choices: ["Add an engineer?", "Add an intern?", "Finish building team?"],
                name: 'menu'
            },
        ]).then(answer => {
            if (answer.menu === "Add an engineer?") {
                addEngineer();
                return;
            } else if (answer.menu === "Add an intern?") {
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

// README

// Your task is to take the given starter code and convert it into a working Node.js command-line application. This application will take in information about employees on a software engineering team, then generates an HTML webpage that displays summaries for each person. You have been provided with tests, so make sure every part of your code passes each provided test.

// ## User Story

// As a manager a user want to generate a webpage that displays my team's basic info so that a user have quick access to their emails and GitHub profiles.

// ## Instructions

// * Create a command-line application that accepts accepts user input using the provided starter code.   
//   * Create classes for each team member provided and export them. The tests for these classes (in the `_tests_` directory) must ALL pass.     
//     * The first class is an `Employee` parent class with the following properties and methods:       
//       * `name`
//       * `id`
//       * `email`
//       * `getName()`
//       * `getId()`
//       * `getEmail()`
//       * `getRole()`&mdash;returns `'Employee'`     
//     * The other three classes will extend `Employee`.      
//     * In addition to `Employee`'s properties and methods, `Manager` will also have the following:
//       * `officeNumber`
//       * `getRole()`&mdash;overridden to return `'Manager'`
//     * In addition to `Employee`'s properties and methods, `Engineer` will also have the following:
//       * `github`&mdash;GitHub username
//       * `getGithub()`
//       * `getRole()`&mdash;overridden to return `'Engineer'`
//     * In addition to `Employee`'s properties and methods, `Intern` will also have the following:
//       * `school`
//       * `getSchool()`
//       * `getRole()`&mdash;overridden to return `'Intern'`
//     * Finally, although it’s not a requirement, consider adding validation to ensure that user input is in the proper format.   
//   * Write code in `index.js` that uses inquirer to gather information about the development team members and creates objects for each team member using the correct classes as blueprints.
//     * When a user starts the application then they are prompted to enter the **team manager**’s:
//       * Name
//       * Employee ID
//       * Email address
//       * Office number
//     * When a user enters those requirements then the user is presented with a menu with the option to:
//       * Add an engineer
//       * Add an intern 
//       * Finish building the team
//     * When a user selects the **engineer** option then a user is prompted to enter the following and then the user is taken back to the menu:
//       * Engineer's Name
//       * ID
//       * Email
//       * GitHub username
//     * When a user selects the intern option then a user is prompted to enter the following and then the user is taken back to the menu:
//       * Intern’s name
//       * ID
//       * Email
//       * School
//     * When a user decides to finish building their team then they exit the application, and the HTML is generated.
//   * Call the `render` function (provided for you) and pass in an array containing all employee objects; 
//     * The `render` function will generate and return a block of HTML including templated divs for each employee!
//   * Create an HTML file using the HTML returned from the `render` function. 
//     * Write it to a file named `team.html` in the `output` folder. 
//     * You can use the provided variable `outputPath` to target this location.