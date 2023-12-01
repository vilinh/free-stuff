import { useLocationContext } from "../context/Location/LocationContext";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import Autocomplete from "react-google-autocomplete";
import Icon from "@cloudscape-design/components/icon";
import { useState } from "react";
import Button from "@cloudscape-design/components/button";
import './LocationModal.css'

export const LocationModal = ({ show, onClose }) => {
  const [searchLoc, setSearchLoc] = useState("");
  const { findLocation, setAddress, loading, address } = useLocationContext();

  const handlePlaceSelected = (place) => {
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const address = place.formatted_address;
    const loc = {
      address,
      latitude,
      longitude,
    };
    setSearchLoc(address);
  };

  const confirmPlaceSelected = () => {
    setAddress(searchLoc);
    onClose();
    setSearchLoc("");
  };

  const handleFindLocation = () => {
    findLocation();
    setSearchLoc("");
  };

  return (
    <Modal onDismiss={() => onClose()} visible={show} header="Pick a Location">
      <SpaceBetween direction="vertical">
        <div className="modal-contents">
          <div id="loc-modal-instructions">
            Manually enter location or click the Find My Location button to do
            it automatically.
          </div>
          <div className="manual-input">
            <Autocomplete
              style={{
                border: ".05rem solid",
                borderRadius: ".25rem",
                width: "80%",
                fontSize: "1rem",
                padding: ".5rem",
              }}
              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={handlePlaceSelected}
              options={{
                types: ["address"],
              }}
              onChange={() => {
                setSearchLoc("");
              }}
            />
            <Button
              onClick={() => confirmPlaceSelected()}
              disabled={searchLoc === ""}
              variant="primary"
            >
              Ok
            </Button>
          </div>
          <div className="autolocate-div">
            <Button onClick={() => handleFindLocation()}>
              Find My Location
            </Button>
            <span style={{ marginLeft: "1rem" }}>
              {loading ? (
                <Spinner />
              ) : (
                address && (
                  <div className="autolocate-result">
                    {address}
                    <div id="check-icon" onClick={() => onClose()}>
                      <Icon name="check" variant="success" />
                    </div>
                  </div>
                )
              )}
            </span>
          </div>
        </div>
      </SpaceBetween>
    </Modal>
  );
};
