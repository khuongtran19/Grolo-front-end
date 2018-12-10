import React from "react";
import { Card, CardImg, CardText, CardBody, CardSubtitle } from "reactstrap";
class PostTag extends React.Component {
  render() {
    const link = this.props.link;
    const tagPost = (link || []).map(item => {
      const link = <a href={item.linkUrl}>Link</a>;
      const video = <a href={item.videoUrl}>Video</a>;
      return (
        <div key={item.Id} className="mr-2">
          <Card>
            {item.PhotoUrl !== "" ? (
              <CardImg top width="100%" src={item.PhotoUrl} alt="Unable to show image" />
            ) : (
              ""
            )}
            <CardBody>
              <CardText>{item.Message}</CardText>
              <CardSubtitle>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {item.LinkUrl !== "" ? <div>{link}</div> : ""}
                  {item.VideoUrl !== "" ? <div>{video}</div> : ""}
                </div>
              </CardSubtitle>
              <CardText>
                <span style={{ fontSize: "25px", margin: " 5px" }} className="action float-right">
                  <i
                    className="ft-calendar mr-2 success"
                    onClick={() => this.props.handleScheduleClicked(item.Id)}
                  />
                  <i
                    className="ft-edit mr-2 warning"
                    onClick={() => this.props.handleEdit(item.Id)}
                  />

                  <i className="ft-trash danger" onClick={() => this.props.deletePost(item.Id)} />
                </span>
              </CardText>
            </CardBody>
          </Card>
        </div>
      );
    });
    return tagPost;
  }
}
export default PostTag;
