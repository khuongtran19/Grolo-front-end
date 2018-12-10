import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardSubtitle,
  Card,
  CardTitle,
  CardBody
} from "reactstrap";
import PostTag from "./PostTag";
import { DeletePost } from "../../services/post.service.js";
import { tagGetAllPost, tagGetAll } from "../../services/tag.server";
import InfiniteScroll from "../../shared/InfiniteScroll";
import { connect } from "react-redux";
import Masonry from "react-masonry-component";
import PostList from "./PostList";
import "./Masonry.css";
class PostSearch extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };
  state = {
    searchString: "",
    posts: [],
    pageIndex: 0,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
    modal: false,
    link: [],
    showModal: false,
    pendingId: null
  };
  latestCallCount = 0;
  componentDidMount() {
    this.setState(
      { pageIndex: this.state.pageIndex, searchString: this.state.searchString },
      this.initialData
    );
    window.scrollTo(0, 0);
  }
  componentDidUpdate = prevProps => {
    if (prevProps.currentBusinessId !== this.props.currentBusinessId) {
      this.setState(
        { pageIndex: this.state.pageIndex, searchString: this.state.searchString },
        this.initialData
      );
      window.scrollTo(0, 0);
    }
  };
  toggleDelete = pendingId => {
    this.setState({
      pendingId,
      showModal: !this.state.showModal
    });
  };

  modalDeleteClick = id => {
    this.toggleDelete(id);
  };

  submitForm = e => {
    e.preventDefault();
    this.fetchData();
  };
  initialData = () => {
    tagGetAll(0, 20).then(response => {
      this.setState({ response });
    });
    if (!this.props.user) {
      this.setState({ posts: [], totalCount: 0, totalPages: 0 });
    } else {
      if (this.state.searchString === "") {
        const url = `/node-api/server.js/api/post/search?searchString=${encodeURIComponent(
          this.state.searchString
        )}&pageIndex=0&pageSize=${this.state.pageSize}&businessId=${this.props.currentBusinessId}`;

        const currentCallCount = ++this.latestCallCount;
        axios.get(url).then(res => {
          if (currentCallCount === this.latestCallCount) {
            const result = res.data.item;
            if (!res.data.item) {
              this.setState(prevState => ({
                posts: [],
                totalCount: 0,
                totalPages: 0
              }));
            } else {
              this.setState(prevState => ({
                posts: result.pagedItems,
                totalCount: result.totalCount,
                totalPages: result.totalPages
              }));
            }
          }
        });
      } else {
        const url = encodeURI(
          `/node-api/server.js/api/post/search?searchString=${encodeURIComponent(
            this.state.searchString
          )}&pageIndex=0&pageSize=${this.state.pageSize}&businessId=${this.props.currentBusinessId}`
        );
        const currentCallCount = ++this.latestCallCount;
        axios
          .get(url)
          .then(res => {
            if (currentCallCount === this.latestCallCount) {
              const result = res.data.item;
              if (!res.data.item) {
                this.setState(prevState => ({
                  posts: [],
                  totalCount: 0,
                  totalPages: 0
                }));
              } else {
                this.setState(prevState => ({
                  posts: result.pagedItems,
                  totalCount: result.totalCount,
                  totalPages: result.totalPages
                }));
              }
            }
          })
          .catch(res => this.setState({ success: false, error: true }));
      }
    }
  };
  fetchData = () => {
    tagGetAll(0, 20).then(response => {
      this.setState({ response });
    });
    if (!this.props.user) {
      this.setState({ posts: [], totalCount: 0, totalPages: 0 });
    } else {
      if (this.state.searchString === "") {
        const url = `/node-api/server.js/api/post/search?searchString=${encodeURIComponent(
          this.state.searchString
        )}&pageIndex=${this.state.pageIndex}&pageSize=${this.state.pageSize}&businessId=${
          this.props.currentBusinessId
        }`;

        const currentCallCount = ++this.latestCallCount;
        axios.get(url).then(res => {
          if (currentCallCount === this.latestCallCount) {
            const result = res.data.item;
            if (!res.data.item) {
              this.setState(prevState => ({
                posts: [],
                totalCount: 0,
                totalPages: 0
              }));
            } else {
              this.setState(prevState => ({
                posts: prevState.posts.concat(result.pagedItems),
                totalCount: result.totalCount,
                totalPages: result.totalPages
              }));
            }
          }
        });
      } else {
        const url = encodeURI(
          `/node-api/server.js/api/post/search?searchString=${encodeURIComponent(
            this.state.searchString
          )}&pageIndex=${this.state.pageIndex}&pageSize=${this.state.pageSize}&businessId=${
            this.props.currentBusinessId
          }`
        );
        const currentCallCount = ++this.latestCallCount;
        axios
          .get(url)
          .then(res => {
            if (currentCallCount === this.latestCallCount) {
              const result = res.data.item;
              if (!res.data.item) {
                this.setState(prevState => ({
                  posts: [],
                  totalCount: 0,
                  totalPages: 0
                }));
              } else {
                this.setState(prevState => ({
                  posts: result.pagedItems.concat(prevState.posts),
                  totalCount: result.totalCount,
                  totalPages: result.totalPages
                }));
              }
            }
          })
          .catch(res => this.setState({ success: false, error: true }));
      }
    }
  };
  onChangePageSize = e => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [e.target.name]: parseInt(value) }, () => this.fetchData());
  };

  onSearchChange = e => {
    this.setState({ searchString: e.target.value, pageIndex: 0 }, () => {
      this.fetchData();
    });
  };

  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.fetchData();
      }
    );
  };

  deletePost = () => {
    const postId = this.state.pendingId;
    DeletePost(postId).then(
      res => {
        this.setState({ showModal: false });
      },
      this.setState({ pageIndex: 0, searchString: this.state.searchString }, this.initialData),
      window.scrollTo(0, 0)
    );
  };
  getPost = id => {
    tagGetAllPost(id).then(res => {
      const link = JSON.parse(res[0].post);
      this.setState({ link });
    });
  };
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  handleEdit = (id, campaign) => {
    if (campaign == null) {
      this.props.history.push("/admin/posts/" + id + "/campaigns");
    } else {
      this.props.history.push("/admin/posts/" + id + "/campaigns/" + campaign);
    }
  };
  handleCreate = () => {
    this.props.history.push("/admin/posts/create");
  };
  handleClear = () => {
    this.setState({ searchString: "" }, () => {
      this.fetchData();
    });
  };
  handleScheduleClicked = postId => {
    this.props.history.push("/admin/buffer/" + postId);
  };

  handleTagSearch = () => {
    this.props.history.push("/admin/tag/search");
  };
  loadMore = () => {
    this.setState(
      { pageIndex: this.state.pageIndex + 1, searchString: this.state.searchString },
      this.fetchData
    );
  };
  renderPost = () => {
    let item = [].concat(this.state.posts).map(post => {
      console.log(post);
      const tag = JSON.parse(post.tag);
      const tagName = (tag || []).map(tag => (
        <span
          key={tag.Id}
          onClick={() => {
            this.getPost(tag.Id);
            this.toggle();
          }}
          className="btn btn-outline-info mr-0.5"
          style={{
            borderRadius: "25px",
            height: "25px",
            lineHeight: "10px",
            margin: "0.5px"
          }}
        >
          {tag.Name}{" "}
        </span>
      ));
      const link = <a href={post.linkUrl}>Link</a>;
      const video = <a href={post.videoUrl}>Video</a>;
      return (
        <div className="card col-md-4" key={post.id} style={{ padding: "1px" }}>
          {post.photoUrl !== "" ? (
            <img
              style={{ width: "100%", height: "100%" }}
              className="card-img-top img-fluid"
              src={post.photoUrl}
              alt="Card"
            />
          ) : (
            ""
          )}
          <div className="card-body">
            <div className="card-block">
              <div className="card-title">{post.message}</div>
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {post.linkUrl !== "" ? <p>{link}</p> : ""}
                {post.videoUrl !== "" ? <p>{video}</p> : ""}
              </div>
              {tagName.length > 0 ? <span>Tag: </span> : ""}
              <p> {tagName}</p>
              <div style={{ fontSize: "25px", margin: " 5px" }} className="action float-right">
                <i
                  className="ft-calendar mr-2 success"
                  onClick={() => this.handleScheduleClicked(post.id)}
                />
                <i className="ft-edit mr-2 warning" onClick={() => this.handleEdit(post.id)} />
                <i className="ft-trash danger" onClick={() => this.modalDeleteClick(post.id)} />
              </div>
            </div>
          </div>
        </div>
      );
    });
    return item;
  };
  showTag = () => {
    const link = this.state.link;
    console.log(link);
    const tagPost = (link || []).map(item => {
      const link = <a href={item.linkUrl}>Link</a>;
      const video = <a href={item.videoUrl}>Video</a>;
      console.log(item);
      return (
        <div className="card" key={item.Id}>
          <div className="card-body">
            {item.PhotoUrl !== "" ? (
              <img
                style={{ width: "100%", height: "100%" }}
                className="card-img-top img-fluid"
                src={item.PhotoUrl}
                alt="Card"
              />
            ) : (
              ""
            )}
            <div className="card-block">
              <div className="card-title">{item.Message}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {item.linkUrl !== "" ? <p>{link}</p> : ""}
                {item.videoUrl !== "" ? <p>{video}</p> : ""}
              </div>
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
  render() {
    const { response, posts, pedingId, link } = this.state;
    if (!response) return null;
    const tag = response.item.pagedItems.map(item =>
      item.activeStatus === true ? (
        <span
          key={item.id}
          onClick={() => {
            this.getPost(item.id);
            this.toggle();
          }}
          className="btn btn-outline-info mr-1"
          style={{
            borderRadius: "25px",
            height: "25px",
            lineHeight: "10px"
          }}
        >
          {item.name}{" "}
        </span>
      ) : (
        ""
      )
    );
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="col-md-6 col-lg-12">
            <div className="card" style={{ paddingTop: "1px" }}>
              <div className="card-header">
                <div className="profile-cover-buttons" style={{ height: "5px" }}>
                  <div className="row">
                    <div className="media-body halfway-fab align-self-end">
                      <div className="text-right d-none d-sm-none d-sm-none d-md-none d-lg-block">
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => this.handleCreate()}
                          type="button"
                          style={{ marginBottom: "28px" }}
                        >
                          Create Post
                        </button>
                      </div>
                      <div
                        className="text-right d-block d-sm-block d-md-block d-lg-none"
                        style={{ marginLeft: "123px" }}
                      >
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => this.handleCreate()}
                          type="button"
                        >
                          <i className="fa fa-plus" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", height: "20px" }}>
                  <h2 className="card-title">
                    {" "}
                    <div className="card-title-wrap bar-success" style={{ flexGrow: "1" }}>
                      Post{" "}
                    </div>
                  </h2>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <input
                    placeholder="Search Post "
                    type="text"
                    autoFocus
                    className="form-control"
                    onChange={this.onSearchChange}
                    value={this.state.searchString}
                    name="search"
                    onSubmit={this.submitForm}
                  />
                  <i
                    className="fa fa-times"
                    style={{
                      position: "absolute",
                      bottom: "37px",
                      right: "20px",
                      fontSize: "15px",
                      color: "gray"
                    }}
                    onClick={this.handleClear}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="listContainer">
          {this.state.posts && this.state.posts.length > 0 ? (
            <React.Fragment>
              <div className="d-block d-sm-block d-md-none d-lg-none">
                <Masonry className="center3" data-masonry='{ "fitWidth": true }'>
                  <PostList
                    posts={posts}
                    handleEdit={(id, campaign) => this.handleEdit(id, campaign)}
                    modalDeleteClick={id => this.modalDeleteClick(id)}
                    getPost={id => this.getPost(id)}
                    toggle={() => this.toggle()}
                    handleScheduleClicked={id => this.handleScheduleClicked(id)}
                  />
                  <div className="mr-2" style={{ width: "266px" }}>
                    <Card>
                      <CardTitle>Tag</CardTitle>
                      <CardSubtitle>
                        <p onClick={() => this.handleTagSearch()}>Search more tags ....</p>
                      </CardSubtitle>
                      <CardBody>{tag}</CardBody>
                    </Card>
                  </div>
                </Masonry>
              </div>
              <div className="d-none d-sm-none d-md-block d-lg-none">
                <Masonry className="center2" data-masonry='{ "fitWidth": true }'>
                  <PostList
                    posts={posts}
                    handleEdit={(id, campaign) => this.handleEdit(id, campaign)}
                    modalDeleteClick={id => this.modalDeleteClick(id)}
                    getPost={id => this.getPost(id)}
                    toggle={() => this.toggle()}
                    handleScheduleClicked={id => this.handleScheduleClicked(id)}
                  />
                  <div className="mr-2" style={{ width: "266px" }}>
                    <Card>
                      <CardTitle>Tag</CardTitle>
                      <CardSubtitle>
                        <p onClick={() => this.handleTagSearch()}>Search more tags ....</p>
                      </CardSubtitle>
                      <CardBody>{tag}</CardBody>
                    </Card>
                  </div>
                </Masonry>
              </div>
              <div className="d-none d-sm-none d-md-none d-lg-block">
                <Masonry className="center1" data-masonry='{ "fitWidth": true }'>
                  <PostList
                    posts={posts}
                    handleEdit={(id, campaign) => this.handleEdit(id, campaign)}
                    modalDeleteClick={id => this.modalDeleteClick(id)}
                    getPost={id => this.getPost(id)}
                    toggle={() => this.toggle()}
                    handleScheduleClicked={id => this.handleScheduleClicked(id)}
                  />
                  <div className="mr-2" style={{ width: "266px" }}>
                    <Card>
                      <CardTitle>Tag</CardTitle>
                      <CardSubtitle>
                        <p onClick={() => this.handleTagSearch()}>Search more tags ....</p>
                      </CardSubtitle>
                      <CardBody>{tag}</CardBody>
                    </Card>
                  </div>
                </Masonry>
              </div>
              <div>
                <InfiniteScroll onVisible={() => this.loadMore()}> </InfiniteScroll>
              </div>
            </React.Fragment>
          ) : (
            <div className="ml-5">
              <h4>Please Enter Search Criteria</h4>
            </div>
          )}
          <Modal
            isOpen={this.state.showModal}
            toggle={this.toggleDelete}
            className={this.props.className}
          >
            <ModalHeader align="center" toggle={this.toggleDelete}>
              Delete
            </ModalHeader>
            <ModalBody>
              <CardSubtitle align="center">Are You Sure You Want to Delete Your Post?</CardSubtitle>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => this.deletePost(pedingId)}>
                Delete <i className="fa fa-trash-o" />
              </Button>
              <Button color="secondary" onClick={this.toggleDelete}>
                Cancel <i className="fa fa-times-circle" />
              </Button>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={this.state.modal}
            toggle={() => this.toggle()}
            className={this.props.className}
          >
            <ModalHeader toggle={() => this.toggle()}>
              Post <p onClick={() => this.handleTagSearch()}>Search more tags ....</p>
            </ModalHeader>
            <ModalBody>
              <PostTag
                link={link}
                handleEdit={id => this.handleEdit(id)}
                deletePost={id => this.deletePost(id)}
                handleScheduleClicked={id => this.handleScheduleClicked(id)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => this.toggle()}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    currentBusinessId: state.currentBusiness
  };
}
export default connect(mapStateToProps)(PostSearch);
