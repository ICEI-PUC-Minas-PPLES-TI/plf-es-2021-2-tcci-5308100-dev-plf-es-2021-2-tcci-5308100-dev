import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { ToastProvider } from './context/ToastContext';
import { SocialMediaPostProvider } from './context/SocialMediaPostContext';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <SocialMediaPostProvider>
            <Routes />
          </SocialMediaPostProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
