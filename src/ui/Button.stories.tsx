import type { ComponentMeta, ComponentStory } from '@storybook/react';

import Button from './Button';

const Meta: ComponentMeta<typeof Button> = {
  component: Button,
  argTypes: {
    $variant: {},
    $color: {}
  }
};
const Story: ComponentStory<typeof Button> = props => <Button {...props} />;

const Example = Story.bind({});
Example.args = {
  children: "I'm a button",
  $variant: 'text',
  $color: 'text'
};

export default Meta;
export { Example };
