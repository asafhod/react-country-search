import { useMemo } from "react";
import type { Country, Region, Language, FilterParam, SelectedCountries } from "./types";
import regions from "./regions.json";
import langData from "./langs.json";
import regionIcon from "./assets/icons/region-icon.svg";
import langIcon from "./assets/icons/lang-icon.svg";
import flags from "./flags";

type CountryListProps = {
  filterByRegion: boolean;
  filterByLanguage: boolean;
  onlyCommonLanguages: boolean;
  excludeTerritories: boolean;
  excludeAntarctica: boolean;
  allCountries: Country[];
  selectedCountries: SelectedCountries;
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>;
  sortCountries: (countries: SelectedCountries) => SelectedCountries;
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
};

// component for country search results, contains list of countries and region/language suggestions
const CountryList = ({
  filterByRegion,
  filterByLanguage,
  onlyCommonLanguages,
  excludeTerritories,
  excludeAntarctica,
  allCountries,
  selectedCountries,
  setSelectedCountries,
  sortCountries,
  filterText,
  setFilterText,
}: CountryListProps): JSX.Element => {
  // remove periods & spaces from user search input and convert to lower case
  const filterTextFormatted: string = filterText.replace(/\./g, "").trim().toLowerCase();
  
  // allow filtering by all languages or just by common languages, based on onlyCommonLanguages prop
  const languages: Language[] = onlyCommonLanguages ? langData.commonLangs : langData.langs;

  // filter countries based on prop settings and user input
  // memoize the result to prevent re-calculation when countries are selected
  const filteredCountries: Country[] = useMemo(
    () =>
      filterCountries(
        filterTextFormatted,
        allCountries,
        languages,
        filterByLanguage,
        filterByRegion,
        excludeTerritories,
        excludeAntarctica
      ),
    [filterTextFormatted, excludeTerritories, excludeAntarctica, allCountries, languages, filterByLanguage, filterByRegion]
  );

  // filter region suggestions
  const filteredRegions: Region[] = filterRegions(filterByRegion, filterTextFormatted, excludeAntarctica, excludeTerritories);
  
  //filter language suggestions
  const filteredLangs: Language[] = filterLangs(filterByLanguage, filterTextFormatted, languages, filteredCountries);

  return (
    <>
      <p className="country-all-none-block">
        <span
          className="country-all-none-btn"
          onClick={() => selectAll(filteredCountries, selectedCountries, setSelectedCountries, sortCountries)}
        >
          Select All
        </span>
        <span className="country-all-none-btn" onClick={() => selectNone(filteredCountries, selectedCountries, setSelectedCountries)}>
          Select None
        </span>
      </p>
      {/* map filtered countries and region/language suggestions to their label components */}
      <div className="country-search-results">
        {filteredRegions.map((region: Region) => {
          return <RegionLangLabel key={region.id} data={region} isRegion={true} icon={regionIcon} setFilterText={setFilterText} />;
        })}
        {filteredLangs.map((lang: Language) => {
          return <RegionLangLabel key={lang.id} data={lang} isRegion={false} icon={langIcon} setFilterText={setFilterText} />;
        })}
        {filteredCountries.map((country: Country) => {
          return (
            <CountryLabel
              key={country.id}
              country={country}
              flag={flags[country.id]} // get flag from flags mapping object
              checked={Boolean(selectedCountries.get(country.id))} // get checkbox value from selectedCountries state variable
              setSelectedCountries={setSelectedCountries}
              sortCountries={sortCountries}
            />
          );
        })}
        {/* hidden by default, shown when no search results are found */}
        <span className="country-search-no-results">No results</span>
      </div>
    </>
  );
};

// function for filtering the countries based on prop settings and user search input
const filterCountries = (
  filterTextFormatted: string,
  allCountries: Country[],
  languages: Language[],
  filterByLanguage: boolean,
  filterByRegion: boolean,
  excludeTerritories: boolean,
  excludeAntarctica: boolean
): Country[] => {
  // attempt to retrieve language and region based on user search input
  const language: FilterParam =
    filterByLanguage && filterTextFormatted && languages.find((lang) => lang.name.toLowerCase() === filterTextFormatted);
  const region: FilterParam =
    filterByRegion && filterTextFormatted && regions.find((region) => region.name.toLowerCase() === filterTextFormatted);

  // filter the countries
  const filteredCountries: Country[] = allCountries.filter((country) => {
    if (excludeTerritories && country?.isTerritory) return false; // exclude if territory and excludeTerritories is true
    if (excludeAntarctica && country.id === "aq") return false; // exclude Antarctica if excludeAntarctica is true
    if (language) return country.langs.includes(language.id); // if user input is a language, include any country that speaks that language
    if (region) return country.regions.includes(region.id); // if user input is a region, include any country that is in that region
    if (filterTextFormatted) { // if user input exists and is not a language or region, include countries whose names start with the input
      for (const name of country.names) {
        if (name.toLowerCase().startsWith(filterTextFormatted)) return true;
      }
      return false;
    }
    return true;
  });

  return filteredCountries;
};

