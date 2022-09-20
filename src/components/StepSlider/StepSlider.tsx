/* eslint-disable no-unused-vars */
import Slider from 'rc-slider';

import { useTheme } from 'hooks';

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
};

export type Theme = {
  trackBackgroundColor: string;
  railBackgroundColor: string;
  dotBackgroundColor: string;
  dotBorderColor: string;
  activeDotBackgroundColor: string;
  handleBackgroundColor: string;
  handleBorderColor: string;
};

type Themes = {
  light: Theme;
  dark: Theme;
};

export const themes: Themes = {
  light: {
    trackBackgroundColor: '#8B96A7',
    railBackgroundColor: '#E3E8F0',
    dotBackgroundColor: '#E3E8F0',
    dotBorderColor: '#F8FAFF',
    activeDotBackgroundColor: '#8B96A7',
    handleBackgroundColor: '#FFFFFF',
    handleBorderColor: '#8B96A7'
  },
  dark: {
    trackBackgroundColor: '#637084',
    railBackgroundColor: '#252C3B',
    dotBackgroundColor: '#252C3B',
    dotBorderColor: '#0E1016',
    activeDotBackgroundColor: '#637084',
    handleBackgroundColor: '#FFFFFF',
    handleBorderColor: '#3D455C'
  }
};

type StepSliderProps = {
  currentValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function StepSlider({
  currentValue,
  onChange,
  disabled = false
}: StepSliderProps) {
  const { theme } = useTheme();

  const currentTheme: Theme = themes[theme];

  return (
    <div className="step-slider">
      <Slider
        value={currentValue}
        min={0}
        max={100}
        marks={marks}
        onChange={value => onChange(value)}
        disabled={disabled}
        trackStyle={{ backgroundColor: currentTheme.trackBackgroundColor }}
        railStyle={{ backgroundColor: currentTheme.railBackgroundColor }}
        dotStyle={{
          height: 10,
          width: 10,
          marginBottom: -1,
          backgroundColor: currentTheme.dotBackgroundColor,
          borderColor: currentTheme.dotBorderColor,
          borderWidth: 2
        }}
        activeDotStyle={{
          height: 10,
          width: 10,
          backgroundColor: currentTheme.activeDotBackgroundColor
        }}
        handleStyle={{
          height: 14,
          width: 14,
          backgroundColor: currentTheme.handleBackgroundColor,
          borderColor: currentTheme.handleBorderColor,
          borderWidth: 3,
          boxShadow: 'none'
        }}
      />
    </div>
  );
}

export default StepSlider;
