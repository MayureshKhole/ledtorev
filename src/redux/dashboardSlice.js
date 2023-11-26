import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCountries = createAsyncThunk("getCountries", async () => {
  let response;
  try {
    response = await axios.get(` https://restcountries.com/v3.1/all`);
  } catch (error) {
    console.log("error in option list", error);
  }

  return response.data;
});

export const getCountryInfo = createAsyncThunk(
  "getCountryInfo",
  async (country) => {
    let response;
    try {
      response = await axios.get(
        ` https://disease.sh/v3/covid-19/historical/${country}?lastdays=1500`
      );
    } catch (error) {
      console.log("error in option list", error);
    }

    return response.data;
  }
);

const initialState = {
  selectedCountry: "United States",
  countryInfo: {},
  countries: [],
  status: "",
  error: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setCountry: (state, action) => {
      console.log("i am action.payload", action.payload);
      state.selectedCountry = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // get Country List
      .addCase(getCountries.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries = action.payload;
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // get Country Info
      .addCase(getCountryInfo.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCountryInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countryInfo = action.payload;
      })
      .addCase(getCountryInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCountry } = dashboardSlice.actions;

export default dashboardSlice.reducer;
