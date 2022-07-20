import { graphql, GraphqlResponseError } from "@octokit/graphql"
import {
  GqlOrgRepositoryResponse,
  GqlRepositoryResponse,
  GqlUserReponse,
  Language,
  LanguagesRawData,
  PageInfo,
  RateLimit,
  RepoAndRateLimit,
  repoOrgQuery,
  repoQuery,
  Repository,
  SortArgs,
  User,
  userQuery,
} from "./graphql"

const useDummy = false
type PartialData = Partial<RepoAndRateLimit & { error: { type: string; message: string } }>
export interface repoParams {
  token: string
  username: string
  sortBy: SortArgs
  firstNRepo: number
  afterCursor: string | null
}

export const getRepos = async (
  token: string,
  username: string,
  sortBy: SortArgs,
  firstNRepo = 10,
  afterCursor: string | null = null
): Promise<PartialData> => {
  try {
    return await getUserRepos(token, username, sortBy, firstNRepo, afterCursor)
  } catch (error) {
    if (error instanceof GraphqlResponseError && error.errors) {
      const { type, message } = error.errors[0]

      // try catch for getOrgRepos
      try {
        if (type === "NOT_FOUND")
          return await getOrgRepos(token, username, sortBy, firstNRepo, afterCursor)
      } catch (error) {
        if (error instanceof GraphqlResponseError && error.errors) {
          const { type, message } = error.errors[0]
          return { error: { type, message } }
        }

        if (error instanceof Error) throw new Error(error.message)
        return {}
      }

      // try catch for getUserRepos
      return { error: { type, message } }
    }
    if (error instanceof Error) throw new Error(error.message)
    return {}
  }
}

export const getOrgRepos = async (
  token: string,
  username: string,
  sortBy: SortArgs,
  firstNRepo = 10,
  afterCursor: string | null = null
): Promise<PartialData> => {
  return graphql<GqlOrgRepositoryResponse>({
    query: repoOrgQuery,
    username,
    sortBy,
    firstNRepo,
    afterCursor,
    headers: {
      authorization: "bearer " + token,
    },
  })
    .then((res) => {
      return {
        repositories: res.organization.repositories.nodes as Repository[],
        pageInfo: res.organization.repositories.pageInfo as PageInfo,
        totalCount: res.organization.repositories.totalCount,
        rateLimit: res.rateLimit as RateLimit,
      }
    })
    .catch((error) => {
      if (error instanceof GraphqlResponseError<GqlOrgRepositoryResponse>) {
        const err = error as GraphqlResponseError<GqlOrgRepositoryResponse>
        console.error(err.message)
        if (err.errors?.[0].type === "NOT_FOUND") throw error
        // get partial data if available
        return {
          repositories: err.data?.organization.repositories.nodes as Repository[],
          pageInfo: err.data?.organization.repositories.pageInfo as PageInfo,
          totalCount: err.data?.organization.repositories.totalCount,
          rateLimit: err.data?.rateLimit as RateLimit,
          error: err.errors?.[0],
        }
      }
      console.error(error)
      if (error instanceof Error) throw new Error(error.message)
      return {}
    })
}

export const getUserRepos = async (
  token: string,
  username: string,
  sortBy: SortArgs,
  firstNRepo = 10,
  afterCursor: string | null = null
): Promise<PartialData> => {
  return graphql<GqlRepositoryResponse>({
    query: repoQuery,
    username,
    sortBy,
    firstNRepo,
    afterCursor,
    headers: {
      authorization: "bearer " + token,
    },
  })
    .then((res) => {
      return {
        repositories: res.user.repositories.nodes as Repository[],
        pageInfo: res.user.repositories.pageInfo as PageInfo,
        totalCount: res.user.repositories.totalCount,
        rateLimit: res.rateLimit as RateLimit,
      }
    })
    .catch((error) => {
      if (error instanceof GraphqlResponseError<GqlRepositoryResponse>) {
        const err = error as GraphqlResponseError<GqlRepositoryResponse>
        console.error(err.message)

        if (err.errors?.[0].type === "NOT_FOUND") throw error
        // get partial data if available
        return {
          repositories: err.data?.user.repositories.nodes as Repository[],
          pageInfo: err.data?.user.repositories.pageInfo as PageInfo,
          totalCount: err.data?.user.repositories.totalCount,
          rateLimit: err.data?.rateLimit as RateLimit,
          error: err.errors?.[0],
        }
      }
      console.error(error)
      if (error instanceof Error) throw new Error(error.message)
      return {}
    })
}

export const getUser = async (token: string) => {
  try {
    const result = await graphql<GqlUserReponse>({
      query: userQuery,
      headers: {
        authorization: "bearer " + token,
      },
    })
    return {
      user: result.viewer as User,
      rateLimit: result.rateLimit as RateLimit,
    }
  } catch (error) {
    if (error instanceof GraphqlResponseError) {
      console.error(error.message)

      // get partial data if available
      return {
        user: error.data?.viewer ? (error.data.viewer as User) : undefined,
        rateLimit: error.data?.rateLimit ? (error.data.rateLimit as RateLimit) : undefined,
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
