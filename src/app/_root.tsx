import styles from './_root.module.css'
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className={styles['app-box']}>
      <div className={cn(styles['app-box-inner'], 'shadow-md')}>
        <Outlet />
      </div>
    </div>
  )
}

export default App
