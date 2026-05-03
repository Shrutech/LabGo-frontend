import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="app-shell">
      {shouldShowNavbar && <Navbar />}
      <main className="page-container">
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
