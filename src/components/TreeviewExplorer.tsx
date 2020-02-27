import * as React from "react";
import * as MUI from "@material-ui/core";
import * as LAB from "@material-ui/lab";
import * as ICO from "@material-ui/icons";
import * as STL from "@material-ui/styles";

export function TreeviewExplorer(props: { data: any }) {
  const useStyles = MUI.makeStyles({
    root: {
      flexGrow: 1
    },
  });
  const classes = useStyles();

  const generateData = (data: any) => {
    const tab = [] as JSX.Element[];
    for (let i in data) {
      switch (typeof data[i]) {
        case "object":
          if (!Array.isArray(data[i])) {
            tab.push(
              <LAB.TreeItem nodeId={Math.random().toString()} label={`${"{...}"}`}>{generateData(data[i])}</LAB.TreeItem>
            );
          } else {
           tab.push(
              <LAB.TreeItem nodeId={Math.random().toString()} label={`${i} : [...]`}>
                {data[i].map(_ =>  <LAB.TreeItem nodeId={Math.random().toString()} label={`${"{...}"}`}>{generateData(_)}</LAB.TreeItem>)}
              </LAB.TreeItem>
            );
          }
          break;
        default:
          tab.push(<LAB.TreeItem nodeId={performance.now().toString()} label={`${i} : ${data[i]}`} />);
          break;
      }
    }
    return tab;
  }

  return <>
    <LAB.TreeView
      className={classes.root}
      defaultCollapseIcon={<ICO.ExpandMore />}
      defaultExpandIcon={<ICO.ChevronRight />}>
      {generateData(props.data)}
    </LAB.TreeView>
  </>;
}