import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import '../../dist/output.css';
import './App.css';
import Login from './Pages/Login';
import MainPage from './Pages/MainPage';
import CreateAccount from './Pages/CreateAccount';
import AddContact from './Pages/AddContact';
import { Provider } from 'react-redux';
import { store } from './Store/store';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/add-contact" element={<AddContact />} />
        </Routes>
      </Router>
    </Provider>
  );
}
