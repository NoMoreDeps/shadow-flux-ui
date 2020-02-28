import React, { useState, useEffect, createRef } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Slider, Typography, ListItemAvatar, Avatar, Paper, Table, TableRow, TableCell, TableHead, TableBody, AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AcUnit, ArrowForwardIos, PlayArrow, Send, FiberManualRecord } from '@material-ui/icons';
import { CycleEvent } from './Event';
import { ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';
import CropIcon from '@material-ui/icons/Crop';
import SaveIcon from '@material-ui/icons/Save';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { TreeviewExplorer } from './components/TreeviewExplorer';
import Inspector from "react-json-inspector";

declare var flowjs: any;

function str(data: any) {
  
  let cache = [] as any[];
  return JSON.stringify(data, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }, 2);
}
  
const useStyles = makeStyles({
  root: {
    position        : "fixed",
    top             : 73,
    bottom          : 10,
    left            : 10,
    right           : 5,
    border          : "1px solid #646464",
    display         : "flex",
    justifyContent  : "center",
    alignItems      :"strech"
  },
  flexRowGrow: {
    flex            : 1,
    flexGrow        : 1
  },
  flexContainerRow: {
    display: "flex",
    justifyContent  : "center",
    alignItems      : "stretch",
    overflowY       : "auto"
  },
  flexContainerCol: {
    display         : "flex",
    justifyContent  : "center",
    alignItems      : "stretch",
    flexDirection   : "column",
  },
  list: {
    flexShrink      : 0,
    flexGrow        : 0,
    minWidth        : 300,
    maxWidth        : 300,
    overflowY       : "auto"
  },
  slider: {
    flex            : "1 1 0",
    minHeight       : 130,
    maxHeight       : 130,
    paddingLeft     : 30,
    paddingRight    : 30,
    display         : "flex",
    justifyContent  : "center",
    alignItems      : "center"
  },
  inspector: {
    flex            : "1 1 0",
    flexDirection   : "column",
    overflowY       : "auto",
    padding         : 25
  },
  dep: {
    flex            : "1 1 0",
    overflow        : "auto",
    display         : "flex",
    flexDirection   : "column",
    justifyContent  : "flex-start",
    alignItems      : "stretch"
  },
  mermaidFlex: {
    flex: "1 1 0"
  },
  menuRight: {
    marginLeft  : "auto",
    marginRight : 0
  }
})

function formatName(name: string) {
  let n = name.replace(/-/g,"_");
  if (Number(n.charAt(0)).toString() === n.charAt(0)) {
    n = "_" + n;
  }

  return n;
}

function generateGraph(cycle: CycleEvent[]) {
  if (!cycle) return "";

  let res = [] as Array<any>;
  const processedItems = {} as { [key: string]: Array<string> }
  const processedItemsId = {} as { [key: string]: number }
  let stackId = 0;
  let PId = 0;

  cycle.forEach((_,idx) => {
    switch(_.type) {
      case "StoreProcess":
        processedItems[formatName(_.owner)] = ["Dispatch", formatName(_.owner)];
        processedItemsId[formatName(_.owner)] = PId++;
      break;
      case "EndWaitFor":
        _.waitList.forEach(s => {
          processedItems[`${s} --> ${formatName(_.owner)}`] = [s, formatName(_.owner)];
        });
      break;
      case "NextState":
        processedItems[formatName(_.storeId)].push(`${processedItemsId[formatName(_.storeId)]}_Updated`);
      break;
      case "UpdatedState":
      processedItems[formatName(_.storeId)].indexOf(`${processedItemsId[formatName(_.storeId)]}_Updated`) !== -1 &&
        processedItems[formatName(_.storeId)].push(`${processedItemsId[formatName(_.storeId)]}_EmitUpdate`);
      break;
      case "CallBack":
        processedItems[formatName(_.event.split(".")[1])].push(`View_${_.id}`);
      break;
      case "Stack":
        processedItems[`${_.type}_${++stackId}`] = [`${_.type}_${++stackId}`, "Dispatch"]
        break;
    }
  });

  for(let i in processedItems) {
    if (processedItems[i].length > 2) {
      res.push(processedItems[i]);
    } else {
      processedItems[i][0] !== "Dispatch" && res.push(processedItems[i]);
    };
  }

  console.log(res)
  return res;
}

