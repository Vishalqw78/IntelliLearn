import "./styles.css";
import "./styles/tailwind-pre-build.css";
import Homepage from "./components/Homepage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PopupEditor from "./components/Editor";
import PopupEdit from "./components/Edit";

import Login from "./components/Login";
import Register from "./components/Register";
import Congratulations from "./components/Congrats";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Author from "./components/Author";
import Search from "./components/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AISummarizer from "./components/AISummarizer";
import Questions from './components/Questions'
import Doubt from './components/Doubt'

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import DoubtStoreEditor from "./components/DoubtStore";

export default function App() {
  const userToken = localStorage.getItem('token')||null;

  const ProtectedRoute = ({ children }) => {
    if (!userToken) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  const AuthRoute = ({ children }) => {
    if (userToken) {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/page/:pageNumber" element={<Homepage />} />
          
          <Route path="/doubtstore" element={<Doubt />} />
          <Route path="/doubtstore/:pageNumber" element={<Doubt />} />

          <Route path="/search" element={<Search />} />
          
          <Route path="/authors/:id" element={<Author />} />
          <Route path="/authors" element={<Author />} />
          <Route path="/categories" element={<Author />} />
          <Route path="/verification" element={<Congratulations />} />
          <Route path="/signin" element={<AuthRoute><Login/></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Register/></AuthRoute>} />
          <Route path="/write" element={<ProtectedRoute><PopupEditor /></ProtectedRoute>} />
          <Route path="/ask" element={<ProtectedRoute><DoubtStoreEditor /></ProtectedRoute>} />
          <Route path="/question/:id" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
          
          <Route path="/edit/:id" element={<ProtectedRoute><PopupEdit /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/aisummarizer" element={<ProtectedRoute><AISummarizer /></ProtectedRoute>} />
        </Routes>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}
