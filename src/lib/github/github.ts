import { graphql, GraphqlResponseError } from "@octokit/graphql"
import { repoQuery } from "./graphql"
import { data as repoSample } from "./repoSampleData.json"

const useDummy = true

export const getRepos = async (token: string, username: string, firstNRepo = 10) => {
  try {
    let result
    if (useDummy) {
      result = repoSample
    } else
      result = await graphql({
        query: repoQuery,
        username,
        firstNRepo,
        headers: {
          authorization: "bearer " + import.meta.env.VITE_GITHUB_TOKEN,
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
