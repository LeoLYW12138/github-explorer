import { useEffect, useLayoutEffect, useRef } from "react"

export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLElement>(null)
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        // alert("You clicked outside of me!");
        callbackRef.current()
      }
    }

    document.addEventListener("mousedown", handleClickOutside, true)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [ref, callbackRef])
  return ref
}
