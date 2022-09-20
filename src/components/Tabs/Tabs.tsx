import { createContext, useContext, useMemo, ReactNode, Children } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

import Divider from '../Divider';

const ActiveTabContext = createContext({});

function getChildrenTabs(children): { name: string; id: string }[] {
  return Children.map(children, child => {
    if (!isNull(child)) {
      return {
        name: child.props.tab,
        id: child.props.id
      };
    }

    return child;
  }).filter(child => !isNull(child));
}

type TabPaneProps = {
  /**
   * Name of the tab pane
   */
  tab: string;
  /**
   * Id of the tab pane
   */
  id: string;
  children?: ReactNode;
};

function TabPane({ tab, id, children }: TabPaneProps) {
  const activeTab = useContext(ActiveTabContext);

  if (activeTab !== id || !tab) return null;

  return <>{children}</>;
}

type TabsProps = {
  /**
   * Direction of the tabs items
   * @default 'row'
   */
  direction?: 'row' | 'column';
  /**
   * Custom filter component
   */
  fullwidth?: boolean;
  value: string;
  onChange: (_value: string) => void;
  filters?: ReactNode[];
  children?: ReactNode;
};

/**
 * Tabs to switch between different views
 */
function Tabs({
  direction = 'row',
  filters,
  fullwidth,
  children,
  value,
  onChange
}: TabsProps) {
  const tabs = useMemo(() => getChildrenTabs(children), [children]);
  const tabsIds = tabs.map(tab => tab.id);

  if (!tabsIds.includes(value) || !children) return null;

  return (
    <div className={classNames({ 'pm-c-tabs': true, 'width-full': fullwidth })}>
      <div className="pm-c-tabs__header">
        <ul className={`pm-c-tabs__list--${direction}`}>
          {tabs?.map((tab, index) => (
            <li
              key={tab.id}
              tabIndex={index}
              className={classNames({
                'pm-c-tabs__item': true,
                active: value === tab.id
              })}
            >
              <button
                type="button"
                name={tab.name}
                onClick={() => onChange(tab.id)}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
        {!isUndefined(filters) && !isEmpty(filters) ? (
          <ul className="pm-c-tabs__filters">
            {filters.map((filter, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                {filter}
                <Divider variant="circle" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ActiveTabContext.Provider value={value}>
        <div className="pm-c-tabs__content">{children}</div>
      </ActiveTabContext.Provider>
    </div>
  );
}

Tabs.TabPane = TabPane;

export default Tabs;
