import { useState } from 'react';
import './App.css'
import BoardContextProvider from './context/boardContext'
import Whiteboard from './components/whiteboard'
import SocketProvider from './context/socketProvider';
import Home from './components/homePage/home';
import LogInPage from './components/logInPage';
import SignUp from './components/signUp';
import AppContextProvider from './context/appContext';

function App() {
  const [page, setPage] = useState('login');

  return (
    <AppContextProvider>
      <div className="App">
        <SocketProvider>
          <BoardContextProvider>
            {page === 'signup' && <SignUp setPage={setPage} />}
            {page === 'login' && <LogInPage setPage={setPage} />}
            {page === 'home' && <Home setPage={setPage} />}
            {page === 'whiteboard' && <Whiteboard />}
          </BoardContextProvider>
        </SocketProvider>
      </div >
    </AppContextProvider>
  )
}

export default App
