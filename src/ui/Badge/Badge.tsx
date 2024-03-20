import styles from './Badge.module.scss';

export type BadgeProps = { variant?: string };
export const Badge: React.FC<BadgeProps> = ({ children }) => {
  return <span className={styles.badge}>{children}</span>;
};

export default Badge;
