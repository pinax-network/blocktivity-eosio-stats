export interface Count {
  block_num: number;
  timestamp: string;
  actions: number;
  transactions: number;
  cpu_usage_us: number;
  net_usage_words: number;
}

// export interface Block {
//   timestamp: string;
//   block_num: number;
//   transactions: Transaction[];
// }

export interface Authorization {
  account: string;
  permission: string;
}

export interface Action {
  global_sequence: number;
  receiver: string;
  account: string;
  action: string;
  authorization: Authorization[];
  data: string;
}

export interface Transaction {
  id: string;
  actions: Action[];
  status: string;
  cpu_usage_us: number;
  net_usage_words: number;
  signatures: any[];
  transaction_header: {
    expiration: string;
    ref_block_num: number;
    ref_block_prefix: number;
    max_net_usage_words: number;
    max_cpu_usage_ms: number;
    delay_sec: number;
  }
}

export interface Block {
  id: string;
  number: number;
  previous_id: string;
  status: string;
  timestamp: string;
  producer: string;
  transaction_mroot: string;
  action_mroot: string;
  schedule_version: number,
  transactions: Transaction[]
}