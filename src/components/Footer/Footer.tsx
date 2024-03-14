import { Link } from 'react-router-dom';

import cn from 'classnames';

import { PolkamarketsIcon, TwitterIcon } from 'assets/icons';
import DiscordIcon from 'assets/icons/DiscordIcon';
import InstagramIcon from 'assets/icons/InstagramIcon';

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
        <Link to="/#">About</Link>
        <Link to="/#">Protocol</Link>
        <Link to="/#">Help</Link>
        <Link to="/#">Blog</Link>
        <Link to="/#">Terms</Link>
        <Link to="/#">Privacy</Link>
      </div>

      <div className={styles.social}>
        <a
          href="https://twitter.com/polkamarkets"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon />
        </a>
        <a
          href="https://discord.gg/polkamarkets"
          target="_blank"
          rel="noreferrer"
        >
          <DiscordIcon />
        </a>
        <a
          href="https://www.instagram.com/polkamarkets"
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon />
        </a>
      </div>
    </footer>
  );
}
