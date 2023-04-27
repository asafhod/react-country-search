import { useState } from "react";
import ReactCountrySearch from "./ReactCountrySearch";
import { SelectedCountries } from "./types";

function App() {
  const [selectedCountries, setSelectedCountries] = useState<SelectedCountries>(new Map());

  return (
    <div className="App" style={{ margin: "5px" }}>
      <ReactCountrySearch
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
        showMap={true}
        mapBackground={""}
        excludeTerritories={false}
        excludeAntarctica={true}
        filterByRegion={true}
        filterByLanguage={true}
        onlyCommonLanguages={false}
      />
      {/* Testing data access from outside component */}
      <span style={{ fontSize: "10.47px" }}>{Array.from(selectedCountries.values()).join(" ")}</span>
    </div>
  );
}

export default App;
