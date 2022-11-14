import { useCallback, useRef, FormEvent } from 'react';

import cn from 'classnames';

import { SearchIcon } from 'assets/icons';

import { SearchBarProps } from './SearchBar.type';

/**
 * A search bar with standard search input
 */
function SearchBar({ className, onSearch, ...props }: SearchBarProps) {
  const inputElementRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (inputElementRef.current) {
        onSearch(inputElementRef.current.value);
      }
    },
    [onSearch]
  );

  return (
    <form
      role="search"
      className={cn('pm-c-searchbar', className?.form)}
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputElementRef}
        type="text"
        role="searchbox"
        autoComplete="off"
        className={cn('pm-c-searchbar__input', className?.input)}
        {...props}
      />
      <button
        type="submit"
        aria-label="Search"
        className={cn('pm-c-searchbar__icon', className?.button)}
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default SearchBar;
