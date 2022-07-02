import React, { useState } from "react"

import { useClickOutside } from "@/hooks"
import { ReactComponent as IconChevronDown } from "@/icons/IconChevronDown.svg"
import type { User } from "@/lib/github/graphql"
import styles from "./UserCard.module.css"

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
  className: string
  onSignOut?: () => void
  onRevoke?: () => void
}

function UserCard({ user, className, onSignOut, onRevoke, ...rest }: UserCardProps) {
  const [open, setOpen] = useState(false)
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => setOpen(false))

  return (
    <div
      ref={clickOutsideRef}
      id="user-card"
      data-open={open}
      className={`${styles.card} ${className ? className : ""}`}
      {...rest}
    >
      <img className={styles.avatar} src={user.avatarUrl} width={48} height={48} alt="Avatar" />
      <div className={styles.info}>
        <p className={styles.name}>{user.login}</p>
        <button type="button" aria-label="Sign out" className={styles.signOut} onClick={onSignOut}>
          Sign out
        </button>
        <button type="button" aria-label="Sign out" className={styles.signOut} onClick={onRevoke}>
          Revoke access
        </button>
      </div>
      <button
        className={styles.toggle}
        title={open ? "Close user card" : "Open user card"}
        aria-label={open ? "Close user card" : "Open user card"}
        aria-controls="user-card"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <IconChevronDown className={styles.icon} />
      </button>
    </div>
  )
}

export default UserCard
