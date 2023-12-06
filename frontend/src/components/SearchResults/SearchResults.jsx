import "./SearchResults.css";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import RadioGroup from "@cloudscape-design/components/radio-group";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import axios from "axios";
import { Condition, Categories, ListingStatus, SortBy } from "../../utils/enum";
import Spinner from "@cloudscape-design/components/spinner";
import TokenGroup from "@cloudscape-design/components/token-group";
import Multiselect from "@cloudscape-design/components/multiselect";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@cloudscape-design/components/button";
import { LocationModal } from "../../modal/LocationModal";
import { loadListings, getListingByDistance } from "../../utils/listingService";
import {
  NotifMsg,
  NotifType,
  useNotif,
} from "../../context/Notifications/NotificationContext";

export const SearchResults = () => {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [status, setStatus] = useState(ListingStatus.Any);
  const [isLoading, setIsLoading] = useState(true);
  const [catTokens, setCatTokens] = useState([]);
  const [catTokensSet, setCatTokensSet] = useState(new Set());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchDistance, setSearchDistance] = useState(20);
  const [sortToggle, setSortToggle] = useState(false);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createNotif } = useNotif();
  const { address, location } = useLocationContext();

  const term = searchParams.get("term");
  const sort = searchParams.get("sort");
  const condition = searchParams.get("condition");
  const claimed = searchParams.get("claimed");

  useEffect(() => {
    ///handle category tokens
    let categoriesCommas = [...catTokensSet].join(",");

    // get listings based on filters
    const getListings = async () => {
      let query = `http://localhost:8000/listing?&title=${
        term ?? ""
      }&categories=${categoriesCommas ?? ""}&condition=${
        condition ?? ""
      }&claimed=${claimed ?? ""}&sort=${sort ?? ""}`;

      if (
        location &&
        Object.hasOwn(location, "latitude") &&
        Object.hasOwn(location, "longitude")
      ) {
        let lat = location.latitude;
        let lng = location.longitude;
        if (lat && lng) {
          query += `&latlng=${lat},${lng}&radius=${searchDistance}`;
        }
      }

      try {
        setIsLoading(true);

        console.log(query);
        let res = await axios.get(query);
        loadListings(res, (data) => {
          setListings(data);
          setAllListings(data);
          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getListings();
  }, [searchParams, location, catTokensSet]);

  const handleClaimed = (opt) => {
    setStatus(opt);
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    if (opt === ListingStatus.Any) {
      params.set("claimed", "");
    } else if (opt === ListingStatus.Claimed) {
      params.set("claimed", "true");
    } else if (opt === ListingStatus.Unclaimed) {
      params.set("claimed", "false");
    }
    params.toString();
    if (params) {
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleCondition = (selected) => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    setConditionOptions(selected.selectedOptions);
    const conditionsComma = selected.selectedOptions
      .map((opt) => opt["label"])
      .join(",");
    console.log(conditionsComma);
    params.set("condition", conditionsComma);
    if (params) {
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleSort = (sort) => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    params.set("sort", sort);
    params.toString();
    if (params) {
      navigate(`/search?${params.toString()}`);
    }
  };

  useEffect(() => {
    handleFilterDistance(searchDistance);
  }, [address]);

  const handleSelectCategory = (k) => {
    if (catTokensSet.has(k) === false) {
      setCatTokensSet(new Set([...catTokensSet, k]));
      setCatTokens([...catTokens, { label: k, dismissLabel: `Remove ${k}` }]);
    }
  };

  const handleRemoveCategory = (itemIndex) => {
    setCatTokensSet(
      new Set(
        [...catTokensSet].filter((x) => x !== catTokens[itemIndex].label),
      ),
    );
    setCatTokens([
      ...catTokens.slice(0, itemIndex),
      ...catTokens.slice(itemIndex + 1),
    ]);
  };

  const handleFilterDistance = async (dist) => {
    // check for address first
    if (address === "") {
      createNotif(NotifMsg.LOCATION_ERROR, NotifType.ERROR);
      return;
    }
    setSearchDistance(dist);
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
                const dist = parseInt(e.detail.id);
                handleFilterDistance(dist);
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
                onChange={({ detail }) => handleClaimed(detail.value)}
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

          <div className="condition">
            <h4>Condition</h4>
            <div className="condition-buttons">
              <Multiselect
                selectedOptions={conditionOptions}
                onChange={({ detail }) => handleCondition(detail)}
                options={[
                  {
                    label: "Great",
                    value: Condition.Great,
                  },
                  {
                    label: "Good",
                    value: Condition.Good,
                  },
                  {
                    label: "Okay",
                    value: Condition.Okay,
                  },
                  {
                    label: "Poor",
                    value: Condition.Poor,
                  },
                ]}
                placeholder="Filter by condition"
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
                handleSort(e.detail.id);
              }}
              items={[
                {
                  text: SortBy.Location,
                  id: SortBy.Location,
                  disabled: address === "",
                },
                {
                  text: SortBy.Latest,
                  id: SortBy.Latest,
                },
                {
                  text: SortBy.Earliest,
                  id: SortBy.Earliest,
                },
                {
                  text: SortBy.Condition,
                  id: SortBy.Condition,
                },
                {
                  text: SortBy.Title,
                  id: SortBy.Title,
                },
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
