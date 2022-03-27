import './App.css';
import Layout from "./Layout";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy } from 'react';

const Home = lazy(() => import('./Home'));
const PostsEdit = lazy(() => import('./PostsEdit'));
const NotFound = lazy(() => import('./NotFound'));

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="posts">
              <Route index element={<Home />} />
              <Route path="new" element={<PostsEdit />} />
              <Route path=":id" element={<PostsEdit />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
