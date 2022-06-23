import React from "react"
import styles from "./Button.module.css"

interface ButtonProps {
  className?: string
  link?: string | null
  children: React.ReactNode
}

function Button({ className = "", link = null, children }: ButtonProps) {
  if (link)
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${className}`}
      >
        {children}
      </a>
    )

  return <button className={`${styles.button} ${className}`}>{children}</button>
}

export default Button
