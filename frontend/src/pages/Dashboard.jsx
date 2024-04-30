import React, { useEffect, useState } from 'react'
import DashSidebar from '../components/Dashboard/Dash-Sidebar'
import { useFetcher, useLocation } from 'react-router-dom'
import DashProfile from '../components/Dashboard/Dash-Profile'

function Dashboard() {
    const location = useLocation()
    const [tab, setTab] = useState('')

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tab = urlParams.get('tab')
        if(tab){
            setTab(tab)
        } 
    }, [location.search])
    
  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
        <div><DashSidebar /></div>
        
        {tab==='profile' && <DashProfile />}
    </div>
  )
}

export default Dashboard