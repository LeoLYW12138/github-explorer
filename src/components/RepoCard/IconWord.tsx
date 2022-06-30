import React from "react"
import styles from "./IconWord.module.css"

interface IconWordProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>
  text: string
}

function IconWord({ icon, text, ...rest }: IconWordProps) {
  return (
    <div className={styles.container} {...rest}>
      {icon}
      <span className={styles.text}>{text}</span>
    </div>
  )
}

export default IconWord
