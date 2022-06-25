import React, { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react"

export type KeyCombination = readonly string[] | readonly string[][]
export type Node = React.RefObject<HTMLElement> | null

const blacklistedTargets: string[] = []

const keysReducer = (state: Record<string, boolean>, action: { type: string; key: string }) => {
  switch (action.type) {
    case "set/keydown":
      return { ...state, [action.key]: true }
    case "set/keyup":
      return { ...state, [action.key]: false }
    default:
      return state
  }
}

export const useKeyPress = (
  keys: readonly string[],
  callback: (keys: Record<string, boolean>) => void,
  preventDefault = false,
  elem?: Node | undefined
): void => {
  if (!Array.isArray(keys))
    throw new Error(
      "The first argument to `useKeyPress` must be an array or a 2D array of `KeyboardEvent.key` strings."
    )

  if (!keys.length)
    throw new Error(
      "The first argument to `useKeyPress` must contain at least one `KeyboardEvent.key` string."
    )

  if (!callback || typeof callback !== "function")
    throw new Error("The second argument to `useKeyPress` must be a function")

  // save callback function
  // https://epicreact.dev/the-latest-ref-pattern-in-react/
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  const initialKeyMap = keys.reduce((currentKey, key) => {
    currentKey[key] = false
    return currentKey
  }, {} as Record<string, boolean>)

  const [targetKeys, setTargetKeys] = useReducer(keysReducer, initialKeyMap)

  const keydownListener = useCallback(
    (keydownEvent: KeyboardEvent) => {
      const { key, target, repeat } = keydownEvent
      // console.log("keydown", key)
      // return if key is being held
      if (repeat) return
      // return if target is blacklisted
      if (target && blacklistedTargets.includes((target as HTMLElement).tagName)) return
      if (!keys.includes(key)) return

      if (preventDefault) keydownEvent.preventDefault()
      if (!targetKeys[key]) setTargetKeys({ type: "set/keydown", key })
    },
    [keys, targetKeys]
  )

  const keyupListener = useCallback(
    (keyupEvent: KeyboardEvent) => {
      const { key, target } = keyupEvent
      // console.log("keyup", key)
      if (target && blacklistedTargets.includes((target as HTMLElement).tagName)) return
      if (!keys.includes(key)) return

      if (targetKeys[key]) setTargetKeys({ type: "set/keyup", key })
    },
    [keys, targetKeys]
  )

  // register keydown listener to elem or window
  useEffect(() => {
    document.addEventListener("keydown", keydownListener as (keydownEvent: Event) => void, true)
    return () => {
      document.removeEventListener(
        "keydown",
        keydownListener as (keydownEvent: Event) => void,
        true
      )
    }
  }, [keydownListener])

  // register keyup listener to elem or window
  useEffect(() => {
    document.addEventListener("keyup", keyupListener as (keyupEvent: Event) => void, true)
    return () => {
      document.removeEventListener("keyup", keyupListener as (keyupEvent: Event) => void, true)
    }
  }, [keyupListener])

  useEffect(() => {
    // console.log(targetKeys, !Object.values(targetKeys).filter((value) => !value).length)
    if (Object.values(targetKeys).every((value) => value)) callbackRef.current(targetKeys)
  }, [targetKeys])
}
