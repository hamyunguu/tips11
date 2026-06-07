import { useRef } from 'react'
import { PageProvider } from './state/PageContext.jsx'
import CrtShell from './components/crt/CrtShell.jsx'
import Noise from './components/Noise.jsx'
import Stage from './components/Stage.jsx'

export default function App() {
  const bookletRef = useRef(null)
  return (
    <PageProvider>
      <CrtShell>
        <Stage bookletRef={bookletRef} />
      </CrtShell>
      <Noise />
    </PageProvider>
  )
}
