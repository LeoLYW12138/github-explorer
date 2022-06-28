import React from "react"
import styles from "./Button.module.css"

interface ButtonProps {
  className?: string
  link?: string
  newTab?: boolean
  children: React.ReactNode
}

function Button({ className = "", link, newTab = true, children }: ButtonProps) {
  if (link)
    return (
      <a
        href={link}
        target={newTab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className={`${styles.button} ${className}`}
      >
        {children}
      </a>
    )

  return <button className={`${styles.button} ${className}`}>{children}</button>
}

export default Button
