export interface BlockTime {
    seconds: string;
    nanos: number;
}

export interface Receipt {
    status: string;
    cpuUsageMicroSeconds: number;
}

export interface AuthSequence {
    accountName: string;
    sequence: string;
}

export interface Receipt2 {
    receiver: string;
    digest: string;
    globalSequence: string;
    authSequence: AuthSequence[];
    recvSequence: string;
    codeSequence: string;
    abiSequence: string;
}

export interface Authorization {
    actor: string;
    permission: string;
}

export interface Action {
    account: string;
    name: string;
    authorization: Authorization[];
    jsonData: string;
    rawData: string;
}

export interface ActionTrace {
    receipt: Receipt2;
    action: Action;
    elapsed: string;
    transactionId: string;
    blockNum: string;
    producerBlockId: string;
    blockTime: BlockTime;
    receiver: string;
    actionOrdinal: number;
    filteringMatched: boolean;
}

export interface DbOp {
    operation: string;
    code: string;
    scope: string;
    tableName: string;
    primaryKey: string;
    oldPayer: string;
    newPayer: string;
    oldData: string;
    newData: string;
}

export interface NetUsage {
    lastOrdinal: number;
}

export interface CpuUsage {
    lastOrdinal: number;
    valueEx: string;
    consumed: string;
}

export interface AccountUsage {
    owner: string;
    netUsage: NetUsage;
    cpuUsage: CpuUsage;
    ramUsage: string;
}

export interface RlimitOp {
    operation: string;
    accountUsage: AccountUsage;
}

export interface CreationTree {
    creatorActionIndex: number;
}

export interface FilteredTransactionTraces {
    id: string;
    blockNum: string;
    blockTime: BlockTime;
    producerBlockId: string;
    receipt: Receipt;
    elapsed: string;
    actionTraces: ActionTrace[];
    dbOps: DbOp[];
    rlimitOps: RlimitOp[];
    creationTree: CreationTree[];
}

export interface Timestamp {
    seconds: string;
    nanos: number;
}

export interface Header {
    timestamp: Timestamp;
    producer: string;
    previous: string;
    transactionMroot: string;
    actionMroot: string;
    scheduleVersion: number;
}

export interface BlockrootMerkle {
    nodeCount: number;
    activeNodes: string[];
}

export interface ProducerToLastProduced {
    name: string;
    lastBlockNumProduced: number;
}

export interface ProducerToLastImpliedIrb {
    name: string;
    lastBlockNumProduced: number;
}

export interface ScheduleV2 {
    version: number;
}

export interface PendingSchedule {
    scheduleLibNum: number;
    scheduleHash: string;
    scheduleV2: ScheduleV2;
}

export interface ActivatedProtocolFeatures {
    protocolFeatures: string[];
}

export interface AverageBlockNetUsage {
    lastOrdinal: number;
    valueEx: string;
    consumed: string;
}

export interface AverageBlockCpuUsage {
    lastOrdinal: number;
    valueEx: string;
    consumed: string;
}

export interface State {
    averageBlockNetUsage: AverageBlockNetUsage;
    averageBlockCpuUsage: AverageBlockCpuUsage;
    pendingNetUsage: string;
    pendingCpuUsage: string;
    totalNetWeight: string;
    totalCpuWeight: string;
    totalRamBytes: string;
    virtualNetLimit: string;
    virtualCpuLimit: string;
}

export interface RlimitOp {
    operation: string;
    state: State;
}

export interface Key {
    publicKey: string;
    weight: number;
}

export interface V0 {
    threshold: number;
    keys: Key[];
}

export interface ValidBlockSigningAuthorityV2 {
    v0: V0;
}

export interface Key2 {
    publicKey: string;
    weight: number;
}

export interface V02 {
    threshold: number;
    keys: Key2[];
}

export interface BlockSigningAuthority {
    v0: V02;
}

export interface Producer {
    accountName: string;
    blockSigningAuthority: BlockSigningAuthority;
}

export interface ActiveScheduleV2 {
    version: number;
    producers: Producer[];
}

export interface Block {
    id: string;
    number: number;
    version: number;
    header: Header;
    producerSignature: string;
    dposProposedIrreversibleBlocknum: number;
    dposIrreversibleBlocknum: number;
    blockrootMerkle: BlockrootMerkle;
    producerToLastProduced: ProducerToLastProduced[];
    producerToLastImpliedIrb: ProducerToLastImpliedIrb[];
    confirmCount: number[];
    pendingSchedule: PendingSchedule;
    activatedProtocolFeatures: ActivatedProtocolFeatures;
    rlimitOps: RlimitOp[];
    unfilteredTransactionCount: number;
    unfilteredTransactionTraceCount: number;
    unfilteredExecutedInputActionCount: number;
    unfilteredExecutedTotalActionCount: number;
    validBlockSigningAuthorityV2: ValidBlockSigningAuthorityV2;
    activeScheduleV2: ActiveScheduleV2;
    filteringApplied: boolean;
    filteringExcludeFilterExpr: string;
    filteredTransactionTraceCount: number;
    filteredExecutedInputActionCount: number;
    filteredExecutedTotalActionCount: number;
    filteredTransactionTraces: FilteredTransactionTraces[];
    filteredTransactionCount: number;
    filteredImplicitTransactionOps: any;
    filteredTransactions: any[]
}
