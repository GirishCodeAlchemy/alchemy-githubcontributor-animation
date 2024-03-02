const { getGithubUserContribution } = require('./src/github_contributor');
const userName = 'girishcodealchemy';
const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken) {
    console.error('GitHub token not found in environment variable GITHUB_TOKEN');
    process.exit(1);
}



async function main() {
    try {
        const contributions = await getGithubUserContribution(userName, { githubToken });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main()