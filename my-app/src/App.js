import logo from './logo.svg';
import './App.css';
import LogIn from './backend/auth';
import RecommendationPage from './RecommendationPage';


function App() {
  return (
    <div className="App">
      <div style={{flex: "flex", flexDirection:"row"}}>
        <div>
          <RecommendationPage/>
          {/* <LogIn/> */}
        </div>
        <div>
            asdfasdf
        </div>
      </div>

      


    </div>
  );
}

export default App;
