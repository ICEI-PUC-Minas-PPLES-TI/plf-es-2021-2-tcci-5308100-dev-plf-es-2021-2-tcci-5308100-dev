import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { ToastProvider } from './context/ToastContext';
import { SocialMediaPostProvider } from './context/SocialMediaPostContext';
import { NotificationProvider } from './context/NotificationContext';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <NotificationProvider>
            <SocialMediaPostProvider>
              <Routes />
            </SocialMediaPostProvider>
          </NotificationProvider>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
