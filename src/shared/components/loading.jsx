import React from "react";
import { Card, CardText, CardActions } from "react-material-cw";

const Loading = () => (
  <Card
    style={{ width: "512px", margin: "auto" }}
    title="Processing"
  >
    <CardText>
      Please wait ...
    </CardText>

    <CardActions />
  </Card>
);

Loading.propTypes = {
};

export default Loading;
