import type { ComponentMeta, ComponentStory } from '@storybook/react';

import Icon from './Icon';

const Meta: ComponentMeta<typeof Icon> = {
  component: Icon,
  argTypes: {
    dir: {}
  }
};
const Story: ComponentStory<typeof Icon> = props => <Icon {...props} />;

const Example = Story.bind({});
Example.args = {
  name: 'Arrow',
  title: 'Go back somewhere',
  size: 'lg',
  dir: 'up'
};

export default Meta;
export { Example };
