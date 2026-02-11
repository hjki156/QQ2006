import { appView, chatWindowVisible, addFriendVisible } from './stores/app'
import { LoginForm } from './components/LoginForm'
import { LoggingWindow } from './components/LoggingWindow'
import { MainPanel } from './components/MainPanel'
import { ChatWindow } from './components/ChatWindow'
import { AddFriendWindow } from './components/AddFriendWindow'

export function App() {
  return (
    <>
      {appView.value === 'login' && <LoginForm />}
      {appView.value === 'logging' && <LoggingWindow />}
      {appView.value === 'main' && (
        <>
          <MainPanel />
          {chatWindowVisible.value && <ChatWindow />}
          {addFriendVisible.value && <AddFriendWindow />}
        </>
      )}
    </>
  )
}
