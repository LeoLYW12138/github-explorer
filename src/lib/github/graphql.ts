export interface Language {
  name: string
  color: string
  percentage: number
}
export interface Repository {
  id: string
  name: string
  owner: {
    login: string
  }
  collaborators: {
    totalCount: number
  }
  description: string | null
  url: string
  isFork: boolean
  parent: {
    nameWithOwner: string
    url: string
  } | null
  forkCount: number
  isPrivate: boolean
  stargazerCount: number
  createdAt: string
  updatedAt: string
  diskUsage: number // in kb
  languages: {
    edges: { size: number }[]
    nodes: {
      name: string
      color: string
    }[]
    totalSize: number
  }
  licenseInfo: {
    spdxId: string
  }
}

export interface RateLimit {
  cost: number
  limit: number
  remaining: number
  resetAt: string
}

// https://github.com/atrincas/github-language-usage/blob/master/src/index.ts
export const languageQuery = `query($user: String!, $repos: Int!) {
  user(login: $user) {
    repositories(first: $repos) {
      nodes {
        name
        languages(first: 100) {
          edges {
            size
          }
          nodes {
            name
            color
          }
        }
      }
    }
  }
}`

export const contentQuery = `
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
`

export const repoQuery = `query repositories($username: String!, $firstNRepo: Int = 10) {
  user(login: $username) {
    repositories(first: $firstNRepo, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        name
        owner {
          login
        }
        description
        isFork
        forkCount
        isPrivate
        collaborators {
          totalCount
        }
        createdAt
        stargazerCount
        updatedAt
        url
        diskUsage
        id
        parent {
          nameWithOwner
          url
        }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
          }
          nodes {
            color
            name
          }
          totalSize
        }
        licenseInfo {
          spdxId
        }
      }
    }
  }
  rateLimit {
    cost
    limit
    remaining
    resetAt
  }
}`
