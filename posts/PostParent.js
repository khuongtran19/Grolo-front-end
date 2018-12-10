import React from "react";
import PostForm from "./PostForm";
import PostSearch from "./PostSearch";
import { Route } from "react-router-dom";
import LoggedIn from "../Redux/LoggedIn";
function PostParent(props) {
  const prefix = props.match.path;
  return (
    <LoggedIn>
      <Route exact path={prefix} component={PostSearch} />
      <Route exact path={prefix + "/:postId(\\d+)"} component={PostForm} />
      <Route exact path={prefix + "/create"} component={PostForm} />
      <Route exact path={prefix + "/create/:campaignId(\\d+)"} component={PostForm} />
      <Route
        exact
        path={prefix + "/:postId(\\d+)/campaigns/:campaignId(\\d+)"}
        component={PostForm}
      />
      <Route exact path={prefix + "/:postId(\\d+)/campaigns"} component={PostForm} />
    </LoggedIn>
  );
}

export default PostParent;
