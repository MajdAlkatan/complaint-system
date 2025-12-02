import { configureStore } from '@reduxjs/toolkit'

// Add other reducers as needed

const store = configureStore({
  reducer: {
  
    // dashboard: dashboardReducer,
  },
})

export default store