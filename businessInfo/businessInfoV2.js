import React from "react";
import { getById } from "../../services/business.service";
class BusinessInfo extends React.Component {
  state = {
    res: ""
  };
  componentDidMount() {
    getById(this.props.businessId).then(res => this.setState({ res: res.data }));
  }
  componentDidUpdate = prevProps => {
    if (prevProps.businessId !== this.props.businessId) {
      getById(this.props.businessId).then(res => this.setState({ res: res.data }));
      window.scrollTo(0, 0);
    }
  };
  render() {
    const { res } = this.state;
    if (!res) return null;
    const item = res;
    return (
      <div>
        <div>
          <h2>
            {item.bannerUrl !== null && item.bannerUrl ? (
              <div className="card-img-top img-fluid bg-cover">
                <img
                  src={item.bannerUrl}
                  alt="businessbanner"
                  style={{ height: "auto", width: "595px" }}
                />
              </div>
            ) : (
              ""
            )}
          </h2>
        </div>
        <div className="card-body">
          <h3>
            <div className="card-block">
              <div className="align-self-center halfway-fab text-center">
                {item.logoUrl !== null && item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt="businesslogo"
                    className="rounded-circle img-border gradient-summer width-100"
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="text-center">
                <h2>
                  {item.name !== null && item.name ? (
                    <span className="text-uppercase">{item.name}</span>
                  ) : (
                    ""
                  )}
                </h2>
              </div>
              <br />
              <div className="row">
                <div className="col-12 col-sm-6">
                  <ul className="no-list-style pl-0 text-center">
                    <li className="mb-2">
                      {item.fbPage !== null && item.fbPage ? (
                        <span className="display-block overflow-hidden">
                          <i className="ft-facebook font-small-3" /> {item.fbPage}
                        </span>
                      ) : (
                        " "
                      )}
                      {item.twitterUrl !== null && item.twitterUrl ? (
                        <span className="display-block overflow-hidden">
                          <i className="ft-twitter font-small-3" /> {item.twitterUrl}
                        </span>
                      ) : (
                        " "
                      )}
                      {item.pinterestUrl !== null && item.pinterestUrl ? (
                        <span className="display-block overflow-hidden">{item.pinterestUrl}</span>
                      ) : (
                        " "
                      )}
                      {item.igUrl !== null && item.igUrl ? (
                        <span className="display-block overflow-hidden">
                          <i className="ft-instagram" /> {item.igUrl}
                        </span>
                      ) : (
                        " "
                      )}
                    </li>
                    <li>
                      {item.url !== null && item.url ? (
                        <span className="display-block overflow-hidden">
                          <i className="ft-globe font-small-3" /> {item.url}
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
                        <span className="display-block overflow-hidden">
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
                          <i className="ft-phone-outgoing font-small-3" /> {item.phoneNumber}
                        </span>
                      ) : (
                        ""
                      )}
                    </li>
                    <li>
                      {item.email !== null && item.email ? (
                        <span className="display-block overflow-hidden">
                          <i className="ft-at-sign font-small-3" /> {item.email}
                        </span>
                      ) : (
                        ""
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </h3>
        </div>
      </div>
    );
  }
}
export default BusinessInfo;
