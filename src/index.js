import React from 'react';
import { createRoot } from 'react-dom/client';
import {HashRouter as Router, Routes,  Route} from "react-router-dom";
import './index.css';
import "@fontsource/nunito";
import "@fontsource/yanone-kaffeesatz";
import Home from "./pages/home"
import Blog from './pages/blog';
import Post from './pages/post';
import NEPage from './pages/404';
import Changelog from './pages/changelog';
import Backlog from './pages/backlog';
import Projects from './pages/projectsList';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
<Router>
  <div>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/blog' element={<Blog/>} />
      <Route path='/changelog' element={<Changelog/>} />
      <Route path='/backlog' element={<Backlog/>} />
      <Route path='/projects' element={<Projects/>} />
      <Route path='/404' element={<NEPage/>} />
      <Route path='/post/:postId' element={<Post/>} />
      <Route path="*" element={<NEPage />} />
    </Routes>
  </div>
</Router>
);

