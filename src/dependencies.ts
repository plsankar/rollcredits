import { existsSync, readFileSync } from "fs";

import _ from "lodash";
import parseAuthors from "parse-authors";
import { resolve } from "path";

export default async function dependencies(folder: string, deep: boolean): Promise<DependencyCredit[]> {
    const pkgPath = resolve(folder, `package${deep ? "-lock" : ""}.json`);
    if (!existsSync(pkgPath)) {
        return [];
    }
    const pkgRaw = readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);

    let depsFolders: string[] = [];

    Object.keys(pkg.packages ?? {}).forEach((key) => {
        depsFolders.push(key);
    });

    Object.keys(pkg.dependencies ?? {}).forEach((key) => {
        depsFolders.push(`node_modules/${key}`);
    });

    Object.keys(pkg.devDependencies ?? {}).forEach((key) => {
        depsFolders.push(`node_modules/${key}`);
    });

    depsFolders = depsFolders.filter((folder) => folder != "").filter((folder) => existsSync(folder));
    depsFolders = _.uniq(depsFolders);

    let depencyCredits: Array<DependencyCredit | null> = depsFolders.map((folder) => {
        const pkg = readPackageJson(folder);
        if (!pkg) {
            return null;
        }

        const { name, version, homepage } = pkg;

        let authors: DependencyAuthor[] = [];
        if (!pkg.author) {
            // if undefined/null do nothing;
        } else if (typeof pkg.author == "string") {
            authors = parseAuthors(pkg.author);
        } else if (typeof pkg.author == "object") {
            authors.push(pkg.author);
        } else if (Symbol.iterator in Object(pkg.author)) {
            authors = [...pkg.author];
        } else {
            throw new Error("Author type not found");
        }

        authors = _.compact(authors).map((author) => {
            return {
                ...author,
                url: !author.url || author.url === "" ? (author.email ? `mailto:${author.email}` : "") : author.url,
            };
        });

        let license: DependencyLicense | null = null;

        if (!pkg.license) {
            // Do noting;
        } else if (typeof pkg.license == "string") {
            license = {
                name: pkg.license,
                url: `https://choosealicense.com/licenses/${pkg.license.toLowerCase()}/`,
                content:
                    ["LICENSE", "LICENSE.md", "license", "license.md"]
                        .map((name) => readLicense(folder, name))
                        .find((content) => content != null) ?? null,
            };
        } else if (_.isObject(pkg.license)) {
            license = {
                name: pkg.license.type,
                url: pkg.license.url,
                content:
                    ["LICENSE", "LICENSE.md", "license", "license.md"]
                        .map((name) => readLicense(folder, name))
                        .find((content) => content != null) ?? null,
            };
        }
        return {
            name: String(name),
            version: String(version),
            website: String(!homepage || homepage === "" ? `https://www.npmjs.com/package/${name}` : homepage),
            license: license,
            authors,
        } as DependencyCredit;
    });

    depencyCredits = _.sortBy(depencyCredits, ["name"]);

    return _.compact(depencyCredits);
}

function readPackageJson(folder: string): any | null {
    const pkgPath = resolve(folder, `package.json`);
    if (!existsSync(pkgPath)) {
        return null;
    }
    const pkgRaw = readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    return pkg;
}

function readLicense(folder: string, name: string): any | null {
    const licensePath = resolve(folder, name);
    if (!existsSync(licensePath)) {
        return null;
    }
    const license = readFileSync(licensePath, "utf8");
    return license;
}
