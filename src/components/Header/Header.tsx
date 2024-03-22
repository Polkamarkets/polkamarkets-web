import cn from 'classnames';

import styles from './Header.module.scss';
import HeaderActions from './HeaderActions/HeaderActions';
import HeaderNav from './HeaderNav/HeaderNav';
import { SearchBar } from './SearchBar/SearchBar';

export default function Header() {
  return (
    <header className={cn(styles.root)}>
      <HeaderNav />
      <SearchBar className={styles.searchBar} />
      <HeaderActions />
    </header>
  );
}
