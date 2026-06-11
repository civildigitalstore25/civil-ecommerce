import React from 'react';
import { useAdmins, useDeleteAdmin } from '../../api/superadminApi';
import EditPermissionsModal from './EditPermissionsModal';
import { swalConfirm, swalSuccess, swalError } from '../../utils/swal';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

interface Admin {
    _id: string;
    email: string;
    fullName?: string;
    permissions?: string[];
}

const AdminList: React.FC = () => {
    const { data: admins, status, error } = useAdmins();
    const deleteAdmin = useDeleteAdmin();
    const [editing, setEditing] = React.useState<Admin | null>(null);
    const { colors } = useAdminTheme();

    const loading = status === 'pending' || (status as any) === 'loading';

    return (
        <div >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>Admin List</h2>
                <div className="text-sm" style={{ color: colors.text.secondary }}>{Array.isArray(admins) ? `${admins.length} admins` : ''}</div>
            </div>

            {loading && (
                <div className="py-8 text-center" style={{ color: colors.text.secondary }}>Loading admins...</div>
            )}

            {!loading && error && (
                <div className="py-6 text-center text-red-600">Failed to load admins</div>
            )}

            {!loading && Array.isArray(admins) && admins.length === 0 && (
                <div className="py-8 text-center" style={{ color: colors.text.secondary }}>No admins found.</div>
            )}

            <div className="space-y-4">
                {Array.isArray(admins) && admins.map((admin: Admin) => (
                    <div
                        key={admin._id}
                        className="flex flex-col rounded-lg border p-4 transition hover:shadow-sm md:flex-row md:items-center md:justify-between"
                        style={{
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.primary,
                        }}
                    >
                        <div className="flex-1">
                            <div className="font-semibold" style={{ color: colors.text.primary }}>{admin.fullName || admin.email}</div>
                            <div className="text-sm mb-2" style={{ color: colors.text.secondary }}>{admin.email}</div>

                            <div className="flex flex-wrap gap-2">
                                {admin.permissions && admin.permissions.length > 0 ? (
                                    admin.permissions.map(p => (
                                        <span key={p} className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">{p}</span>
                                    ))
                                ) : (
                                    <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">No permissions</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 md:mt-0 md:ml-6 flex gap-2">
                            <button onClick={() => setEditing(admin)} className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Edit</button>
                            <button
                                onClick={async () => {
                                    const ok = await swalConfirm({ title: `Delete admin ${admin.email}?`, text: 'This cannot be undone.' });
                                    if (!ok) return;
                                    try {
                                        await (deleteAdmin as any).mutateAsync(admin._id);
                                        await swalSuccess('Admin deleted');
                                    } catch (err: any) {
                                        await swalError(err?.response?.data?.message || 'Failed to delete admin');
                                    }
                                }}
                                className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editing && <EditPermissionsModal admin={editing} onClose={() => setEditing(null)} />}
        </div>
    );
};

export default AdminList;
