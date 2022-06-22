import styles from "./Intro.module.css"

const Intro = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <img className={styles.logo} src="/logo.png" alt="logo of Github User Explorer" />
        <main>
          <h1 className={styles.title}>Github User Explorer</h1>
          <p className={styles.description}>
            is a simple web application that can look up the contribution of a Github user at ease
          </p>
        </main>
      </div>
    </section>
  )
}

export default Intro
