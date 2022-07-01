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
  pushedAt: string
  diskUsage: number // in kb
  branches: {
    totalCount: number
  }
  tags: {
    totalCount: number
  }
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
  } | null
}

export interface LanguagesRawData {
  edges: { size: number }[]
  nodes: {
    name: string
    color: string
  }[]
  totalSize: number
}

export interface Language {
  name: string
  color: string
  percentage: number
}
export interface RateLimit {
  cost: number
  limit: number
  remaining: number
  resetAt: string
}

export interface User {
  avatarUrl: string
  login: string
}

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

export interface GqlRepositoryReponse {
  user: {
    repositories: {
      nodes: Repository[]
    }
  }
  rateLimit: RateLimit
}

export enum SortOptions {
  LAST_UPDATE = "PUSHED_AT",
  NAME = "NAME",
  STAR = "STARGAZERS",
}

export enum SortDirections {
  ASC = "ASC",
  DSC = "DESC",
}

export interface SortArgs {
  field: SortOptions | string // string is for custom sorting that GitHub API doesn't support natively
  direction: SortDirections
}

export const repoQuery = `
query repositories($username: String!, $sortBy: RepositoryOrder!, $firstNRepo: Int = 10) {
  user(login: $username) {
    repositories(first: $firstNRepo, orderBy: $sortBy) {
      nodes {
        name
        owner {
          login
        }
        description
        isFork
        forkCount
        isPrivate
        # collaborators {
        #  totalCount
        #}
        createdAt
        stargazerCount
        pushedAt
        url
        diskUsage
        id
        parent {
          nameWithOwner
          url
        }
        branches: refs(refPrefix: "refs/heads/") {
          totalCount
        }
        tags: refs(refPrefix: "refs/tags/") {
          totalCount
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

export interface GqlUserReponse {
  viewer: {
    avatarUrl: string
    login: string
  }
  rateLimit: RateLimit
}

export const userQuery = `
query User {
  viewer {
    avatarUrl(size: 48)
    login
  }
  rateLimit {
    cost
    limit
    remaining
    resetAt
  }
}`
