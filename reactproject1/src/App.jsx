import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SideBar from './components/Sidebar'
import MainWindow from './components/MainWindow'

function App() {
    return (
        <>
            <Header/>
            <SideBar/>
            <MainWindow/>
        </>
    )
}

export default App
