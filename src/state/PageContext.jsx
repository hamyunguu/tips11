import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PAGE_META } from '../data/pageMeta.js'
import { playSound } from '../audio/sounds.js'

const PageContext = createContext(null)

export function PageProvider({ children }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [override, setOverride] = useState(false)
  const [snakeEnabled, setSnakeEnabled] = useState(false)
  const pageMeta = useMemo(() => PAGE_META, [])

  const value = {
    pageIndex,
    setPageIndex,
    isOpen,
    setIsOpen,
    override,
    setOverride,
    snakeEnabled,
    setSnakeEnabled,
    pageMeta,
  }
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export function usePage() {
  return useContext(PageContext)
}

// Snake-enable controller (original `sl`). Desktop-only (pointer:fine).
// Enter starts snake; handleQuit exits it.
export function useSnake() {
  const { snakeEnabled, setSnakeEnabled } = usePage()
  const [canEnableSnake, setCanEnableSnake] = useState(false)

  useEffect(() => {
    setCanEnableSnake(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && !snakeEnabled && canEnableSnake) {
        playSound('beepHigh')
        setSnakeEnabled(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [snakeEnabled, canEnableSnake, setSnakeEnabled])

  const handleQuit = () => {
    playSound('beepMid')
    setSnakeEnabled(false)
  }

  return { snakeEnabled, canEnableSnake, handleQuit }
}
