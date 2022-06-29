import { graphql, GraphqlResponseError } from "@octokit/graphql"
import { repoQuery } from "./graphql"

export const getRepos = async (username: string, firstNRepo = 10) => {
  try {
    const result = await graphql({
      query: repoQuery,
      username,
      firstNRepo,
      headers: {
        authorization: "Bearer " + import.meta.env.VITE_GITHUB_TOKEN,
      },
    })
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
