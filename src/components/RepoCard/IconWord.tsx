import React from "react"
import styles from "./IconWord.module.css"

interface IconWordProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>
  text: string
}

function IconWord({ icon, text }: IconWordProps) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>{text}</span>
    </div>
  )
}

export default IconWord