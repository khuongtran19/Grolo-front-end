import React from "react";
import BusinessInfo from "../businessInfo/businessInfoV2";
import BusinessRewardTypeInfo from "./BusinessRewardTypeInfo";
import BusinessQRCode from "./BusinessQRCode";
class BusinessRewardInfo extends React.Component {
  state = {
    value: ""
  };
  componentDidMount() {
    const tenantId = this.props.tenantId;
    const businessId = this.props.businessId;
    this.setState({
      value: `https://grolo.azurewebsites.net/admin/appuser/register?tenantId=${tenantId}&businessId=${businessId}`
    });
  }
  componentDidUpdate = prevProps => {
    if (prevProps.businessId !== this.props.businessId) {
      const tenantId = this.props.tenantId;
      const businessId = this.props.businessId;
      this.setState({
        value: `https://grolo.azurewebsites.net/admin/appuser/register?tenantId=${tenantId}&businessId=${businessId}`
      });
    }
  };
  render() {
    return (
      <div>
        <div style={{ height: "1300px", textAlign: "center" }}>
          <BusinessInfo businessId={this.props.businessId} />
          <BusinessRewardTypeInfo businessId={this.props.businessId} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2>Scan this QR Code below to become a regular customer and receive rewards</h2>
          <br />
        </div>
        <div>
          <BusinessQRCode value={this.state.value} />
        </div>
      </div>
    );
  }
}

export default BusinessRewardInfo;
