import { ReactComponent as IconBranch } from "@/icons/IconBranch.svg"
import { ReactComponent as IconEarth } from "@/icons/IconEarth.svg"
import { ReactComponent as IconClock, ReactComponent as IconFork } from "@/icons/IconFork.svg"
import { ReactComponent as IconLicense } from "@/icons/IconLicense.svg"
import { ReactComponent as IconStar } from "@/icons/IconStar.svg"
import { ReactComponent as IconTag } from "@/icons/IconTag.svg"
import { Repository } from "@/lib/github"
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
            className={styles["name-link"]}
            href={repo.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <h3 className={styles.name}>{repo.name}</h3>
          </a>
          <IconWord icon={<IconBranch />} text={``}></IconWord>
          <IconWord icon={<IconTag />} text={`${repo.refs.totalCount} tags`}></IconWord>
          <IconWord icon={<IconEarth />} text={repo.isPrivate ? "private" : "public"}></IconWord>
        </div>
        {repo.parent && (
          <p className={styles.forkFrom}>
            Fork from{" "}
            <a
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
      <p className={styles.desc}>{repo.description}</p>
      <footer className={styles.foooter}>
        <div className={styles["foot-meta"]}>
          <IconWord icon={<IconLicense />} text={repo.licenseInfo?.spdxId ?? "none"}></IconWord>
          <IconWord icon={<IconStar />} text={`${repo.stargazerCount}`}></IconWord>
          <IconWord icon={<IconFork />} text={`${repo.forkCount}`}></IconWord>
          <IconWord icon={<IconClock />} text={`Last update: ${repo.updatedAt}`}></IconWord>
        </div>
        {/* placeholder for languages */}
        <span>Created at {repo.createdAt}</span>
      </footer>
    </article>
  )
}

export default RepoCard
