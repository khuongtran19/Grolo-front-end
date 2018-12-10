import React from "react";
import { getByBusinessId } from "../../services/rewardType.service";
class BusinessRewardTypeInfo extends React.Component {
  state = {
    res: ""
  };
  componentDidMount() {
    getByBusinessId(this.props.businessId).then(res => this.setState({ res: res.data.items }));
  }
  componentDidUpdate = prevProps => {
    if (prevProps.businessId !== this.props.businessId) {
      getByBusinessId(this.props.businessId).then(res => this.setState({ res: res.data.items }));
    }
  };
  render() {
    const { res } = this.state;
    if (!res) return null;
    return (
      <div>
        <h2>Rewards:</h2>
        <h3>
          {res.map(item => (
            <div key={item.id}>
              {item.name}: {item.description}
            </div>
          ))}
        </h3>
      </div>
    );
  }
}
export default BusinessRewardTypeInfo;
