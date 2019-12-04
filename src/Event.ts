type NextState = {
  type       : "NextState" ;
  storeId    : string      ;
  storeState : any         ;
  time       : number      ;
};

type UpdatedState = {
  type       : "UpdatedState" ;
  storeId    : string         ;
  fullEvent  : string         ; 
  time       : number         ; 
  storeState : any            ; 
};

type NewCycle = {
  type : "NewCycle" ;
  time : number     ;
};

type CallBack = {
  type  : "CallBack" ;
  time  : number     ;
  event : string     ;
  id    : string     ;
};

type EndCycle = {
  type : "EndCycle" ;
  time : number     ;
};

type NotProcessed = {
  type      : "NotProcessed" ;
  eventName : string         ;
  data      : any            ;
  time      : number         ;
};

type Dispatch = {
  time      : number     ;
  type      : "Dispatch" ;
  payload   : any        ;
}

type Stack = {
  time      : number  ;
  type      : "Stack" ;
  payload   : any     ;
}

type WaitFor = {
  time      : number        ;
  type      : "WaitFor"     ;
  owner     : string        ;
  waitList  : Array<string> ;
}

type EndWaitFor = {
  time      : number        ;
  type      : "EndWaitFor"  ;
  owner     : string        ;
  waitList  : Array<string> ;
}

type StoreProcess = {
  time      : number         ;
  type      : "StoreProcess" ;
  owner     : string         ;
}

export type CycleEvent = NextState 
 | UpdatedState | NewCycle     | CallBack | Stack   | EndWaitFor
 | EndCycle     | NotProcessed | Dispatch | WaitFor | StoreProcess ;
