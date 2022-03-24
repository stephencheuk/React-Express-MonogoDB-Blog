import './App.css';
import Header from "./Header";
import Layout from "./Layout";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Home';
import Posts from './Posts';
import PostsList from './PostsList';
import PostsEdit from './PostsEdit';
import NotFound from './NotFound';

function App() {

  return (
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
  );
}

export default App;
