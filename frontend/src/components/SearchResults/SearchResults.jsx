import "./SearchResults.css";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import RadioGroup from "@cloudscape-design/components/radio-group";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import axios from "axios";
import { Categories, ListingStatus, SortBy } from "../../utils/enum";
import Spinner from "@cloudscape-design/components/spinner";
import TokenGroup from "@cloudscape-design/components/token-group";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@cloudscape-design/components/button";
import { LocationModal } from "../../modal/LocationModal";
import { loadListings } from "../../utils/listingService";

export const SearchResults = () => {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [status, setStatus] = useState(ListingStatus.Any);
  const [sort, setSort] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [catTokens, setCatTokens] = useState([]);
  const [catTokensSet, setCatTokensSet] = useState(new Set());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchDistance, setSearchDistance] = useState(20);
  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { address } = useLocationContext();

  const term = searchParams.get("term");

  useEffect(() => {
    // get categories from query if there are any
    let categories = searchParams.get("categories");
    let categoriesCommas = "";
    console.log(window.location.href);
    // handle category tokens
    if (categories !== null && categories.length) {
      let cats = categories.split("_");
      cats = cats.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
      handleSelectCategories(cats);
      categoriesCommas = cats.join(",");
    }

    // get listings based on filters
    const getListings = async () => {
      try {
        setIsLoading(true);
        let res = await axios.get(
          `http://localhost:8000/listing?location=${address}
          &title=${term ?? ""}&categories=${categoriesCommas ?? ""}
          `
        );
        loadListings(res, (data) => {
          setListings(data);
          setAllListings(data);
          setIsLoading(false);
        });
      } catch (error) {}
    };
    getListings();
  }, [searchParams]);

  useEffect(() => {
    // console.log(status, catTokens);
    let filtered = allListings;
    if (status === ListingStatus.Claimed) {
      filtered = filtered.filter((l) => l.claimed);
    } else if (status === ListingStatus.Unclaimed) {
      filtered = filtered.filter((l) => !l.claimed);
    }
    setListings(filtered);
    // console.log(filtered);
  }, [status, allListings]);

  useEffect(() => {
    // redirect based on categories selections
    if (catTokens.length) {
      // if there are selected tokens, set the categories query
      let cats = catTokens.map((catToken) => catToken.label);
      let catURL = cats.join("_");

      // replace current URL with changed category filters
      let url = new URL(window.location.href);
      let params = new URLSearchParams(url.search);
      params.set("categories", catURL);
      params.toString();
      console.log(params.toString());
      if (params !== null) {
        navigate(`/search?${params.toString()}`);
      }
    } else {
      // if there are no selected tokens, remove categories query
      let url = new URL(window.location.href);
      let params = new URLSearchParams(url.search);
      params.delete("categories");
      params.toString();
      console.log(params.toString());
      if (params !== null) {
        navigate(`/search?${params.toString()}`);
      }
    }
  }, [catTokens]);

  useEffect(() => {
    switch (sort) {
      case SortBy.DatePosted:
        setListings(
          listings.sort((a, b) =>
            a.details.posted_date > b.details.posted_date
              ? 1
              : b.details.posted_date > a.details.posted_date
              ? -1
              : 0
          )
        );
        break;
      default:
        return;
    }
  }, [sort]);

  const searchListingsByDistance = async () => {
    try {
      const payload = {
        max_dist: searchDistance,
        address: address,
      };
      const request = "http://localhost:8000/listing/distance-search";
      let result = await axios.post(request, payload);
      setListings(result.data);
      setAllListings(result.data);
    } catch (error) {
      console.log("Unable to search listing");
    }
  };

  const handleSelectCategory = (k) => {
    if (catTokensSet.has(k) === false) {
      setCatTokensSet(new Set([...catTokensSet, k]));
      setCatTokens([...catTokens, { label: k, dismissLabel: `Remove ${k}` }]);
    }
  };

  const handleSelectCategories = (cats) => {
    let newCats = [];
    let newCatTokens = [];
    cats.forEach((c) => {
      if (catTokensSet.has(c) === false) {
        newCats.push(c);
        newCatTokens.push({ label: c, dismissLabel: `Remove ${c}` });
      }
    });
    setCatTokensSet(new Set([...catTokensSet, ...newCats]));
    setCatTokens([...catTokens, ...newCatTokens]);
  };

  const handleRemoveCategory = (itemIndex) => {
    setCatTokensSet(
      new Set([...catTokensSet].filter((x) => x !== catTokens[itemIndex].label))
    );
    setCatTokens([
      ...catTokens.slice(0, itemIndex),
      ...catTokens.slice(itemIndex + 1),
    ]);
  };

  return (
    <div className="search-results">
      <div className="search-bar"></div>
      <h3 className="search-results-title">Search results</h3>
      <div className="search-results-main">
        <div className="filter-bar">
          <h4>Filter By</h4>
          <hr />
          <div className="location">
            <span>
              <h4>Location</h4>
              <h5>Current Location: {address.split(",")[0]}</h5>
              <Button
                variant="primary"
                onClick={() => setShowLocationModal(true)}
              >
                Set Location
              </Button>
              <LocationModal
                show={showLocationModal}
                onClose={() => setShowLocationModal(false)}
              ></LocationModal>
            </span>
          </div>
          <hr />
          <div className="distance">
            <h4>Distance</h4>
            <ButtonDropdown
              className="distance-selector"
              onItemClick={(e) => {
                console.log(e);
                setSearchDistance(parseInt(e.detail.id));
              }}
              items={[
                { text: "1", id: "1" },
                { text: "2", id: "2" },
                { text: "5", id: "5" },
                { text: "10", id: "10" },
                { text: "20", id: "20" },
                { text: "40", id: "40" },
                { text: "80", id: "80" },
                { text: "100", id: "100" },
              ]}
            >
              {searchDistance} Miles
            </ButtonDropdown>
          </div>
          <hr />
          <div className="status">
            <h4>Status</h4>
            <div className="status-buttons">
              <RadioGroup
                onChange={({ detail }) => setStatus(detail.value)}
                value={status}
                items={[
                  { value: ListingStatus.Any, label: ListingStatus.Any },
                  {
                    value: ListingStatus.Claimed,
                    label: ListingStatus.Claimed,
                  },
                  {
                    value: ListingStatus.Unclaimed,
                    label: ListingStatus.Unclaimed,
                  },
                ]}
              />
            </div>
          </div>
          <hr />
          <div className="category">
            <h4>Category</h4>
            <div className="category-options">
              {Object.keys(Categories).map((k) => (
                <span
                  key={k}
                  className="cat-opt"
                  onClick={() => handleSelectCategory(k)}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <hr />
          <div className="search-button">
            <Button
              variant="primary"
              onClick={() => {
                searchListingsByDistance();
              }}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="results">
          <div className="results-bar">
            <TokenGroup
              onDismiss={({ detail: { itemIndex } }) => {
                handleRemoveCategory(itemIndex);
              }}
              items={catTokens}
            />
            <ButtonDropdown
              className="sort-button"
              onItemClick={(e) => {
                console.log(e);
                setSort(e.detail.id);
              }}
              items={[
                {
                  text: SortBy.DatePosted,
                  id: SortBy.DatePosted,
                  disabled: false,
                },
                { text: SortBy.Distance, id: SortBy.Distance, disabled: false },
              ]}
            >
              Sort By
            </ButtonDropdown>
          </div>

          <div className="search-listings">
            {isLoading ? (
              <Spinner />
            ) : listings.length !== 0 ? (
              <>
                {listings.map((listing, key) => (
                  <ListingThumbnail
                    listing={listing}
                    key={key}
                    editListing={false}
                  />
                ))}
              </>
            ) : (
              <p>No listings found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
