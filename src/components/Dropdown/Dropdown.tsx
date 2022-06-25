import { useRef, useState } from "react"

import { useClickOutside } from "@/hooks"
import { ReactComponent as IconSort } from "@/icons/IconSort.svg"
import styles from "./Dropdown.module.css"

export type option = {
  id: string
  name?: string
  value: string | number
}

interface DropdownItemProps {
  option: option
  onClick: () => void
}

export interface DropdownProps {
  options: option[]
  defaultOption?: option
  placeholder?: string
  desc?: string
  onSelect?: (option: option) => void
}

export function DropdownItem({
  option,
  onClick,
  className,
  ...rest
}: DropdownItemProps & React.HTMLAttributes<HTMLDivElement>) {
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
  placeholder,
  desc,
  onSelect,
  ...rest
}: DropdownProps & React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState(false)
  const [items] = useState(options)
  const [selected, setSelected] = useState<option | null>(defaultOption ?? null)
  const boxRef = useRef<HTMLDivElement>(null)
  const optionListRef = useRef<HTMLDivElement>(null)
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false))

  const handleItemClick = (item: option) => {
    setSelected(item)
    setIsOpen(false)
    onSelect && onSelect(item)
  }

  return (
    <div className={styles.dropdown} {...rest} ref={clickOutsideRef}>
      {/* select box of the dropdown */}
      <div
        className={styles.box}
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
        <span className={styles.placeholder}>{selected?.name ?? placeholder}</span>
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
