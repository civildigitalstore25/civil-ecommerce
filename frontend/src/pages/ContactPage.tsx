import { ContactPageHeader } from "./contact/ContactPageHeader";
import { ContactPageIntro } from "./contact/ContactPageIntro";
import { ContactInfoCards } from "./contact/ContactInfoCards";
import { ContactFormFields } from "./contact/ContactFormFields";
import { ContactSupportInfo } from "./contact/ContactSupportInfo";
import { ContactPageLayout } from "./contact/ContactPageLayout";
import { useContactPage } from "./contact/useContactPage";

const ContactPage = () => {
  const page = useContactPage();

  return (
    <ContactPageLayout
      seoData={page.seoData}
      colors={page.colors}
      theme={page.theme}
    >
      <ContactPageHeader />
      <ContactPageIntro theme={page.theme} colors={page.colors} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 p-12 pt-8">
        <ContactInfoCards theme={page.theme} colors={page.colors} />
        <ContactFormFields
          control={page.control}
          errors={page.errors}
          colors={page.colors}
          theme={page.theme}
          isPending={page.isPending}
          onSubmit={page.onFormSubmit}
        />
      </div>

      <ContactSupportInfo theme={page.theme} colors={page.colors} />
    </ContactPageLayout>
  );
};

export default ContactPage;
