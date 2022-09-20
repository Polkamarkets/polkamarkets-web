import React from 'react';

import { TextProps } from 'components/Text';

export type ModalProps = React.PropsWithChildren<{
  name: string;
  onHide?(): void;
  show: boolean;
}>;

export type ModalHeaderProps = React.ComponentPropsWithoutRef<'header'>;

export type ModalHeaderTitleProps = TextProps;

export type ModalSectionProps = React.ComponentPropsWithoutRef<'section'>;

export type ModalSectionTextProps = TextProps;

export type ModalFooterProps = React.ComponentPropsWithoutRef<'footer'>;

export type ModalContextProps = Omit<ModalProps, 'show'>;
