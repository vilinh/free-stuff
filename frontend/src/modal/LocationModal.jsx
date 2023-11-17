import { useLocationContext } from "../context/Location/LocationContext";
import Modal from "@cloudscape-design/components/modal";

export const LocationModal = ({show, onClose}) => {
    
    const { findLocation, setAddress, loading, address } = useLocationContext();
  
    return (
        <Modal
            onDismiss={() => onClose()}
            visible={show}
            header="Test"
        >
      </Modal>
    );
  };