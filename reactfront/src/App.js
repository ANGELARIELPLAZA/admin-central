import './App.css';

//importamos los componentes
import CompShowBlogs from './blog/ShowBlogs';
//importamos el router
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path='/' element={ <CompShowBlogs />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
