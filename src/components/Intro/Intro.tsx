import Button from "@/components/Button"
import { ReactComponent as IconArrowRight } from "@/icons/IconArrowRight.svg"
import { ReactComponent as IconGithub } from "@/icons/IconGithub.svg"

import styles from "./Intro.module.css"

function Intro() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles["logo-container"]}>
          <img src="/logo.svg" className={styles.logo} alt="logo of Github User Explorer" />
        </div>
        <main className={styles["main-container"]}>
          <h1 className={styles.title}>Github User Explorer</h1>
          <p className={styles.description}>
            is a simple web application that can look up the contribution of a Github user at ease
          </p>
          <Button className={styles.button} link="https://github.com/LeoLYW12138/github-explorer">
            <span>Source code</span>{" "}
            <IconGithub style={{ marginLeft: "-0.25em" }} className={styles.icon} />
            <IconArrowRight className={styles.icon} />
          </Button>
        </main>
      </div>
    </section>
  )
}

export default Intro
