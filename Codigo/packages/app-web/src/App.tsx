import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
