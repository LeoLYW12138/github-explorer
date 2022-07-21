import { useRef } from "react"
import { ReactComponent as IconChevronDown } from "../../icons/IconChevronDown.svg"
import styles from "./Pagination.module.css"

interface PaginationProps {
  numPages: number
  currPage: number
  onChangePage?: (page: number) => void
}

function Pagination({ numPages, currPage, onChangePage }: PaginationProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleOnChange = (page: number) => {
    if (!onChangePage || page < 1 || page > numPages) return

    onChangePage(page)

    if (!wrapperRef.current) return
    const scrollLeft = wrapperRef.current.scrollLeft
    const scrollWidth = wrapperRef.current.scrollWidth
    const { width: wrapperWidth, left: wrapperLeft } = wrapperRef.current.getBoundingClientRect()
    const { left: btnLeft } = wrapperRef.current.children[page - 1].getBoundingClientRect()

    const relativeLeft = scrollLeft + (btnLeft - wrapperLeft)
    const PADDING = 40
    let scroll = 0
    // case 1: larger than wrapperWidth
    if (relativeLeft > wrapperWidth - PADDING) {
      scroll = relativeLeft - PADDING
    }

    // case 2: smaller than wrapperWidth
    if (relativeLeft <= wrapperWidth - PADDING) {
      scroll = 0
    }

    // case 3: larger than scrollWidth - wrapperWidth
    if (relativeLeft > scrollWidth - wrapperWidth + PADDING) {
      scroll = scrollWidth - wrapperWidth
    }

    // console.log(relativeLeft, wrapperLeft, wrapperWidth, scroll)
    wrapperRef.current.scrollTo({ left: scroll, behavior: "smooth" })
  }

  return (
    <div className={styles.container}>
      <div className={styles.pagination}>
        <IconChevronDown
          tabIndex={0}
          className={`${styles.prev} ${currPage === 1 ? styles.disabled : ""}`}
          onClick={() => handleOnChange(currPage - 1)}
        />
        <div ref={wrapperRef} className={`scrollbar ${styles.wrapper}`}>
          {Array(numPages)
            .fill(0)
            .map((_, i) => (
              <span
                tabIndex={0}
                key={i}
                className={`${styles.page} ${currPage === i + 1 ? styles.current : ""}`.trim()}
                onClick={() => handleOnChange(i + 1)}
              >
                {i + 1}
              </span>
            ))}
        </div>
        <IconChevronDown
          tabIndex={0}
          className={`${styles.next} ${currPage === numPages ? styles.disabled : ""}`}
          onClick={() => handleOnChange(currPage + 1)}
        />
      </div>
    </div>
  )
}

export default Pagination
