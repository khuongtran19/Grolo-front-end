import React from "react";
import { tagPost } from "../../services/tag.server.js";
import PropTypes from "prop-types";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
class TagInfo extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };
  state = {
    name: "",
    tenantId: ""
  };
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };
  handleCreateClicked = () => {
    const name = this.state.name;
    tagPost({ name })
      .then(response => {
        this.props.history.push("./");
        NotificationManager.success("Success!", "You create new tag");
      })
      .catch(response => {
        NotificationManager.error("Waring!", "This tag already created, please create another tag");
      });
  };
  handleCancel = () => {
    this.props.history.push("./");
  };
  render() {
    return (
      <div className="main-panel">
        <div className="card">
          <div className="card-block pt-3">
            <div className="clearfix">
              <div name="create">
                <h3>Create new tag:</h3>
                <br />
                <div className="input-group col-10">
                  <input
                    className="form-control mr-1"
                    type="text"
                    name="name"
                    autoFocus
                    onChange={this.handleChange}
                    style={{ borderRadius: "50px" }}
                  />
                  <button
                    className="mr-1 btn btn-round btn-success"
                    onClick={this.handleCreateClicked}
                  >
                    Create <i className="fa fa-thumbs-o-up" />
                  </button>
                  <button className="mr-1 btn btn-round btn-secondary" onClick={this.handleCancel}>
                    Cancel <i className="fa fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default TagInfo;
