#! /usr/bin/env node

import boxen from "boxen";
import figlet from "figlet";
import inquirer, { Answers } from "inquirer";

const banner = [figlet.textSync("rollcredits"), "Let's Roll Credits"];

console.log(
    boxen(banner.join("\n"), {
        padding: 1,
        align: "center",
        borderColor: "green",
    })
);

function menuQuestion(): Promise<Answers> {
    const questions = [
        {
            type: "checkbox",
            name: "lookfor",
            message: "What to look for?",
            choices: [
                {
                    name: "Dependencies",
                    value: 0,
                },
                {
                    name: "Dev Dependencies",
                    value: 1,
                },
                {
                    name: "Images",
                    value: 2,
                },
            ],
        },
    ];
    return inquirer.prompt(questions);
}

async function run() {
    const menuAnswers = await menuQuestion();
    const { action } = menuAnswers;
    console.log(menuAnswers);
}

run();
