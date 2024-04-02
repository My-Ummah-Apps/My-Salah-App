import React from "react";
import { render } from "react-dom";
import _ from "lodash";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import "./index.css";

// Component that renders an arbitrary
// number of divs on top of CircularProgressbar,
// whose content is centered.
function LayeredProgressbar(props) {
  const { renderOverlays, ...otherProps } = props;
  const overlayStyles = {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  const overlays = props.renderOverlays();
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ position: "absolute" }}>
        <CircularProgressbar {...otherProps} textForPercentage={null} />
      </div>
      {overlays.map((overlay) => (
        <div style={overlayStyles}>{overlay}</div>
      ))}
    </div>
  );
}

function RadialSeparator(props) {
  return (
    <div
      style={{
        background: "#fff",
        width: "3px",
        height: "100%",
        transform: `rotate(${props.degrees}deg)`,
      }}
    />
  );
}

// Expects an even number of separators.
// Can be implemented with non-even numbers
// but requires changing the styling of LayeredProgressbar,
// left as exercise to the reader.
function generateRadialSeparators(numSeparators) {
  const degrees = 360 / numSeparators;
  return _.range(numSeparators / 2).map((index) => (
    <RadialSeparator degrees={index * degrees} />
  ));
}

function CircleSegment() {
  const percentage = 66;
  return (
    <div
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      <LayeredProgressbar
        percentage={percentage}
        styles={{
          path: {
            strokeLinecap: "butt",
          },
        }}
        renderOverlays={() =>
          generateRadialSeparators(20).concat(
            <div style={{ fontSize: 30 }}>{percentage}%</div>
          )
        }
      />
    </div>
  );
}

// render(<App />, document.getElementById("root"));
export default CircleSegment;
