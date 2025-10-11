// EnhancedProfilePage.tsx
import { useEffect, useState } from 'react';
import { useCurrentUser, useUpdateProfile } from '../../api/auth';
import FormInput from '../../components/Input/FormInput';
import FormButton from '../../components/Button/FormButton';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });
  const { colors } = useAdminTheme();

  // Update form data when user data changes or when editing mode changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, isEditing]); // Added isEditing to dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Check if there are any changes
    if (formData.fullName === user?.fullName && formData.phoneNumber === user?.phoneNumber) {
      Swal.fire({
        title: 'No Changes',
        text: 'You haven\'t made any changes to your profile.',
        icon: 'info',
        confirmButtonText: 'OK',
        timer: 2000,
      });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(formData);
      await refetch(); // Refresh user data
      setIsEditing(false);

      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.interactive.primary }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div
          className="text-center max-w-md p-6 rounded-lg shadow-md transition-colors duration-200"
          style={{ backgroundColor: colors.background.primary }}
        >
          <h2
            className="text-xl font-semibold mb-2 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Error loading profile
          </h2>
          <p
            className="transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-xl shadow-md overflow-hidden transition-colors duration-200"
          style={{ backgroundColor: colors.background.primary }}
        >
          {/* Header Section */}
          <div
            className="p-6 transition-colors duration-200"
            style={{
              background: `linear-gradient(to right, ${colors.interactive.primary}, ${colors.interactive.secondary})`
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1
                  className="text-2xl font-bold transition-colors duration-200"
                  style={{ color: colors.background.primary }}
                >
                  Profile Information
                </h1>
                <p
                  className="opacity-90 transition-colors duration-200"
                  style={{ color: colors.background.primary }}
                >
                  Manage your personal information
                </p>
              </div>
              {!isEditing && (
                <FormButton
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  className="mt-4 sm:mt-0"
                >
                  Edit Profile
                </FormButton>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div
                className="p-5 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  <svg
                    className="w-5 h-5 mr-2 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: colors.interactive.primary }}
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Personal Information
                </h2>

                {isEditing ? (
                  <div className="space-y-4">
                    <FormInput
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                    <FormInput
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        Full Name
                      </label>
                      <p
                        className="transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        {user?.fullName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        Phone Number
                      </label>
                      <p
                        className="transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        {user?.phoneNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Information Card */}
              <div
                className="p-5 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  <svg
                    className="w-5 h-5 mr-2 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={{ color: colors.interactive.primary }}
                  >
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      Email Address
                    </label>
                    <p
                      className="transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      {user?.email}
                    </p>
                    <p
                      className="text-xs mt-1 transition-colors duration-200"
                      style={{ color: colors.text.accent }}
                    >
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      Account Role
                    </label>
                    <p
                      className="capitalize transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      {user?.role}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      Created
                    </label>
                    <p
                      className="transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      Modified
                    </label>
                    <p
                      className="transition-colors duration-200"
                      style={{ color: colors.text.primary }}
                    >
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div
                className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t transition-colors duration-200"
                style={{ borderColor: colors.border.primary }}
              >
                <FormButton
                  onClick={handleCancel}
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </FormButton>
                <FormButton
                  onClick={handleSave}
                  className="w-full sm:w-auto"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </FormButton>
              </div>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div
          className="mt-6 p-4 rounded-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="flex">
            <svg
              className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 transition-colors duration-200"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ color: colors.interactive.primary }}
            >
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <h3
                className="font-medium transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                Security Note
              </h3>
              <p
                className="text-sm mt-1 transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                Your personal information is secure and will not be shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}