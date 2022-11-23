import { Button } from 'components/Button';
import Icon from 'components/Icon';

import { useTheme } from 'hooks';

export default function NavBarActionsTheme() {
  const theme = useTheme();
  const isThemeDark = theme.theme === 'dark';
  const themeAnti = isThemeDark ? 'light' : 'dark';

  function handleTheme() {
    theme.setTheme(themeAnti);
  }

  return (
    <Button
      variant="outline"
      color="default"
      aria-label="Switch theme"
      onClick={handleTheme}
    >
      <Icon name={isThemeDark ? 'Sun' : 'Moon'} />
    </Button>
  );
}
