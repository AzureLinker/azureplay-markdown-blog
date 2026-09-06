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
import ProjectsMods from './pages/projectsMods';
import ProjectMod from './pages/projectMod';
import ProjectsGames from './pages/projectsGames';
import ProjectGame from './pages/projectGame';
import ProjectsLevels from './pages/projectsLevels';
import ProjectLevel from './pages/projectLevel';
import ProjectsOthers from './pages/projectsOthers';
import ProjectOther from './pages/projectOther';
import Gallery from './pages/gallery';
import GuestbookPage from './pages/GuestbookPage';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
<Router>
  <div>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/blog' element={<Blog key="blog"/>} />
      <Route path='/changelog' element={<Changelog/>} />
      <Route path='/gallery' element={<Gallery/>} />
      <Route path='/backlog' element={<Backlog/>} />
      <Route path='/404' element={<NEPage/>} />
      <Route path='/post/:postId' element={<Post/>} />
      <Route path='/projects/mods' element={<ProjectsMods/>} />
      <Route path='/projects/mods/:projectId' element={<ProjectMod/>} />
      <Route path='/projects/games' element={< ProjectsGames/>} />
      <Route path='/projects/games/:projectId' element={<ProjectGame/>} />
      <Route path='/projects/levels' element={<ProjectsLevels/>} />
      <Route path='/projects/levels/:projectId' element={<ProjectLevel/>} />
      <Route path='/projects/other' element={<ProjectsOthers/>} />
      <Route path='/projects/other/:projectId' element={<ProjectOther/>} />
      <Route path='/guestbook' element={<GuestbookPage/>} />
      <Route path="*" element={<NEPage />} />
    </Routes>
  </div>
</Router>
);

