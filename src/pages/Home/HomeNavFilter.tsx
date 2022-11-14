import { Fragment, useState } from 'react';

import { Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { Adornment, Divider, List, ListItem, ListItemText, Toggle } from 'ui';

import {
  Input,
  Button,
  DateInput,
  Icon,
  Modal,
  ToggleSwitch
} from 'components';

export default function HomeNavFilter() {
  const [show, setShow] = useState(false);
  const [expand, setExpand] = useState({
    network: false,
    endDate: false,
    liquidity: false
  });
  const [toggle, setToggle] = useState({
    network: {
      Binance: false,
      Moonbeam: false,
      Ethereum: false
    },
    endDate: {
      Any: false,
      'Ends today': false,
      'Ends this week': false,
      'Ends this month': false,
      Custom: false
    },
    liquidity: {
      Any: false,
      'Under $5,000': false,
      '$5,000 - $10,000': false,
      'Over $10,000': false,
      Custom: false
    }
  });

  function handleExpand(name: string) {
    return () =>
      setExpand(prevExpand => ({
        ...prevExpand,
        [name]: !prevExpand[name]
      }));
  }
  function handleToggle(name: string) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setToggle(prevToggle => ({
        ...prevToggle,
        [name]: {
          ...prevToggle[name],
          [event.target.name]: event.target.checked
        }
      }));
  }
  function handleShow() {
    setShow(true);
  }
  function handleHide() {
    setShow(false);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="pm-p-home__navigation__actions"
        onClick={handleShow}
      >
        <Icon name="Filter" />
        Filter
      </Button>
      <Modal
        show={show}
        backdrop
        fullScreen
        initial={{ x: -304 }}
        animate={{ x: 0 }}
        exit={{ x: -304 }}
      >
        <Formik
          onSubmit={() => {}}
          initialValues={{
            start: null,
            end: null,
            min: '',
            max: ''
          }}
        >
          <List className="pm-p-home__filter-list">
            <ListItem>
              <ListItemText>Filter</ListItemText>
              <Adornment edge="end">
                <Icon name="Cross" onClick={handleHide} />
              </Adornment>
            </ListItem>
            <ListItem>
              <ListItemText>Verified</ListItemText>
              <Adornment edge="end">
                <ToggleSwitch name="verified" onChange={() => {}} />
              </Adornment>
            </ListItem>
            <ListItem>
              <ListItemText>Favorites</ListItemText>
              <Adornment edge="end">
                <ToggleSwitch name="favorites" onChange={() => {}} />
              </Adornment>
            </ListItem>
            <Divider />
            <ListItem onClick={handleExpand('network')}>
              <ListItemText>Network</ListItemText>
              <Adornment edge="end">
                <Icon
                  name="Chevron"
                  size="lg"
                  dir={expand.network ? 'up' : 'down'}
                />
              </Adornment>
            </ListItem>
            <AnimatePresence>
              {expand.network && (
                <motion.div
                  style={{ overflow: 'hidden' }}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  <List className="pm-p-home__filter-list-sublist">
                    {Object.keys(toggle.network).map(network => (
                      <ListItem key={network}>
                        <ListItemText>{network}</ListItemText>
                        <Adornment edge="end">
                          <Toggle
                            type="checkbox"
                            checked={toggle.network[network]}
                            value={network}
                            name={network}
                            onChange={handleToggle('network')}
                          />
                        </Adornment>
                      </ListItem>
                    ))}
                  </List>
                </motion.div>
              )}
            </AnimatePresence>
            <Divider />
            <ListItem onClick={handleExpand('endDate')}>
              <ListItemText>End Date</ListItemText>
              <Adornment edge="end">
                <Icon
                  name="Chevron"
                  size="lg"
                  dir={expand.endDate ? 'up' : 'down'}
                />
              </Adornment>
            </ListItem>
            <AnimatePresence>
              {expand.endDate && (
                <motion.div
                  style={{ overflow: 'hidden' }}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  <List className="pm-p-home__filter-list-sublist">
                    {Object.keys(toggle.endDate).map(endDate => (
                      <Fragment key={endDate}>
                        <ListItem>
                          <ListItemText>{endDate}</ListItemText>
                          <Adornment edge="end">
                            <Toggle
                              type="checkbox"
                              checked={toggle.endDate[endDate]}
                              value={endDate}
                              name={endDate}
                              onChange={handleToggle('endDate')}
                            />
                          </Adornment>
                        </ListItem>
                        {endDate === 'Custom' && (
                          <ListItem>
                            <div className="pm-p-home__filter-list-sublist-inputs">
                              <DateInput
                                name="start"
                                emptyLabel="Start"
                                format="DD/MM/YYYY"
                              />
                              to
                              <DateInput
                                name="end"
                                emptyLabel="End"
                                format="DD/MM/YYYY"
                              />
                            </div>
                          </ListItem>
                        )}
                      </Fragment>
                    ))}
                  </List>
                </motion.div>
              )}
            </AnimatePresence>
            <Divider />
            <ListItem onClick={handleExpand('liquidity')}>
              <ListItemText>Liquidity</ListItemText>
              <Adornment edge="end">
                <Icon
                  name="Chevron"
                  size="lg"
                  dir={expand.liquidity ? 'up' : 'down'}
                />
              </Adornment>
            </ListItem>
            <AnimatePresence>
              {expand.liquidity && (
                <motion.div
                  style={{ overflow: 'hidden' }}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  <List className="pm-p-home__filter-list-sublist">
                    {Object.keys(toggle.liquidity).map(liquidity => (
                      <Fragment key={liquidity}>
                        <ListItem>
                          <ListItemText>{liquidity}</ListItemText>
                          <Adornment edge="end">
                            <Toggle
                              type="checkbox"
                              checked={toggle.liquidity[liquidity]}
                              value={liquidity}
                              name={liquidity}
                              onChange={handleToggle('liquidity')}
                            />
                          </Adornment>
                        </ListItem>
                        {liquidity === 'Custom' && (
                          <ListItem>
                            <div className="pm-p-home__filter-list-sublist-inputs">
                              <Input
                                name="min"
                                placeholder="Min"
                                className="pm-p-home__filter-list-sublist-inputs-input"
                              />
                              to
                              <Input
                                name="max"
                                placeholder="Max"
                                className="pm-p-home__filter-list-sublist-inputs-input"
                              />
                            </div>
                          </ListItem>
                        )}
                      </Fragment>
                    ))}
                  </List>
                </motion.div>
              )}
            </AnimatePresence>
          </List>
        </Formik>
      </Modal>
    </>
  );
}
