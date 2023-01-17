import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import PostList from './PostList'
import PostEdit from './PostEdit'
import Post from './Post'

import { AuthProvider } from './Authentication/AuthContext';
import LoginPage from './Authentication/LoginPage';
import RegisterPage from "./Authentication/RegisterPage";
import PrivateComponent from './Authentication/PrivateComponent';
import UserHeaderSection from "./Authentication/UserHeaderSection";

import Navbar from "./Templates/Navbar";

function App() {
  return (
    <div className="app">
      <Router>
        <AuthProvider>
          <Routes>
            
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />

            <Route path="/" element={
              <>
                <Navbar><UserHeaderSection /></Navbar>
                <PostList />
              </>
            } />
            <Route path="post/:post_slug" element={
              <>
                <Navbar><UserHeaderSection /></Navbar>
                <Post />
              </>
            } />
            <Route path="post/:post_slug/edit" element={
              <PrivateComponent>
                <Navbar><UserHeaderSection /></Navbar>
                <PostEdit />
              </PrivateComponent>
            } />
            <Route path="*" element={<main><h2>Error 404</h2></main>} />

          </Routes>
        </AuthProvider>
      </Router>
    </div>
        
  )
}

export default App;
