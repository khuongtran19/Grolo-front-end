import React from "react";
import { search, tagGetAllPost, tagGetAll } from "../../services/tag.server";
import PropTypes from "prop-types";
import Select from "react-select";
class TagSearchEngine extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };
  state = {
    search: "",
    postLists: [],
    pageIndex: 0,
    pageSize: 20,
    selectedOption: null
  };
  componentDidMount() {
    tagGetAll(0, 1000).then(res => this.setState({ postLists: res.item.pagedItems }));
  }
  executeQuery = (delay = 100) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      if (this.state.search === "") {
        search(this.state.search, 0, this.state.pageSize).then(response => {
          this.setState({ response: response.data });
        });
      } else {
        const promise = search(this.state.search, 0, this.state.pageSize);
        promise.then(response => {
          const result = response.data;
          if (!result.item) {
            this.setState({ postLists: [] });
          } else {
            this.setState(prevState => ({
              postLists: result.item.pagedItems
            }));
          }
        });
      }
      this.timeout = null;
    }, delay);
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    tagGetAllPost(selectedOption.value).then(res => {
      if (res[0]) {
        const link = JSON.parse(res[0].post);
        this.setState({ link });
      }
    });
  };
  handleInputChange = value => {
    this.setState({ search: value }, () => {
      this.executeQuery();
    });
  };
  showTag = () => {
    const link = this.state.link;
    const tagPost = (link || []).map(item => {
      const link = <a href={item.linkUrl}>Link</a>;
      const video = <a href={item.videoUrl}>Video</a>;
      return (
        <div className="card" key={item.Id}>
          <div className="card-body">
            <img
              style={{ width: "100%", height: "100%" }}
              className="card-img-top img-fluid"
              src={item.PhotoUrl}
              alt="Card"
            />

            <div className="card-block">
              <h1 className="card-title">{item.Message}</h1>
              {item.linkUrl !== null ? <p>{link}</p> : ""}
              {item.videoUrl !== null ? <p>{video}</p> : ""}
              <div style={{ fontSize: "25px", margin: " 5px" }} className="action float-right">
                <i className="ft-edit mr-2 warning" onClick={() => this.handleEdit(item.Id)} />

                <i className="ft-trash danger" onClick={() => this.deletePost(item.Id)} />
              </div>
            </div>
          </div>
        </div>
      );
    });
    return tagPost;
  };
  handleBackPost = () => {
    this.props.history.push("/admin/posts");
  };
  render() {
    const { postLists, selectedOption } = this.state;
    let tagPost = this.showTag();
    const map = postLists.map(item => ({
      label: item.name,
      value: item.id
    }));
    return (
      <div>
        <div className="container-fluid">
          <div className="col-md-6 col-lg-12">
            <div style={{ flexGrow: "1", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary mt-2"
                onClick={() => this.handleBackPost()}
                type="button"
              >
                Back to Post
              </button>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-title-wrap bar-success">
                  <h2 className="card-title">Search by Tag:</h2>
                </div>
                <br />
                <Select
                  placeholder="Search tag ..."
                  onInputChange={this.handleInputChange}
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={map}
                  autoFocus
                />
                <br />
                <div className="row" />
              </div>
            </div>
          </div>
        </div>
        <div className="card-center">{tagPost}</div>
      </div>
    );
  }
}
export default TagSearchEngine;
