import { createSlice } from '@reduxjs/toolkit';

const getInitialData = () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem('user_data'));
    const savedToken = localStorage.getItem('token');
    return { user: savedUser, token: savedToken };
  } catch (err) {
    return { user: null, token: null };
  }
};

const storageData = getInitialData();

const initialState = {
  user: storageData.user || null,
  token: storageData.token || null,
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user_data', JSON.stringify(action.payload.user));
    },
    // هذا الأكشن هو المسؤول عن إصلاح خطأ "is not a function"
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user_data', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
    },
  },
});

export const { setUser, updateUserProfile, logout } = userSlice.actions;
export default userSlice.reducer;