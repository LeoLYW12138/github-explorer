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
      console.error(error.message)
      return {
        repositories: error.data.user
          ? (error.data.user.repositories.nodes as Repository[])
          : undefined,
        rateLimit: error.data.rateLimit ? (error.data.rateLimit as RateLimit) : undefined,
        error: error.errors ? error.errors[0] : undefined,
      }
    } else {
      console.error(error)
      if (error instanceof Error) throw new Error(error.message)
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