export function Layout(props: {frames: Array<CycleEvent[]>, onFrameChange: any}) {
  const styles = useStyles();

  const [frameIdx, setFrameIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (<>
  <AppBar position="fixed" color="default">
    <Toolbar>
      <div>
        <span style={{marginRight: 10}}>Storage</span>
        <ToggleButtonGroup aria-label="text alignment">
        <ToggleButton value="left" aria-label="left aligned">
            <SaveIcon  />
          </ToggleButton>
          <ToggleButton value="left" aria-label="left aligned">
            <OpenInBrowserIcon  />
          </ToggleButton>
          <ToggleButton value="left" aria-label="left aligned">
            <CloudDownloadIcon  />
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <CloudUploadIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div style={{marginLeft: 20}}>
        <span style={{marginRight: 10}}>Management</span>
        <ToggleButtonGroup aria-label="text alignment">
          <ToggleButton value="left" aria-label="left aligned">
            <FiberManualRecordIcon  />
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <StopIcon />
          </ToggleButton>  
          <ToggleButton value="center" aria-label="centered">
            <DeleteIcon />
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <CropIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className={styles.menuRight}>
        <Typography variant="body2">
          Zoom Level
        </Typography>
        <Divider orientation="vertical" style={{marginLeft: 5, marginRight: 5}} variant="fullWidth"/>
        <Slider
          style             = {{width: "250px", justifyContent:"flex-end"}}
          defaultValue      = {1}
          onChange          = {(ev, value) => setZoomLevel(value as number)}
          aria-labelledby   = "discrete-slider"
          valueLabelDisplay = "off"
          getAriaValueText  = {(value: number) => value.toString()}
          step              = {0.1}
          min               = {0.2}
          max               = {1}
          />
        </div>
    </Toolbar>
  </AppBar>
    <div className={styles.root}>
      <div className={styles.list}>
        <List component="nav">
          {
            (() => props.frames.map((_,idx) => {
              return <EventItem index={idx} onClick={() => { setFrameIdx(idx); props.onFrameChange(idx)} } event={(_.filter(_ => _.type === "Dispatch")[0])} />
            }))()
          }
        </List>
      </div>
      <div className={`${styles.flexRowGrow} ${styles.flexContainerCol}`} style={{flex: "1 1 0", width:"50%"}}>
        {/**Top Right Panel */}
        <div className={`${styles.flexRowGrow} ${styles.flexContainerRow}`}>
          <div className={styles.inspector} style={{display: "flex"}}>
            {
              props.frames[frameIdx] 
              && props.frames[frameIdx]
              .map(_ => (
                <Paper elevation={3} style={{marginBottom: 30, padding: 15, flex:"1 1 0"}}>
                  <Table size="small">
                    <TableBody>
                      {
                        (() => {
                          const res = [] as JSX.Element[];
                          for(let i in _) {
                            if (typeof((_ as any)[i]) === "object") continue;
                            res.push(
                              <TableRow>
                                <TableCell>{i}</TableCell>
                                <TableCell>{(_ as any)[i]}</TableCell>
                              </TableRow>
                            )
                          }
                          return res;
                        })()
                      }
                    </TableBody>
                  </Table>
                  {
                      (() => {
                        const res = [] as JSX.Element[];
                        for(let i in _) {
                          if (typeof((_ as any)[i]) !== "object") continue;
                          res.push(
                            <Typography variant="body2" display="block" gutterBottom>
                              <span>{i} :</span>
                            </Typography>
                          )
                          res.push(
                            <div style={{maxHeight: 350, overflowY: "auto", padding: 10, border: "1px dashed #70b790"}}>
                              <Inspector data={(_ as any)[i]} />
                            </div>
                          )
                        }
                        return res;
                      })()
                    }
                  
                </Paper>
              ))
            }
          </div>
          <div className={styles.dep} style={{overflowX: "auto"}}>
            <canvas id="graph" width="800" height="300"></canvas>
            {
              (() => {
                if (props.frames[frameIdx]) {                
                  setTimeout(() => {
                    var graph = new flowjs.DiGraph();
                    graph.addPaths(generateGraph(props.frames[frameIdx]));

                    const flow = new flowjs.DiFlowChart("graph", graph, {zoom: zoomLevel});
                    flow.draw();
                    console.log(flow);

                  }, 200); 
                  return <></>;
                }
              })()
            }
          </div>
        </div>
        {/**Bot right panel */}
        <div className={styles.slider}>
          <Slider
            onChange={(ev,value) => props.onFrameChange(value)}
            defaultValue={props.frames.length - 1}
            getAriaValueText={(value: number) => `${value}`}
            aria-labelledby="discrete-slider-always"
            step={1}
            marks={props.frames.map((_, idx) => ({value: idx, label: idx.toString()}))}
            valueLabelDisplay="on"
            min={0}
            max={props.frames.length - 1}
          />
        </div>
      </div>
     
    </div>
    </>
  );
} 

function EventItem(props: {event: any, onClick: any, index: number}) {
  return (
    <>
      <ListItem onClick={() => props.onClick()} button>
        <ListItemAvatar>
          <Avatar>
            <Typography>
              {props.index}
            </Typography>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.event.payload.type} />
      </ListItem>
      <Divider />
    </>
  );
}