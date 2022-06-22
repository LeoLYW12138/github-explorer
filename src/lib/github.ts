import { graphql, GraphqlResponseError } from "@octokit/graphql"

// const appAuth = createOAuthAppAuth({
//   clientType: "oauth-app",
//   clientId: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
//   clientSecret: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_SECRET,
// })

// const userAuth = await appAuth({
//   type: "oauth-app",

// })

const gql = graphql.defaults({
  headers: {
    authorization: "bearer " + import.meta.env.VITE_GITHUB_TOKEN,
  },
})

export const getRepos = async (username: string, firstNRepo = 10) => {
  try {
    const result = await gql(
      `
    query repositories($username: String!, $firstNRepo: Int = 10) {
      user(login: $username) {
        repositories(first: $firstNRepo) {
          nodes {
            description
            object(expression: "HEAD:") {
              ... on Tree {
                id
                entries {
                  name
                  extension
                }
              }
            }
          }
        }
      }
    }
  `,
      {
        username,
        firstNRepo,
      }
    )
    console.log(result)
    return result
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      console.error("Graphql error:", error.message)
    } else {
      console.error(error)
    }
  }
}
