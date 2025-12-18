import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateAdmin } from '../../api/superadminApi';
import { swalSuccess, swalError } from '../../utils/swal';

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
];

type FormValues = {
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    permissions?: string[];
};

const AdminCreateForm: React.FC = () => {
    const { handleSubmit, reset, register, formState: { errors } } = useForm<FormValues>();
    const createAdmin = useCreateAdmin();

    const onSubmit = async (data: FormValues) => {
        const payload = {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            permissions: data.permissions || [],
        };
        try {
            await createAdmin.mutateAsync(payload);
            reset();
            await swalSuccess('Admin created successfully');
        } catch (err: any) {
            await swalError(err?.response?.data?.message || 'Failed to create admin');
        }
    };

    const creating = (createAdmin as any).isLoading ?? createAdmin.status === 'pending';

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Create Admin</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                        })}
                        placeholder="Email"
                        className="w-full p-3 border rounded"
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Minimum 6 characters' }
                        })}
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded"
                    />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                </div>

                <div>
                    <input
                        {...register('fullName')}
                        placeholder="Full name"
                        className="w-full p-3 border rounded"
                    />
                </div>

                <div>
                    <input
                        {...register('phoneNumber')}
                        placeholder="Phone number"
                        className="w-full p-3 border rounded"
                    />
                </div>

                <div className="border p-3 rounded bg-gray-50">
                    <p className="text-sm font-medium mb-2">Permissions</p>
                    <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_PERMISSIONS.map(p => (
                            <label key={p.value} className="inline-flex items-center space-x-2">
                                <input type="checkbox" {...register('permissions')} value={p.value} />
                                <span className="text-sm">{p.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Admin'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCreateForm;
