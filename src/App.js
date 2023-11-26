import "./App.css";
import LineChart from "./components/charts/LineChart";
import PieChart from "./components/charts/PieChart";
import { useDispatch, useSelector } from "react-redux";

import { parse, format } from "date-fns";
import { getCountries, getCountryInfo } from "./redux/dashboardSlice";
import { useEffect, useState } from "react";
function convertToStandardDateFormat(dateString) {
  const parsedDate = parse(dateString, "M/d/yy", new Date());
  const formattedDate = format(parsedDate, "yyyy-MM-dd");
  return formattedDate;
}

function App() {
  const [totalCases, setTotalCases] = useState("0");
  const [totalRecoveries, setTotalRecoveries] = useState("0");
  const [totalDeaths, setTotalDeaths] = useState("0");
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const defaultStartDate = convertToStandardDateFormat("1/1/21");
  const defaultEndDate = convertToStandardDateFormat("12/31/22");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [filteredCases, setFilteredCases] = useState("0");
  const [filteredRecoveries, setFilteredRecoveries] = useState("0");
  const [filteredDeaths, setFilteredDeaths] = useState("0");
  const countries = useSelector((state) => state.dashboard.countries);

  const countryInfo = useSelector((state) => state.dashboard.countryInfo);

  const countryList = countries.map((country) => country.name.common);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(getCountries());
  };

  const onChangeHandler = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleStartDateChange = (newStartDate) => {
    // Ensure newStartDate is greater than defaultStartDate and less than endDate
    if (newStartDate > defaultStartDate && newStartDate < endDate) {
      setStartDate(newStartDate);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    // Ensure newEndDate is less than defaultEndDate and greater than startDate
    if (newEndDate < defaultEndDate && newEndDate > startDate) {
      setEndDate(newEndDate);
    }
  };
  useEffect(() => {
    dispatch(getCountryInfo(selectedCountry));
  }, [selectedCountry, dispatch]);

  useEffect(() => {
    const filterDataByDateRange = (startDate, endDate) => {
      const filteredCases = {};
      const filteredRecoveries = {};
      const filteredDeaths = {};
      if (countryInfo?.timeline?.hasOwnProperty("cases")) {
        for (const dateStr in countryInfo.timeline.cases) {
          const date = convertToStandardDateFormat(dateStr);

          if (date >= startDate && date <= endDate) {
            filteredCases[dateStr] = countryInfo.timeline.cases[dateStr];
          }
        }
      }

      if (countryInfo?.timeline?.hasOwnProperty("recovered")) {
        for (const dateStr in countryInfo.timeline.recovered) {
          const date = convertToStandardDateFormat(dateStr);

          if (date >= startDate && date <= endDate) {
            filteredRecoveries[dateStr] =
              countryInfo.timeline.recovered[dateStr];
          }
        }
      }

      if (countryInfo?.timeline?.hasOwnProperty("deaths")) {
        for (const dateStr in countryInfo.timeline.deaths) {
          const date = convertToStandardDateFormat(dateStr);

          if (date >= startDate && date <= endDate) {
            filteredDeaths[dateStr] = countryInfo.timeline.deaths[dateStr];
          }
        }
      }

      return [filteredCases, filteredRecoveries, filteredDeaths];
    };
    const myFilteredData = filterDataByDateRange(startDate, endDate);
    setFilteredCases(myFilteredData[0]);
    setFilteredRecoveries(myFilteredData[1]);
    setFilteredDeaths(myFilteredData[2]);
  }, [startDate, endDate, countryInfo]);

  useEffect(() => {
    if (countryInfo?.timeline?.hasOwnProperty("cases")) {
      const casesEntriesLength = Object.values(filteredCases);
      const additionOfCases = Math.ceil(
        casesEntriesLength.reduce((curr, acc) => curr + acc) / 1000000
      );
      setTotalCases(additionOfCases);
    }

    if (countryInfo?.timeline?.hasOwnProperty("recovered")) {
      const recoveredEntriesLength = Object.values(filteredRecoveries);
      const additionOfRecoveries = Math.ceil(
        recoveredEntriesLength.reduce((curr, acc) => curr + acc) / 1000000
      );
      setTotalRecoveries(additionOfRecoveries);
    }

    if (countryInfo?.timeline?.hasOwnProperty("deaths")) {
      const deathsEntriesLength = Object.values(filteredDeaths);
      const additionOfDeaths = Math.ceil(
        deathsEntriesLength.reduce((curr, acc) => curr + acc) / 1000000
      );
      setTotalDeaths(additionOfDeaths);
    }
  }, [filteredCases]);
  return (
    <div className="App">
      <div className="container outerbox mt-4 p-5">
        <div className="row">
          <div className="col-12">
            <h5 className="text-left">COVID-19 and Population Dashboard</h5>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8 col-lg-8 col-sm-12  rounded">
                <div className="form-group p-1">
                  <select
                    className="form-control border-0 shadow-xxs-1 font-weight-600 selectpicker rounded"
                    title="country"
                    data-style="bg-white"
                    id="country"
                    onClick={(e) => {
                      onClickHandler();
                    }}
                    onChange={(e) => {
                      onChangeHandler(e);
                    }}
                  >
                    <option key="United States" selected>
                      United States
                    </option>
                    {countryList.map((country, index) => (
                      <option
                        key={country}
                        selected={countryList.country === country}
                        value={country}
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12  ">
                <div class="input-group input-daterange  pt-1">
                  <input
                    type="date"
                    class="form-control"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />

                  <input
                    type="date"
                    class="form-control"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">{/* Right side content, if any */}</div>
        </div>

        <div className="row mt-4">
          {/* Cards */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Cases</h5>
                <p className="card-text">{totalCases}M</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recoveries</h5>
                <p className="card-text">{totalRecoveries}M</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Deaths</h5>
                <p className="card-text">{totalDeaths} M</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {/* Charts */}
          <div className="col-md-8">
            {/* Line Chart */}
            <LineChart
              id="lineChart"
              style={{ height: "300px" }}
              filteredData={[filteredCases, filteredRecoveries, filteredDeaths]}
            />
          </div>
          <div className="col-md-4">
            {/* Pie Chart */}
            <PieChart
              id="pieChart"
              style={{ height: "300px" }}
              filteredData={[totalCases, totalRecoveries, totalDeaths]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
