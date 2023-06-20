import classNames from "classnames";

interface InputProps {
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  required?: boolean;
  color?: string;
}

const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
  error,
  required,
  color,
}: InputProps) => {
  return (
    <div className={className}>
      <label
        className={classNames([
          "font-bold text-sm",
          error ? "text-red-500" : "text-black",
          color ? `text-${color}` : "text-main-color-dark",
        ])}
      >
        {label}
      </label>
      <input
        required={required}
        className={classNames([
          "border border-gray-300 rounded-md p-2 mt-1 w-full text-black ",
          color ? `focus-visible:outline-${color}` : "focus-visible:outline-main-color",
          error ? "border-red-500" : "border-gray-300",
        ])}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default Input;
