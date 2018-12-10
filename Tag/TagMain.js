import React from "react";
import { Route } from "react-router-dom";
import TagList from "./TagList";
import TagInfo from "./TagInfo";
import TagSearchEngine from "./TagSearchEngine";
function TagMain(props) {
  const prefix = props.match.path;
  return (
    <React.Fragment>
      <Route exact path={prefix} component={TagList} />
      <Route exact path={prefix + "/:tagId(\\d+)"} component={TagInfo} />
      <Route exact path={prefix + "/create"} component={TagInfo} />
      <Route exact path={prefix + "/search"} component={TagSearchEngine} />
    </React.Fragment>
  );
}

export default TagMain;
