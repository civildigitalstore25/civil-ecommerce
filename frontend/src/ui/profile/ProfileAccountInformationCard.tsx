import type { User } from "../../api/auth";

function formatUserDate(value: Date | string | undefined): string {
  if (value == null) return "N/A";
  return new Date(value).toLocaleDateString();
}

type Props = {
  colors: any;
  user: User | undefined;
};

export function ProfileAccountInformationCard({ colors, user }: Props) {
  return (
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
        <path
          fillRule="evenodd"
          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
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
          {formatUserDate(user?.createdAt)}
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
          {formatUserDate(user?.updatedAt)}
        </p>
      </div>
    </div>
    </div>
  );
}
