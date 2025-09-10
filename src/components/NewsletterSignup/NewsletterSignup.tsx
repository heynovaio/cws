import { useNewsletterSignupData } from "@/hooks/use-newletter-signup-data-hook";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { Container, Button, Section } from "@/components";
import { useState, useRef } from "react";

type Props = {
  lang: string; // "en" | "fr-ca"
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

// ---- Helpers ----
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { FNAME: "", LNAME: "" };
  if (parts.length === 1) return { FNAME: parts[0], LNAME: "" };
  return { FNAME: parts[0], LNAME: parts.slice(1).join(" ") };
}

// Map various common Prismic field names to a semantic key we’ll use to build Mailchimp fields.
const NAME_HINTS = new Set([
  "name", "full_name", "fullname", "full-name",
  "nom", "prenom_nom"
]);
const FNAME_HINTS = new Set(["fname", "first_name", "first-name", "first", "prenom"]);
const LNAME_HINTS = new Set(["lname", "last_name", "last-name", "last", "surname", "nom_de_famille"]);

const NewsletterSignupBanner = ({ lang }: Props) => {
  const { newsletterSignupData, isLoading } = useNewsletterSignupData(lang);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({
    hasErrors: false,
    requiredFieldsError: false,
    emailError: false,
    invalidFields: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (isLoading || !newsletterSignupData) return null;

  const { title, subtitle, signup_success_message, form_field, submit_button } =
    newsletterSignupData.data;

  const validateForm = (formData: FormData): ErrorState => {
    const newErrors: ErrorState = {
      hasErrors: false,
      requiredFieldsError: false,
      emailError: false,
      invalidFields: [],
    };

    // Validate required text inputs (skip checkboxes entirely)
    form_field.forEach((field: NewsletterField, index: number) => {
      const rawType = (field.type ?? "text").toLowerCase();
      if (rawType === "checkbox") return; // we’re not using checkboxes

      const fieldName = field.name ?? `field-${index}`;
      const val = (formData.get(fieldName) as string) ?? "";

      if (!val || val.trim() === "") {
        newErrors.requiredFieldsError = true;
        newErrors.hasErrors = true;
        newErrors.invalidFields.push(fieldName);
      }

      // Email format check if this field is clearly the email one
      if (
        (rawType === "email" || fieldName.toLowerCase() === "email") &&
        val &&
        !emailRegex.test(val)
      ) {
        newErrors.emailError = true;
        newErrors.hasErrors = true;
        if (!newErrors.invalidFields.includes(fieldName)) {
          newErrors.invalidFields.push(fieldName);
        }
      }
    });

    // Defensive: ensure EMAIL is present and valid even if Prismic mislabels
    const possibleEmail =
      (formData.get("EMAIL") as string) ??
      (formData.get("email") as string) ??
      "";

    if (!possibleEmail || !emailRegex.test(possibleEmail)) {
      newErrors.emailError = true;
      newErrors.hasErrors = true;
      if (!newErrors.invalidFields.includes("EMAIL")) {
        newErrors.invalidFields.push("EMAIL");
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate
    const validationErrors = validateForm(formData);
    if (validationErrors.hasErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({
      hasErrors: false,
      requiredFieldsError: false,
      emailError: false,
      invalidFields: [],
    });

    // ------ Build payload for API (EMAIL, FNAME, LNAME only) ------
    // We’ll look through Prismic fields to find email and names.
    let EMAIL = "";
    let FNAME = "";
    let LNAME = "";

    // First pass: capture explicit FNAME/LNAME if they exist
    form_field.forEach((field: NewsletterField, index: number) => {
      const name = (field.name ?? `field-${index}`).toLowerCase();
      const val = ((formData.get(field.name ?? `field-${index}`) as string) || "").trim();
      if (!val) return;

      if (name === "email" || (field.type ?? "").toLowerCase() === "email") {
        EMAIL = val;
      } else if (FNAME_HINTS.has(name)) {
        FNAME = val;
      } else if (LNAME_HINTS.has(name)) {
        LNAME = val;
      }
    });

    // Second pass: if no explicit FNAME/LNAME, look for a single NAME field and split
    if (!FNAME && !LNAME) {
      for (let i = 0; i < form_field.length; i++) {
        const field = form_field[i];
        const name = (field.name ?? `field-${i}`).toLowerCase();
        const type = (field.type ?? "text").toLowerCase();
        if (type === "checkbox") continue;

        if (NAME_HINTS.has(name)) {
          const full = ((formData.get(field.name ?? `field-${i}`) as string) || "").trim();
          if (full) {
            const parts = splitName(full);
            FNAME = parts.FNAME;
            LNAME = parts.LNAME;
          }
          break;
        }
      }
    }

    // Final fallback: if still no FNAME but some non-email text fields exist, use the first as FNAME
    if (!FNAME) {
      for (let i = 0; i < form_field.length; i++) {
        const field = form_field[i];
        const type = (field.type ?? "text").toLowerCase();
        if (type === "checkbox") continue;
        const n = field.name ?? `field-${i}`;
        if (n.toLowerCase() === "email") continue;
        const val = ((formData.get(n) as string) || "").trim();
        if (val) {
          FNAME = val;
          break;
        }
      }
    }

    // Build final payload – only required Mailchimp fields
    const payload: Record<string, string> = { EMAIL };
    if (FNAME) payload.FNAME = FNAME;
    // include LNAME if present (OK if your audience does not require it)
    if (LNAME) payload.LNAME = LNAME;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({ ok: false }));

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Mailchimp submission failed", error);
      setErrors((prev) => ({
        ...prev,
        hasErrors: true,
      }));
    } finally {
      setSubmitting(false);
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
                const rawType = (field.type ?? "text").toLowerCase();

                // Skip any checkbox fields coming from Prismic (we removed consent)
                if (rawType === "checkbox") return null;

                const fieldName = field.name ?? `field-${index}`;
                const fieldType =
                  (field.name?.toLowerCase() === "email" || rawType === "email")
                    ? "email"
                    : "text";
                const fieldLabel = field.label ?? "Untitled Field";
                const hasError = getFieldError(fieldName);
                const errorId = `${fieldName}-error`;

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
                      autoComplete={fieldType === "email" ? "email" : "on"}
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