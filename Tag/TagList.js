import React from "react";
import { tagGetAll, search } from "../../services/tag.server";
import { withRouter } from "react-router-dom";
import TagSearch from "./TagSearch";
function getSearch(queryString) {
  const search = new URLSearchParams(queryString);
  return search.get("q") || "";
}
class TagList extends React.Component {
  state = {
    search: getSearch(this.props.location.search),
    pageIndex: 0,
    pageSize: 100,
    totalCount: 0,
    totalPages: 0
  };
  latestCallCount = 0;
  componentDidMount() {
    this.loadPage();
    window.scrollTo(0, 0);
  }
  loadPage = () => {
    this.setState({ response: null });
    const { pageIndex, pageSize } = this.state;
    tagGetAll(pageIndex, pageSize).then(response => {
      if (!response.item) {
        this.setState({ response });
      } else {
        this.setState({
          response,
          totalCount: response.item.totalCount,
          totalPages: response.item.totalPages,
          pageIndex: response.item.pageIndex,
          pageSize: response.item.pageSize
        });
      }
    });
  };
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
        const currentCallCount = ++this.latestCallCount;
        promise.then(response => {
          if (currentCallCount === this.latestCallCount) {
            const result = response.data;
            if (!result.item) {
              this.setState({ response: result });
            } else {
              this.setState(prevState => ({
                response: result,
                totalCount: result.item.totalCount,
                totalPages: Math.ceil(result.item.totalCount / prevState.pageSize)
              }));
            }
          }
        });
      }
      this.timeout = null;
    }, delay);
  };
  handleClear = () => {
    this.setState({ search: "" }, () => {
      this.executeQuery();
    });
  };
  checkActive = id => {
    const newResponse = JSON.parse(JSON.stringify(this.state.response));
    newResponse.item.pagedItems = newResponse.item.pagedItems.map(tagItem => {
      if (id === tagItem.id) {
        return {
          ...tagItem,
          activeStatus: !tagItem.activeStatus
        };
      } else {
        return tagItem;
      }
    });
    this.setState({ response: newResponse });
  };
  handleSearchChange = e => {
    this.setState({ search: e.target.value }, () => {
      this.executeQuery();
    });
  };
  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.loadPage();
      }
    );
  };
  handleCreate = () => {
    this.props.history.push("/admin/tag/create");
  };
  render() {
    const { response, search, pageIndex, pageSize, totalCount, totalPages } = this.state;
    if (!response) return null;
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title-wrap bar-success">
            <h2 className="card-title">Tag</h2>
          </div>
          <br />
          <div className="row">
            <div className="input col-12">
              <input
                className="form-control"
                type="text"
                style={{ borderRadius: "25px" }}
                autoFocus
                spellCheck={false}
                value={search}
                onChange={e => this.handleSearchChange(e)}
                placeholder={"Search tag ..."}
              />
              <i
                className="fa fa-times"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "24px",
                  fontSize: "15px",
                  color: "gray"
                }}
                onClick={this.handleClear}
              />
            </div>
          </div>
          <br />
          {response.item ? (
            <div style={{ padding: "2px", textAlign: "center" }}>
              <TagSearch
                response={this.state.response}
                checkActive={id => this.checkActive(id)}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onChangePageSize={this.onChangePageSize}
                goToPage={this.goToPage}
                executeQuery={this.executeQuery}
                loadPage={this.loadPage}
              />
            </div>
          ) : (
            <div>Could not find tag</div>
          )}
          <br />
          <button
            className="btn-info btn"
            onClick={this.handleCreate}
            style={{ borderRadius: "50px" }}
          >
            Add new Tag
          </button>
        </div>
      </div>
    );
  }
}
export default withRouter(TagList);
