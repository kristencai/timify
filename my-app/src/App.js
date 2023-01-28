import logo from './logo.svg';
import './App.css';
import LogIn from './backend/auth';
import Playlist from './backend/userData';

function App() {
  return (
    <div className="App">
      <LogIn />
      {/* <Playlist /> */}
    </div>
  );
}

export default App;
