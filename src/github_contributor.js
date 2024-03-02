const axios = require('axios');

const getGithubUserContribution = async (userName, o) => {
    console.log(`Fetching contribution data for user ${userName}`);

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
    // console.log(variables);
    // console.log(query);
    try {
        const response = await axios.post("https://api.github.com/graphql", {
            variables,
            query
        }, {
            headers: {
                Authorization: `Bearer ${o.githubToken}`,
                "Content-Type": "application/json",
            },
        });
        // console.log(response.data.data.user.contributionsCollection.contributionCalendar.weeks);

        if (!response.data.data) {
            console.log("No data returned from GitHub API");
            throw new Error("No data returned from GitHub API");
        }

        return response.data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
            ({ contributionDays }, x) =>
                contributionDays.map((d) => {
                    // console.log(`x: ${x}, weekday: ${d.weekday}, date: ${d.date}, count: ${d.contributionCount}`);
                    return {
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
                    };
                })
        );
    } catch (error) {
        console.log(error.message);
        // throw new Error(error.message);
    }
};

module.exports = { getGithubUserContribution };
