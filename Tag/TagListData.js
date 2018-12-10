import React from "react";
class TagListData extends React.Component {
  state = {
    value: null
  };
  handleClear = () => {
    this.setState({ value: "" });
  };
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };
  changeValue = () => {
    this.setState({ value: this.props.value });
  };
  handleCancel = () => {
    this.setState({ value: null });
  };
  render() {
    const activeStatus = this.props.activeStatus;
    const value = this.props.value;
    return (
      <div
        onClick={() => {
          if (this.state.value === null) this.changeValue();
        }}
      >
        {this.state.value !== null ? (
          <div>
            <div className="text-right d-none d-sm-none d-sm-none d-md-none d-lg-block">
              <div className="row" style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                <div className="input col-7">
                  <input
                    className="form-control"
                    style={{ borderRadius: "25px" }}
                    type="text"
                    name="value"
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                  <i
                    className="fa fa-times"
                    style={{
                      position: "absolute",
                      top: "9px",
                      right: "24px",
                      fontSize: "15px",
                      color: "gray"
                    }}
                    onClick={this.handleClear}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-warning mr-1"
                    style={{ borderRadius: "25px" }}
                    onClick={() => {
                      this.props.handleSaveClicked(this.state.value);
                    }}
                  >
                    <i className="ft ft-edit-2" />
                  </button>
                  <button
                    className="btn btn-default mr-1"
                    style={{ borderRadius: "25px" }}
                    onClick={this.handleCancel}
                  >
                    <i className="fa fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right d-block d-sm-block d-md-block d-lg-none">
              <div className="row" style={{ paddingTop: "10px" }}>
                <div className="input" style={{ height: "47px", width: "110px" }}>
                  <input
                    className="form-control"
                    style={{ borderRadius: "25px" }}
                    type="text"
                    name="value"
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                </div>
                <div style={{ paddingLeft: "12px" }}>
                  <button
                    style={{ borderRadius: "25px" }}
                    className="btn btn-warning mr-2"
                    onClick={() => {
                      this.props.handleSaveClicked(this.state.value);
                    }}
                  >
                    <i className="ft ft-edit-2" />
                  </button>
                  <button
                    className="btn btn-default"
                    style={{ borderRadius: "25px" }}
                    onClick={this.handleCancel}
                  >
                    <i className="fa fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {activeStatus === true ? (
              <div className="mr-3">{value}</div>
            ) : (
              <div className="mr-3 danger" style={{ textDecorationLine: "line-through" }}>
                {value}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default TagListData;