// function for filtering the region suggestions
const filterRegions = (
  filterByRegion: boolean,
  filterTextFormatted: string,
  excludeAntarctica: boolean,
  excludeTerritories: boolean
): Region[] => {
  if (filterByRegion && filterTextFormatted) {
    return regions.filter(
      ({ name, id }) =>
        name.toLowerCase() !== filterTextFormatted && // if user input matches region name perfectly, no need to suggest it, because it's already being searched
        name.toLowerCase().startsWith(filterTextFormatted) && // suggest any region whose name starts with the user's input
        !(excludeAntarctica && excludeTerritories && id === "ant") // do not suggest the Antarctic region if all of its countries/territories are excluded
    );
  }

  return [];
};

// function for filtering the language suggestions
const filterLangs = (
  filterByLanguage: boolean,
  filterTextFormatted: string,
  languages: Language[],
  filteredCountries: Country[]
): Language[] => {
  if (filterByLanguage && filterTextFormatted) {
    return languages.filter(
      ({ name, hideCount }) =>
        name.toLowerCase() !== filterTextFormatted && // if user input matches language name perfectly, no need to suggest it, because it's already being searched
        name.toLowerCase().startsWith(filterTextFormatted) && // suggest any language whose name starts with the user's input
        (hideCount ? filteredCountries.length !== hideCount : true) // do not suggest language if the number of results matches its hideCount (see Language type)
    );
  }

  return [];
};

// function for selecting all countries from current search results
const selectAll = (
  filteredCountries: Country[],
  selectedCountries: SelectedCountries,
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>,
  sortCountries: (countries: SelectedCountries) => SelectedCountries
) => {
  if (filteredCountries.length) {
    // copy the selectedCountries state variable
    const newSelectedCountries: SelectedCountries = new Map(selectedCountries);

    // if a country is not already selected, add it
    for (const { id, names } of filteredCountries) {
      if (!newSelectedCountries.get(id)) {
        newSelectedCountries.set(id, names[0]);
      }
    }    
    // sort the selected countries and update the state
    setSelectedCountries(sortCountries(newSelectedCountries));
  }
};

// function for unselecting all countries from current search results
const selectNone = (
  filteredCountries: Country[],
  selectedCountries: SelectedCountries,
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>
) => {
  if (filteredCountries.length && selectedCountries.size) {
    // copy the selectedCountries state variable
    const newSelectedCountries: SelectedCountries = new Map(selectedCountries);

    // if a country is currently selected, remove it
    for (const { id } of filteredCountries) {
      if (newSelectedCountries.get(id)) {
        newSelectedCountries.delete(id);
      }
    }
    // update the state
    setSelectedCountries(newSelectedCountries);
  }
};

type RegionLangLabelProps = {
  data: Region | Language;
  isRegion: boolean;
  icon: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
};

// component which labels a region/language suggestion search result item
const RegionLangLabel = ({ data, isRegion, icon, setFilterText }: RegionLangLabelProps): JSX.Element => {
  return (
    // when clicked, sets the search filter input to the region/language name
    <div className="country-search-result" onClick={() => setFilterText(data.name)}>
      <img
        src={icon}
        alt={`${isRegion ? "Region" : "Language"} Icon`}
        width="16"
        height="16"
        className="country-search-region-lang-icon"
      />
      {/* sets the suggestion text based on the region's adjective (see Region type) or the language's name */}
      {isRegion ? `${(data as Region).adj} countries` : `${data.name}-speaking countries`}
    </div>
  );
};

type CountryLabelProps = {
  country: Country;
  flag: string;
  checked: boolean;
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>;
  sortCountries: (countries: SelectedCountries) => SelectedCountries;
};

// component which labels a country search result item
const CountryLabel = ({ country, flag, checked, setSelectedCountries, sortCountries }: CountryLabelProps): JSX.Element => {
  return (
    <label className="country-search-result">
      <input
        type="checkbox"
        className="country-search-result-chk"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleCheck(e, country.id, country.names[0], setSelectedCountries, sortCountries)
        }
      />
      <img src={flag} alt={`Flag of ${country.names[0]}`} width="16" height="16" className="country-search-flag-icon" />      
      {country.names[0]} {/* display country's most common name */}
    </label>
  );
};

// function which selects/unselects a country when the user toggles its checkbox
const handleCheck = (
  e: React.ChangeEvent<HTMLInputElement>,
  countryID: string,
  countryName: string,
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>,
  sortCountries: (countries: SelectedCountries) => SelectedCountries
) => {
  setSelectedCountries((prevSelectedCountries: SelectedCountries) => {
    // copy the selectedCountries state variable
    const newSelectedCountries: SelectedCountries = new Map(prevSelectedCountries);

    if (e.target.checked) {
      // if country checkbox was checked, add the country, sort the selected countries, and update the state
      newSelectedCountries.set(countryID, countryName);
      return sortCountries(newSelectedCountries);
    } else {
      // if country checkbox was unchecked, remove the country and update the state
      newSelectedCountries.delete(countryID);
      return newSelectedCountries;
    }
  });
};

export default CountryList;
