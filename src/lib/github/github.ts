import { graphql, GraphqlResponseError } from "@octokit/graphql"
import { GraphQlResponse } from "@octokit/graphql/dist-types/types"
import {
  GqlOrgRepositoryResponse,
  GqlRepositoryResponse,
  GqlUserReponse,
  Language,
  LanguagesRawData,
  RateLimit,
  RepoAndRateLimit,
  repoOrgQuery,
  repoQuery,
  Repository,
  SortArgs,
  User,
  userQuery,
} from "./graphql"
import * as repoSample from "./repoSampleData.json"

const useDummy = false

export const getRepos = async (
  token: string,
  username: string,
  sortBy: SortArgs,
  firstNRepo = 10
) => {
  if (useDummy)
    return {
      repositories: repoSample.user.repositories.nodes as Repository[],
      rateLimit: repoSample.rateLimit as RateLimit,
    }

  return graphql<GqlRepositoryResponse>({
    query: repoQuery,
    username,
    sortBy,
    firstNRepo,
    headers: {
      authorization: "bearer " + token,
    },
  })
    .then((res) => {
      return {
        repositories: res.user.repositories.nodes as Repository[],
        rateLimit: res.rateLimit as RateLimit,
        error: undefined,
      }
    })
    .catch((error) => {
      if (error instanceof GraphqlResponseError && error.errors) {
        return { repositories: undefined, rateLimit: undefined, error: error.errors[0].type }
      }
      console.error(error.message)
      if (error instanceof Error) throw new Error(error.message)
    })
    .then(
      (
        data
      ):
        | GqlOrgRepositoryResponse
        | GraphQlResponse<GqlOrgRepositoryResponse>
        | RepoAndRateLimit
        | undefined => {
        if (data?.error === "NOT_FOUND") {
          // search for organization
          return graphql<GqlOrgRepositoryResponse>({
            query: repoOrgQuery,
            username,
            sortBy,
            firstNRepo,
            headers: {
              authorization: "bearer " + token,
            },
          })
        } else if (
          data &&
          (data as { repositories: Repository[]; rateLimit: RateLimit }).repositories
        ) {
          return data as { repositories: Repository[]; rateLimit: RateLimit }
        }
      }
    )
    .then((res) => {
      if (!res) return {}
      if ((res as RepoAndRateLimit)?.repositories) return res as RepoAndRateLimit
      else if ((res as GqlOrgRepositoryResponse)?.organization) {
        return {
          repositories: (res as GqlOrgRepositoryResponse).organization.repositories
            .nodes as Repository[],
          rateLimit: res.rateLimit as RateLimit,
          error: undefined,
        }
      }
    })
    .catch((error) => {
      if (error instanceof GraphqlResponseError) {
        console.error(error.message)

        // get partial data if available
        return {
          repositories: error.data?.user
            ? (error.data.user.repositories.nodes as Repository[])
            : error.data.organization
            ? (error.data.organization.repositories.nodes as Repository[])
            : undefined,
          rateLimit: error.data?.rateLimit ? (error.data.rateLimit as RateLimit) : undefined,
          error: error.errors ? error.errors[0] : undefined,
        }
      }
      console.error(error)
      if (error instanceof Error) throw new Error(error.message)
    })
}

// export const getRepos = async (
//   token: string,
//   username: string,
//   sortBy: SortArgs,
//   firstNRepo = 10
// ) => {
//   try {
//     let result
//     if (useDummy) {
//       result = repoSample
//     } else
//       result = await graphql<GqlRepositoryResponse>({
//         query: repoQuery,
//         username,
//         sortBy,
//         firstNRepo,
//         headers: {
//           authorization: "bearer " + token,
//         },
//       })

//     return {
//       repositories: result.user.repositories.nodes as Repository[],
//       rateLimit: result.rateLimit as RateLimit,
//     }
//   } catch (error) {
//     if (error instanceof GraphqlResponseError) {
//       if (error.errors && error.errors[0].type === "NOT_FOUND") {
//         try {
//           const result = await graphql<GqlOrgRepositoryResponse>({
//             query: repoOrgQuery,
//             username,
//             sortBy,
//             firstNRepo,
//             headers: {
//               authorization: "bearer " + token,
//             },
//           })
//           return {
//             repositories: result.organization.repositories.nodes as Repository[],
//             rateLimit: result.rateLimit as RateLimit,
//           }
//         } catch (error) {
//           if (error instanceof GraphqlResponseError) {
//             console.error(error.message)

//             // get partial data if available
//             return {
//               repositories: error.data?.user
//                 ? (error.data.user.repositories.nodes as Repository[])
//                 : undefined,
//               rateLimit: error.data?.rateLimit ? (error.data.rateLimit as RateLimit) : undefined,
//               error: error.errors ? error.errors[0] : undefined,
//             }
//           } else {
//             console.error(error)
//             if (error instanceof Error) throw new Error(error.message)
//           }
//         }
//       }
//     }
//   }
// }

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
