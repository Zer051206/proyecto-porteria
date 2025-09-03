// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/index.jsx'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main className="w-full min-h-screen flex flex-col justify-center items-center">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;