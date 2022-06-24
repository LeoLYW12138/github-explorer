import { useClickOutside } from "@/hooks"
import { ReactComponent as IconSort } from "@/icons/IconSort.svg"
import { useState } from "react"
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
  defaultValue?: option
  placeholder?: string
  onSelect?: (option: option) => void
}

export function DropdownItem({
  option,
  onClick,
  className,
  ...rest
}: DropdownItemProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="option" className={`${styles.item} ${className}`} onClick={onClick} {...rest}>
      {option.name}
    </div>
  )
}

function Dropdown({
  options,
  defaultValue,
  placeholder,
  onSelect,
  ...rest
}: DropdownProps & React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState(false)
  const [items] = useState(options)
  const [selected, setSelected] = useState<option | null>(defaultValue ?? null)
  const clickOutsideRef = useClickOutside(() => setIsOpen(false))

  const handleItemClick = (item: option) => {
    setSelected(item)
    setIsOpen(false)
    onSelect && onSelect(item)
  }

  return (
    <div className={styles.dropdown} {...rest}>
      <div
        className={styles.box}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsOpen(!isOpen)
        }}
      >
        <span className={styles.placeholder}>{selected?.name ?? placeholder}</span>
        <IconSort className={`${styles.icon} ${isOpen && styles.open}`} />
      </div>
      <div role="listbox" className={`${styles.list} ${(isOpen && styles.open) || ""}`}>
        {items?.map((item) => (
          <DropdownItem
            key={item.id}
            tabIndex={0}
            option={item}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleItemClick(item)
              }
              if (e.key === "ArrowDown") {
                e.currentTarget.nextSibling && (e.currentTarget.nextSibling as HTMLElement).focus()
              }
              if (e.key === "ArrowUp") {
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
