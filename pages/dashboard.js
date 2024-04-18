// pages/dashboard.js

import React from 'react';
import ScheduleController from '@/components/scheduleController'; 
import Header from '@/components/header';
import { useUser } from '@/context/userContext';

function Dashboard() {
  const {user} = useUser();
  return (
    <div>
      <Header userName={user ? user.email : 'Guest'} />
      <ScheduleController />
    </div>
  );
}

export default Dashboard;