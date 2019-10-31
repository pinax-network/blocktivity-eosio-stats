export interface Authorization {
  actor: string
  permission: string
}

export interface Action<T = any> {
  account: string
  name: string
  authorization: Authorization[]
  data: T
}

export interface Count {
  block_num: number;
  actions: number;
  transactions: number;
}