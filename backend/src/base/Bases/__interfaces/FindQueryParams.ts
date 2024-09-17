export interface FindQueryParams {
  page?: string;
  itemsPerPage?: string;
  permanentFilters?: string; //json_encode_string
  filters?: string; //json_encode_string
  simpleSearch?: string; //json_encode_string
  sortBy?: string; //json_encode_string
  sortDesc?: string; //json_encode_string
  project?: string; //json_encode_string
}
