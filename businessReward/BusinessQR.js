import React from "react";
import ReactToPrint from "react-to-print";
import BusinessRewardInfo from "./BusinessRewardInfo";
import { connect } from "react-redux";
import { Card, CardTitle, CardBody } from "reactstrap";
class BusinessQR extends React.Component {
  render() {
    const tenantId = this.props.user.tenantId;
    const businessId = this.props.currentBusiness;
    return (
      <Card>
        <CardTitle>
          <div className="card-title-wrap bar-success" style={{ flexGrow: "1" }}>
            <h2 className="success">Business Reward</h2>
          </div>
        </CardTitle>
        <CardBody>
          <div className="text-right">
            <ReactToPrint trigger={() => <a href="#">Print</a>} content={() => this.componentRef} />
          </div>
          <div style={{ position: "flex" }}>
            <div
              style={{
                width: "595px",
                height: "1600px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <BusinessRewardInfo
                ref={el => (this.componentRef = el)}
                tenantId={tenantId}
                businessId={businessId}
              />
            </div>
          </div>
          <div className="text-right">
            <ReactToPrint trigger={() => <a href="#">Print</a>} content={() => this.componentRef} />
          </div>
        </CardBody>
      </Card>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
    currentBusiness: state.currentBusiness
  };
}
export default connect(mapStateToProps)(BusinessQR);
