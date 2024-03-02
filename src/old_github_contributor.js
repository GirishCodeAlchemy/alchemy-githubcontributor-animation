const fetch = require('node-fetch');

const getGithubUserContribution = async (userName, o) => {
    const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                weekday
                date
              }
            }
          }
        }
      }
    }
  `;
    const variables = { login: userName };
    const body = JSON.stringify({ query, variables });
    console.log(body);
    const res = await fetch("https://api.github.com/graphql", {
        headers: {
            Authorization: `bearer ${o.githubToken}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: body,
    });
    console.log(res);

    if (!res.ok) throw new Error(res.statusText);

    const { data, errors } = await res.json();

    if (errors && errors.length > 0) throw new Error(errors[0].message);

    return data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        ({ contributionDays }, x) =>
            contributionDays.map((d) => ({
                x,
                y: d.weekday,
                date: d.date,
                count: d.contributionCount,
                level:
                    (d.contributionLevel === "FOURTH_QUARTILE" && 4) ||
                    (d.contributionLevel === "THIRD_QUARTILE" && 3) ||
                    (d.contributionLevel === "SECOND_QUARTILE" && 2) ||
                    (d.contributionLevel === "FIRST_QUARTILE" && 1) ||
                    0,
            }))
    );
};

module.exports = { getGithubUserContribution };
