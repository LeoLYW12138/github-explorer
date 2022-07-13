import { ReactComponent as IconChevronDown } from "../../icons/IconChevronDown.svg"
import styles from "./Pagination.module.css"

interface PaginationProps {
  numPages: number
  currPage: number
  onChangePage?: (page: number) => void
}

function Pagination({ numPages, currPage, onChangePage }: PaginationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.pagination}>
        <IconChevronDown
          tabIndex={0}
          className={`${styles.prev} ${currPage === 1 ? styles.disabled : ""}`}
          onClick={() => onChangePage && currPage !== 1 && onChangePage(currPage - 1)}
        />
        {Array(numPages)
          .fill(0)
          .map((_, i) => (
            <span
              tabIndex={0}
              key={i}
              className={`${styles.page} ${currPage === i + 1 ? styles.current : ""}`.trim()}
              onClick={() => onChangePage && onChangePage(i + 1)}
            >
              {i + 1}
            </span>
          ))}
        <IconChevronDown
          tabIndex={0}
          className={`${styles.next} ${currPage === numPages ? styles.disabled : ""}`}
          onClick={() => onChangePage && currPage !== numPages && onChangePage(currPage + 1)}
        />
      </div>
    </div>
  )
}

export default Pagination
