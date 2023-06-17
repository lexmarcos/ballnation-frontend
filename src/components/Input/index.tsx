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
}: InputProps) => {
  return (
    <div className={className}>
      <label
        className={classNames([
          "text-main-color-dark font-bold text-sm",
          error ? "text-red-500" : "text-black",
        ])}
      >
        {label}
      </label>
      <input
        required={required}
        className={classNames([
          "border border-gray-300 focus-visible:outline-main-color rounded-md p-2 mt-1 w-full text-black ",
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
