import { useMemo, useRef, useState } from "react"

import { useClickOutside } from "@/hooks"
import { ReactComponent as IconSort } from "@/icons/IconSort.svg"
import styles from "./Dropdown.module.css"

export type option = {
  id: string
  name?: string
  value: string | number
}
export type options = option[]

interface DropdownItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  option: option
  onClick: () => void
}

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  options: option[]
  defaultOption?: option
  placeholder?: string
  desc?: string
  prefix?: string
  suffix?: string
  onSelect?: (option: option) => void
}

export function DropdownItem({ option, onClick, className, ...rest }: DropdownItemProps) {
  return (
    <div
      role="option"
      className={`${styles.item} ${className ? className : ""}`}
      onClick={onClick}
      {...rest}
    >
      {option.name}
    </div>
  )
}

function Dropdown({
  options,
  defaultOption,
  placeholder = " ",
  desc,
  prefix = "",
  suffix = "",
  className,
  onSelect,
  ...rest
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const items = useMemo(() => {
    return options.reduce((currArr, { id, name, value }) => {
      currArr.push({ id, name: name ?? String(value), value })
      return currArr
    }, [] as options)
  }, [])
  const [selected, setSelected] = useState<option | null>(defaultOption ?? null)
  const boxRef = useRef<HTMLDivElement>(null)
  const optionListRef = useRef<HTMLDivElement>(null)
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  const displayName = useMemo(() => {
    if (!selected) return placeholder

    return prefix + selected.name + suffix
  }, [selected])

  const minWidth = useMemo(() => {
    return (
      items.reduce(
        (maxLength, item) => Math.max(maxLength, (prefix + item.name + suffix).length),
        0
      ) -
      1 +
      "em"
    )
  }, [items])

  const handleItemClick = (item: option) => {
    setSelected(item)
    setIsOpen(false)
    onSelect && onSelect(item)
  }

  return (
    <div className={`${styles.dropdown} ${className ?? ""}`} {...rest} ref={clickOutsideRef}>
      {/* select box of the dropdown */}
      <div
        className={styles.box}
        style={{ minWidth }}
        tabIndex={0}
        ref={boxRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsOpen(!isOpen)
          // focus the first option in the list
          if (e.key === "ArrowDown")
            (optionListRef.current?.querySelector(`.${styles.item}`) as HTMLElement)?.focus()
        }}
      >
        <span className={styles.placeholder}>{displayName}</span>
        <IconSort className={`${styles.icon} ${isOpen && styles.open}`} />
      </div>

      {/* dropdown options */}
      <div
        role="listbox"
        ref={optionListRef}
        className={`${styles.list} ${(isOpen && styles.open) || ""}`}
      >
        <h6 className={styles.desc}>{desc}</h6>
        {items?.map((item, index) => (
          <DropdownItem
            key={item.id}
            tabIndex={0}
            option={item}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleItemClick(item)

              if (e.key === "ArrowDown")
                e.currentTarget.nextSibling && (e.currentTarget.nextSibling as HTMLElement).focus()

              if (e.key === "ArrowUp") {
                if (index === 0) {
                  boxRef.current?.focus()
                  return
                }
                e.currentTarget.previousSibling &&
                  (e.currentTarget.previousSibling as HTMLElement).focus()
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Dropdown
