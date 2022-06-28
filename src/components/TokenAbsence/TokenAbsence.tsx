import Button from "@/components/Button"
import { ReactComponent as IconArrowRight } from "@/icons/IconArrowRight.svg"
import { ReactComponent as IconGithub } from "@/icons/IconGithub.svg"
import styles from "./TokenAbsence.module.css"
interface TokenAbsenceProps {
  token: string | null
}

function TokenAbsence({ token = null }: TokenAbsenceProps) {
  const url = `https://github.com/login/oauth/authorize?client_id=${
    import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
  }&redirect_uri=http://localhost:5000/oauth/callback&scope=repo,user`

  return (
    <>
      {/* <a
        href={`https://github.com/login/oauth/authorize?client_id=${
          import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
        }&redirect_uri=${window.location}oauth/callback&scope=repo,user`}
      >
        Sign in with Github
      </a> */}
      <p className={styles.login}>
        It seems like you are not authenticated. To use this application, please sign in with Github
      </p>
      <Button className={styles.button} link={url} newTab={false}>
        <span>Sign in</span>
        <IconGithub style={{ marginLeft: "-0.25em" }} className={styles.icon} />
        <IconArrowRight className={styles.icon} />
      </Button>
    </>
  )
}

export default TokenAbsence
