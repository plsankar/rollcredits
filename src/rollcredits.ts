#! /usr/bin/env node

import figlet from "figlet";
import dependencies from "./dependencies.js";

import { mainQuestions } from "./questions.js";
import markdown from "./templates/markdown.js";
import { writeFileSync } from "fs";
import boxen from "boxen";

const banner = [figlet.textSync("rollcredits"), "Let's Roll Credits"];

console.log(
    boxen(banner.join("\n"), {
        padding: 1,
        align: "center",
        borderColor: "green",
    })
);

async function run() {
    const menuAnswers = await mainQuestions();
    const { deepdeps, lookfor, mdname, writemd } = menuAnswers;
    const data: Credits = {
        dependencies: [],
    };
    if (lookfor.includes(0)) {
        data.dependencies = await dependencies(process.cwd(), deepdeps);
    }
    if (writemd) {
        const md = markdown(data);
        writeFileSync(`./${mdname}`, md);
    }
}

run();
