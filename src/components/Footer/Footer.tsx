import { Link } from 'react-router-dom';

import cn from 'classnames';
import { ui, community } from 'config';

import { PolkamarketsIcon } from 'assets/icons';

import { Icon } from 'components';

import styles from './Footer.module.scss';

type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn(styles.root, className)}>
      <div className={styles.copyRight}>
        <PolkamarketsIcon />
        <p>&#9400; {year} Polkamarkets Labs</p>
      </div>
      <div className={styles.navigation}>
        {ui.footer.links.map(link => (
          <Link key={link.title} to={link.href}>
            {link.title}
          </Link>
        ))}
        {ui.footer.links.length === 0 && (
          <>
            <Link to="/#">About</Link>
            <Link to="/#">Protocol</Link>
            <Link to="/#">Help</Link>
            <Link to="/#">Blog</Link>
            <Link to="/#">Terms</Link>
            <Link to="/#">Privacy</Link>
          </>
        )}
      </div>

      <div className={styles.social}>
        {community.map(({ name, href }) => (
          <a key={name} href={href} target="_blank" rel="noreferrer">
            <Icon name={name} />
          </a>
        ))}
      </div>
    </footer>
  );
}
