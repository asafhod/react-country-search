# react-country-search

react-country-search is a React component which allows the user to select countries (and territories)
from a filterable list, or from an interactive world map. The user can narrow down the list by searching for
countries by name, region, or language.

**Demo**: https://reactcountrysearch.netlify.app/

## Features

<ul>
    <li>Search for countries by any of their commonly-used names (e.g. United States, USA), the regions in which they are located (e.g. North America, Middle East), and their commonly-spoken languages</li>
    <li>Automatic search suggestions for regions and languages</li>
    <li>Interactive map with zoom and panning functionality. Countries can also be selected directly from the map.</li>
    <li>Props to control search settings, map visibility, and whether to exclude territories and Antarctica</li>
    <li>Component can output the selected countries as a list of country names or as a list of country ISO codes</li>
    <li>Styling with provided CSS classes</li>
    <li>Supports both mouse & keyboard and touchscreen devices</li>
</ul>

# Usage

```javascript
// import useState
import { useState } from "react";

// import the component and the SelectedCountries type
import ReactCountrySearch from "./ReactCountrySearch";
import type { SelectedCountries } from "./types";

function App() {
  // set up the selectedCountries state and default it to a new Map
  const [selectedCountries, setSelectedCountries] = useState <SelectedCountries>(new Map());

  // pass the selectedCountries state and setter fuction to the component as props
  // the output can be accessed by calling values() or keys(), then converting to an array
  return (
    <>
      <ReactCountrySearch
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />

      {/* selectedCountries.values() will provide the output as country names */}
      {Array.from(selectedCountries.values())}

      {/* selectedCountries.keys() will provide the output as country ISO codes */}
      {Array.from(selectedCountries.keys())}
    </>
  );
}

export default App;
```

# Props

| Prop                 | Default      | Type     | Description                                                                                                                               |
| -------------------- | ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| selectedCountries    | **required** | Map      | State variable for keeping track of the selected countries                                                                                |
| setSelectedCountries | **required** | function | Setter function for selectedCountries state variable                                                                                      |
| showMap              | `true`       | Boolean  | Show/hide the interactive map                                                                                                             |
| mapBackground        | `white`      | String   | Background of the map                                                                                                                     |
| excludeTerritories   | `false`      | Boolean  | Exclude territories from the list and make them unselectable on the map                                                                   |
| excludeAntarctica    | `true`       | Boolean  | Exclude Antarctica from the list and map                                                                                                  |
| filterByRegion       | `true`       | Boolean  | Allow the user to search for countries by region                                                                                          |
| filterByLanguage     | `true`       | Boolean  | Allow the user to search for countries by language                                                                                        |
| onlyCommonLanguages  | `false`      | Boolean  | Narrows down the list of searchable languages to just English, Spanish, French, Portuguese, Italian, German, Chinese, Russian, and Arabic |

# CSS

| CSS Class                                                                                                                                                                                                                                                                                                                                                                                   | Description & Useful Properties                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .country-search                                                                                                                                                                                                                                                                                                                                                                             | Container for the component. Change `max-width` to control how wide the component stretches when space is available.                                                                                                                         |
| .country-search-results                                                                                                                                                                                                                                                                                                                                                                     | Country search results list. Change `height` to control component's height and the number of results shown at one time without scrolling.                                                                                                    |
| .map-land                                                                                                                                                                                                                                                                                                                                                                                   | All land on the map. Can set `fill` / `stroke` color and `stroke-width`.                                                                                                                                                                     |
| .country-highlight.map-color-#                                                                                                                                                                                                                                                                                                                                                              | The colors of selected countries on the map. The map uses four colors in order to distinguish between adjacent selected countries. Substitute # in the class name with 1,2,3, or 4 and change `fill` to set these colors.                    |
| .map-land:hover                                                                                                                                                                                                                                                                                                                                                                             | Change `fill` to set the color of all land on the map when hovered over. **Note**: It's best to wrap this in a media query to prevent touchscreen devices from being affected.                                                               |
| .country-highlight.map-color-#:hover &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Substitute # in the class name with 1,2,3, or 4 and change `fill` to set the color of selected countries on the map when hovered over. **Note**: It's best to wrap this in a media query to prevent touchscreen devices from being affected. |

<!-- # Install -->
