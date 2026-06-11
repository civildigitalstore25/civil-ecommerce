import React from 'react';
import { useUpdateAdminPermissions } from '../../api/superadminApi';
import { swalSuccess, swalError } from '../../utils/swal';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const AVAILABLE_PERMISSIONS = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'users', label: 'Users' },
    { value: 'products', label: 'Products' },
    { value: 'categories', label: 'Categories' },
    { value: 'companies', label: 'Companies' },
    { value: 'orders', label: 'Orders' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'banners', label: 'Banner' },
    { value: 'coupons', label: 'Coupons' },
    { value: 'carts', label: 'Carts' },
];

interface Props {
    admin: { _id: string; email: string; permissions?: string[] };
    onClose: () => void;
}

const EditPermissionsModal: React.FC<Props> = ({ admin, onClose }) => {
    const [selected, setSelected] = React.useState<string[]>(admin.permissions || []);
    const update = useUpdateAdminPermissions();
    const { colors } = useAdminTheme();

    const toggle = (p: string) => {
        setSelected(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const save = async () => {
        try {
            await update.mutateAsync({ id: admin._id, permissions: selected });
            onClose();
            await swalSuccess('Permissions updated');
        } catch (err: any) {
            await swalError(err?.response?.data?.message || 'Failed to update permissions');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
            <div
                className="w-full max-w-2xl rounded-lg border p-6"
                style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                }}
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Edit Permissions - {admin.email}</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {AVAILABLE_PERMISSIONS.map(p => (
                        <label key={p.value} className="inline-flex items-center space-x-2">
                            <input type="checkbox" checked={selected.includes(p.value)} onChange={() => toggle(p.value)} />
                            <span style={{ color: colors.text.primary }}>{p.label}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                        style={{
                            borderColor: colors.border.primary,
                            color: colors.text.primary,
                            backgroundColor: colors.background.secondary,
                        }}
                    >
                        Cancel
                    </button>
                    {(() => {
                        const saving = (update as any).isLoading ?? update.status === 'pending';
                        return (
                            <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default EditPermissionsModal;
