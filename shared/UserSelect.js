import React from "react";
import { search } from "../services/userSelect.server";
import Select from "react-select";
class UserSelect extends React.Component {
  state = {
    search: "",
    userLists: [],
    pageIndex: 0,
    pageSize: 1000,
    selectedOption: null
  };
  latestCallCount = 0;
  componentDidMount() {
    search(
      "",
      this.state.pageIndex,
      this.state.pageSize,
      this.props.roles,
      this.props.businessId
    ).then(response => {
      if (response.data.item) {
        const result = response.data.item;
        if (this.props.value === null) {
          this.setState({ userLists: result.pagedItems });
        } else {
          const match = result.pagedItems.filter(item => {
            return item.id === this.props.value;
          });

          if (match.length) {
            const selected = match[0];

            this.setState(prevState => ({
              userLists: result.pagedItems,
              selectedOption: {
                label:
                  selected.lastName + ", " + selected.firstName + " ( " + selected.email + " )",
                value: selected.id
              }
            }));
          }
        }
      } else {
        this.setState(item => ({
          userLists: []
        }));
      }
    });
  }
  executeQuery = (delay = 10) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      const promise = search(
        this.state.search,
        this.state.pageIndex,
        this.state.pageSize,
        this.props.roles, //role must be in array. state = {roles:[]}
        this.props.businessId
      );

      const currentCallCount = ++this.latestCallCount;

      promise.then(response => {
        if (currentCallCount === this.latestCallCount) {
          if (response.data.item) {
            const result = response.data.item;
            this.setState(prevState => ({
              userLists: result.pagedItems
            }));
          } else {
            this.setState(item => ({
              userLists: []
            }));
          }
        }
      });
      this.timeout = null;
    }, delay);
  };
  handleInputChange = value => {
    this.setState({ search: value }, () => {
      this.executeQuery();
    });
  };
  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.executeQuery(0);
      }
    );
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.setState({ userId: selectedOption.value });
    this.props.onChange(selectedOption);
  };
  render() {
    const { userLists, selectedOption } = this.state;
    const map = userLists.map(item => ({
      label: item.lastName + ",  " + item.firstName + " ( " + item.email + " )",
      value: item.id
    }));
    return (
      <div>
        <div>
          <Select
            placeholder="Search name ..."
            onInputChange={this.handleInputChange}
            value={selectedOption}
            onChange={this.handleChange}
            options={map}
          />
        </div>
      </div>
    );
  }
}
export default UserSelect;
