import { Language } from "@/lib/github"
import styles from "./LanguageBar.module.css"

interface LegendItemProps {
  language: Language
}

interface LanguageBarProps {
  languages: Language[]
}

const LegendItem = ({ language }: LegendItemProps) => {
  return (
    <div className={styles["legend-item"]}>
      <span style={{ color: language.color }} className={styles["legend-color"]}></span>
      <span>{language.name}</span>
      <span className={styles["legend-percentage"]}>{`${language.percentage.toFixed(1)}%`}</span>
    </div>
  )
}

function LanguageBar({ languages }: LanguageBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        {languages.map(({ name, color, percentage }) => (
          <span
            title={`${name}: ${percentage.toFixed(1)}%`}
            key={name}
            style={{ color: color, width: `${percentage}%` }}
            className={styles.segment}
          ></span>
        ))}
      </div>
      <div className={styles.legend}>
        {languages.map((language) => (
          <LegendItem key={language.name} language={language} />
        ))}
      </div>
    </div>
  )
}

export default LanguageBar
