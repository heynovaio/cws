import { useNewsletterSignupData } from "@/hooks/use-newletter-signup-data-hook";
import { PrismicRichText } from "@prismicio/react";
import { Container, Button } from "@/components";
import { useState, useRef } from "react";

type Props = {
  lang: string;
};

type NewsletterField = {
  name: string | null;
  type: string | null;
  label: string | null;
  placeholder?: string | null;
};

const NewsletterSignupBanner = ({ lang }: Props) => {
  const { newsletterSignupData, isLoading } = useNewsletterSignupData(lang);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (isLoading || !newsletterSignupData) return null;

  const { title, subtitle, signup_success_message, form_field, submit_button } =
    newsletterSignupData.data;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Mailchimp honeypot field (must be included + left empty)
    formData.append("b_8ee5619b8ee91b0ddf0ee8e84_bc04ac6cf0", "");

    try {
      await fetch(
        "https://heynova.us2.list-manage.com/subscribe/post?u=8ee5619b8ee91b0ddf0ee8e84&id=bc04ac6cf0",
        {
          method: "POST",
          mode: "no-cors", // required to bypass CORS but means no readable response
          body: formData,
        }
      );

      // Success is assumed in no-cors mode — no readable response
      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Mailchimp submission failed", error);
    }
  };

  return (
    <section>
      <Container className="newsletter-signup">
        {" "}
        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <PrismicRichText
              field={title}
              components={{
                heading2: ({ children }) => (
                  <h2 className="text-[2.875rem] font-extrabold text-white text-center leading-tight">
                    {children}
                  </h2>
                ),
              }}
            />

            <div className="mt-6">
              <PrismicRichText field={subtitle} />
            </div>
          </div>

          {success ? (
            <h4 className="font-extrabold text-center">
              {signup_success_message}
            </h4>
          ) : (
            <form className="space-y-8" ref={formRef} onSubmit={handleSubmit}>
              {form_field.map((field: NewsletterField, index: number) => {
                const fieldName = field.name ?? `field-${index}`;
                const fieldType = field.type ?? "text";
                const fieldLabel = field.label ?? "Untitled Field";

                if (field.type === "checkbox") {
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 mt-6"
                    >
                      <input
                        id={fieldName}
                        name={fieldName}
                        type="checkbox"
                        className="min-w-[1.5rem] min-h-[1.5rem] h-7 w-7 border border-black rounded"
                        required
                      />
                      <label
                        htmlFor={fieldName}
                        className="text-white font-semibold"
                      >
                        {field.label}
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={index} className="mb-6">
                    <label
                      htmlFor={fieldName}
                      className="block mb-4 text-white font-semibold"
                    >
                      {fieldLabel}
                    </label>
                    <input
                      id={fieldName}
                      name={fieldName}
                      type={fieldType}
                      placeholder={field.placeholder ?? ""}
                      className="w-full p-4 rounded-xl"
                      required
                    />
                  </div>
                );
              })}

              <Button
                as="button"
                type="submit"
                buttonType="primary"
                label={submit_button[0]?.button_text ?? "Sign Up"}
              />
            </form>
          )}
        </div>
      </Container>
    </section>
  );
};
export default NewsletterSignupBanner;
