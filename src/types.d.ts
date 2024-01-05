declare module "parse-authors";

type Credits = {
    dependencies: DependencyCredit[];
};

type DependencyCredit = {
    name: string;
    version: string;
    website: string;
    licenses: DependencyLicense[];
    authors: DependencyAuthor[];
};

type DependencyAuthor = {
    name: string;
    email: string;
    url: string;
};
type DependencyLicense = {
    name: string;
    content: string | null;
    url: string;
};
