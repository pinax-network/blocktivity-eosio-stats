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
  timestamp: string;
  actions: number;
  transactions: number;
}

export interface Block {
  timestamp: string;
  block_num: number;
  transactions: Transaction[];
}

export interface Transaction {
  status: string;
  cpu_usage_us: number;
  net_usage_words: number;
  trx: any
}
