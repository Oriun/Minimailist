import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Mail from './views/Mail';
import Main from './views/Main';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/list" element={<Main />} />
        <Route path="/mail/:id" element={<Mail />} />
      </Routes>
    </Router>
  );
};

export default App;
