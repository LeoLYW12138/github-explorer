interface TokenAbsenceProps {
  token: string | null
}

function TokenAbsence({ token = null }: TokenAbsenceProps) {
  return (
    <div>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${
          import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
        }&redirect_uri=${window.location}oauth/callback&scope=repo,user`}
      >
        Sign in with Github
      </a>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${
          import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
        }&redirect_uri=http://localhost:5000/oauth/callback&scope=repo,user`}
      >
        Sign in with Github
      </a>
    </div>
  )
}

export default TokenAbsence
