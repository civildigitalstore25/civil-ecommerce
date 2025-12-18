import React from 'react';
import { useUser } from '../api/userQueries';
import AdminList from '../components/admins/AdminList';

const SuperAdminAdminsPage: React.FC = () => {
  const { data: user } = useUser() as { data?: { _id?: string; id?: string; role?: string } };

  if (!user || user.role !== 'superadmin') {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied: Superadmin only</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <AdminList />
    </div>
  );
};

export default SuperAdminAdminsPage;
