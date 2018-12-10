import React from "react";
import PropTypes from "prop-types";
import { tagPut, tagDelete } from "../../services/tag.server";
import { withRouter } from "react-router-dom";
import TagListData from "./TagListData";
import Paginator from "../../shared/Paginator";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NotificationManager } from "react-notifications";
class TagSearch extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };
  state = {
    name: "",
    tenantId: "",
    modal: false
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  handleEdit = (id, name, activeStatus) => {
    if (id) {
      tagPut(id, { id, name, activeStatus }).then(
        () => (
          // eslint-disable-next-line
          this.props.loadPage(), NotificationManager.success("Success!", "Tag updated")
        )
      );
    }
  };
  handleDelete = id => {
    tagDelete(id).then(
      () => (
        // eslint-disable-next-line
        this.toggle(),
        this.props.executeQuery(),
        NotificationManager.success("Success!", "Tag deleted")
      )
    );
  };
  render() {
    const { response, pageIndex, totalPages, goToPage, totalCount, checkActive } = this.props;
    let searchData = response.item.pagedItems;
    return (
      <div>
        <div>
          <div name="item" className="row">
            {searchData.map(item => (
              <span
                className="btn btn-outline-info mr-2 col-5.5"
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "25px"
                }}
              >
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={item.activeStatus}
                  onChange={() => (
                    // eslint-disable-next-line
                    checkActive(item.id), this.handleEdit(item.id, item.name, !item.activeStatus)
                  )}
                />
                <TagListData
                  activeStatus={item.activeStatus}
                  value={item.name}
                  handleSaveClicked={value => this.handleEdit(item.id, value, item.activeStatus)}
                />
                <i
                  className="fa fa-trash-o danger"
                  onClick={() => {
                    this.toggle();
                    this.setState({ id: item.id });
                  }}
                />
              </span>
            ))}
          </div>
          {!!totalCount && (
            <div
              style={{ display: "flex", justifyContent: "space-between", position: "center" }}
              className="mt-2 mb-2"
            >
              <Paginator
                currentPage={parseInt(pageIndex)}
                totalPages={totalPages}
                goTo={goToPage}
              />
            </div>
          )}
        </div>
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Warning !</ModalHeader>
            <ModalBody style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "bold" }}>Are you sure you want to delete this tag ? </h3>
              <h5>All post that associate with this tag will be delete</h5>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => this.handleDelete(this.state.id)}>
                Delete
              </Button>
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}
export default withRouter(TagSearch);
