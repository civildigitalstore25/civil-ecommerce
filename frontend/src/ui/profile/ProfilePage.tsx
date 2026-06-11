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

  const pageBackground =
    typeof colors.interactive.primary === "string"
      ? `linear-gradient(180deg, ${colors.interactive.primary}10 0%, ${colors.background.secondary} 34%, ${colors.background.primary} 100%)`
      : colors.background.secondary;

  return (
    <div
      className="min-h-screen px-3 pb-8 pt-28 transition-colors duration-200 sm:px-4 sm:pb-10 sm:pt-36"
      style={{ background: pageBackground }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className="overflow-hidden rounded-xl shadow-md transition-colors duration-200"
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

          <div className="p-4 sm:p-6">
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
