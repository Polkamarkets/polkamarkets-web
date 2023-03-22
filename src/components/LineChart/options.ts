import { relativeTimeFromNow } from 'helpers/date';

function generateCustomOptions(
  theme: string,
  ticker: string,
  xAxisFormat: string
) {
  return {
    chart: {
      type: 'line' as const,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      marker: {
        show: true
      },
      x: {
        show: true,
        formatter: value => `${relativeTimeFromNow(value)}`
      },
      y: {
        show: true,
        formatter: value => `${parseFloat(value).toFixed(3)} ${ticker}`
      }
    },
    legend: {
      show: true,
      markers: {
        width: 16,
        height: 16,
        radius: 2
      },
      itemMargin: {
        horizontal: 6,
        vertical: 2
      },
      fontSize: '14px',
      fontFamily: 'Gilroy',
      fontWeight: 700,
      labels: {
        colors: theme === 'dark' ? ['#F3F4F6'] : ['#313A4C']
      },
      onItemClick: {
        toggleDataSeries: false
      }
    },
    markers: {
      size: 0,
      colors: undefined,
      strokeColors: ['#9F7EFF', '#FF83B0'],
      strokeWidth: 2,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle' as const,
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 3
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        show: true,
        datetimeUTC: false,
        format: xAxisFormat,
        style: {
          cssClass: 'apexcharts-xaxis-label'
        }
      },
      tooltip: {
        enabled: false
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true,
        formatter(value) {
          return `${value}`;
        },
        offsetX: -15,
        style: {
          cssClass: 'apexcharts-yaxis-label'
        }
      },
      min: 0,
      max: 1
    },
    grid: {
      show: true,
      borderColor: theme === 'dark' ? '#252C3B' : '#E3E7F0',
      strokeDashArray: 5,
      position: 'back' as const,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 12,
        left: 0
      }
    },
    colors: ['#9F7EFF', '#FF83B0']
  };
}

export default generateCustomOptions;
