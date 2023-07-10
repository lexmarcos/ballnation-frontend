import classNames from "classnames";
import styles from "./style.module.css";

interface CustomRadioProps {
  label: string;
  values: number[];
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  required?: boolean;
  color?: string;

  //setRoomData: Dispatch<SetStateAction<IRoom>>;
}

const CustomRadio = ({
  label,
  values,
  name,
  onChange,
  className,
  error,
  required,
  color,
}:
CustomRadioProps) => {
  return (
    <div className="">
      <label className="text-white text-sm font-bold">{label}</label>
      <div className={styles.customRadio}>
        {values.map((value) => (
          <>
            <input
              className={styles.customRadio_input}
              type="radio"
              id={`radio${value}`}
              key={`radio${value}`}
              name={name}
              value={value}
              onChange={onChange}
            />
            <label
              className={styles.customRadio_label}
              htmlFor={`radio${value}`}
              key={`labelOfRadio${value}`}
            >
              {value}
            </label>
          </>
        ))}
      </div>
    </div>
  );
};

export default CustomRadio;
