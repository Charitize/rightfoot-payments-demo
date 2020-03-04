interface UnitedStatesTerritory {
  /** The full, unabbreviated name of a territory. */
  name: string,
  /**
   * The ANSI abbreviated name of a territory, e.g. "NY", or "WY".
   * This value should be provided for the user creation process.
   */
  ansi: string
}

/**
 * This data is used for the state selection in the demographics information form.
 */
export const UnitedStatesTerritories: UnitedStatesTerritory[] = [
  {name: "Alabama", ansi: "AL"},
  {name: "Alaska", ansi: "AK"},
  {name: "American Samoa", ansi: "AS"},
  {name: "Arizona", ansi: "AZ"},
  {name: "Arkansas", ansi: "AR"},
  {name: "California", ansi: "CA"},
  {name: "Colorado", ansi: "CO"},
  {name: "Connecticut", ansi: "CT"},
  {name: "Delaware", ansi: "DE"},
  {name: "District of Columbia", ansi: "DC"},
  {name: "Florida", ansi: "FL"},
  {name: "Georgia", ansi: "GA"},
  {name: "Guam", ansi: "GU"},
  {name: "Hawaii", ansi: "HI"},
  {name: "Idaho", ansi: "ID"},
  {name: "Illinois", ansi: "IL"},
  {name: "Indiana", ansi: "IN"},
  {name: "Iowa", ansi: "IA"},
  {name: "Kansas", ansi: "KS"},
  {name: "Kentucky", ansi: "KY"},
  {name: "Louisiana", ansi: "LA"},
  {name: "Maine", ansi: "ME"},
  {name: "Maryland", ansi: "MD"},
  {name: "Massachusetts", ansi: "MA"},
  {name: "Michigan", ansi: "MI"},
  {name: "Minnesota", ansi: "MN"},
  {name: "Mississippi", ansi: "MS"},
  {name: "Missouri", ansi: "MO"},
  {name: "Montana", ansi: "MT"},
  {name: "Nebraska", ansi: "NE"},
  {name: "Nevada", ansi: "NV"},
  {name: "New Hampshire", ansi: "NH"},
  {name: "New Jersey", ansi: "NJ"},
  {name: "New Mexico", ansi: "NM"},
  {name: "New York", ansi: "NY"},
  {name: "North Carolina", ansi: "NC"},
  {name: "North Dakota", ansi: "ND"},
  {name: "Northern Mariana Islands", ansi: "MP"},
  {name: "Ohio", ansi: "OH"},
  {name: "Oklahoma", ansi: "OK"},
  {name: "Oregon", ansi: "OR"},
  {name: "Pennsylvania", ansi: "PA"},
  {name: "Puerto Rico", ansi: "PR"},
  {name: "Rhode Island", ansi: "RI"},
  {name: "South Carolina", ansi: "SC"},
  {name: "South Dakota", ansi: "SD"},
  {name: "Tennessee", ansi: "TN"},
  {name: "Texas", ansi: "TX"},
  {name: "Utah", ansi: "UT"},
  {name: "Vermont", ansi: "VT"},
  {name: "Virgin Islands", ansi: "VI"},
  {name: "Virginia", ansi: "VA"},
  {name: "Washington", ansi: "WA"},
  {name: "West Virginia", ansi: "WV"},
  {name: "Wisconsin", ansi: "WI"},
  {name: "Wyoming", ansi: "WY"},
];
