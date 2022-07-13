import styles from "./Loading.module.css"

interface LoadingProps {
  numStrips?: number
}

function Loading({ numStrips = 10 }: LoadingProps) {
  return (
    <div className={styles.wrapper}>
      {Array(numStrips)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${(1 / numStrips) * i}s` }}
            className={styles.strip}
          ></div>
        ))}
    </div>
  )
}

export default Loading
