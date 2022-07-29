import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Main from './views/Main';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/list" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
