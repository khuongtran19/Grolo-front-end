import React from "react";
import { getById } from "../../services/business.service";
import BusinessGoogleMap from "../businessAdmin/BusinessGoogleMap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
class BusinessInfo extends React.Component {
  state = {
    modal: false
  };
  componentDidMount() {
    getById(this.props.id).then(res => this.setState({ res: res.data }));
  }
  googleMap = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  render() {
    const { res } = this.state;
    if (!res) return null;
    const item = res;
    return (
      <div className="card mb-4">
        <div className="card-header">
          {item.bannerUrl !== null && item.bannerUrl ? (
            <div
              className="card-img-top img-fluid bg-cover height-200"
              style={{ background: `url(${item.bannerUrl})` }}
            />
          ) : (
            ""
          )}
          <div className="card-body">
            <div className="card-block">
              <div className="align-self-center halfway-fab text-center">
                {item.logoUrl !== null && item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt="logoUrl"
                    className="rounded-circle img-border gradient-summer width-100"
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="text-center">
                {item.name !== null && item.name ? (
                  <span className="font-medium-2 text-uppercase">{item.name}</span>
                ) : (
                  ""
                )}
              </div>
              <br />
              <div className="row">
                <div className="col-12 col-sm-6">
                  <ul className="no-list-style pl-0 text-center">
                    <li className="mb-2">
                      {item.fbPage !== null && item.fbPage ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.fbPage}>
                            <i className="ft-facebook font-small-3" /> Facebook
                          </a>
                        </span>
                      ) : (
                        " "
                      )}
                      {item.twitterUrl !== null && item.twitterUrl ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.twitterUrl}>
                            <i className="ft-twitter font-small-3" /> Twitter
                          </a>
                        </span>
                      ) : (
                        " "
                      )}
                      {item.pinterestUrl !== null && item.pinterestUrl ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.pinterestUrl}>Pinterest</a>
                        </span>
                      ) : (
                        " "
                      )}
                      {item.igUrl !== null && item.igUrl ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.igUrl}>
                            <i className="ft-instagram" /> Instagram
                          </a>
                        </span>
                      ) : (
                        " "
                      )}
                    </li>
                    <li>
                      {item.url !== null && item.url ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.url}>
                            <i className="ft-globe font-small-3" /> {item.url}
                          </a>
                        </span>
                      ) : (
                        ""
                      )}
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-sm-6">
                  {" "}
                  <ul className="no-list-style pl-0 text-center">
                    <li className="mb-2">
                      {item.street !== null && item.street ? (
                        <span className="display-block overflow-hidden" onClick={this.googleMap}>
                          <i className="ft-map-pin font-small-3" /> {item.street}, {item.city},
                          {item.state}, {item.zip}, {item.suite}
                        </span>
                      ) : (
                        ""
                      )}
                    </li>
                    <li className="mb-2">
                      {item.phoneNumber !== null && item.phoneNumber ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.phoneNumber}>
                            <i className="ft-phone-outgoing font-small-3" /> {item.phoneNumber}
                          </a>
                        </span>
                      ) : (
                        ""
                      )}
                    </li>
                    <li>
                      {item.email !== null && item.email ? (
                        <span className="display-block overflow-hidden">
                          <a href={item.email}>
                            <i className="ft-at-sign font-small-3" /> {item.email}
                          </a>
                        </span>
                      ) : (
                        ""
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={() => this.googleMap()}
          className={this.props.className}
        >
          <ModalHeader toggle={() => this.googleMap()} />
          <ModalBody>
            <BusinessGoogleMap id={item.id} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.googleMap()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default BusinessInfo;
