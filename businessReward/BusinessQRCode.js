import React from "react";
import QrGenerator from "../../shared/QrGenerator";

class BusinessQRCode extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <QrGenerator value={this.props.value} />
      </div>
    );
  }
}
export default BusinessQRCode;
