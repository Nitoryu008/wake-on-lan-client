import styles from "./Indicator.module.css";

type Props = {
  isActive: boolean;
};

export const Indicator: React.FC<Props> = ({ isActive }: Props) => {
  return (
    <>
      <span
        className={`${styles.indicator} ${isActive ? styles.active : styles.inactive}`}
      ></span>
      <p>{isActive ? "Active" : "Inactive"}</p>
    </>
  );
};
