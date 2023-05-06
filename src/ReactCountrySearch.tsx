import "./react-country-search.css";
import { useState } from "react";
import WorldMap from "./WorldMap";
import CountrySearchFilter from "./CountrySearchFilter";
import CountryList from "./CountryList";
import allCountries from "./countries.json";
import type { SelectedCountries } from "./types";

type ReactCountrySearchProps = {
  selectedCountries: SelectedCountries;
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>;
  showMap?: boolean;
  mapBackground?: string;
  excludeTerritories?: boolean;
  excludeAntarctica?: boolean;
  filterByRegion?: boolean;
  filterByLanguage?: boolean;
  onlyCommonLanguages?: boolean;
};

// container component
const ReactCountrySearch = ({
  selectedCountries,
  setSelectedCountries,
  showMap = true,
  mapBackground = "white",
  excludeTerritories = false,
  excludeAntarctica = true,
  filterByRegion = true,
  filterByLanguage = true,
  onlyCommonLanguages = false,
}: ReactCountrySearchProps): JSX.Element => {
  const [filterText, setFilterText] = useState(""); //user's search filter input text

  return (
    <div className="country-search">
      {showMap && (
        <WorldMap
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          allCountries={allCountries}
          sortCountries={sortCountries}
          excludeTerritories={excludeTerritories}
          excludeAntarctica={excludeAntarctica}
          background={mapBackground}
        />
      )}
      <CountrySearchFilter
        filterByRegion={filterByRegion}
        filterByLanguage={filterByLanguage}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <CountryList
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
        allCountries={allCountries}
        sortCountries={sortCountries}
        excludeTerritories={excludeTerritories}
        excludeAntarctica={excludeAntarctica}
        filterByRegion={filterByRegion}
        filterByLanguage={filterByLanguage}
        onlyCommonLanguages={onlyCommonLanguages}
        filterText={filterText}
        setFilterText={setFilterText}
      />
    </div>
  );
};

// function which sorts selectedCountries alphabetically by Country Name when a new country is selected
const sortCountries = (countries: SelectedCountries): SelectedCountries => {
  const sortedCountryEntries: [string, string][] = [...countries.entries()].sort((countryA, countryB) => {
    if (countryA[1] > countryB[1]) return 1;
    if (countryA[1] < countryB[1]) return -1;
    return 0;
  });

  return new Map(sortedCountryEntries);
};

export default ReactCountrySearch;
