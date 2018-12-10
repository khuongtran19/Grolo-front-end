import React from "react";
import { Card, CardImg, CardText, CardBody, CardSubtitle } from "reactstrap";
class PostList extends React.Component {
  render() {
    let item = [].concat(this.props.posts).map(post => {
      const tag = JSON.parse(post.tag);
      const tagName = (tag || []).map(tag => (
        <span
          key={tag.Id}
          onClick={() => {
            this.props.getPost(tag.Id);
            this.props.toggle();
          }}
          className="btn btn-outline-info mr-0.5"
          style={{
            borderRadius: "25px",
            height: "25px",
            lineHeight: "10px",
            margin: "0.5px"
          }}
        >
          {tag.Name}{" "}
        </span>
      ));
      const link = <a href={post.linkUrl}>Link</a>;
      const video = <a href={post.videoUrl}>Video</a>;
      return (
        <div key={post.id} style={{ width: "266px" }} className="mr-2">
          <Card style={{ padding: "0px" }}>
            {post.photoUrl !== "" ? (
              <CardImg top width="100%" src={post.photoUrl} alt="Unable to show image" />
            ) : (
              ""
            )}
            <CardBody style={{ padding: "25px" }}>
              <CardText>{post.message}</CardText>
              <CardSubtitle style={{ display: "flex", justifyContent: "space-between" }}>
                {post.linkUrl !== "" ? <div>{link}</div> : ""}
                {post.videoUrl !== "" ? <div>{video}</div> : ""}
              </CardSubtitle>
              <CardText>
                {tagName.length > 0 ? <span>Tag: </span> : ""}
                <span> {tagName}</span>
                <br />
                <span style={{ fontSize: "25px", margin: " 5px" }} className="action float-right">
                  <i
                    className="ft-calendar mr-2 success"
                    onClick={() => this.props.handleScheduleClicked(post.id)}
                  />
                  <i
                    className="ft-edit mr-2 warning"
                    onClick={() => this.props.handleEdit(post.id, post.campaignId)}
                  />
                  <i
                    className="ft-trash danger"
                    onClick={() => this.props.modalDeleteClick(post.id)}
                  />{" "}
                </span>
              </CardText>
            </CardBody>
          </Card>
        </div>
      );
    });
    return item;
  }
}
export default PostList;
