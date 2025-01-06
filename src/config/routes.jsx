import React from 'react'
import { Routes, Route} from "react-router";
import App from '../App';
import  ChatPage  from '../component/chatPage';

export const AppRoutes = () => {
  return (
    <Routes>
     <Route path="/" element={<App />}/>
     <Route path="/chat" element={<ChatPage />}/>
     <Route path="/about" element={<h1>Heello About Page</h1>}/>
     </Routes>
  )
}
