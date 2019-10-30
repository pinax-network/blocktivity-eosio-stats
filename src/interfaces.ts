export interface Authorization {
  actor: string
  permission: string
}

export interface Action {
  account: string
  name: string
  authorization: Authorization[]
  data: any
}

export interface Count {
  actions: number;
  transactions: number;
}