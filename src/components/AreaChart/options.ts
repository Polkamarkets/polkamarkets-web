export default {
  chart: {
    toolbar: {
      show: false
    },
    type: 'area'
  },
  tooltip: {
    custom({ series, seriesIndex, dataPointIndex }) {
      return (
        // eslint-disable-next-line no-useless-concat
        `${'<div class="apexcharts-tooltip-box">' + '<span>'}${
          series[seriesIndex][dataPointIndex]
          // eslint-disable-next-line no-useless-concat
        } DOT </span>` + `</div>`
      );
    }
  },
  markers: {
    size: 0,
    colors: undefined,
    strokeColors: '#5751FC',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: 'circle',
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
    curve: 'smooth',
    width: 1.7
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'hh:mm TT'
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
      formatter(value) {
        return `${value} DOT`;
      }
    }
  },
  grid: {
    show: true,
    borderColor: '#252C3B',
    strokeDashArray: 5,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  colors: ['#5751FC'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.85,
      opacityTo: 0.5
    }
  }
};
