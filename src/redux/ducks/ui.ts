import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rightSidebar: {
    visible: false
  },
  tradeForm: {
    visible: false
  },
  liquidityForm: {
    visible: false
  },
  reportForm: {
    visible: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    closeRightSidebar: state => ({
      ...state,
      rightSidebar: {
        visible: false
      }
    }),
    openTradeForm: state => ({
      ...state,
      sidebar: {
        collapsed: true
      },
      rightSidebar: {
        visible: true
      },
      reportForm: {
        visible: false
      },
      tradeForm: {
        visible: true
      }
    }),
    closeTradeForm: state => ({
      ...state,
      tradeForm: {
        visible: false
      },
      rightSidebar: {
        visible: false
      }
    }),
    openLiquidityForm: state => ({
      ...state,
      tradeForm: {
        visible: false
      },
      liquidityForm: {
        visible: true
      }
    }),
    closeLiquidityForm: state => ({
      ...state,
      liquidityForm: {
        visible: false
      },
      tradeForm: {
        visible: true
      }
    }),
    openReportForm: state => ({
      ...state,
      liquidityForm: {
        visible: false
      },
      tradeForm: {
        visible: false
      },
      rightSidebar: {
        visible: true
      },
      reportForm: {
        visible: true
      }
    }),
    closeReportForm: state => ({
      ...state,
      rightSidebar: {
        visible: false
      },
      reportForm: {
        visible: false
      }
    })
  }
});

export default uiSlice.reducer;

export const {
  closeRightSidebar,
  openTradeForm,
  closeTradeForm,
  openLiquidityForm,
  closeLiquidityForm,
  openReportForm,
  closeReportForm
} = uiSlice.actions;
