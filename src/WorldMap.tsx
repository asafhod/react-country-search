import type { SelectedCountries, Country } from "./types";
import { UncontrolledReactSVGPanZoom as PanZoomViewer } from "react-svg-pan-zoom";
import { ReactComponent as MapSVG } from "./assets/world-map.svg";
import { useState, useEffect, useRef } from "react";
import useResizeObserver from "use-resize-observer";

type WorldMapProps = {
  selectedCountries: SelectedCountries;
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>;
  allCountries: Country[];
  sortCountries: (countries: SelectedCountries) => SelectedCountries;
  excludeTerritories: boolean;
  excludeAntarctica: boolean;
  background: string;
};

// interactive world map component
const WorldMap = ({
  selectedCountries,
  setSelectedCountries,
  allCountries,
  sortCountries,
  excludeTerritories,
  excludeAntarctica,
  background,
}: WorldMapProps): JSX.Element => {
  const coloredCountries = useRef<string[]>([]); // tracks currently colored countries
  const mapRef = useRef<SVGSVGElement>(null); // reference to map SVG
  const { ref: containerRef, width = 0, height = 0 } = useResizeObserver<HTMLDivElement>(); // retrieves width & height from map container, allows for responsive styling
  const [isTouchMove, setIsTouchMove] = useState(false); // for touch screen devices, tracks if touch was a stroke

  // map color is updated whenever countries are selected/unselected
  useEffect(() => {
    colorMap(selectedCountries, coloredCountries, mapRef);
  }, [selectedCountries]);

  return (
    <div className={`country-search-map${excludeAntarctica ? "" : " with-antarctica"}`} ref={containerRef}>
      {/* viewer component which enables pan and zoom functionality for the world map SVG */}
      <PanZoomViewer
        className="country-search-map-panzoom"
        width={width}
        height={height}
        tool={"auto"}
        detectAutoPan={false}
        toolbarProps={{ position: "none" }}
        miniatureProps={{ position: "none", background: "black", width: 0, height: 0 }}
        disableDoubleClickZoomWithToolAuto={true}
        scaleFactorMin={0.99}
        scaleFactorMax={50}
        background={background}
        SVGBackground={background}
      >
        <svg width={width} height={height}>
          {/* world map SVG component with click/touch handlers, view box is adjusted based on whether Antarctica is included */}
          <MapSVG
            ref={mapRef}
            onClick={(e: React.MouseEvent<Element>) =>
              handleClick(e, allCountries, selectedCountries, setSelectedCountries, sortCountries, excludeTerritories)
            }
            viewBox={excludeAntarctica ? "194 0 2368.44 1200.56" : "0 0 2754 1396"} 
            onTouchStart={() => setIsTouchMove(false)}
            onTouchMove={() => setIsTouchMove(true)}
            onTouchEnd={(e: React.TouchEvent<Element>) =>
              handleTouchEnd(e, isTouchMove, allCountries, selectedCountries, setSelectedCountries, sortCountries, excludeTerritories)
            }
          />
        </svg>
      </PanZoomViewer>
    </div>
  );
};

// function which retrieves a Country ID based on a map element, used to identify countries when map is clicked
const getCountryIdFromElement = (element: Element): string => {
  let countryElement: Element = element;

  // iterate up through SVG file to get the ID of the parent country element
  while (!countryElement.id) {
    if (!countryElement.parentElement) throw new Error("Map SVG file invalid: Missing id attributes");
    countryElement = countryElement.parentElement;
  }

  // return empty string if root element is reached without finding a Country ID, e.g. when ocean is clicked
  return countryElement.id === "map-root" ? "" : countryElement.id;
};

// function which queries map SVG for elements using an array of Country IDs, used when coloring countries
const getCountryElementsFromIds = (ids: string[], mapRef: React.RefObject<SVGSVGElement>): NodeListOf<SVGElement> => {
  if (!mapRef.current) throw new Error("Could not acquire reference to Map SVG component");

  const queryString: string = ids.map((id) => "#" + id).join(",");
  const countryElements: NodeListOf<SVGElement> = mapRef.current.querySelectorAll(queryString);
  return countryElements;
};

// function for highlighting/un-highlighting the selected countries on the map
const colorMap = (
  selectedCountries: SelectedCountries,
  coloredCountries: React.MutableRefObject<string[]>,
  mapRef: React.RefObject<SVGSVGElement>
) => {
  // check if any new countries were selected
  const selectedCountryIDs: string[] = [...selectedCountries.keys()];
  if (selectedCountryIDs.length) {
    const newlySelectedIDs: string[] = coloredCountries.current.length
      ? selectedCountryIDs.filter((id: string) => !coloredCountries.current.includes(id))
      : selectedCountryIDs;

    // highlight any newly selected countries
    if (newlySelectedIDs.length) {
      for (const countryElement of getCountryElementsFromIds(newlySelectedIDs, mapRef)) {
        countryElement.classList.add("country-highlight");
      }
    }
  }

  // check if any countries were unselected
  if (coloredCountries.current.length) {
    const newlyUnselectedIDs: string[] = selectedCountryIDs.length
      ? coloredCountries.current.filter((id: string) => !selectedCountryIDs.includes(id))
      : coloredCountries.current;

    // un-highlight any unselected countries
    if (newlyUnselectedIDs.length) {
      for (const countryElement of getCountryElementsFromIds(newlyUnselectedIDs, mapRef)) {
        countryElement.classList.remove("country-highlight");
      }
    }
  }

  // update the coloredCountries reference
  coloredCountries.current = selectedCountryIDs;
};

// function for selecting/unselecting countries when clicking on the map
const handleClick = (
  e: React.MouseEvent<Element> | React.TouchEvent<Element>,
  allCountries: Country[],
  selectedCountries: SelectedCountries,
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>,
  sortCountries: (countries: SelectedCountries) => SelectedCountries,
  excludeTerritories: boolean
) => {
  // get ID of clicked country
  const countryID: string = getCountryIdFromElement(e.target as Element);

  if (countryID) {
    // get data for clicked country using ID
    const country: Country | undefined = allCountries.find((country) => country.id === countryID);
    if (!country) throw new Error(`Country not found for Country ID: ${countryID}`);

    // if country is a territory and territories are excluded, return without selecting it
    if (excludeTerritories && country?.isTerritory) return;

    // copy the selectedCountries state variable
    const newSelectedCountries: SelectedCountries = new Map(selectedCountries);

    if (!newSelectedCountries.get(countryID)) {
      // if country was selected, add the country, sort the selected countries, and update the state
      newSelectedCountries.set(countryID, country.names[0]);
      setSelectedCountries(sortCountries(newSelectedCountries));
    } else {
      // if country was unselected, remove the country and update the state
      newSelectedCountries.delete(countryID);
      setSelectedCountries(newSelectedCountries);
    }
  }
};

// function for selecting/unselecting countries on touch screens
const handleTouchEnd = (
  e: React.TouchEvent<Element>,
  isTouchMove: boolean,
  allCountries: Country[],
  selectedCountries: SelectedCountries,
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountries>>,
  sortCountries: (countries: SelectedCountries) => SelectedCountries,
  excludeTerritories: boolean
) => {
  // checks that touch input was a tap, and not a stroke or pinch
  if (!isTouchMove && e.touches.length === 0)
    handleClick(e, allCountries, selectedCountries, setSelectedCountries, sortCountries, excludeTerritories);
};

export default WorldMap;
