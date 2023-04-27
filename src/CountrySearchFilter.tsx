import { useRef } from "react";
import searchIcon from "./assets/icons/search-icon.svg";
import clearIcon from "./assets/icons/clear-icon.svg";

type CountrySearchFilterProps = {
  filterByRegion: boolean;
  filterByLanguage: boolean;
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
};

// component for search filter input
const CountrySearchFilter = ({
  filterByRegion,
  filterByLanguage,
  filterText,
  setFilterText,
}: CountrySearchFilterProps): JSX.Element => {
  const filterRef = useRef<HTMLInputElement>(null); // reference to filter input element

  // calculate filter input placeholder based on whether filtering by region/language is enabled
  const placeholder: string =
    "Search by country" +
    (filterByRegion && !filterByLanguage ? " or region" : "") +
    (filterByLanguage && !filterByRegion ? " or language" : "") +
    (filterByRegion && filterByLanguage ? ", region, or language" : "");

  return (
    <div className="country-search-filter-block">
      <p className="country-search-filter-container">
        <input
          className="country-search-filter"
          type="text"
          ref={filterRef}
          value={filterText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
          maxLength={200}
          placeholder={placeholder}
          autoCorrect="off"
        />
        {/* icon which clears search input filter when clicked, only visible when text is entered */}
        <span className="country-filter-clear-icon" onClick={() => clearFilter(filterRef, setFilterText)}>
          <img className="country-filter-icon-image" src={clearIcon} alt="Clear Icon" width="16" height="16" />
        </span>
        <span className="country-filter-search-icon">
          <img className="country-filter-icon-image" src={searchIcon} alt="Search Icon" width="16" height="16" />
        </span>
      </p>
    </div>
  );
};

// function which clears the search input filter
const clearFilter = (filterRef: React.RefObject<HTMLInputElement>, setFilterText: React.Dispatch<React.SetStateAction<string>>) => {
  setFilterText("");
  filterRef.current?.focus(); // prevents filter becoming de-focused when cleared
};

export default CountrySearchFilter;
