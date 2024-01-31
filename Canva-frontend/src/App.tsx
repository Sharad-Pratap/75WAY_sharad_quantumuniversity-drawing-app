import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page from './page/Page';
import Home from './page/Home';
import './App.css';

const App = ()=> {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/create-drawing" element={<Page/>} />
      {/* <Route path="/drawings/:drawingId" element={<Page/>} /> */}
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
