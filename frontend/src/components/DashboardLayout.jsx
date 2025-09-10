// frontend/src/components/DashboardLayout.jsx
import React from 'react';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-teal-light">
      <Header />
      <main className="p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
