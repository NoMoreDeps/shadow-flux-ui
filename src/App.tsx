import * as React from "react";
import * as ReactDOM from "react-dom";
import {Layout} from "./Layout";
import { CycleEvent } from "./Event";
import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const source = window.location.search.replace("?","").split("=")[1];


const send = (topic: string, value: any) => {
  window.opener.postMessage({topic, value}, source);
};

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export function App(props: any) {
  const [frames, setFrames]     = React.useState<Array<CycleEvent[]>>([]);
  const [curFrame, setCurFrame] = React.useState(0);

  React.useEffect(() => {
    window.addEventListener("message", (ev) => {
      switch(ev.data.topic) 
      {
        case "getFrames":
          setFrames(ev.data.value);
        break;
      }
    });
    send("getFrames", null);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout frames={frames} onFrameChange={(value: number) => send("playFrame", value)}/>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.querySelector("#app"));