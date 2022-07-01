import { useEffect, useState } from "react"

export const getLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) ?? "null")
export const setLocalStorage = (key: string, value: any) => {
  // console.log("setting storage", key, value)
  localStorage.setItem(key, JSON.stringify(value))
}

export const delLocalStorage = (key: string | null = null) => {
  key !== null ? localStorage.removeItem(key) : localStorage.clear()
}

const isObjectLike = (value: unknown) =>
  Array.isArray(value) || (typeof value === "object" && value !== null)

const isEmptyObjectLike = (value: unknown) => {
  if (value === null) return true
  if (Array.isArray(value)) return value.length === 0

  if (typeof value === "object") return Object.keys(value).length === 0

  return false
}

export function useLocalStorage<T>(key: string, initialState: T) {
  const [state, setState] = useState(() => getLocalStorage(key) ?? initialState)

  useEffect(() => {
    if (state === null || isEmptyObjectLike(state)) {
      delLocalStorage(key)
      return
    }
    setLocalStorage(key, state)
  }, [state, setState])

  return [state, setState] as const
}
