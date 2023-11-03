import { markdownTable } from "markdown-table";

const markdown = (data: Credits) => {
    let markdownTemplate = [
        "# Credits",
        "This project is made possible by the community surrounding it and especially the wonderful people and projects listed in this document.",
        "",
        "## Libraries",
        markdownTable([
            ["Name", "Version", "Authors", "License"],
            ...data.dependencies.map((lib) => {
                return [
                    `[${lib.name}](${lib.website})`,
                    lib.version,
                    lib.authors
                        .map((author) => `[${author.name}](${author.url == "" ? lib.website : author.url})`)
                        .join(""),
                    lib.license ? `[${lib.license.name}](${lib.license.url})` : null,
                ];
            }),
        ]),
        "",
    ].join("\n");

    return markdownTemplate;
};

export default markdown;
