import inquirer, { QuestionCollection } from "inquirer";

type MainQustionAnswers = {
    lookfor: number[];
    deepdeps: boolean;
    writemd: boolean;
    mdname: string;
};

export function mainQuestions(): Promise<MainQustionAnswers> {
    const questions: QuestionCollection<MainQustionAnswers> = [
        {
            type: "checkbox",
            name: "lookfor",
            message: "What to look for?",
            default: [0, 1],
            choices: [
                {
                    name: "Dependencies",
                    value: 0,
                },
            ],
        },
        {
            type: "confirm",
            name: "deepdeps",
            message: "Check deep into dependencies?",
            default: false,
            when: (answers) => {
                return answers.lookfor.includes(0);
            },
        },
        {
            type: "confirm",
            name: "writemd",
            message: "Create a markdown file?",
            default: true,
            when: (answers) => {
                return answers.lookfor.length > 0;
            },
        },
        {
            type: "input",
            name: "mdname",
            message: "What to name the markdown file?",
            default: "CREDITS.md",
            when: (answers) => {
                return answers.writemd == true && answers.lookfor.length > 0;
            },
        },
    ];
    return inquirer.prompt(questions);
}
