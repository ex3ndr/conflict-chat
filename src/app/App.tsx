import { useState } from 'react'
import styles from './App.module.css'
import { Button } from '../components/ui/button'
import { ModeToggle } from '../components/mode-toggle'
import { cn } from '@/lib/utils';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles['app-box']}>
      <div className={cn(styles['app-box-inner'])}>
        <h1>Vite + React</h1>
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <ModeToggle />
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR!
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
