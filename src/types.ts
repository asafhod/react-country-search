export type Country = {
  names: string[]; // commonly-used names for the country
  id: string; // country ID in world-map.svg (based on ISO 3166-1 codes)
  langs: string[]; // country's major spoken languages
  regions: string[]; // continents and regions in which the country is located
  isTerritory?: boolean; // whether it is a territory
};

export type Language = {
  name: string; // language's name
  id: string; // language's id
  hideCount?: number; // used for hiding unnecessary language suggestion from search 
                      // results if country in results is a substring of the language's name
                      // e.g. Japan and Japanese
};
  
export type Region = {
  name: string; // region's name
  adj: string; // region's descriptive adjective used in search suggestion, e.g. European
  id: string; //region's id
};

// stores currently selected countries as Map of Country ID to Country Name
export type SelectedCountries = Map<string, string>;

// maps Country ID to flag image filepaths, used for displaying the flags
export type Flags = { [key: string]: string };

// used by the filterCountries function to filter by region or language, if the region/language is found
export type FilterParam = { name: string; id: string } | false | "" | undefined;
