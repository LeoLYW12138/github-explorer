import { graphql, GraphqlResponseError } from "@octokit/graphql"
import {
  GqlRepositoryReponse,
  Language,
  LanguagesRawData,
  RateLimit,
  repoQuery,
  Repository,
  SortArgs,
} from "./graphql"
import * as repoSample from "./repoSampleData.json"

const useDummy = false

export const getRepos = async (
  token: string,
  username: string,
  sortBy: SortArgs,
  firstNRepo = 10
) => {
  try {
    let result
    if (useDummy) {
      result = repoSample
    } else
      result = await graphql<GqlRepositoryReponse>({
        query: repoQuery,
        username,
        sortBy,
        firstNRepo,
        headers: {
          authorization: "bearer " + token,
        },
      })
    return {
      repositories: result.user.repositories.nodes as Repository[],
      rateLimit: result.rateLimit as RateLimit,
    }
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      console.error("Graphql error:", error.message)
    } else {
      console.error(error)
    }
  }
}

export const processLanguages = (languagesData: LanguagesRawData) => {
  const total = languagesData.totalSize
  const languages = [] as Language[]
  languagesData.nodes.forEach((node, idx) => {
    // percentage = size / totalSize * 100
    const percentage = (languagesData.edges[idx].size / total) * 100
    languages.push({ ...node, percentage })
  })
  return languages
}
