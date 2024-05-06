import React, { useEffect, useState } from 'react'
import DashSidebar from '../components/Dashboard/Dash-Sidebar'
import { useFetcher, useLocation } from 'react-router-dom'
import DashProfile from '../components/Dashboard/Dash-Profile'
import DashUsers from '../components/Dashboard/Dash-Users'
import DashCategory from '../components/Dashboard/Dash-Category'
import { useSelector } from 'react-redux'

function Dashboard() {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const {currentUser} = useSelector((state) => state.user)

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
        {tab==='users' && currentUser.isAdmin && <DashUsers />}
        {tab==='category' && currentUser.isAdmin && <DashCategory />}
    </div>
  )
}

export default Dashboard