// src/pages/doctor/DoctorDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, CheckCircle, Clock, Users, 
  LayoutDashboard, MessageSquare, FileText, Settings, Search, Bell
} from 'lucide-react';
// import { fetchDashboardStats } from '../../features/doctor/doctorSlice'; // Assuming you have this thunk

import { StatCard } from '../../components/ui/StatCard';
import { format } from 'date-fns';

export const DoctorDashboard = () => {
  const dispatch = useDispatch();
  
  // NOTE: In production, replace this mock data with useSelector picking data from Redux
  // const { stats, todayAppointments, loading } = useSelector((state) => state.doctor.dashboard);

  // Mock data based directly on your design image
  const stats = {
    totalToday: 18,
    confirmed: 12,
    pending: 4,
    newPatients: 2,
  };

  const todayAppointments = [
    { id: 1, time: '09:00 AM', patientName: 'John Doe', reason: 'Check-up', status: 'Confirmed' },
    { id: 2, time: '09:30 AM', patientName: 'Jane Smith', reason: 'Follow-up', status: 'Pending' },
    { id: 3, time: '10:00 AM', patientName: 'Robert Johnson', reason: 'New Patient', status: 'Confirmed' },
    { id: 4, time: '10:30 AM', patientName: 'Emily Davis', reason: 'Consultation', status: 'Pending' },
    { id: 5, time: '11:00 AM', patientName: 'John Darnon', reason: 'New Patient', status: 'Confirmed' },
    { id: 6, time: '11:30 AM', patientName: 'Mary Johnson', reason: 'Consultation', status: 'Confirmed' },
    { id: 7, time: '12:00 PM', patientName: 'Jane Smith', reason: 'Check-up', status: 'Confirmed' },
  ];

  /* useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);
  */

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Confirmed</span>;
      case 'Pending':
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600">MediConnect</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <Calendar className="w-5 h-5" /> Schedule
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" /> Patients
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <MessageSquare className="w-5 h-5" /> Messages
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <FileText className="w-5 h-5" /> Reports
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-[#1976D2] text-white py-4 px-8 flex justify-between items-center shadow-sm z-10">
          <h1 className="text-2xl font-semibold tracking-wide">Doctor Dashboard</h1>
          <div className="flex items-center gap-6">
            <button className="text-blue-100 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
              <img src="/avatar-placeholder.png" alt="Doctor Profile" className="w-full h-full object-cover bg-white" />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Appointments Today" 
              value={stats.totalToday} 
              icon={Calendar} 
              iconBg="bg-blue-50" 
              iconColor="text-blue-500" 
            />
            <StatCard 
              title="Confirmed" 
              value={stats.confirmed} 
              icon={CheckCircle} 
              iconBg="bg-green-50" 
              iconColor="text-green-500" 
            />
            <StatCard 
              title="Pending" 
              value={stats.pending} 
              icon={Clock} 
              iconBg="bg-orange-50" 
              iconColor="text-orange-500" 
            />
            <StatCard 
              title="New Patients" 
              value={stats.newPatients} 
              icon={Users} 
              iconBg="bg-red-50" 
              iconColor="text-red-500" 
            />
          </div>

          {/* Appointments Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Today's Appointments ({format(new Date(), 'MMM dd, yyyy')})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
                    <th className="py-4 px-6 font-medium">Time</th>
                    <th className="py-4 px-6 font-medium">Patient Name</th>
                    <th className="py-4 px-6 font-medium">Reason</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {todayAppointments.map((appt) => (
                    <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">{appt.time}</td>
                      <td className="py-4 px-6 font-medium">{appt.patientName}</td>
                      <td className="py-4 px-6">{appt.reason}</td>
                      <td className="py-4 px-6">{getStatusBadge(appt.status)}</td>
                      <td className="py-4 px-6">
                        <button className="text-blue-600 font-medium hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-center">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View All Appointments
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};