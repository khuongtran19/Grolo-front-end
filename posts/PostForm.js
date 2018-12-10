import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { SearchAsset } from "../../services/asset.service.js";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  FormFeedback,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { GetPostById, PostInsert, DeletePost } from "../../services/post.service.js";
import { getAllSocialMedias } from "../../services/socialMedia.service.js";
import moment from "moment";
import DatePicker from "react-datepicker";
import { WithContext as ReactTags } from "react-tag-input";
import "./ReactTags.css";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { tagGetAll } from "../../services/tag.server.js";
import { getByCampaignId, getCampaignsByBusinessId } from "../../services/campaign.service";
import LoggedIn from "../Redux/LoggedIn";
import axios from "axios";
import ImageUploader from "../../shared/ImageUploader";
import { connect } from "react-redux";
const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class PostForm extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  state = {
    id: null,
    message: "",
    photoUrl: "",
    linkUrl: "",
    videoUrl: "",
    typeId: null,
    isPush: false,
    isSms: false,
    startDate: moment({}),
    endDate: moment({}),
    lat: 0,
    long: 0,
    geoRadius: 0,
    tags: [],
    suggestions: [],
    pageIndex: 0,
    pageSize: 500,
    smLists: [],
    success: false,
    error: false,
    isMulti: true,
    validate: {
      message_isValid: "",
      isPush_isValid: false,
      isSms_isValid: false,
      date_isValid: {}
    },

    campaignName: "",
    campaignId: null,
    postId: undefined,

    campaigns: [],
    create: undefined,
    disabled: false,
    returnToCampaigns: false,

    modal: false
  };

  validateMessage(e) {
    const message = e.target.value;
    const { validate } = this.state;
    if (message.length >= 2 && message.length <= 4000) {
      validate.message_isValid = "has-success";
    } else {
      validate.message_isValid = "has-danger";
    }
    this.setState({ validate });
  }

  validateDate(e) {
    const endDate = new Date(this.state.endDate);
    const startDate = new Date(this.state.startDate);
    const { validate } = this.state;
    if (startDate > endDate) {
      validate.date_isValid = "has-success";
    } else {
      validate.date_isValid = "has-danger";
    }
  }

  handleDateChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate;
    endDate = endDate || this.state.endDate;

    if (startDate.isAfter(endDate)) {
      endDate = startDate;
    }

    this.setState({ startDate, endDate });
  };

  handleChangeStart = startDate => this.handleDateChange({ startDate });

  handleChangeEnd = endDate => this.handleDateChange({ endDate });

  componentDidMount() {
    const { postId, campaignId } = this.props.match.params;

    if (campaignId) {
      this.setState({ returnToCampaigns: true });
      this.setState({ campaignId });
      getByCampaignId(campaignId).then(response => {
        this.setState({
          campaigns: response.data.item,
          campaignName: response.data.item.name,
          campaignId: response.data.item.id
        });
        getCampaignsByBusinessId(this.props.currentBusiness).then(response => {
          this.setState({ campaigns: response.data.items });
        });
      });
    }
    if (!postId && !campaignId) {
      this.setState({ create: true });
      getCampaignsByBusinessId(this.props.currentBusiness).then(response => {
        this.setState({ campaigns: response.data.items });
      });
    }

    if (campaignId && !postId) {
      this.setState({ disabled: true });
    } else {
      getCampaignsByBusinessId(this.props.currentBusiness).then(response => {
        this.setState({ campaigns: response.data.items });
      });
    }

    window.scrollTo(0, 0);
    getAllSocialMedias()
      .then(response => {
        this.setState({ smLists: response.data.item.pagedItems });
      })
      .catch(this.setState({ success: false, error: true }));
    tagGetAll(this.state.pageIndex, this.state.pageSize).then(response => {
      const allSuggestions = response.item.pagedItems.filter(
        response => response.activeStatus === true
      );
      const suggestions = allSuggestions.map(tag => ({
        id: tag.name,
        text: tag.name
      }));
      this.setState({ suggestions });
    });

    if (postId) {
      getAllSocialMedias().then(response =>
        GetPostById(postId).then(res => {
          let post = res.data.item[0];
          const tag = post.tag;
          if (tag !== null) {
            const lowercase = tag.toLowerCase();
            const tagItem = JSON.parse(lowercase);
            const tags = tagItem.map(tag => ({
              id: tag.name,
              text: tag.name
            }));
            this.setState({ tags });
          }
          this.setState({
            id: post.id,
            message: post.message,
            photoUrl: post.photoUrl,
            linkUrl: post.linkUrl,
            videoUrl: post.videoUrl,
            isPush: post.isPush,
            isSms: post.isSms,
            startDate: moment(),
            endDate: moment(),
            lat: post.lat,
            long: post.long,
            geoRadius: post.geoRadius
          });
          const social = JSON.parse(post.typeId);
          const selected = response.data.item.pagedItems.filter(item => {
            return social.some(item1 => {
              return item.id === item1;
            });
          });
          this.setState({ typeId: selected.map(item => ({ label: item.name, value: item.id })) });
          this.setState({ smLists: response.data.item.pagedItems });
          tagGetAll(this.state.pageIndex, this.state.pageSize).then(response => {
            const allSuggestions = response.item.pagedItems.filter(
              response => response.activeStatus === true
            );
            const suggestions = allSuggestions.map(tag => ({
              id: tag.name,
              text: tag.name
            }));
            this.setState({ suggestions });
          });
        })
      );
    }
  }

  componentDidUpdate = prevProps => {
    const { postId, campaignId } = this.props.match.params;

    if (prevProps.currentBusiness !== this.props.currentBusiness) {
      if (campaignId) {
        this.setState({ returnToCampaigns: true });
        this.setState({ campaignId });
        getByCampaignId(campaignId).then(response => {
          this.setState({
            campaigns: response.data.item,
            campaignName: response.data.item.name,
            campaignId: response.data.item.id
          });
          getCampaignsByBusinessId(this.props.currentBusiness).then(response => {
            this.setState({ campaigns: response.data.items });
          });
        });
      }
      if (!postId && !campaignId) {
        this.setState({ create: true });
        getCampaignsByBusinessId(this.props.currentBusiness).then(response => {
          this.setState({ campaigns: response.data.items });
        });
      }
    }
  };

  toggle() {
    this.setState(
      {
        modal: !this.state.modal
      },
      () => this.getAsset()
    );
  }

  getAsset = () => {
    const businessId = this.props.currentBusiness;

    SearchAsset("", businessId).then(response => {
      if (response.data.item && response.data.item.pageItems) {
        this.setState({
          assetSearched: response.data.item.pageItems
        });
      } else {
        this.setState({
          assetSearched: []
        });
      }
    });
  };

  handleStartDateChange = startDate => {
    this.setState({ startDate });
  };
  handleEndDateChange = endDate => {
    this.setState({ endDate });
  };

  handleMultiSelectChange = typeId => {
    this.setState({ typeId });
  };

  handleChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  handleSubmitPost = () => {
    let arr = [];
    this.state.typeId &&
      this.state.typeId.map(item => {
        arr.push(item.value);
        return arr;
      });
    const array = this.state.tags;
    const tagItem = array.map(data => data.text);
    PostInsert({
      campaignId: this.state.campaignId,
      message: this.state.message,
      photoUrl: this.state.photoUrl,
      linkUrl: this.state.linkUrl,
      videoUrl: this.state.videoUrl,
      typeId: JSON.stringify(arr),
      isPush: this.state.isPush,
      isSms: this.state.isSms,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      lat: this.state.lat,
      long: this.state.long,
      geoRadius: this.state.geoRadius,
      tags: tagItem,
      id: this.state.id,
      businessId: this.props.currentBusiness
    })
      .then(response => {
        const { campaignId } = this.props.match.params;
        if (campaignId !== undefined) {
          this.props.history.push("/admin/campaigns/" + campaignId);
        } else {
          this.props.history.push("/admin/posts");
        }
        NotificationManager.success("Success!", "You created new Post");
      })
      .catch(err => {
        window.scrollTo(0, 0);
        NotificationManager.error(
          "Error!",
          "There are error when you try to create Post. Please check your Post again"
        );
      });
  };

  campaignOptionsMap = () => {
    if (this.state.campaignId && !this.state.id && !this.state.create) {
      let campaignOptions = [{ value: this.state.campaigns.id, label: this.state.campaigns.name }];
      return campaignOptions;
    } else {
      let campaignOptions = this.state.campaigns.map(campaign => ({
        label: campaign.campaignName,
        value: campaign.id
      }));
      return campaignOptions;
    }
  };

  deletePost = id => {
    this.setState({ create: undefined });
    DeletePost(id).then(this.props.history.push("/admin/posts"));
  };

  handleDelete = i => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  };
  handleAddition = tag => {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  };
  handleCancel = () => {
    const { campaignId } = this.props.match.params;
    if (campaignId !== undefined) {
      this.props.history.push("/admin/campaigns/" + campaignId);
    } else {
      this.props.history.push("/admin/posts");
    }
  };

  handlePostNow = () => {
    let arr = [];
    this.state.typeId &&
      this.state.typeId.map(item => {
        arr.push(item.value);
        return arr;
      });
    const array = this.state.tags;
    const tagItem = array.map(data => data.text);
    PostInsert({
      campaignId: this.state.campaignId,
      message: this.state.message,
      photoUrl: this.state.photoUrl,
      linkUrl: this.state.linkUrl,
      videoUrl: this.state.videoUrl,
      typeId: JSON.stringify(arr),
      isPush: this.state.isPush,
      isSms: this.state.isSms,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      lat: this.state.lat,
      long: this.state.long,
      geoRadius: this.state.geoRadius,
      tags: tagItem,
      id: this.state.id,
      businessId: this.props.currentBusiness
    })
      .then(response => {
        const currentBusiness = this.props.currentBusiness;
        console.log(response);
        axios
          .post("/api/buffers" + "/" + response.data.id + "/" + currentBusiness, {
            message: this.state.message,
            photoUrl: this.state.photoUrl,
            linkUrl: this.state.linkUrl,
            videoUrl: this.state.videoUrl,
            businessId: this.state.businessId
          })
          .then(response => {
            console.log(response);
          });
        const { campaignId } = this.props.match.params;
        if (campaignId !== undefined) {
          this.props.history.push("/admin/campaigns/" + campaignId);
        } else {
          this.props.history.push("/admin/posts");
        }
        NotificationManager.success("Success!", "You created new Post");
      })
      .catch(err => {
        window.scrollTo(0, 0);
        NotificationManager.error(
          "Error!",
          "There are error when you try to create Post. Please check your Post again"
        );
      });
  };
  onCampaignChange = campaignId => {
    this.setState({ campaignId: campaignId.value });
  };

  handleRedirectToCampaigns = () => {
    this.props.history.push("/admin/campaigns/" + this.state.campaignId);
  };

  photoUrl = photoUrl => {
    this.setState({ photoUrl }, () => this.toggle());
  };
  asset = () => {
    this.props.history.push("/admin/assets");
  };
  render() {
    const { tags, suggestions, smLists, assetSearched } = this.state;
    const options = smLists.map(item => ({
      label: item.name,
      value: item.id
    }));

    const campaignOptions = this.campaignOptionsMap();
    const photo = (assetSearched || []).map(item => (
      <div key={item.id} onClick={() => this.photoUrl(item.url)}>
        <img
          src={item.url}
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
          className="card-img-top img-fluid"
          alt="Card"
        />
        <br />
      </div>
    ));
    return (
      <LoggedIn>
        <React.Fragment>
          <div className="row match-height">
            <div className="col-md-12">
              <div className="card py-1" style={{ borderRadius: ".50em" }}>
                <div className="card-header">
                  <div className="card-title-wrap bar-warning">
                    {this.state.id ? (
                      <h4 className="card-title">Edit Post</h4>
                    ) : (
                      <h4 className="card-title">Create Post</h4>
                    )}
                  </div>
                </div>
                <div className="px-3">
                  <form className="form postForm" id="postForm">
                    <div className="form-body">
                      <div className="form-group">
                        <label>Campaign Name</label>
                        <br />
                        <Select
                          isDisabled={this.state.disabled}
                          onChange={this.onCampaignChange}
                          placeholder={this.state.campaignName}
                          defaultValue={this.state.campaignId}
                          defaultInputValue={this.state.campaignName}
                          options={campaignOptions}
                        />
                      </div>
                      <div className="form-group">
                        <label>Photo Url </label>
                        <div>
                          <ImageUploader
                            ref={this.imageUploaderRef}
                            onComplete={url => this.setState({ url: url, hidePicture: null })}
                          />
                        </div>
                        <label>Or</label>
                        <div style={{ justifyContent: "space-between" }}>
                          <div className="text-right d-none d-sm-none d-sm-none d-md0none d-lg-block">
                            <InputGroup>
                              <Input
                                name="photoUrl"
                                placeholder="Enter Your Photo Url Here"
                                autoFocus
                                style={{ margin: "0px" }}
                                value={this.state.photoUrl} //Default value;
                                onChange={e => {
                                  //Default value;
                                  this.handleChange(e);
                                }}
                              />
                              {assetSearched !== "" ? (
                                <InputGroupAddon
                                  className="btn-sm"
                                  onClick={() => this.toggle()}
                                  addonType="append"
                                  style={{ padding: "0px" }}
                                >
                                  Asset Bussiness Photo
                                </InputGroupAddon>
                              ) : (
                                ""
                              )}
                            </InputGroup>
                          </div>
                          <div className="text-right d-block d-sm-block d-md-block d-lg-none">
                            <InputGroup>
                              <Input
                                name="photoUrl"
                                placeholder="Enter Your Photo Url Here"
                                autoFocus
                                value={this.state.photoUrl} //Default value;
                                onChange={e => {
                                  this.handleChange(e);
                                }}
                              />
                              <InputGroupAddon
                                className="btn-sm"
                                onClick={() => this.toggle()}
                                addonType="append"
                                style={{ padding: "0px" }}
                              >
                                +
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label> Link Url</label>
                        <Input
                          className="form-control"
                          name="linkUrl"
                          placeholder="Enter Your Link Url Here"
                          type="text"
                          value={this.state.linkUrl}
                          onChange={e => {
                            //Default value;
                            this.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label> Video Url</label>
                        <Input
                          className="form-control"
                          name="videoUrl"
                          placeholder="Enter Your Video Url Here"
                          type="text"
                          value={this.state.videoUrl}
                          onChange={e => {
                            //Default value;
                            this.handleChange(e);
                          }}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Start Date </label>
                            <DatePicker
                              name="startDate"
                              selected={moment(this.state.startDate)}
                              selectsStart
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onChange={this.handleChangeStart}
                              className="form-control "
                            />

                            <FormFeedback valid />
                            <FormFeedback>Start Date must be smaller than End Date!!!</FormFeedback>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label> End Date </label>
                            <DatePicker
                              name="endDate"
                              selected={moment(this.state.endDate)}
                              selectsEnd
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              onChange={this.handleChangeEnd}
                              className="form-control"
                            />
                            <FormFeedback valid />
                            <FormFeedback>End Date must be higher than End Date!!!</FormFeedback>
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label> Lat</label>
                            <Input
                              className="form-control"
                              name="lat"
                              placeholder="Enter Your Lat Here"
                              type="number"
                              value={this.state.lat}
                              onChange={e => {
                                //Default value;
                                this.validateLat(e);
                                this.handleChange(e);
                              }}
                              valid={this.state.validate.lat_isValid === "has-success"}
                              invalid={this.state.validate.lat_isValid === "has-danger"}
                            />
                            <FormFeedback valid />
                            <FormFeedback>
                              Lat need to higher than -90 and less than +90 degree!!!
                            </FormFeedback>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label> Long</label>
                            <Input
                              className="form-control"
                              name="long"
                              placeholder="Enter Your Long Here"
                              type="number"
                              value={this.state.long}
                              onChange={e => {
                                //Default value;
                                this.validateLong(e);
                                this.handleChange(e);
                              }}
                              valid={this.state.validate.long_isValid === "has-success"}
                              invalid={this.state.validate.long_isValid === "has-danger"}
                            />
                            <FormFeedback valid />
                            <FormFeedback>
                              Long need to higher than -180 and less than +180 degree!!!
                            </FormFeedback>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    {/* <div className="form-group">
                      <label> Geography Radius</label>
                      <Input
                        className="form-control"
                        name="geoRadius"
                        placeholder="Enter Your Geography Radius Here"
                        type="number"
                        value={this.state.geoRadius || " "}
                        onChange={e => {
                          //Default value;
                          this.validateGeoRadius(e);
                          this.handleChange(e);
                        }}
                        valid={this.state.validate.geoRadius_isValid === "has-success"}
                        invalid={this.state.validate.geoRadius_isValid === "has-danger"}
                      />
                      <FormFeedback valid />
                      <FormFeedback>
                        Geography Radius need to higher than or equal to 0!!!
                      </FormFeedback>
                    </div> */}
                    <div className="form-group">
                      <label>Message</label>
                      <Input
                        rows="5"
                        className="form-control"
                        name="message"
                        placeholder="Enter Your Message Here"
                        type="textarea"
                        value={this.state.message}
                        onChange={e => {
                          //Default value;
                          this.validateMessage(e);
                          this.handleChange(e);
                        }}
                        valid={this.state.validate.message_isValid === "has-success"}
                        invalid={this.state.validate.message_isValid === "has-danger"}
                      />
                      <FormFeedback valid />
                      <FormFeedback>Message field need to higher than or equal 2!!!</FormFeedback>
                    </div>
                    <div className="form-group">
                      <label>Social Media Platform(s)</label>
                      <Select
                        placeholder="Choose Social Media"
                        name="typeId"
                        value={this.state.typeId}
                        onChange={this.handleMultiSelectChange}
                        options={options}
                        isMulti
                      />
                    </div>
                    <div className="form-group">
                      <label>Tags: </label>
                      <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        delimiters={delimiters}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                      />
                    </div>
                    <div className="row input-group">
                      <div className="form-group col-lg-6">
                        <div className="custom-control custom-checkbox ">
                          <input
                            className="form-control-input"
                            name="isPush"
                            type="checkbox"
                            checked={this.state.isPush}
                            onChange={
                              this.handleChange //Default value;
                            }
                          />{" "}
                          <label>Is Push</label>
                        </div>
                      </div>
                      <div className="form-group col-lg-6">
                        <div className="custom-control custom-checkbox ">
                          <input
                            className="form-control-input"
                            name="isSms"
                            type="checkbox"
                            checked={this.state.isSms}
                            onChange={
                              this.handleChange //Default value;
                            }
                          />{" "}
                          <label>Is SMS</label>
                        </div>
                      </div>
                    </div>
                    {this.state.id ? (
                      ""
                    ) : (
                      <div>
                        <label>
                          Notes: Click "Post Now" will post to you social media immediately. If you
                          want to update Post and schedule for future please click "Submit" button.
                        </label>
                      </div>
                    )}
                    <div className="row " style={{ display: "flex", alignContent: "stretch" }}>
                      <div style={{ flexGrow: "1" }}>
                        {this.state.id !== null ? (
                          <button
                            className="btn btn-danger "
                            onClick={() => this.deletePost(this.state.id)}
                          >
                            <i className="fa fa-trash-o mr-1" />
                            Delete
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                      <div style={{ flexGrow: "1", display: "flex", justifyContent: "flex-end" }}>
                        {this.state.id ? (
                          ""
                        ) : (
                          <button
                            className="btn btn-primary mr-2"
                            type="button"
                            onClick={this.handlePostNow}
                          >
                            <i className="fa fa-thumbs-o-up mr-1" />
                            Post Now
                          </button>
                        )}
                        {this.state.id ? (
                          <button
                            className="btn btn-success mr-2"
                            type="button"
                            onClick={this.handleSubmitPost}
                          >
                            <i className="fa fa-thumbs-o-up mr-1" />
                            Update
                          </button>
                        ) : (
                          <button
                            className="btn btn-success mr-2"
                            type="button"
                            onClick={this.handleSubmitPost}
                          >
                            <i className="fa fa-thumbs-o-up mr-1" />
                            Submit
                          </button>
                        )}
                        <button className="btn btn-danger" type="reset" onClick={this.handleCancel}>
                          <i className="fa fa-times-circle mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <Modal
              isOpen={this.state.modal}
              toggle={() => this.toggle()}
              className={this.props.className}
            >
              <ModalHeader toggle={() => this.toggle()}>Asset Bussiness Photo</ModalHeader>
              <ModalBody>{photo}</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => this.asset()}>
                  Add Photo
                </Button>
                <Button color="secondary" onClick={() => this.toggle()}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </React.Fragment>
      </LoggedIn>
    );
  }
}

PostForm.propTypes = {
  id: PropTypes.number,
  message: PropTypes.string,
  photoUrl: PropTypes.string,
  linkUrl: PropTypes.string,
  videoUrl: PropTypes.string,
  isPush: PropTypes.func,
  isSms: PropTypes.func,
  lat: PropTypes.number,
  long: PropTypes.number,
  geoRadius: PropTypes.number
};
function mapStateToProps(state) {
  return {
    user: state.user,
    currentBusiness: state.currentBusiness
  };
}
export default connect(mapStateToProps)(PostForm);
