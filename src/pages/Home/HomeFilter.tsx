import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  useForm,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue
} from 'react-hook-form';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Adornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  Toggle,
  useTheme,
  RangePicker
} from 'ui';

import { Icon, Modal, ToggleSwitch } from 'components';
import type { ModalProps } from 'components/Modal';

import {
  Dropdown,
  DropdownState,
  DropdownMultipleState,
  ToggleState,
  Toggles,
  Dropdowns,
  filtersInitialState
} from 'contexts/filters';
import type { UpdateDropdownPayload } from 'contexts/filters/filters.type';

import { useFilters, usePrevious } from 'hooks';

import homeClasses from './Home.module.scss';

type FormFields = {
  favorites: ToggleState;
  states: DropdownState | DropdownMultipleState;
  networks: DropdownState | DropdownMultipleState;
  volume: DropdownState | DropdownMultipleState;
  liquidity: DropdownState | DropdownMultipleState;
  endDate: DropdownState | DropdownMultipleState;
};

type ListItemNestedProps = {
  name: string;
  subitems: Dropdown;
  multiple: boolean;
  register: UseFormRegister<FormFields>;
  watch: UseFormWatch<FormFields>;
  setValue: UseFormSetValue<FormFields>;
  updateDropdown: ({ dropdown, state }: UpdateDropdownPayload) => void;
};

function HomeFilterModal(
  props: Pick<ModalProps, 'show' | 'onHide' | 'children'>
) {
  return (
    <Modal
      fullScreen
      disableGutters
      initial={{ x: -304 }}
      animate={{ x: 0 }}
      exit={{ x: -304 }}
      {...props}
    />
  );
}
function ModalFilterAnimation({
  show,
  ...props
}: Pick<ModalProps, 'show' | 'children'>) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={homeClasses.filter}
          initial={{ width: 0, x: -264, opacity: 0 }}
          animate={{ width: 'auto', x: 0, opacity: 1 }}
          exit={{ width: 0, x: -264, opacity: 0 }}
          {...props}
        />
      )}
    </AnimatePresence>
  );
}
function ListItemNested({
  name,
  subitems,
  multiple,
  register,
  watch,
  setValue,
  updateDropdown
}: ListItemNestedProps) {
  const [expand, setExpand] = useState(false);
  const handleExpand = useCallback(() => {
    setExpand(prevExpand => !prevExpand);
  }, []);

  // TODO: Fix this type assertion
  const field = watch(name as keyof FormFields) as any;
  const { current: previousField } = usePrevious(field);

  const handleChangeRange = useCallback(
    range => {
      if (field !== 'custom') {
        setValue(name as keyof FormFields, 'custom');
      }

      updateDropdown({
        dropdown: name as Dropdowns,
        state: `${range.start ? range.start.utc() : ''}-${
          range.end ? range.end.utc() : ''
        }`
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, setValue, updateDropdown]
  );

  return (
    <>
      <ListItem
        ButtonProps={{
          onClick: handleExpand
        }}
      >
        <ListItemText>{subitems.title}</ListItemText>
        <Adornment $edge="end" $size="sm">
          <Icon name="Chevron" size="lg" dir={expand ? 'up' : 'down'} />
        </Adornment>
      </ListItem>
      <AnimatePresence>
        {expand && (
          <motion.div
            className={homeClasses.filterSub}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <List className={homeClasses.filterSubList}>
              {subitems.options.map(option => (
                <ListItem key={option.value}>
                  <ListItemText>{option.label}</ListItemText>
                  <Adornment $edge="end" $size="sm">
                    <Toggle
                      type={multiple ? 'checkbox' : 'radio'}
                      value={option.value}
                      checked={
                        multiple
                          ? field.includes(option.value)
                          : field === option.value
                      }
                      {...register(name as keyof FormFields)}
                    />
                  </Adornment>
                </ListItem>
              ))}
              {name === 'endDate' ? (
                <ListItem className={homeClasses.filterSubListItem}>
                  <RangePicker
                    shouldCallOnChange={
                      previousField !== 'custom' && field === 'custom'
                    }
                    onChange={handleChangeRange}
                  />
                </ListItem>
              ) : null}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default function HomeFilter({
  onFilterHide,
  rect,
  show
}: {
  onFilterHide(): void;
  rect: DOMRect;
  show: boolean;
}) {
  const theme = useTheme();
  const { filters, controls } = useFilters();
  const { updateToggle, updateDropdown } = controls;

  const ModalFilterRoot = theme.device.isDesktop
    ? ModalFilterAnimation
    : HomeFilterModal;

  const { register, watch, setValue } = useForm<FormFields>({
    defaultValues: {
      ...filtersInitialState.toggles,
      ...filtersInitialState.dropdowns
    }
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (Object.values(Toggles).includes(name as Toggles)) {
        updateToggle({
          toggle: name as Toggles,
          state: value[`${name}`]
        });
      } else if (Object.values(Dropdowns).includes(name as Dropdowns)) {
        updateDropdown({
          dropdown: name as Dropdowns,
          state: value[`${name}`]
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, updateToggle, updateDropdown]);

  return (
    <ModalFilterRoot
      show={show}
      {...(theme.device.isDesktop
        ? {
            style: {
              height: window.innerHeight - rect.height,
              top: rect.height
            }
          }
        : { onHide: onFilterHide })}
    >
      <List className={homeClasses.filterList}>
        <form className={homeClasses.filterForm}>
          {!theme.device.isDesktop && (
            <ListItem
              ButtonProps={{
                onClick: onFilterHide
              }}
            >
              <ListItemText>Filter</ListItemText>
              <Adornment $edge="end" $size="sm">
                <Icon name="Cross" />
              </Adornment>
            </ListItem>
          )}
          <ListItem>
            <ListItemText>{filters.toggles.favorites.title}</ListItemText>
            <Adornment $edge="end" $size="sm">
              <ToggleSwitch id="favorites" {...register('favorites')} />
            </Adornment>
          </ListItem>
          {Object.keys(filters.dropdowns).map(dropdrown => (
            <Fragment key={dropdrown}>
              <Divider />
              <ListItemNested
                name={dropdrown}
                subitems={filters.dropdowns[dropdrown]}
                multiple={filters.dropdowns[dropdrown].multiple}
                register={register}
                watch={watch}
                setValue={setValue}
                updateDropdown={updateDropdown}
              />
            </Fragment>
          ))}
        </form>
      </List>
    </ModalFilterRoot>
  );
}
