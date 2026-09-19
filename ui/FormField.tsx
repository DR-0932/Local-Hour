import { forwardRef } from "react";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  field_name: string;
  placeholder: string;
  error?: string;
  className?: string;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  {
    field_name,
    placeholder,
    type = "text",
    error,
    className = "",
    ...props
  },
  ref
) {
  return (
    <label className="block sm:col-span-2">
      <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
        {field_name}
      </span>
      <input
        {...props}
        ref={ref}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10 ${className}`.trim()}
      />
      {error ? (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
});

export default FormField;
