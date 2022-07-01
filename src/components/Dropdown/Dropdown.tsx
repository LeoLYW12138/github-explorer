import { useEffect, useMemo, useRef, useState } from "react"

import { useClickOutside } from "@/hooks"
import { ReactComponent as IconSelect } from "@/icons/IconSelect.svg"
import { ReactComponent as IconSort } from "@/icons/IconSort.svg"
import styles from "./Dropdown.module.css"

export type option<T> = {
  id: string
  name?: string
  value: T
  disabled?: boolean
}
export type options<T> = option<T>[]

interface DropdownItemProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  option: option<T>
  onClick: () => void
}

export interface DropdownProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  options: options<T>
  defaultOption?: option<T>
  placeholder?: string
  desc?: string
  prefix?: string
  suffix?: string
  iconType?: "sort" | "number" | "text"
  onSelect?: (option: option<T>) => void
}

export function DropdownItem<T>({ option, onClick, className, ...rest }: DropdownItemProps<T>) {
  const { name, disabled } = option
  return (
    <div
      tabIndex={disabled ? undefined : 0}
      role="option"
      aria-disabled={disabled}
      className={`${styles.item} ${disabled ? styles.disabled : ""} ${
        className ? className : ""
      }`.trim()}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {name}
    </div>
  )
}

function Dropdown<T>({
  options,
  defaultOption,
  placeholder = " ",
  desc,
  prefix = "",
  suffix = "",
  className,
  iconType = "text",
  onSelect,
  ...rest
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const items = useMemo(() => {
    return options.reduce((currArr, option) => {
      currArr.push({ ...option, name: option.name ?? String(option.value) })
      return currArr
    }, [] as options<T>)
  }, [])

  const [selected, setSelected] = useState<option<T> | null>(() => {
    if (!defaultOption) return null
    return defaultOption.name
      ? defaultOption
      : { ...defaultOption, name: String(defaultOption.value) }
  })

  // update the state in the parent
  useEffect(() => {
    if (selected) onSelect && onSelect(selected)
  }, [])

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

  const handleItemClick = (item: option<T>) => {
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
        {iconType === "sort" ? (
          <IconSort className={`${styles.icon} ${isOpen && styles.open}`} />
        ) : (
          <IconSelect className={`${styles.icon} ${isOpen && styles.open}`} />
        )}
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
