import { ReactComponent as IconBranch } from "@/icons/IconBranch.svg"
import { ReactComponent as IconClock } from "@/icons/IconClock.svg"
import { ReactComponent as IconEarth } from "@/icons/IconEarth.svg"
import { ReactComponent as IconFork } from "@/icons/IconFork.svg"
import { ReactComponent as IconLicense } from "@/icons/IconLicense.svg"
import { ReactComponent as IconStar } from "@/icons/IconStar.svg"
import { ReactComponent as IconTag } from "@/icons/IconTag.svg"
import { Repository } from "@/lib/github"
import { format } from "timeago.js"
import IconWord from "./IconWord"
import styles from "./RepoCard.module.css"

interface RepoCardProps {
  repo: Repository
}

function RepoCard({ repo }: RepoCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles["head-meta"]}>
          <a
            title="Link to Repository"
            aria-label="Link to Repository"
            className={styles["name-link"]}
            href={repo.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <h3 aria-label="Repository name" className={styles.name}>
              {repo.name}
            </h3>
          </a>
          <div className={styles["head-icons"]}>
            <IconWord
              title="Branch count"
              aria-label="Branch count"
              icon={<IconBranch />}
              text={`${repo.branches.totalCount}`}
            ></IconWord>
            <IconWord
              title="Tag count"
              aria-label="Tag count"
              icon={<IconTag />}
              text={`${repo.tags.totalCount} tags`}
            ></IconWord>
            <IconWord
              aria-label="Repository visibility"
              icon={<IconEarth />}
              text={repo.isPrivate ? "private" : "public"}
            ></IconWord>
          </div>
        </div>
        {repo.parent && (
          <p aria-label="Parent repository" className={styles.forkFrom}>
            Fork from{" "}
            <a
              title="Link to parent repository"
              aria-label="Link to parent repository"
              className={styles["parent-link"]}
              href={repo.parent.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {repo.parent.nameWithOwner}
            </a>
          </p>
        )}
      </header>
      <p aria-label="Repository description" className={styles.desc}>
        {repo.description}
      </p>
      <footer className={styles.footer}>
        <div className={styles["foot-meta"]}>
          {repo.licenseInfo && (
            <IconWord
              aria-label="License info"
              title="License info"
              icon={<IconLicense />}
              text={repo.licenseInfo.spdxId ?? "none"}
            ></IconWord>
          )}
          <IconWord
            aria-label="Star count"
            title="Star count"
            icon={<IconStar />}
            text={`${repo.stargazerCount}`}
          ></IconWord>
          <IconWord title="Fork count" icon={<IconFork />} text={`${repo.forkCount}`}></IconWord>
          <IconWord
            aria-label="Last update time"
            icon={<IconClock />}
            text={`Last update: ${format(new Date(repo.pushedAt))}`}
          ></IconWord>
        </div>
        {/* placeholder for languages */}
        <div className={styles.created}>
          <span aria-label="Repository create time">
            Created at{" "}
            {new Date(repo.createdAt).toLocaleString("en-uk", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              timeZoneName: "shortOffset",
            })}
          </span>
        </div>
      </footer>
    </article>
  )
}

export default RepoCard
