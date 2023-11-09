import { Button, Modal } from "@mui/material";

export const DeleteModal = ({ deleteListing, open, setOpen }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="delete-modal-div">
        <h4>Confirm Deletion</h4>
        <span>Are you sure you want to delete this listing?</span>
        <div className="delete-modal-buttons">
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setOpen(false)}
          >
            No
          </Button>
          <Button size="small" variant="outlined" onClick={deleteListing}>
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
