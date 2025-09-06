import { useNewsletterSignupData } from "@/hooks/use-newletter-signup-data-hook";
import { PrismicRichText } from "@prismicio/react";
import { Container, Button, Section } from "@/components";
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

type ErrorState = {
  hasErrors: boolean;
  requiredFieldsError: boolean;
  emailError: boolean;
  invalidFields: string[];
};

const NewsletterSignupBanner = ({ lang }: Props) => {
  const { newsletterSignupData, isLoading } = useNewsletterSignupData(lang);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({
    hasErrors: false,
    requiredFieldsError: false,
    emailError: false,
    invalidFields: [],
  });
  const formRef = useRef<HTMLFormElement>(null);

  if (isLoading || !newsletterSignupData) return null;

  const { title, subtitle, signup_success_message, form_field, submit_button } =
    newsletterSignupData.data;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (formData: FormData): ErrorState => {
    const newErrors: ErrorState = {
      hasErrors: false,
      requiredFieldsError: false,
      emailError: false,
      invalidFields: [],
    };

    form_field.forEach((field: NewsletterField, index: number) => {
      const fieldName = field.name ?? `field-${index}`;
      const fieldValue = formData.get(fieldName) as string;

      if (field.type === "checkbox") {
        return;
      }

      if (!fieldValue || fieldValue.trim() === "") {
        newErrors.requiredFieldsError = true;
        newErrors.hasErrors = true;
        newErrors.invalidFields.push(fieldName);
      }

      if (field.type === "email" && fieldValue && !validateEmail(fieldValue)) {
        newErrors.emailError = true;
        newErrors.hasErrors = true;
        if (!newErrors.invalidFields.includes(fieldName)) {
          newErrors.invalidFields.push(fieldName);
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate form
    const validationErrors = validateForm(formData);

    if (validationErrors.hasErrors) {
      setErrors(validationErrors);

      return;
    }

    // Clear errors if validation passes
    setErrors({
      hasErrors: false,
      requiredFieldsError: false,
      emailError: false,
      invalidFields: [],
    });

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

  const getFieldError = (fieldName: string): boolean => {
    return errors.invalidFields.includes(fieldName);
  };

  return (
    <Section data-slice-type="newsletter_signup" id="newsletter">
      <Container className="newsletter-signup hover-shadow">
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
            <form
              className="space-y-8"
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-describedby={errors.hasErrors ? "form-errors" : undefined}
            >
              {form_field.map((field: NewsletterField, index: number) => {
                const fieldName = field.name ?? `field-${index}`;
                const fieldType = field.type ?? "text";
                const fieldLabel = field.label ?? "Untitled Field";
                const hasError = getFieldError(fieldName);
                const errorId = `${fieldName}-error`;

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
                        className={`min-w-[1.5rem] min-h-[1.5rem] h-7 w-7 border border-black rounded focus ${
                          hasError ? "border-ultra-pink" : "border-black"
                        }`}
                        required
                        aria-describedby={hasError ? errorId : undefined}
                        aria-invalid={hasError}
                      />
                      <label
                        htmlFor={fieldName}
                        className={`font-semibold ${
                          hasError ? "text-ultra-pink" : "text-white"
                        }`}
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
                      className={`block mb-4 font-semibold ${
                        hasError ? "text-ultra-pink" : "text-white"
                      }`}
                    >
                      {fieldLabel}
                    </label>
                    <input
                      id={fieldName}
                      name={fieldName}
                      type={fieldType}
                      placeholder={field.placeholder ?? ""}
                      className={`w-full p-4 rounded-xl border-2 focus ${
                        hasError
                          ? "border-ultra-pink focus:ring-ultra-p-500 focus:border-red-500"
                          : "border-transparent focus:ring-blue-500 focus:border-blue-500"
                      }`}
                      required
                      aria-describedby={hasError ? errorId : undefined}
                      aria-invalid={hasError}
                    />
                  </div>
                );
              })}
              {/* Error Messages */}
              {errors.hasErrors && (
                <div
                  id="form-errors"
                  role="alert"
                  aria-live="polite"
                  className="flex flex-col gap-4"
                >
                  {errors.requiredFieldsError && (
                    <label>
                      {lang === "fr-ca"
                        ? "Veuillez remplir tous les champs obligatoires."
                        : "Please fill out all required sections."}
                    </label>
                  )}
                  {errors.emailError && (
                    <label>
                      {lang === "fr-ca"
                        ? "Veuillez entrer un e-mail valide."
                        : "Please enter a valid email."}
                    </label>
                  )}
                </div>
              )}
              <Button
                as="button"
                type="submit"
                buttonType="primary"
                label={
                  submit_button[0]?.button_text ??
                  (lang === "fr-ca" ? "S'inscrire" : "Sign Up")
                }
              />
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default NewsletterSignupBanner;
