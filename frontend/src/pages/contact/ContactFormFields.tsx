import React from "react";
import type { Control, FieldErrors } from "react-hook-form";
import type { ThemeColors, ThemeMode } from "../../contexts/AdminThemeContext";
import type { ContactFormData } from "./contactTypes";
import { contactFormSectionTitleColor } from "./contactFormTheme";
import { ContactFormTextFieldRow } from "./ContactFormTextFieldRow";
import { ContactFormMessageRow } from "./ContactFormMessageRow";
import { ContactFormSubmitRow } from "./ContactFormSubmitRow";

type Props = {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  colors: ThemeColors;
  theme: ThemeMode;
  isPending: boolean;
  onSubmit: () => void;
};

export const ContactFormFields: React.FC<Props> = ({
  control,
  errors,
  colors,
  theme,
  isPending,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8 flex flex-col h-full">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: contactFormSectionTitleColor(theme) }}
      >
        Connect
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactFormTextFieldRow
          name="name"
          control={control}
          rules={{
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "Name must not exceed 50 characters",
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Name can only contain letters and spaces",
            },
          }}
          label="Your Name *"
          placeholder="Enter your full name"
          errors={errors}
          colors={colors}
          theme={theme}
          isPending={isPending}
        />
        <ContactFormTextFieldRow
          name="email"
          control={control}
          type="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          }}
          label="Your Email *"
          placeholder="Enter your email address"
          errors={errors}
          colors={colors}
          theme={theme}
          isPending={isPending}
        />
      </div>

      <ContactFormTextFieldRow
        name="subject"
        control={control}
        rules={{
          required: "Subject is required",
          minLength: {
            value: 5,
            message: "Subject must be at least 5 characters",
          },
          maxLength: {
            value: 100,
            message: "Subject must not exceed 100 characters",
          },
        }}
        label="Subject *"
        placeholder="What is this regarding?"
        errors={errors}
        colors={colors}
        theme={theme}
        isPending={isPending}
      />

      <ContactFormMessageRow
        control={control}
        errors={errors}
        colors={colors}
        theme={theme}
        isPending={isPending}
      />

      <ContactFormSubmitRow isPending={isPending} />
    </form>
  );
};
