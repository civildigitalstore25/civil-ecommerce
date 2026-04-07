import { ProfileAccountInformationCard } from "./ProfileAccountInformationCard";
import { ProfilePageEditFooter } from "./ProfilePageEditFooter";
import { ProfilePageErrorState } from "./ProfilePageErrorState";
import { ProfilePageHero } from "./ProfilePageHero";
import { ProfilePageLoadingState } from "./ProfilePageLoadingState";
import { ProfilePageSecurityNote } from "./ProfilePageSecurityNote";
import { ProfilePersonalInformationCard } from "./ProfilePersonalInformationCard";
import { useProfilePage } from "./useProfilePage";

export default function ProfilePage() {
  const {
    user,
    isLoading,
    error,
    colors,
    isEditing,
    setIsEditing,
    avatarPreview,
    handleAvatarChange,
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    handleCancel,
    updateProfileMutation,
  } = useProfilePage();

  if (isLoading) {
    return <ProfilePageLoadingState colors={colors} />;
  }

  if (error) {
    return <ProfilePageErrorState colors={colors} />;
  }

  return (
    <div
      className="min-h-screen py-8 px-4 pt-20 transition-colors duration-200 mt-10"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-xl shadow-md overflow-hidden transition-colors duration-200"
          style={{ backgroundColor: colors.background.primary }}
        >
          <ProfilePageHero
            user={user}
            colors={colors}
            isEditing={isEditing}
            avatarPreview={avatarPreview}
            onStartEdit={() => setIsEditing(true)}
            onAvatarChange={handleAvatarChange}
          />

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfilePersonalInformationCard
                colors={colors}
                isEditing={isEditing}
                user={user}
                register={register}
                watch={watch}
                errors={errors}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
              />
              <ProfileAccountInformationCard colors={colors} user={user} />
            </div>

            {isEditing && (
              <ProfilePageEditFooter
                colors={colors}
                isPending={updateProfileMutation.isPending}
                onCancel={handleCancel}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        </div>

        <ProfilePageSecurityNote colors={colors} />
      </div>
    </div>
  );
}
