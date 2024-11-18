import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  account_type: { input: any; output: any };
  bankname: { input: any; output: any };
  bigint: { input: any; output: any };
  bytea: { input: any; output: any };
  checkoutbasketstatus: { input: any; output: any };
  connector_provider: { input: any; output: any };
  consumerstatus: { input: any; output: any };
  currencycode: { input: any; output: any };
  date: { input: any; output: any };
  journal_direction: { input: any; output: any };
  json: { input: any; output: any };
  jsonb: { input: any; output: any };
  numeric: { input: any; output: any };
  partnercategory: { input: any; output: any };
  partnerstatus: { input: any; output: any };
  party_account_type: { input: any; output: any };
  payeeidtype: { input: any; output: any };
  payeetype: { input: any; output: any };
  payment_status: { input: any; output: any };
  payment_type: { input: any; output: any };
  paymentchannel: { input: any; output: any };
  paymentstatus: { input: any; output: any };
  profiletype: { input: any; output: any };
  timestamp: { input: any; output: any };
  timestamptz: { input: any; output: any };
  transfer_status: { input: any; output: any };
  uuid: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "account_type". All fields are combined with logical 'AND'. */
export type Account_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['account_type']['input']>;
  _gt?: InputMaybe<Scalars['account_type']['input']>;
  _gte?: InputMaybe<Scalars['account_type']['input']>;
  _in?: InputMaybe<Array<Scalars['account_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['account_type']['input']>;
  _lte?: InputMaybe<Scalars['account_type']['input']>;
  _neq?: InputMaybe<Scalars['account_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['account_type']['input']>>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_Account = {
  __typename?: 'accounts_account';
  account_name: Scalars['String']['output'];
  /** An array relationship */
  balances: Array<Accounts_Balances>;
  /** An aggregate relationship */
  balances_aggregate: Accounts_Balances_Aggregate;
  /** An array relationship */
  bank_account_related_accounts: Array<Accounts_Bank_Account_Related_Accounts>;
  /** An aggregate relationship */
  bank_account_related_accounts_aggregate: Accounts_Bank_Account_Related_Accounts_Aggregate;
  /** An object relationship */
  connector: Connectors_Connector;
  connector_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  default_currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  /** An array relationship */
  payments: Array<Payments_Payment>;
  /** An array relationship */
  paymentsBySourceAccountId: Array<Payments_Payment>;
  /** An aggregate relationship */
  paymentsBySourceAccountId_aggregate: Payments_Payment_Aggregate;
  /** An aggregate relationship */
  payments_aggregate: Payments_Payment_Aggregate;
  /** An array relationship */
  pool_accounts: Array<Accounts_Pool_Accounts>;
  /** An aggregate relationship */
  pool_accounts_aggregate: Accounts_Pool_Accounts_Aggregate;
  raw_data?: Maybe<Scalars['json']['output']>;
  reference: Scalars['String']['output'];
  /** An array relationship */
  transferInitiationsBySourceAccountId: Array<Transfers_Transfer_Initiation>;
  /** An aggregate relationship */
  transferInitiationsBySourceAccountId_aggregate: Transfers_Transfer_Initiation_Aggregate;
  /** An array relationship */
  transfer_initiations: Array<Transfers_Transfer_Initiation>;
  /** An aggregate relationship */
  transfer_initiations_aggregate: Transfers_Transfer_Initiation_Aggregate;
  type?: Maybe<Scalars['account_type']['output']>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountBalancesArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Balances_Order_By>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountBalances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Balances_Order_By>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountBank_Account_Related_AccountsArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountBank_Account_Related_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountPaymentsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountPaymentsBySourceAccountIdArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountPaymentsBySourceAccountId_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountPayments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountPool_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountPool_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountRaw_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountTransferInitiationsBySourceAccountIdArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountTransferInitiationsBySourceAccountId_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
    where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  };

/** columns and relationships of "accounts.account" */
export type Accounts_AccountTransfer_InitiationsArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

/** columns and relationships of "accounts.account" */
export type Accounts_AccountTransfer_Initiations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

/** aggregated selection of "accounts.account" */
export type Accounts_Account_Aggregate = {
  __typename?: 'accounts_account_aggregate';
  aggregate?: Maybe<Accounts_Account_Aggregate_Fields>;
  nodes: Array<Accounts_Account>;
};

export type Accounts_Account_Aggregate_Bool_Exp = {
  count?: InputMaybe<Accounts_Account_Aggregate_Bool_Exp_Count>;
};

export type Accounts_Account_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Accounts_Account_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "accounts.account" */
export type Accounts_Account_Aggregate_Fields = {
  __typename?: 'accounts_account_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Accounts_Account_Max_Fields>;
  min?: Maybe<Accounts_Account_Min_Fields>;
};

/** aggregate fields of "accounts.account" */
export type Accounts_Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "accounts.account" */
export type Accounts_Account_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Accounts_Account_Max_Order_By>;
  min?: InputMaybe<Accounts_Account_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Account_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "accounts.account" */
export type Accounts_Account_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Account_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Account_On_Conflict>;
};

/** Boolean expression to filter rows from the table "accounts.account". All fields are combined with a logical 'AND'. */
export type Accounts_Account_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Account_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Account_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Account_Bool_Exp>>;
  account_name?: InputMaybe<String_Comparison_Exp>;
  balances?: InputMaybe<Accounts_Balances_Bool_Exp>;
  balances_aggregate?: InputMaybe<Accounts_Balances_Aggregate_Bool_Exp>;
  bank_account_related_accounts?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  bank_account_related_accounts_aggregate?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Bool_Exp>;
  connector?: InputMaybe<Connectors_Connector_Bool_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  default_currency?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  payments?: InputMaybe<Payments_Payment_Bool_Exp>;
  paymentsBySourceAccountId?: InputMaybe<Payments_Payment_Bool_Exp>;
  paymentsBySourceAccountId_aggregate?: InputMaybe<Payments_Payment_Aggregate_Bool_Exp>;
  payments_aggregate?: InputMaybe<Payments_Payment_Aggregate_Bool_Exp>;
  pool_accounts?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
  pool_accounts_aggregate?: InputMaybe<Accounts_Pool_Accounts_Aggregate_Bool_Exp>;
  raw_data?: InputMaybe<Json_Comparison_Exp>;
  reference?: InputMaybe<String_Comparison_Exp>;
  transferInitiationsBySourceAccountId?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  transferInitiationsBySourceAccountId_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Bool_Exp>;
  transfer_initiations?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  transfer_initiations_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Bool_Exp>;
  type?: InputMaybe<Account_Type_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts.account" */
export enum Accounts_Account_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccountPk = 'account_pk',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Accounts_Account_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Accounts_Account_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Accounts_Account_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "accounts.account" */
export type Accounts_Account_Insert_Input = {
  account_name?: InputMaybe<Scalars['String']['input']>;
  balances?: InputMaybe<Accounts_Balances_Arr_Rel_Insert_Input>;
  bank_account_related_accounts?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Arr_Rel_Insert_Input>;
  connector?: InputMaybe<Connectors_Connector_Obj_Rel_Insert_Input>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  default_currency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  payments?: InputMaybe<Payments_Payment_Arr_Rel_Insert_Input>;
  paymentsBySourceAccountId?: InputMaybe<Payments_Payment_Arr_Rel_Insert_Input>;
  pool_accounts?: InputMaybe<Accounts_Pool_Accounts_Arr_Rel_Insert_Input>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  transferInitiationsBySourceAccountId?: InputMaybe<Transfers_Transfer_Initiation_Arr_Rel_Insert_Input>;
  transfer_initiations?: InputMaybe<Transfers_Transfer_Initiation_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Scalars['account_type']['input']>;
};

/** aggregate max on columns */
export type Accounts_Account_Max_Fields = {
  __typename?: 'accounts_account_max_fields';
  account_name?: Maybe<Scalars['String']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  default_currency?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['account_type']['output']>;
};

/** order by max() on columns of table "accounts.account" */
export type Accounts_Account_Max_Order_By = {
  account_name?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  default_currency?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Accounts_Account_Min_Fields = {
  __typename?: 'accounts_account_min_fields';
  account_name?: Maybe<Scalars['String']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  default_currency?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['account_type']['output']>;
};

/** order by min() on columns of table "accounts.account" */
export type Accounts_Account_Min_Order_By = {
  account_name?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  default_currency?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts.account" */
export type Accounts_Account_Mutation_Response = {
  __typename?: 'accounts_account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts_Account>;
};

/** input type for inserting object relation for remote table "accounts.account" */
export type Accounts_Account_Obj_Rel_Insert_Input = {
  data: Accounts_Account_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Account_On_Conflict>;
};

/** on_conflict condition type for table "accounts.account" */
export type Accounts_Account_On_Conflict = {
  constraint: Accounts_Account_Constraint;
  update_columns?: Array<Accounts_Account_Update_Column>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts.account". */
export type Accounts_Account_Order_By = {
  account_name?: InputMaybe<Order_By>;
  balances_aggregate?: InputMaybe<Accounts_Balances_Aggregate_Order_By>;
  bank_account_related_accounts_aggregate?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Order_By>;
  connector?: InputMaybe<Connectors_Connector_Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  default_currency?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  paymentsBySourceAccountId_aggregate?: InputMaybe<Payments_Payment_Aggregate_Order_By>;
  payments_aggregate?: InputMaybe<Payments_Payment_Aggregate_Order_By>;
  pool_accounts_aggregate?: InputMaybe<Accounts_Pool_Accounts_Aggregate_Order_By>;
  raw_data?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  transferInitiationsBySourceAccountId_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Order_By>;
  transfer_initiations_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts.account */
export type Accounts_Account_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Account_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "accounts.account" */
export enum Accounts_Account_Select_Column {
  /** column name */
  AccountName = 'account_name',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DefaultCurrency = 'default_currency',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  RawData = 'raw_data',
  /** column name */
  Reference = 'reference',
  /** column name */
  Type = 'type',
}

/** input type for updating data in table "accounts.account" */
export type Accounts_Account_Set_Input = {
  account_name?: InputMaybe<Scalars['String']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  default_currency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['account_type']['input']>;
};

/** Streaming cursor of the table "accounts_account" */
export type Accounts_Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Account_Stream_Cursor_Value_Input = {
  account_name?: InputMaybe<Scalars['String']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  default_currency?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['account_type']['input']>;
};

/** update columns of table "accounts.account" */
export enum Accounts_Account_Update_Column {
  /** column name */
  AccountName = 'account_name',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DefaultCurrency = 'default_currency',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  RawData = 'raw_data',
  /** column name */
  Reference = 'reference',
  /** column name */
  Type = 'type',
}

export type Accounts_Account_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Accounts_Account_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Accounts_Account_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Accounts_Account_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Accounts_Account_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Accounts_Account_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Account_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Account_Bool_Exp;
};

/** columns and relationships of "accounts.balances" */
export type Accounts_Balances = {
  __typename?: 'accounts_balances';
  /** An object relationship */
  account: Accounts_Account;
  account_id: Scalars['String']['output'];
  balance: Scalars['numeric']['output'];
  created_at: Scalars['timestamptz']['output'];
  currency: Scalars['String']['output'];
  last_updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "accounts.balances" */
export type Accounts_Balances_Aggregate = {
  __typename?: 'accounts_balances_aggregate';
  aggregate?: Maybe<Accounts_Balances_Aggregate_Fields>;
  nodes: Array<Accounts_Balances>;
};

export type Accounts_Balances_Aggregate_Bool_Exp = {
  count?: InputMaybe<Accounts_Balances_Aggregate_Bool_Exp_Count>;
};

export type Accounts_Balances_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Accounts_Balances_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "accounts.balances" */
export type Accounts_Balances_Aggregate_Fields = {
  __typename?: 'accounts_balances_aggregate_fields';
  avg?: Maybe<Accounts_Balances_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Accounts_Balances_Max_Fields>;
  min?: Maybe<Accounts_Balances_Min_Fields>;
  stddev?: Maybe<Accounts_Balances_Stddev_Fields>;
  stddev_pop?: Maybe<Accounts_Balances_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Accounts_Balances_Stddev_Samp_Fields>;
  sum?: Maybe<Accounts_Balances_Sum_Fields>;
  var_pop?: Maybe<Accounts_Balances_Var_Pop_Fields>;
  var_samp?: Maybe<Accounts_Balances_Var_Samp_Fields>;
  variance?: Maybe<Accounts_Balances_Variance_Fields>;
};

/** aggregate fields of "accounts.balances" */
export type Accounts_Balances_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "accounts.balances" */
export type Accounts_Balances_Aggregate_Order_By = {
  avg?: InputMaybe<Accounts_Balances_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Accounts_Balances_Max_Order_By>;
  min?: InputMaybe<Accounts_Balances_Min_Order_By>;
  stddev?: InputMaybe<Accounts_Balances_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Accounts_Balances_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Accounts_Balances_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Accounts_Balances_Sum_Order_By>;
  var_pop?: InputMaybe<Accounts_Balances_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Accounts_Balances_Var_Samp_Order_By>;
  variance?: InputMaybe<Accounts_Balances_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "accounts.balances" */
export type Accounts_Balances_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Balances_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Balances_On_Conflict>;
};

/** aggregate avg on columns */
export type Accounts_Balances_Avg_Fields = {
  __typename?: 'accounts_balances_avg_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "accounts.balances" */
export type Accounts_Balances_Avg_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "accounts.balances". All fields are combined with a logical 'AND'. */
export type Accounts_Balances_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Balances_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Balances_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Balances_Bool_Exp>>;
  account?: InputMaybe<Accounts_Account_Bool_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  balance?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  last_updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts.balances" */
export enum Accounts_Balances_Constraint {
  /** unique or primary key constraint on columns "currency", "account_id", "created_at" */
  BalancesPkey = 'balances_pkey',
}

/** input type for incrementing numeric columns in table "accounts.balances" */
export type Accounts_Balances_Inc_Input = {
  balance?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "accounts.balances" */
export type Accounts_Balances_Insert_Input = {
  account?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  last_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Accounts_Balances_Max_Fields = {
  __typename?: 'accounts_balances_max_fields';
  account_id?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  last_updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "accounts.balances" */
export type Accounts_Balances_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  last_updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Accounts_Balances_Min_Fields = {
  __typename?: 'accounts_balances_min_fields';
  account_id?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  last_updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "accounts.balances" */
export type Accounts_Balances_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  last_updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts.balances" */
export type Accounts_Balances_Mutation_Response = {
  __typename?: 'accounts_balances_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts_Balances>;
};

/** on_conflict condition type for table "accounts.balances" */
export type Accounts_Balances_On_Conflict = {
  constraint: Accounts_Balances_Constraint;
  update_columns?: Array<Accounts_Balances_Update_Column>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts.balances". */
export type Accounts_Balances_Order_By = {
  account?: InputMaybe<Accounts_Account_Order_By>;
  account_id?: InputMaybe<Order_By>;
  balance?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  last_updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts.balances */
export type Accounts_Balances_Pk_Columns_Input = {
  account_id: Scalars['String']['input'];
  created_at: Scalars['timestamptz']['input'];
  currency: Scalars['String']['input'];
};

/** select columns of table "accounts.balances" */
export enum Accounts_Balances_Select_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  Balance = 'balance',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Currency = 'currency',
  /** column name */
  LastUpdatedAt = 'last_updated_at',
}

/** input type for updating data in table "accounts.balances" */
export type Accounts_Balances_Set_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  last_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Accounts_Balances_Stddev_Fields = {
  __typename?: 'accounts_balances_stddev_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "accounts.balances" */
export type Accounts_Balances_Stddev_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Accounts_Balances_Stddev_Pop_Fields = {
  __typename?: 'accounts_balances_stddev_pop_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "accounts.balances" */
export type Accounts_Balances_Stddev_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Accounts_Balances_Stddev_Samp_Fields = {
  __typename?: 'accounts_balances_stddev_samp_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "accounts.balances" */
export type Accounts_Balances_Stddev_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "accounts_balances" */
export type Accounts_Balances_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Balances_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Balances_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  last_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Accounts_Balances_Sum_Fields = {
  __typename?: 'accounts_balances_sum_fields';
  balance?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "accounts.balances" */
export type Accounts_Balances_Sum_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** update columns of table "accounts.balances" */
export enum Accounts_Balances_Update_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  Balance = 'balance',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Currency = 'currency',
  /** column name */
  LastUpdatedAt = 'last_updated_at',
}

export type Accounts_Balances_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Accounts_Balances_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Balances_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Balances_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Accounts_Balances_Var_Pop_Fields = {
  __typename?: 'accounts_balances_var_pop_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "accounts.balances" */
export type Accounts_Balances_Var_Pop_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Accounts_Balances_Var_Samp_Fields = {
  __typename?: 'accounts_balances_var_samp_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "accounts.balances" */
export type Accounts_Balances_Var_Samp_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Accounts_Balances_Variance_Fields = {
  __typename?: 'accounts_balances_variance_fields';
  balance?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "accounts.balances" */
export type Accounts_Balances_Variance_Order_By = {
  balance?: InputMaybe<Order_By>;
};

/** columns and relationships of "accounts.bank_account" */
export type Accounts_Bank_Account = {
  __typename?: 'accounts_bank_account';
  account_number?: Maybe<Scalars['bytea']['output']>;
  /** An array relationship */
  bank_account_related_accounts: Array<Accounts_Bank_Account_Related_Accounts>;
  /** An aggregate relationship */
  bank_account_related_accounts_aggregate: Accounts_Bank_Account_Related_Accounts_Aggregate;
  country?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  iban?: Maybe<Scalars['bytea']['output']>;
  id: Scalars['uuid']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  name: Scalars['String']['output'];
  swift_bic_code?: Maybe<Scalars['bytea']['output']>;
};

/** columns and relationships of "accounts.bank_account" */
export type Accounts_Bank_AccountBank_Account_Related_AccountsArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.bank_account" */
export type Accounts_Bank_AccountBank_Account_Related_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.bank_account" */
export type Accounts_Bank_AccountMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "accounts.bank_account" */
export type Accounts_Bank_Account_Aggregate = {
  __typename?: 'accounts_bank_account_aggregate';
  aggregate?: Maybe<Accounts_Bank_Account_Aggregate_Fields>;
  nodes: Array<Accounts_Bank_Account>;
};

/** aggregate fields of "accounts.bank_account" */
export type Accounts_Bank_Account_Aggregate_Fields = {
  __typename?: 'accounts_bank_account_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Accounts_Bank_Account_Max_Fields>;
  min?: Maybe<Accounts_Bank_Account_Min_Fields>;
};

/** aggregate fields of "accounts.bank_account" */
export type Accounts_Bank_Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Bank_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Bank_Account_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "accounts.bank_account". All fields are combined with a logical 'AND'. */
export type Accounts_Bank_Account_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bank_Account_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Bank_Account_Bool_Exp>>;
  account_number?: InputMaybe<Bytea_Comparison_Exp>;
  bank_account_related_accounts?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  bank_account_related_accounts_aggregate?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Bool_Exp>;
  country?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  iban?: InputMaybe<Bytea_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  swift_bic_code?: InputMaybe<Bytea_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts.bank_account" */
export enum Accounts_Bank_Account_Constraint {
  /** unique or primary key constraint on columns "id" */
  BankAccountPk = 'bank_account_pk',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Accounts_Bank_Account_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Accounts_Bank_Account_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Accounts_Bank_Account_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "accounts.bank_account" */
export type Accounts_Bank_Account_Insert_Input = {
  account_number?: InputMaybe<Scalars['bytea']['input']>;
  bank_account_related_accounts?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Arr_Rel_Insert_Input>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  iban?: InputMaybe<Scalars['bytea']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  swift_bic_code?: InputMaybe<Scalars['bytea']['input']>;
};

/** aggregate max on columns */
export type Accounts_Bank_Account_Max_Fields = {
  __typename?: 'accounts_bank_account_max_fields';
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Accounts_Bank_Account_Min_Fields = {
  __typename?: 'accounts_bank_account_min_fields';
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "accounts.bank_account" */
export type Accounts_Bank_Account_Mutation_Response = {
  __typename?: 'accounts_bank_account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts_Bank_Account>;
};

/** input type for inserting object relation for remote table "accounts.bank_account" */
export type Accounts_Bank_Account_Obj_Rel_Insert_Input = {
  data: Accounts_Bank_Account_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Bank_Account_On_Conflict>;
};

/** on_conflict condition type for table "accounts.bank_account" */
export type Accounts_Bank_Account_On_Conflict = {
  constraint: Accounts_Bank_Account_Constraint;
  update_columns?: Array<Accounts_Bank_Account_Update_Column>;
  where?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts.bank_account". */
export type Accounts_Bank_Account_Order_By = {
  account_number?: InputMaybe<Order_By>;
  bank_account_related_accounts_aggregate?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Order_By>;
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  iban?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  swift_bic_code?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts.bank_account */
export type Accounts_Bank_Account_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Bank_Account_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** columns and relationships of "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts = {
  __typename?: 'accounts_bank_account_related_accounts';
  /** An object relationship */
  account: Accounts_Account;
  account_id: Scalars['String']['output'];
  /** An object relationship */
  bank_account: Accounts_Bank_Account;
  bank_account_id: Scalars['uuid']['output'];
  /** An object relationship */
  connector: Connectors_Connector;
  connector_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
};

/** aggregated selection of "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Aggregate = {
  __typename?: 'accounts_bank_account_related_accounts_aggregate';
  aggregate?: Maybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Fields>;
  nodes: Array<Accounts_Bank_Account_Related_Accounts>;
};

export type Accounts_Bank_Account_Related_Accounts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Bool_Exp_Count>;
};

export type Accounts_Bank_Account_Related_Accounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Aggregate_Fields = {
  __typename?: 'accounts_bank_account_related_accounts_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Accounts_Bank_Account_Related_Accounts_Max_Fields>;
  min?: Maybe<Accounts_Bank_Account_Related_Accounts_Min_Fields>;
};

/** aggregate fields of "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Max_Order_By>;
  min?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Min_Order_By>;
};

/** input type for inserting array relation for remote table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Bank_Account_Related_Accounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Bank_Account_Related_Accounts_On_Conflict>;
};

/** Boolean expression to filter rows from the table "accounts.bank_account_related_accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Bank_Account_Related_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Bool_Exp>>;
  account?: InputMaybe<Accounts_Account_Bool_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  bank_account?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
  bank_account_id?: InputMaybe<Uuid_Comparison_Exp>;
  connector?: InputMaybe<Connectors_Connector_Bool_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts.bank_account_related_accounts" */
export enum Accounts_Bank_Account_Related_Accounts_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransferInitiationAdjustmentsPk = 'transfer_initiation_adjustments_pk',
}

/** input type for inserting data into table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Insert_Input = {
  account?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  bank_account?: InputMaybe<Accounts_Bank_Account_Obj_Rel_Insert_Input>;
  bank_account_id?: InputMaybe<Scalars['uuid']['input']>;
  connector?: InputMaybe<Connectors_Connector_Obj_Rel_Insert_Input>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Accounts_Bank_Account_Related_Accounts_Max_Fields = {
  __typename?: 'accounts_bank_account_related_accounts_max_fields';
  account_id?: Maybe<Scalars['String']['output']>;
  bank_account_id?: Maybe<Scalars['uuid']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  bank_account_id?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Accounts_Bank_Account_Related_Accounts_Min_Fields = {
  __typename?: 'accounts_bank_account_related_accounts_min_fields';
  account_id?: Maybe<Scalars['String']['output']>;
  bank_account_id?: Maybe<Scalars['uuid']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  bank_account_id?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Mutation_Response = {
  __typename?: 'accounts_bank_account_related_accounts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts_Bank_Account_Related_Accounts>;
};

/** on_conflict condition type for table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_On_Conflict = {
  constraint: Accounts_Bank_Account_Related_Accounts_Constraint;
  update_columns?: Array<Accounts_Bank_Account_Related_Accounts_Update_Column>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts.bank_account_related_accounts". */
export type Accounts_Bank_Account_Related_Accounts_Order_By = {
  account?: InputMaybe<Accounts_Account_Order_By>;
  account_id?: InputMaybe<Order_By>;
  bank_account?: InputMaybe<Accounts_Bank_Account_Order_By>;
  bank_account_id?: InputMaybe<Order_By>;
  connector?: InputMaybe<Connectors_Connector_Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts.bank_account_related_accounts */
export type Accounts_Bank_Account_Related_Accounts_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "accounts.bank_account_related_accounts" */
export enum Accounts_Bank_Account_Related_Accounts_Select_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  BankAccountId = 'bank_account_id',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
}

/** input type for updating data in table "accounts.bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Set_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  bank_account_id?: InputMaybe<Scalars['uuid']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "accounts_bank_account_related_accounts" */
export type Accounts_Bank_Account_Related_Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Bank_Account_Related_Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Bank_Account_Related_Accounts_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  bank_account_id?: InputMaybe<Scalars['uuid']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "accounts.bank_account_related_accounts" */
export enum Accounts_Bank_Account_Related_Accounts_Update_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  BankAccountId = 'bank_account_id',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
}

export type Accounts_Bank_Account_Related_Accounts_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Bank_Account_Related_Accounts_Bool_Exp;
};

/** select columns of table "accounts.bank_account" */
export enum Accounts_Bank_Account_Select_Column {
  /** column name */
  AccountNumber = 'account_number',
  /** column name */
  Country = 'country',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Iban = 'iban',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Name = 'name',
  /** column name */
  SwiftBicCode = 'swift_bic_code',
}

/** input type for updating data in table "accounts.bank_account" */
export type Accounts_Bank_Account_Set_Input = {
  account_number?: InputMaybe<Scalars['bytea']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  iban?: InputMaybe<Scalars['bytea']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  swift_bic_code?: InputMaybe<Scalars['bytea']['input']>;
};

/** Streaming cursor of the table "accounts_bank_account" */
export type Accounts_Bank_Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Bank_Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Bank_Account_Stream_Cursor_Value_Input = {
  account_number?: InputMaybe<Scalars['bytea']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  iban?: InputMaybe<Scalars['bytea']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  swift_bic_code?: InputMaybe<Scalars['bytea']['input']>;
};

/** update columns of table "accounts.bank_account" */
export enum Accounts_Bank_Account_Update_Column {
  /** column name */
  AccountNumber = 'account_number',
  /** column name */
  Country = 'country',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Iban = 'iban',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Name = 'name',
  /** column name */
  SwiftBicCode = 'swift_bic_code',
}

export type Accounts_Bank_Account_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Accounts_Bank_Account_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Accounts_Bank_Account_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Accounts_Bank_Account_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Accounts_Bank_Account_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Accounts_Bank_Account_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Bank_Account_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Bank_Account_Bool_Exp;
};

/** columns and relationships of "accounts.pool_accounts" */
export type Accounts_Pool_Accounts = {
  __typename?: 'accounts_pool_accounts';
  /** An object relationship */
  account: Accounts_Account;
  account_id: Scalars['String']['output'];
  /** An object relationship */
  pool: Accounts_Pools;
  pool_id: Scalars['uuid']['output'];
};

/** aggregated selection of "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Aggregate = {
  __typename?: 'accounts_pool_accounts_aggregate';
  aggregate?: Maybe<Accounts_Pool_Accounts_Aggregate_Fields>;
  nodes: Array<Accounts_Pool_Accounts>;
};

export type Accounts_Pool_Accounts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Accounts_Pool_Accounts_Aggregate_Bool_Exp_Count>;
};

export type Accounts_Pool_Accounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Aggregate_Fields = {
  __typename?: 'accounts_pool_accounts_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Accounts_Pool_Accounts_Max_Fields>;
  min?: Maybe<Accounts_Pool_Accounts_Min_Fields>;
};

/** aggregate fields of "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Accounts_Pool_Accounts_Max_Order_By>;
  min?: InputMaybe<Accounts_Pool_Accounts_Min_Order_By>;
};

/** input type for inserting array relation for remote table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Pool_Accounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Pool_Accounts_On_Conflict>;
};

/** Boolean expression to filter rows from the table "accounts.pool_accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Pool_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Pool_Accounts_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Pool_Accounts_Bool_Exp>>;
  account?: InputMaybe<Accounts_Account_Bool_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  pool?: InputMaybe<Accounts_Pools_Bool_Exp>;
  pool_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts.pool_accounts" */
export enum Accounts_Pool_Accounts_Constraint {
  /** unique or primary key constraint on columns "pool_id", "account_id" */
  PoolAccountsPk = 'pool_accounts_pk',
}

/** input type for inserting data into table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Insert_Input = {
  account?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars['String']['input']>;
  pool?: InputMaybe<Accounts_Pools_Obj_Rel_Insert_Input>;
  pool_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Accounts_Pool_Accounts_Max_Fields = {
  __typename?: 'accounts_pool_accounts_max_fields';
  account_id?: Maybe<Scalars['String']['output']>;
  pool_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  pool_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Accounts_Pool_Accounts_Min_Fields = {
  __typename?: 'accounts_pool_accounts_min_fields';
  account_id?: Maybe<Scalars['String']['output']>;
  pool_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  pool_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Mutation_Response = {
  __typename?: 'accounts_pool_accounts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts_Pool_Accounts>;
};

/** on_conflict condition type for table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_On_Conflict = {
  constraint: Accounts_Pool_Accounts_Constraint;
  update_columns?: Array<Accounts_Pool_Accounts_Update_Column>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts.pool_accounts". */
export type Accounts_Pool_Accounts_Order_By = {
  account?: InputMaybe<Accounts_Account_Order_By>;
  account_id?: InputMaybe<Order_By>;
  pool?: InputMaybe<Accounts_Pools_Order_By>;
  pool_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts.pool_accounts */
export type Accounts_Pool_Accounts_Pk_Columns_Input = {
  account_id: Scalars['String']['input'];
  pool_id: Scalars['uuid']['input'];
};

/** select columns of table "accounts.pool_accounts" */
export enum Accounts_Pool_Accounts_Select_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  PoolId = 'pool_id',
}

/** input type for updating data in table "accounts.pool_accounts" */
export type Accounts_Pool_Accounts_Set_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  pool_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "accounts_pool_accounts" */
export type Accounts_Pool_Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Pool_Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Pool_Accounts_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars['String']['input']>;
  pool_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "accounts.pool_accounts" */
export enum Accounts_Pool_Accounts_Update_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  PoolId = 'pool_id',
}

export type Accounts_Pool_Accounts_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Pool_Accounts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Pool_Accounts_Bool_Exp;
};

/** columns and relationships of "accounts.pools" */
export type Accounts_Pools = {
  __typename?: 'accounts_pools';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  /** An array relationship */
  pool_accounts: Array<Accounts_Pool_Accounts>;
  /** An aggregate relationship */
  pool_accounts_aggregate: Accounts_Pool_Accounts_Aggregate;
};

/** columns and relationships of "accounts.pools" */
export type Accounts_PoolsPool_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

/** columns and relationships of "accounts.pools" */
export type Accounts_PoolsPool_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

/** aggregated selection of "accounts.pools" */
export type Accounts_Pools_Aggregate = {
  __typename?: 'accounts_pools_aggregate';
  aggregate?: Maybe<Accounts_Pools_Aggregate_Fields>;
  nodes: Array<Accounts_Pools>;
};

/** aggregate fields of "accounts.pools" */
export type Accounts_Pools_Aggregate_Fields = {
  __typename?: 'accounts_pools_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Accounts_Pools_Max_Fields>;
  min?: Maybe<Accounts_Pools_Min_Fields>;
};

/** aggregate fields of "accounts.pools" */
export type Accounts_Pools_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Pools_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "accounts.pools". All fields are combined with a logical 'AND'. */
export type Accounts_Pools_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Pools_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Pools_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Pools_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  pool_accounts?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
  pool_accounts_aggregate?: InputMaybe<Accounts_Pool_Accounts_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "accounts.pools" */
export enum Accounts_Pools_Constraint {
  /** unique or primary key constraint on columns "name" */
  PoolsNameKey = 'pools_name_key',
  /** unique or primary key constraint on columns "id" */
  PoolsPk = 'pools_pk',
}

/** input type for inserting data into table "accounts.pools" */
export type Accounts_Pools_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pool_accounts?: InputMaybe<Accounts_Pool_Accounts_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Accounts_Pools_Max_Fields = {
  __typename?: 'accounts_pools_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Accounts_Pools_Min_Fields = {
  __typename?: 'accounts_pools_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "accounts.pools" */
export type Accounts_Pools_Mutation_Response = {
  __typename?: 'accounts_pools_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts_Pools>;
};

/** input type for inserting object relation for remote table "accounts.pools" */
export type Accounts_Pools_Obj_Rel_Insert_Input = {
  data: Accounts_Pools_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_Pools_On_Conflict>;
};

/** on_conflict condition type for table "accounts.pools" */
export type Accounts_Pools_On_Conflict = {
  constraint: Accounts_Pools_Constraint;
  update_columns?: Array<Accounts_Pools_Update_Column>;
  where?: InputMaybe<Accounts_Pools_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts.pools". */
export type Accounts_Pools_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  pool_accounts_aggregate?: InputMaybe<Accounts_Pool_Accounts_Aggregate_Order_By>;
};

/** primary key columns input for table: accounts.pools */
export type Accounts_Pools_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "accounts.pools" */
export enum Accounts_Pools_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "accounts.pools" */
export type Accounts_Pools_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "accounts_pools" */
export type Accounts_Pools_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Pools_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Pools_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "accounts.pools" */
export enum Accounts_Pools_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Accounts_Pools_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Pools_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Pools_Bool_Exp;
};

/** columns and relationships of "areas" */
export type Areas = {
  __typename?: 'areas';
  /** An object relationship */
  city: Cities;
  city_id: Scalars['Int']['output'];
  created_at: Scalars['timestamp']['output'];
  /** An object relationship */
  governorate: Governorates;
  governorate_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  mc_id: Scalars['Int']['output'];
  name_ar: Scalars['String']['output'];
  name_en: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** aggregated selection of "areas" */
export type Areas_Aggregate = {
  __typename?: 'areas_aggregate';
  aggregate?: Maybe<Areas_Aggregate_Fields>;
  nodes: Array<Areas>;
};

export type Areas_Aggregate_Bool_Exp = {
  count?: InputMaybe<Areas_Aggregate_Bool_Exp_Count>;
};

export type Areas_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Areas_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Areas_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "areas" */
export type Areas_Aggregate_Fields = {
  __typename?: 'areas_aggregate_fields';
  avg?: Maybe<Areas_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Areas_Max_Fields>;
  min?: Maybe<Areas_Min_Fields>;
  stddev?: Maybe<Areas_Stddev_Fields>;
  stddev_pop?: Maybe<Areas_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Areas_Stddev_Samp_Fields>;
  sum?: Maybe<Areas_Sum_Fields>;
  var_pop?: Maybe<Areas_Var_Pop_Fields>;
  var_samp?: Maybe<Areas_Var_Samp_Fields>;
  variance?: Maybe<Areas_Variance_Fields>;
};

/** aggregate fields of "areas" */
export type Areas_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Areas_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "areas" */
export type Areas_Aggregate_Order_By = {
  avg?: InputMaybe<Areas_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Areas_Max_Order_By>;
  min?: InputMaybe<Areas_Min_Order_By>;
  stddev?: InputMaybe<Areas_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Areas_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Areas_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Areas_Sum_Order_By>;
  var_pop?: InputMaybe<Areas_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Areas_Var_Samp_Order_By>;
  variance?: InputMaybe<Areas_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "areas" */
export type Areas_Arr_Rel_Insert_Input = {
  data: Array<Areas_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Areas_On_Conflict>;
};

/** aggregate avg on columns */
export type Areas_Avg_Fields = {
  __typename?: 'areas_avg_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "areas" */
export type Areas_Avg_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "areas". All fields are combined with a logical 'AND'. */
export type Areas_Bool_Exp = {
  _and?: InputMaybe<Array<Areas_Bool_Exp>>;
  _not?: InputMaybe<Areas_Bool_Exp>;
  _or?: InputMaybe<Array<Areas_Bool_Exp>>;
  city?: InputMaybe<Cities_Bool_Exp>;
  city_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  governorate?: InputMaybe<Governorates_Bool_Exp>;
  governorate_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  mc_id?: InputMaybe<Int_Comparison_Exp>;
  name_ar?: InputMaybe<String_Comparison_Exp>;
  name_en?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "areas" */
export enum Areas_Constraint {
  /** unique or primary key constraint on columns "mc_id" */
  AreasMcIdKey = 'areas_mc_id_key',
  /** unique or primary key constraint on columns "id" */
  AreasPkey = 'areas_pkey',
}

/** input type for incrementing numeric columns in table "areas" */
export type Areas_Inc_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "areas" */
export type Areas_Insert_Input = {
  city?: InputMaybe<Cities_Obj_Rel_Insert_Input>;
  city_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  governorate?: InputMaybe<Governorates_Obj_Rel_Insert_Input>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Areas_Max_Fields = {
  __typename?: 'areas_max_fields';
  city_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
  name_ar?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "areas" */
export type Areas_Max_Order_By = {
  city_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Areas_Min_Fields = {
  __typename?: 'areas_min_fields';
  city_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
  name_ar?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "areas" */
export type Areas_Min_Order_By = {
  city_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "areas" */
export type Areas_Mutation_Response = {
  __typename?: 'areas_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Areas>;
};

/** input type for inserting object relation for remote table "areas" */
export type Areas_Obj_Rel_Insert_Input = {
  data: Areas_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Areas_On_Conflict>;
};

/** on_conflict condition type for table "areas" */
export type Areas_On_Conflict = {
  constraint: Areas_Constraint;
  update_columns?: Array<Areas_Update_Column>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

/** Ordering options when selecting data from "areas". */
export type Areas_Order_By = {
  city?: InputMaybe<Cities_Order_By>;
  city_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  governorate?: InputMaybe<Governorates_Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: areas */
export type Areas_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "areas" */
export enum Areas_Select_Column {
  /** column name */
  CityId = 'city_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GovernorateId = 'governorate_id',
  /** column name */
  Id = 'id',
  /** column name */
  McId = 'mc_id',
  /** column name */
  NameAr = 'name_ar',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "areas" */
export type Areas_Set_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Areas_Stddev_Fields = {
  __typename?: 'areas_stddev_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "areas" */
export type Areas_Stddev_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Areas_Stddev_Pop_Fields = {
  __typename?: 'areas_stddev_pop_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "areas" */
export type Areas_Stddev_Pop_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Areas_Stddev_Samp_Fields = {
  __typename?: 'areas_stddev_samp_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "areas" */
export type Areas_Stddev_Samp_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "areas" */
export type Areas_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Areas_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Areas_Stream_Cursor_Value_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Areas_Sum_Fields = {
  __typename?: 'areas_sum_fields';
  city_id?: Maybe<Scalars['Int']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "areas" */
export type Areas_Sum_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** update columns of table "areas" */
export enum Areas_Update_Column {
  /** column name */
  CityId = 'city_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GovernorateId = 'governorate_id',
  /** column name */
  Id = 'id',
  /** column name */
  McId = 'mc_id',
  /** column name */
  NameAr = 'name_ar',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Areas_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Areas_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Areas_Set_Input>;
  /** filter the rows which have to be updated */
  where: Areas_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Areas_Var_Pop_Fields = {
  __typename?: 'areas_var_pop_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "areas" */
export type Areas_Var_Pop_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Areas_Var_Samp_Fields = {
  __typename?: 'areas_var_samp_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "areas" */
export type Areas_Var_Samp_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Areas_Variance_Fields = {
  __typename?: 'areas_variance_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "areas" */
export type Areas_Variance_Order_By = {
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "audit_logs" */
export type Audit_Logs = {
  __typename?: 'audit_logs';
  action_time?: Maybe<Scalars['timestamp']['output']>;
  actor_id?: Maybe<Scalars['uuid']['output']>;
  actor_type?: Maybe<Scalars['String']['output']>;
  after?: Maybe<Scalars['jsonb']['output']>;
  d: Scalars['uuid']['output'];
  record_id?: Maybe<Scalars['uuid']['output']>;
};

/** columns and relationships of "audit_logs" */
export type Audit_LogsAfterArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit_logs" */
export type Audit_Logs_Aggregate = {
  __typename?: 'audit_logs_aggregate';
  aggregate?: Maybe<Audit_Logs_Aggregate_Fields>;
  nodes: Array<Audit_Logs>;
};

/** aggregate fields of "audit_logs" */
export type Audit_Logs_Aggregate_Fields = {
  __typename?: 'audit_logs_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Audit_Logs_Max_Fields>;
  min?: Maybe<Audit_Logs_Min_Fields>;
};

/** aggregate fields of "audit_logs" */
export type Audit_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Audit_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Audit_Logs_Append_Input = {
  after?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "audit_logs". All fields are combined with a logical 'AND'. */
export type Audit_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Audit_Logs_Bool_Exp>>;
  _not?: InputMaybe<Audit_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Audit_Logs_Bool_Exp>>;
  action_time?: InputMaybe<Timestamp_Comparison_Exp>;
  actor_id?: InputMaybe<Uuid_Comparison_Exp>;
  actor_type?: InputMaybe<String_Comparison_Exp>;
  after?: InputMaybe<Jsonb_Comparison_Exp>;
  d?: InputMaybe<Uuid_Comparison_Exp>;
  record_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Audit_Logs_Delete_At_Path_Input = {
  after?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Audit_Logs_Delete_Elem_Input = {
  after?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Audit_Logs_Delete_Key_Input = {
  after?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "audit_logs" */
export type Audit_Logs_Insert_Input = {
  action_time?: InputMaybe<Scalars['timestamp']['input']>;
  actor_id?: InputMaybe<Scalars['uuid']['input']>;
  actor_type?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['jsonb']['input']>;
  d?: InputMaybe<Scalars['uuid']['input']>;
  record_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Audit_Logs_Max_Fields = {
  __typename?: 'audit_logs_max_fields';
  action_time?: Maybe<Scalars['timestamp']['output']>;
  actor_id?: Maybe<Scalars['uuid']['output']>;
  actor_type?: Maybe<Scalars['String']['output']>;
  d?: Maybe<Scalars['uuid']['output']>;
  record_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Audit_Logs_Min_Fields = {
  __typename?: 'audit_logs_min_fields';
  action_time?: Maybe<Scalars['timestamp']['output']>;
  actor_id?: Maybe<Scalars['uuid']['output']>;
  actor_type?: Maybe<Scalars['String']['output']>;
  d?: Maybe<Scalars['uuid']['output']>;
  record_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "audit_logs" */
export type Audit_Logs_Mutation_Response = {
  __typename?: 'audit_logs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Audit_Logs>;
};

/** Ordering options when selecting data from "audit_logs". */
export type Audit_Logs_Order_By = {
  action_time?: InputMaybe<Order_By>;
  actor_id?: InputMaybe<Order_By>;
  actor_type?: InputMaybe<Order_By>;
  after?: InputMaybe<Order_By>;
  d?: InputMaybe<Order_By>;
  record_id?: InputMaybe<Order_By>;
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Audit_Logs_Prepend_Input = {
  after?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit_logs" */
export enum Audit_Logs_Select_Column {
  /** column name */
  ActionTime = 'action_time',
  /** column name */
  ActorId = 'actor_id',
  /** column name */
  ActorType = 'actor_type',
  /** column name */
  After = 'after',
  /** column name */
  D = 'd',
  /** column name */
  RecordId = 'record_id',
}

/** input type for updating data in table "audit_logs" */
export type Audit_Logs_Set_Input = {
  action_time?: InputMaybe<Scalars['timestamp']['input']>;
  actor_id?: InputMaybe<Scalars['uuid']['input']>;
  actor_type?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['jsonb']['input']>;
  d?: InputMaybe<Scalars['uuid']['input']>;
  record_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "audit_logs" */
export type Audit_Logs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Audit_Logs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Audit_Logs_Stream_Cursor_Value_Input = {
  action_time?: InputMaybe<Scalars['timestamp']['input']>;
  actor_id?: InputMaybe<Scalars['uuid']['input']>;
  actor_type?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['jsonb']['input']>;
  d?: InputMaybe<Scalars['uuid']['input']>;
  record_id?: InputMaybe<Scalars['uuid']['input']>;
};

export type Audit_Logs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Audit_Logs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Audit_Logs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Audit_Logs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Audit_Logs_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Audit_Logs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Audit_Logs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Audit_Logs_Bool_Exp;
};

/** Boolean expression to compare columns of type "bankname". All fields are combined with logical 'AND'. */
export type Bankname_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bankname']['input']>;
  _gt?: InputMaybe<Scalars['bankname']['input']>;
  _gte?: InputMaybe<Scalars['bankname']['input']>;
  _in?: InputMaybe<Array<Scalars['bankname']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bankname']['input']>;
  _lte?: InputMaybe<Scalars['bankname']['input']>;
  _neq?: InputMaybe<Scalars['bankname']['input']>;
  _nin?: InputMaybe<Array<Scalars['bankname']['input']>>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
export type Bytea_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bytea']['input']>;
  _gt?: InputMaybe<Scalars['bytea']['input']>;
  _gte?: InputMaybe<Scalars['bytea']['input']>;
  _in?: InputMaybe<Array<Scalars['bytea']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bytea']['input']>;
  _lte?: InputMaybe<Scalars['bytea']['input']>;
  _neq?: InputMaybe<Scalars['bytea']['input']>;
  _nin?: InputMaybe<Array<Scalars['bytea']['input']>>;
};

/** columns and relationships of "checkout_baskets" */
export type Checkout_Baskets = {
  __typename?: 'checkout_baskets';
  branch_id: Scalars['uuid']['output'];
  /** An object relationship */
  cashier?: Maybe<Partner_User_Profile>;
  cashier_id: Scalars['uuid']['output'];
  category?: Maybe<Scalars['String']['output']>;
  commercial_offers?: Maybe<Scalars['jsonb']['output']>;
  /** An object relationship */
  consumer?: Maybe<Consumers>;
  consumer_device_metadata: Scalars['jsonb']['output'];
  consumer_id: Scalars['uuid']['output'];
  created_at: Scalars['timestamp']['output'];
  gross_basket_value: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  loan?: Maybe<Loan>;
  loan_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  partner?: Maybe<Partner>;
  /** An object relationship */
  partner_branch?: Maybe<Partner_Branch>;
  partner_id: Scalars['uuid']['output'];
  products: Scalars['jsonb']['output'];
  selected_commercial_offer_id?: Maybe<Scalars['uuid']['output']>;
  /** An object relationship */
  session_basket?: Maybe<Session_Baskets>;
  session_basket_id: Scalars['uuid']['output'];
  status: Scalars['checkoutbasketstatus']['output'];
  updated_at: Scalars['timestamp']['output'];
  workflow_id?: Maybe<Scalars['uuid']['output']>;
};

/** columns and relationships of "checkout_baskets" */
export type Checkout_BasketsCommercial_OffersArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "checkout_baskets" */
export type Checkout_BasketsConsumer_Device_MetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "checkout_baskets" */
export type Checkout_BasketsProductsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "checkout_baskets" */
export type Checkout_Baskets_Aggregate = {
  __typename?: 'checkout_baskets_aggregate';
  aggregate?: Maybe<Checkout_Baskets_Aggregate_Fields>;
  nodes: Array<Checkout_Baskets>;
};

/** aggregate fields of "checkout_baskets" */
export type Checkout_Baskets_Aggregate_Fields = {
  __typename?: 'checkout_baskets_aggregate_fields';
  avg?: Maybe<Checkout_Baskets_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Checkout_Baskets_Max_Fields>;
  min?: Maybe<Checkout_Baskets_Min_Fields>;
  stddev?: Maybe<Checkout_Baskets_Stddev_Fields>;
  stddev_pop?: Maybe<Checkout_Baskets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Checkout_Baskets_Stddev_Samp_Fields>;
  sum?: Maybe<Checkout_Baskets_Sum_Fields>;
  var_pop?: Maybe<Checkout_Baskets_Var_Pop_Fields>;
  var_samp?: Maybe<Checkout_Baskets_Var_Samp_Fields>;
  variance?: Maybe<Checkout_Baskets_Variance_Fields>;
};

/** aggregate fields of "checkout_baskets" */
export type Checkout_Baskets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Checkout_Baskets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Checkout_Baskets_Append_Input = {
  commercial_offers?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_device_metadata?: InputMaybe<Scalars['jsonb']['input']>;
  products?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Checkout_Baskets_Avg_Fields = {
  __typename?: 'checkout_baskets_avg_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "checkout_baskets". All fields are combined with a logical 'AND'. */
export type Checkout_Baskets_Bool_Exp = {
  _and?: InputMaybe<Array<Checkout_Baskets_Bool_Exp>>;
  _not?: InputMaybe<Checkout_Baskets_Bool_Exp>;
  _or?: InputMaybe<Array<Checkout_Baskets_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  cashier?: InputMaybe<Partner_User_Profile_Bool_Exp>;
  cashier_id?: InputMaybe<Uuid_Comparison_Exp>;
  category?: InputMaybe<String_Comparison_Exp>;
  commercial_offers?: InputMaybe<Jsonb_Comparison_Exp>;
  consumer?: InputMaybe<Consumers_Bool_Exp>;
  consumer_device_metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  consumer_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  gross_basket_value?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  loan_id?: InputMaybe<Uuid_Comparison_Exp>;
  partner?: InputMaybe<Partner_Bool_Exp>;
  partner_branch?: InputMaybe<Partner_Branch_Bool_Exp>;
  partner_id?: InputMaybe<Uuid_Comparison_Exp>;
  products?: InputMaybe<Jsonb_Comparison_Exp>;
  selected_commercial_offer_id?: InputMaybe<Uuid_Comparison_Exp>;
  session_basket?: InputMaybe<Session_Baskets_Bool_Exp>;
  session_basket_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<Checkoutbasketstatus_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  workflow_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "checkout_baskets" */
export enum Checkout_Baskets_Constraint {
  /** unique or primary key constraint on columns "id" */
  CheckoutBasketsPkey = 'checkout_baskets_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Checkout_Baskets_Delete_At_Path_Input = {
  commercial_offers?: InputMaybe<Array<Scalars['String']['input']>>;
  consumer_device_metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  products?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Checkout_Baskets_Delete_Elem_Input = {
  commercial_offers?: InputMaybe<Scalars['Int']['input']>;
  consumer_device_metadata?: InputMaybe<Scalars['Int']['input']>;
  products?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Checkout_Baskets_Delete_Key_Input = {
  commercial_offers?: InputMaybe<Scalars['String']['input']>;
  consumer_device_metadata?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "checkout_baskets" */
export type Checkout_Baskets_Inc_Input = {
  gross_basket_value?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "checkout_baskets" */
export type Checkout_Baskets_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  cashier?: InputMaybe<Partner_User_Profile_Obj_Rel_Insert_Input>;
  cashier_id?: InputMaybe<Scalars['uuid']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  commercial_offers?: InputMaybe<Scalars['jsonb']['input']>;
  consumer?: InputMaybe<Consumers_Obj_Rel_Insert_Input>;
  consumer_device_metadata?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  gross_basket_value?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  loan_id?: InputMaybe<Scalars['uuid']['input']>;
  partner?: InputMaybe<Partner_Obj_Rel_Insert_Input>;
  partner_branch?: InputMaybe<Partner_Branch_Obj_Rel_Insert_Input>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  products?: InputMaybe<Scalars['jsonb']['input']>;
  selected_commercial_offer_id?: InputMaybe<Scalars['uuid']['input']>;
  session_basket?: InputMaybe<Session_Baskets_Obj_Rel_Insert_Input>;
  session_basket_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  workflow_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Checkout_Baskets_Max_Fields = {
  __typename?: 'checkout_baskets_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  cashier_id?: Maybe<Scalars['uuid']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  gross_basket_value?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  loan_id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  selected_commercial_offer_id?: Maybe<Scalars['uuid']['output']>;
  session_basket_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['checkoutbasketstatus']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  workflow_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Checkout_Baskets_Min_Fields = {
  __typename?: 'checkout_baskets_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  cashier_id?: Maybe<Scalars['uuid']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  gross_basket_value?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  loan_id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  selected_commercial_offer_id?: Maybe<Scalars['uuid']['output']>;
  session_basket_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['checkoutbasketstatus']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  workflow_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "checkout_baskets" */
export type Checkout_Baskets_Mutation_Response = {
  __typename?: 'checkout_baskets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Checkout_Baskets>;
};

/** input type for inserting object relation for remote table "checkout_baskets" */
export type Checkout_Baskets_Obj_Rel_Insert_Input = {
  data: Checkout_Baskets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Checkout_Baskets_On_Conflict>;
};

/** on_conflict condition type for table "checkout_baskets" */
export type Checkout_Baskets_On_Conflict = {
  constraint: Checkout_Baskets_Constraint;
  update_columns?: Array<Checkout_Baskets_Update_Column>;
  where?: InputMaybe<Checkout_Baskets_Bool_Exp>;
};

/** Ordering options when selecting data from "checkout_baskets". */
export type Checkout_Baskets_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  cashier?: InputMaybe<Partner_User_Profile_Order_By>;
  cashier_id?: InputMaybe<Order_By>;
  category?: InputMaybe<Order_By>;
  commercial_offers?: InputMaybe<Order_By>;
  consumer?: InputMaybe<Consumers_Order_By>;
  consumer_device_metadata?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  gross_basket_value?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  partner?: InputMaybe<Partner_Order_By>;
  partner_branch?: InputMaybe<Partner_Branch_Order_By>;
  partner_id?: InputMaybe<Order_By>;
  products?: InputMaybe<Order_By>;
  selected_commercial_offer_id?: InputMaybe<Order_By>;
  session_basket?: InputMaybe<Session_Baskets_Order_By>;
  session_basket_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  workflow_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: checkout_baskets */
export type Checkout_Baskets_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Checkout_Baskets_Prepend_Input = {
  commercial_offers?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_device_metadata?: InputMaybe<Scalars['jsonb']['input']>;
  products?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "checkout_baskets" */
export enum Checkout_Baskets_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  CashierId = 'cashier_id',
  /** column name */
  Category = 'category',
  /** column name */
  CommercialOffers = 'commercial_offers',
  /** column name */
  ConsumerDeviceMetadata = 'consumer_device_metadata',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GrossBasketValue = 'gross_basket_value',
  /** column name */
  Id = 'id',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  Products = 'products',
  /** column name */
  SelectedCommercialOfferId = 'selected_commercial_offer_id',
  /** column name */
  SessionBasketId = 'session_basket_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WorkflowId = 'workflow_id',
}

/** input type for updating data in table "checkout_baskets" */
export type Checkout_Baskets_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  cashier_id?: InputMaybe<Scalars['uuid']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  commercial_offers?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_device_metadata?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  gross_basket_value?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  loan_id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  products?: InputMaybe<Scalars['jsonb']['input']>;
  selected_commercial_offer_id?: InputMaybe<Scalars['uuid']['input']>;
  session_basket_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  workflow_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Checkout_Baskets_Stddev_Fields = {
  __typename?: 'checkout_baskets_stddev_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Checkout_Baskets_Stddev_Pop_Fields = {
  __typename?: 'checkout_baskets_stddev_pop_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Checkout_Baskets_Stddev_Samp_Fields = {
  __typename?: 'checkout_baskets_stddev_samp_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "checkout_baskets" */
export type Checkout_Baskets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Checkout_Baskets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Checkout_Baskets_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  cashier_id?: InputMaybe<Scalars['uuid']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  commercial_offers?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_device_metadata?: InputMaybe<Scalars['jsonb']['input']>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  gross_basket_value?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  loan_id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  products?: InputMaybe<Scalars['jsonb']['input']>;
  selected_commercial_offer_id?: InputMaybe<Scalars['uuid']['input']>;
  session_basket_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  workflow_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Checkout_Baskets_Sum_Fields = {
  __typename?: 'checkout_baskets_sum_fields';
  gross_basket_value?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "checkout_baskets" */
export enum Checkout_Baskets_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  CashierId = 'cashier_id',
  /** column name */
  Category = 'category',
  /** column name */
  CommercialOffers = 'commercial_offers',
  /** column name */
  ConsumerDeviceMetadata = 'consumer_device_metadata',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GrossBasketValue = 'gross_basket_value',
  /** column name */
  Id = 'id',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  Products = 'products',
  /** column name */
  SelectedCommercialOfferId = 'selected_commercial_offer_id',
  /** column name */
  SessionBasketId = 'session_basket_id',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WorkflowId = 'workflow_id',
}

export type Checkout_Baskets_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Checkout_Baskets_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Checkout_Baskets_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Checkout_Baskets_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Checkout_Baskets_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Checkout_Baskets_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Checkout_Baskets_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Checkout_Baskets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Checkout_Baskets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Checkout_Baskets_Var_Pop_Fields = {
  __typename?: 'checkout_baskets_var_pop_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Checkout_Baskets_Var_Samp_Fields = {
  __typename?: 'checkout_baskets_var_samp_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Checkout_Baskets_Variance_Fields = {
  __typename?: 'checkout_baskets_variance_fields';
  gross_basket_value?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "checkoutbasketstatus". All fields are combined with logical 'AND'. */
export type Checkoutbasketstatus_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  _gt?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  _gte?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  _in?: InputMaybe<Array<Scalars['checkoutbasketstatus']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  _lte?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  _neq?: InputMaybe<Scalars['checkoutbasketstatus']['input']>;
  _nin?: InputMaybe<Array<Scalars['checkoutbasketstatus']['input']>>;
};

/** columns and relationships of "cities" */
export type Cities = {
  __typename?: 'cities';
  /** An array relationship */
  areas: Array<Areas>;
  /** An aggregate relationship */
  areas_aggregate: Areas_Aggregate;
  created_at: Scalars['timestamp']['output'];
  /** An object relationship */
  governorate: Governorates;
  governorate_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  mc_id: Scalars['Int']['output'];
  name_ar: Scalars['String']['output'];
  name_en: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** columns and relationships of "cities" */
export type CitiesAreasArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

/** columns and relationships of "cities" */
export type CitiesAreas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

/** aggregated selection of "cities" */
export type Cities_Aggregate = {
  __typename?: 'cities_aggregate';
  aggregate?: Maybe<Cities_Aggregate_Fields>;
  nodes: Array<Cities>;
};

export type Cities_Aggregate_Bool_Exp = {
  count?: InputMaybe<Cities_Aggregate_Bool_Exp_Count>;
};

export type Cities_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Cities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Cities_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "cities" */
export type Cities_Aggregate_Fields = {
  __typename?: 'cities_aggregate_fields';
  avg?: Maybe<Cities_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cities_Max_Fields>;
  min?: Maybe<Cities_Min_Fields>;
  stddev?: Maybe<Cities_Stddev_Fields>;
  stddev_pop?: Maybe<Cities_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cities_Stddev_Samp_Fields>;
  sum?: Maybe<Cities_Sum_Fields>;
  var_pop?: Maybe<Cities_Var_Pop_Fields>;
  var_samp?: Maybe<Cities_Var_Samp_Fields>;
  variance?: Maybe<Cities_Variance_Fields>;
};

/** aggregate fields of "cities" */
export type Cities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "cities" */
export type Cities_Aggregate_Order_By = {
  avg?: InputMaybe<Cities_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cities_Max_Order_By>;
  min?: InputMaybe<Cities_Min_Order_By>;
  stddev?: InputMaybe<Cities_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cities_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cities_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cities_Sum_Order_By>;
  var_pop?: InputMaybe<Cities_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cities_Var_Samp_Order_By>;
  variance?: InputMaybe<Cities_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "cities" */
export type Cities_Arr_Rel_Insert_Input = {
  data: Array<Cities_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};

/** aggregate avg on columns */
export type Cities_Avg_Fields = {
  __typename?: 'cities_avg_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "cities" */
export type Cities_Avg_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cities". All fields are combined with a logical 'AND'. */
export type Cities_Bool_Exp = {
  _and?: InputMaybe<Array<Cities_Bool_Exp>>;
  _not?: InputMaybe<Cities_Bool_Exp>;
  _or?: InputMaybe<Array<Cities_Bool_Exp>>;
  areas?: InputMaybe<Areas_Bool_Exp>;
  areas_aggregate?: InputMaybe<Areas_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  governorate?: InputMaybe<Governorates_Bool_Exp>;
  governorate_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  mc_id?: InputMaybe<Int_Comparison_Exp>;
  name_ar?: InputMaybe<String_Comparison_Exp>;
  name_en?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "cities" */
export enum Cities_Constraint {
  /** unique or primary key constraint on columns "mc_id" */
  CitiesMcIdKey = 'cities_mc_id_key',
  /** unique or primary key constraint on columns "id" */
  CitiesPkey = 'cities_pkey',
}

/** input type for incrementing numeric columns in table "cities" */
export type Cities_Inc_Input = {
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "cities" */
export type Cities_Insert_Input = {
  areas?: InputMaybe<Areas_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  governorate?: InputMaybe<Governorates_Obj_Rel_Insert_Input>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Cities_Max_Fields = {
  __typename?: 'cities_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
  name_ar?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "cities" */
export type Cities_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cities_Min_Fields = {
  __typename?: 'cities_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
  name_ar?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "cities" */
export type Cities_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cities" */
export type Cities_Mutation_Response = {
  __typename?: 'cities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cities>;
};

/** input type for inserting object relation for remote table "cities" */
export type Cities_Obj_Rel_Insert_Input = {
  data: Cities_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};

/** on_conflict condition type for table "cities" */
export type Cities_On_Conflict = {
  constraint: Cities_Constraint;
  update_columns?: Array<Cities_Update_Column>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

/** Ordering options when selecting data from "cities". */
export type Cities_Order_By = {
  areas_aggregate?: InputMaybe<Areas_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  governorate?: InputMaybe<Governorates_Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cities */
export type Cities_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "cities" */
export enum Cities_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GovernorateId = 'governorate_id',
  /** column name */
  Id = 'id',
  /** column name */
  McId = 'mc_id',
  /** column name */
  NameAr = 'name_ar',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "cities" */
export type Cities_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Cities_Stddev_Fields = {
  __typename?: 'cities_stddev_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "cities" */
export type Cities_Stddev_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Cities_Stddev_Pop_Fields = {
  __typename?: 'cities_stddev_pop_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "cities" */
export type Cities_Stddev_Pop_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Cities_Stddev_Samp_Fields = {
  __typename?: 'cities_stddev_samp_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "cities" */
export type Cities_Stddev_Samp_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "cities" */
export type Cities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cities_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Cities_Sum_Fields = {
  __typename?: 'cities_sum_fields';
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "cities" */
export type Cities_Sum_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** update columns of table "cities" */
export enum Cities_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GovernorateId = 'governorate_id',
  /** column name */
  Id = 'id',
  /** column name */
  McId = 'mc_id',
  /** column name */
  NameAr = 'name_ar',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Cities_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cities_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cities_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cities_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cities_Var_Pop_Fields = {
  __typename?: 'cities_var_pop_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "cities" */
export type Cities_Var_Pop_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Cities_Var_Samp_Fields = {
  __typename?: 'cities_var_samp_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "cities" */
export type Cities_Var_Samp_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Cities_Variance_Fields = {
  __typename?: 'cities_variance_fields';
  governorate_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "cities" */
export type Cities_Variance_Order_By = {
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "command" */
export type Command = {
  __typename?: 'command';
  command_type: Scalars['String']['output'];
  consumer_id: Scalars['String']['output'];
  correlation_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** An array relationship */
  entries: Array<Entry>;
  /** An aggregate relationship */
  entries_aggregate: Entry_Aggregate;
  id: Scalars['Int']['output'];
};

/** columns and relationships of "command" */
export type CommandEntriesArgs = {
  distinct_on?: InputMaybe<Array<Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Entry_Order_By>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

/** columns and relationships of "command" */
export type CommandEntries_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Entry_Order_By>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

/** aggregated selection of "command" */
export type Command_Aggregate = {
  __typename?: 'command_aggregate';
  aggregate?: Maybe<Command_Aggregate_Fields>;
  nodes: Array<Command>;
};

/** aggregate fields of "command" */
export type Command_Aggregate_Fields = {
  __typename?: 'command_aggregate_fields';
  avg?: Maybe<Command_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Command_Max_Fields>;
  min?: Maybe<Command_Min_Fields>;
  stddev?: Maybe<Command_Stddev_Fields>;
  stddev_pop?: Maybe<Command_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Command_Stddev_Samp_Fields>;
  sum?: Maybe<Command_Sum_Fields>;
  var_pop?: Maybe<Command_Var_Pop_Fields>;
  var_samp?: Maybe<Command_Var_Samp_Fields>;
  variance?: Maybe<Command_Variance_Fields>;
};

/** aggregate fields of "command" */
export type Command_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Command_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Command_Avg_Fields = {
  __typename?: 'command_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "command". All fields are combined with a logical 'AND'. */
export type Command_Bool_Exp = {
  _and?: InputMaybe<Array<Command_Bool_Exp>>;
  _not?: InputMaybe<Command_Bool_Exp>;
  _or?: InputMaybe<Array<Command_Bool_Exp>>;
  command_type?: InputMaybe<String_Comparison_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  correlation_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  entries?: InputMaybe<Entry_Bool_Exp>;
  entries_aggregate?: InputMaybe<Entry_Aggregate_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "command" */
export enum Command_Constraint {
  /** unique or primary key constraint on columns "id" */
  CommandPkey = 'command_pkey',
}

/** input type for incrementing numeric columns in table "command" */
export type Command_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "command" */
export type Command_Insert_Input = {
  command_type?: InputMaybe<Scalars['String']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  entries?: InputMaybe<Entry_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Command_Max_Fields = {
  __typename?: 'command_max_fields';
  command_type?: Maybe<Scalars['String']['output']>;
  consumer_id?: Maybe<Scalars['String']['output']>;
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Command_Min_Fields = {
  __typename?: 'command_min_fields';
  command_type?: Maybe<Scalars['String']['output']>;
  consumer_id?: Maybe<Scalars['String']['output']>;
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "command" */
export type Command_Mutation_Response = {
  __typename?: 'command_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Command>;
};

/** input type for inserting object relation for remote table "command" */
export type Command_Obj_Rel_Insert_Input = {
  data: Command_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Command_On_Conflict>;
};

/** on_conflict condition type for table "command" */
export type Command_On_Conflict = {
  constraint: Command_Constraint;
  update_columns?: Array<Command_Update_Column>;
  where?: InputMaybe<Command_Bool_Exp>;
};

/** Ordering options when selecting data from "command". */
export type Command_Order_By = {
  command_type?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  correlation_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  entries_aggregate?: InputMaybe<Entry_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: command */
export type Command_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "command" */
export enum Command_Select_Column {
  /** column name */
  CommandType = 'command_type',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
}

/** input type for updating data in table "command" */
export type Command_Set_Input = {
  command_type?: InputMaybe<Scalars['String']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Command_Stddev_Fields = {
  __typename?: 'command_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Command_Stddev_Pop_Fields = {
  __typename?: 'command_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Command_Stddev_Samp_Fields = {
  __typename?: 'command_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "command" */
export type Command_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Command_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Command_Stream_Cursor_Value_Input = {
  command_type?: InputMaybe<Scalars['String']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Command_Sum_Fields = {
  __typename?: 'command_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "command" */
export enum Command_Update_Column {
  /** column name */
  CommandType = 'command_type',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
}

export type Command_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Command_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Command_Set_Input>;
  /** filter the rows which have to be updated */
  where: Command_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Command_Var_Pop_Fields = {
  __typename?: 'command_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Command_Var_Samp_Fields = {
  __typename?: 'command_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Command_Variance_Fields = {
  __typename?: 'command_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "commercial_offer" */
export type Commercial_Offer = {
  __typename?: 'commercial_offer';
  admin_fee: Scalars['bigint']['output'];
  annual_interest_percentage: Scalars['String']['output'];
  basket_id: Scalars['String']['output'];
  consumer_accepted_at?: Maybe<Scalars['timestamptz']['output']>;
  consumer_id: Scalars['String']['output'];
  down_payment: Scalars['bigint']['output'];
  financed_amount: Scalars['bigint']['output'];
  financial_product_key: Scalars['String']['output'];
  financial_product_version: Scalars['String']['output'];
  id: Scalars['String']['output'];
  interest_rate_per_tenure: Scalars['String']['output'];
  merchant_acccepted_at?: Maybe<Scalars['timestamptz']['output']>;
  monthly_instalment: Scalars['bigint']['output'];
  tenure: Scalars['String']['output'];
  total_amount: Scalars['bigint']['output'];
};

/** aggregated selection of "commercial_offer" */
export type Commercial_Offer_Aggregate = {
  __typename?: 'commercial_offer_aggregate';
  aggregate?: Maybe<Commercial_Offer_Aggregate_Fields>;
  nodes: Array<Commercial_Offer>;
};

/** aggregate fields of "commercial_offer" */
export type Commercial_Offer_Aggregate_Fields = {
  __typename?: 'commercial_offer_aggregate_fields';
  avg?: Maybe<Commercial_Offer_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Commercial_Offer_Max_Fields>;
  min?: Maybe<Commercial_Offer_Min_Fields>;
  stddev?: Maybe<Commercial_Offer_Stddev_Fields>;
  stddev_pop?: Maybe<Commercial_Offer_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Commercial_Offer_Stddev_Samp_Fields>;
  sum?: Maybe<Commercial_Offer_Sum_Fields>;
  var_pop?: Maybe<Commercial_Offer_Var_Pop_Fields>;
  var_samp?: Maybe<Commercial_Offer_Var_Samp_Fields>;
  variance?: Maybe<Commercial_Offer_Variance_Fields>;
};

/** aggregate fields of "commercial_offer" */
export type Commercial_Offer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Commercial_Offer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Commercial_Offer_Avg_Fields = {
  __typename?: 'commercial_offer_avg_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "commercial_offer". All fields are combined with a logical 'AND'. */
export type Commercial_Offer_Bool_Exp = {
  _and?: InputMaybe<Array<Commercial_Offer_Bool_Exp>>;
  _not?: InputMaybe<Commercial_Offer_Bool_Exp>;
  _or?: InputMaybe<Array<Commercial_Offer_Bool_Exp>>;
  admin_fee?: InputMaybe<Bigint_Comparison_Exp>;
  annual_interest_percentage?: InputMaybe<String_Comparison_Exp>;
  basket_id?: InputMaybe<String_Comparison_Exp>;
  consumer_accepted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  down_payment?: InputMaybe<Bigint_Comparison_Exp>;
  financed_amount?: InputMaybe<Bigint_Comparison_Exp>;
  financial_product_key?: InputMaybe<String_Comparison_Exp>;
  financial_product_version?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  interest_rate_per_tenure?: InputMaybe<String_Comparison_Exp>;
  merchant_acccepted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  monthly_instalment?: InputMaybe<Bigint_Comparison_Exp>;
  tenure?: InputMaybe<String_Comparison_Exp>;
  total_amount?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "commercial_offer" */
export enum Commercial_Offer_Constraint {
  /** unique or primary key constraint on columns "id" */
  CommercialOfferPkey = 'commercial_offer_pkey',
}

/** input type for incrementing numeric columns in table "commercial_offer" */
export type Commercial_Offer_Inc_Input = {
  admin_fee?: InputMaybe<Scalars['bigint']['input']>;
  down_payment?: InputMaybe<Scalars['bigint']['input']>;
  financed_amount?: InputMaybe<Scalars['bigint']['input']>;
  monthly_instalment?: InputMaybe<Scalars['bigint']['input']>;
  total_amount?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "commercial_offer" */
export type Commercial_Offer_Insert_Input = {
  admin_fee?: InputMaybe<Scalars['bigint']['input']>;
  annual_interest_percentage?: InputMaybe<Scalars['String']['input']>;
  basket_id?: InputMaybe<Scalars['String']['input']>;
  consumer_accepted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  down_payment?: InputMaybe<Scalars['bigint']['input']>;
  financed_amount?: InputMaybe<Scalars['bigint']['input']>;
  financial_product_key?: InputMaybe<Scalars['String']['input']>;
  financial_product_version?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  interest_rate_per_tenure?: InputMaybe<Scalars['String']['input']>;
  merchant_acccepted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  monthly_instalment?: InputMaybe<Scalars['bigint']['input']>;
  tenure?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Commercial_Offer_Max_Fields = {
  __typename?: 'commercial_offer_max_fields';
  admin_fee?: Maybe<Scalars['bigint']['output']>;
  annual_interest_percentage?: Maybe<Scalars['String']['output']>;
  basket_id?: Maybe<Scalars['String']['output']>;
  consumer_accepted_at?: Maybe<Scalars['timestamptz']['output']>;
  consumer_id?: Maybe<Scalars['String']['output']>;
  down_payment?: Maybe<Scalars['bigint']['output']>;
  financed_amount?: Maybe<Scalars['bigint']['output']>;
  financial_product_key?: Maybe<Scalars['String']['output']>;
  financial_product_version?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  interest_rate_per_tenure?: Maybe<Scalars['String']['output']>;
  merchant_acccepted_at?: Maybe<Scalars['timestamptz']['output']>;
  monthly_instalment?: Maybe<Scalars['bigint']['output']>;
  tenure?: Maybe<Scalars['String']['output']>;
  total_amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Commercial_Offer_Min_Fields = {
  __typename?: 'commercial_offer_min_fields';
  admin_fee?: Maybe<Scalars['bigint']['output']>;
  annual_interest_percentage?: Maybe<Scalars['String']['output']>;
  basket_id?: Maybe<Scalars['String']['output']>;
  consumer_accepted_at?: Maybe<Scalars['timestamptz']['output']>;
  consumer_id?: Maybe<Scalars['String']['output']>;
  down_payment?: Maybe<Scalars['bigint']['output']>;
  financed_amount?: Maybe<Scalars['bigint']['output']>;
  financial_product_key?: Maybe<Scalars['String']['output']>;
  financial_product_version?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  interest_rate_per_tenure?: Maybe<Scalars['String']['output']>;
  merchant_acccepted_at?: Maybe<Scalars['timestamptz']['output']>;
  monthly_instalment?: Maybe<Scalars['bigint']['output']>;
  tenure?: Maybe<Scalars['String']['output']>;
  total_amount?: Maybe<Scalars['bigint']['output']>;
};

/** response of any mutation on the table "commercial_offer" */
export type Commercial_Offer_Mutation_Response = {
  __typename?: 'commercial_offer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Commercial_Offer>;
};

/** on_conflict condition type for table "commercial_offer" */
export type Commercial_Offer_On_Conflict = {
  constraint: Commercial_Offer_Constraint;
  update_columns?: Array<Commercial_Offer_Update_Column>;
  where?: InputMaybe<Commercial_Offer_Bool_Exp>;
};

/** Ordering options when selecting data from "commercial_offer". */
export type Commercial_Offer_Order_By = {
  admin_fee?: InputMaybe<Order_By>;
  annual_interest_percentage?: InputMaybe<Order_By>;
  basket_id?: InputMaybe<Order_By>;
  consumer_accepted_at?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  down_payment?: InputMaybe<Order_By>;
  financed_amount?: InputMaybe<Order_By>;
  financial_product_key?: InputMaybe<Order_By>;
  financial_product_version?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  interest_rate_per_tenure?: InputMaybe<Order_By>;
  merchant_acccepted_at?: InputMaybe<Order_By>;
  monthly_instalment?: InputMaybe<Order_By>;
  tenure?: InputMaybe<Order_By>;
  total_amount?: InputMaybe<Order_By>;
};

/** primary key columns input for table: commercial_offer */
export type Commercial_Offer_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "commercial_offer" */
export enum Commercial_Offer_Select_Column {
  /** column name */
  AdminFee = 'admin_fee',
  /** column name */
  AnnualInterestPercentage = 'annual_interest_percentage',
  /** column name */
  BasketId = 'basket_id',
  /** column name */
  ConsumerAcceptedAt = 'consumer_accepted_at',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  DownPayment = 'down_payment',
  /** column name */
  FinancedAmount = 'financed_amount',
  /** column name */
  FinancialProductKey = 'financial_product_key',
  /** column name */
  FinancialProductVersion = 'financial_product_version',
  /** column name */
  Id = 'id',
  /** column name */
  InterestRatePerTenure = 'interest_rate_per_tenure',
  /** column name */
  MerchantAccceptedAt = 'merchant_acccepted_at',
  /** column name */
  MonthlyInstalment = 'monthly_instalment',
  /** column name */
  Tenure = 'tenure',
  /** column name */
  TotalAmount = 'total_amount',
}

/** input type for updating data in table "commercial_offer" */
export type Commercial_Offer_Set_Input = {
  admin_fee?: InputMaybe<Scalars['bigint']['input']>;
  annual_interest_percentage?: InputMaybe<Scalars['String']['input']>;
  basket_id?: InputMaybe<Scalars['String']['input']>;
  consumer_accepted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  down_payment?: InputMaybe<Scalars['bigint']['input']>;
  financed_amount?: InputMaybe<Scalars['bigint']['input']>;
  financial_product_key?: InputMaybe<Scalars['String']['input']>;
  financial_product_version?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  interest_rate_per_tenure?: InputMaybe<Scalars['String']['input']>;
  merchant_acccepted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  monthly_instalment?: InputMaybe<Scalars['bigint']['input']>;
  tenure?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Commercial_Offer_Stddev_Fields = {
  __typename?: 'commercial_offer_stddev_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Commercial_Offer_Stddev_Pop_Fields = {
  __typename?: 'commercial_offer_stddev_pop_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Commercial_Offer_Stddev_Samp_Fields = {
  __typename?: 'commercial_offer_stddev_samp_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "commercial_offer" */
export type Commercial_Offer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Commercial_Offer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Commercial_Offer_Stream_Cursor_Value_Input = {
  admin_fee?: InputMaybe<Scalars['bigint']['input']>;
  annual_interest_percentage?: InputMaybe<Scalars['String']['input']>;
  basket_id?: InputMaybe<Scalars['String']['input']>;
  consumer_accepted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  down_payment?: InputMaybe<Scalars['bigint']['input']>;
  financed_amount?: InputMaybe<Scalars['bigint']['input']>;
  financial_product_key?: InputMaybe<Scalars['String']['input']>;
  financial_product_version?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  interest_rate_per_tenure?: InputMaybe<Scalars['String']['input']>;
  merchant_acccepted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  monthly_instalment?: InputMaybe<Scalars['bigint']['input']>;
  tenure?: InputMaybe<Scalars['String']['input']>;
  total_amount?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Commercial_Offer_Sum_Fields = {
  __typename?: 'commercial_offer_sum_fields';
  admin_fee?: Maybe<Scalars['bigint']['output']>;
  down_payment?: Maybe<Scalars['bigint']['output']>;
  financed_amount?: Maybe<Scalars['bigint']['output']>;
  monthly_instalment?: Maybe<Scalars['bigint']['output']>;
  total_amount?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "commercial_offer" */
export enum Commercial_Offer_Update_Column {
  /** column name */
  AdminFee = 'admin_fee',
  /** column name */
  AnnualInterestPercentage = 'annual_interest_percentage',
  /** column name */
  BasketId = 'basket_id',
  /** column name */
  ConsumerAcceptedAt = 'consumer_accepted_at',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  DownPayment = 'down_payment',
  /** column name */
  FinancedAmount = 'financed_amount',
  /** column name */
  FinancialProductKey = 'financial_product_key',
  /** column name */
  FinancialProductVersion = 'financial_product_version',
  /** column name */
  Id = 'id',
  /** column name */
  InterestRatePerTenure = 'interest_rate_per_tenure',
  /** column name */
  MerchantAccceptedAt = 'merchant_acccepted_at',
  /** column name */
  MonthlyInstalment = 'monthly_instalment',
  /** column name */
  Tenure = 'tenure',
  /** column name */
  TotalAmount = 'total_amount',
}

export type Commercial_Offer_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Commercial_Offer_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Commercial_Offer_Set_Input>;
  /** filter the rows which have to be updated */
  where: Commercial_Offer_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Commercial_Offer_Var_Pop_Fields = {
  __typename?: 'commercial_offer_var_pop_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Commercial_Offer_Var_Samp_Fields = {
  __typename?: 'commercial_offer_var_samp_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Commercial_Offer_Variance_Fields = {
  __typename?: 'commercial_offer_variance_fields';
  admin_fee?: Maybe<Scalars['Float']['output']>;
  down_payment?: Maybe<Scalars['Float']['output']>;
  financed_amount?: Maybe<Scalars['Float']['output']>;
  monthly_instalment?: Maybe<Scalars['Float']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "connector_provider". All fields are combined with logical 'AND'. */
export type Connector_Provider_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['connector_provider']['input']>;
  _gt?: InputMaybe<Scalars['connector_provider']['input']>;
  _gte?: InputMaybe<Scalars['connector_provider']['input']>;
  _in?: InputMaybe<Array<Scalars['connector_provider']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['connector_provider']['input']>;
  _lte?: InputMaybe<Scalars['connector_provider']['input']>;
  _neq?: InputMaybe<Scalars['connector_provider']['input']>;
  _nin?: InputMaybe<Array<Scalars['connector_provider']['input']>>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_Connector = {
  __typename?: 'connectors_connector';
  /** An array relationship */
  accounts: Array<Accounts_Account>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Account_Aggregate;
  /** An array relationship */
  bank_account_related_accounts: Array<Accounts_Bank_Account_Related_Accounts>;
  /** An aggregate relationship */
  bank_account_related_accounts_aggregate: Accounts_Bank_Account_Related_Accounts_Aggregate;
  config?: Maybe<Scalars['bytea']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** An array relationship */
  payments: Array<Payments_Payment>;
  /** An aggregate relationship */
  payments_aggregate: Payments_Payment_Aggregate;
  provider: Scalars['connector_provider']['output'];
  /** An array relationship */
  transfer_initiations: Array<Transfers_Transfer_Initiation>;
  /** An aggregate relationship */
  transfer_initiations_aggregate: Transfers_Transfer_Initiation_Aggregate;
  /** An array relationship */
  transfer_reversals: Array<Transfers_Transfer_Reversal>;
  /** An aggregate relationship */
  transfer_reversals_aggregate: Transfers_Transfer_Reversal_Aggregate;
  /** An array relationship */
  webhooks: Array<Connectors_Webhook>;
  /** An aggregate relationship */
  webhooks_aggregate: Connectors_Webhook_Aggregate;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Account_Order_By>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Account_Order_By>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorBank_Account_Related_AccountsArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorBank_Account_Related_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorPaymentsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorPayments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorTransfer_InitiationsArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorTransfer_Initiations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorTransfer_ReversalsArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorTransfer_Reversals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorWebhooksArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Webhook_Order_By>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

/** columns and relationships of "connectors.connector" */
export type Connectors_ConnectorWebhooks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Webhook_Order_By>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

/** aggregated selection of "connectors.connector" */
export type Connectors_Connector_Aggregate = {
  __typename?: 'connectors_connector_aggregate';
  aggregate?: Maybe<Connectors_Connector_Aggregate_Fields>;
  nodes: Array<Connectors_Connector>;
};

/** aggregate fields of "connectors.connector" */
export type Connectors_Connector_Aggregate_Fields = {
  __typename?: 'connectors_connector_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Connectors_Connector_Max_Fields>;
  min?: Maybe<Connectors_Connector_Min_Fields>;
};

/** aggregate fields of "connectors.connector" */
export type Connectors_Connector_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Connectors_Connector_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "connectors.connector". All fields are combined with a logical 'AND'. */
export type Connectors_Connector_Bool_Exp = {
  _and?: InputMaybe<Array<Connectors_Connector_Bool_Exp>>;
  _not?: InputMaybe<Connectors_Connector_Bool_Exp>;
  _or?: InputMaybe<Array<Connectors_Connector_Bool_Exp>>;
  accounts?: InputMaybe<Accounts_Account_Bool_Exp>;
  accounts_aggregate?: InputMaybe<Accounts_Account_Aggregate_Bool_Exp>;
  bank_account_related_accounts?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  bank_account_related_accounts_aggregate?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Bool_Exp>;
  config?: InputMaybe<Bytea_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  payments?: InputMaybe<Payments_Payment_Bool_Exp>;
  payments_aggregate?: InputMaybe<Payments_Payment_Aggregate_Bool_Exp>;
  provider?: InputMaybe<Connector_Provider_Comparison_Exp>;
  transfer_initiations?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  transfer_initiations_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Bool_Exp>;
  transfer_reversals?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
  transfer_reversals_aggregate?: InputMaybe<Transfers_Transfer_Reversal_Aggregate_Bool_Exp>;
  webhooks?: InputMaybe<Connectors_Webhook_Bool_Exp>;
  webhooks_aggregate?: InputMaybe<Connectors_Webhook_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "connectors.connector" */
export enum Connectors_Connector_Constraint {
  /** unique or primary key constraint on columns "name" */
  ConnectorV2NameKey = 'connector_v2_name_key',
  /** unique or primary key constraint on columns "id" */
  ConnectorV2Pk = 'connector_v2_pk',
}

/** input type for inserting data into table "connectors.connector" */
export type Connectors_Connector_Insert_Input = {
  accounts?: InputMaybe<Accounts_Account_Arr_Rel_Insert_Input>;
  bank_account_related_accounts?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Arr_Rel_Insert_Input>;
  config?: InputMaybe<Scalars['bytea']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payments?: InputMaybe<Payments_Payment_Arr_Rel_Insert_Input>;
  provider?: InputMaybe<Scalars['connector_provider']['input']>;
  transfer_initiations?: InputMaybe<Transfers_Transfer_Initiation_Arr_Rel_Insert_Input>;
  transfer_reversals?: InputMaybe<Transfers_Transfer_Reversal_Arr_Rel_Insert_Input>;
  webhooks?: InputMaybe<Connectors_Webhook_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Connectors_Connector_Max_Fields = {
  __typename?: 'connectors_connector_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['connector_provider']['output']>;
};

/** aggregate min on columns */
export type Connectors_Connector_Min_Fields = {
  __typename?: 'connectors_connector_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['connector_provider']['output']>;
};

/** response of any mutation on the table "connectors.connector" */
export type Connectors_Connector_Mutation_Response = {
  __typename?: 'connectors_connector_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Connectors_Connector>;
};

/** input type for inserting object relation for remote table "connectors.connector" */
export type Connectors_Connector_Obj_Rel_Insert_Input = {
  data: Connectors_Connector_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Connectors_Connector_On_Conflict>;
};

/** on_conflict condition type for table "connectors.connector" */
export type Connectors_Connector_On_Conflict = {
  constraint: Connectors_Connector_Constraint;
  update_columns?: Array<Connectors_Connector_Update_Column>;
  where?: InputMaybe<Connectors_Connector_Bool_Exp>;
};

/** Ordering options when selecting data from "connectors.connector". */
export type Connectors_Connector_Order_By = {
  accounts_aggregate?: InputMaybe<Accounts_Account_Aggregate_Order_By>;
  bank_account_related_accounts_aggregate?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Aggregate_Order_By>;
  config?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  payments_aggregate?: InputMaybe<Payments_Payment_Aggregate_Order_By>;
  provider?: InputMaybe<Order_By>;
  transfer_initiations_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Order_By>;
  transfer_reversals_aggregate?: InputMaybe<Transfers_Transfer_Reversal_Aggregate_Order_By>;
  webhooks_aggregate?: InputMaybe<Connectors_Webhook_Aggregate_Order_By>;
};

/** primary key columns input for table: connectors.connector */
export type Connectors_Connector_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "connectors.connector" */
export enum Connectors_Connector_Select_Column {
  /** column name */
  Config = 'config',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Provider = 'provider',
}

/** input type for updating data in table "connectors.connector" */
export type Connectors_Connector_Set_Input = {
  config?: InputMaybe<Scalars['bytea']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['connector_provider']['input']>;
};

/** Streaming cursor of the table "connectors_connector" */
export type Connectors_Connector_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Connectors_Connector_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Connectors_Connector_Stream_Cursor_Value_Input = {
  config?: InputMaybe<Scalars['bytea']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['connector_provider']['input']>;
};

/** update columns of table "connectors.connector" */
export enum Connectors_Connector_Update_Column {
  /** column name */
  Config = 'config',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Provider = 'provider',
}

export type Connectors_Connector_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Connectors_Connector_Set_Input>;
  /** filter the rows which have to be updated */
  where: Connectors_Connector_Bool_Exp;
};

/** columns and relationships of "connectors.webhook" */
export type Connectors_Webhook = {
  __typename?: 'connectors_webhook';
  /** An object relationship */
  connector: Connectors_Connector;
  connector_id: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  request_body: Scalars['bytea']['output'];
};

/** aggregated selection of "connectors.webhook" */
export type Connectors_Webhook_Aggregate = {
  __typename?: 'connectors_webhook_aggregate';
  aggregate?: Maybe<Connectors_Webhook_Aggregate_Fields>;
  nodes: Array<Connectors_Webhook>;
};

export type Connectors_Webhook_Aggregate_Bool_Exp = {
  count?: InputMaybe<Connectors_Webhook_Aggregate_Bool_Exp_Count>;
};

export type Connectors_Webhook_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Connectors_Webhook_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "connectors.webhook" */
export type Connectors_Webhook_Aggregate_Fields = {
  __typename?: 'connectors_webhook_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Connectors_Webhook_Max_Fields>;
  min?: Maybe<Connectors_Webhook_Min_Fields>;
};

/** aggregate fields of "connectors.webhook" */
export type Connectors_Webhook_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "connectors.webhook" */
export type Connectors_Webhook_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Connectors_Webhook_Max_Order_By>;
  min?: InputMaybe<Connectors_Webhook_Min_Order_By>;
};

/** input type for inserting array relation for remote table "connectors.webhook" */
export type Connectors_Webhook_Arr_Rel_Insert_Input = {
  data: Array<Connectors_Webhook_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Connectors_Webhook_On_Conflict>;
};

/** Boolean expression to filter rows from the table "connectors.webhook". All fields are combined with a logical 'AND'. */
export type Connectors_Webhook_Bool_Exp = {
  _and?: InputMaybe<Array<Connectors_Webhook_Bool_Exp>>;
  _not?: InputMaybe<Connectors_Webhook_Bool_Exp>;
  _or?: InputMaybe<Array<Connectors_Webhook_Bool_Exp>>;
  connector?: InputMaybe<Connectors_Connector_Bool_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  request_body?: InputMaybe<Bytea_Comparison_Exp>;
};

/** unique or primary key constraints on table "connectors.webhook" */
export enum Connectors_Webhook_Constraint {
  /** unique or primary key constraint on columns "id" */
  WebhookPk = 'webhook_pk',
}

/** input type for inserting data into table "connectors.webhook" */
export type Connectors_Webhook_Insert_Input = {
  connector?: InputMaybe<Connectors_Connector_Obj_Rel_Insert_Input>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  request_body?: InputMaybe<Scalars['bytea']['input']>;
};

/** aggregate max on columns */
export type Connectors_Webhook_Max_Fields = {
  __typename?: 'connectors_webhook_max_fields';
  connector_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "connectors.webhook" */
export type Connectors_Webhook_Max_Order_By = {
  connector_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Connectors_Webhook_Min_Fields = {
  __typename?: 'connectors_webhook_min_fields';
  connector_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "connectors.webhook" */
export type Connectors_Webhook_Min_Order_By = {
  connector_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "connectors.webhook" */
export type Connectors_Webhook_Mutation_Response = {
  __typename?: 'connectors_webhook_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Connectors_Webhook>;
};

/** on_conflict condition type for table "connectors.webhook" */
export type Connectors_Webhook_On_Conflict = {
  constraint: Connectors_Webhook_Constraint;
  update_columns?: Array<Connectors_Webhook_Update_Column>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

/** Ordering options when selecting data from "connectors.webhook". */
export type Connectors_Webhook_Order_By = {
  connector?: InputMaybe<Connectors_Connector_Order_By>;
  connector_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  request_body?: InputMaybe<Order_By>;
};

/** primary key columns input for table: connectors.webhook */
export type Connectors_Webhook_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "connectors.webhook" */
export enum Connectors_Webhook_Select_Column {
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  Id = 'id',
  /** column name */
  RequestBody = 'request_body',
}

/** input type for updating data in table "connectors.webhook" */
export type Connectors_Webhook_Set_Input = {
  connector_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  request_body?: InputMaybe<Scalars['bytea']['input']>;
};

/** Streaming cursor of the table "connectors_webhook" */
export type Connectors_Webhook_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Connectors_Webhook_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Connectors_Webhook_Stream_Cursor_Value_Input = {
  connector_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  request_body?: InputMaybe<Scalars['bytea']['input']>;
};

/** update columns of table "connectors.webhook" */
export enum Connectors_Webhook_Update_Column {
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  Id = 'id',
  /** column name */
  RequestBody = 'request_body',
}

export type Connectors_Webhook_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Connectors_Webhook_Set_Input>;
  /** filter the rows which have to be updated */
  where: Connectors_Webhook_Bool_Exp;
};

/** columns and relationships of "consumers" */
export type Consumers = {
  __typename?: 'consumers';
  activated_at: Scalars['timestamp']['output'];
  activated_by_iam_id?: Maybe<Scalars['String']['output']>;
  activation_branch?: Scalars['String']['output'];
  additional_salary?: Maybe<Scalars['numeric']['output']>;
  additional_salary_source?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  address_description?: Maybe<Scalars['String']['output']>;
  car_year?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  classification: Scalars['String']['output'];
  club?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  company_address?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  consumers_credit_limits: Array<Consumers_Credit_Limits>;
  /** An aggregate relationship */
  consumers_credit_limits_aggregate: Consumers_Credit_Limits_Aggregate;
  created_at: Scalars['timestamp']['output'];
  district?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  formanceAccount?: Maybe<Accounts_Account>;
  full_name?: Maybe<Scalars['String']['output']>;
  governorate?: Maybe<Scalars['String']['output']>;
  guarantor_job?: Maybe<Scalars['String']['output']>;
  guarantor_relationship?: Maybe<Scalars['String']['output']>;
  home_phone_number?: Maybe<Scalars['String']['output']>;
  house_type?: Maybe<Scalars['String']['output']>;
  iam_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  identity?: Maybe<Identities>;
  job_name?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  loans: Array<Loan>;
  loans_aggregate: Loan_Aggregate;
  marital_status?: Maybe<Scalars['String']['output']>;
  national_id?: Maybe<Scalars['String']['output']>;
  national_id_address?: Maybe<Scalars['String']['output']>;
  origination_channel: Scalars['String']['output'];
  phone_number: Scalars['String']['output'];
  salary?: Maybe<Scalars['numeric']['output']>;
  single_payment_day: Scalars['Int']['output'];
  status: Scalars['consumerstatus']['output'];
  updated_at: Scalars['timestamp']['output'];
  work_phone_number?: Maybe<Scalars['String']['output']>;
  work_type?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "consumers" */
export type ConsumersConsumers_Credit_LimitsArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Credit_Limits_Order_By>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

/** columns and relationships of "consumers" */
export type ConsumersConsumers_Credit_Limits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Credit_Limits_Order_By>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

/** columns and relationships of "consumers" */
export type ConsumersLoansArgs = {
  distinct_on?: InputMaybe<Array<Loan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Order_By>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

/** columns and relationships of "consumers" */
export type ConsumersLoans_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Order_By>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

/** aggregated selection of "consumers" */
export type Consumers_Aggregate = {
  __typename?: 'consumers_aggregate';
  aggregate?: Maybe<Consumers_Aggregate_Fields>;
  nodes: Array<Consumers>;
};

/** aggregate fields of "consumers" */
export type Consumers_Aggregate_Fields = {
  __typename?: 'consumers_aggregate_fields';
  avg?: Maybe<Consumers_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Consumers_Max_Fields>;
  min?: Maybe<Consumers_Min_Fields>;
  stddev?: Maybe<Consumers_Stddev_Fields>;
  stddev_pop?: Maybe<Consumers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Consumers_Stddev_Samp_Fields>;
  sum?: Maybe<Consumers_Sum_Fields>;
  var_pop?: Maybe<Consumers_Var_Pop_Fields>;
  var_samp?: Maybe<Consumers_Var_Samp_Fields>;
  variance?: Maybe<Consumers_Variance_Fields>;
};

/** aggregate fields of "consumers" */
export type Consumers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Consumers_Avg_Fields = {
  __typename?: 'consumers_avg_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "consumers". All fields are combined with a logical 'AND'. */
export type Consumers_Bool_Exp = {
  _and?: InputMaybe<Array<Consumers_Bool_Exp>>;
  _not?: InputMaybe<Consumers_Bool_Exp>;
  _or?: InputMaybe<Array<Consumers_Bool_Exp>>;
  activated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  activated_by_iam_id?: InputMaybe<String_Comparison_Exp>;
  activation_branch?: InputMaybe<String_Comparison_Exp>;
  additional_salary?: InputMaybe<Numeric_Comparison_Exp>;
  additional_salary_source?: InputMaybe<String_Comparison_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  address_description?: InputMaybe<String_Comparison_Exp>;
  car_year?: InputMaybe<Int_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  classification?: InputMaybe<String_Comparison_Exp>;
  club?: InputMaybe<String_Comparison_Exp>;
  company?: InputMaybe<String_Comparison_Exp>;
  company_address?: InputMaybe<String_Comparison_Exp>;
  consumers_credit_limits?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
  consumers_credit_limits_aggregate?: InputMaybe<Consumers_Credit_Limits_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  district?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  full_name?: InputMaybe<String_Comparison_Exp>;
  governorate?: InputMaybe<String_Comparison_Exp>;
  guarantor_job?: InputMaybe<String_Comparison_Exp>;
  guarantor_relationship?: InputMaybe<String_Comparison_Exp>;
  home_phone_number?: InputMaybe<String_Comparison_Exp>;
  house_type?: InputMaybe<String_Comparison_Exp>;
  iam_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  job_name?: InputMaybe<String_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  marital_status?: InputMaybe<String_Comparison_Exp>;
  national_id?: InputMaybe<String_Comparison_Exp>;
  national_id_address?: InputMaybe<String_Comparison_Exp>;
  origination_channel?: InputMaybe<String_Comparison_Exp>;
  phone_number?: InputMaybe<String_Comparison_Exp>;
  salary?: InputMaybe<Numeric_Comparison_Exp>;
  single_payment_day?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Consumerstatus_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  work_phone_number?: InputMaybe<String_Comparison_Exp>;
  work_type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumers" */
export enum Consumers_Constraint {
  /** unique or primary key constraint on columns "id" */
  ConsumersPkey = 'consumers_pkey',
  /** unique or primary key constraint on columns "phone_number" */
  IxConsumersPhoneNumber = 'ix_consumers_phone_number',
}

/** columns and relationships of "consumers_credit_limits" */
export type Consumers_Credit_Limits = {
  __typename?: 'consumers_credit_limits';
  /** An object relationship */
  consumer: Consumers;
  consumer_id: Scalars['uuid']['output'];
  created_at: Scalars['timestamp']['output'];
  id: Scalars['uuid']['output'];
  updated_at: Scalars['timestamp']['output'];
  value: Scalars['Int']['output'];
};

/** aggregated selection of "consumers_credit_limits" */
export type Consumers_Credit_Limits_Aggregate = {
  __typename?: 'consumers_credit_limits_aggregate';
  aggregate?: Maybe<Consumers_Credit_Limits_Aggregate_Fields>;
  nodes: Array<Consumers_Credit_Limits>;
};

export type Consumers_Credit_Limits_Aggregate_Bool_Exp = {
  count?: InputMaybe<Consumers_Credit_Limits_Aggregate_Bool_Exp_Count>;
};

export type Consumers_Credit_Limits_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "consumers_credit_limits" */
export type Consumers_Credit_Limits_Aggregate_Fields = {
  __typename?: 'consumers_credit_limits_aggregate_fields';
  avg?: Maybe<Consumers_Credit_Limits_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Consumers_Credit_Limits_Max_Fields>;
  min?: Maybe<Consumers_Credit_Limits_Min_Fields>;
  stddev?: Maybe<Consumers_Credit_Limits_Stddev_Fields>;
  stddev_pop?: Maybe<Consumers_Credit_Limits_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Consumers_Credit_Limits_Stddev_Samp_Fields>;
  sum?: Maybe<Consumers_Credit_Limits_Sum_Fields>;
  var_pop?: Maybe<Consumers_Credit_Limits_Var_Pop_Fields>;
  var_samp?: Maybe<Consumers_Credit_Limits_Var_Samp_Fields>;
  variance?: Maybe<Consumers_Credit_Limits_Variance_Fields>;
};

/** aggregate fields of "consumers_credit_limits" */
export type Consumers_Credit_Limits_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Aggregate_Order_By = {
  avg?: InputMaybe<Consumers_Credit_Limits_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Consumers_Credit_Limits_Max_Order_By>;
  min?: InputMaybe<Consumers_Credit_Limits_Min_Order_By>;
  stddev?: InputMaybe<Consumers_Credit_Limits_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Consumers_Credit_Limits_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Consumers_Credit_Limits_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Consumers_Credit_Limits_Sum_Order_By>;
  var_pop?: InputMaybe<Consumers_Credit_Limits_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Consumers_Credit_Limits_Var_Samp_Order_By>;
  variance?: InputMaybe<Consumers_Credit_Limits_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Arr_Rel_Insert_Input = {
  data: Array<Consumers_Credit_Limits_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumers_Credit_Limits_On_Conflict>;
};

/** aggregate avg on columns */
export type Consumers_Credit_Limits_Avg_Fields = {
  __typename?: 'consumers_credit_limits_avg_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Avg_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "consumers_credit_limits". All fields are combined with a logical 'AND'. */
export type Consumers_Credit_Limits_Bool_Exp = {
  _and?: InputMaybe<Array<Consumers_Credit_Limits_Bool_Exp>>;
  _not?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
  _or?: InputMaybe<Array<Consumers_Credit_Limits_Bool_Exp>>;
  consumer?: InputMaybe<Consumers_Bool_Exp>;
  consumer_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  value?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumers_credit_limits" */
export enum Consumers_Credit_Limits_Constraint {
  /** unique or primary key constraint on columns "id" */
  ConsumersCreditLimitsPkey = 'consumers_credit_limits_pkey',
}

/** input type for incrementing numeric columns in table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Inc_Input = {
  value?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Insert_Input = {
  consumer?: InputMaybe<Consumers_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Consumers_Credit_Limits_Max_Fields = {
  __typename?: 'consumers_credit_limits_max_fields';
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Max_Order_By = {
  consumer_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Consumers_Credit_Limits_Min_Fields = {
  __typename?: 'consumers_credit_limits_min_fields';
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Min_Order_By = {
  consumer_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Mutation_Response = {
  __typename?: 'consumers_credit_limits_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Consumers_Credit_Limits>;
};

/** on_conflict condition type for table "consumers_credit_limits" */
export type Consumers_Credit_Limits_On_Conflict = {
  constraint: Consumers_Credit_Limits_Constraint;
  update_columns?: Array<Consumers_Credit_Limits_Update_Column>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

/** Ordering options when selecting data from "consumers_credit_limits". */
export type Consumers_Credit_Limits_Order_By = {
  consumer?: InputMaybe<Consumers_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumers_credit_limits */
export type Consumers_Credit_Limits_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "consumers_credit_limits" */
export enum Consumers_Credit_Limits_Select_Column {
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value',
}

/** input type for updating data in table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Set_Input = {
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Consumers_Credit_Limits_Stddev_Fields = {
  __typename?: 'consumers_credit_limits_stddev_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Stddev_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Consumers_Credit_Limits_Stddev_Pop_Fields = {
  __typename?: 'consumers_credit_limits_stddev_pop_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Stddev_Pop_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Consumers_Credit_Limits_Stddev_Samp_Fields = {
  __typename?: 'consumers_credit_limits_stddev_samp_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Stddev_Samp_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumers_Credit_Limits_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumers_Credit_Limits_Stream_Cursor_Value_Input = {
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Consumers_Credit_Limits_Sum_Fields = {
  __typename?: 'consumers_credit_limits_sum_fields';
  value?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Sum_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** update columns of table "consumers_credit_limits" */
export enum Consumers_Credit_Limits_Update_Column {
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value',
}

export type Consumers_Credit_Limits_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Consumers_Credit_Limits_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumers_Credit_Limits_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumers_Credit_Limits_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Consumers_Credit_Limits_Var_Pop_Fields = {
  __typename?: 'consumers_credit_limits_var_pop_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Var_Pop_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Consumers_Credit_Limits_Var_Samp_Fields = {
  __typename?: 'consumers_credit_limits_var_samp_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Var_Samp_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Consumers_Credit_Limits_Variance_Fields = {
  __typename?: 'consumers_credit_limits_variance_fields';
  value?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "consumers_credit_limits" */
export type Consumers_Credit_Limits_Variance_Order_By = {
  value?: InputMaybe<Order_By>;
};

/** input type for incrementing numeric columns in table "consumers" */
export type Consumers_Inc_Input = {
  additional_salary?: InputMaybe<Scalars['numeric']['input']>;
  car_year?: InputMaybe<Scalars['Int']['input']>;
  salary?: InputMaybe<Scalars['numeric']['input']>;
  single_payment_day?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "consumers" */
export type Consumers_Insert_Input = {
  activated_at?: InputMaybe<Scalars['timestamp']['input']>;
  activated_by_iam_id?: InputMaybe<Scalars['String']['input']>;
  activation_branch?: InputMaybe<Scalars['String']['input']>;
  additional_salary?: InputMaybe<Scalars['numeric']['input']>;
  additional_salary_source?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_description?: InputMaybe<Scalars['String']['input']>;
  car_year?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  classification?: InputMaybe<Scalars['String']['input']>;
  club?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  company_address?: InputMaybe<Scalars['String']['input']>;
  consumers_credit_limits?: InputMaybe<Consumers_Credit_Limits_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  governorate?: InputMaybe<Scalars['String']['input']>;
  guarantor_job?: InputMaybe<Scalars['String']['input']>;
  guarantor_relationship?: InputMaybe<Scalars['String']['input']>;
  home_phone_number?: InputMaybe<Scalars['String']['input']>;
  house_type?: InputMaybe<Scalars['String']['input']>;
  iam_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  job_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  marital_status?: InputMaybe<Scalars['String']['input']>;
  national_id?: InputMaybe<Scalars['String']['input']>;
  national_id_address?: InputMaybe<Scalars['String']['input']>;
  origination_channel?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  salary?: InputMaybe<Scalars['numeric']['input']>;
  single_payment_day?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['consumerstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  work_phone_number?: InputMaybe<Scalars['String']['input']>;
  work_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Consumers_Max_Fields = {
  __typename?: 'consumers_max_fields';
  activated_at?: Maybe<Scalars['timestamp']['output']>;
  activated_by_iam_id?: Maybe<Scalars['String']['output']>;
  activation_branch?: Maybe<Scalars['String']['output']>;
  additional_salary?: Maybe<Scalars['numeric']['output']>;
  additional_salary_source?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  address_description?: Maybe<Scalars['String']['output']>;
  car_year?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  classification?: Maybe<Scalars['String']['output']>;
  club?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  company_address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  governorate?: Maybe<Scalars['String']['output']>;
  guarantor_job?: Maybe<Scalars['String']['output']>;
  guarantor_relationship?: Maybe<Scalars['String']['output']>;
  home_phone_number?: Maybe<Scalars['String']['output']>;
  house_type?: Maybe<Scalars['String']['output']>;
  iam_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  job_name?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  marital_status?: Maybe<Scalars['String']['output']>;
  national_id?: Maybe<Scalars['String']['output']>;
  national_id_address?: Maybe<Scalars['String']['output']>;
  origination_channel?: Maybe<Scalars['String']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
  salary?: Maybe<Scalars['numeric']['output']>;
  single_payment_day?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['consumerstatus']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  work_phone_number?: Maybe<Scalars['String']['output']>;
  work_type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Consumers_Min_Fields = {
  __typename?: 'consumers_min_fields';
  activated_at?: Maybe<Scalars['timestamp']['output']>;
  activated_by_iam_id?: Maybe<Scalars['String']['output']>;
  activation_branch?: Maybe<Scalars['String']['output']>;
  additional_salary?: Maybe<Scalars['numeric']['output']>;
  additional_salary_source?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  address_description?: Maybe<Scalars['String']['output']>;
  car_year?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  classification?: Maybe<Scalars['String']['output']>;
  club?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  company_address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  governorate?: Maybe<Scalars['String']['output']>;
  guarantor_job?: Maybe<Scalars['String']['output']>;
  guarantor_relationship?: Maybe<Scalars['String']['output']>;
  home_phone_number?: Maybe<Scalars['String']['output']>;
  house_type?: Maybe<Scalars['String']['output']>;
  iam_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  job_name?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  marital_status?: Maybe<Scalars['String']['output']>;
  national_id?: Maybe<Scalars['String']['output']>;
  national_id_address?: Maybe<Scalars['String']['output']>;
  origination_channel?: Maybe<Scalars['String']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
  salary?: Maybe<Scalars['numeric']['output']>;
  single_payment_day?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['consumerstatus']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  work_phone_number?: Maybe<Scalars['String']['output']>;
  work_type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "consumers" */
export type Consumers_Mutation_Response = {
  __typename?: 'consumers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Consumers>;
};

/** input type for inserting object relation for remote table "consumers" */
export type Consumers_Obj_Rel_Insert_Input = {
  data: Consumers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumers_On_Conflict>;
};

/** on_conflict condition type for table "consumers" */
export type Consumers_On_Conflict = {
  constraint: Consumers_Constraint;
  update_columns?: Array<Consumers_Update_Column>;
  where?: InputMaybe<Consumers_Bool_Exp>;
};

/** Ordering options when selecting data from "consumers". */
export type Consumers_Order_By = {
  activated_at?: InputMaybe<Order_By>;
  activated_by_iam_id?: InputMaybe<Order_By>;
  activation_branch?: InputMaybe<Order_By>;
  additional_salary?: InputMaybe<Order_By>;
  additional_salary_source?: InputMaybe<Order_By>;
  address?: InputMaybe<Order_By>;
  address_description?: InputMaybe<Order_By>;
  car_year?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  classification?: InputMaybe<Order_By>;
  club?: InputMaybe<Order_By>;
  company?: InputMaybe<Order_By>;
  company_address?: InputMaybe<Order_By>;
  consumers_credit_limits_aggregate?: InputMaybe<Consumers_Credit_Limits_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  district?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  full_name?: InputMaybe<Order_By>;
  governorate?: InputMaybe<Order_By>;
  guarantor_job?: InputMaybe<Order_By>;
  guarantor_relationship?: InputMaybe<Order_By>;
  home_phone_number?: InputMaybe<Order_By>;
  house_type?: InputMaybe<Order_By>;
  iam_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  job_name?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  marital_status?: InputMaybe<Order_By>;
  national_id?: InputMaybe<Order_By>;
  national_id_address?: InputMaybe<Order_By>;
  origination_channel?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  salary?: InputMaybe<Order_By>;
  single_payment_day?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  work_phone_number?: InputMaybe<Order_By>;
  work_type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumers */
export type Consumers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "consumers" */
export enum Consumers_Select_Column {
  /** column name */
  ActivatedAt = 'activated_at',
  /** column name */
  ActivatedByCreditOfficerIamId = 'activated_by_iam_id',
  ActivationBranch = 'activation_branch',
  /** column name */
  AdditionalSalary = 'additional_salary',
  /** column name */
  AdditionalSalarySource = 'additional_salary_source',
  /** column name */
  Address = 'address',
  /** column name */
  AddressDescription = 'address_description',
  /** column name */
  CarYear = 'car_year',
  /** column name */
  City = 'city',
  /** column name */
  Classification = 'classification',
  /** column name */
  Club = 'club',
  /** column name */
  Company = 'company',
  /** column name */
  CompanyAddress = 'company_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  District = 'district',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Governorate = 'governorate',
  /** column name */
  GuarantorJob = 'guarantor_job',
  /** column name */
  GuarantorRelationship = 'guarantor_relationship',
  /** column name */
  HomePhoneNumber = 'home_phone_number',
  /** column name */
  HouseType = 'house_type',
  /** column name */
  IamId = 'iam_id',
  /** column name */
  Id = 'id',
  /** column name */
  JobName = 'job_name',
  /** column name */
  LastName = 'last_name',
  /** column name */
  MaritalStatus = 'marital_status',
  /** column name */
  NationalId = 'national_id',
  /** column name */
  NationalIdAddress = 'national_id_address',
  /** column name */
  OriginationChannel = 'origination_channel',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  Salary = 'salary',
  /** column name */
  SinglePaymentDay = 'single_payment_day',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WorkPhoneNumber = 'work_phone_number',
  /** column name */
  WorkType = 'work_type',
}

/** input type for updating data in table "consumers" */
export type Consumers_Set_Input = {
  activated_at?: InputMaybe<Scalars['timestamp']['input']>;
  activated_by_iam_id?: InputMaybe<Scalars['String']['input']>;
  activation_branch?: InputMaybe<Scalars['String']['input']>;
  additional_salary?: InputMaybe<Scalars['numeric']['input']>;
  additional_salary_source?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_description?: InputMaybe<Scalars['String']['input']>;
  car_year?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  classification?: InputMaybe<Scalars['String']['input']>;
  club?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  company_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  governorate?: InputMaybe<Scalars['String']['input']>;
  guarantor_job?: InputMaybe<Scalars['String']['input']>;
  guarantor_relationship?: InputMaybe<Scalars['String']['input']>;
  home_phone_number?: InputMaybe<Scalars['String']['input']>;
  house_type?: InputMaybe<Scalars['String']['input']>;
  iam_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  job_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  marital_status?: InputMaybe<Scalars['String']['input']>;
  national_id?: InputMaybe<Scalars['String']['input']>;
  national_id_address?: InputMaybe<Scalars['String']['input']>;
  origination_channel?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  salary?: InputMaybe<Scalars['numeric']['input']>;
  single_payment_day?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['consumerstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  work_phone_number?: InputMaybe<Scalars['String']['input']>;
  work_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Consumers_Stddev_Fields = {
  __typename?: 'consumers_stddev_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Consumers_Stddev_Pop_Fields = {
  __typename?: 'consumers_stddev_pop_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Consumers_Stddev_Samp_Fields = {
  __typename?: 'consumers_stddev_samp_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "consumers" */
export type Consumers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumers_Stream_Cursor_Value_Input = {
  activated_at?: InputMaybe<Scalars['timestamp']['input']>;
  activated_by_iam_id?: InputMaybe<Scalars['String']['input']>;
  activation_branch?: InputMaybe<Scalars['String']['input']>;
  additional_salary?: InputMaybe<Scalars['numeric']['input']>;
  additional_salary_source?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_description?: InputMaybe<Scalars['String']['input']>;
  car_year?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  classification?: InputMaybe<Scalars['String']['input']>;
  club?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  company_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  governorate?: InputMaybe<Scalars['String']['input']>;
  guarantor_job?: InputMaybe<Scalars['String']['input']>;
  guarantor_relationship?: InputMaybe<Scalars['String']['input']>;
  home_phone_number?: InputMaybe<Scalars['String']['input']>;
  house_type?: InputMaybe<Scalars['String']['input']>;
  iam_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  job_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  marital_status?: InputMaybe<Scalars['String']['input']>;
  national_id?: InputMaybe<Scalars['String']['input']>;
  national_id_address?: InputMaybe<Scalars['String']['input']>;
  origination_channel?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  salary?: InputMaybe<Scalars['numeric']['input']>;
  single_payment_day?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['consumerstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  work_phone_number?: InputMaybe<Scalars['String']['input']>;
  work_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Consumers_Sum_Fields = {
  __typename?: 'consumers_sum_fields';
  additional_salary?: Maybe<Scalars['numeric']['output']>;
  car_year?: Maybe<Scalars['Int']['output']>;
  salary?: Maybe<Scalars['numeric']['output']>;
  single_payment_day?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "consumers" */
export enum Consumers_Update_Column {
  /** column name */
  ActivatedAt = 'activated_at',
  /** column name */
  ActivatedByCreditOfficerIamId = 'activated_by_iam_id',
  ActivationBranch = 'activation_branch',
  /** column name */
  AdditionalSalary = 'additional_salary',
  /** column name */
  AdditionalSalarySource = 'additional_salary_source',
  /** column name */
  Address = 'address',
  /** column name */
  AddressDescription = 'address_description',
  /** column name */
  CarYear = 'car_year',
  /** column name */
  City = 'city',
  /** column name */
  Classification = 'classification',
  /** column name */
  Club = 'club',
  /** column name */
  Company = 'company',
  /** column name */
  CompanyAddress = 'company_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  District = 'district',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Governorate = 'governorate',
  /** column name */
  GuarantorJob = 'guarantor_job',
  /** column name */
  GuarantorRelationship = 'guarantor_relationship',
  /** column name */
  HomePhoneNumber = 'home_phone_number',
  /** column name */
  HouseType = 'house_type',
  /** column name */
  IamId = 'iam_id',
  /** column name */
  Id = 'id',
  /** column name */
  JobName = 'job_name',
  /** column name */
  LastName = 'last_name',
  /** column name */
  MaritalStatus = 'marital_status',
  /** column name */
  NationalId = 'national_id',
  /** column name */
  NationalIdAddress = 'national_id_address',
  /** column name */
  OriginationChannel = 'origination_channel',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  Salary = 'salary',
  /** column name */
  SinglePaymentDay = 'single_payment_day',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WorkPhoneNumber = 'work_phone_number',
  /** column name */
  WorkType = 'work_type',
}

export type Consumers_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Consumers_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Consumers_Var_Pop_Fields = {
  __typename?: 'consumers_var_pop_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Consumers_Var_Samp_Fields = {
  __typename?: 'consumers_var_samp_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Consumers_Variance_Fields = {
  __typename?: 'consumers_variance_fields';
  additional_salary?: Maybe<Scalars['Float']['output']>;
  car_year?: Maybe<Scalars['Float']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  single_payment_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "consumerstatus". All fields are combined with logical 'AND'. */
export type Consumerstatus_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['consumerstatus']['input']>;
  _gt?: InputMaybe<Scalars['consumerstatus']['input']>;
  _gte?: InputMaybe<Scalars['consumerstatus']['input']>;
  _in?: InputMaybe<Array<Scalars['consumerstatus']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['consumerstatus']['input']>;
  _lte?: InputMaybe<Scalars['consumerstatus']['input']>;
  _neq?: InputMaybe<Scalars['consumerstatus']['input']>;
  _nin?: InputMaybe<Array<Scalars['consumerstatus']['input']>>;
};

/** Boolean expression to compare columns of type "currencycode". All fields are combined with logical 'AND'. */
export type Currencycode_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['currencycode']['input']>;
  _gt?: InputMaybe<Scalars['currencycode']['input']>;
  _gte?: InputMaybe<Scalars['currencycode']['input']>;
  _in?: InputMaybe<Array<Scalars['currencycode']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['currencycode']['input']>;
  _lte?: InputMaybe<Scalars['currencycode']['input']>;
  _neq?: InputMaybe<Scalars['currencycode']['input']>;
  _nin?: InputMaybe<Array<Scalars['currencycode']['input']>>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** columns and relationships of "entry" */
export type Entry = {
  __typename?: 'entry';
  amount: Scalars['bigint']['output'];
  /** An object relationship */
  command: Command;
  command_id: Scalars['Int']['output'];
  entry_type: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
};

/** aggregated selection of "entry" */
export type Entry_Aggregate = {
  __typename?: 'entry_aggregate';
  aggregate?: Maybe<Entry_Aggregate_Fields>;
  nodes: Array<Entry>;
};

export type Entry_Aggregate_Bool_Exp = {
  count?: InputMaybe<Entry_Aggregate_Bool_Exp_Count>;
};

export type Entry_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Entry_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Entry_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "entry" */
export type Entry_Aggregate_Fields = {
  __typename?: 'entry_aggregate_fields';
  avg?: Maybe<Entry_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Entry_Max_Fields>;
  min?: Maybe<Entry_Min_Fields>;
  stddev?: Maybe<Entry_Stddev_Fields>;
  stddev_pop?: Maybe<Entry_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Entry_Stddev_Samp_Fields>;
  sum?: Maybe<Entry_Sum_Fields>;
  var_pop?: Maybe<Entry_Var_Pop_Fields>;
  var_samp?: Maybe<Entry_Var_Samp_Fields>;
  variance?: Maybe<Entry_Variance_Fields>;
};

/** aggregate fields of "entry" */
export type Entry_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Entry_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "entry" */
export type Entry_Aggregate_Order_By = {
  avg?: InputMaybe<Entry_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Entry_Max_Order_By>;
  min?: InputMaybe<Entry_Min_Order_By>;
  stddev?: InputMaybe<Entry_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Entry_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Entry_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Entry_Sum_Order_By>;
  var_pop?: InputMaybe<Entry_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Entry_Var_Samp_Order_By>;
  variance?: InputMaybe<Entry_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "entry" */
export type Entry_Arr_Rel_Insert_Input = {
  data: Array<Entry_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Entry_On_Conflict>;
};

/** aggregate avg on columns */
export type Entry_Avg_Fields = {
  __typename?: 'entry_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "entry" */
export type Entry_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "entry". All fields are combined with a logical 'AND'. */
export type Entry_Bool_Exp = {
  _and?: InputMaybe<Array<Entry_Bool_Exp>>;
  _not?: InputMaybe<Entry_Bool_Exp>;
  _or?: InputMaybe<Array<Entry_Bool_Exp>>;
  amount?: InputMaybe<Bigint_Comparison_Exp>;
  command?: InputMaybe<Command_Bool_Exp>;
  command_id?: InputMaybe<Int_Comparison_Exp>;
  entry_type?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "entry" */
export enum Entry_Constraint {
  /** unique or primary key constraint on columns "id" */
  EntryPkey = 'entry_pkey',
}

/** input type for incrementing numeric columns in table "entry" */
export type Entry_Inc_Input = {
  amount?: InputMaybe<Scalars['bigint']['input']>;
  command_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "entry" */
export type Entry_Insert_Input = {
  amount?: InputMaybe<Scalars['bigint']['input']>;
  command?: InputMaybe<Command_Obj_Rel_Insert_Input>;
  command_id?: InputMaybe<Scalars['Int']['input']>;
  entry_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Entry_Max_Fields = {
  __typename?: 'entry_max_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
  command_id?: Maybe<Scalars['Int']['output']>;
  entry_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "entry" */
export type Entry_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  entry_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Entry_Min_Fields = {
  __typename?: 'entry_min_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
  command_id?: Maybe<Scalars['Int']['output']>;
  entry_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "entry" */
export type Entry_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  entry_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "entry" */
export type Entry_Mutation_Response = {
  __typename?: 'entry_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Entry>;
};

/** on_conflict condition type for table "entry" */
export type Entry_On_Conflict = {
  constraint: Entry_Constraint;
  update_columns?: Array<Entry_Update_Column>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

/** Ordering options when selecting data from "entry". */
export type Entry_Order_By = {
  amount?: InputMaybe<Order_By>;
  command?: InputMaybe<Command_Order_By>;
  command_id?: InputMaybe<Order_By>;
  entry_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: entry */
export type Entry_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "entry" */
export enum Entry_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CommandId = 'command_id',
  /** column name */
  EntryType = 'entry_type',
  /** column name */
  Id = 'id',
}

/** input type for updating data in table "entry" */
export type Entry_Set_Input = {
  amount?: InputMaybe<Scalars['bigint']['input']>;
  command_id?: InputMaybe<Scalars['Int']['input']>;
  entry_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Entry_Stddev_Fields = {
  __typename?: 'entry_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "entry" */
export type Entry_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Entry_Stddev_Pop_Fields = {
  __typename?: 'entry_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "entry" */
export type Entry_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Entry_Stddev_Samp_Fields = {
  __typename?: 'entry_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "entry" */
export type Entry_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "entry" */
export type Entry_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Entry_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Entry_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['bigint']['input']>;
  command_id?: InputMaybe<Scalars['Int']['input']>;
  entry_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Entry_Sum_Fields = {
  __typename?: 'entry_sum_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
  command_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "entry" */
export type Entry_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** update columns of table "entry" */
export enum Entry_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CommandId = 'command_id',
  /** column name */
  EntryType = 'entry_type',
  /** column name */
  Id = 'id',
}

export type Entry_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Entry_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Entry_Set_Input>;
  /** filter the rows which have to be updated */
  where: Entry_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Entry_Var_Pop_Fields = {
  __typename?: 'entry_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "entry" */
export type Entry_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Entry_Var_Samp_Fields = {
  __typename?: 'entry_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "entry" */
export type Entry_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Entry_Variance_Fields = {
  __typename?: 'entry_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  command_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "entry" */
export type Entry_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  command_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "governorates" */
export type Governorates = {
  __typename?: 'governorates';
  /** An array relationship */
  areas: Array<Areas>;
  /** An aggregate relationship */
  areas_aggregate: Areas_Aggregate;
  /** An array relationship */
  cities: Array<Cities>;
  /** An aggregate relationship */
  cities_aggregate: Cities_Aggregate;
  created_at: Scalars['timestamp']['output'];
  id: Scalars['Int']['output'];
  mc_id: Scalars['Int']['output'];
  name_ar: Scalars['String']['output'];
  name_en: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** columns and relationships of "governorates" */
export type GovernoratesAreasArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

/** columns and relationships of "governorates" */
export type GovernoratesAreas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

/** columns and relationships of "governorates" */
export type GovernoratesCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

/** columns and relationships of "governorates" */
export type GovernoratesCities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

/** aggregated selection of "governorates" */
export type Governorates_Aggregate = {
  __typename?: 'governorates_aggregate';
  aggregate?: Maybe<Governorates_Aggregate_Fields>;
  nodes: Array<Governorates>;
};

/** aggregate fields of "governorates" */
export type Governorates_Aggregate_Fields = {
  __typename?: 'governorates_aggregate_fields';
  avg?: Maybe<Governorates_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Governorates_Max_Fields>;
  min?: Maybe<Governorates_Min_Fields>;
  stddev?: Maybe<Governorates_Stddev_Fields>;
  stddev_pop?: Maybe<Governorates_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Governorates_Stddev_Samp_Fields>;
  sum?: Maybe<Governorates_Sum_Fields>;
  var_pop?: Maybe<Governorates_Var_Pop_Fields>;
  var_samp?: Maybe<Governorates_Var_Samp_Fields>;
  variance?: Maybe<Governorates_Variance_Fields>;
};

/** aggregate fields of "governorates" */
export type Governorates_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Governorates_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Governorates_Avg_Fields = {
  __typename?: 'governorates_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "governorates". All fields are combined with a logical 'AND'. */
export type Governorates_Bool_Exp = {
  _and?: InputMaybe<Array<Governorates_Bool_Exp>>;
  _not?: InputMaybe<Governorates_Bool_Exp>;
  _or?: InputMaybe<Array<Governorates_Bool_Exp>>;
  areas?: InputMaybe<Areas_Bool_Exp>;
  areas_aggregate?: InputMaybe<Areas_Aggregate_Bool_Exp>;
  cities?: InputMaybe<Cities_Bool_Exp>;
  cities_aggregate?: InputMaybe<Cities_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  mc_id?: InputMaybe<Int_Comparison_Exp>;
  name_ar?: InputMaybe<String_Comparison_Exp>;
  name_en?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "governorates" */
export enum Governorates_Constraint {
  /** unique or primary key constraint on columns "mc_id" */
  GovernoratesMcIdKey = 'governorates_mc_id_key',
  /** unique or primary key constraint on columns "id" */
  GovernoratesPkey = 'governorates_pkey',
}

/** input type for incrementing numeric columns in table "governorates" */
export type Governorates_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "governorates" */
export type Governorates_Insert_Input = {
  areas?: InputMaybe<Areas_Arr_Rel_Insert_Input>;
  cities?: InputMaybe<Cities_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Governorates_Max_Fields = {
  __typename?: 'governorates_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
  name_ar?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregate min on columns */
export type Governorates_Min_Fields = {
  __typename?: 'governorates_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
  name_ar?: Maybe<Scalars['String']['output']>;
  name_en?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** response of any mutation on the table "governorates" */
export type Governorates_Mutation_Response = {
  __typename?: 'governorates_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Governorates>;
};

/** input type for inserting object relation for remote table "governorates" */
export type Governorates_Obj_Rel_Insert_Input = {
  data: Governorates_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Governorates_On_Conflict>;
};

/** on_conflict condition type for table "governorates" */
export type Governorates_On_Conflict = {
  constraint: Governorates_Constraint;
  update_columns?: Array<Governorates_Update_Column>;
  where?: InputMaybe<Governorates_Bool_Exp>;
};

/** Ordering options when selecting data from "governorates". */
export type Governorates_Order_By = {
  areas_aggregate?: InputMaybe<Areas_Aggregate_Order_By>;
  cities_aggregate?: InputMaybe<Cities_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mc_id?: InputMaybe<Order_By>;
  name_ar?: InputMaybe<Order_By>;
  name_en?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: governorates */
export type Governorates_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "governorates" */
export enum Governorates_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  McId = 'mc_id',
  /** column name */
  NameAr = 'name_ar',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "governorates" */
export type Governorates_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Governorates_Stddev_Fields = {
  __typename?: 'governorates_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Governorates_Stddev_Pop_Fields = {
  __typename?: 'governorates_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Governorates_Stddev_Samp_Fields = {
  __typename?: 'governorates_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "governorates" */
export type Governorates_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Governorates_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Governorates_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  mc_id?: InputMaybe<Scalars['Int']['input']>;
  name_ar?: InputMaybe<Scalars['String']['input']>;
  name_en?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Governorates_Sum_Fields = {
  __typename?: 'governorates_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  mc_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "governorates" */
export enum Governorates_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  McId = 'mc_id',
  /** column name */
  NameAr = 'name_ar',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Governorates_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Governorates_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Governorates_Set_Input>;
  /** filter the rows which have to be updated */
  where: Governorates_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Governorates_Var_Pop_Fields = {
  __typename?: 'governorates_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Governorates_Var_Samp_Fields = {
  __typename?: 'governorates_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Governorates_Variance_Fields = {
  __typename?: 'governorates_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  mc_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "identities" */
export type Identities = {
  __typename?: 'identities';
  available_aal?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamp']['output'];
  id: Scalars['uuid']['output'];
  metadata_admin?: Maybe<Scalars['jsonb']['output']>;
  metadata_public?: Maybe<Scalars['jsonb']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  schema_id: Scalars['String']['output'];
  state: Scalars['String']['output'];
  state_changed_at?: Maybe<Scalars['timestamp']['output']>;
  traits: Scalars['jsonb']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** columns and relationships of "identities" */
export type IdentitiesMetadata_AdminArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "identities" */
export type IdentitiesMetadata_PublicArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "identities" */
export type IdentitiesTraitsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "identities" */
export type Identities_Aggregate = {
  __typename?: 'identities_aggregate';
  aggregate?: Maybe<Identities_Aggregate_Fields>;
  nodes: Array<Identities>;
};

/** aggregate fields of "identities" */
export type Identities_Aggregate_Fields = {
  __typename?: 'identities_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Identities_Max_Fields>;
  min?: Maybe<Identities_Min_Fields>;
};

/** aggregate fields of "identities" */
export type Identities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Identities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Identities_Append_Input = {
  metadata_admin?: InputMaybe<Scalars['jsonb']['input']>;
  metadata_public?: InputMaybe<Scalars['jsonb']['input']>;
  traits?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "identities". All fields are combined with a logical 'AND'. */
export type Identities_Bool_Exp = {
  _and?: InputMaybe<Array<Identities_Bool_Exp>>;
  _not?: InputMaybe<Identities_Bool_Exp>;
  _or?: InputMaybe<Array<Identities_Bool_Exp>>;
  available_aal?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata_admin?: InputMaybe<Jsonb_Comparison_Exp>;
  metadata_public?: InputMaybe<Jsonb_Comparison_Exp>;
  nid?: InputMaybe<Uuid_Comparison_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  schema_id?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
  state_changed_at?: InputMaybe<Timestamp_Comparison_Exp>;
  traits?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "identities" */
export enum Identities_Constraint {
  /** unique or primary key constraint on columns "id" */
  IdentitiesPkey = 'identities_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Identities_Delete_At_Path_Input = {
  metadata_admin?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_public?: InputMaybe<Array<Scalars['String']['input']>>;
  traits?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Identities_Delete_Elem_Input = {
  metadata_admin?: InputMaybe<Scalars['Int']['input']>;
  metadata_public?: InputMaybe<Scalars['Int']['input']>;
  traits?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Identities_Delete_Key_Input = {
  metadata_admin?: InputMaybe<Scalars['String']['input']>;
  metadata_public?: InputMaybe<Scalars['String']['input']>;
  traits?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "identities" */
export type Identities_Insert_Input = {
  available_aal?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata_admin?: InputMaybe<Scalars['jsonb']['input']>;
  metadata_public?: InputMaybe<Scalars['jsonb']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  schema_id?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  state_changed_at?: InputMaybe<Scalars['timestamp']['input']>;
  traits?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Identities_Max_Fields = {
  __typename?: 'identities_max_fields';
  available_aal?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  schema_id?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  state_changed_at?: Maybe<Scalars['timestamp']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregate min on columns */
export type Identities_Min_Fields = {
  __typename?: 'identities_min_fields';
  available_aal?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  organization_id?: Maybe<Scalars['uuid']['output']>;
  schema_id?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  state_changed_at?: Maybe<Scalars['timestamp']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** response of any mutation on the table "identities" */
export type Identities_Mutation_Response = {
  __typename?: 'identities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Identities>;
};

/** on_conflict condition type for table "identities" */
export type Identities_On_Conflict = {
  constraint: Identities_Constraint;
  update_columns?: Array<Identities_Update_Column>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

/** Ordering options when selecting data from "identities". */
export type Identities_Order_By = {
  available_aal?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_admin?: InputMaybe<Order_By>;
  metadata_public?: InputMaybe<Order_By>;
  nid?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  schema_id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  state_changed_at?: InputMaybe<Order_By>;
  traits?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: identities */
export type Identities_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Identities_Prepend_Input = {
  metadata_admin?: InputMaybe<Scalars['jsonb']['input']>;
  metadata_public?: InputMaybe<Scalars['jsonb']['input']>;
  traits?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "identities" */
export enum Identities_Select_Column {
  /** column name */
  AvailableAal = 'available_aal',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MetadataAdmin = 'metadata_admin',
  /** column name */
  MetadataPublic = 'metadata_public',
  /** column name */
  Nid = 'nid',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  SchemaId = 'schema_id',
  /** column name */
  State = 'state',
  /** column name */
  StateChangedAt = 'state_changed_at',
  /** column name */
  Traits = 'traits',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "identities" */
export type Identities_Set_Input = {
  available_aal?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata_admin?: InputMaybe<Scalars['jsonb']['input']>;
  metadata_public?: InputMaybe<Scalars['jsonb']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  schema_id?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  state_changed_at?: InputMaybe<Scalars['timestamp']['input']>;
  traits?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "identities" */
export type Identities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Identities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Identities_Stream_Cursor_Value_Input = {
  available_aal?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata_admin?: InputMaybe<Scalars['jsonb']['input']>;
  metadata_public?: InputMaybe<Scalars['jsonb']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  organization_id?: InputMaybe<Scalars['uuid']['input']>;
  schema_id?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  state_changed_at?: InputMaybe<Scalars['timestamp']['input']>;
  traits?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** update columns of table "identities" */
export enum Identities_Update_Column {
  /** column name */
  AvailableAal = 'available_aal',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MetadataAdmin = 'metadata_admin',
  /** column name */
  MetadataPublic = 'metadata_public',
  /** column name */
  Nid = 'nid',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  SchemaId = 'schema_id',
  /** column name */
  State = 'state',
  /** column name */
  StateChangedAt = 'state_changed_at',
  /** column name */
  Traits = 'traits',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Identities_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Identities_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Identities_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Identities_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Identities_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Identities_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Identities_Set_Input>;
  /** filter the rows which have to be updated */
  where: Identities_Bool_Exp;
};

/** columns and relationships of "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses = {
  __typename?: 'identity_verifiable_addresses';
  created_at: Scalars['timestamp']['output'];
  id: Scalars['uuid']['output'];
  identity_id: Scalars['uuid']['output'];
  nid?: Maybe<Scalars['uuid']['output']>;
  status: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
  value: Scalars['String']['output'];
  verified: Scalars['Boolean']['output'];
  verified_at?: Maybe<Scalars['timestamp']['output']>;
  via: Scalars['String']['output'];
};

/** aggregated selection of "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Aggregate = {
  __typename?: 'identity_verifiable_addresses_aggregate';
  aggregate?: Maybe<Identity_Verifiable_Addresses_Aggregate_Fields>;
  nodes: Array<Identity_Verifiable_Addresses>;
};

/** aggregate fields of "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Aggregate_Fields = {
  __typename?: 'identity_verifiable_addresses_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Identity_Verifiable_Addresses_Max_Fields>;
  min?: Maybe<Identity_Verifiable_Addresses_Min_Fields>;
};

/** aggregate fields of "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Identity_Verifiable_Addresses_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "identity_verifiable_addresses". All fields are combined with a logical 'AND'. */
export type Identity_Verifiable_Addresses_Bool_Exp = {
  _and?: InputMaybe<Array<Identity_Verifiable_Addresses_Bool_Exp>>;
  _not?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
  _or?: InputMaybe<Array<Identity_Verifiable_Addresses_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identity_id?: InputMaybe<Uuid_Comparison_Exp>;
  nid?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
  verified?: InputMaybe<Boolean_Comparison_Exp>;
  verified_at?: InputMaybe<Timestamp_Comparison_Exp>;
  via?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "identity_verifiable_addresses" */
export enum Identity_Verifiable_Addresses_Constraint {
  /** unique or primary key constraint on columns "id" */
  IdentityVerifiableAddressesPkey = 'identity_verifiable_addresses_pkey',
  /** unique or primary key constraint on columns "nid", "value", "via" */
  IdentityVerifiableAddressesStatusViaUqIdx = 'identity_verifiable_addresses_status_via_uq_idx',
}

/** input type for inserting data into table "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  identity_id?: InputMaybe<Scalars['uuid']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  verified_at?: InputMaybe<Scalars['timestamp']['input']>;
  via?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Identity_Verifiable_Addresses_Max_Fields = {
  __typename?: 'identity_verifiable_addresses_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  identity_id?: Maybe<Scalars['uuid']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  value?: Maybe<Scalars['String']['output']>;
  verified_at?: Maybe<Scalars['timestamp']['output']>;
  via?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Identity_Verifiable_Addresses_Min_Fields = {
  __typename?: 'identity_verifiable_addresses_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  identity_id?: Maybe<Scalars['uuid']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
  value?: Maybe<Scalars['String']['output']>;
  verified_at?: Maybe<Scalars['timestamp']['output']>;
  via?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Mutation_Response = {
  __typename?: 'identity_verifiable_addresses_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Identity_Verifiable_Addresses>;
};

/** on_conflict condition type for table "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_On_Conflict = {
  constraint: Identity_Verifiable_Addresses_Constraint;
  update_columns?: Array<Identity_Verifiable_Addresses_Update_Column>;
  where?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
};

/** Ordering options when selecting data from "identity_verifiable_addresses". */
export type Identity_Verifiable_Addresses_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  nid?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
  verified?: InputMaybe<Order_By>;
  verified_at?: InputMaybe<Order_By>;
  via?: InputMaybe<Order_By>;
};

/** primary key columns input for table: identity_verifiable_addresses */
export type Identity_Verifiable_Addresses_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "identity_verifiable_addresses" */
export enum Identity_Verifiable_Addresses_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IdentityId = 'identity_id',
  /** column name */
  Nid = 'nid',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value',
  /** column name */
  Verified = 'verified',
  /** column name */
  VerifiedAt = 'verified_at',
  /** column name */
  Via = 'via',
}

/** input type for updating data in table "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  identity_id?: InputMaybe<Scalars['uuid']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  verified_at?: InputMaybe<Scalars['timestamp']['input']>;
  via?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "identity_verifiable_addresses" */
export type Identity_Verifiable_Addresses_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Identity_Verifiable_Addresses_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Identity_Verifiable_Addresses_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  identity_id?: InputMaybe<Scalars['uuid']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  verified_at?: InputMaybe<Scalars['timestamp']['input']>;
  via?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "identity_verifiable_addresses" */
export enum Identity_Verifiable_Addresses_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IdentityId = 'identity_id',
  /** column name */
  Nid = 'nid',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value',
  /** column name */
  Verified = 'verified',
  /** column name */
  VerifiedAt = 'verified_at',
  /** column name */
  Via = 'via',
}

export type Identity_Verifiable_Addresses_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Identity_Verifiable_Addresses_Set_Input>;
  /** filter the rows which have to be updated */
  where: Identity_Verifiable_Addresses_Bool_Exp;
};

/** columns and relationships of "journal" */
export type Journal = {
  __typename?: 'journal';
  account: Scalars['String']['output'];
  amount: Scalars['bigint']['output'];
  booked_at: Scalars['timestamptz']['output'];
  correlation_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by: Scalars['String']['output'];
  direction: Scalars['journal_direction']['output'];
  id: Scalars['Int']['output'];
  /** An object relationship */
  loan: Loan;
  loan_id: Scalars['String']['output'];
  transaction_id: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

/** aggregated selection of "journal" */
export type Journal_Aggregate = {
  __typename?: 'journal_aggregate';
  aggregate?: Maybe<Journal_Aggregate_Fields>;
  nodes: Array<Journal>;
};

export type Journal_Aggregate_Bool_Exp = {
  count?: InputMaybe<Journal_Aggregate_Bool_Exp_Count>;
};

export type Journal_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Journal_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Journal_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "journal" */
export type Journal_Aggregate_Fields = {
  __typename?: 'journal_aggregate_fields';
  avg?: Maybe<Journal_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Journal_Max_Fields>;
  min?: Maybe<Journal_Min_Fields>;
  stddev?: Maybe<Journal_Stddev_Fields>;
  stddev_pop?: Maybe<Journal_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Journal_Stddev_Samp_Fields>;
  sum?: Maybe<Journal_Sum_Fields>;
  var_pop?: Maybe<Journal_Var_Pop_Fields>;
  var_samp?: Maybe<Journal_Var_Samp_Fields>;
  variance?: Maybe<Journal_Variance_Fields>;
};

/** aggregate fields of "journal" */
export type Journal_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Journal_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "journal" */
export type Journal_Aggregate_Order_By = {
  avg?: InputMaybe<Journal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Journal_Max_Order_By>;
  min?: InputMaybe<Journal_Min_Order_By>;
  stddev?: InputMaybe<Journal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Journal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Journal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Journal_Sum_Order_By>;
  var_pop?: InputMaybe<Journal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Journal_Var_Samp_Order_By>;
  variance?: InputMaybe<Journal_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "journal" */
export type Journal_Arr_Rel_Insert_Input = {
  data: Array<Journal_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Journal_On_Conflict>;
};

/** aggregate avg on columns */
export type Journal_Avg_Fields = {
  __typename?: 'journal_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "journal" */
export type Journal_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "journal". All fields are combined with a logical 'AND'. */
export type Journal_Bool_Exp = {
  _and?: InputMaybe<Array<Journal_Bool_Exp>>;
  _not?: InputMaybe<Journal_Bool_Exp>;
  _or?: InputMaybe<Array<Journal_Bool_Exp>>;
  account?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Bigint_Comparison_Exp>;
  booked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  correlation_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  direction?: InputMaybe<Journal_Direction_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  loan?: InputMaybe<Loan_Bool_Exp>;
  loan_id?: InputMaybe<String_Comparison_Exp>;
  transaction_id?: InputMaybe<Int_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "journal" */
export enum Journal_Constraint {
  /** unique or primary key constraint on columns "id" */
  JournalPkey = 'journal_pkey',
}

/** Boolean expression to compare columns of type "journal_direction". All fields are combined with logical 'AND'. */
export type Journal_Direction_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['journal_direction']['input']>;
  _gt?: InputMaybe<Scalars['journal_direction']['input']>;
  _gte?: InputMaybe<Scalars['journal_direction']['input']>;
  _in?: InputMaybe<Array<Scalars['journal_direction']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['journal_direction']['input']>;
  _lte?: InputMaybe<Scalars['journal_direction']['input']>;
  _neq?: InputMaybe<Scalars['journal_direction']['input']>;
  _nin?: InputMaybe<Array<Scalars['journal_direction']['input']>>;
};

/** input type for incrementing numeric columns in table "journal" */
export type Journal_Inc_Input = {
  amount?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  transaction_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "journal" */
export type Journal_Insert_Input = {
  account?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['bigint']['input']>;
  booked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['journal_direction']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  loan?: InputMaybe<Loan_Obj_Rel_Insert_Input>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Journal_Max_Fields = {
  __typename?: 'journal_max_fields';
  account?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  booked_at?: Maybe<Scalars['timestamptz']['output']>;
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  direction?: Maybe<Scalars['journal_direction']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  transaction_id?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "journal" */
export type Journal_Max_Order_By = {
  account?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  booked_at?: InputMaybe<Order_By>;
  correlation_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Journal_Min_Fields = {
  __typename?: 'journal_min_fields';
  account?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  booked_at?: Maybe<Scalars['timestamptz']['output']>;
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  direction?: Maybe<Scalars['journal_direction']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  transaction_id?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "journal" */
export type Journal_Min_Order_By = {
  account?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  booked_at?: InputMaybe<Order_By>;
  correlation_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "journal" */
export type Journal_Mutation_Response = {
  __typename?: 'journal_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Journal>;
};

/** on_conflict condition type for table "journal" */
export type Journal_On_Conflict = {
  constraint: Journal_Constraint;
  update_columns?: Array<Journal_Update_Column>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

/** Ordering options when selecting data from "journal". */
export type Journal_Order_By = {
  account?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  booked_at?: InputMaybe<Order_By>;
  correlation_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  direction?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan?: InputMaybe<Loan_Order_By>;
  loan_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: journal */
export type Journal_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "journal" */
export enum Journal_Select_Column {
  /** column name */
  Account = 'account',
  /** column name */
  Amount = 'amount',
  /** column name */
  BookedAt = 'booked_at',
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  Direction = 'direction',
  /** column name */
  Id = 'id',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  Type = 'type',
}

/** input type for updating data in table "journal" */
export type Journal_Set_Input = {
  account?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['bigint']['input']>;
  booked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['journal_direction']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Journal_Stddev_Fields = {
  __typename?: 'journal_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "journal" */
export type Journal_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Journal_Stddev_Pop_Fields = {
  __typename?: 'journal_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "journal" */
export type Journal_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Journal_Stddev_Samp_Fields = {
  __typename?: 'journal_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "journal" */
export type Journal_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "journal" */
export type Journal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Journal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Journal_Stream_Cursor_Value_Input = {
  account?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['bigint']['input']>;
  booked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['journal_direction']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Journal_Sum_Fields = {
  __typename?: 'journal_sum_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  transaction_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "journal" */
export type Journal_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** update columns of table "journal" */
export enum Journal_Update_Column {
  /** column name */
  Account = 'account',
  /** column name */
  Amount = 'amount',
  /** column name */
  BookedAt = 'booked_at',
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  Direction = 'direction',
  /** column name */
  Id = 'id',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  Type = 'type',
}

export type Journal_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Journal_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Journal_Set_Input>;
  /** filter the rows which have to be updated */
  where: Journal_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Journal_Var_Pop_Fields = {
  __typename?: 'journal_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "journal" */
export type Journal_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Journal_Var_Samp_Fields = {
  __typename?: 'journal_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "journal" */
export type Journal_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Journal_Variance_Fields = {
  __typename?: 'journal_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  transaction_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "journal" */
export type Journal_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "journal_voucher_entries" */
export type Journal_Voucher_Entries = {
  __typename?: 'journal_voucher_entries';
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  created_by: Scalars['String']['output'];
  journal_entry_id?: Maybe<Scalars['Int']['output']>;
  journal_voucher_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "journal_voucher_entries" */
export type Journal_Voucher_Entries_Aggregate = {
  __typename?: 'journal_voucher_entries_aggregate';
  aggregate?: Maybe<Journal_Voucher_Entries_Aggregate_Fields>;
  nodes: Array<Journal_Voucher_Entries>;
};

/** aggregate fields of "journal_voucher_entries" */
export type Journal_Voucher_Entries_Aggregate_Fields = {
  __typename?: 'journal_voucher_entries_aggregate_fields';
  avg?: Maybe<Journal_Voucher_Entries_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Journal_Voucher_Entries_Max_Fields>;
  min?: Maybe<Journal_Voucher_Entries_Min_Fields>;
  stddev?: Maybe<Journal_Voucher_Entries_Stddev_Fields>;
  stddev_pop?: Maybe<Journal_Voucher_Entries_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Journal_Voucher_Entries_Stddev_Samp_Fields>;
  sum?: Maybe<Journal_Voucher_Entries_Sum_Fields>;
  var_pop?: Maybe<Journal_Voucher_Entries_Var_Pop_Fields>;
  var_samp?: Maybe<Journal_Voucher_Entries_Var_Samp_Fields>;
  variance?: Maybe<Journal_Voucher_Entries_Variance_Fields>;
};

/** aggregate fields of "journal_voucher_entries" */
export type Journal_Voucher_Entries_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Journal_Voucher_Entries_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Journal_Voucher_Entries_Avg_Fields = {
  __typename?: 'journal_voucher_entries_avg_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "journal_voucher_entries". All fields are combined with a logical 'AND'. */
export type Journal_Voucher_Entries_Bool_Exp = {
  _and?: InputMaybe<Array<Journal_Voucher_Entries_Bool_Exp>>;
  _not?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
  _or?: InputMaybe<Array<Journal_Voucher_Entries_Bool_Exp>>;
  correlation_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  journal_entry_id?: InputMaybe<Int_Comparison_Exp>;
  journal_voucher_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "journal_voucher_entries" */
export enum Journal_Voucher_Entries_Constraint {
  /** unique or primary key constraint on columns "journal_entry_id" */
  JournalVoucherEntriesJournalEntryIdKey = 'journal_voucher_entries_journal_entry_id_key',
}

/** input type for incrementing numeric columns in table "journal_voucher_entries" */
export type Journal_Voucher_Entries_Inc_Input = {
  journal_entry_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "journal_voucher_entries" */
export type Journal_Voucher_Entries_Insert_Input = {
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  journal_entry_id?: InputMaybe<Scalars['Int']['input']>;
  journal_voucher_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Journal_Voucher_Entries_Max_Fields = {
  __typename?: 'journal_voucher_entries_max_fields';
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  journal_entry_id?: Maybe<Scalars['Int']['output']>;
  journal_voucher_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Journal_Voucher_Entries_Min_Fields = {
  __typename?: 'journal_voucher_entries_min_fields';
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  journal_entry_id?: Maybe<Scalars['Int']['output']>;
  journal_voucher_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "journal_voucher_entries" */
export type Journal_Voucher_Entries_Mutation_Response = {
  __typename?: 'journal_voucher_entries_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Journal_Voucher_Entries>;
};

/** on_conflict condition type for table "journal_voucher_entries" */
export type Journal_Voucher_Entries_On_Conflict = {
  constraint: Journal_Voucher_Entries_Constraint;
  update_columns?: Array<Journal_Voucher_Entries_Update_Column>;
  where?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
};

/** Ordering options when selecting data from "journal_voucher_entries". */
export type Journal_Voucher_Entries_Order_By = {
  correlation_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  journal_entry_id?: InputMaybe<Order_By>;
  journal_voucher_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** select columns of table "journal_voucher_entries" */
export enum Journal_Voucher_Entries_Select_Column {
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  JournalEntryId = 'journal_entry_id',
  /** column name */
  JournalVoucherId = 'journal_voucher_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
}

/** input type for updating data in table "journal_voucher_entries" */
export type Journal_Voucher_Entries_Set_Input = {
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  journal_entry_id?: InputMaybe<Scalars['Int']['input']>;
  journal_voucher_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Journal_Voucher_Entries_Stddev_Fields = {
  __typename?: 'journal_voucher_entries_stddev_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Journal_Voucher_Entries_Stddev_Pop_Fields = {
  __typename?: 'journal_voucher_entries_stddev_pop_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Journal_Voucher_Entries_Stddev_Samp_Fields = {
  __typename?: 'journal_voucher_entries_stddev_samp_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "journal_voucher_entries" */
export type Journal_Voucher_Entries_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Journal_Voucher_Entries_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Journal_Voucher_Entries_Stream_Cursor_Value_Input = {
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  journal_entry_id?: InputMaybe<Scalars['Int']['input']>;
  journal_voucher_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Journal_Voucher_Entries_Sum_Fields = {
  __typename?: 'journal_voucher_entries_sum_fields';
  journal_entry_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "journal_voucher_entries" */
export enum Journal_Voucher_Entries_Update_Column {
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  JournalEntryId = 'journal_entry_id',
  /** column name */
  JournalVoucherId = 'journal_voucher_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
}

export type Journal_Voucher_Entries_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Journal_Voucher_Entries_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Journal_Voucher_Entries_Set_Input>;
  /** filter the rows which have to be updated */
  where: Journal_Voucher_Entries_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Journal_Voucher_Entries_Var_Pop_Fields = {
  __typename?: 'journal_voucher_entries_var_pop_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Journal_Voucher_Entries_Var_Samp_Fields = {
  __typename?: 'journal_voucher_entries_var_samp_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Journal_Voucher_Entries_Variance_Fields = {
  __typename?: 'journal_voucher_entries_variance_fields';
  journal_entry_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']['input']>;
  _gt?: InputMaybe<Scalars['json']['input']>;
  _gte?: InputMaybe<Scalars['json']['input']>;
  _in?: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['json']['input']>;
  _lte?: InputMaybe<Scalars['json']['input']>;
  _neq?: InputMaybe<Scalars['json']['input']>;
  _nin?: InputMaybe<Array<Scalars['json']['input']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "keto_relation_tuples" */
export type Keto_Relation_Tuples = {
  __typename?: 'keto_relation_tuples';
  commit_time: Scalars['timestamp']['output'];
  namespace: Scalars['String']['output'];
  nid: Scalars['uuid']['output'];
  object: Scalars['uuid']['output'];
  relation: Scalars['String']['output'];
  shard_id: Scalars['uuid']['output'];
  subject_id?: Maybe<Scalars['uuid']['output']>;
  subject_set_namespace?: Maybe<Scalars['String']['output']>;
  subject_set_object?: Maybe<Scalars['uuid']['output']>;
  subject_set_relation?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "keto_relation_tuples" */
export type Keto_Relation_Tuples_Aggregate = {
  __typename?: 'keto_relation_tuples_aggregate';
  aggregate?: Maybe<Keto_Relation_Tuples_Aggregate_Fields>;
  nodes: Array<Keto_Relation_Tuples>;
};

/** aggregate fields of "keto_relation_tuples" */
export type Keto_Relation_Tuples_Aggregate_Fields = {
  __typename?: 'keto_relation_tuples_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Keto_Relation_Tuples_Max_Fields>;
  min?: Maybe<Keto_Relation_Tuples_Min_Fields>;
};

/** aggregate fields of "keto_relation_tuples" */
export type Keto_Relation_Tuples_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Keto_Relation_Tuples_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "keto_relation_tuples". All fields are combined with a logical 'AND'. */
export type Keto_Relation_Tuples_Bool_Exp = {
  _and?: InputMaybe<Array<Keto_Relation_Tuples_Bool_Exp>>;
  _not?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
  _or?: InputMaybe<Array<Keto_Relation_Tuples_Bool_Exp>>;
  commit_time?: InputMaybe<Timestamp_Comparison_Exp>;
  namespace?: InputMaybe<String_Comparison_Exp>;
  nid?: InputMaybe<Uuid_Comparison_Exp>;
  object?: InputMaybe<Uuid_Comparison_Exp>;
  relation?: InputMaybe<String_Comparison_Exp>;
  shard_id?: InputMaybe<Uuid_Comparison_Exp>;
  subject_id?: InputMaybe<Uuid_Comparison_Exp>;
  subject_set_namespace?: InputMaybe<String_Comparison_Exp>;
  subject_set_object?: InputMaybe<Uuid_Comparison_Exp>;
  subject_set_relation?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "keto_relation_tuples" */
export enum Keto_Relation_Tuples_Constraint {
  /** unique or primary key constraint on columns "nid", "shard_id" */
  KetoRelationTuplesUuidPkey = 'keto_relation_tuples_uuid_pkey',
}

/** input type for inserting data into table "keto_relation_tuples" */
export type Keto_Relation_Tuples_Insert_Input = {
  commit_time?: InputMaybe<Scalars['timestamp']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  object?: InputMaybe<Scalars['uuid']['input']>;
  relation?: InputMaybe<Scalars['String']['input']>;
  shard_id?: InputMaybe<Scalars['uuid']['input']>;
  subject_id?: InputMaybe<Scalars['uuid']['input']>;
  subject_set_namespace?: InputMaybe<Scalars['String']['input']>;
  subject_set_object?: InputMaybe<Scalars['uuid']['input']>;
  subject_set_relation?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Keto_Relation_Tuples_Max_Fields = {
  __typename?: 'keto_relation_tuples_max_fields';
  commit_time?: Maybe<Scalars['timestamp']['output']>;
  namespace?: Maybe<Scalars['String']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  object?: Maybe<Scalars['uuid']['output']>;
  relation?: Maybe<Scalars['String']['output']>;
  shard_id?: Maybe<Scalars['uuid']['output']>;
  subject_id?: Maybe<Scalars['uuid']['output']>;
  subject_set_namespace?: Maybe<Scalars['String']['output']>;
  subject_set_object?: Maybe<Scalars['uuid']['output']>;
  subject_set_relation?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Keto_Relation_Tuples_Min_Fields = {
  __typename?: 'keto_relation_tuples_min_fields';
  commit_time?: Maybe<Scalars['timestamp']['output']>;
  namespace?: Maybe<Scalars['String']['output']>;
  nid?: Maybe<Scalars['uuid']['output']>;
  object?: Maybe<Scalars['uuid']['output']>;
  relation?: Maybe<Scalars['String']['output']>;
  shard_id?: Maybe<Scalars['uuid']['output']>;
  subject_id?: Maybe<Scalars['uuid']['output']>;
  subject_set_namespace?: Maybe<Scalars['String']['output']>;
  subject_set_object?: Maybe<Scalars['uuid']['output']>;
  subject_set_relation?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "keto_relation_tuples" */
export type Keto_Relation_Tuples_Mutation_Response = {
  __typename?: 'keto_relation_tuples_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Keto_Relation_Tuples>;
};

/** on_conflict condition type for table "keto_relation_tuples" */
export type Keto_Relation_Tuples_On_Conflict = {
  constraint: Keto_Relation_Tuples_Constraint;
  update_columns?: Array<Keto_Relation_Tuples_Update_Column>;
  where?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
};

/** Ordering options when selecting data from "keto_relation_tuples". */
export type Keto_Relation_Tuples_Order_By = {
  commit_time?: InputMaybe<Order_By>;
  namespace?: InputMaybe<Order_By>;
  nid?: InputMaybe<Order_By>;
  object?: InputMaybe<Order_By>;
  relation?: InputMaybe<Order_By>;
  shard_id?: InputMaybe<Order_By>;
  subject_id?: InputMaybe<Order_By>;
  subject_set_namespace?: InputMaybe<Order_By>;
  subject_set_object?: InputMaybe<Order_By>;
  subject_set_relation?: InputMaybe<Order_By>;
};

/** primary key columns input for table: keto_relation_tuples */
export type Keto_Relation_Tuples_Pk_Columns_Input = {
  nid: Scalars['uuid']['input'];
  shard_id: Scalars['uuid']['input'];
};

/** select columns of table "keto_relation_tuples" */
export enum Keto_Relation_Tuples_Select_Column {
  /** column name */
  CommitTime = 'commit_time',
  /** column name */
  Namespace = 'namespace',
  /** column name */
  Nid = 'nid',
  /** column name */
  Object = 'object',
  /** column name */
  Relation = 'relation',
  /** column name */
  ShardId = 'shard_id',
  /** column name */
  SubjectId = 'subject_id',
  /** column name */
  SubjectSetNamespace = 'subject_set_namespace',
  /** column name */
  SubjectSetObject = 'subject_set_object',
  /** column name */
  SubjectSetRelation = 'subject_set_relation',
}

/** input type for updating data in table "keto_relation_tuples" */
export type Keto_Relation_Tuples_Set_Input = {
  commit_time?: InputMaybe<Scalars['timestamp']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  object?: InputMaybe<Scalars['uuid']['input']>;
  relation?: InputMaybe<Scalars['String']['input']>;
  shard_id?: InputMaybe<Scalars['uuid']['input']>;
  subject_id?: InputMaybe<Scalars['uuid']['input']>;
  subject_set_namespace?: InputMaybe<Scalars['String']['input']>;
  subject_set_object?: InputMaybe<Scalars['uuid']['input']>;
  subject_set_relation?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "keto_relation_tuples" */
export type Keto_Relation_Tuples_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Keto_Relation_Tuples_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Keto_Relation_Tuples_Stream_Cursor_Value_Input = {
  commit_time?: InputMaybe<Scalars['timestamp']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  nid?: InputMaybe<Scalars['uuid']['input']>;
  object?: InputMaybe<Scalars['uuid']['input']>;
  relation?: InputMaybe<Scalars['String']['input']>;
  shard_id?: InputMaybe<Scalars['uuid']['input']>;
  subject_id?: InputMaybe<Scalars['uuid']['input']>;
  subject_set_namespace?: InputMaybe<Scalars['String']['input']>;
  subject_set_object?: InputMaybe<Scalars['uuid']['input']>;
  subject_set_relation?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "keto_relation_tuples" */
export enum Keto_Relation_Tuples_Update_Column {
  /** column name */
  CommitTime = 'commit_time',
  /** column name */
  Namespace = 'namespace',
  /** column name */
  Nid = 'nid',
  /** column name */
  Object = 'object',
  /** column name */
  Relation = 'relation',
  /** column name */
  ShardId = 'shard_id',
  /** column name */
  SubjectId = 'subject_id',
  /** column name */
  SubjectSetNamespace = 'subject_set_namespace',
  /** column name */
  SubjectSetObject = 'subject_set_object',
  /** column name */
  SubjectSetRelation = 'subject_set_relation',
}

export type Keto_Relation_Tuples_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Keto_Relation_Tuples_Set_Input>;
  /** filter the rows which have to be updated */
  where: Keto_Relation_Tuples_Bool_Exp;
};

/** columns and relationships of "keto_uuid_mappings" */
export type Keto_Uuid_Mappings = {
  __typename?: 'keto_uuid_mappings';
  id: Scalars['uuid']['output'];
  string_representation: Scalars['String']['output'];
};

/** aggregated selection of "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Aggregate = {
  __typename?: 'keto_uuid_mappings_aggregate';
  aggregate?: Maybe<Keto_Uuid_Mappings_Aggregate_Fields>;
  nodes: Array<Keto_Uuid_Mappings>;
};

/** aggregate fields of "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Aggregate_Fields = {
  __typename?: 'keto_uuid_mappings_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Keto_Uuid_Mappings_Max_Fields>;
  min?: Maybe<Keto_Uuid_Mappings_Min_Fields>;
};

/** aggregate fields of "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Keto_Uuid_Mappings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "keto_uuid_mappings". All fields are combined with a logical 'AND'. */
export type Keto_Uuid_Mappings_Bool_Exp = {
  _and?: InputMaybe<Array<Keto_Uuid_Mappings_Bool_Exp>>;
  _not?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
  _or?: InputMaybe<Array<Keto_Uuid_Mappings_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  string_representation?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "keto_uuid_mappings" */
export enum Keto_Uuid_Mappings_Constraint {
  /** unique or primary key constraint on columns "id" */
  KetoUuidMappingsPkey = 'keto_uuid_mappings_pkey',
}

/** input type for inserting data into table "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  string_representation?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Keto_Uuid_Mappings_Max_Fields = {
  __typename?: 'keto_uuid_mappings_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  string_representation?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Keto_Uuid_Mappings_Min_Fields = {
  __typename?: 'keto_uuid_mappings_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  string_representation?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Mutation_Response = {
  __typename?: 'keto_uuid_mappings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Keto_Uuid_Mappings>;
};

/** on_conflict condition type for table "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_On_Conflict = {
  constraint: Keto_Uuid_Mappings_Constraint;
  update_columns?: Array<Keto_Uuid_Mappings_Update_Column>;
  where?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
};

/** Ordering options when selecting data from "keto_uuid_mappings". */
export type Keto_Uuid_Mappings_Order_By = {
  id?: InputMaybe<Order_By>;
  string_representation?: InputMaybe<Order_By>;
};

/** primary key columns input for table: keto_uuid_mappings */
export type Keto_Uuid_Mappings_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "keto_uuid_mappings" */
export enum Keto_Uuid_Mappings_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  StringRepresentation = 'string_representation',
}

/** input type for updating data in table "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  string_representation?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "keto_uuid_mappings" */
export type Keto_Uuid_Mappings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Keto_Uuid_Mappings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Keto_Uuid_Mappings_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  string_representation?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "keto_uuid_mappings" */
export enum Keto_Uuid_Mappings_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  StringRepresentation = 'string_representation',
}

export type Keto_Uuid_Mappings_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Keto_Uuid_Mappings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Keto_Uuid_Mappings_Bool_Exp;
};

/** columns and relationships of "loan" */
export type Loan = {
  __typename?: 'loan';
  booked_at: Scalars['timestamptz']['output'];
  commercial_offer_id?: Maybe<Scalars['String']['output']>;
  consumer?: Maybe<Consumers>;
  consumer_id: Scalars['String']['output'];
  correlation_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by: Scalars['String']['output'];
  financial_product_key: Scalars['String']['output'];
  financial_product_version: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** An array relationship */
  journals: Array<Journal>;
  /** An aggregate relationship */
  journals_aggregate: Journal_Aggregate;
  /** An array relationship */
  loan_schedules: Array<Loan_Schedule>;
  /** An aggregate relationship */
  loan_schedules_aggregate: Loan_Schedule_Aggregate;
  /** An array relationship */
  loan_statuses: Array<Loan_Status>;
  /** An aggregate relationship */
  loan_statuses_aggregate: Loan_Status_Aggregate;
  merchant_global_id: Scalars['String']['output'];
  /** An object relationship */
  merchant_transaction_slip?: Maybe<Merchant_Transaction_Slip>;
  new_loan_id?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "loan" */
export type LoanJournalsArgs = {
  distinct_on?: InputMaybe<Array<Journal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Order_By>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

/** columns and relationships of "loan" */
export type LoanJournals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Order_By>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

/** columns and relationships of "loan" */
export type LoanLoan_SchedulesArgs = {
  distinct_on?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Schedule_Order_By>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

/** columns and relationships of "loan" */
export type LoanLoan_Schedules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Schedule_Order_By>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

/** columns and relationships of "loan" */
export type LoanLoan_StatusesArgs = {
  distinct_on?: InputMaybe<Array<Loan_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Status_Order_By>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

/** columns and relationships of "loan" */
export type LoanLoan_Statuses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Status_Order_By>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

/** aggregated selection of "loan" */
export type Loan_Aggregate = {
  __typename?: 'loan_aggregate';
  aggregate?: Maybe<Loan_Aggregate_Fields>;
  nodes: Array<Loan>;
};

/** aggregate fields of "loan" */
export type Loan_Aggregate_Fields = {
  __typename?: 'loan_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Loan_Max_Fields>;
  min?: Maybe<Loan_Min_Fields>;
};

/** aggregate fields of "loan" */
export type Loan_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Loan_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "loan". All fields are combined with a logical 'AND'. */
export type Loan_Bool_Exp = {
  _and?: InputMaybe<Array<Loan_Bool_Exp>>;
  _not?: InputMaybe<Loan_Bool_Exp>;
  _or?: InputMaybe<Array<Loan_Bool_Exp>>;
  booked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  commercial_offer_id?: InputMaybe<String_Comparison_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  correlation_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  financial_product_key?: InputMaybe<String_Comparison_Exp>;
  financial_product_version?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  journals?: InputMaybe<Journal_Bool_Exp>;
  journals_aggregate?: InputMaybe<Journal_Aggregate_Bool_Exp>;
  loan_schedules?: InputMaybe<Loan_Schedule_Bool_Exp>;
  loan_schedules_aggregate?: InputMaybe<Loan_Schedule_Aggregate_Bool_Exp>;
  loan_statuses?: InputMaybe<Loan_Status_Bool_Exp>;
  loan_statuses_aggregate?: InputMaybe<Loan_Status_Aggregate_Bool_Exp>;
  merchant_global_id?: InputMaybe<String_Comparison_Exp>;
  merchant_transaction_slip?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
  new_loan_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "loan" */
export enum Loan_Constraint {
  /** unique or primary key constraint on columns "new_loan_id" */
  LoanNewLoanIdKey = 'loan_new_loan_id_key',
  /** unique or primary key constraint on columns "id" */
  LoanPkey = 'loan_pkey',
}

/** input type for inserting data into table "loan" */
export type Loan_Insert_Input = {
  booked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  commercial_offer_id?: InputMaybe<Scalars['String']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  financial_product_key?: InputMaybe<Scalars['String']['input']>;
  financial_product_version?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  journals?: InputMaybe<Journal_Arr_Rel_Insert_Input>;
  loan_schedules?: InputMaybe<Loan_Schedule_Arr_Rel_Insert_Input>;
  loan_statuses?: InputMaybe<Loan_Status_Arr_Rel_Insert_Input>;
  merchant_global_id?: InputMaybe<Scalars['String']['input']>;
  merchant_transaction_slip?: InputMaybe<Merchant_Transaction_Slip_Obj_Rel_Insert_Input>;
  new_loan_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Loan_Max_Fields = {
  __typename?: 'loan_max_fields';
  booked_at?: Maybe<Scalars['timestamptz']['output']>;
  commercial_offer_id?: Maybe<Scalars['String']['output']>;
  consumer_id?: Maybe<Scalars['String']['output']>;
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  financial_product_key?: Maybe<Scalars['String']['output']>;
  financial_product_version?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  merchant_global_id?: Maybe<Scalars['String']['output']>;
  new_loan_id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Loan_Min_Fields = {
  __typename?: 'loan_min_fields';
  booked_at?: Maybe<Scalars['timestamptz']['output']>;
  commercial_offer_id?: Maybe<Scalars['String']['output']>;
  consumer_id?: Maybe<Scalars['String']['output']>;
  correlation_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  financial_product_key?: Maybe<Scalars['String']['output']>;
  financial_product_version?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  merchant_global_id?: Maybe<Scalars['String']['output']>;
  new_loan_id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "loan" */
export type Loan_Mutation_Response = {
  __typename?: 'loan_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Loan>;
};

/** input type for inserting object relation for remote table "loan" */
export type Loan_Obj_Rel_Insert_Input = {
  data: Loan_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Loan_On_Conflict>;
};

/** on_conflict condition type for table "loan" */
export type Loan_On_Conflict = {
  constraint: Loan_Constraint;
  update_columns?: Array<Loan_Update_Column>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

/** Ordering options when selecting data from "loan". */
export type Loan_Order_By = {
  booked_at?: InputMaybe<Order_By>;
  commercial_offer_id?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  correlation_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  financial_product_key?: InputMaybe<Order_By>;
  financial_product_version?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  journals_aggregate?: InputMaybe<Journal_Aggregate_Order_By>;
  loan_schedules_aggregate?: InputMaybe<Loan_Schedule_Aggregate_Order_By>;
  loan_statuses_aggregate?: InputMaybe<Loan_Status_Aggregate_Order_By>;
  merchant_global_id?: InputMaybe<Order_By>;
  merchant_transaction_slip?: InputMaybe<Merchant_Transaction_Slip_Order_By>;
  new_loan_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: loan */
export type Loan_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** columns and relationships of "loan_schedule" */
export type Loan_Schedule = {
  __typename?: 'loan_schedule';
  created_at: Scalars['timestamptz']['output'];
  created_by: Scalars['String']['output'];
  due_date: Scalars['timestamptz']['output'];
  due_interest: Scalars['bigint']['output'];
  due_late_fee?: Maybe<Scalars['bigint']['output']>;
  due_principal: Scalars['bigint']['output'];
  grace_period_end_date: Scalars['timestamptz']['output'];
  id: Scalars['Int']['output'];
  is_cancelled: Scalars['Boolean']['output'];
  /** An object relationship */
  loan: Loan;
  loan_balance: Scalars['bigint']['output'];
  loan_id: Scalars['String']['output'];
  paid_date?: Maybe<Scalars['timestamptz']['output']>;
  paid_interest?: Maybe<Scalars['bigint']['output']>;
  paid_late_fee?: Maybe<Scalars['bigint']['output']>;
  paid_principal?: Maybe<Scalars['bigint']['output']>;
  ref_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "loan_schedule" */
export type Loan_Schedule_Aggregate = {
  __typename?: 'loan_schedule_aggregate';
  aggregate?: Maybe<Loan_Schedule_Aggregate_Fields>;
  nodes: Array<Loan_Schedule>;
};

export type Loan_Schedule_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Loan_Schedule_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Loan_Schedule_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Loan_Schedule_Aggregate_Bool_Exp_Count>;
};

export type Loan_Schedule_Aggregate_Bool_Exp_Bool_And = {
  arguments: Loan_Schedule_Select_Column_Loan_Schedule_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Loan_Schedule_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Loan_Schedule_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Loan_Schedule_Select_Column_Loan_Schedule_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Loan_Schedule_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Loan_Schedule_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Loan_Schedule_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "loan_schedule" */
export type Loan_Schedule_Aggregate_Fields = {
  __typename?: 'loan_schedule_aggregate_fields';
  avg?: Maybe<Loan_Schedule_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Loan_Schedule_Max_Fields>;
  min?: Maybe<Loan_Schedule_Min_Fields>;
  stddev?: Maybe<Loan_Schedule_Stddev_Fields>;
  stddev_pop?: Maybe<Loan_Schedule_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Loan_Schedule_Stddev_Samp_Fields>;
  sum?: Maybe<Loan_Schedule_Sum_Fields>;
  var_pop?: Maybe<Loan_Schedule_Var_Pop_Fields>;
  var_samp?: Maybe<Loan_Schedule_Var_Samp_Fields>;
  variance?: Maybe<Loan_Schedule_Variance_Fields>;
};

/** aggregate fields of "loan_schedule" */
export type Loan_Schedule_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "loan_schedule" */
export type Loan_Schedule_Aggregate_Order_By = {
  avg?: InputMaybe<Loan_Schedule_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Loan_Schedule_Max_Order_By>;
  min?: InputMaybe<Loan_Schedule_Min_Order_By>;
  stddev?: InputMaybe<Loan_Schedule_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Loan_Schedule_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Loan_Schedule_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Loan_Schedule_Sum_Order_By>;
  var_pop?: InputMaybe<Loan_Schedule_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Loan_Schedule_Var_Samp_Order_By>;
  variance?: InputMaybe<Loan_Schedule_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "loan_schedule" */
export type Loan_Schedule_Arr_Rel_Insert_Input = {
  data: Array<Loan_Schedule_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Loan_Schedule_On_Conflict>;
};

/** aggregate avg on columns */
export type Loan_Schedule_Avg_Fields = {
  __typename?: 'loan_schedule_avg_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "loan_schedule" */
export type Loan_Schedule_Avg_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "loan_schedule". All fields are combined with a logical 'AND'. */
export type Loan_Schedule_Bool_Exp = {
  _and?: InputMaybe<Array<Loan_Schedule_Bool_Exp>>;
  _not?: InputMaybe<Loan_Schedule_Bool_Exp>;
  _or?: InputMaybe<Array<Loan_Schedule_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  due_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  due_interest?: InputMaybe<Bigint_Comparison_Exp>;
  due_late_fee?: InputMaybe<Bigint_Comparison_Exp>;
  due_principal?: InputMaybe<Bigint_Comparison_Exp>;
  grace_period_end_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  is_cancelled?: InputMaybe<Boolean_Comparison_Exp>;
  loan?: InputMaybe<Loan_Bool_Exp>;
  loan_balance?: InputMaybe<Bigint_Comparison_Exp>;
  loan_id?: InputMaybe<String_Comparison_Exp>;
  paid_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  paid_interest?: InputMaybe<Bigint_Comparison_Exp>;
  paid_late_fee?: InputMaybe<Bigint_Comparison_Exp>;
  paid_principal?: InputMaybe<Bigint_Comparison_Exp>;
  ref_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "loan_schedule" */
export enum Loan_Schedule_Constraint {
  /** unique or primary key constraint on columns "id" */
  LoanSchedulePkey = 'loan_schedule_pkey',
}

/** input type for incrementing numeric columns in table "loan_schedule" */
export type Loan_Schedule_Inc_Input = {
  due_interest?: InputMaybe<Scalars['bigint']['input']>;
  due_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  due_principal?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  loan_balance?: InputMaybe<Scalars['bigint']['input']>;
  paid_interest?: InputMaybe<Scalars['bigint']['input']>;
  paid_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  paid_principal?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "loan_schedule" */
export type Loan_Schedule_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['timestamptz']['input']>;
  due_interest?: InputMaybe<Scalars['bigint']['input']>;
  due_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  due_principal?: InputMaybe<Scalars['bigint']['input']>;
  grace_period_end_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  is_cancelled?: InputMaybe<Scalars['Boolean']['input']>;
  loan?: InputMaybe<Loan_Obj_Rel_Insert_Input>;
  loan_balance?: InputMaybe<Scalars['bigint']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  paid_date?: InputMaybe<Scalars['timestamptz']['input']>;
  paid_interest?: InputMaybe<Scalars['bigint']['input']>;
  paid_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  paid_principal?: InputMaybe<Scalars['bigint']['input']>;
  ref_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Loan_Schedule_Max_Fields = {
  __typename?: 'loan_schedule_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  due_date?: Maybe<Scalars['timestamptz']['output']>;
  due_interest?: Maybe<Scalars['bigint']['output']>;
  due_late_fee?: Maybe<Scalars['bigint']['output']>;
  due_principal?: Maybe<Scalars['bigint']['output']>;
  grace_period_end_date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  loan_balance?: Maybe<Scalars['bigint']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  paid_date?: Maybe<Scalars['timestamptz']['output']>;
  paid_interest?: Maybe<Scalars['bigint']['output']>;
  paid_late_fee?: Maybe<Scalars['bigint']['output']>;
  paid_principal?: Maybe<Scalars['bigint']['output']>;
  ref_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "loan_schedule" */
export type Loan_Schedule_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  due_date?: InputMaybe<Order_By>;
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  grace_period_end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  paid_date?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
  ref_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Loan_Schedule_Min_Fields = {
  __typename?: 'loan_schedule_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  due_date?: Maybe<Scalars['timestamptz']['output']>;
  due_interest?: Maybe<Scalars['bigint']['output']>;
  due_late_fee?: Maybe<Scalars['bigint']['output']>;
  due_principal?: Maybe<Scalars['bigint']['output']>;
  grace_period_end_date?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  loan_balance?: Maybe<Scalars['bigint']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  paid_date?: Maybe<Scalars['timestamptz']['output']>;
  paid_interest?: Maybe<Scalars['bigint']['output']>;
  paid_late_fee?: Maybe<Scalars['bigint']['output']>;
  paid_principal?: Maybe<Scalars['bigint']['output']>;
  ref_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "loan_schedule" */
export type Loan_Schedule_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  due_date?: InputMaybe<Order_By>;
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  grace_period_end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  paid_date?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
  ref_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "loan_schedule" */
export type Loan_Schedule_Mutation_Response = {
  __typename?: 'loan_schedule_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Loan_Schedule>;
};

/** on_conflict condition type for table "loan_schedule" */
export type Loan_Schedule_On_Conflict = {
  constraint: Loan_Schedule_Constraint;
  update_columns?: Array<Loan_Schedule_Update_Column>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

/** Ordering options when selecting data from "loan_schedule". */
export type Loan_Schedule_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  due_date?: InputMaybe<Order_By>;
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  grace_period_end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_cancelled?: InputMaybe<Order_By>;
  loan?: InputMaybe<Loan_Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  paid_date?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
  ref_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: loan_schedule */
export type Loan_Schedule_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "loan_schedule" */
export enum Loan_Schedule_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  DueDate = 'due_date',
  /** column name */
  DueInterest = 'due_interest',
  /** column name */
  DueLateFee = 'due_late_fee',
  /** column name */
  DuePrincipal = 'due_principal',
  /** column name */
  GracePeriodEndDate = 'grace_period_end_date',
  /** column name */
  Id = 'id',
  /** column name */
  IsCancelled = 'is_cancelled',
  /** column name */
  LoanBalance = 'loan_balance',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  PaidDate = 'paid_date',
  /** column name */
  PaidInterest = 'paid_interest',
  /** column name */
  PaidLateFee = 'paid_late_fee',
  /** column name */
  PaidPrincipal = 'paid_principal',
  /** column name */
  RefId = 'ref_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
}

/** select "loan_schedule_aggregate_bool_exp_bool_and_arguments_columns" columns of table "loan_schedule" */
export enum Loan_Schedule_Select_Column_Loan_Schedule_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsCancelled = 'is_cancelled',
}

/** select "loan_schedule_aggregate_bool_exp_bool_or_arguments_columns" columns of table "loan_schedule" */
export enum Loan_Schedule_Select_Column_Loan_Schedule_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsCancelled = 'is_cancelled',
}

/** input type for updating data in table "loan_schedule" */
export type Loan_Schedule_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['timestamptz']['input']>;
  due_interest?: InputMaybe<Scalars['bigint']['input']>;
  due_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  due_principal?: InputMaybe<Scalars['bigint']['input']>;
  grace_period_end_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  is_cancelled?: InputMaybe<Scalars['Boolean']['input']>;
  loan_balance?: InputMaybe<Scalars['bigint']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  paid_date?: InputMaybe<Scalars['timestamptz']['input']>;
  paid_interest?: InputMaybe<Scalars['bigint']['input']>;
  paid_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  paid_principal?: InputMaybe<Scalars['bigint']['input']>;
  ref_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Loan_Schedule_Stddev_Fields = {
  __typename?: 'loan_schedule_stddev_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "loan_schedule" */
export type Loan_Schedule_Stddev_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Loan_Schedule_Stddev_Pop_Fields = {
  __typename?: 'loan_schedule_stddev_pop_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "loan_schedule" */
export type Loan_Schedule_Stddev_Pop_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Loan_Schedule_Stddev_Samp_Fields = {
  __typename?: 'loan_schedule_stddev_samp_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "loan_schedule" */
export type Loan_Schedule_Stddev_Samp_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "loan_schedule" */
export type Loan_Schedule_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Loan_Schedule_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Loan_Schedule_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  due_date?: InputMaybe<Scalars['timestamptz']['input']>;
  due_interest?: InputMaybe<Scalars['bigint']['input']>;
  due_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  due_principal?: InputMaybe<Scalars['bigint']['input']>;
  grace_period_end_date?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  is_cancelled?: InputMaybe<Scalars['Boolean']['input']>;
  loan_balance?: InputMaybe<Scalars['bigint']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  paid_date?: InputMaybe<Scalars['timestamptz']['input']>;
  paid_interest?: InputMaybe<Scalars['bigint']['input']>;
  paid_late_fee?: InputMaybe<Scalars['bigint']['input']>;
  paid_principal?: InputMaybe<Scalars['bigint']['input']>;
  ref_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Loan_Schedule_Sum_Fields = {
  __typename?: 'loan_schedule_sum_fields';
  due_interest?: Maybe<Scalars['bigint']['output']>;
  due_late_fee?: Maybe<Scalars['bigint']['output']>;
  due_principal?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  loan_balance?: Maybe<Scalars['bigint']['output']>;
  paid_interest?: Maybe<Scalars['bigint']['output']>;
  paid_late_fee?: Maybe<Scalars['bigint']['output']>;
  paid_principal?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "loan_schedule" */
export type Loan_Schedule_Sum_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** update columns of table "loan_schedule" */
export enum Loan_Schedule_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  DueDate = 'due_date',
  /** column name */
  DueInterest = 'due_interest',
  /** column name */
  DueLateFee = 'due_late_fee',
  /** column name */
  DuePrincipal = 'due_principal',
  /** column name */
  GracePeriodEndDate = 'grace_period_end_date',
  /** column name */
  Id = 'id',
  /** column name */
  IsCancelled = 'is_cancelled',
  /** column name */
  LoanBalance = 'loan_balance',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  PaidDate = 'paid_date',
  /** column name */
  PaidInterest = 'paid_interest',
  /** column name */
  PaidLateFee = 'paid_late_fee',
  /** column name */
  PaidPrincipal = 'paid_principal',
  /** column name */
  RefId = 'ref_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
}

export type Loan_Schedule_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Loan_Schedule_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Loan_Schedule_Set_Input>;
  /** filter the rows which have to be updated */
  where: Loan_Schedule_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Loan_Schedule_Var_Pop_Fields = {
  __typename?: 'loan_schedule_var_pop_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "loan_schedule" */
export type Loan_Schedule_Var_Pop_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Loan_Schedule_Var_Samp_Fields = {
  __typename?: 'loan_schedule_var_samp_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "loan_schedule" */
export type Loan_Schedule_Var_Samp_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Loan_Schedule_Variance_Fields = {
  __typename?: 'loan_schedule_variance_fields';
  due_interest?: Maybe<Scalars['Float']['output']>;
  due_late_fee?: Maybe<Scalars['Float']['output']>;
  due_principal?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  loan_balance?: Maybe<Scalars['Float']['output']>;
  paid_interest?: Maybe<Scalars['Float']['output']>;
  paid_late_fee?: Maybe<Scalars['Float']['output']>;
  paid_principal?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "loan_schedule" */
export type Loan_Schedule_Variance_Order_By = {
  due_interest?: InputMaybe<Order_By>;
  due_late_fee?: InputMaybe<Order_By>;
  due_principal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_balance?: InputMaybe<Order_By>;
  paid_interest?: InputMaybe<Order_By>;
  paid_late_fee?: InputMaybe<Order_By>;
  paid_principal?: InputMaybe<Order_By>;
};

/** select columns of table "loan" */
export enum Loan_Select_Column {
  /** column name */
  BookedAt = 'booked_at',
  /** column name */
  CommercialOfferId = 'commercial_offer_id',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  FinancialProductKey = 'financial_product_key',
  /** column name */
  FinancialProductVersion = 'financial_product_version',
  /** column name */
  Id = 'id',
  /** column name */
  MerchantGlobalId = 'merchant_global_id',
  /** column name */
  NewLoanId = 'new_loan_id',
}

/** input type for updating data in table "loan" */
export type Loan_Set_Input = {
  booked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  commercial_offer_id?: InputMaybe<Scalars['String']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  financial_product_key?: InputMaybe<Scalars['String']['input']>;
  financial_product_version?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchant_global_id?: InputMaybe<Scalars['String']['input']>;
  new_loan_id?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "loan_status" */
export type Loan_Status = {
  __typename?: 'loan_status';
  created_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  loan: Loan;
  loan_id: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

/** aggregated selection of "loan_status" */
export type Loan_Status_Aggregate = {
  __typename?: 'loan_status_aggregate';
  aggregate?: Maybe<Loan_Status_Aggregate_Fields>;
  nodes: Array<Loan_Status>;
};

export type Loan_Status_Aggregate_Bool_Exp = {
  count?: InputMaybe<Loan_Status_Aggregate_Bool_Exp_Count>;
};

export type Loan_Status_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Loan_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Loan_Status_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "loan_status" */
export type Loan_Status_Aggregate_Fields = {
  __typename?: 'loan_status_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Loan_Status_Max_Fields>;
  min?: Maybe<Loan_Status_Min_Fields>;
};

/** aggregate fields of "loan_status" */
export type Loan_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Loan_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "loan_status" */
export type Loan_Status_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Loan_Status_Max_Order_By>;
  min?: InputMaybe<Loan_Status_Min_Order_By>;
};

/** input type for inserting array relation for remote table "loan_status" */
export type Loan_Status_Arr_Rel_Insert_Input = {
  data: Array<Loan_Status_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Loan_Status_On_Conflict>;
};

/** Boolean expression to filter rows from the table "loan_status". All fields are combined with a logical 'AND'. */
export type Loan_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Loan_Status_Bool_Exp>>;
  _not?: InputMaybe<Loan_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Loan_Status_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  loan?: InputMaybe<Loan_Bool_Exp>;
  loan_id?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "loan_status" */
export enum Loan_Status_Constraint {
  /** unique or primary key constraint on columns "loan_id", "status" */
  PkLoanStatus = 'pk_loan_status',
}

/** input type for inserting data into table "loan_status" */
export type Loan_Status_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  loan?: InputMaybe<Loan_Obj_Rel_Insert_Input>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Loan_Status_Max_Fields = {
  __typename?: 'loan_status_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "loan_status" */
export type Loan_Status_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Loan_Status_Min_Fields = {
  __typename?: 'loan_status_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "loan_status" */
export type Loan_Status_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "loan_status" */
export type Loan_Status_Mutation_Response = {
  __typename?: 'loan_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Loan_Status>;
};

/** on_conflict condition type for table "loan_status" */
export type Loan_Status_On_Conflict = {
  constraint: Loan_Status_Constraint;
  update_columns?: Array<Loan_Status_Update_Column>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "loan_status". */
export type Loan_Status_Order_By = {
  created_at?: InputMaybe<Order_By>;
  loan?: InputMaybe<Loan_Order_By>;
  loan_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: loan_status */
export type Loan_Status_Pk_Columns_Input = {
  loan_id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

/** select columns of table "loan_status" */
export enum Loan_Status_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  Status = 'status',
}

/** input type for updating data in table "loan_status" */
export type Loan_Status_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "loan_status" */
export type Loan_Status_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Loan_Status_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Loan_Status_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "loan_status" */
export enum Loan_Status_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  Status = 'status',
}

export type Loan_Status_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Loan_Status_Set_Input>;
  /** filter the rows which have to be updated */
  where: Loan_Status_Bool_Exp;
};

/** Streaming cursor of the table "loan" */
export type Loan_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Loan_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Loan_Stream_Cursor_Value_Input = {
  booked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  commercial_offer_id?: InputMaybe<Scalars['String']['input']>;
  consumer_id?: InputMaybe<Scalars['String']['input']>;
  correlation_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  financial_product_key?: InputMaybe<Scalars['String']['input']>;
  financial_product_version?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchant_global_id?: InputMaybe<Scalars['String']['input']>;
  new_loan_id?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "loan" */
export enum Loan_Update_Column {
  /** column name */
  BookedAt = 'booked_at',
  /** column name */
  CommercialOfferId = 'commercial_offer_id',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CorrelationId = 'correlation_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  FinancialProductKey = 'financial_product_key',
  /** column name */
  FinancialProductVersion = 'financial_product_version',
  /** column name */
  Id = 'id',
  /** column name */
  MerchantGlobalId = 'merchant_global_id',
  /** column name */
  NewLoanId = 'new_loan_id',
}

export type Loan_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Loan_Set_Input>;
  /** filter the rows which have to be updated */
  where: Loan_Bool_Exp;
};

/** columns and relationships of "merchant_payment" */
export type Merchant_Payment = {
  __typename?: 'merchant_payment';
  created_at: Scalars['timestamptz']['output'];
  ga_posting_response?: Maybe<Scalars['json']['output']>;
  id: Scalars['String']['output'];
  merchant?: Maybe<Partner>;
  merchant_account_id: Scalars['String']['output'];
  /** An array relationship */
  merchant_transaction_slips: Array<Merchant_Transaction_Slip>;
  /** An aggregate relationship */
  merchant_transaction_slips_aggregate: Merchant_Transaction_Slip_Aggregate;
  payable_currency: Scalars['String']['output'];
  payable_units: Scalars['bigint']['output'];
  serial_id: Scalars['Int']['output'];
  status?: Maybe<Scalars['String']['output']>;
  status_timestamp?: Maybe<Scalars['date']['output']>;
  success_ga_posting: Scalars['Boolean']['output'];
  transaction_date: Scalars['timestamptz']['output'];
};

/** columns and relationships of "merchant_payment" */
export type Merchant_PaymentGa_Posting_ResponseArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "merchant_payment" */
export type Merchant_PaymentMerchant_Transaction_SlipsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Transaction_Slip_Order_By>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

/** columns and relationships of "merchant_payment" */
export type Merchant_PaymentMerchant_Transaction_Slips_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Transaction_Slip_Order_By>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

/** aggregated selection of "merchant_payment" */
export type Merchant_Payment_Aggregate = {
  __typename?: 'merchant_payment_aggregate';
  aggregate?: Maybe<Merchant_Payment_Aggregate_Fields>;
  nodes: Array<Merchant_Payment>;
};

/** aggregate fields of "merchant_payment" */
export type Merchant_Payment_Aggregate_Fields = {
  __typename?: 'merchant_payment_aggregate_fields';
  avg?: Maybe<Merchant_Payment_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Merchant_Payment_Max_Fields>;
  min?: Maybe<Merchant_Payment_Min_Fields>;
  stddev?: Maybe<Merchant_Payment_Stddev_Fields>;
  stddev_pop?: Maybe<Merchant_Payment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Merchant_Payment_Stddev_Samp_Fields>;
  sum?: Maybe<Merchant_Payment_Sum_Fields>;
  var_pop?: Maybe<Merchant_Payment_Var_Pop_Fields>;
  var_samp?: Maybe<Merchant_Payment_Var_Samp_Fields>;
  variance?: Maybe<Merchant_Payment_Variance_Fields>;
};

/** aggregate fields of "merchant_payment" */
export type Merchant_Payment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Merchant_Payment_Avg_Fields = {
  __typename?: 'merchant_payment_avg_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "merchant_payment". All fields are combined with a logical 'AND'. */
export type Merchant_Payment_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Payment_Bool_Exp>>;
  _not?: InputMaybe<Merchant_Payment_Bool_Exp>;
  _or?: InputMaybe<Array<Merchant_Payment_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  ga_posting_response?: InputMaybe<Json_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  merchant_account_id?: InputMaybe<String_Comparison_Exp>;
  merchant_transaction_slips?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
  merchant_transaction_slips_aggregate?: InputMaybe<Merchant_Transaction_Slip_Aggregate_Bool_Exp>;
  payable_currency?: InputMaybe<String_Comparison_Exp>;
  payable_units?: InputMaybe<Bigint_Comparison_Exp>;
  serial_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  status_timestamp?: InputMaybe<Date_Comparison_Exp>;
  success_ga_posting?: InputMaybe<Boolean_Comparison_Exp>;
  transaction_date?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "merchant_payment" */
export enum Merchant_Payment_Constraint {
  /** unique or primary key constraint on columns "id" */
  MerchantPaymentPkey = 'merchant_payment_pkey',
}

/** input type for incrementing numeric columns in table "merchant_payment" */
export type Merchant_Payment_Inc_Input = {
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  serial_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "merchant_payment" */
export type Merchant_Payment_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  ga_posting_response?: InputMaybe<Scalars['json']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchant_account_id?: InputMaybe<Scalars['String']['input']>;
  merchant_transaction_slips?: InputMaybe<Merchant_Transaction_Slip_Arr_Rel_Insert_Input>;
  payable_currency?: InputMaybe<Scalars['String']['input']>;
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  serial_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_timestamp?: InputMaybe<Scalars['date']['input']>;
  success_ga_posting?: InputMaybe<Scalars['Boolean']['input']>;
  transaction_date?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Merchant_Payment_Max_Fields = {
  __typename?: 'merchant_payment_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  merchant_account_id?: Maybe<Scalars['String']['output']>;
  payable_currency?: Maybe<Scalars['String']['output']>;
  payable_units?: Maybe<Scalars['bigint']['output']>;
  serial_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  status_timestamp?: Maybe<Scalars['date']['output']>;
  transaction_date?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Merchant_Payment_Min_Fields = {
  __typename?: 'merchant_payment_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  merchant_account_id?: Maybe<Scalars['String']['output']>;
  payable_currency?: Maybe<Scalars['String']['output']>;
  payable_units?: Maybe<Scalars['bigint']['output']>;
  serial_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  status_timestamp?: Maybe<Scalars['date']['output']>;
  transaction_date?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "merchant_payment" */
export type Merchant_Payment_Mutation_Response = {
  __typename?: 'merchant_payment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Payment>;
};

/** input type for inserting object relation for remote table "merchant_payment" */
export type Merchant_Payment_Obj_Rel_Insert_Input = {
  data: Merchant_Payment_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Payment_On_Conflict>;
};

/** on_conflict condition type for table "merchant_payment" */
export type Merchant_Payment_On_Conflict = {
  constraint: Merchant_Payment_Constraint;
  update_columns?: Array<Merchant_Payment_Update_Column>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

/** Ordering options when selecting data from "merchant_payment". */
export type Merchant_Payment_Order_By = {
  created_at?: InputMaybe<Order_By>;
  ga_posting_response?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  merchant_account_id?: InputMaybe<Order_By>;
  merchant_transaction_slips_aggregate?: InputMaybe<Merchant_Transaction_Slip_Aggregate_Order_By>;
  payable_currency?: InputMaybe<Order_By>;
  payable_units?: InputMaybe<Order_By>;
  serial_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  status_timestamp?: InputMaybe<Order_By>;
  success_ga_posting?: InputMaybe<Order_By>;
  transaction_date?: InputMaybe<Order_By>;
};

/** primary key columns input for table: merchant_payment */
export type Merchant_Payment_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "merchant_payment" */
export enum Merchant_Payment_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GaPostingResponse = 'ga_posting_response',
  /** column name */
  Id = 'id',
  /** column name */
  MerchantAccountId = 'merchant_account_id',
  /** column name */
  PayableCurrency = 'payable_currency',
  /** column name */
  PayableUnits = 'payable_units',
  /** column name */
  SerialId = 'serial_id',
  /** column name */
  Status = 'status',
  /** column name */
  StatusTimestamp = 'status_timestamp',
  /** column name */
  SuccessGaPosting = 'success_ga_posting',
  /** column name */
  TransactionDate = 'transaction_date',
}

/** input type for updating data in table "merchant_payment" */
export type Merchant_Payment_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  ga_posting_response?: InputMaybe<Scalars['json']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchant_account_id?: InputMaybe<Scalars['String']['input']>;
  payable_currency?: InputMaybe<Scalars['String']['input']>;
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  serial_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_timestamp?: InputMaybe<Scalars['date']['input']>;
  success_ga_posting?: InputMaybe<Scalars['Boolean']['input']>;
  transaction_date?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Merchant_Payment_Stddev_Fields = {
  __typename?: 'merchant_payment_stddev_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Merchant_Payment_Stddev_Pop_Fields = {
  __typename?: 'merchant_payment_stddev_pop_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Merchant_Payment_Stddev_Samp_Fields = {
  __typename?: 'merchant_payment_stddev_samp_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "merchant_payment" */
export type Merchant_Payment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Merchant_Payment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Merchant_Payment_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  ga_posting_response?: InputMaybe<Scalars['json']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchant_account_id?: InputMaybe<Scalars['String']['input']>;
  payable_currency?: InputMaybe<Scalars['String']['input']>;
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  serial_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_timestamp?: InputMaybe<Scalars['date']['input']>;
  success_ga_posting?: InputMaybe<Scalars['Boolean']['input']>;
  transaction_date?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Merchant_Payment_Sum_Fields = {
  __typename?: 'merchant_payment_sum_fields';
  payable_units?: Maybe<Scalars['bigint']['output']>;
  serial_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "merchant_payment" */
export enum Merchant_Payment_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GaPostingResponse = 'ga_posting_response',
  /** column name */
  Id = 'id',
  /** column name */
  MerchantAccountId = 'merchant_account_id',
  /** column name */
  PayableCurrency = 'payable_currency',
  /** column name */
  PayableUnits = 'payable_units',
  /** column name */
  SerialId = 'serial_id',
  /** column name */
  Status = 'status',
  /** column name */
  StatusTimestamp = 'status_timestamp',
  /** column name */
  SuccessGaPosting = 'success_ga_posting',
  /** column name */
  TransactionDate = 'transaction_date',
}

export type Merchant_Payment_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Merchant_Payment_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Merchant_Payment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Merchant_Payment_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Merchant_Payment_Var_Pop_Fields = {
  __typename?: 'merchant_payment_var_pop_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Merchant_Payment_Var_Samp_Fields = {
  __typename?: 'merchant_payment_var_samp_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Merchant_Payment_Variance_Fields = {
  __typename?: 'merchant_payment_variance_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
  serial_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "merchant_transaction_slip" */
export type Merchant_Transaction_Slip = {
  __typename?: 'merchant_transaction_slip';
  booking_time: Scalars['timestamptz']['output'];
  cancelled_for_disbursement?: Maybe<Scalars['Boolean']['output']>;
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['String']['output'];
  /** An object relationship */
  loan: Loan;
  loan_id: Scalars['String']['output'];
  merchant_account_id: Scalars['String']['output'];
  /** An object relationship */
  merchant_payment?: Maybe<Merchant_Payment>;
  merchant_payment_id?: Maybe<Scalars['String']['output']>;
  narration_comment?: Maybe<Scalars['String']['output']>;
  order_number: Scalars['String']['output'];
  payable_currency: Scalars['String']['output'];
  payable_units: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Aggregate = {
  __typename?: 'merchant_transaction_slip_aggregate';
  aggregate?: Maybe<Merchant_Transaction_Slip_Aggregate_Fields>;
  nodes: Array<Merchant_Transaction_Slip>;
};

export type Merchant_Transaction_Slip_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Merchant_Transaction_Slip_Aggregate_Bool_Exp_Count>;
};

export type Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_And = {
  arguments: Merchant_Transaction_Slip_Select_Column_Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Merchant_Transaction_Slip_Select_Column_Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Merchant_Transaction_Slip_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Aggregate_Fields = {
  __typename?: 'merchant_transaction_slip_aggregate_fields';
  avg?: Maybe<Merchant_Transaction_Slip_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Merchant_Transaction_Slip_Max_Fields>;
  min?: Maybe<Merchant_Transaction_Slip_Min_Fields>;
  stddev?: Maybe<Merchant_Transaction_Slip_Stddev_Fields>;
  stddev_pop?: Maybe<Merchant_Transaction_Slip_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Merchant_Transaction_Slip_Stddev_Samp_Fields>;
  sum?: Maybe<Merchant_Transaction_Slip_Sum_Fields>;
  var_pop?: Maybe<Merchant_Transaction_Slip_Var_Pop_Fields>;
  var_samp?: Maybe<Merchant_Transaction_Slip_Var_Samp_Fields>;
  variance?: Maybe<Merchant_Transaction_Slip_Variance_Fields>;
};

/** aggregate fields of "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Aggregate_Order_By = {
  avg?: InputMaybe<Merchant_Transaction_Slip_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Merchant_Transaction_Slip_Max_Order_By>;
  min?: InputMaybe<Merchant_Transaction_Slip_Min_Order_By>;
  stddev?: InputMaybe<Merchant_Transaction_Slip_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Merchant_Transaction_Slip_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Merchant_Transaction_Slip_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Merchant_Transaction_Slip_Sum_Order_By>;
  var_pop?: InputMaybe<Merchant_Transaction_Slip_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Merchant_Transaction_Slip_Var_Samp_Order_By>;
  variance?: InputMaybe<Merchant_Transaction_Slip_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Arr_Rel_Insert_Input = {
  data: Array<Merchant_Transaction_Slip_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Transaction_Slip_On_Conflict>;
};

/** aggregate avg on columns */
export type Merchant_Transaction_Slip_Avg_Fields = {
  __typename?: 'merchant_transaction_slip_avg_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Avg_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "merchant_transaction_slip". All fields are combined with a logical 'AND'. */
export type Merchant_Transaction_Slip_Bool_Exp = {
  _and?: InputMaybe<Array<Merchant_Transaction_Slip_Bool_Exp>>;
  _not?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
  _or?: InputMaybe<Array<Merchant_Transaction_Slip_Bool_Exp>>;
  booking_time?: InputMaybe<Timestamptz_Comparison_Exp>;
  cancelled_for_disbursement?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  loan?: InputMaybe<Loan_Bool_Exp>;
  loan_id?: InputMaybe<String_Comparison_Exp>;
  merchant_account_id?: InputMaybe<String_Comparison_Exp>;
  merchant_payment?: InputMaybe<Merchant_Payment_Bool_Exp>;
  merchant_payment_id?: InputMaybe<String_Comparison_Exp>;
  narration_comment?: InputMaybe<String_Comparison_Exp>;
  order_number?: InputMaybe<String_Comparison_Exp>;
  payable_currency?: InputMaybe<String_Comparison_Exp>;
  payable_units?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "merchant_transaction_slip" */
export enum Merchant_Transaction_Slip_Constraint {
  /** unique or primary key constraint on columns "loan_id" */
  MerchantTransactionSlipLoanIdKey = 'merchant_transaction_slip_loan_id_key',
  /** unique or primary key constraint on columns "id" */
  MerchantTransactionSlipPkey = 'merchant_transaction_slip_pkey',
}

/** input type for incrementing numeric columns in table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Inc_Input = {
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Insert_Input = {
  booking_time?: InputMaybe<Scalars['timestamptz']['input']>;
  cancelled_for_disbursement?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  loan?: InputMaybe<Loan_Obj_Rel_Insert_Input>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  merchant_account_id?: InputMaybe<Scalars['String']['input']>;
  merchant_payment?: InputMaybe<Merchant_Payment_Obj_Rel_Insert_Input>;
  merchant_payment_id?: InputMaybe<Scalars['String']['input']>;
  narration_comment?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  payable_currency?: InputMaybe<Scalars['String']['input']>;
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Merchant_Transaction_Slip_Max_Fields = {
  __typename?: 'merchant_transaction_slip_max_fields';
  booking_time?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  merchant_account_id?: Maybe<Scalars['String']['output']>;
  merchant_payment_id?: Maybe<Scalars['String']['output']>;
  narration_comment?: Maybe<Scalars['String']['output']>;
  order_number?: Maybe<Scalars['String']['output']>;
  payable_currency?: Maybe<Scalars['String']['output']>;
  payable_units?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Max_Order_By = {
  booking_time?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  merchant_account_id?: InputMaybe<Order_By>;
  merchant_payment_id?: InputMaybe<Order_By>;
  narration_comment?: InputMaybe<Order_By>;
  order_number?: InputMaybe<Order_By>;
  payable_currency?: InputMaybe<Order_By>;
  payable_units?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Merchant_Transaction_Slip_Min_Fields = {
  __typename?: 'merchant_transaction_slip_min_fields';
  booking_time?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  loan_id?: Maybe<Scalars['String']['output']>;
  merchant_account_id?: Maybe<Scalars['String']['output']>;
  merchant_payment_id?: Maybe<Scalars['String']['output']>;
  narration_comment?: Maybe<Scalars['String']['output']>;
  order_number?: Maybe<Scalars['String']['output']>;
  payable_currency?: Maybe<Scalars['String']['output']>;
  payable_units?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Min_Order_By = {
  booking_time?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan_id?: InputMaybe<Order_By>;
  merchant_account_id?: InputMaybe<Order_By>;
  merchant_payment_id?: InputMaybe<Order_By>;
  narration_comment?: InputMaybe<Order_By>;
  order_number?: InputMaybe<Order_By>;
  payable_currency?: InputMaybe<Order_By>;
  payable_units?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Mutation_Response = {
  __typename?: 'merchant_transaction_slip_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Merchant_Transaction_Slip>;
};

/** input type for inserting object relation for remote table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Obj_Rel_Insert_Input = {
  data: Merchant_Transaction_Slip_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Merchant_Transaction_Slip_On_Conflict>;
};

/** on_conflict condition type for table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_On_Conflict = {
  constraint: Merchant_Transaction_Slip_Constraint;
  update_columns?: Array<Merchant_Transaction_Slip_Update_Column>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

/** Ordering options when selecting data from "merchant_transaction_slip". */
export type Merchant_Transaction_Slip_Order_By = {
  booking_time?: InputMaybe<Order_By>;
  cancelled_for_disbursement?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  loan?: InputMaybe<Loan_Order_By>;
  loan_id?: InputMaybe<Order_By>;
  merchant_account_id?: InputMaybe<Order_By>;
  merchant_payment?: InputMaybe<Merchant_Payment_Order_By>;
  merchant_payment_id?: InputMaybe<Order_By>;
  narration_comment?: InputMaybe<Order_By>;
  order_number?: InputMaybe<Order_By>;
  payable_currency?: InputMaybe<Order_By>;
  payable_units?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: merchant_transaction_slip */
export type Merchant_Transaction_Slip_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "merchant_transaction_slip" */
export enum Merchant_Transaction_Slip_Select_Column {
  /** column name */
  BookingTime = 'booking_time',
  /** column name */
  CancelledForDisbursement = 'cancelled_for_disbursement',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  MerchantAccountId = 'merchant_account_id',
  /** column name */
  MerchantPaymentId = 'merchant_payment_id',
  /** column name */
  NarrationComment = 'narration_comment',
  /** column name */
  OrderNumber = 'order_number',
  /** column name */
  PayableCurrency = 'payable_currency',
  /** column name */
  PayableUnits = 'payable_units',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** select "merchant_transaction_slip_aggregate_bool_exp_bool_and_arguments_columns" columns of table "merchant_transaction_slip" */
export enum Merchant_Transaction_Slip_Select_Column_Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  CancelledForDisbursement = 'cancelled_for_disbursement',
}

/** select "merchant_transaction_slip_aggregate_bool_exp_bool_or_arguments_columns" columns of table "merchant_transaction_slip" */
export enum Merchant_Transaction_Slip_Select_Column_Merchant_Transaction_Slip_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  CancelledForDisbursement = 'cancelled_for_disbursement',
}

/** input type for updating data in table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Set_Input = {
  booking_time?: InputMaybe<Scalars['timestamptz']['input']>;
  cancelled_for_disbursement?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  merchant_account_id?: InputMaybe<Scalars['String']['input']>;
  merchant_payment_id?: InputMaybe<Scalars['String']['input']>;
  narration_comment?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  payable_currency?: InputMaybe<Scalars['String']['input']>;
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Merchant_Transaction_Slip_Stddev_Fields = {
  __typename?: 'merchant_transaction_slip_stddev_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Stddev_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Merchant_Transaction_Slip_Stddev_Pop_Fields = {
  __typename?: 'merchant_transaction_slip_stddev_pop_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Stddev_Pop_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Merchant_Transaction_Slip_Stddev_Samp_Fields = {
  __typename?: 'merchant_transaction_slip_stddev_samp_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Stddev_Samp_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Merchant_Transaction_Slip_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Merchant_Transaction_Slip_Stream_Cursor_Value_Input = {
  booking_time?: InputMaybe<Scalars['timestamptz']['input']>;
  cancelled_for_disbursement?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  loan_id?: InputMaybe<Scalars['String']['input']>;
  merchant_account_id?: InputMaybe<Scalars['String']['input']>;
  merchant_payment_id?: InputMaybe<Scalars['String']['input']>;
  narration_comment?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  payable_currency?: InputMaybe<Scalars['String']['input']>;
  payable_units?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Merchant_Transaction_Slip_Sum_Fields = {
  __typename?: 'merchant_transaction_slip_sum_fields';
  payable_units?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Sum_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** update columns of table "merchant_transaction_slip" */
export enum Merchant_Transaction_Slip_Update_Column {
  /** column name */
  BookingTime = 'booking_time',
  /** column name */
  CancelledForDisbursement = 'cancelled_for_disbursement',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LoanId = 'loan_id',
  /** column name */
  MerchantAccountId = 'merchant_account_id',
  /** column name */
  MerchantPaymentId = 'merchant_payment_id',
  /** column name */
  NarrationComment = 'narration_comment',
  /** column name */
  OrderNumber = 'order_number',
  /** column name */
  PayableCurrency = 'payable_currency',
  /** column name */
  PayableUnits = 'payable_units',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Merchant_Transaction_Slip_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Merchant_Transaction_Slip_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Merchant_Transaction_Slip_Set_Input>;
  /** filter the rows which have to be updated */
  where: Merchant_Transaction_Slip_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Merchant_Transaction_Slip_Var_Pop_Fields = {
  __typename?: 'merchant_transaction_slip_var_pop_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Var_Pop_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Merchant_Transaction_Slip_Var_Samp_Fields = {
  __typename?: 'merchant_transaction_slip_var_samp_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Var_Samp_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Merchant_Transaction_Slip_Variance_Fields = {
  __typename?: 'merchant_transaction_slip_variance_fields';
  payable_units?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "merchant_transaction_slip" */
export type Merchant_Transaction_Slip_Variance_Order_By = {
  payable_units?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "accounts.account" */
  delete_accounts_account?: Maybe<Accounts_Account_Mutation_Response>;
  /** delete single row from the table: "accounts.account" */
  delete_accounts_account_by_pk?: Maybe<Accounts_Account>;
  /** delete data from the table: "accounts.balances" */
  delete_accounts_balances?: Maybe<Accounts_Balances_Mutation_Response>;
  /** delete single row from the table: "accounts.balances" */
  delete_accounts_balances_by_pk?: Maybe<Accounts_Balances>;
  /** delete data from the table: "accounts.bank_account" */
  delete_accounts_bank_account?: Maybe<Accounts_Bank_Account_Mutation_Response>;
  /** delete single row from the table: "accounts.bank_account" */
  delete_accounts_bank_account_by_pk?: Maybe<Accounts_Bank_Account>;
  /** delete data from the table: "accounts.bank_account_related_accounts" */
  delete_accounts_bank_account_related_accounts?: Maybe<Accounts_Bank_Account_Related_Accounts_Mutation_Response>;
  /** delete single row from the table: "accounts.bank_account_related_accounts" */
  delete_accounts_bank_account_related_accounts_by_pk?: Maybe<Accounts_Bank_Account_Related_Accounts>;
  /** delete data from the table: "accounts.pool_accounts" */
  delete_accounts_pool_accounts?: Maybe<Accounts_Pool_Accounts_Mutation_Response>;
  /** delete single row from the table: "accounts.pool_accounts" */
  delete_accounts_pool_accounts_by_pk?: Maybe<Accounts_Pool_Accounts>;
  /** delete data from the table: "accounts.pools" */
  delete_accounts_pools?: Maybe<Accounts_Pools_Mutation_Response>;
  /** delete single row from the table: "accounts.pools" */
  delete_accounts_pools_by_pk?: Maybe<Accounts_Pools>;
  /** delete data from the table: "areas" */
  delete_areas?: Maybe<Areas_Mutation_Response>;
  /** delete single row from the table: "areas" */
  delete_areas_by_pk?: Maybe<Areas>;
  /** delete data from the table: "audit_logs" */
  delete_audit_logs?: Maybe<Audit_Logs_Mutation_Response>;
  /** delete data from the table: "checkout_baskets" */
  delete_checkout_baskets?: Maybe<Checkout_Baskets_Mutation_Response>;
  /** delete single row from the table: "checkout_baskets" */
  delete_checkout_baskets_by_pk?: Maybe<Checkout_Baskets>;
  /** delete data from the table: "cities" */
  delete_cities?: Maybe<Cities_Mutation_Response>;
  /** delete single row from the table: "cities" */
  delete_cities_by_pk?: Maybe<Cities>;
  /** delete data from the table: "command" */
  delete_command?: Maybe<Command_Mutation_Response>;
  /** delete single row from the table: "command" */
  delete_command_by_pk?: Maybe<Command>;
  /** delete data from the table: "commercial_offer" */
  delete_commercial_offer?: Maybe<Commercial_Offer_Mutation_Response>;
  /** delete single row from the table: "commercial_offer" */
  delete_commercial_offer_by_pk?: Maybe<Commercial_Offer>;
  /** delete data from the table: "connectors.connector" */
  delete_connectors_connector?: Maybe<Connectors_Connector_Mutation_Response>;
  /** delete single row from the table: "connectors.connector" */
  delete_connectors_connector_by_pk?: Maybe<Connectors_Connector>;
  /** delete data from the table: "connectors.webhook" */
  delete_connectors_webhook?: Maybe<Connectors_Webhook_Mutation_Response>;
  /** delete single row from the table: "connectors.webhook" */
  delete_connectors_webhook_by_pk?: Maybe<Connectors_Webhook>;
  /** delete data from the table: "consumers" */
  delete_consumers?: Maybe<Consumers_Mutation_Response>;
  /** delete single row from the table: "consumers" */
  delete_consumers_by_pk?: Maybe<Consumers>;
  /** delete data from the table: "consumers_credit_limits" */
  delete_consumers_credit_limits?: Maybe<Consumers_Credit_Limits_Mutation_Response>;
  /** delete single row from the table: "consumers_credit_limits" */
  delete_consumers_credit_limits_by_pk?: Maybe<Consumers_Credit_Limits>;
  /** delete data from the table: "entry" */
  delete_entry?: Maybe<Entry_Mutation_Response>;
  /** delete single row from the table: "entry" */
  delete_entry_by_pk?: Maybe<Entry>;
  /** delete data from the table: "governorates" */
  delete_governorates?: Maybe<Governorates_Mutation_Response>;
  /** delete single row from the table: "governorates" */
  delete_governorates_by_pk?: Maybe<Governorates>;
  /** delete data from the table: "identities" */
  delete_identities?: Maybe<Identities_Mutation_Response>;
  /** delete single row from the table: "identities" */
  delete_identities_by_pk?: Maybe<Identities>;
  /** delete data from the table: "identity_verifiable_addresses" */
  delete_identity_verifiable_addresses?: Maybe<Identity_Verifiable_Addresses_Mutation_Response>;
  /** delete single row from the table: "identity_verifiable_addresses" */
  delete_identity_verifiable_addresses_by_pk?: Maybe<Identity_Verifiable_Addresses>;
  /** delete data from the table: "journal" */
  delete_journal?: Maybe<Journal_Mutation_Response>;
  /** delete single row from the table: "journal" */
  delete_journal_by_pk?: Maybe<Journal>;
  /** delete data from the table: "journal_voucher_entries" */
  delete_journal_voucher_entries?: Maybe<Journal_Voucher_Entries_Mutation_Response>;
  /** delete data from the table: "keto_relation_tuples" */
  delete_keto_relation_tuples?: Maybe<Keto_Relation_Tuples_Mutation_Response>;
  /** delete single row from the table: "keto_relation_tuples" */
  delete_keto_relation_tuples_by_pk?: Maybe<Keto_Relation_Tuples>;
  /** delete data from the table: "keto_uuid_mappings" */
  delete_keto_uuid_mappings?: Maybe<Keto_Uuid_Mappings_Mutation_Response>;
  /** delete single row from the table: "keto_uuid_mappings" */
  delete_keto_uuid_mappings_by_pk?: Maybe<Keto_Uuid_Mappings>;
  /** delete data from the table: "loan" */
  delete_loan?: Maybe<Loan_Mutation_Response>;
  /** delete single row from the table: "loan" */
  delete_loan_by_pk?: Maybe<Loan>;
  /** delete data from the table: "loan_schedule" */
  delete_loan_schedule?: Maybe<Loan_Schedule_Mutation_Response>;
  /** delete single row from the table: "loan_schedule" */
  delete_loan_schedule_by_pk?: Maybe<Loan_Schedule>;
  /** delete data from the table: "loan_status" */
  delete_loan_status?: Maybe<Loan_Status_Mutation_Response>;
  /** delete single row from the table: "loan_status" */
  delete_loan_status_by_pk?: Maybe<Loan_Status>;
  /** delete data from the table: "merchant_payment" */
  delete_merchant_payment?: Maybe<Merchant_Payment_Mutation_Response>;
  /** delete single row from the table: "merchant_payment" */
  delete_merchant_payment_by_pk?: Maybe<Merchant_Payment>;
  /** delete data from the table: "merchant_transaction_slip" */
  delete_merchant_transaction_slip?: Maybe<Merchant_Transaction_Slip_Mutation_Response>;
  /** delete single row from the table: "merchant_transaction_slip" */
  delete_merchant_transaction_slip_by_pk?: Maybe<Merchant_Transaction_Slip>;
  /** delete data from the table: "partner" */
  delete_partner?: Maybe<Partner_Mutation_Response>;
  /** delete data from the table: "partner_bank_account" */
  delete_partner_bank_account?: Maybe<Partner_Bank_Account_Mutation_Response>;
  /** delete single row from the table: "partner_bank_account" */
  delete_partner_bank_account_by_pk?: Maybe<Partner_Bank_Account>;
  /** delete data from the table: "partner_branch" */
  delete_partner_branch?: Maybe<Partner_Branch_Mutation_Response>;
  /** delete single row from the table: "partner_branch" */
  delete_partner_branch_by_pk?: Maybe<Partner_Branch>;
  /** delete single row from the table: "partner" */
  delete_partner_by_pk?: Maybe<Partner>;
  /** delete data from the table: "partner_top" */
  delete_partner_top?: Maybe<Partner_Top_Mutation_Response>;
  /** delete single row from the table: "partner_top" */
  delete_partner_top_by_pk?: Maybe<Partner_Top>;
  /** delete data from the table: "partner_user_profile" */
  delete_partner_user_profile?: Maybe<Partner_User_Profile_Mutation_Response>;
  /** delete single row from the table: "partner_user_profile" */
  delete_partner_user_profile_by_pk?: Maybe<Partner_User_Profile>;
  /** delete data from the table: "party_account" */
  delete_party_account?: Maybe<Party_Account_Mutation_Response>;
  /** delete single row from the table: "party_account" */
  delete_party_account_by_pk?: Maybe<Party_Account>;
  /** delete data from the table: "payments.adjustment" */
  delete_payments_adjustment?: Maybe<Payments_Adjustment_Mutation_Response>;
  /** delete single row from the table: "payments.adjustment" */
  delete_payments_adjustment_by_pk?: Maybe<Payments_Adjustment>;
  /** delete data from the table: "payments.metadata" */
  delete_payments_metadata?: Maybe<Payments_Metadata_Mutation_Response>;
  /** delete single row from the table: "payments.metadata" */
  delete_payments_metadata_by_pk?: Maybe<Payments_Metadata>;
  /** delete data from the table: "payments.payment" */
  delete_payments_payment?: Maybe<Payments_Payment_Mutation_Response>;
  /** delete single row from the table: "payments.payment" */
  delete_payments_payment_by_pk?: Maybe<Payments_Payment>;
  /** delete data from the table: "payments.transfers" */
  delete_payments_transfers?: Maybe<Payments_Transfers_Mutation_Response>;
  /** delete single row from the table: "payments.transfers" */
  delete_payments_transfers_by_pk?: Maybe<Payments_Transfers>;
  /** delete data from the table: "registry_payment" */
  delete_registry_payment?: Maybe<Registry_Payment_Mutation_Response>;
  /** delete single row from the table: "registry_payment" */
  delete_registry_payment_by_pk?: Maybe<Registry_Payment>;
  /** delete data from the table: "session_baskets" */
  delete_session_baskets?: Maybe<Session_Baskets_Mutation_Response>;
  /** delete single row from the table: "session_baskets" */
  delete_session_baskets_by_pk?: Maybe<Session_Baskets>;
  /** delete data from the table: "transfers.transfer_initiation" */
  delete_transfers_transfer_initiation?: Maybe<Transfers_Transfer_Initiation_Mutation_Response>;
  /** delete data from the table: "transfers.transfer_initiation_adjustments" */
  delete_transfers_transfer_initiation_adjustments?: Maybe<Transfers_Transfer_Initiation_Adjustments_Mutation_Response>;
  /** delete single row from the table: "transfers.transfer_initiation_adjustments" */
  delete_transfers_transfer_initiation_adjustments_by_pk?: Maybe<Transfers_Transfer_Initiation_Adjustments>;
  /** delete single row from the table: "transfers.transfer_initiation" */
  delete_transfers_transfer_initiation_by_pk?: Maybe<Transfers_Transfer_Initiation>;
  /** delete data from the table: "transfers.transfer_initiation_payments" */
  delete_transfers_transfer_initiation_payments?: Maybe<Transfers_Transfer_Initiation_Payments_Mutation_Response>;
  /** delete single row from the table: "transfers.transfer_initiation_payments" */
  delete_transfers_transfer_initiation_payments_by_pk?: Maybe<Transfers_Transfer_Initiation_Payments>;
  /** delete data from the table: "transfers.transfer_reversal" */
  delete_transfers_transfer_reversal?: Maybe<Transfers_Transfer_Reversal_Mutation_Response>;
  /** delete single row from the table: "transfers.transfer_reversal" */
  delete_transfers_transfer_reversal_by_pk?: Maybe<Transfers_Transfer_Reversal>;
  /** insert data into the table: "accounts.account" */
  insert_accounts_account?: Maybe<Accounts_Account_Mutation_Response>;
  /** insert a single row into the table: "accounts.account" */
  insert_accounts_account_one?: Maybe<Accounts_Account>;
  /** insert data into the table: "accounts.balances" */
  insert_accounts_balances?: Maybe<Accounts_Balances_Mutation_Response>;
  /** insert a single row into the table: "accounts.balances" */
  insert_accounts_balances_one?: Maybe<Accounts_Balances>;
  /** insert data into the table: "accounts.bank_account" */
  insert_accounts_bank_account?: Maybe<Accounts_Bank_Account_Mutation_Response>;
  /** insert a single row into the table: "accounts.bank_account" */
  insert_accounts_bank_account_one?: Maybe<Accounts_Bank_Account>;
  /** insert data into the table: "accounts.bank_account_related_accounts" */
  insert_accounts_bank_account_related_accounts?: Maybe<Accounts_Bank_Account_Related_Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts.bank_account_related_accounts" */
  insert_accounts_bank_account_related_accounts_one?: Maybe<Accounts_Bank_Account_Related_Accounts>;
  /** insert data into the table: "accounts.pool_accounts" */
  insert_accounts_pool_accounts?: Maybe<Accounts_Pool_Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts.pool_accounts" */
  insert_accounts_pool_accounts_one?: Maybe<Accounts_Pool_Accounts>;
  /** insert data into the table: "accounts.pools" */
  insert_accounts_pools?: Maybe<Accounts_Pools_Mutation_Response>;
  /** insert a single row into the table: "accounts.pools" */
  insert_accounts_pools_one?: Maybe<Accounts_Pools>;
  /** insert data into the table: "areas" */
  insert_areas?: Maybe<Areas_Mutation_Response>;
  /** insert a single row into the table: "areas" */
  insert_areas_one?: Maybe<Areas>;
  /** insert data into the table: "audit_logs" */
  insert_audit_logs?: Maybe<Audit_Logs_Mutation_Response>;
  /** insert a single row into the table: "audit_logs" */
  insert_audit_logs_one?: Maybe<Audit_Logs>;
  /** insert data into the table: "checkout_baskets" */
  insert_checkout_baskets?: Maybe<Checkout_Baskets_Mutation_Response>;
  /** insert a single row into the table: "checkout_baskets" */
  insert_checkout_baskets_one?: Maybe<Checkout_Baskets>;
  /** insert data into the table: "cities" */
  insert_cities?: Maybe<Cities_Mutation_Response>;
  /** insert a single row into the table: "cities" */
  insert_cities_one?: Maybe<Cities>;
  /** insert data into the table: "command" */
  insert_command?: Maybe<Command_Mutation_Response>;
  /** insert a single row into the table: "command" */
  insert_command_one?: Maybe<Command>;
  /** insert data into the table: "commercial_offer" */
  insert_commercial_offer?: Maybe<Commercial_Offer_Mutation_Response>;
  /** insert a single row into the table: "commercial_offer" */
  insert_commercial_offer_one?: Maybe<Commercial_Offer>;
  /** insert data into the table: "connectors.connector" */
  insert_connectors_connector?: Maybe<Connectors_Connector_Mutation_Response>;
  /** insert a single row into the table: "connectors.connector" */
  insert_connectors_connector_one?: Maybe<Connectors_Connector>;
  /** insert data into the table: "connectors.webhook" */
  insert_connectors_webhook?: Maybe<Connectors_Webhook_Mutation_Response>;
  /** insert a single row into the table: "connectors.webhook" */
  insert_connectors_webhook_one?: Maybe<Connectors_Webhook>;
  /** insert data into the table: "consumers" */
  insert_consumers?: Maybe<Consumers_Mutation_Response>;
  /** insert data into the table: "consumers_credit_limits" */
  insert_consumers_credit_limits?: Maybe<Consumers_Credit_Limits_Mutation_Response>;
  /** insert a single row into the table: "consumers_credit_limits" */
  insert_consumers_credit_limits_one?: Maybe<Consumers_Credit_Limits>;
  /** insert a single row into the table: "consumers" */
  insert_consumers_one?: Maybe<Consumers>;
  /** insert data into the table: "entry" */
  insert_entry?: Maybe<Entry_Mutation_Response>;
  /** insert a single row into the table: "entry" */
  insert_entry_one?: Maybe<Entry>;
  /** insert data into the table: "governorates" */
  insert_governorates?: Maybe<Governorates_Mutation_Response>;
  /** insert a single row into the table: "governorates" */
  insert_governorates_one?: Maybe<Governorates>;
  /** insert data into the table: "identities" */
  insert_identities?: Maybe<Identities_Mutation_Response>;
  /** insert a single row into the table: "identities" */
  insert_identities_one?: Maybe<Identities>;
  /** insert data into the table: "identity_verifiable_addresses" */
  insert_identity_verifiable_addresses?: Maybe<Identity_Verifiable_Addresses_Mutation_Response>;
  /** insert a single row into the table: "identity_verifiable_addresses" */
  insert_identity_verifiable_addresses_one?: Maybe<Identity_Verifiable_Addresses>;
  /** insert data into the table: "journal" */
  insert_journal?: Maybe<Journal_Mutation_Response>;
  /** insert a single row into the table: "journal" */
  insert_journal_one?: Maybe<Journal>;
  /** insert data into the table: "journal_voucher_entries" */
  insert_journal_voucher_entries?: Maybe<Journal_Voucher_Entries_Mutation_Response>;
  /** insert a single row into the table: "journal_voucher_entries" */
  insert_journal_voucher_entries_one?: Maybe<Journal_Voucher_Entries>;
  /** insert data into the table: "keto_relation_tuples" */
  insert_keto_relation_tuples?: Maybe<Keto_Relation_Tuples_Mutation_Response>;
  /** insert a single row into the table: "keto_relation_tuples" */
  insert_keto_relation_tuples_one?: Maybe<Keto_Relation_Tuples>;
  /** insert data into the table: "keto_uuid_mappings" */
  insert_keto_uuid_mappings?: Maybe<Keto_Uuid_Mappings_Mutation_Response>;
  /** insert a single row into the table: "keto_uuid_mappings" */
  insert_keto_uuid_mappings_one?: Maybe<Keto_Uuid_Mappings>;
  /** insert data into the table: "loan" */
  insert_loan?: Maybe<Loan_Mutation_Response>;
  /** insert a single row into the table: "loan" */
  insert_loan_one?: Maybe<Loan>;
  /** insert data into the table: "loan_schedule" */
  insert_loan_schedule?: Maybe<Loan_Schedule_Mutation_Response>;
  /** insert a single row into the table: "loan_schedule" */
  insert_loan_schedule_one?: Maybe<Loan_Schedule>;
  /** insert data into the table: "loan_status" */
  insert_loan_status?: Maybe<Loan_Status_Mutation_Response>;
  /** insert a single row into the table: "loan_status" */
  insert_loan_status_one?: Maybe<Loan_Status>;
  /** insert data into the table: "merchant_payment" */
  insert_merchant_payment?: Maybe<Merchant_Payment_Mutation_Response>;
  /** insert a single row into the table: "merchant_payment" */
  insert_merchant_payment_one?: Maybe<Merchant_Payment>;
  /** insert data into the table: "merchant_transaction_slip" */
  insert_merchant_transaction_slip?: Maybe<Merchant_Transaction_Slip_Mutation_Response>;
  /** insert a single row into the table: "merchant_transaction_slip" */
  insert_merchant_transaction_slip_one?: Maybe<Merchant_Transaction_Slip>;
  /** insert data into the table: "partner" */
  insert_partner?: Maybe<Partner_Mutation_Response>;
  /** insert data into the table: "partner_bank_account" */
  insert_partner_bank_account?: Maybe<Partner_Bank_Account_Mutation_Response>;
  /** insert a single row into the table: "partner_bank_account" */
  insert_partner_bank_account_one?: Maybe<Partner_Bank_Account>;
  /** insert data into the table: "partner_branch" */
  insert_partner_branch?: Maybe<Partner_Branch_Mutation_Response>;
  /** insert a single row into the table: "partner_branch" */
  insert_partner_branch_one?: Maybe<Partner_Branch>;
  /** insert a single row into the table: "partner" */
  insert_partner_one?: Maybe<Partner>;
  /** insert data into the table: "partner_top" */
  insert_partner_top?: Maybe<Partner_Top_Mutation_Response>;
  /** insert a single row into the table: "partner_top" */
  insert_partner_top_one?: Maybe<Partner_Top>;
  /** insert data into the table: "partner_user_profile" */
  insert_partner_user_profile?: Maybe<Partner_User_Profile_Mutation_Response>;
  /** insert a single row into the table: "partner_user_profile" */
  insert_partner_user_profile_one?: Maybe<Partner_User_Profile>;
  /** insert data into the table: "party_account" */
  insert_party_account?: Maybe<Party_Account_Mutation_Response>;
  /** insert a single row into the table: "party_account" */
  insert_party_account_one?: Maybe<Party_Account>;
  /** insert data into the table: "payments.adjustment" */
  insert_payments_adjustment?: Maybe<Payments_Adjustment_Mutation_Response>;
  /** insert a single row into the table: "payments.adjustment" */
  insert_payments_adjustment_one?: Maybe<Payments_Adjustment>;
  /** insert data into the table: "payments.metadata" */
  insert_payments_metadata?: Maybe<Payments_Metadata_Mutation_Response>;
  /** insert a single row into the table: "payments.metadata" */
  insert_payments_metadata_one?: Maybe<Payments_Metadata>;
  /** insert data into the table: "payments.payment" */
  insert_payments_payment?: Maybe<Payments_Payment_Mutation_Response>;
  /** insert a single row into the table: "payments.payment" */
  insert_payments_payment_one?: Maybe<Payments_Payment>;
  /** insert data into the table: "payments.transfers" */
  insert_payments_transfers?: Maybe<Payments_Transfers_Mutation_Response>;
  /** insert a single row into the table: "payments.transfers" */
  insert_payments_transfers_one?: Maybe<Payments_Transfers>;
  /** insert data into the table: "registry_payment" */
  insert_registry_payment?: Maybe<Registry_Payment_Mutation_Response>;
  /** insert a single row into the table: "registry_payment" */
  insert_registry_payment_one?: Maybe<Registry_Payment>;
  /** insert data into the table: "session_baskets" */
  insert_session_baskets?: Maybe<Session_Baskets_Mutation_Response>;
  /** insert a single row into the table: "session_baskets" */
  insert_session_baskets_one?: Maybe<Session_Baskets>;
  /** insert data into the table: "transfers.transfer_initiation" */
  insert_transfers_transfer_initiation?: Maybe<Transfers_Transfer_Initiation_Mutation_Response>;
  /** insert data into the table: "transfers.transfer_initiation_adjustments" */
  insert_transfers_transfer_initiation_adjustments?: Maybe<Transfers_Transfer_Initiation_Adjustments_Mutation_Response>;
  /** insert a single row into the table: "transfers.transfer_initiation_adjustments" */
  insert_transfers_transfer_initiation_adjustments_one?: Maybe<Transfers_Transfer_Initiation_Adjustments>;
  /** insert a single row into the table: "transfers.transfer_initiation" */
  insert_transfers_transfer_initiation_one?: Maybe<Transfers_Transfer_Initiation>;
  /** insert data into the table: "transfers.transfer_initiation_payments" */
  insert_transfers_transfer_initiation_payments?: Maybe<Transfers_Transfer_Initiation_Payments_Mutation_Response>;
  /** insert a single row into the table: "transfers.transfer_initiation_payments" */
  insert_transfers_transfer_initiation_payments_one?: Maybe<Transfers_Transfer_Initiation_Payments>;
  /** insert data into the table: "transfers.transfer_reversal" */
  insert_transfers_transfer_reversal?: Maybe<Transfers_Transfer_Reversal_Mutation_Response>;
  /** insert a single row into the table: "transfers.transfer_reversal" */
  insert_transfers_transfer_reversal_one?: Maybe<Transfers_Transfer_Reversal>;
  /** update data of the table: "accounts.account" */
  update_accounts_account?: Maybe<Accounts_Account_Mutation_Response>;
  /** update single row of the table: "accounts.account" */
  update_accounts_account_by_pk?: Maybe<Accounts_Account>;
  /** update multiples rows of table: "accounts.account" */
  update_accounts_account_many?: Maybe<
    Array<Maybe<Accounts_Account_Mutation_Response>>
  >;
  /** update data of the table: "accounts.balances" */
  update_accounts_balances?: Maybe<Accounts_Balances_Mutation_Response>;
  /** update single row of the table: "accounts.balances" */
  update_accounts_balances_by_pk?: Maybe<Accounts_Balances>;
  /** update multiples rows of table: "accounts.balances" */
  update_accounts_balances_many?: Maybe<
    Array<Maybe<Accounts_Balances_Mutation_Response>>
  >;
  /** update data of the table: "accounts.bank_account" */
  update_accounts_bank_account?: Maybe<Accounts_Bank_Account_Mutation_Response>;
  /** update single row of the table: "accounts.bank_account" */
  update_accounts_bank_account_by_pk?: Maybe<Accounts_Bank_Account>;
  /** update multiples rows of table: "accounts.bank_account" */
  update_accounts_bank_account_many?: Maybe<
    Array<Maybe<Accounts_Bank_Account_Mutation_Response>>
  >;
  /** update data of the table: "accounts.bank_account_related_accounts" */
  update_accounts_bank_account_related_accounts?: Maybe<Accounts_Bank_Account_Related_Accounts_Mutation_Response>;
  /** update single row of the table: "accounts.bank_account_related_accounts" */
  update_accounts_bank_account_related_accounts_by_pk?: Maybe<Accounts_Bank_Account_Related_Accounts>;
  /** update multiples rows of table: "accounts.bank_account_related_accounts" */
  update_accounts_bank_account_related_accounts_many?: Maybe<
    Array<Maybe<Accounts_Bank_Account_Related_Accounts_Mutation_Response>>
  >;
  /** update data of the table: "accounts.pool_accounts" */
  update_accounts_pool_accounts?: Maybe<Accounts_Pool_Accounts_Mutation_Response>;
  /** update single row of the table: "accounts.pool_accounts" */
  update_accounts_pool_accounts_by_pk?: Maybe<Accounts_Pool_Accounts>;
  /** update multiples rows of table: "accounts.pool_accounts" */
  update_accounts_pool_accounts_many?: Maybe<
    Array<Maybe<Accounts_Pool_Accounts_Mutation_Response>>
  >;
  /** update data of the table: "accounts.pools" */
  update_accounts_pools?: Maybe<Accounts_Pools_Mutation_Response>;
  /** update single row of the table: "accounts.pools" */
  update_accounts_pools_by_pk?: Maybe<Accounts_Pools>;
  /** update multiples rows of table: "accounts.pools" */
  update_accounts_pools_many?: Maybe<
    Array<Maybe<Accounts_Pools_Mutation_Response>>
  >;
  /** update data of the table: "areas" */
  update_areas?: Maybe<Areas_Mutation_Response>;
  /** update single row of the table: "areas" */
  update_areas_by_pk?: Maybe<Areas>;
  /** update multiples rows of table: "areas" */
  update_areas_many?: Maybe<Array<Maybe<Areas_Mutation_Response>>>;
  /** update data of the table: "audit_logs" */
  update_audit_logs?: Maybe<Audit_Logs_Mutation_Response>;
  /** update multiples rows of table: "audit_logs" */
  update_audit_logs_many?: Maybe<Array<Maybe<Audit_Logs_Mutation_Response>>>;
  /** update data of the table: "checkout_baskets" */
  update_checkout_baskets?: Maybe<Checkout_Baskets_Mutation_Response>;
  /** update single row of the table: "checkout_baskets" */
  update_checkout_baskets_by_pk?: Maybe<Checkout_Baskets>;
  /** update multiples rows of table: "checkout_baskets" */
  update_checkout_baskets_many?: Maybe<
    Array<Maybe<Checkout_Baskets_Mutation_Response>>
  >;
  /** update data of the table: "cities" */
  update_cities?: Maybe<Cities_Mutation_Response>;
  /** update single row of the table: "cities" */
  update_cities_by_pk?: Maybe<Cities>;
  /** update multiples rows of table: "cities" */
  update_cities_many?: Maybe<Array<Maybe<Cities_Mutation_Response>>>;
  /** update data of the table: "command" */
  update_command?: Maybe<Command_Mutation_Response>;
  /** update single row of the table: "command" */
  update_command_by_pk?: Maybe<Command>;
  /** update multiples rows of table: "command" */
  update_command_many?: Maybe<Array<Maybe<Command_Mutation_Response>>>;
  /** update data of the table: "commercial_offer" */
  update_commercial_offer?: Maybe<Commercial_Offer_Mutation_Response>;
  /** update single row of the table: "commercial_offer" */
  update_commercial_offer_by_pk?: Maybe<Commercial_Offer>;
  /** update multiples rows of table: "commercial_offer" */
  update_commercial_offer_many?: Maybe<
    Array<Maybe<Commercial_Offer_Mutation_Response>>
  >;
  /** update data of the table: "connectors.connector" */
  update_connectors_connector?: Maybe<Connectors_Connector_Mutation_Response>;
  /** update single row of the table: "connectors.connector" */
  update_connectors_connector_by_pk?: Maybe<Connectors_Connector>;
  /** update multiples rows of table: "connectors.connector" */
  update_connectors_connector_many?: Maybe<
    Array<Maybe<Connectors_Connector_Mutation_Response>>
  >;
  /** update data of the table: "connectors.webhook" */
  update_connectors_webhook?: Maybe<Connectors_Webhook_Mutation_Response>;
  /** update single row of the table: "connectors.webhook" */
  update_connectors_webhook_by_pk?: Maybe<Connectors_Webhook>;
  /** update multiples rows of table: "connectors.webhook" */
  update_connectors_webhook_many?: Maybe<
    Array<Maybe<Connectors_Webhook_Mutation_Response>>
  >;
  /** update data of the table: "consumers" */
  update_consumers?: Maybe<Consumers_Mutation_Response>;
  /** update single row of the table: "consumers" */
  update_consumers_by_pk?: Maybe<Consumers>;
  /** update data of the table: "consumers_credit_limits" */
  update_consumers_credit_limits?: Maybe<Consumers_Credit_Limits_Mutation_Response>;
  /** update single row of the table: "consumers_credit_limits" */
  update_consumers_credit_limits_by_pk?: Maybe<Consumers_Credit_Limits>;
  /** update multiples rows of table: "consumers_credit_limits" */
  update_consumers_credit_limits_many?: Maybe<
    Array<Maybe<Consumers_Credit_Limits_Mutation_Response>>
  >;
  /** update multiples rows of table: "consumers" */
  update_consumers_many?: Maybe<Array<Maybe<Consumers_Mutation_Response>>>;
  /** update data of the table: "entry" */
  update_entry?: Maybe<Entry_Mutation_Response>;
  /** update single row of the table: "entry" */
  update_entry_by_pk?: Maybe<Entry>;
  /** update multiples rows of table: "entry" */
  update_entry_many?: Maybe<Array<Maybe<Entry_Mutation_Response>>>;
  /** update data of the table: "governorates" */
  update_governorates?: Maybe<Governorates_Mutation_Response>;
  /** update single row of the table: "governorates" */
  update_governorates_by_pk?: Maybe<Governorates>;
  /** update multiples rows of table: "governorates" */
  update_governorates_many?: Maybe<
    Array<Maybe<Governorates_Mutation_Response>>
  >;
  /** update data of the table: "identities" */
  update_identities?: Maybe<Identities_Mutation_Response>;
  /** update single row of the table: "identities" */
  update_identities_by_pk?: Maybe<Identities>;
  /** update multiples rows of table: "identities" */
  update_identities_many?: Maybe<Array<Maybe<Identities_Mutation_Response>>>;
  /** update data of the table: "identity_verifiable_addresses" */
  update_identity_verifiable_addresses?: Maybe<Identity_Verifiable_Addresses_Mutation_Response>;
  /** update single row of the table: "identity_verifiable_addresses" */
  update_identity_verifiable_addresses_by_pk?: Maybe<Identity_Verifiable_Addresses>;
  /** update multiples rows of table: "identity_verifiable_addresses" */
  update_identity_verifiable_addresses_many?: Maybe<
    Array<Maybe<Identity_Verifiable_Addresses_Mutation_Response>>
  >;
  /** update data of the table: "journal" */
  update_journal?: Maybe<Journal_Mutation_Response>;
  /** update single row of the table: "journal" */
  update_journal_by_pk?: Maybe<Journal>;
  /** update multiples rows of table: "journal" */
  update_journal_many?: Maybe<Array<Maybe<Journal_Mutation_Response>>>;
  /** update data of the table: "journal_voucher_entries" */
  update_journal_voucher_entries?: Maybe<Journal_Voucher_Entries_Mutation_Response>;
  /** update multiples rows of table: "journal_voucher_entries" */
  update_journal_voucher_entries_many?: Maybe<
    Array<Maybe<Journal_Voucher_Entries_Mutation_Response>>
  >;
  /** update data of the table: "keto_relation_tuples" */
  update_keto_relation_tuples?: Maybe<Keto_Relation_Tuples_Mutation_Response>;
  /** update single row of the table: "keto_relation_tuples" */
  update_keto_relation_tuples_by_pk?: Maybe<Keto_Relation_Tuples>;
  /** update multiples rows of table: "keto_relation_tuples" */
  update_keto_relation_tuples_many?: Maybe<
    Array<Maybe<Keto_Relation_Tuples_Mutation_Response>>
  >;
  /** update data of the table: "keto_uuid_mappings" */
  update_keto_uuid_mappings?: Maybe<Keto_Uuid_Mappings_Mutation_Response>;
  /** update single row of the table: "keto_uuid_mappings" */
  update_keto_uuid_mappings_by_pk?: Maybe<Keto_Uuid_Mappings>;
  /** update multiples rows of table: "keto_uuid_mappings" */
  update_keto_uuid_mappings_many?: Maybe<
    Array<Maybe<Keto_Uuid_Mappings_Mutation_Response>>
  >;
  /** update data of the table: "loan" */
  update_loan?: Maybe<Loan_Mutation_Response>;
  /** update single row of the table: "loan" */
  update_loan_by_pk?: Maybe<Loan>;
  /** update multiples rows of table: "loan" */
  update_loan_many?: Maybe<Array<Maybe<Loan_Mutation_Response>>>;
  /** update data of the table: "loan_schedule" */
  update_loan_schedule?: Maybe<Loan_Schedule_Mutation_Response>;
  /** update single row of the table: "loan_schedule" */
  update_loan_schedule_by_pk?: Maybe<Loan_Schedule>;
  /** update multiples rows of table: "loan_schedule" */
  update_loan_schedule_many?: Maybe<
    Array<Maybe<Loan_Schedule_Mutation_Response>>
  >;
  /** update data of the table: "loan_status" */
  update_loan_status?: Maybe<Loan_Status_Mutation_Response>;
  /** update single row of the table: "loan_status" */
  update_loan_status_by_pk?: Maybe<Loan_Status>;
  /** update multiples rows of table: "loan_status" */
  update_loan_status_many?: Maybe<Array<Maybe<Loan_Status_Mutation_Response>>>;
  /** update data of the table: "merchant_payment" */
  update_merchant_payment?: Maybe<Merchant_Payment_Mutation_Response>;
  /** update single row of the table: "merchant_payment" */
  update_merchant_payment_by_pk?: Maybe<Merchant_Payment>;
  /** update multiples rows of table: "merchant_payment" */
  update_merchant_payment_many?: Maybe<
    Array<Maybe<Merchant_Payment_Mutation_Response>>
  >;
  /** update data of the table: "merchant_transaction_slip" */
  update_merchant_transaction_slip?: Maybe<Merchant_Transaction_Slip_Mutation_Response>;
  /** update single row of the table: "merchant_transaction_slip" */
  update_merchant_transaction_slip_by_pk?: Maybe<Merchant_Transaction_Slip>;
  /** update multiples rows of table: "merchant_transaction_slip" */
  update_merchant_transaction_slip_many?: Maybe<
    Array<Maybe<Merchant_Transaction_Slip_Mutation_Response>>
  >;
  /** update data of the table: "partner" */
  update_partner?: Maybe<Partner_Mutation_Response>;
  /** update data of the table: "partner_bank_account" */
  update_partner_bank_account?: Maybe<Partner_Bank_Account_Mutation_Response>;
  /** update single row of the table: "partner_bank_account" */
  update_partner_bank_account_by_pk?: Maybe<Partner_Bank_Account>;
  /** update multiples rows of table: "partner_bank_account" */
  update_partner_bank_account_many?: Maybe<
    Array<Maybe<Partner_Bank_Account_Mutation_Response>>
  >;
  /** update data of the table: "partner_branch" */
  update_partner_branch?: Maybe<Partner_Branch_Mutation_Response>;
  /** update single row of the table: "partner_branch" */
  update_partner_branch_by_pk?: Maybe<Partner_Branch>;
  /** update multiples rows of table: "partner_branch" */
  update_partner_branch_many?: Maybe<
    Array<Maybe<Partner_Branch_Mutation_Response>>
  >;
  /** update single row of the table: "partner" */
  update_partner_by_pk?: Maybe<Partner>;
  /** update multiples rows of table: "partner" */
  update_partner_many?: Maybe<Array<Maybe<Partner_Mutation_Response>>>;
  /** update data of the table: "partner_top" */
  update_partner_top?: Maybe<Partner_Top_Mutation_Response>;
  /** update single row of the table: "partner_top" */
  update_partner_top_by_pk?: Maybe<Partner_Top>;
  /** update multiples rows of table: "partner_top" */
  update_partner_top_many?: Maybe<Array<Maybe<Partner_Top_Mutation_Response>>>;
  /** update data of the table: "partner_user_profile" */
  update_partner_user_profile?: Maybe<Partner_User_Profile_Mutation_Response>;
  /** update single row of the table: "partner_user_profile" */
  update_partner_user_profile_by_pk?: Maybe<Partner_User_Profile>;
  /** update multiples rows of table: "partner_user_profile" */
  update_partner_user_profile_many?: Maybe<
    Array<Maybe<Partner_User_Profile_Mutation_Response>>
  >;
  /** update data of the table: "party_account" */
  update_party_account?: Maybe<Party_Account_Mutation_Response>;
  /** update single row of the table: "party_account" */
  update_party_account_by_pk?: Maybe<Party_Account>;
  /** update multiples rows of table: "party_account" */
  update_party_account_many?: Maybe<
    Array<Maybe<Party_Account_Mutation_Response>>
  >;
  /** update data of the table: "payments.adjustment" */
  update_payments_adjustment?: Maybe<Payments_Adjustment_Mutation_Response>;
  /** update single row of the table: "payments.adjustment" */
  update_payments_adjustment_by_pk?: Maybe<Payments_Adjustment>;
  /** update multiples rows of table: "payments.adjustment" */
  update_payments_adjustment_many?: Maybe<
    Array<Maybe<Payments_Adjustment_Mutation_Response>>
  >;
  /** update data of the table: "payments.metadata" */
  update_payments_metadata?: Maybe<Payments_Metadata_Mutation_Response>;
  /** update single row of the table: "payments.metadata" */
  update_payments_metadata_by_pk?: Maybe<Payments_Metadata>;
  /** update multiples rows of table: "payments.metadata" */
  update_payments_metadata_many?: Maybe<
    Array<Maybe<Payments_Metadata_Mutation_Response>>
  >;
  /** update data of the table: "payments.payment" */
  update_payments_payment?: Maybe<Payments_Payment_Mutation_Response>;
  /** update single row of the table: "payments.payment" */
  update_payments_payment_by_pk?: Maybe<Payments_Payment>;
  /** update multiples rows of table: "payments.payment" */
  update_payments_payment_many?: Maybe<
    Array<Maybe<Payments_Payment_Mutation_Response>>
  >;
  /** update data of the table: "payments.transfers" */
  update_payments_transfers?: Maybe<Payments_Transfers_Mutation_Response>;
  /** update single row of the table: "payments.transfers" */
  update_payments_transfers_by_pk?: Maybe<Payments_Transfers>;
  /** update multiples rows of table: "payments.transfers" */
  update_payments_transfers_many?: Maybe<
    Array<Maybe<Payments_Transfers_Mutation_Response>>
  >;
  /** update data of the table: "registry_payment" */
  update_registry_payment?: Maybe<Registry_Payment_Mutation_Response>;
  /** update single row of the table: "registry_payment" */
  update_registry_payment_by_pk?: Maybe<Registry_Payment>;
  /** update multiples rows of table: "registry_payment" */
  update_registry_payment_many?: Maybe<
    Array<Maybe<Registry_Payment_Mutation_Response>>
  >;
  /** update data of the table: "session_baskets" */
  update_session_baskets?: Maybe<Session_Baskets_Mutation_Response>;
  /** update single row of the table: "session_baskets" */
  update_session_baskets_by_pk?: Maybe<Session_Baskets>;
  /** update multiples rows of table: "session_baskets" */
  update_session_baskets_many?: Maybe<
    Array<Maybe<Session_Baskets_Mutation_Response>>
  >;
  /** update data of the table: "transfers.transfer_initiation" */
  update_transfers_transfer_initiation?: Maybe<Transfers_Transfer_Initiation_Mutation_Response>;
  /** update data of the table: "transfers.transfer_initiation_adjustments" */
  update_transfers_transfer_initiation_adjustments?: Maybe<Transfers_Transfer_Initiation_Adjustments_Mutation_Response>;
  /** update single row of the table: "transfers.transfer_initiation_adjustments" */
  update_transfers_transfer_initiation_adjustments_by_pk?: Maybe<Transfers_Transfer_Initiation_Adjustments>;
  /** update multiples rows of table: "transfers.transfer_initiation_adjustments" */
  update_transfers_transfer_initiation_adjustments_many?: Maybe<
    Array<Maybe<Transfers_Transfer_Initiation_Adjustments_Mutation_Response>>
  >;
  /** update single row of the table: "transfers.transfer_initiation" */
  update_transfers_transfer_initiation_by_pk?: Maybe<Transfers_Transfer_Initiation>;
  /** update multiples rows of table: "transfers.transfer_initiation" */
  update_transfers_transfer_initiation_many?: Maybe<
    Array<Maybe<Transfers_Transfer_Initiation_Mutation_Response>>
  >;
  /** update data of the table: "transfers.transfer_initiation_payments" */
  update_transfers_transfer_initiation_payments?: Maybe<Transfers_Transfer_Initiation_Payments_Mutation_Response>;
  /** update single row of the table: "transfers.transfer_initiation_payments" */
  update_transfers_transfer_initiation_payments_by_pk?: Maybe<Transfers_Transfer_Initiation_Payments>;
  /** update multiples rows of table: "transfers.transfer_initiation_payments" */
  update_transfers_transfer_initiation_payments_many?: Maybe<
    Array<Maybe<Transfers_Transfer_Initiation_Payments_Mutation_Response>>
  >;
  /** update data of the table: "transfers.transfer_reversal" */
  update_transfers_transfer_reversal?: Maybe<Transfers_Transfer_Reversal_Mutation_Response>;
  /** update single row of the table: "transfers.transfer_reversal" */
  update_transfers_transfer_reversal_by_pk?: Maybe<Transfers_Transfer_Reversal>;
  /** update multiples rows of table: "transfers.transfer_reversal" */
  update_transfers_transfer_reversal_many?: Maybe<
    Array<Maybe<Transfers_Transfer_Reversal_Mutation_Response>>
  >;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_AccountArgs = {
  where: Accounts_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Account_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Accounts_BalancesArgs = {
  where: Accounts_Balances_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Balances_By_PkArgs = {
  account_id: Scalars['String']['input'];
  created_at: Scalars['timestamptz']['input'];
  currency: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Bank_AccountArgs = {
  where: Accounts_Bank_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Bank_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Bank_Account_Related_AccountsArgs = {
  where: Accounts_Bank_Account_Related_Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Bank_Account_Related_Accounts_By_PkArgs =
  {
    id: Scalars['uuid']['input'];
  };

/** mutation root */
export type Mutation_RootDelete_Accounts_Pool_AccountsArgs = {
  where: Accounts_Pool_Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Pool_Accounts_By_PkArgs = {
  account_id: Scalars['String']['input'];
  pool_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Accounts_PoolsArgs = {
  where: Accounts_Pools_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_Pools_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_AreasArgs = {
  where: Areas_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Areas_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Audit_LogsArgs = {
  where: Audit_Logs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Checkout_BasketsArgs = {
  where: Checkout_Baskets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Checkout_Baskets_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_CitiesArgs = {
  where: Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Cities_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_CommandArgs = {
  where: Command_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Command_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Commercial_OfferArgs = {
  where: Commercial_Offer_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Commercial_Offer_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Connectors_ConnectorArgs = {
  where: Connectors_Connector_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Connectors_Connector_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Connectors_WebhookArgs = {
  where: Connectors_Webhook_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Connectors_Webhook_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_ConsumersArgs = {
  where: Consumers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Consumers_Credit_LimitsArgs = {
  where: Consumers_Credit_Limits_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumers_Credit_Limits_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_EntryArgs = {
  where: Entry_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Entry_By_PkArgs = {
  id: Scalars['bigint']['input'];
};

/** mutation root */
export type Mutation_RootDelete_GovernoratesArgs = {
  where: Governorates_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Governorates_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_IdentitiesArgs = {
  where: Identities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Identities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Identity_Verifiable_AddressesArgs = {
  where: Identity_Verifiable_Addresses_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Identity_Verifiable_Addresses_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_JournalArgs = {
  where: Journal_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Journal_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Journal_Voucher_EntriesArgs = {
  where: Journal_Voucher_Entries_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Keto_Relation_TuplesArgs = {
  where: Keto_Relation_Tuples_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Keto_Relation_Tuples_By_PkArgs = {
  nid: Scalars['uuid']['input'];
  shard_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Keto_Uuid_MappingsArgs = {
  where: Keto_Uuid_Mappings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Keto_Uuid_Mappings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_LoanArgs = {
  where: Loan_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Loan_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Loan_ScheduleArgs = {
  where: Loan_Schedule_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Loan_Schedule_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Loan_StatusArgs = {
  where: Loan_Status_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Loan_Status_By_PkArgs = {
  loan_id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Merchant_PaymentArgs = {
  where: Merchant_Payment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Merchant_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Merchant_Transaction_SlipArgs = {
  where: Merchant_Transaction_Slip_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Merchant_Transaction_Slip_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_PartnerArgs = {
  where: Partner_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Partner_Bank_AccountArgs = {
  where: Partner_Bank_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Partner_Bank_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Partner_BranchArgs = {
  where: Partner_Branch_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Partner_Branch_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Partner_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Partner_TopArgs = {
  where: Partner_Top_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Partner_Top_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Partner_User_ProfileArgs = {
  where: Partner_User_Profile_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Partner_User_Profile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Party_AccountArgs = {
  where: Party_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Party_Account_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Payments_AdjustmentArgs = {
  where: Payments_Adjustment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Adjustment_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Payments_MetadataArgs = {
  where: Payments_Metadata_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Metadata_By_PkArgs = {
  key: Scalars['String']['input'];
  payment_id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Payments_PaymentArgs = {
  where: Payments_Payment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Payments_TransfersArgs = {
  where: Payments_Transfers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Transfers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Registry_PaymentArgs = {
  where: Registry_Payment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Registry_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Session_BasketsArgs = {
  where: Session_Baskets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Session_Baskets_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_InitiationArgs = {
  where: Transfers_Transfer_Initiation_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_Initiation_AdjustmentsArgs =
  {
    where: Transfers_Transfer_Initiation_Adjustments_Bool_Exp;
  };

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_Initiation_Adjustments_By_PkArgs =
  {
    id: Scalars['uuid']['input'];
  };

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_Initiation_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_Initiation_PaymentsArgs = {
  where: Transfers_Transfer_Initiation_Payments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_Initiation_Payments_By_PkArgs =
  {
    payment_id: Scalars['String']['input'];
    transfer_initiation_id: Scalars['String']['input'];
  };

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_ReversalArgs = {
  where: Transfers_Transfer_Reversal_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Transfers_Transfer_Reversal_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootInsert_Accounts_AccountArgs = {
  objects: Array<Accounts_Account_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Account_OneArgs = {
  object: Accounts_Account_Insert_Input;
  on_conflict?: InputMaybe<Accounts_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_BalancesArgs = {
  objects: Array<Accounts_Balances_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_Balances_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Balances_OneArgs = {
  object: Accounts_Balances_Insert_Input;
  on_conflict?: InputMaybe<Accounts_Balances_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Bank_AccountArgs = {
  objects: Array<Accounts_Bank_Account_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_Bank_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Bank_Account_OneArgs = {
  object: Accounts_Bank_Account_Insert_Input;
  on_conflict?: InputMaybe<Accounts_Bank_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Bank_Account_Related_AccountsArgs = {
  objects: Array<Accounts_Bank_Account_Related_Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_Bank_Account_Related_Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Bank_Account_Related_Accounts_OneArgs =
  {
    object: Accounts_Bank_Account_Related_Accounts_Insert_Input;
    on_conflict?: InputMaybe<Accounts_Bank_Account_Related_Accounts_On_Conflict>;
  };

/** mutation root */
export type Mutation_RootInsert_Accounts_Pool_AccountsArgs = {
  objects: Array<Accounts_Pool_Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_Pool_Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Pool_Accounts_OneArgs = {
  object: Accounts_Pool_Accounts_Insert_Input;
  on_conflict?: InputMaybe<Accounts_Pool_Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_PoolsArgs = {
  objects: Array<Accounts_Pools_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_Pools_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_Pools_OneArgs = {
  object: Accounts_Pools_Insert_Input;
  on_conflict?: InputMaybe<Accounts_Pools_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AreasArgs = {
  objects: Array<Areas_Insert_Input>;
  on_conflict?: InputMaybe<Areas_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Areas_OneArgs = {
  object: Areas_Insert_Input;
  on_conflict?: InputMaybe<Areas_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Audit_LogsArgs = {
  objects: Array<Audit_Logs_Insert_Input>;
};

/** mutation root */
export type Mutation_RootInsert_Audit_Logs_OneArgs = {
  object: Audit_Logs_Insert_Input;
};

/** mutation root */
export type Mutation_RootInsert_Checkout_BasketsArgs = {
  objects: Array<Checkout_Baskets_Insert_Input>;
  on_conflict?: InputMaybe<Checkout_Baskets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Checkout_Baskets_OneArgs = {
  object: Checkout_Baskets_Insert_Input;
  on_conflict?: InputMaybe<Checkout_Baskets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_CitiesArgs = {
  objects: Array<Cities_Insert_Input>;
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Cities_OneArgs = {
  object: Cities_Insert_Input;
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_CommandArgs = {
  objects: Array<Command_Insert_Input>;
  on_conflict?: InputMaybe<Command_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Command_OneArgs = {
  object: Command_Insert_Input;
  on_conflict?: InputMaybe<Command_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Commercial_OfferArgs = {
  objects: Array<Commercial_Offer_Insert_Input>;
  on_conflict?: InputMaybe<Commercial_Offer_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Commercial_Offer_OneArgs = {
  object: Commercial_Offer_Insert_Input;
  on_conflict?: InputMaybe<Commercial_Offer_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Connectors_ConnectorArgs = {
  objects: Array<Connectors_Connector_Insert_Input>;
  on_conflict?: InputMaybe<Connectors_Connector_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Connectors_Connector_OneArgs = {
  object: Connectors_Connector_Insert_Input;
  on_conflict?: InputMaybe<Connectors_Connector_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Connectors_WebhookArgs = {
  objects: Array<Connectors_Webhook_Insert_Input>;
  on_conflict?: InputMaybe<Connectors_Webhook_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Connectors_Webhook_OneArgs = {
  object: Connectors_Webhook_Insert_Input;
  on_conflict?: InputMaybe<Connectors_Webhook_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ConsumersArgs = {
  objects: Array<Consumers_Insert_Input>;
  on_conflict?: InputMaybe<Consumers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumers_Credit_LimitsArgs = {
  objects: Array<Consumers_Credit_Limits_Insert_Input>;
  on_conflict?: InputMaybe<Consumers_Credit_Limits_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumers_Credit_Limits_OneArgs = {
  object: Consumers_Credit_Limits_Insert_Input;
  on_conflict?: InputMaybe<Consumers_Credit_Limits_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumers_OneArgs = {
  object: Consumers_Insert_Input;
  on_conflict?: InputMaybe<Consumers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_EntryArgs = {
  objects: Array<Entry_Insert_Input>;
  on_conflict?: InputMaybe<Entry_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Entry_OneArgs = {
  object: Entry_Insert_Input;
  on_conflict?: InputMaybe<Entry_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_GovernoratesArgs = {
  objects: Array<Governorates_Insert_Input>;
  on_conflict?: InputMaybe<Governorates_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Governorates_OneArgs = {
  object: Governorates_Insert_Input;
  on_conflict?: InputMaybe<Governorates_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_IdentitiesArgs = {
  objects: Array<Identities_Insert_Input>;
  on_conflict?: InputMaybe<Identities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Identities_OneArgs = {
  object: Identities_Insert_Input;
  on_conflict?: InputMaybe<Identities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Identity_Verifiable_AddressesArgs = {
  objects: Array<Identity_Verifiable_Addresses_Insert_Input>;
  on_conflict?: InputMaybe<Identity_Verifiable_Addresses_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Identity_Verifiable_Addresses_OneArgs = {
  object: Identity_Verifiable_Addresses_Insert_Input;
  on_conflict?: InputMaybe<Identity_Verifiable_Addresses_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_JournalArgs = {
  objects: Array<Journal_Insert_Input>;
  on_conflict?: InputMaybe<Journal_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Journal_OneArgs = {
  object: Journal_Insert_Input;
  on_conflict?: InputMaybe<Journal_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Journal_Voucher_EntriesArgs = {
  objects: Array<Journal_Voucher_Entries_Insert_Input>;
  on_conflict?: InputMaybe<Journal_Voucher_Entries_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Journal_Voucher_Entries_OneArgs = {
  object: Journal_Voucher_Entries_Insert_Input;
  on_conflict?: InputMaybe<Journal_Voucher_Entries_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Keto_Relation_TuplesArgs = {
  objects: Array<Keto_Relation_Tuples_Insert_Input>;
  on_conflict?: InputMaybe<Keto_Relation_Tuples_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Keto_Relation_Tuples_OneArgs = {
  object: Keto_Relation_Tuples_Insert_Input;
  on_conflict?: InputMaybe<Keto_Relation_Tuples_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Keto_Uuid_MappingsArgs = {
  objects: Array<Keto_Uuid_Mappings_Insert_Input>;
  on_conflict?: InputMaybe<Keto_Uuid_Mappings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Keto_Uuid_Mappings_OneArgs = {
  object: Keto_Uuid_Mappings_Insert_Input;
  on_conflict?: InputMaybe<Keto_Uuid_Mappings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_LoanArgs = {
  objects: Array<Loan_Insert_Input>;
  on_conflict?: InputMaybe<Loan_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Loan_OneArgs = {
  object: Loan_Insert_Input;
  on_conflict?: InputMaybe<Loan_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Loan_ScheduleArgs = {
  objects: Array<Loan_Schedule_Insert_Input>;
  on_conflict?: InputMaybe<Loan_Schedule_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Loan_Schedule_OneArgs = {
  object: Loan_Schedule_Insert_Input;
  on_conflict?: InputMaybe<Loan_Schedule_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Loan_StatusArgs = {
  objects: Array<Loan_Status_Insert_Input>;
  on_conflict?: InputMaybe<Loan_Status_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Loan_Status_OneArgs = {
  object: Loan_Status_Insert_Input;
  on_conflict?: InputMaybe<Loan_Status_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Merchant_PaymentArgs = {
  objects: Array<Merchant_Payment_Insert_Input>;
  on_conflict?: InputMaybe<Merchant_Payment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Merchant_Payment_OneArgs = {
  object: Merchant_Payment_Insert_Input;
  on_conflict?: InputMaybe<Merchant_Payment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Merchant_Transaction_SlipArgs = {
  objects: Array<Merchant_Transaction_Slip_Insert_Input>;
  on_conflict?: InputMaybe<Merchant_Transaction_Slip_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Merchant_Transaction_Slip_OneArgs = {
  object: Merchant_Transaction_Slip_Insert_Input;
  on_conflict?: InputMaybe<Merchant_Transaction_Slip_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_PartnerArgs = {
  objects: Array<Partner_Insert_Input>;
  on_conflict?: InputMaybe<Partner_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_Bank_AccountArgs = {
  objects: Array<Partner_Bank_Account_Insert_Input>;
  on_conflict?: InputMaybe<Partner_Bank_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_Bank_Account_OneArgs = {
  object: Partner_Bank_Account_Insert_Input;
  on_conflict?: InputMaybe<Partner_Bank_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_BranchArgs = {
  objects: Array<Partner_Branch_Insert_Input>;
  on_conflict?: InputMaybe<Partner_Branch_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_Branch_OneArgs = {
  object: Partner_Branch_Insert_Input;
  on_conflict?: InputMaybe<Partner_Branch_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_OneArgs = {
  object: Partner_Insert_Input;
  on_conflict?: InputMaybe<Partner_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_TopArgs = {
  objects: Array<Partner_Top_Insert_Input>;
  on_conflict?: InputMaybe<Partner_Top_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_Top_OneArgs = {
  object: Partner_Top_Insert_Input;
  on_conflict?: InputMaybe<Partner_Top_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_User_ProfileArgs = {
  objects: Array<Partner_User_Profile_Insert_Input>;
  on_conflict?: InputMaybe<Partner_User_Profile_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Partner_User_Profile_OneArgs = {
  object: Partner_User_Profile_Insert_Input;
  on_conflict?: InputMaybe<Partner_User_Profile_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Party_AccountArgs = {
  objects: Array<Party_Account_Insert_Input>;
  on_conflict?: InputMaybe<Party_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Party_Account_OneArgs = {
  object: Party_Account_Insert_Input;
  on_conflict?: InputMaybe<Party_Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_AdjustmentArgs = {
  objects: Array<Payments_Adjustment_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Adjustment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Adjustment_OneArgs = {
  object: Payments_Adjustment_Insert_Input;
  on_conflict?: InputMaybe<Payments_Adjustment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_MetadataArgs = {
  objects: Array<Payments_Metadata_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Metadata_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Metadata_OneArgs = {
  object: Payments_Metadata_Insert_Input;
  on_conflict?: InputMaybe<Payments_Metadata_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_PaymentArgs = {
  objects: Array<Payments_Payment_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Payment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Payment_OneArgs = {
  object: Payments_Payment_Insert_Input;
  on_conflict?: InputMaybe<Payments_Payment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_TransfersArgs = {
  objects: Array<Payments_Transfers_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Transfers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Transfers_OneArgs = {
  object: Payments_Transfers_Insert_Input;
  on_conflict?: InputMaybe<Payments_Transfers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Registry_PaymentArgs = {
  objects: Array<Registry_Payment_Insert_Input>;
  on_conflict?: InputMaybe<Registry_Payment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Registry_Payment_OneArgs = {
  object: Registry_Payment_Insert_Input;
  on_conflict?: InputMaybe<Registry_Payment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Session_BasketsArgs = {
  objects: Array<Session_Baskets_Insert_Input>;
  on_conflict?: InputMaybe<Session_Baskets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Session_Baskets_OneArgs = {
  object: Session_Baskets_Insert_Input;
  on_conflict?: InputMaybe<Session_Baskets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_InitiationArgs = {
  objects: Array<Transfers_Transfer_Initiation_Insert_Input>;
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_Initiation_AdjustmentsArgs =
  {
    objects: Array<Transfers_Transfer_Initiation_Adjustments_Insert_Input>;
    on_conflict?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_On_Conflict>;
  };

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_Initiation_Adjustments_OneArgs =
  {
    object: Transfers_Transfer_Initiation_Adjustments_Insert_Input;
    on_conflict?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_On_Conflict>;
  };

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_Initiation_OneArgs = {
  object: Transfers_Transfer_Initiation_Insert_Input;
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_Initiation_PaymentsArgs = {
  objects: Array<Transfers_Transfer_Initiation_Payments_Insert_Input>;
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_Payments_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_Initiation_Payments_OneArgs =
  {
    object: Transfers_Transfer_Initiation_Payments_Insert_Input;
    on_conflict?: InputMaybe<Transfers_Transfer_Initiation_Payments_On_Conflict>;
  };

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_ReversalArgs = {
  objects: Array<Transfers_Transfer_Reversal_Insert_Input>;
  on_conflict?: InputMaybe<Transfers_Transfer_Reversal_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Transfers_Transfer_Reversal_OneArgs = {
  object: Transfers_Transfer_Reversal_Insert_Input;
  on_conflict?: InputMaybe<Transfers_Transfer_Reversal_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_AccountArgs = {
  _append?: InputMaybe<Accounts_Account_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Account_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Account_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Account_Delete_Key_Input>;
  _prepend?: InputMaybe<Accounts_Account_Prepend_Input>;
  _set?: InputMaybe<Accounts_Account_Set_Input>;
  where: Accounts_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Account_By_PkArgs = {
  _append?: InputMaybe<Accounts_Account_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Account_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Account_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Account_Delete_Key_Input>;
  _prepend?: InputMaybe<Accounts_Account_Prepend_Input>;
  _set?: InputMaybe<Accounts_Account_Set_Input>;
  pk_columns: Accounts_Account_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Account_ManyArgs = {
  updates: Array<Accounts_Account_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_BalancesArgs = {
  _inc?: InputMaybe<Accounts_Balances_Inc_Input>;
  _set?: InputMaybe<Accounts_Balances_Set_Input>;
  where: Accounts_Balances_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Balances_By_PkArgs = {
  _inc?: InputMaybe<Accounts_Balances_Inc_Input>;
  _set?: InputMaybe<Accounts_Balances_Set_Input>;
  pk_columns: Accounts_Balances_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Balances_ManyArgs = {
  updates: Array<Accounts_Balances_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Bank_AccountArgs = {
  _append?: InputMaybe<Accounts_Bank_Account_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Bank_Account_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Bank_Account_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Bank_Account_Delete_Key_Input>;
  _prepend?: InputMaybe<Accounts_Bank_Account_Prepend_Input>;
  _set?: InputMaybe<Accounts_Bank_Account_Set_Input>;
  where: Accounts_Bank_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Bank_Account_By_PkArgs = {
  _append?: InputMaybe<Accounts_Bank_Account_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Bank_Account_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Bank_Account_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Bank_Account_Delete_Key_Input>;
  _prepend?: InputMaybe<Accounts_Bank_Account_Prepend_Input>;
  _set?: InputMaybe<Accounts_Bank_Account_Set_Input>;
  pk_columns: Accounts_Bank_Account_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Bank_Account_ManyArgs = {
  updates: Array<Accounts_Bank_Account_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Bank_Account_Related_AccountsArgs = {
  _set?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Set_Input>;
  where: Accounts_Bank_Account_Related_Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Bank_Account_Related_Accounts_By_PkArgs =
  {
    _set?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Set_Input>;
    pk_columns: Accounts_Bank_Account_Related_Accounts_Pk_Columns_Input;
  };

/** mutation root */
export type Mutation_RootUpdate_Accounts_Bank_Account_Related_Accounts_ManyArgs =
  {
    updates: Array<Accounts_Bank_Account_Related_Accounts_Updates>;
  };

/** mutation root */
export type Mutation_RootUpdate_Accounts_Pool_AccountsArgs = {
  _set?: InputMaybe<Accounts_Pool_Accounts_Set_Input>;
  where: Accounts_Pool_Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Pool_Accounts_By_PkArgs = {
  _set?: InputMaybe<Accounts_Pool_Accounts_Set_Input>;
  pk_columns: Accounts_Pool_Accounts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Pool_Accounts_ManyArgs = {
  updates: Array<Accounts_Pool_Accounts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_PoolsArgs = {
  _set?: InputMaybe<Accounts_Pools_Set_Input>;
  where: Accounts_Pools_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Pools_By_PkArgs = {
  _set?: InputMaybe<Accounts_Pools_Set_Input>;
  pk_columns: Accounts_Pools_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_Pools_ManyArgs = {
  updates: Array<Accounts_Pools_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_AreasArgs = {
  _inc?: InputMaybe<Areas_Inc_Input>;
  _set?: InputMaybe<Areas_Set_Input>;
  where: Areas_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Areas_By_PkArgs = {
  _inc?: InputMaybe<Areas_Inc_Input>;
  _set?: InputMaybe<Areas_Set_Input>;
  pk_columns: Areas_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Areas_ManyArgs = {
  updates: Array<Areas_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Audit_LogsArgs = {
  _append?: InputMaybe<Audit_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Audit_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Audit_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Audit_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Audit_Logs_Prepend_Input>;
  _set?: InputMaybe<Audit_Logs_Set_Input>;
  where: Audit_Logs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Audit_Logs_ManyArgs = {
  updates: Array<Audit_Logs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Checkout_BasketsArgs = {
  _append?: InputMaybe<Checkout_Baskets_Append_Input>;
  _delete_at_path?: InputMaybe<Checkout_Baskets_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Checkout_Baskets_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Checkout_Baskets_Delete_Key_Input>;
  _inc?: InputMaybe<Checkout_Baskets_Inc_Input>;
  _prepend?: InputMaybe<Checkout_Baskets_Prepend_Input>;
  _set?: InputMaybe<Checkout_Baskets_Set_Input>;
  where: Checkout_Baskets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Checkout_Baskets_By_PkArgs = {
  _append?: InputMaybe<Checkout_Baskets_Append_Input>;
  _delete_at_path?: InputMaybe<Checkout_Baskets_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Checkout_Baskets_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Checkout_Baskets_Delete_Key_Input>;
  _inc?: InputMaybe<Checkout_Baskets_Inc_Input>;
  _prepend?: InputMaybe<Checkout_Baskets_Prepend_Input>;
  _set?: InputMaybe<Checkout_Baskets_Set_Input>;
  pk_columns: Checkout_Baskets_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Checkout_Baskets_ManyArgs = {
  updates: Array<Checkout_Baskets_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_CitiesArgs = {
  _inc?: InputMaybe<Cities_Inc_Input>;
  _set?: InputMaybe<Cities_Set_Input>;
  where: Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Cities_By_PkArgs = {
  _inc?: InputMaybe<Cities_Inc_Input>;
  _set?: InputMaybe<Cities_Set_Input>;
  pk_columns: Cities_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Cities_ManyArgs = {
  updates: Array<Cities_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_CommandArgs = {
  _inc?: InputMaybe<Command_Inc_Input>;
  _set?: InputMaybe<Command_Set_Input>;
  where: Command_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Command_By_PkArgs = {
  _inc?: InputMaybe<Command_Inc_Input>;
  _set?: InputMaybe<Command_Set_Input>;
  pk_columns: Command_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Command_ManyArgs = {
  updates: Array<Command_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Commercial_OfferArgs = {
  _inc?: InputMaybe<Commercial_Offer_Inc_Input>;
  _set?: InputMaybe<Commercial_Offer_Set_Input>;
  where: Commercial_Offer_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Commercial_Offer_By_PkArgs = {
  _inc?: InputMaybe<Commercial_Offer_Inc_Input>;
  _set?: InputMaybe<Commercial_Offer_Set_Input>;
  pk_columns: Commercial_Offer_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Commercial_Offer_ManyArgs = {
  updates: Array<Commercial_Offer_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Connectors_ConnectorArgs = {
  _set?: InputMaybe<Connectors_Connector_Set_Input>;
  where: Connectors_Connector_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Connectors_Connector_By_PkArgs = {
  _set?: InputMaybe<Connectors_Connector_Set_Input>;
  pk_columns: Connectors_Connector_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Connectors_Connector_ManyArgs = {
  updates: Array<Connectors_Connector_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Connectors_WebhookArgs = {
  _set?: InputMaybe<Connectors_Webhook_Set_Input>;
  where: Connectors_Webhook_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Connectors_Webhook_By_PkArgs = {
  _set?: InputMaybe<Connectors_Webhook_Set_Input>;
  pk_columns: Connectors_Webhook_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Connectors_Webhook_ManyArgs = {
  updates: Array<Connectors_Webhook_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ConsumersArgs = {
  _inc?: InputMaybe<Consumers_Inc_Input>;
  _set?: InputMaybe<Consumers_Set_Input>;
  where: Consumers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumers_By_PkArgs = {
  _inc?: InputMaybe<Consumers_Inc_Input>;
  _set?: InputMaybe<Consumers_Set_Input>;
  pk_columns: Consumers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumers_Credit_LimitsArgs = {
  _inc?: InputMaybe<Consumers_Credit_Limits_Inc_Input>;
  _set?: InputMaybe<Consumers_Credit_Limits_Set_Input>;
  where: Consumers_Credit_Limits_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumers_Credit_Limits_By_PkArgs = {
  _inc?: InputMaybe<Consumers_Credit_Limits_Inc_Input>;
  _set?: InputMaybe<Consumers_Credit_Limits_Set_Input>;
  pk_columns: Consumers_Credit_Limits_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumers_Credit_Limits_ManyArgs = {
  updates: Array<Consumers_Credit_Limits_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumers_ManyArgs = {
  updates: Array<Consumers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_EntryArgs = {
  _inc?: InputMaybe<Entry_Inc_Input>;
  _set?: InputMaybe<Entry_Set_Input>;
  where: Entry_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Entry_By_PkArgs = {
  _inc?: InputMaybe<Entry_Inc_Input>;
  _set?: InputMaybe<Entry_Set_Input>;
  pk_columns: Entry_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Entry_ManyArgs = {
  updates: Array<Entry_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_GovernoratesArgs = {
  _inc?: InputMaybe<Governorates_Inc_Input>;
  _set?: InputMaybe<Governorates_Set_Input>;
  where: Governorates_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Governorates_By_PkArgs = {
  _inc?: InputMaybe<Governorates_Inc_Input>;
  _set?: InputMaybe<Governorates_Set_Input>;
  pk_columns: Governorates_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Governorates_ManyArgs = {
  updates: Array<Governorates_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_IdentitiesArgs = {
  _append?: InputMaybe<Identities_Append_Input>;
  _delete_at_path?: InputMaybe<Identities_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Identities_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Identities_Delete_Key_Input>;
  _prepend?: InputMaybe<Identities_Prepend_Input>;
  _set?: InputMaybe<Identities_Set_Input>;
  where: Identities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Identities_By_PkArgs = {
  _append?: InputMaybe<Identities_Append_Input>;
  _delete_at_path?: InputMaybe<Identities_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Identities_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Identities_Delete_Key_Input>;
  _prepend?: InputMaybe<Identities_Prepend_Input>;
  _set?: InputMaybe<Identities_Set_Input>;
  pk_columns: Identities_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Identities_ManyArgs = {
  updates: Array<Identities_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Identity_Verifiable_AddressesArgs = {
  _set?: InputMaybe<Identity_Verifiable_Addresses_Set_Input>;
  where: Identity_Verifiable_Addresses_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Identity_Verifiable_Addresses_By_PkArgs = {
  _set?: InputMaybe<Identity_Verifiable_Addresses_Set_Input>;
  pk_columns: Identity_Verifiable_Addresses_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Identity_Verifiable_Addresses_ManyArgs = {
  updates: Array<Identity_Verifiable_Addresses_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_JournalArgs = {
  _inc?: InputMaybe<Journal_Inc_Input>;
  _set?: InputMaybe<Journal_Set_Input>;
  where: Journal_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Journal_By_PkArgs = {
  _inc?: InputMaybe<Journal_Inc_Input>;
  _set?: InputMaybe<Journal_Set_Input>;
  pk_columns: Journal_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Journal_ManyArgs = {
  updates: Array<Journal_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Journal_Voucher_EntriesArgs = {
  _inc?: InputMaybe<Journal_Voucher_Entries_Inc_Input>;
  _set?: InputMaybe<Journal_Voucher_Entries_Set_Input>;
  where: Journal_Voucher_Entries_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Journal_Voucher_Entries_ManyArgs = {
  updates: Array<Journal_Voucher_Entries_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Keto_Relation_TuplesArgs = {
  _set?: InputMaybe<Keto_Relation_Tuples_Set_Input>;
  where: Keto_Relation_Tuples_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Keto_Relation_Tuples_By_PkArgs = {
  _set?: InputMaybe<Keto_Relation_Tuples_Set_Input>;
  pk_columns: Keto_Relation_Tuples_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Keto_Relation_Tuples_ManyArgs = {
  updates: Array<Keto_Relation_Tuples_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Keto_Uuid_MappingsArgs = {
  _set?: InputMaybe<Keto_Uuid_Mappings_Set_Input>;
  where: Keto_Uuid_Mappings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Keto_Uuid_Mappings_By_PkArgs = {
  _set?: InputMaybe<Keto_Uuid_Mappings_Set_Input>;
  pk_columns: Keto_Uuid_Mappings_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Keto_Uuid_Mappings_ManyArgs = {
  updates: Array<Keto_Uuid_Mappings_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_LoanArgs = {
  _set?: InputMaybe<Loan_Set_Input>;
  where: Loan_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_By_PkArgs = {
  _set?: InputMaybe<Loan_Set_Input>;
  pk_columns: Loan_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_ManyArgs = {
  updates: Array<Loan_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_ScheduleArgs = {
  _inc?: InputMaybe<Loan_Schedule_Inc_Input>;
  _set?: InputMaybe<Loan_Schedule_Set_Input>;
  where: Loan_Schedule_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_Schedule_By_PkArgs = {
  _inc?: InputMaybe<Loan_Schedule_Inc_Input>;
  _set?: InputMaybe<Loan_Schedule_Set_Input>;
  pk_columns: Loan_Schedule_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_Schedule_ManyArgs = {
  updates: Array<Loan_Schedule_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_StatusArgs = {
  _set?: InputMaybe<Loan_Status_Set_Input>;
  where: Loan_Status_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_Status_By_PkArgs = {
  _set?: InputMaybe<Loan_Status_Set_Input>;
  pk_columns: Loan_Status_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Loan_Status_ManyArgs = {
  updates: Array<Loan_Status_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Merchant_PaymentArgs = {
  _inc?: InputMaybe<Merchant_Payment_Inc_Input>;
  _set?: InputMaybe<Merchant_Payment_Set_Input>;
  where: Merchant_Payment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Merchant_Payment_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Payment_Inc_Input>;
  _set?: InputMaybe<Merchant_Payment_Set_Input>;
  pk_columns: Merchant_Payment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Merchant_Payment_ManyArgs = {
  updates: Array<Merchant_Payment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Merchant_Transaction_SlipArgs = {
  _inc?: InputMaybe<Merchant_Transaction_Slip_Inc_Input>;
  _set?: InputMaybe<Merchant_Transaction_Slip_Set_Input>;
  where: Merchant_Transaction_Slip_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Merchant_Transaction_Slip_By_PkArgs = {
  _inc?: InputMaybe<Merchant_Transaction_Slip_Inc_Input>;
  _set?: InputMaybe<Merchant_Transaction_Slip_Set_Input>;
  pk_columns: Merchant_Transaction_Slip_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Merchant_Transaction_Slip_ManyArgs = {
  updates: Array<Merchant_Transaction_Slip_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_PartnerArgs = {
  _set?: InputMaybe<Partner_Set_Input>;
  where: Partner_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Bank_AccountArgs = {
  _set?: InputMaybe<Partner_Bank_Account_Set_Input>;
  where: Partner_Bank_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Bank_Account_By_PkArgs = {
  _set?: InputMaybe<Partner_Bank_Account_Set_Input>;
  pk_columns: Partner_Bank_Account_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Bank_Account_ManyArgs = {
  updates: Array<Partner_Bank_Account_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_BranchArgs = {
  _inc?: InputMaybe<Partner_Branch_Inc_Input>;
  _set?: InputMaybe<Partner_Branch_Set_Input>;
  where: Partner_Branch_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Branch_By_PkArgs = {
  _inc?: InputMaybe<Partner_Branch_Inc_Input>;
  _set?: InputMaybe<Partner_Branch_Set_Input>;
  pk_columns: Partner_Branch_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Branch_ManyArgs = {
  updates: Array<Partner_Branch_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_By_PkArgs = {
  _set?: InputMaybe<Partner_Set_Input>;
  pk_columns: Partner_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_ManyArgs = {
  updates: Array<Partner_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_TopArgs = {
  _set?: InputMaybe<Partner_Top_Set_Input>;
  where: Partner_Top_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Top_By_PkArgs = {
  _set?: InputMaybe<Partner_Top_Set_Input>;
  pk_columns: Partner_Top_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_Top_ManyArgs = {
  updates: Array<Partner_Top_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_User_ProfileArgs = {
  _set?: InputMaybe<Partner_User_Profile_Set_Input>;
  where: Partner_User_Profile_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_User_Profile_By_PkArgs = {
  _set?: InputMaybe<Partner_User_Profile_Set_Input>;
  pk_columns: Partner_User_Profile_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Partner_User_Profile_ManyArgs = {
  updates: Array<Partner_User_Profile_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Party_AccountArgs = {
  _inc?: InputMaybe<Party_Account_Inc_Input>;
  _set?: InputMaybe<Party_Account_Set_Input>;
  where: Party_Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Party_Account_By_PkArgs = {
  _inc?: InputMaybe<Party_Account_Inc_Input>;
  _set?: InputMaybe<Party_Account_Set_Input>;
  pk_columns: Party_Account_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Party_Account_ManyArgs = {
  updates: Array<Party_Account_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_AdjustmentArgs = {
  _inc?: InputMaybe<Payments_Adjustment_Inc_Input>;
  _set?: InputMaybe<Payments_Adjustment_Set_Input>;
  where: Payments_Adjustment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Adjustment_By_PkArgs = {
  _inc?: InputMaybe<Payments_Adjustment_Inc_Input>;
  _set?: InputMaybe<Payments_Adjustment_Set_Input>;
  pk_columns: Payments_Adjustment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Adjustment_ManyArgs = {
  updates: Array<Payments_Adjustment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_MetadataArgs = {
  _append?: InputMaybe<Payments_Metadata_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Metadata_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Metadata_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Metadata_Delete_Key_Input>;
  _prepend?: InputMaybe<Payments_Metadata_Prepend_Input>;
  _set?: InputMaybe<Payments_Metadata_Set_Input>;
  where: Payments_Metadata_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Metadata_By_PkArgs = {
  _append?: InputMaybe<Payments_Metadata_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Metadata_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Metadata_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Metadata_Delete_Key_Input>;
  _prepend?: InputMaybe<Payments_Metadata_Prepend_Input>;
  _set?: InputMaybe<Payments_Metadata_Set_Input>;
  pk_columns: Payments_Metadata_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Metadata_ManyArgs = {
  updates: Array<Payments_Metadata_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_PaymentArgs = {
  _inc?: InputMaybe<Payments_Payment_Inc_Input>;
  _set?: InputMaybe<Payments_Payment_Set_Input>;
  where: Payments_Payment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Payment_By_PkArgs = {
  _inc?: InputMaybe<Payments_Payment_Inc_Input>;
  _set?: InputMaybe<Payments_Payment_Set_Input>;
  pk_columns: Payments_Payment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Payment_ManyArgs = {
  updates: Array<Payments_Payment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_TransfersArgs = {
  _inc?: InputMaybe<Payments_Transfers_Inc_Input>;
  _set?: InputMaybe<Payments_Transfers_Set_Input>;
  where: Payments_Transfers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Transfers_By_PkArgs = {
  _inc?: InputMaybe<Payments_Transfers_Inc_Input>;
  _set?: InputMaybe<Payments_Transfers_Set_Input>;
  pk_columns: Payments_Transfers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Transfers_ManyArgs = {
  updates: Array<Payments_Transfers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Registry_PaymentArgs = {
  _append?: InputMaybe<Registry_Payment_Append_Input>;
  _delete_at_path?: InputMaybe<Registry_Payment_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Registry_Payment_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Registry_Payment_Delete_Key_Input>;
  _inc?: InputMaybe<Registry_Payment_Inc_Input>;
  _prepend?: InputMaybe<Registry_Payment_Prepend_Input>;
  _set?: InputMaybe<Registry_Payment_Set_Input>;
  where: Registry_Payment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Registry_Payment_By_PkArgs = {
  _append?: InputMaybe<Registry_Payment_Append_Input>;
  _delete_at_path?: InputMaybe<Registry_Payment_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Registry_Payment_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Registry_Payment_Delete_Key_Input>;
  _inc?: InputMaybe<Registry_Payment_Inc_Input>;
  _prepend?: InputMaybe<Registry_Payment_Prepend_Input>;
  _set?: InputMaybe<Registry_Payment_Set_Input>;
  pk_columns: Registry_Payment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Registry_Payment_ManyArgs = {
  updates: Array<Registry_Payment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Session_BasketsArgs = {
  _append?: InputMaybe<Session_Baskets_Append_Input>;
  _delete_at_path?: InputMaybe<Session_Baskets_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Session_Baskets_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Session_Baskets_Delete_Key_Input>;
  _prepend?: InputMaybe<Session_Baskets_Prepend_Input>;
  _set?: InputMaybe<Session_Baskets_Set_Input>;
  where: Session_Baskets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Session_Baskets_By_PkArgs = {
  _append?: InputMaybe<Session_Baskets_Append_Input>;
  _delete_at_path?: InputMaybe<Session_Baskets_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Session_Baskets_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Session_Baskets_Delete_Key_Input>;
  _prepend?: InputMaybe<Session_Baskets_Prepend_Input>;
  _set?: InputMaybe<Session_Baskets_Set_Input>;
  pk_columns: Session_Baskets_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Session_Baskets_ManyArgs = {
  updates: Array<Session_Baskets_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_InitiationArgs = {
  _append?: InputMaybe<Transfers_Transfer_Initiation_Append_Input>;
  _delete_at_path?: InputMaybe<Transfers_Transfer_Initiation_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Transfers_Transfer_Initiation_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Transfers_Transfer_Initiation_Delete_Key_Input>;
  _inc?: InputMaybe<Transfers_Transfer_Initiation_Inc_Input>;
  _prepend?: InputMaybe<Transfers_Transfer_Initiation_Prepend_Input>;
  _set?: InputMaybe<Transfers_Transfer_Initiation_Set_Input>;
  where: Transfers_Transfer_Initiation_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_AdjustmentsArgs =
  {
    _append?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Append_Input>;
    _delete_at_path?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_At_Path_Input>;
    _delete_elem?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_Elem_Input>;
    _delete_key?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_Key_Input>;
    _inc?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Inc_Input>;
    _prepend?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Prepend_Input>;
    _set?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Set_Input>;
    where: Transfers_Transfer_Initiation_Adjustments_Bool_Exp;
  };

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_Adjustments_By_PkArgs =
  {
    _append?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Append_Input>;
    _delete_at_path?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_At_Path_Input>;
    _delete_elem?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_Elem_Input>;
    _delete_key?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_Key_Input>;
    _inc?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Inc_Input>;
    _prepend?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Prepend_Input>;
    _set?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Set_Input>;
    pk_columns: Transfers_Transfer_Initiation_Adjustments_Pk_Columns_Input;
  };

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_Adjustments_ManyArgs =
  {
    updates: Array<Transfers_Transfer_Initiation_Adjustments_Updates>;
  };

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_By_PkArgs = {
  _append?: InputMaybe<Transfers_Transfer_Initiation_Append_Input>;
  _delete_at_path?: InputMaybe<Transfers_Transfer_Initiation_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Transfers_Transfer_Initiation_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Transfers_Transfer_Initiation_Delete_Key_Input>;
  _inc?: InputMaybe<Transfers_Transfer_Initiation_Inc_Input>;
  _prepend?: InputMaybe<Transfers_Transfer_Initiation_Prepend_Input>;
  _set?: InputMaybe<Transfers_Transfer_Initiation_Set_Input>;
  pk_columns: Transfers_Transfer_Initiation_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_ManyArgs = {
  updates: Array<Transfers_Transfer_Initiation_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_PaymentsArgs = {
  _inc?: InputMaybe<Transfers_Transfer_Initiation_Payments_Inc_Input>;
  _set?: InputMaybe<Transfers_Transfer_Initiation_Payments_Set_Input>;
  where: Transfers_Transfer_Initiation_Payments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_Payments_By_PkArgs =
  {
    _inc?: InputMaybe<Transfers_Transfer_Initiation_Payments_Inc_Input>;
    _set?: InputMaybe<Transfers_Transfer_Initiation_Payments_Set_Input>;
    pk_columns: Transfers_Transfer_Initiation_Payments_Pk_Columns_Input;
  };

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Initiation_Payments_ManyArgs =
  {
    updates: Array<Transfers_Transfer_Initiation_Payments_Updates>;
  };

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_ReversalArgs = {
  _append?: InputMaybe<Transfers_Transfer_Reversal_Append_Input>;
  _delete_at_path?: InputMaybe<Transfers_Transfer_Reversal_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Transfers_Transfer_Reversal_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Transfers_Transfer_Reversal_Delete_Key_Input>;
  _inc?: InputMaybe<Transfers_Transfer_Reversal_Inc_Input>;
  _prepend?: InputMaybe<Transfers_Transfer_Reversal_Prepend_Input>;
  _set?: InputMaybe<Transfers_Transfer_Reversal_Set_Input>;
  where: Transfers_Transfer_Reversal_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Reversal_By_PkArgs = {
  _append?: InputMaybe<Transfers_Transfer_Reversal_Append_Input>;
  _delete_at_path?: InputMaybe<Transfers_Transfer_Reversal_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Transfers_Transfer_Reversal_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Transfers_Transfer_Reversal_Delete_Key_Input>;
  _inc?: InputMaybe<Transfers_Transfer_Reversal_Inc_Input>;
  _prepend?: InputMaybe<Transfers_Transfer_Reversal_Prepend_Input>;
  _set?: InputMaybe<Transfers_Transfer_Reversal_Set_Input>;
  pk_columns: Transfers_Transfer_Reversal_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Transfers_Transfer_Reversal_ManyArgs = {
  updates: Array<Transfers_Transfer_Reversal_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** columns and relationships of "partner" */
export type Partner = {
  __typename?: 'partner';
  categories: Array<Scalars['partnercategory']['output']>;
  commercial_registration_number?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamp']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  /** An array relationship */
  partner_bank_accounts: Array<Partner_Bank_Account>;
  /** An aggregate relationship */
  partner_bank_accounts_aggregate: Partner_Bank_Account_Aggregate;
  /** An array relationship */
  partner_branches: Array<Partner_Branch>;
  /** An aggregate relationship */
  partner_branches_aggregate: Partner_Branch_Aggregate;
  /** An array relationship */
  partner_tops: Array<Partner_Top>;
  /** An aggregate relationship */
  partner_tops_aggregate: Partner_Top_Aggregate;
  /** An array relationship */
  partner_user_profiles: Array<Partner_User_Profile>;
  /** An aggregate relationship */
  partner_user_profiles_aggregate: Partner_User_Profile_Aggregate;
  payments: Array<Merchant_Payment>;
  payments_aggregate: Merchant_Payment_Aggregate;
  status: Scalars['partnerstatus']['output'];
  tax_registration_number: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** columns and relationships of "partner" */
export type PartnerPartner_Bank_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Bank_Account_Order_By>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_Bank_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Bank_Account_Order_By>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Branch_Order_By>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Branch_Order_By>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_TopsArgs = {
  distinct_on?: InputMaybe<Array<Partner_Top_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Top_Order_By>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_Tops_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Top_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Top_Order_By>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_User_ProfilesArgs = {
  distinct_on?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_User_Profile_Order_By>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPartner_User_Profiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_User_Profile_Order_By>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPaymentsArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Payment_Order_By>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

/** columns and relationships of "partner" */
export type PartnerPayments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Payment_Order_By>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

/** aggregated selection of "partner" */
export type Partner_Aggregate = {
  __typename?: 'partner_aggregate';
  aggregate?: Maybe<Partner_Aggregate_Fields>;
  nodes: Array<Partner>;
};

/** aggregate fields of "partner" */
export type Partner_Aggregate_Fields = {
  __typename?: 'partner_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Partner_Max_Fields>;
  min?: Maybe<Partner_Min_Fields>;
};

/** aggregate fields of "partner" */
export type Partner_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Partner_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** columns and relationships of "partner_bank_account" */
export type Partner_Bank_Account = {
  __typename?: 'partner_bank_account';
  account_number: Scalars['String']['output'];
  bank_name: Scalars['bankname']['output'];
  beneficiary_name: Scalars['String']['output'];
  branch_name: Scalars['String']['output'];
  created_at: Scalars['timestamp']['output'];
  iban: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  partner: Partner;
  partner_id: Scalars['uuid']['output'];
  swift_code: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** aggregated selection of "partner_bank_account" */
export type Partner_Bank_Account_Aggregate = {
  __typename?: 'partner_bank_account_aggregate';
  aggregate?: Maybe<Partner_Bank_Account_Aggregate_Fields>;
  nodes: Array<Partner_Bank_Account>;
};

export type Partner_Bank_Account_Aggregate_Bool_Exp = {
  count?: InputMaybe<Partner_Bank_Account_Aggregate_Bool_Exp_Count>;
};

export type Partner_Bank_Account_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "partner_bank_account" */
export type Partner_Bank_Account_Aggregate_Fields = {
  __typename?: 'partner_bank_account_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Partner_Bank_Account_Max_Fields>;
  min?: Maybe<Partner_Bank_Account_Min_Fields>;
};

/** aggregate fields of "partner_bank_account" */
export type Partner_Bank_Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "partner_bank_account" */
export type Partner_Bank_Account_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Partner_Bank_Account_Max_Order_By>;
  min?: InputMaybe<Partner_Bank_Account_Min_Order_By>;
};

/** input type for inserting array relation for remote table "partner_bank_account" */
export type Partner_Bank_Account_Arr_Rel_Insert_Input = {
  data: Array<Partner_Bank_Account_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_Bank_Account_On_Conflict>;
};

/** Boolean expression to filter rows from the table "partner_bank_account". All fields are combined with a logical 'AND'. */
export type Partner_Bank_Account_Bool_Exp = {
  _and?: InputMaybe<Array<Partner_Bank_Account_Bool_Exp>>;
  _not?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
  _or?: InputMaybe<Array<Partner_Bank_Account_Bool_Exp>>;
  account_number?: InputMaybe<String_Comparison_Exp>;
  bank_name?: InputMaybe<Bankname_Comparison_Exp>;
  beneficiary_name?: InputMaybe<String_Comparison_Exp>;
  branch_name?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  iban?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  partner?: InputMaybe<Partner_Bool_Exp>;
  partner_id?: InputMaybe<Uuid_Comparison_Exp>;
  swift_code?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "partner_bank_account" */
export enum Partner_Bank_Account_Constraint {
  /** unique or primary key constraint on columns "id" */
  PartnerBankAccountPkey = 'partner_bank_account_pkey',
}

/** input type for inserting data into table "partner_bank_account" */
export type Partner_Bank_Account_Insert_Input = {
  account_number?: InputMaybe<Scalars['String']['input']>;
  bank_name?: InputMaybe<Scalars['bankname']['input']>;
  beneficiary_name?: InputMaybe<Scalars['String']['input']>;
  branch_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  iban?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner?: InputMaybe<Partner_Obj_Rel_Insert_Input>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  swift_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Partner_Bank_Account_Max_Fields = {
  __typename?: 'partner_bank_account_max_fields';
  account_number?: Maybe<Scalars['String']['output']>;
  bank_name?: Maybe<Scalars['bankname']['output']>;
  beneficiary_name?: Maybe<Scalars['String']['output']>;
  branch_name?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  iban?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  swift_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "partner_bank_account" */
export type Partner_Bank_Account_Max_Order_By = {
  account_number?: InputMaybe<Order_By>;
  bank_name?: InputMaybe<Order_By>;
  beneficiary_name?: InputMaybe<Order_By>;
  branch_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  iban?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  swift_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Partner_Bank_Account_Min_Fields = {
  __typename?: 'partner_bank_account_min_fields';
  account_number?: Maybe<Scalars['String']['output']>;
  bank_name?: Maybe<Scalars['bankname']['output']>;
  beneficiary_name?: Maybe<Scalars['String']['output']>;
  branch_name?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  iban?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  swift_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "partner_bank_account" */
export type Partner_Bank_Account_Min_Order_By = {
  account_number?: InputMaybe<Order_By>;
  bank_name?: InputMaybe<Order_By>;
  beneficiary_name?: InputMaybe<Order_By>;
  branch_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  iban?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  swift_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "partner_bank_account" */
export type Partner_Bank_Account_Mutation_Response = {
  __typename?: 'partner_bank_account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Partner_Bank_Account>;
};

/** on_conflict condition type for table "partner_bank_account" */
export type Partner_Bank_Account_On_Conflict = {
  constraint: Partner_Bank_Account_Constraint;
  update_columns?: Array<Partner_Bank_Account_Update_Column>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

/** Ordering options when selecting data from "partner_bank_account". */
export type Partner_Bank_Account_Order_By = {
  account_number?: InputMaybe<Order_By>;
  bank_name?: InputMaybe<Order_By>;
  beneficiary_name?: InputMaybe<Order_By>;
  branch_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  iban?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner?: InputMaybe<Partner_Order_By>;
  partner_id?: InputMaybe<Order_By>;
  swift_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: partner_bank_account */
export type Partner_Bank_Account_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "partner_bank_account" */
export enum Partner_Bank_Account_Select_Column {
  /** column name */
  AccountNumber = 'account_number',
  /** column name */
  BankName = 'bank_name',
  /** column name */
  BeneficiaryName = 'beneficiary_name',
  /** column name */
  BranchName = 'branch_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Iban = 'iban',
  /** column name */
  Id = 'id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  SwiftCode = 'swift_code',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "partner_bank_account" */
export type Partner_Bank_Account_Set_Input = {
  account_number?: InputMaybe<Scalars['String']['input']>;
  bank_name?: InputMaybe<Scalars['bankname']['input']>;
  beneficiary_name?: InputMaybe<Scalars['String']['input']>;
  branch_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  iban?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  swift_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "partner_bank_account" */
export type Partner_Bank_Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Partner_Bank_Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Partner_Bank_Account_Stream_Cursor_Value_Input = {
  account_number?: InputMaybe<Scalars['String']['input']>;
  bank_name?: InputMaybe<Scalars['bankname']['input']>;
  beneficiary_name?: InputMaybe<Scalars['String']['input']>;
  branch_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  iban?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  swift_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** update columns of table "partner_bank_account" */
export enum Partner_Bank_Account_Update_Column {
  /** column name */
  AccountNumber = 'account_number',
  /** column name */
  BankName = 'bank_name',
  /** column name */
  BeneficiaryName = 'beneficiary_name',
  /** column name */
  BranchName = 'branch_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Iban = 'iban',
  /** column name */
  Id = 'id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  SwiftCode = 'swift_code',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Partner_Bank_Account_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Partner_Bank_Account_Set_Input>;
  /** filter the rows which have to be updated */
  where: Partner_Bank_Account_Bool_Exp;
};

/** Boolean expression to filter rows from the table "partner". All fields are combined with a logical 'AND'. */
export type Partner_Bool_Exp = {
  _and?: InputMaybe<Array<Partner_Bool_Exp>>;
  _not?: InputMaybe<Partner_Bool_Exp>;
  _or?: InputMaybe<Array<Partner_Bool_Exp>>;
  categories?: InputMaybe<Partnercategory_Array_Comparison_Exp>;
  commercial_registration_number?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  partner_bank_accounts?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
  partner_bank_accounts_aggregate?: InputMaybe<Partner_Bank_Account_Aggregate_Bool_Exp>;
  partner_branches?: InputMaybe<Partner_Branch_Bool_Exp>;
  partner_branches_aggregate?: InputMaybe<Partner_Branch_Aggregate_Bool_Exp>;
  partner_tops?: InputMaybe<Partner_Top_Bool_Exp>;
  partner_tops_aggregate?: InputMaybe<Partner_Top_Aggregate_Bool_Exp>;
  partner_user_profiles?: InputMaybe<Partner_User_Profile_Bool_Exp>;
  partner_user_profiles_aggregate?: InputMaybe<Partner_User_Profile_Aggregate_Bool_Exp>;
  status?: InputMaybe<Partnerstatus_Comparison_Exp>;
  tax_registration_number?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** columns and relationships of "partner_branch" */
export type Partner_Branch = {
  __typename?: 'partner_branch';
  area?: Maybe<Scalars['String']['output']>;
  area_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  area_record?: Maybe<Areas>;
  city_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  city_record?: Maybe<Cities>;
  created_at: Scalars['timestamp']['output'];
  google_maps_link?: Maybe<Scalars['String']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  governorate_record?: Maybe<Governorates>;
  id: Scalars['uuid']['output'];
  location_latitude: Scalars['String']['output'];
  location_longitude: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** An object relationship */
  partner: Partner;
  partner_id: Scalars['uuid']['output'];
  street: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** aggregated selection of "partner_branch" */
export type Partner_Branch_Aggregate = {
  __typename?: 'partner_branch_aggregate';
  aggregate?: Maybe<Partner_Branch_Aggregate_Fields>;
  nodes: Array<Partner_Branch>;
};

export type Partner_Branch_Aggregate_Bool_Exp = {
  count?: InputMaybe<Partner_Branch_Aggregate_Bool_Exp_Count>;
};

export type Partner_Branch_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Partner_Branch_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "partner_branch" */
export type Partner_Branch_Aggregate_Fields = {
  __typename?: 'partner_branch_aggregate_fields';
  avg?: Maybe<Partner_Branch_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Partner_Branch_Max_Fields>;
  min?: Maybe<Partner_Branch_Min_Fields>;
  stddev?: Maybe<Partner_Branch_Stddev_Fields>;
  stddev_pop?: Maybe<Partner_Branch_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Partner_Branch_Stddev_Samp_Fields>;
  sum?: Maybe<Partner_Branch_Sum_Fields>;
  var_pop?: Maybe<Partner_Branch_Var_Pop_Fields>;
  var_samp?: Maybe<Partner_Branch_Var_Samp_Fields>;
  variance?: Maybe<Partner_Branch_Variance_Fields>;
};

/** aggregate fields of "partner_branch" */
export type Partner_Branch_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "partner_branch" */
export type Partner_Branch_Aggregate_Order_By = {
  avg?: InputMaybe<Partner_Branch_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Partner_Branch_Max_Order_By>;
  min?: InputMaybe<Partner_Branch_Min_Order_By>;
  stddev?: InputMaybe<Partner_Branch_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Partner_Branch_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Partner_Branch_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Partner_Branch_Sum_Order_By>;
  var_pop?: InputMaybe<Partner_Branch_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Partner_Branch_Var_Samp_Order_By>;
  variance?: InputMaybe<Partner_Branch_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "partner_branch" */
export type Partner_Branch_Arr_Rel_Insert_Input = {
  data: Array<Partner_Branch_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_Branch_On_Conflict>;
};

/** aggregate avg on columns */
export type Partner_Branch_Avg_Fields = {
  __typename?: 'partner_branch_avg_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "partner_branch" */
export type Partner_Branch_Avg_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "partner_branch". All fields are combined with a logical 'AND'. */
export type Partner_Branch_Bool_Exp = {
  _and?: InputMaybe<Array<Partner_Branch_Bool_Exp>>;
  _not?: InputMaybe<Partner_Branch_Bool_Exp>;
  _or?: InputMaybe<Array<Partner_Branch_Bool_Exp>>;
  area?: InputMaybe<String_Comparison_Exp>;
  area_id?: InputMaybe<Int_Comparison_Exp>;
  area_record?: InputMaybe<Areas_Bool_Exp>;
  city_id?: InputMaybe<Int_Comparison_Exp>;
  city_record?: InputMaybe<Cities_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  google_maps_link?: InputMaybe<String_Comparison_Exp>;
  governorate_id?: InputMaybe<Int_Comparison_Exp>;
  governorate_record?: InputMaybe<Governorates_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  location_latitude?: InputMaybe<String_Comparison_Exp>;
  location_longitude?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  partner?: InputMaybe<Partner_Bool_Exp>;
  partner_id?: InputMaybe<Uuid_Comparison_Exp>;
  street?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "partner_branch" */
export enum Partner_Branch_Constraint {
  /** unique or primary key constraint on columns "id" */
  PartnerBranchPkey = 'partner_branch_pkey',
}

/** input type for incrementing numeric columns in table "partner_branch" */
export type Partner_Branch_Inc_Input = {
  area_id?: InputMaybe<Scalars['Int']['input']>;
  city_id?: InputMaybe<Scalars['Int']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "partner_branch" */
export type Partner_Branch_Insert_Input = {
  area?: InputMaybe<Scalars['String']['input']>;
  area_id?: InputMaybe<Scalars['Int']['input']>;
  area_record?: InputMaybe<Areas_Obj_Rel_Insert_Input>;
  city_id?: InputMaybe<Scalars['Int']['input']>;
  city_record?: InputMaybe<Cities_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  google_maps_link?: InputMaybe<Scalars['String']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  governorate_record?: InputMaybe<Governorates_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  location_latitude?: InputMaybe<Scalars['String']['input']>;
  location_longitude?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  partner?: InputMaybe<Partner_Obj_Rel_Insert_Input>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Partner_Branch_Max_Fields = {
  __typename?: 'partner_branch_max_fields';
  area?: Maybe<Scalars['String']['output']>;
  area_id?: Maybe<Scalars['Int']['output']>;
  city_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  google_maps_link?: Maybe<Scalars['String']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  location_latitude?: Maybe<Scalars['String']['output']>;
  location_longitude?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "partner_branch" */
export type Partner_Branch_Max_Order_By = {
  area?: InputMaybe<Order_By>;
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  google_maps_link?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  location_latitude?: InputMaybe<Order_By>;
  location_longitude?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  street?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Partner_Branch_Min_Fields = {
  __typename?: 'partner_branch_min_fields';
  area?: Maybe<Scalars['String']['output']>;
  area_id?: Maybe<Scalars['Int']['output']>;
  city_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  google_maps_link?: Maybe<Scalars['String']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  location_latitude?: Maybe<Scalars['String']['output']>;
  location_longitude?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "partner_branch" */
export type Partner_Branch_Min_Order_By = {
  area?: InputMaybe<Order_By>;
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  google_maps_link?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  location_latitude?: InputMaybe<Order_By>;
  location_longitude?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  street?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "partner_branch" */
export type Partner_Branch_Mutation_Response = {
  __typename?: 'partner_branch_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Partner_Branch>;
};

/** input type for inserting object relation for remote table "partner_branch" */
export type Partner_Branch_Obj_Rel_Insert_Input = {
  data: Partner_Branch_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_Branch_On_Conflict>;
};

/** on_conflict condition type for table "partner_branch" */
export type Partner_Branch_On_Conflict = {
  constraint: Partner_Branch_Constraint;
  update_columns?: Array<Partner_Branch_Update_Column>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

/** Ordering options when selecting data from "partner_branch". */
export type Partner_Branch_Order_By = {
  area?: InputMaybe<Order_By>;
  area_id?: InputMaybe<Order_By>;
  area_record?: InputMaybe<Areas_Order_By>;
  city_id?: InputMaybe<Order_By>;
  city_record?: InputMaybe<Cities_Order_By>;
  created_at?: InputMaybe<Order_By>;
  google_maps_link?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
  governorate_record?: InputMaybe<Governorates_Order_By>;
  id?: InputMaybe<Order_By>;
  location_latitude?: InputMaybe<Order_By>;
  location_longitude?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  partner?: InputMaybe<Partner_Order_By>;
  partner_id?: InputMaybe<Order_By>;
  street?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: partner_branch */
export type Partner_Branch_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "partner_branch" */
export enum Partner_Branch_Select_Column {
  /** column name */
  Area = 'area',
  /** column name */
  AreaId = 'area_id',
  /** column name */
  CityId = 'city_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GoogleMapsLink = 'google_maps_link',
  /** column name */
  GovernorateId = 'governorate_id',
  /** column name */
  Id = 'id',
  /** column name */
  LocationLatitude = 'location_latitude',
  /** column name */
  LocationLongitude = 'location_longitude',
  /** column name */
  Name = 'name',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  Street = 'street',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "partner_branch" */
export type Partner_Branch_Set_Input = {
  area?: InputMaybe<Scalars['String']['input']>;
  area_id?: InputMaybe<Scalars['Int']['input']>;
  city_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  google_maps_link?: InputMaybe<Scalars['String']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  location_latitude?: InputMaybe<Scalars['String']['input']>;
  location_longitude?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Partner_Branch_Stddev_Fields = {
  __typename?: 'partner_branch_stddev_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "partner_branch" */
export type Partner_Branch_Stddev_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Partner_Branch_Stddev_Pop_Fields = {
  __typename?: 'partner_branch_stddev_pop_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "partner_branch" */
export type Partner_Branch_Stddev_Pop_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Partner_Branch_Stddev_Samp_Fields = {
  __typename?: 'partner_branch_stddev_samp_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "partner_branch" */
export type Partner_Branch_Stddev_Samp_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "partner_branch" */
export type Partner_Branch_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Partner_Branch_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Partner_Branch_Stream_Cursor_Value_Input = {
  area?: InputMaybe<Scalars['String']['input']>;
  area_id?: InputMaybe<Scalars['Int']['input']>;
  city_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  google_maps_link?: InputMaybe<Scalars['String']['input']>;
  governorate_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  location_latitude?: InputMaybe<Scalars['String']['input']>;
  location_longitude?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Partner_Branch_Sum_Fields = {
  __typename?: 'partner_branch_sum_fields';
  area_id?: Maybe<Scalars['Int']['output']>;
  city_id?: Maybe<Scalars['Int']['output']>;
  governorate_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "partner_branch" */
export type Partner_Branch_Sum_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** update columns of table "partner_branch" */
export enum Partner_Branch_Update_Column {
  /** column name */
  Area = 'area',
  /** column name */
  AreaId = 'area_id',
  /** column name */
  CityId = 'city_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GoogleMapsLink = 'google_maps_link',
  /** column name */
  GovernorateId = 'governorate_id',
  /** column name */
  Id = 'id',
  /** column name */
  LocationLatitude = 'location_latitude',
  /** column name */
  LocationLongitude = 'location_longitude',
  /** column name */
  Name = 'name',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  Street = 'street',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Partner_Branch_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Partner_Branch_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Partner_Branch_Set_Input>;
  /** filter the rows which have to be updated */
  where: Partner_Branch_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Partner_Branch_Var_Pop_Fields = {
  __typename?: 'partner_branch_var_pop_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "partner_branch" */
export type Partner_Branch_Var_Pop_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Partner_Branch_Var_Samp_Fields = {
  __typename?: 'partner_branch_var_samp_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "partner_branch" */
export type Partner_Branch_Var_Samp_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Partner_Branch_Variance_Fields = {
  __typename?: 'partner_branch_variance_fields';
  area_id?: Maybe<Scalars['Float']['output']>;
  city_id?: Maybe<Scalars['Float']['output']>;
  governorate_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "partner_branch" */
export type Partner_Branch_Variance_Order_By = {
  area_id?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  governorate_id?: InputMaybe<Order_By>;
};

/** unique or primary key constraints on table "partner" */
export enum Partner_Constraint {
  /** unique or primary key constraint on columns "name" */
  PartnerNameKey = 'partner_name_key',
  /** unique or primary key constraint on columns "id" */
  PartnerPkey = 'partner_pkey',
  /** unique or primary key constraint on columns "tax_registration_number" */
  PartnerTaxRegistrationNumberKey = 'partner_tax_registration_number_key',
}

/** input type for inserting data into table "partner" */
export type Partner_Insert_Input = {
  categories?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  commercial_registration_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  partner_bank_accounts?: InputMaybe<Partner_Bank_Account_Arr_Rel_Insert_Input>;
  partner_branches?: InputMaybe<Partner_Branch_Arr_Rel_Insert_Input>;
  partner_tops?: InputMaybe<Partner_Top_Arr_Rel_Insert_Input>;
  partner_user_profiles?: InputMaybe<Partner_User_Profile_Arr_Rel_Insert_Input>;
  status?: InputMaybe<Scalars['partnerstatus']['input']>;
  tax_registration_number?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Partner_Max_Fields = {
  __typename?: 'partner_max_fields';
  categories?: Maybe<Array<Scalars['partnercategory']['output']>>;
  commercial_registration_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['partnerstatus']['output']>;
  tax_registration_number?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregate min on columns */
export type Partner_Min_Fields = {
  __typename?: 'partner_min_fields';
  categories?: Maybe<Array<Scalars['partnercategory']['output']>>;
  commercial_registration_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['partnerstatus']['output']>;
  tax_registration_number?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** response of any mutation on the table "partner" */
export type Partner_Mutation_Response = {
  __typename?: 'partner_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Partner>;
};

/** input type for inserting object relation for remote table "partner" */
export type Partner_Obj_Rel_Insert_Input = {
  data: Partner_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_On_Conflict>;
};

/** on_conflict condition type for table "partner" */
export type Partner_On_Conflict = {
  constraint: Partner_Constraint;
  update_columns?: Array<Partner_Update_Column>;
  where?: InputMaybe<Partner_Bool_Exp>;
};

/** Ordering options when selecting data from "partner". */
export type Partner_Order_By = {
  categories?: InputMaybe<Order_By>;
  commercial_registration_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  partner_bank_accounts_aggregate?: InputMaybe<Partner_Bank_Account_Aggregate_Order_By>;
  partner_branches_aggregate?: InputMaybe<Partner_Branch_Aggregate_Order_By>;
  partner_tops_aggregate?: InputMaybe<Partner_Top_Aggregate_Order_By>;
  partner_user_profiles_aggregate?: InputMaybe<Partner_User_Profile_Aggregate_Order_By>;
  status?: InputMaybe<Order_By>;
  tax_registration_number?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: partner */
export type Partner_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "partner" */
export enum Partner_Select_Column {
  /** column name */
  Categories = 'categories',
  /** column name */
  CommercialRegistrationNumber = 'commercial_registration_number',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Status = 'status',
  /** column name */
  TaxRegistrationNumber = 'tax_registration_number',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "partner" */
export type Partner_Set_Input = {
  categories?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  commercial_registration_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['partnerstatus']['input']>;
  tax_registration_number?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "partner" */
export type Partner_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Partner_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Partner_Stream_Cursor_Value_Input = {
  categories?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  commercial_registration_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['partnerstatus']['input']>;
  tax_registration_number?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** columns and relationships of "partner_top" */
export type Partner_Top = {
  __typename?: 'partner_top';
  created_at: Scalars['timestamp']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  partner: Partner;
  partner_id: Scalars['uuid']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** aggregated selection of "partner_top" */
export type Partner_Top_Aggregate = {
  __typename?: 'partner_top_aggregate';
  aggregate?: Maybe<Partner_Top_Aggregate_Fields>;
  nodes: Array<Partner_Top>;
};

export type Partner_Top_Aggregate_Bool_Exp = {
  count?: InputMaybe<Partner_Top_Aggregate_Bool_Exp_Count>;
};

export type Partner_Top_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Partner_Top_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Partner_Top_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "partner_top" */
export type Partner_Top_Aggregate_Fields = {
  __typename?: 'partner_top_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Partner_Top_Max_Fields>;
  min?: Maybe<Partner_Top_Min_Fields>;
};

/** aggregate fields of "partner_top" */
export type Partner_Top_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Partner_Top_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "partner_top" */
export type Partner_Top_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Partner_Top_Max_Order_By>;
  min?: InputMaybe<Partner_Top_Min_Order_By>;
};

/** input type for inserting array relation for remote table "partner_top" */
export type Partner_Top_Arr_Rel_Insert_Input = {
  data: Array<Partner_Top_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_Top_On_Conflict>;
};

/** Boolean expression to filter rows from the table "partner_top". All fields are combined with a logical 'AND'. */
export type Partner_Top_Bool_Exp = {
  _and?: InputMaybe<Array<Partner_Top_Bool_Exp>>;
  _not?: InputMaybe<Partner_Top_Bool_Exp>;
  _or?: InputMaybe<Array<Partner_Top_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  partner?: InputMaybe<Partner_Bool_Exp>;
  partner_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "partner_top" */
export enum Partner_Top_Constraint {
  /** unique or primary key constraint on columns "id" */
  PartnerTopPkey = 'partner_top_pkey',
}

/** input type for inserting data into table "partner_top" */
export type Partner_Top_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner?: InputMaybe<Partner_Obj_Rel_Insert_Input>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Partner_Top_Max_Fields = {
  __typename?: 'partner_top_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "partner_top" */
export type Partner_Top_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Partner_Top_Min_Fields = {
  __typename?: 'partner_top_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "partner_top" */
export type Partner_Top_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "partner_top" */
export type Partner_Top_Mutation_Response = {
  __typename?: 'partner_top_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Partner_Top>;
};

/** on_conflict condition type for table "partner_top" */
export type Partner_Top_On_Conflict = {
  constraint: Partner_Top_Constraint;
  update_columns?: Array<Partner_Top_Update_Column>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

/** Ordering options when selecting data from "partner_top". */
export type Partner_Top_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner?: InputMaybe<Partner_Order_By>;
  partner_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: partner_top */
export type Partner_Top_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "partner_top" */
export enum Partner_Top_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "partner_top" */
export type Partner_Top_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "partner_top" */
export type Partner_Top_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Partner_Top_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Partner_Top_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** update columns of table "partner_top" */
export enum Partner_Top_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Partner_Top_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Partner_Top_Set_Input>;
  /** filter the rows which have to be updated */
  where: Partner_Top_Bool_Exp;
};

/** update columns of table "partner" */
export enum Partner_Update_Column {
  /** column name */
  Categories = 'categories',
  /** column name */
  CommercialRegistrationNumber = 'commercial_registration_number',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Status = 'status',
  /** column name */
  TaxRegistrationNumber = 'tax_registration_number',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Partner_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Partner_Set_Input>;
  /** filter the rows which have to be updated */
  where: Partner_Bool_Exp;
};

/** columns and relationships of "partner_user_profile" */
export type Partner_User_Profile = {
  __typename?: 'partner_user_profile';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  created_at: Scalars['timestamp']['output'];
  email?: Maybe<Scalars['String']['output']>;
  first_name: Scalars['String']['output'];
  iam_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  identity?: Maybe<Identities>;
  last_name: Scalars['String']['output'];
  national_id?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  partner: Partner;
  /** An object relationship */
  partner_branch?: Maybe<Partner_Branch>;
  partner_id: Scalars['uuid']['output'];
  phone_number: Scalars['String']['output'];
  profile_type: Scalars['profiletype']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** aggregated selection of "partner_user_profile" */
export type Partner_User_Profile_Aggregate = {
  __typename?: 'partner_user_profile_aggregate';
  aggregate?: Maybe<Partner_User_Profile_Aggregate_Fields>;
  nodes: Array<Partner_User_Profile>;
};

export type Partner_User_Profile_Aggregate_Bool_Exp = {
  count?: InputMaybe<Partner_User_Profile_Aggregate_Bool_Exp_Count>;
};

export type Partner_User_Profile_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Partner_User_Profile_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "partner_user_profile" */
export type Partner_User_Profile_Aggregate_Fields = {
  __typename?: 'partner_user_profile_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Partner_User_Profile_Max_Fields>;
  min?: Maybe<Partner_User_Profile_Min_Fields>;
};

/** aggregate fields of "partner_user_profile" */
export type Partner_User_Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "partner_user_profile" */
export type Partner_User_Profile_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Partner_User_Profile_Max_Order_By>;
  min?: InputMaybe<Partner_User_Profile_Min_Order_By>;
};

/** input type for inserting array relation for remote table "partner_user_profile" */
export type Partner_User_Profile_Arr_Rel_Insert_Input = {
  data: Array<Partner_User_Profile_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_User_Profile_On_Conflict>;
};

/** Boolean expression to filter rows from the table "partner_user_profile". All fields are combined with a logical 'AND'. */
export type Partner_User_Profile_Bool_Exp = {
  _and?: InputMaybe<Array<Partner_User_Profile_Bool_Exp>>;
  _not?: InputMaybe<Partner_User_Profile_Bool_Exp>;
  _or?: InputMaybe<Array<Partner_User_Profile_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  iam_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  national_id?: InputMaybe<String_Comparison_Exp>;
  partner?: InputMaybe<Partner_Bool_Exp>;
  partner_branch?: InputMaybe<Partner_Branch_Bool_Exp>;
  partner_id?: InputMaybe<Uuid_Comparison_Exp>;
  phone_number?: InputMaybe<String_Comparison_Exp>;
  profile_type?: InputMaybe<Profiletype_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "partner_user_profile" */
export enum Partner_User_Profile_Constraint {
  /** unique or primary key constraint on columns "id" */
  PartnerUserProfilePkey = 'partner_user_profile_pkey',
}

/** input type for inserting data into table "partner_user_profile" */
export type Partner_User_Profile_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  iam_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  national_id?: InputMaybe<Scalars['String']['input']>;
  partner?: InputMaybe<Partner_Obj_Rel_Insert_Input>;
  partner_branch?: InputMaybe<Partner_Branch_Obj_Rel_Insert_Input>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  profile_type?: InputMaybe<Scalars['profiletype']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Partner_User_Profile_Max_Fields = {
  __typename?: 'partner_user_profile_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  iam_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  national_id?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
  profile_type?: Maybe<Scalars['profiletype']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by max() on columns of table "partner_user_profile" */
export type Partner_User_Profile_Max_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  iam_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  national_id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  profile_type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Partner_User_Profile_Min_Fields = {
  __typename?: 'partner_user_profile_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  iam_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  national_id?: Maybe<Scalars['String']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
  profile_type?: Maybe<Scalars['profiletype']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** order by min() on columns of table "partner_user_profile" */
export type Partner_User_Profile_Min_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  iam_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  national_id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  profile_type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "partner_user_profile" */
export type Partner_User_Profile_Mutation_Response = {
  __typename?: 'partner_user_profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Partner_User_Profile>;
};

/** input type for inserting object relation for remote table "partner_user_profile" */
export type Partner_User_Profile_Obj_Rel_Insert_Input = {
  data: Partner_User_Profile_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Partner_User_Profile_On_Conflict>;
};

/** on_conflict condition type for table "partner_user_profile" */
export type Partner_User_Profile_On_Conflict = {
  constraint: Partner_User_Profile_Constraint;
  update_columns?: Array<Partner_User_Profile_Update_Column>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "partner_user_profile". */
export type Partner_User_Profile_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  iam_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  national_id?: InputMaybe<Order_By>;
  partner?: InputMaybe<Partner_Order_By>;
  partner_branch?: InputMaybe<Partner_Branch_Order_By>;
  partner_id?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  profile_type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: partner_user_profile */
export type Partner_User_Profile_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "partner_user_profile" */
export enum Partner_User_Profile_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  IamId = 'iam_id',
  /** column name */
  Id = 'id',
  /** column name */
  LastName = 'last_name',
  /** column name */
  NationalId = 'national_id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  ProfileType = 'profile_type',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "partner_user_profile" */
export type Partner_User_Profile_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  iam_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  national_id?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  profile_type?: InputMaybe<Scalars['profiletype']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "partner_user_profile" */
export type Partner_User_Profile_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Partner_User_Profile_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Partner_User_Profile_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  iam_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  national_id?: InputMaybe<Scalars['String']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  profile_type?: InputMaybe<Scalars['profiletype']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** update columns of table "partner_user_profile" */
export enum Partner_User_Profile_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  IamId = 'iam_id',
  /** column name */
  Id = 'id',
  /** column name */
  LastName = 'last_name',
  /** column name */
  NationalId = 'national_id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  ProfileType = 'profile_type',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Partner_User_Profile_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Partner_User_Profile_Set_Input>;
  /** filter the rows which have to be updated */
  where: Partner_User_Profile_Bool_Exp;
};

/** Boolean expression to compare columns of type "partnercategory". All fields are combined with logical 'AND'. */
export type Partnercategory_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  /** does the array contain the given value */
  _contains?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _eq?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _gt?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _gte?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _in?: InputMaybe<Array<Array<Scalars['partnercategory']['input']>>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _lte?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _neq?: InputMaybe<Array<Scalars['partnercategory']['input']>>;
  _nin?: InputMaybe<Array<Array<Scalars['partnercategory']['input']>>>;
};

/** Boolean expression to compare columns of type "partnerstatus". All fields are combined with logical 'AND'. */
export type Partnerstatus_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['partnerstatus']['input']>;
  _gt?: InputMaybe<Scalars['partnerstatus']['input']>;
  _gte?: InputMaybe<Scalars['partnerstatus']['input']>;
  _in?: InputMaybe<Array<Scalars['partnerstatus']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['partnerstatus']['input']>;
  _lte?: InputMaybe<Scalars['partnerstatus']['input']>;
  _neq?: InputMaybe<Scalars['partnerstatus']['input']>;
  _nin?: InputMaybe<Array<Scalars['partnerstatus']['input']>>;
};

/** columns and relationships of "party_account" */
export type Party_Account = {
  __typename?: 'party_account';
  account_status: Scalars['String']['output'];
  account_type: Scalars['party_account_type']['output'];
  created_at: Scalars['timestamptz']['output'];
  global_reference_id: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "party_account" */
export type Party_Account_Aggregate = {
  __typename?: 'party_account_aggregate';
  aggregate?: Maybe<Party_Account_Aggregate_Fields>;
  nodes: Array<Party_Account>;
};

/** aggregate fields of "party_account" */
export type Party_Account_Aggregate_Fields = {
  __typename?: 'party_account_aggregate_fields';
  avg?: Maybe<Party_Account_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Party_Account_Max_Fields>;
  min?: Maybe<Party_Account_Min_Fields>;
  stddev?: Maybe<Party_Account_Stddev_Fields>;
  stddev_pop?: Maybe<Party_Account_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Party_Account_Stddev_Samp_Fields>;
  sum?: Maybe<Party_Account_Sum_Fields>;
  var_pop?: Maybe<Party_Account_Var_Pop_Fields>;
  var_samp?: Maybe<Party_Account_Var_Samp_Fields>;
  variance?: Maybe<Party_Account_Variance_Fields>;
};

/** aggregate fields of "party_account" */
export type Party_Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Party_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Party_Account_Avg_Fields = {
  __typename?: 'party_account_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "party_account". All fields are combined with a logical 'AND'. */
export type Party_Account_Bool_Exp = {
  _and?: InputMaybe<Array<Party_Account_Bool_Exp>>;
  _not?: InputMaybe<Party_Account_Bool_Exp>;
  _or?: InputMaybe<Array<Party_Account_Bool_Exp>>;
  account_status?: InputMaybe<String_Comparison_Exp>;
  account_type?: InputMaybe<Party_Account_Type_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  global_reference_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "party_account" */
export enum Party_Account_Constraint {
  /** unique or primary key constraint on columns "global_reference_id" */
  PartyAccountGlobalReferenceIdKey = 'party_account_global_reference_id_key',
  /** unique or primary key constraint on columns "id" */
  PartyAccountPkey = 'party_account_pkey',
}

/** input type for incrementing numeric columns in table "party_account" */
export type Party_Account_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "party_account" */
export type Party_Account_Insert_Input = {
  account_status?: InputMaybe<Scalars['String']['input']>;
  account_type?: InputMaybe<Scalars['party_account_type']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  global_reference_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Party_Account_Max_Fields = {
  __typename?: 'party_account_max_fields';
  account_status?: Maybe<Scalars['String']['output']>;
  account_type?: Maybe<Scalars['party_account_type']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  global_reference_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Party_Account_Min_Fields = {
  __typename?: 'party_account_min_fields';
  account_status?: Maybe<Scalars['String']['output']>;
  account_type?: Maybe<Scalars['party_account_type']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  global_reference_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "party_account" */
export type Party_Account_Mutation_Response = {
  __typename?: 'party_account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Party_Account>;
};

/** on_conflict condition type for table "party_account" */
export type Party_Account_On_Conflict = {
  constraint: Party_Account_Constraint;
  update_columns?: Array<Party_Account_Update_Column>;
  where?: InputMaybe<Party_Account_Bool_Exp>;
};

/** Ordering options when selecting data from "party_account". */
export type Party_Account_Order_By = {
  account_status?: InputMaybe<Order_By>;
  account_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  global_reference_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: party_account */
export type Party_Account_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "party_account" */
export enum Party_Account_Select_Column {
  /** column name */
  AccountStatus = 'account_status',
  /** column name */
  AccountType = 'account_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GlobalReferenceId = 'global_reference_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "party_account" */
export type Party_Account_Set_Input = {
  account_status?: InputMaybe<Scalars['String']['input']>;
  account_type?: InputMaybe<Scalars['party_account_type']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  global_reference_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Party_Account_Stddev_Fields = {
  __typename?: 'party_account_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Party_Account_Stddev_Pop_Fields = {
  __typename?: 'party_account_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Party_Account_Stddev_Samp_Fields = {
  __typename?: 'party_account_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "party_account" */
export type Party_Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Party_Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Party_Account_Stream_Cursor_Value_Input = {
  account_status?: InputMaybe<Scalars['String']['input']>;
  account_type?: InputMaybe<Scalars['party_account_type']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  global_reference_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Party_Account_Sum_Fields = {
  __typename?: 'party_account_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** Boolean expression to compare columns of type "party_account_type". All fields are combined with logical 'AND'. */
export type Party_Account_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['party_account_type']['input']>;
  _gt?: InputMaybe<Scalars['party_account_type']['input']>;
  _gte?: InputMaybe<Scalars['party_account_type']['input']>;
  _in?: InputMaybe<Array<Scalars['party_account_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['party_account_type']['input']>;
  _lte?: InputMaybe<Scalars['party_account_type']['input']>;
  _neq?: InputMaybe<Scalars['party_account_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['party_account_type']['input']>>;
};

/** update columns of table "party_account" */
export enum Party_Account_Update_Column {
  /** column name */
  AccountStatus = 'account_status',
  /** column name */
  AccountType = 'account_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  GlobalReferenceId = 'global_reference_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Party_Account_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Party_Account_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Party_Account_Set_Input>;
  /** filter the rows which have to be updated */
  where: Party_Account_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Party_Account_Var_Pop_Fields = {
  __typename?: 'party_account_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Party_Account_Var_Samp_Fields = {
  __typename?: 'party_account_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Party_Account_Variance_Fields = {
  __typename?: 'party_account_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "payeeidtype". All fields are combined with logical 'AND'. */
export type Payeeidtype_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['payeeidtype']['input']>;
  _gt?: InputMaybe<Scalars['payeeidtype']['input']>;
  _gte?: InputMaybe<Scalars['payeeidtype']['input']>;
  _in?: InputMaybe<Array<Scalars['payeeidtype']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payeeidtype']['input']>;
  _lte?: InputMaybe<Scalars['payeeidtype']['input']>;
  _neq?: InputMaybe<Scalars['payeeidtype']['input']>;
  _nin?: InputMaybe<Array<Scalars['payeeidtype']['input']>>;
};

/** Boolean expression to compare columns of type "payeetype". All fields are combined with logical 'AND'. */
export type Payeetype_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['payeetype']['input']>;
  _gt?: InputMaybe<Scalars['payeetype']['input']>;
  _gte?: InputMaybe<Scalars['payeetype']['input']>;
  _in?: InputMaybe<Array<Scalars['payeetype']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payeetype']['input']>;
  _lte?: InputMaybe<Scalars['payeetype']['input']>;
  _neq?: InputMaybe<Scalars['payeetype']['input']>;
  _nin?: InputMaybe<Array<Scalars['payeetype']['input']>>;
};

/** Boolean expression to compare columns of type "payment_status". All fields are combined with logical 'AND'. */
export type Payment_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['payment_status']['input']>;
  _gt?: InputMaybe<Scalars['payment_status']['input']>;
  _gte?: InputMaybe<Scalars['payment_status']['input']>;
  _in?: InputMaybe<Array<Scalars['payment_status']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payment_status']['input']>;
  _lte?: InputMaybe<Scalars['payment_status']['input']>;
  _neq?: InputMaybe<Scalars['payment_status']['input']>;
  _nin?: InputMaybe<Array<Scalars['payment_status']['input']>>;
};

/** Boolean expression to compare columns of type "payment_type". All fields are combined with logical 'AND'. */
export type Payment_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['payment_type']['input']>;
  _gt?: InputMaybe<Scalars['payment_type']['input']>;
  _gte?: InputMaybe<Scalars['payment_type']['input']>;
  _in?: InputMaybe<Array<Scalars['payment_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['payment_type']['input']>;
  _lte?: InputMaybe<Scalars['payment_type']['input']>;
  _neq?: InputMaybe<Scalars['payment_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['payment_type']['input']>>;
};

/** Boolean expression to compare columns of type "paymentchannel". All fields are combined with logical 'AND'. */
export type Paymentchannel_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['paymentchannel']['input']>;
  _gt?: InputMaybe<Scalars['paymentchannel']['input']>;
  _gte?: InputMaybe<Scalars['paymentchannel']['input']>;
  _in?: InputMaybe<Array<Scalars['paymentchannel']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['paymentchannel']['input']>;
  _lte?: InputMaybe<Scalars['paymentchannel']['input']>;
  _neq?: InputMaybe<Scalars['paymentchannel']['input']>;
  _nin?: InputMaybe<Array<Scalars['paymentchannel']['input']>>;
};

/** columns and relationships of "payments.adjustment" */
export type Payments_Adjustment = {
  __typename?: 'payments_adjustment';
  absolute: Scalars['Boolean']['output'];
  amount: Scalars['numeric']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  payment: Payments_Payment;
  payment_id: Scalars['String']['output'];
  raw_data?: Maybe<Scalars['json']['output']>;
  reference: Scalars['String']['output'];
  status: Scalars['payment_status']['output'];
};

/** columns and relationships of "payments.adjustment" */
export type Payments_AdjustmentRaw_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "payments.adjustment" */
export type Payments_Adjustment_Aggregate = {
  __typename?: 'payments_adjustment_aggregate';
  aggregate?: Maybe<Payments_Adjustment_Aggregate_Fields>;
  nodes: Array<Payments_Adjustment>;
};

export type Payments_Adjustment_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Adjustment_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Adjustment_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Adjustment_Aggregate_Bool_Exp_Count>;
};

export type Payments_Adjustment_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Adjustment_Select_Column_Payments_Adjustment_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Payments_Adjustment_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Adjustment_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Adjustment_Select_Column_Payments_Adjustment_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Payments_Adjustment_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Adjustment_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Payments_Adjustment_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.adjustment" */
export type Payments_Adjustment_Aggregate_Fields = {
  __typename?: 'payments_adjustment_aggregate_fields';
  avg?: Maybe<Payments_Adjustment_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Payments_Adjustment_Max_Fields>;
  min?: Maybe<Payments_Adjustment_Min_Fields>;
  stddev?: Maybe<Payments_Adjustment_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Adjustment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Adjustment_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Adjustment_Sum_Fields>;
  var_pop?: Maybe<Payments_Adjustment_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Adjustment_Var_Samp_Fields>;
  variance?: Maybe<Payments_Adjustment_Variance_Fields>;
};

/** aggregate fields of "payments.adjustment" */
export type Payments_Adjustment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payments.adjustment" */
export type Payments_Adjustment_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Adjustment_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Adjustment_Max_Order_By>;
  min?: InputMaybe<Payments_Adjustment_Min_Order_By>;
  stddev?: InputMaybe<Payments_Adjustment_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Adjustment_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Adjustment_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Adjustment_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Adjustment_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Adjustment_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Adjustment_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "payments.adjustment" */
export type Payments_Adjustment_Arr_Rel_Insert_Input = {
  data: Array<Payments_Adjustment_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Adjustment_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Adjustment_Avg_Fields = {
  __typename?: 'payments_adjustment_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.adjustment". All fields are combined with a logical 'AND'. */
export type Payments_Adjustment_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Adjustment_Bool_Exp>>;
  _not?: InputMaybe<Payments_Adjustment_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Adjustment_Bool_Exp>>;
  absolute?: InputMaybe<Boolean_Comparison_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  payment?: InputMaybe<Payments_Payment_Bool_Exp>;
  payment_id?: InputMaybe<String_Comparison_Exp>;
  raw_data?: InputMaybe<Json_Comparison_Exp>;
  reference?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Payment_Status_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.adjustment" */
export enum Payments_Adjustment_Constraint {
  /** unique or primary key constraint on columns "id" */
  AdjustmentPk = 'adjustment_pk',
  /** unique or primary key constraint on columns "reference" */
  AdjustmentReferenceKey = 'adjustment_reference_key',
}

/** input type for incrementing numeric columns in table "payments.adjustment" */
export type Payments_Adjustment_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "payments.adjustment" */
export type Payments_Adjustment_Insert_Input = {
  absolute?: InputMaybe<Scalars['Boolean']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment?: InputMaybe<Payments_Payment_Obj_Rel_Insert_Input>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['payment_status']['input']>;
};

/** aggregate max on columns */
export type Payments_Adjustment_Max_Fields = {
  __typename?: 'payments_adjustment_max_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['payment_status']['output']>;
};

/** order by max() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Adjustment_Min_Fields = {
  __typename?: 'payments_adjustment_min_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['payment_status']['output']>;
};

/** order by min() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.adjustment" */
export type Payments_Adjustment_Mutation_Response = {
  __typename?: 'payments_adjustment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Adjustment>;
};

/** on_conflict condition type for table "payments.adjustment" */
export type Payments_Adjustment_On_Conflict = {
  constraint: Payments_Adjustment_Constraint;
  update_columns?: Array<Payments_Adjustment_Update_Column>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.adjustment". */
export type Payments_Adjustment_Order_By = {
  absolute?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payment?: InputMaybe<Payments_Payment_Order_By>;
  payment_id?: InputMaybe<Order_By>;
  raw_data?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.adjustment */
export type Payments_Adjustment_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payments.adjustment" */
export enum Payments_Adjustment_Select_Column {
  /** column name */
  Absolute = 'absolute',
  /** column name */
  Amount = 'amount',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  RawData = 'raw_data',
  /** column name */
  Reference = 'reference',
  /** column name */
  Status = 'status',
}

/** select "payments_adjustment_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.adjustment" */
export enum Payments_Adjustment_Select_Column_Payments_Adjustment_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Absolute = 'absolute',
}

/** select "payments_adjustment_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.adjustment" */
export enum Payments_Adjustment_Select_Column_Payments_Adjustment_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Absolute = 'absolute',
}

/** input type for updating data in table "payments.adjustment" */
export type Payments_Adjustment_Set_Input = {
  absolute?: InputMaybe<Scalars['Boolean']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['payment_status']['input']>;
};

/** aggregate stddev on columns */
export type Payments_Adjustment_Stddev_Fields = {
  __typename?: 'payments_adjustment_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Adjustment_Stddev_Pop_Fields = {
  __typename?: 'payments_adjustment_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Adjustment_Stddev_Samp_Fields = {
  __typename?: 'payments_adjustment_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_adjustment" */
export type Payments_Adjustment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Adjustment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Adjustment_Stream_Cursor_Value_Input = {
  absolute?: InputMaybe<Scalars['Boolean']['input']>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['payment_status']['input']>;
};

/** aggregate sum on columns */
export type Payments_Adjustment_Sum_Fields = {
  __typename?: 'payments_adjustment_sum_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** update columns of table "payments.adjustment" */
export enum Payments_Adjustment_Update_Column {
  /** column name */
  Absolute = 'absolute',
  /** column name */
  Amount = 'amount',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  RawData = 'raw_data',
  /** column name */
  Reference = 'reference',
  /** column name */
  Status = 'status',
}

export type Payments_Adjustment_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Adjustment_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Adjustment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Adjustment_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Adjustment_Var_Pop_Fields = {
  __typename?: 'payments_adjustment_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Adjustment_Var_Samp_Fields = {
  __typename?: 'payments_adjustment_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Adjustment_Variance_Fields = {
  __typename?: 'payments_adjustment_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "payments.adjustment" */
export type Payments_Adjustment_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.metadata" */
export type Payments_Metadata = {
  __typename?: 'payments_metadata';
  changelog: Scalars['jsonb']['output'];
  created_at: Scalars['timestamptz']['output'];
  key: Scalars['String']['output'];
  /** An object relationship */
  payment: Payments_Payment;
  payment_id: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** columns and relationships of "payments.metadata" */
export type Payments_MetadataChangelogArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "payments.metadata" */
export type Payments_Metadata_Aggregate = {
  __typename?: 'payments_metadata_aggregate';
  aggregate?: Maybe<Payments_Metadata_Aggregate_Fields>;
  nodes: Array<Payments_Metadata>;
};

export type Payments_Metadata_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payments_Metadata_Aggregate_Bool_Exp_Count>;
};

export type Payments_Metadata_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Payments_Metadata_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.metadata" */
export type Payments_Metadata_Aggregate_Fields = {
  __typename?: 'payments_metadata_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Payments_Metadata_Max_Fields>;
  min?: Maybe<Payments_Metadata_Min_Fields>;
};

/** aggregate fields of "payments.metadata" */
export type Payments_Metadata_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payments.metadata" */
export type Payments_Metadata_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Metadata_Max_Order_By>;
  min?: InputMaybe<Payments_Metadata_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Metadata_Append_Input = {
  changelog?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "payments.metadata" */
export type Payments_Metadata_Arr_Rel_Insert_Input = {
  data: Array<Payments_Metadata_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Metadata_On_Conflict>;
};

/** Boolean expression to filter rows from the table "payments.metadata". All fields are combined with a logical 'AND'. */
export type Payments_Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Metadata_Bool_Exp>>;
  _not?: InputMaybe<Payments_Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Metadata_Bool_Exp>>;
  changelog?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  key?: InputMaybe<String_Comparison_Exp>;
  payment?: InputMaybe<Payments_Payment_Bool_Exp>;
  payment_id?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.metadata" */
export enum Payments_Metadata_Constraint {
  /** unique or primary key constraint on columns "key", "payment_id" */
  MetadataPk = 'metadata_pk',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Metadata_Delete_At_Path_Input = {
  changelog?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Metadata_Delete_Elem_Input = {
  changelog?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Metadata_Delete_Key_Input = {
  changelog?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "payments.metadata" */
export type Payments_Metadata_Insert_Input = {
  changelog?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  payment?: InputMaybe<Payments_Payment_Obj_Rel_Insert_Input>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Payments_Metadata_Max_Fields = {
  __typename?: 'payments_metadata_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "payments.metadata" */
export type Payments_Metadata_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Metadata_Min_Fields = {
  __typename?: 'payments_metadata_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "payments.metadata" */
export type Payments_Metadata_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.metadata" */
export type Payments_Metadata_Mutation_Response = {
  __typename?: 'payments_metadata_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Metadata>;
};

/** on_conflict condition type for table "payments.metadata" */
export type Payments_Metadata_On_Conflict = {
  constraint: Payments_Metadata_Constraint;
  update_columns?: Array<Payments_Metadata_Update_Column>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.metadata". */
export type Payments_Metadata_Order_By = {
  changelog?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  payment?: InputMaybe<Payments_Payment_Order_By>;
  payment_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.metadata */
export type Payments_Metadata_Pk_Columns_Input = {
  key: Scalars['String']['input'];
  payment_id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Metadata_Prepend_Input = {
  changelog?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "payments.metadata" */
export enum Payments_Metadata_Select_Column {
  /** column name */
  Changelog = 'changelog',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Key = 'key',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  Value = 'value',
}

/** input type for updating data in table "payments.metadata" */
export type Payments_Metadata_Set_Input = {
  changelog?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "payments_metadata" */
export type Payments_Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Metadata_Stream_Cursor_Value_Input = {
  changelog?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "payments.metadata" */
export enum Payments_Metadata_Update_Column {
  /** column name */
  Changelog = 'changelog',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Key = 'key',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  Value = 'value',
}

export type Payments_Metadata_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Metadata_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Metadata_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Metadata_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Metadata_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Metadata_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Metadata_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Metadata_Bool_Exp;
};

/** columns and relationships of "payments.payment" */
export type Payments_Payment = {
  __typename?: 'payments_payment';
  /** An array relationship */
  adjustments: Array<Payments_Adjustment>;
  /** An aggregate relationship */
  adjustments_aggregate: Payments_Adjustment_Aggregate;
  amount: Scalars['numeric']['output'];
  asset: Scalars['String']['output'];
  /** An object relationship */
  connector: Connectors_Connector;
  connector_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  destinationAccount?: Maybe<Accounts_Account>;
  destination_account_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  initial_amount: Scalars['numeric']['output'];
  /** An array relationship */
  metadata: Array<Payments_Metadata>;
  /** An aggregate relationship */
  metadata_aggregate: Payments_Metadata_Aggregate;
  raw_data?: Maybe<Scalars['json']['output']>;
  reference: Scalars['String']['output'];
  scheme: Scalars['String']['output'];
  /** An object relationship */
  sourceAccount?: Maybe<Accounts_Account>;
  source_account_id?: Maybe<Scalars['String']['output']>;
  status: Scalars['payment_status']['output'];
  type: Scalars['payment_type']['output'];
};

/** columns and relationships of "payments.payment" */
export type Payments_PaymentAdjustmentsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Adjustment_Order_By>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

/** columns and relationships of "payments.payment" */
export type Payments_PaymentAdjustments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Adjustment_Order_By>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

/** columns and relationships of "payments.payment" */
export type Payments_PaymentMetadataArgs = {
  distinct_on?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Metadata_Order_By>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

/** columns and relationships of "payments.payment" */
export type Payments_PaymentMetadata_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Metadata_Order_By>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

/** columns and relationships of "payments.payment" */
export type Payments_PaymentRaw_DataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "payments.payment" */
export type Payments_Payment_Aggregate = {
  __typename?: 'payments_payment_aggregate';
  aggregate?: Maybe<Payments_Payment_Aggregate_Fields>;
  nodes: Array<Payments_Payment>;
};

export type Payments_Payment_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payments_Payment_Aggregate_Bool_Exp_Count>;
};

export type Payments_Payment_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Payments_Payment_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.payment" */
export type Payments_Payment_Aggregate_Fields = {
  __typename?: 'payments_payment_aggregate_fields';
  avg?: Maybe<Payments_Payment_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Payments_Payment_Max_Fields>;
  min?: Maybe<Payments_Payment_Min_Fields>;
  stddev?: Maybe<Payments_Payment_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Payment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Payment_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Payment_Sum_Fields>;
  var_pop?: Maybe<Payments_Payment_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Payment_Var_Samp_Fields>;
  variance?: Maybe<Payments_Payment_Variance_Fields>;
};

/** aggregate fields of "payments.payment" */
export type Payments_Payment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "payments.payment" */
export type Payments_Payment_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Payment_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Payment_Max_Order_By>;
  min?: InputMaybe<Payments_Payment_Min_Order_By>;
  stddev?: InputMaybe<Payments_Payment_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Payment_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Payment_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Payment_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Payment_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Payment_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Payment_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "payments.payment" */
export type Payments_Payment_Arr_Rel_Insert_Input = {
  data: Array<Payments_Payment_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Payment_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Payment_Avg_Fields = {
  __typename?: 'payments_payment_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "payments.payment" */
export type Payments_Payment_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.payment". All fields are combined with a logical 'AND'. */
export type Payments_Payment_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Payment_Bool_Exp>>;
  _not?: InputMaybe<Payments_Payment_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Payment_Bool_Exp>>;
  adjustments?: InputMaybe<Payments_Adjustment_Bool_Exp>;
  adjustments_aggregate?: InputMaybe<Payments_Adjustment_Aggregate_Bool_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  asset?: InputMaybe<String_Comparison_Exp>;
  connector?: InputMaybe<Connectors_Connector_Bool_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  destinationAccount?: InputMaybe<Accounts_Account_Bool_Exp>;
  destination_account_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  initial_amount?: InputMaybe<Numeric_Comparison_Exp>;
  metadata?: InputMaybe<Payments_Metadata_Bool_Exp>;
  metadata_aggregate?: InputMaybe<Payments_Metadata_Aggregate_Bool_Exp>;
  raw_data?: InputMaybe<Json_Comparison_Exp>;
  reference?: InputMaybe<String_Comparison_Exp>;
  scheme?: InputMaybe<String_Comparison_Exp>;
  sourceAccount?: InputMaybe<Accounts_Account_Bool_Exp>;
  source_account_id?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Payment_Status_Comparison_Exp>;
  type?: InputMaybe<Payment_Type_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.payment" */
export enum Payments_Payment_Constraint {
  /** unique or primary key constraint on columns "id" */
  PaymentPk = 'payment_pk',
  /** unique or primary key constraint on columns "reference" */
  PaymentReferenceKey = 'payment_reference_key',
}

/** input type for incrementing numeric columns in table "payments.payment" */
export type Payments_Payment_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "payments.payment" */
export type Payments_Payment_Insert_Input = {
  adjustments?: InputMaybe<Payments_Adjustment_Arr_Rel_Insert_Input>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  connector?: InputMaybe<Connectors_Connector_Obj_Rel_Insert_Input>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  destinationAccount?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  destination_account_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Payments_Metadata_Arr_Rel_Insert_Input>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  scheme?: InputMaybe<Scalars['String']['input']>;
  sourceAccount?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  source_account_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['payment_status']['input']>;
  type?: InputMaybe<Scalars['payment_type']['input']>;
};

/** aggregate max on columns */
export type Payments_Payment_Max_Fields = {
  __typename?: 'payments_payment_max_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  destination_account_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  initial_amount?: Maybe<Scalars['numeric']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  scheme?: Maybe<Scalars['String']['output']>;
  source_account_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['payment_status']['output']>;
  type?: Maybe<Scalars['payment_type']['output']>;
};

/** order by max() on columns of table "payments.payment" */
export type Payments_Payment_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  destination_account_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  scheme?: InputMaybe<Order_By>;
  source_account_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Payment_Min_Fields = {
  __typename?: 'payments_payment_min_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  destination_account_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  initial_amount?: Maybe<Scalars['numeric']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  scheme?: Maybe<Scalars['String']['output']>;
  source_account_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['payment_status']['output']>;
  type?: Maybe<Scalars['payment_type']['output']>;
};

/** order by min() on columns of table "payments.payment" */
export type Payments_Payment_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  destination_account_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  scheme?: InputMaybe<Order_By>;
  source_account_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.payment" */
export type Payments_Payment_Mutation_Response = {
  __typename?: 'payments_payment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Payment>;
};

/** input type for inserting object relation for remote table "payments.payment" */
export type Payments_Payment_Obj_Rel_Insert_Input = {
  data: Payments_Payment_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Payment_On_Conflict>;
};

/** on_conflict condition type for table "payments.payment" */
export type Payments_Payment_On_Conflict = {
  constraint: Payments_Payment_Constraint;
  update_columns?: Array<Payments_Payment_Update_Column>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.payment". */
export type Payments_Payment_Order_By = {
  adjustments_aggregate?: InputMaybe<Payments_Adjustment_Aggregate_Order_By>;
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  connector?: InputMaybe<Connectors_Connector_Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  destinationAccount?: InputMaybe<Accounts_Account_Order_By>;
  destination_account_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  metadata_aggregate?: InputMaybe<Payments_Metadata_Aggregate_Order_By>;
  raw_data?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  scheme?: InputMaybe<Order_By>;
  sourceAccount?: InputMaybe<Accounts_Account_Order_By>;
  source_account_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.payment */
export type Payments_Payment_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "payments.payment" */
export enum Payments_Payment_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Asset = 'asset',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DestinationAccountId = 'destination_account_id',
  /** column name */
  Id = 'id',
  /** column name */
  InitialAmount = 'initial_amount',
  /** column name */
  RawData = 'raw_data',
  /** column name */
  Reference = 'reference',
  /** column name */
  Scheme = 'scheme',
  /** column name */
  SourceAccountId = 'source_account_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
}

/** input type for updating data in table "payments.payment" */
export type Payments_Payment_Set_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  destination_account_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  scheme?: InputMaybe<Scalars['String']['input']>;
  source_account_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['payment_status']['input']>;
  type?: InputMaybe<Scalars['payment_type']['input']>;
};

/** aggregate stddev on columns */
export type Payments_Payment_Stddev_Fields = {
  __typename?: 'payments_payment_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "payments.payment" */
export type Payments_Payment_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Payment_Stddev_Pop_Fields = {
  __typename?: 'payments_payment_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "payments.payment" */
export type Payments_Payment_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Payment_Stddev_Samp_Fields = {
  __typename?: 'payments_payment_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "payments.payment" */
export type Payments_Payment_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_payment" */
export type Payments_Payment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Payment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Payment_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  destination_account_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  raw_data?: InputMaybe<Scalars['json']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  scheme?: InputMaybe<Scalars['String']['input']>;
  source_account_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['payment_status']['input']>;
  type?: InputMaybe<Scalars['payment_type']['input']>;
};

/** aggregate sum on columns */
export type Payments_Payment_Sum_Fields = {
  __typename?: 'payments_payment_sum_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  initial_amount?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "payments.payment" */
export type Payments_Payment_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** update columns of table "payments.payment" */
export enum Payments_Payment_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Asset = 'asset',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DestinationAccountId = 'destination_account_id',
  /** column name */
  Id = 'id',
  /** column name */
  InitialAmount = 'initial_amount',
  /** column name */
  RawData = 'raw_data',
  /** column name */
  Reference = 'reference',
  /** column name */
  Scheme = 'scheme',
  /** column name */
  SourceAccountId = 'source_account_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
}

export type Payments_Payment_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Payment_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Payment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Payment_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Payment_Var_Pop_Fields = {
  __typename?: 'payments_payment_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "payments.payment" */
export type Payments_Payment_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Payment_Var_Samp_Fields = {
  __typename?: 'payments_payment_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "payments.payment" */
export type Payments_Payment_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Payment_Variance_Fields = {
  __typename?: 'payments_payment_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "payments.payment" */
export type Payments_Payment_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.transfers" */
export type Payments_Transfers = {
  __typename?: 'payments_transfers';
  amount: Scalars['numeric']['output'];
  connector_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  currency: Scalars['String']['output'];
  destination: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  payment_id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  status: Scalars['transfer_status']['output'];
};

/** aggregated selection of "payments.transfers" */
export type Payments_Transfers_Aggregate = {
  __typename?: 'payments_transfers_aggregate';
  aggregate?: Maybe<Payments_Transfers_Aggregate_Fields>;
  nodes: Array<Payments_Transfers>;
};

/** aggregate fields of "payments.transfers" */
export type Payments_Transfers_Aggregate_Fields = {
  __typename?: 'payments_transfers_aggregate_fields';
  avg?: Maybe<Payments_Transfers_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Payments_Transfers_Max_Fields>;
  min?: Maybe<Payments_Transfers_Min_Fields>;
  stddev?: Maybe<Payments_Transfers_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Transfers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Transfers_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Transfers_Sum_Fields>;
  var_pop?: Maybe<Payments_Transfers_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Transfers_Var_Samp_Fields>;
  variance?: Maybe<Payments_Transfers_Variance_Fields>;
};

/** aggregate fields of "payments.transfers" */
export type Payments_Transfers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Transfers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Payments_Transfers_Avg_Fields = {
  __typename?: 'payments_transfers_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "payments.transfers". All fields are combined with a logical 'AND'. */
export type Payments_Transfers_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Transfers_Bool_Exp>>;
  _not?: InputMaybe<Payments_Transfers_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Transfers_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  destination?: InputMaybe<String_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  payment_id?: InputMaybe<String_Comparison_Exp>;
  reference?: InputMaybe<String_Comparison_Exp>;
  source?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Transfer_Status_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.transfers" */
export enum Payments_Transfers_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransferPk = 'transfer_pk',
  /** unique or primary key constraint on columns "reference" */
  TransfersReferenceKey = 'transfers_reference_key',
}

/** input type for incrementing numeric columns in table "payments.transfers" */
export type Payments_Transfers_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "payments.transfers" */
export type Payments_Transfers_Insert_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['transfer_status']['input']>;
};

/** aggregate max on columns */
export type Payments_Transfers_Max_Fields = {
  __typename?: 'payments_transfers_max_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['transfer_status']['output']>;
};

/** aggregate min on columns */
export type Payments_Transfers_Min_Fields = {
  __typename?: 'payments_transfers_min_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['transfer_status']['output']>;
};

/** response of any mutation on the table "payments.transfers" */
export type Payments_Transfers_Mutation_Response = {
  __typename?: 'payments_transfers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Transfers>;
};

/** on_conflict condition type for table "payments.transfers" */
export type Payments_Transfers_On_Conflict = {
  constraint: Payments_Transfers_Constraint;
  update_columns?: Array<Payments_Transfers_Update_Column>;
  where?: InputMaybe<Payments_Transfers_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.transfers". */
export type Payments_Transfers_Order_By = {
  amount?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  destination?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  source?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.transfers */
export type Payments_Transfers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "payments.transfers" */
export enum Payments_Transfers_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Currency = 'currency',
  /** column name */
  Destination = 'destination',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  Reference = 'reference',
  /** column name */
  Source = 'source',
  /** column name */
  Status = 'status',
}

/** input type for updating data in table "payments.transfers" */
export type Payments_Transfers_Set_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['transfer_status']['input']>;
};

/** aggregate stddev on columns */
export type Payments_Transfers_Stddev_Fields = {
  __typename?: 'payments_transfers_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Payments_Transfers_Stddev_Pop_Fields = {
  __typename?: 'payments_transfers_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Payments_Transfers_Stddev_Samp_Fields = {
  __typename?: 'payments_transfers_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "payments_transfers" */
export type Payments_Transfers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Transfers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Transfers_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['transfer_status']['input']>;
};

/** aggregate sum on columns */
export type Payments_Transfers_Sum_Fields = {
  __typename?: 'payments_transfers_sum_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "payments.transfers" */
export enum Payments_Transfers_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Currency = 'currency',
  /** column name */
  Destination = 'destination',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  Reference = 'reference',
  /** column name */
  Source = 'source',
  /** column name */
  Status = 'status',
}

export type Payments_Transfers_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Transfers_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Transfers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Transfers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Transfers_Var_Pop_Fields = {
  __typename?: 'payments_transfers_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Payments_Transfers_Var_Samp_Fields = {
  __typename?: 'payments_transfers_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Payments_Transfers_Variance_Fields = {
  __typename?: 'payments_transfers_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "paymentstatus". All fields are combined with logical 'AND'. */
export type Paymentstatus_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['paymentstatus']['input']>;
  _gt?: InputMaybe<Scalars['paymentstatus']['input']>;
  _gte?: InputMaybe<Scalars['paymentstatus']['input']>;
  _in?: InputMaybe<Array<Scalars['paymentstatus']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['paymentstatus']['input']>;
  _lte?: InputMaybe<Scalars['paymentstatus']['input']>;
  _neq?: InputMaybe<Scalars['paymentstatus']['input']>;
  _nin?: InputMaybe<Array<Scalars['paymentstatus']['input']>>;
};

/** Boolean expression to compare columns of type "profiletype". All fields are combined with logical 'AND'. */
export type Profiletype_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['profiletype']['input']>;
  _gt?: InputMaybe<Scalars['profiletype']['input']>;
  _gte?: InputMaybe<Scalars['profiletype']['input']>;
  _in?: InputMaybe<Array<Scalars['profiletype']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['profiletype']['input']>;
  _lte?: InputMaybe<Scalars['profiletype']['input']>;
  _neq?: InputMaybe<Scalars['profiletype']['input']>;
  _nin?: InputMaybe<Array<Scalars['profiletype']['input']>>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "accounts.account" */
  accounts_account: Array<Accounts_Account>;
  /** fetch aggregated fields from the table: "accounts.account" */
  accounts_account_aggregate: Accounts_Account_Aggregate;
  /** fetch data from the table: "accounts.account" using primary key columns */
  accounts_account_by_pk?: Maybe<Accounts_Account>;
  /** fetch data from the table: "accounts.balances" */
  accounts_balances: Array<Accounts_Balances>;
  /** fetch aggregated fields from the table: "accounts.balances" */
  accounts_balances_aggregate: Accounts_Balances_Aggregate;
  /** fetch data from the table: "accounts.balances" using primary key columns */
  accounts_balances_by_pk?: Maybe<Accounts_Balances>;
  /** fetch data from the table: "accounts.bank_account" */
  accounts_bank_account: Array<Accounts_Bank_Account>;
  /** fetch aggregated fields from the table: "accounts.bank_account" */
  accounts_bank_account_aggregate: Accounts_Bank_Account_Aggregate;
  /** fetch data from the table: "accounts.bank_account" using primary key columns */
  accounts_bank_account_by_pk?: Maybe<Accounts_Bank_Account>;
  /** fetch data from the table: "accounts.bank_account_related_accounts" */
  accounts_bank_account_related_accounts: Array<Accounts_Bank_Account_Related_Accounts>;
  /** fetch aggregated fields from the table: "accounts.bank_account_related_accounts" */
  accounts_bank_account_related_accounts_aggregate: Accounts_Bank_Account_Related_Accounts_Aggregate;
  /** fetch data from the table: "accounts.bank_account_related_accounts" using primary key columns */
  accounts_bank_account_related_accounts_by_pk?: Maybe<Accounts_Bank_Account_Related_Accounts>;
  /** fetch data from the table: "accounts.pool_accounts" */
  accounts_pool_accounts: Array<Accounts_Pool_Accounts>;
  /** fetch aggregated fields from the table: "accounts.pool_accounts" */
  accounts_pool_accounts_aggregate: Accounts_Pool_Accounts_Aggregate;
  /** fetch data from the table: "accounts.pool_accounts" using primary key columns */
  accounts_pool_accounts_by_pk?: Maybe<Accounts_Pool_Accounts>;
  /** fetch data from the table: "accounts.pools" */
  accounts_pools: Array<Accounts_Pools>;
  /** fetch aggregated fields from the table: "accounts.pools" */
  accounts_pools_aggregate: Accounts_Pools_Aggregate;
  /** fetch data from the table: "accounts.pools" using primary key columns */
  accounts_pools_by_pk?: Maybe<Accounts_Pools>;
  /** An array relationship */
  areas: Array<Areas>;
  /** An aggregate relationship */
  areas_aggregate: Areas_Aggregate;
  /** fetch data from the table: "areas" using primary key columns */
  areas_by_pk?: Maybe<Areas>;
  /** fetch data from the table: "audit_logs" */
  audit_logs: Array<Audit_Logs>;
  /** fetch aggregated fields from the table: "audit_logs" */
  audit_logs_aggregate: Audit_Logs_Aggregate;
  /** fetch data from the table: "checkout_baskets" */
  checkout_baskets: Array<Checkout_Baskets>;
  /** fetch aggregated fields from the table: "checkout_baskets" */
  checkout_baskets_aggregate: Checkout_Baskets_Aggregate;
  /** fetch data from the table: "checkout_baskets" using primary key columns */
  checkout_baskets_by_pk?: Maybe<Checkout_Baskets>;
  /** An array relationship */
  cities: Array<Cities>;
  /** An aggregate relationship */
  cities_aggregate: Cities_Aggregate;
  /** fetch data from the table: "cities" using primary key columns */
  cities_by_pk?: Maybe<Cities>;
  /** fetch data from the table: "command" */
  command: Array<Command>;
  /** fetch aggregated fields from the table: "command" */
  command_aggregate: Command_Aggregate;
  /** fetch data from the table: "command" using primary key columns */
  command_by_pk?: Maybe<Command>;
  /** fetch data from the table: "commercial_offer" */
  commercial_offer: Array<Commercial_Offer>;
  /** fetch aggregated fields from the table: "commercial_offer" */
  commercial_offer_aggregate: Commercial_Offer_Aggregate;
  /** fetch data from the table: "commercial_offer" using primary key columns */
  commercial_offer_by_pk?: Maybe<Commercial_Offer>;
  /** fetch data from the table: "connectors.connector" */
  connectors_connector: Array<Connectors_Connector>;
  /** fetch aggregated fields from the table: "connectors.connector" */
  connectors_connector_aggregate: Connectors_Connector_Aggregate;
  /** fetch data from the table: "connectors.connector" using primary key columns */
  connectors_connector_by_pk?: Maybe<Connectors_Connector>;
  /** fetch data from the table: "connectors.webhook" */
  connectors_webhook: Array<Connectors_Webhook>;
  /** fetch aggregated fields from the table: "connectors.webhook" */
  connectors_webhook_aggregate: Connectors_Webhook_Aggregate;
  /** fetch data from the table: "connectors.webhook" using primary key columns */
  connectors_webhook_by_pk?: Maybe<Connectors_Webhook>;
  /** fetch data from the table: "consumers" */
  consumers: Array<Consumers>;
  /** fetch aggregated fields from the table: "consumers" */
  consumers_aggregate: Consumers_Aggregate;
  /** fetch data from the table: "consumers" using primary key columns */
  consumers_by_pk?: Maybe<Consumers>;
  /** An array relationship */
  consumers_credit_limits: Array<Consumers_Credit_Limits>;
  /** An aggregate relationship */
  consumers_credit_limits_aggregate: Consumers_Credit_Limits_Aggregate;
  /** fetch data from the table: "consumers_credit_limits" using primary key columns */
  consumers_credit_limits_by_pk?: Maybe<Consumers_Credit_Limits>;
  /** fetch data from the table: "entry" */
  entry: Array<Entry>;
  /** fetch aggregated fields from the table: "entry" */
  entry_aggregate: Entry_Aggregate;
  /** fetch data from the table: "entry" using primary key columns */
  entry_by_pk?: Maybe<Entry>;
  /** fetch data from the table: "governorates" */
  governorates: Array<Governorates>;
  /** fetch aggregated fields from the table: "governorates" */
  governorates_aggregate: Governorates_Aggregate;
  /** fetch data from the table: "governorates" using primary key columns */
  governorates_by_pk?: Maybe<Governorates>;
  /** fetch data from the table: "identities" */
  identities: Array<Identities>;
  /** fetch aggregated fields from the table: "identities" */
  identities_aggregate: Identities_Aggregate;
  /** fetch data from the table: "identities" using primary key columns */
  identities_by_pk?: Maybe<Identities>;
  /** fetch data from the table: "identity_verifiable_addresses" */
  identity_verifiable_addresses: Array<Identity_Verifiable_Addresses>;
  /** fetch aggregated fields from the table: "identity_verifiable_addresses" */
  identity_verifiable_addresses_aggregate: Identity_Verifiable_Addresses_Aggregate;
  /** fetch data from the table: "identity_verifiable_addresses" using primary key columns */
  identity_verifiable_addresses_by_pk?: Maybe<Identity_Verifiable_Addresses>;
  /** fetch data from the table: "journal" */
  journal: Array<Journal>;
  /** fetch aggregated fields from the table: "journal" */
  journal_aggregate: Journal_Aggregate;
  /** fetch data from the table: "journal" using primary key columns */
  journal_by_pk?: Maybe<Journal>;
  /** fetch data from the table: "journal_voucher_entries" */
  journal_voucher_entries: Array<Journal_Voucher_Entries>;
  /** fetch aggregated fields from the table: "journal_voucher_entries" */
  journal_voucher_entries_aggregate: Journal_Voucher_Entries_Aggregate;
  /** fetch data from the table: "keto_relation_tuples" */
  keto_relation_tuples: Array<Keto_Relation_Tuples>;
  /** fetch aggregated fields from the table: "keto_relation_tuples" */
  keto_relation_tuples_aggregate: Keto_Relation_Tuples_Aggregate;
  /** fetch data from the table: "keto_relation_tuples" using primary key columns */
  keto_relation_tuples_by_pk?: Maybe<Keto_Relation_Tuples>;
  /** fetch data from the table: "keto_uuid_mappings" */
  keto_uuid_mappings: Array<Keto_Uuid_Mappings>;
  /** fetch aggregated fields from the table: "keto_uuid_mappings" */
  keto_uuid_mappings_aggregate: Keto_Uuid_Mappings_Aggregate;
  /** fetch data from the table: "keto_uuid_mappings" using primary key columns */
  keto_uuid_mappings_by_pk?: Maybe<Keto_Uuid_Mappings>;
  /** fetch data from the table: "loan" */
  loan: Array<Loan>;
  /** fetch aggregated fields from the table: "loan" */
  loan_aggregate: Loan_Aggregate;
  /** fetch data from the table: "loan" using primary key columns */
  loan_by_pk?: Maybe<Loan>;
  /** fetch data from the table: "loan_schedule" */
  loan_schedule: Array<Loan_Schedule>;
  /** fetch aggregated fields from the table: "loan_schedule" */
  loan_schedule_aggregate: Loan_Schedule_Aggregate;
  /** fetch data from the table: "loan_schedule" using primary key columns */
  loan_schedule_by_pk?: Maybe<Loan_Schedule>;
  /** fetch data from the table: "loan_status" */
  loan_status: Array<Loan_Status>;
  /** fetch aggregated fields from the table: "loan_status" */
  loan_status_aggregate: Loan_Status_Aggregate;
  /** fetch data from the table: "loan_status" using primary key columns */
  loan_status_by_pk?: Maybe<Loan_Status>;
  /** fetch data from the table: "merchant_payment" */
  merchant_payment: Array<Merchant_Payment>;
  /** fetch aggregated fields from the table: "merchant_payment" */
  merchant_payment_aggregate: Merchant_Payment_Aggregate;
  /** fetch data from the table: "merchant_payment" using primary key columns */
  merchant_payment_by_pk?: Maybe<Merchant_Payment>;
  /** fetch data from the table: "merchant_transaction_slip" */
  merchant_transaction_slip: Array<Merchant_Transaction_Slip>;
  /** fetch aggregated fields from the table: "merchant_transaction_slip" */
  merchant_transaction_slip_aggregate: Merchant_Transaction_Slip_Aggregate;
  /** fetch data from the table: "merchant_transaction_slip" using primary key columns */
  merchant_transaction_slip_by_pk?: Maybe<Merchant_Transaction_Slip>;
  /** fetch data from the table: "partner" */
  partner: Array<Partner>;
  /** fetch aggregated fields from the table: "partner" */
  partner_aggregate: Partner_Aggregate;
  /** fetch data from the table: "partner_bank_account" */
  partner_bank_account: Array<Partner_Bank_Account>;
  /** fetch aggregated fields from the table: "partner_bank_account" */
  partner_bank_account_aggregate: Partner_Bank_Account_Aggregate;
  /** fetch data from the table: "partner_bank_account" using primary key columns */
  partner_bank_account_by_pk?: Maybe<Partner_Bank_Account>;
  /** fetch data from the table: "partner_branch" */
  partner_branch: Array<Partner_Branch>;
  /** fetch aggregated fields from the table: "partner_branch" */
  partner_branch_aggregate: Partner_Branch_Aggregate;
  /** fetch data from the table: "partner_branch" using primary key columns */
  partner_branch_by_pk?: Maybe<Partner_Branch>;
  /** fetch data from the table: "partner" using primary key columns */
  partner_by_pk?: Maybe<Partner>;
  /** fetch data from the table: "partner_top" */
  partner_top: Array<Partner_Top>;
  /** fetch aggregated fields from the table: "partner_top" */
  partner_top_aggregate: Partner_Top_Aggregate;
  /** fetch data from the table: "partner_top" using primary key columns */
  partner_top_by_pk?: Maybe<Partner_Top>;
  /** fetch data from the table: "partner_user_profile" */
  partner_user_profile: Array<Partner_User_Profile>;
  /** fetch aggregated fields from the table: "partner_user_profile" */
  partner_user_profile_aggregate: Partner_User_Profile_Aggregate;
  /** fetch data from the table: "partner_user_profile" using primary key columns */
  partner_user_profile_by_pk?: Maybe<Partner_User_Profile>;
  /** fetch data from the table: "party_account" */
  party_account: Array<Party_Account>;
  /** fetch aggregated fields from the table: "party_account" */
  party_account_aggregate: Party_Account_Aggregate;
  /** fetch data from the table: "party_account" using primary key columns */
  party_account_by_pk?: Maybe<Party_Account>;
  /** fetch data from the table: "payments.adjustment" */
  payments_adjustment: Array<Payments_Adjustment>;
  /** fetch aggregated fields from the table: "payments.adjustment" */
  payments_adjustment_aggregate: Payments_Adjustment_Aggregate;
  /** fetch data from the table: "payments.adjustment" using primary key columns */
  payments_adjustment_by_pk?: Maybe<Payments_Adjustment>;
  /** fetch data from the table: "payments.metadata" */
  payments_metadata: Array<Payments_Metadata>;
  /** fetch aggregated fields from the table: "payments.metadata" */
  payments_metadata_aggregate: Payments_Metadata_Aggregate;
  /** fetch data from the table: "payments.metadata" using primary key columns */
  payments_metadata_by_pk?: Maybe<Payments_Metadata>;
  /** fetch data from the table: "payments.payment" */
  payments_payment: Array<Payments_Payment>;
  /** fetch aggregated fields from the table: "payments.payment" */
  payments_payment_aggregate: Payments_Payment_Aggregate;
  /** fetch data from the table: "payments.payment" using primary key columns */
  payments_payment_by_pk?: Maybe<Payments_Payment>;
  /** fetch data from the table: "payments.transfers" */
  payments_transfers: Array<Payments_Transfers>;
  /** fetch aggregated fields from the table: "payments.transfers" */
  payments_transfers_aggregate: Payments_Transfers_Aggregate;
  /** fetch data from the table: "payments.transfers" using primary key columns */
  payments_transfers_by_pk?: Maybe<Payments_Transfers>;
  /** fetch data from the table: "registry_payment" */
  registry_payment: Array<Registry_Payment>;
  /** fetch aggregated fields from the table: "registry_payment" */
  registry_payment_aggregate: Registry_Payment_Aggregate;
  /** fetch data from the table: "registry_payment" using primary key columns */
  registry_payment_by_pk?: Maybe<Registry_Payment>;
  /** fetch data from the table: "session_baskets" */
  session_baskets: Array<Session_Baskets>;
  /** fetch aggregated fields from the table: "session_baskets" */
  session_baskets_aggregate: Session_Baskets_Aggregate;
  /** fetch data from the table: "session_baskets" using primary key columns */
  session_baskets_by_pk?: Maybe<Session_Baskets>;
  /** fetch data from the table: "transfers.transfer_initiation" */
  transfers_transfer_initiation: Array<Transfers_Transfer_Initiation>;
  /** fetch data from the table: "transfers.transfer_initiation_adjustments" */
  transfers_transfer_initiation_adjustments: Array<Transfers_Transfer_Initiation_Adjustments>;
  /** fetch aggregated fields from the table: "transfers.transfer_initiation_adjustments" */
  transfers_transfer_initiation_adjustments_aggregate: Transfers_Transfer_Initiation_Adjustments_Aggregate;
  /** fetch data from the table: "transfers.transfer_initiation_adjustments" using primary key columns */
  transfers_transfer_initiation_adjustments_by_pk?: Maybe<Transfers_Transfer_Initiation_Adjustments>;
  /** fetch aggregated fields from the table: "transfers.transfer_initiation" */
  transfers_transfer_initiation_aggregate: Transfers_Transfer_Initiation_Aggregate;
  /** fetch data from the table: "transfers.transfer_initiation" using primary key columns */
  transfers_transfer_initiation_by_pk?: Maybe<Transfers_Transfer_Initiation>;
  /** fetch data from the table: "transfers.transfer_initiation_payments" */
  transfers_transfer_initiation_payments: Array<Transfers_Transfer_Initiation_Payments>;
  /** fetch aggregated fields from the table: "transfers.transfer_initiation_payments" */
  transfers_transfer_initiation_payments_aggregate: Transfers_Transfer_Initiation_Payments_Aggregate;
  /** fetch data from the table: "transfers.transfer_initiation_payments" using primary key columns */
  transfers_transfer_initiation_payments_by_pk?: Maybe<Transfers_Transfer_Initiation_Payments>;
  /** fetch data from the table: "transfers.transfer_reversal" */
  transfers_transfer_reversal: Array<Transfers_Transfer_Reversal>;
  /** fetch aggregated fields from the table: "transfers.transfer_reversal" */
  transfers_transfer_reversal_aggregate: Transfers_Transfer_Reversal_Aggregate;
  /** fetch data from the table: "transfers.transfer_reversal" using primary key columns */
  transfers_transfer_reversal_by_pk?: Maybe<Transfers_Transfer_Reversal>;
};

export type Query_RootAccounts_AccountArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Account_Order_By>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

export type Query_RootAccounts_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Account_Order_By>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

export type Query_RootAccounts_Account_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootAccounts_BalancesArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Balances_Order_By>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

export type Query_RootAccounts_Balances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Balances_Order_By>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

export type Query_RootAccounts_Balances_By_PkArgs = {
  account_id: Scalars['String']['input'];
  created_at: Scalars['timestamptz']['input'];
  currency: Scalars['String']['input'];
};

export type Query_RootAccounts_Bank_AccountArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
};

export type Query_RootAccounts_Bank_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
};

export type Query_RootAccounts_Bank_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootAccounts_Bank_Account_Related_AccountsArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

export type Query_RootAccounts_Bank_Account_Related_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

export type Query_RootAccounts_Bank_Account_Related_Accounts_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootAccounts_Pool_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

export type Query_RootAccounts_Pool_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

export type Query_RootAccounts_Pool_Accounts_By_PkArgs = {
  account_id: Scalars['String']['input'];
  pool_id: Scalars['uuid']['input'];
};

export type Query_RootAccounts_PoolsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pools_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pools_Order_By>>;
  where?: InputMaybe<Accounts_Pools_Bool_Exp>;
};

export type Query_RootAccounts_Pools_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pools_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pools_Order_By>>;
  where?: InputMaybe<Accounts_Pools_Bool_Exp>;
};

export type Query_RootAccounts_Pools_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootAreasArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

export type Query_RootAreas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

export type Query_RootAreas_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootAudit_LogsArgs = {
  distinct_on?: InputMaybe<Array<Audit_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Logs_Order_By>>;
  where?: InputMaybe<Audit_Logs_Bool_Exp>;
};

export type Query_RootAudit_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Audit_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Logs_Order_By>>;
  where?: InputMaybe<Audit_Logs_Bool_Exp>;
};

export type Query_RootCheckout_BasketsArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Baskets_Order_By>>;
  where?: InputMaybe<Checkout_Baskets_Bool_Exp>;
};

export type Query_RootCheckout_Baskets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Baskets_Order_By>>;
  where?: InputMaybe<Checkout_Baskets_Bool_Exp>;
};

export type Query_RootCheckout_Baskets_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

export type Query_RootCities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

export type Query_RootCities_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootCommandArgs = {
  distinct_on?: InputMaybe<Array<Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Command_Order_By>>;
  where?: InputMaybe<Command_Bool_Exp>;
};

export type Query_RootCommand_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Command_Order_By>>;
  where?: InputMaybe<Command_Bool_Exp>;
};

export type Query_RootCommand_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootCommercial_OfferArgs = {
  distinct_on?: InputMaybe<Array<Commercial_Offer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Commercial_Offer_Order_By>>;
  where?: InputMaybe<Commercial_Offer_Bool_Exp>;
};

export type Query_RootCommercial_Offer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Commercial_Offer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Commercial_Offer_Order_By>>;
  where?: InputMaybe<Commercial_Offer_Bool_Exp>;
};

export type Query_RootCommercial_Offer_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootConnectors_ConnectorArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Connector_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Connector_Order_By>>;
  where?: InputMaybe<Connectors_Connector_Bool_Exp>;
};

export type Query_RootConnectors_Connector_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Connector_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Connector_Order_By>>;
  where?: InputMaybe<Connectors_Connector_Bool_Exp>;
};

export type Query_RootConnectors_Connector_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootConnectors_WebhookArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Webhook_Order_By>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

export type Query_RootConnectors_Webhook_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Webhook_Order_By>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

export type Query_RootConnectors_Webhook_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootConsumersArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Order_By>>;
  where?: InputMaybe<Consumers_Bool_Exp>;
};

export type Query_RootConsumers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Order_By>>;
  where?: InputMaybe<Consumers_Bool_Exp>;
};

export type Query_RootConsumers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootConsumers_Credit_LimitsArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Credit_Limits_Order_By>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

export type Query_RootConsumers_Credit_Limits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Credit_Limits_Order_By>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

export type Query_RootConsumers_Credit_Limits_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootEntryArgs = {
  distinct_on?: InputMaybe<Array<Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Entry_Order_By>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

export type Query_RootEntry_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Entry_Order_By>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

export type Query_RootEntry_By_PkArgs = {
  id: Scalars['bigint']['input'];
};

export type Query_RootGovernoratesArgs = {
  distinct_on?: InputMaybe<Array<Governorates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Governorates_Order_By>>;
  where?: InputMaybe<Governorates_Bool_Exp>;
};

export type Query_RootGovernorates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Governorates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Governorates_Order_By>>;
  where?: InputMaybe<Governorates_Bool_Exp>;
};

export type Query_RootGovernorates_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

export type Query_RootIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

export type Query_RootIdentities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootIdentity_Verifiable_AddressesArgs = {
  distinct_on?: InputMaybe<Array<Identity_Verifiable_Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identity_Verifiable_Addresses_Order_By>>;
  where?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
};

export type Query_RootIdentity_Verifiable_Addresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Verifiable_Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identity_Verifiable_Addresses_Order_By>>;
  where?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
};

export type Query_RootIdentity_Verifiable_Addresses_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootJournalArgs = {
  distinct_on?: InputMaybe<Array<Journal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Order_By>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

export type Query_RootJournal_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Order_By>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

export type Query_RootJournal_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootJournal_Voucher_EntriesArgs = {
  distinct_on?: InputMaybe<Array<Journal_Voucher_Entries_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Voucher_Entries_Order_By>>;
  where?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
};

export type Query_RootJournal_Voucher_Entries_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journal_Voucher_Entries_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Voucher_Entries_Order_By>>;
  where?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
};

export type Query_RootKeto_Relation_TuplesArgs = {
  distinct_on?: InputMaybe<Array<Keto_Relation_Tuples_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Relation_Tuples_Order_By>>;
  where?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
};

export type Query_RootKeto_Relation_Tuples_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Keto_Relation_Tuples_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Relation_Tuples_Order_By>>;
  where?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
};

export type Query_RootKeto_Relation_Tuples_By_PkArgs = {
  nid: Scalars['uuid']['input'];
  shard_id: Scalars['uuid']['input'];
};

export type Query_RootKeto_Uuid_MappingsArgs = {
  distinct_on?: InputMaybe<Array<Keto_Uuid_Mappings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Uuid_Mappings_Order_By>>;
  where?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
};

export type Query_RootKeto_Uuid_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Keto_Uuid_Mappings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Uuid_Mappings_Order_By>>;
  where?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
};

export type Query_RootKeto_Uuid_Mappings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootLoanArgs = {
  distinct_on?: InputMaybe<Array<Loan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Order_By>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

export type Query_RootLoan_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Order_By>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

export type Query_RootLoan_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootLoan_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Schedule_Order_By>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

export type Query_RootLoan_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Schedule_Order_By>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

export type Query_RootLoan_Schedule_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootLoan_StatusArgs = {
  distinct_on?: InputMaybe<Array<Loan_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Status_Order_By>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

export type Query_RootLoan_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Status_Order_By>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

export type Query_RootLoan_Status_By_PkArgs = {
  loan_id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type Query_RootMerchant_PaymentArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Payment_Order_By>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

export type Query_RootMerchant_Payment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Payment_Order_By>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

export type Query_RootMerchant_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootMerchant_Transaction_SlipArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Transaction_Slip_Order_By>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

export type Query_RootMerchant_Transaction_Slip_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Transaction_Slip_Order_By>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

export type Query_RootMerchant_Transaction_Slip_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootPartnerArgs = {
  distinct_on?: InputMaybe<Array<Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Order_By>>;
  where?: InputMaybe<Partner_Bool_Exp>;
};

export type Query_RootPartner_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Order_By>>;
  where?: InputMaybe<Partner_Bool_Exp>;
};

export type Query_RootPartner_Bank_AccountArgs = {
  distinct_on?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Bank_Account_Order_By>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

export type Query_RootPartner_Bank_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Bank_Account_Order_By>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

export type Query_RootPartner_Bank_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPartner_BranchArgs = {
  distinct_on?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Branch_Order_By>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

export type Query_RootPartner_Branch_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Branch_Order_By>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

export type Query_RootPartner_Branch_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPartner_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPartner_TopArgs = {
  distinct_on?: InputMaybe<Array<Partner_Top_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Top_Order_By>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

export type Query_RootPartner_Top_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Top_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Top_Order_By>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

export type Query_RootPartner_Top_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPartner_User_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_User_Profile_Order_By>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

export type Query_RootPartner_User_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_User_Profile_Order_By>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

export type Query_RootPartner_User_Profile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootParty_AccountArgs = {
  distinct_on?: InputMaybe<Array<Party_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Party_Account_Order_By>>;
  where?: InputMaybe<Party_Account_Bool_Exp>;
};

export type Query_RootParty_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Party_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Party_Account_Order_By>>;
  where?: InputMaybe<Party_Account_Bool_Exp>;
};

export type Query_RootParty_Account_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootPayments_AdjustmentArgs = {
  distinct_on?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Adjustment_Order_By>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

export type Query_RootPayments_Adjustment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Adjustment_Order_By>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

export type Query_RootPayments_Adjustment_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPayments_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Metadata_Order_By>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

export type Query_RootPayments_Metadata_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Metadata_Order_By>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

export type Query_RootPayments_Metadata_By_PkArgs = {
  key: Scalars['String']['input'];
  payment_id: Scalars['String']['input'];
};

export type Query_RootPayments_PaymentArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

export type Query_RootPayments_Payment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

export type Query_RootPayments_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootPayments_TransfersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Transfers_Order_By>>;
  where?: InputMaybe<Payments_Transfers_Bool_Exp>;
};

export type Query_RootPayments_Transfers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Transfers_Order_By>>;
  where?: InputMaybe<Payments_Transfers_Bool_Exp>;
};

export type Query_RootPayments_Transfers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootRegistry_PaymentArgs = {
  distinct_on?: InputMaybe<Array<Registry_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Registry_Payment_Order_By>>;
  where?: InputMaybe<Registry_Payment_Bool_Exp>;
};

export type Query_RootRegistry_Payment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Registry_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Registry_Payment_Order_By>>;
  where?: InputMaybe<Registry_Payment_Bool_Exp>;
};

export type Query_RootRegistry_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootSession_BasketsArgs = {
  distinct_on?: InputMaybe<Array<Session_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Session_Baskets_Order_By>>;
  where?: InputMaybe<Session_Baskets_Bool_Exp>;
};

export type Query_RootSession_Baskets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Session_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Session_Baskets_Order_By>>;
  where?: InputMaybe<Session_Baskets_Bool_Exp>;
};

export type Query_RootSession_Baskets_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootTransfers_Transfer_InitiationArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Initiation_AdjustmentsArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Adjustments_Order_By>
  >;
  where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Initiation_Adjustments_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Order_By>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
  };

export type Query_RootTransfers_Transfer_Initiation_Adjustments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootTransfers_Transfer_Initiation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Initiation_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Query_RootTransfers_Transfer_Initiation_PaymentsArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Payments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Payments_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Initiation_Payments_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Payments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Payments_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Initiation_Payments_By_PkArgs = {
  payment_id: Scalars['String']['input'];
  transfer_initiation_id: Scalars['String']['input'];
};

export type Query_RootTransfers_Transfer_ReversalArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Reversal_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

export type Query_RootTransfers_Transfer_Reversal_By_PkArgs = {
  id: Scalars['String']['input'];
};

/** columns and relationships of "registry_payment" */
export type Registry_Payment = {
  __typename?: 'registry_payment';
  amount_currency: Scalars['currencycode']['output'];
  amount_units: Scalars['Int']['output'];
  billing_account: Scalars['String']['output'];
  billing_account_schedule_id: Scalars['Int']['output'];
  booking_time: Scalars['timestamp']['output'];
  channel: Scalars['paymentchannel']['output'];
  channel_reference_id: Scalars['String']['output'];
  channel_transaction_id: Scalars['String']['output'];
  created_at: Scalars['timestamp']['output'];
  created_by: Scalars['String']['output'];
  id: Scalars['String']['output'];
  payee_id: Scalars['String']['output'];
  payee_id_type: Scalars['payeeidtype']['output'];
  payee_type: Scalars['payeetype']['output'];
  raw_request?: Maybe<Scalars['jsonb']['output']>;
  status: Scalars['paymentstatus']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** columns and relationships of "registry_payment" */
export type Registry_PaymentRaw_RequestArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "registry_payment" */
export type Registry_Payment_Aggregate = {
  __typename?: 'registry_payment_aggregate';
  aggregate?: Maybe<Registry_Payment_Aggregate_Fields>;
  nodes: Array<Registry_Payment>;
};

/** aggregate fields of "registry_payment" */
export type Registry_Payment_Aggregate_Fields = {
  __typename?: 'registry_payment_aggregate_fields';
  avg?: Maybe<Registry_Payment_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Registry_Payment_Max_Fields>;
  min?: Maybe<Registry_Payment_Min_Fields>;
  stddev?: Maybe<Registry_Payment_Stddev_Fields>;
  stddev_pop?: Maybe<Registry_Payment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Registry_Payment_Stddev_Samp_Fields>;
  sum?: Maybe<Registry_Payment_Sum_Fields>;
  var_pop?: Maybe<Registry_Payment_Var_Pop_Fields>;
  var_samp?: Maybe<Registry_Payment_Var_Samp_Fields>;
  variance?: Maybe<Registry_Payment_Variance_Fields>;
};

/** aggregate fields of "registry_payment" */
export type Registry_Payment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Registry_Payment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Registry_Payment_Append_Input = {
  raw_request?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Registry_Payment_Avg_Fields = {
  __typename?: 'registry_payment_avg_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "registry_payment". All fields are combined with a logical 'AND'. */
export type Registry_Payment_Bool_Exp = {
  _and?: InputMaybe<Array<Registry_Payment_Bool_Exp>>;
  _not?: InputMaybe<Registry_Payment_Bool_Exp>;
  _or?: InputMaybe<Array<Registry_Payment_Bool_Exp>>;
  amount_currency?: InputMaybe<Currencycode_Comparison_Exp>;
  amount_units?: InputMaybe<Int_Comparison_Exp>;
  billing_account?: InputMaybe<String_Comparison_Exp>;
  billing_account_schedule_id?: InputMaybe<Int_Comparison_Exp>;
  booking_time?: InputMaybe<Timestamp_Comparison_Exp>;
  channel?: InputMaybe<Paymentchannel_Comparison_Exp>;
  channel_reference_id?: InputMaybe<String_Comparison_Exp>;
  channel_transaction_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  payee_id?: InputMaybe<String_Comparison_Exp>;
  payee_id_type?: InputMaybe<Payeeidtype_Comparison_Exp>;
  payee_type?: InputMaybe<Payeetype_Comparison_Exp>;
  raw_request?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<Paymentstatus_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "registry_payment" */
export enum Registry_Payment_Constraint {
  /** unique or primary key constraint on columns "id" */
  RegistryPaymentPkey = 'registry_payment_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Registry_Payment_Delete_At_Path_Input = {
  raw_request?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Registry_Payment_Delete_Elem_Input = {
  raw_request?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Registry_Payment_Delete_Key_Input = {
  raw_request?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "registry_payment" */
export type Registry_Payment_Inc_Input = {
  amount_units?: InputMaybe<Scalars['Int']['input']>;
  billing_account_schedule_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "registry_payment" */
export type Registry_Payment_Insert_Input = {
  amount_currency?: InputMaybe<Scalars['currencycode']['input']>;
  amount_units?: InputMaybe<Scalars['Int']['input']>;
  billing_account?: InputMaybe<Scalars['String']['input']>;
  billing_account_schedule_id?: InputMaybe<Scalars['Int']['input']>;
  booking_time?: InputMaybe<Scalars['timestamp']['input']>;
  channel?: InputMaybe<Scalars['paymentchannel']['input']>;
  channel_reference_id?: InputMaybe<Scalars['String']['input']>;
  channel_transaction_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  payee_id?: InputMaybe<Scalars['String']['input']>;
  payee_id_type?: InputMaybe<Scalars['payeeidtype']['input']>;
  payee_type?: InputMaybe<Scalars['payeetype']['input']>;
  raw_request?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['paymentstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Registry_Payment_Max_Fields = {
  __typename?: 'registry_payment_max_fields';
  amount_currency?: Maybe<Scalars['currencycode']['output']>;
  amount_units?: Maybe<Scalars['Int']['output']>;
  billing_account?: Maybe<Scalars['String']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Int']['output']>;
  booking_time?: Maybe<Scalars['timestamp']['output']>;
  channel?: Maybe<Scalars['paymentchannel']['output']>;
  channel_reference_id?: Maybe<Scalars['String']['output']>;
  channel_transaction_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  payee_id?: Maybe<Scalars['String']['output']>;
  payee_id_type?: Maybe<Scalars['payeeidtype']['output']>;
  payee_type?: Maybe<Scalars['payeetype']['output']>;
  status?: Maybe<Scalars['paymentstatus']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregate min on columns */
export type Registry_Payment_Min_Fields = {
  __typename?: 'registry_payment_min_fields';
  amount_currency?: Maybe<Scalars['currencycode']['output']>;
  amount_units?: Maybe<Scalars['Int']['output']>;
  billing_account?: Maybe<Scalars['String']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Int']['output']>;
  booking_time?: Maybe<Scalars['timestamp']['output']>;
  channel?: Maybe<Scalars['paymentchannel']['output']>;
  channel_reference_id?: Maybe<Scalars['String']['output']>;
  channel_transaction_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  created_by?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  payee_id?: Maybe<Scalars['String']['output']>;
  payee_id_type?: Maybe<Scalars['payeeidtype']['output']>;
  payee_type?: Maybe<Scalars['payeetype']['output']>;
  status?: Maybe<Scalars['paymentstatus']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** response of any mutation on the table "registry_payment" */
export type Registry_Payment_Mutation_Response = {
  __typename?: 'registry_payment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Registry_Payment>;
};

/** on_conflict condition type for table "registry_payment" */
export type Registry_Payment_On_Conflict = {
  constraint: Registry_Payment_Constraint;
  update_columns?: Array<Registry_Payment_Update_Column>;
  where?: InputMaybe<Registry_Payment_Bool_Exp>;
};

/** Ordering options when selecting data from "registry_payment". */
export type Registry_Payment_Order_By = {
  amount_currency?: InputMaybe<Order_By>;
  amount_units?: InputMaybe<Order_By>;
  billing_account?: InputMaybe<Order_By>;
  billing_account_schedule_id?: InputMaybe<Order_By>;
  booking_time?: InputMaybe<Order_By>;
  channel?: InputMaybe<Order_By>;
  channel_reference_id?: InputMaybe<Order_By>;
  channel_transaction_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payee_id?: InputMaybe<Order_By>;
  payee_id_type?: InputMaybe<Order_By>;
  payee_type?: InputMaybe<Order_By>;
  raw_request?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: registry_payment */
export type Registry_Payment_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Registry_Payment_Prepend_Input = {
  raw_request?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "registry_payment" */
export enum Registry_Payment_Select_Column {
  /** column name */
  AmountCurrency = 'amount_currency',
  /** column name */
  AmountUnits = 'amount_units',
  /** column name */
  BillingAccount = 'billing_account',
  /** column name */
  BillingAccountScheduleId = 'billing_account_schedule_id',
  /** column name */
  BookingTime = 'booking_time',
  /** column name */
  Channel = 'channel',
  /** column name */
  ChannelReferenceId = 'channel_reference_id',
  /** column name */
  ChannelTransactionId = 'channel_transaction_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  Id = 'id',
  /** column name */
  PayeeId = 'payee_id',
  /** column name */
  PayeeIdType = 'payee_id_type',
  /** column name */
  PayeeType = 'payee_type',
  /** column name */
  RawRequest = 'raw_request',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "registry_payment" */
export type Registry_Payment_Set_Input = {
  amount_currency?: InputMaybe<Scalars['currencycode']['input']>;
  amount_units?: InputMaybe<Scalars['Int']['input']>;
  billing_account?: InputMaybe<Scalars['String']['input']>;
  billing_account_schedule_id?: InputMaybe<Scalars['Int']['input']>;
  booking_time?: InputMaybe<Scalars['timestamp']['input']>;
  channel?: InputMaybe<Scalars['paymentchannel']['input']>;
  channel_reference_id?: InputMaybe<Scalars['String']['input']>;
  channel_transaction_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  payee_id?: InputMaybe<Scalars['String']['input']>;
  payee_id_type?: InputMaybe<Scalars['payeeidtype']['input']>;
  payee_type?: InputMaybe<Scalars['payeetype']['input']>;
  raw_request?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['paymentstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate stddev on columns */
export type Registry_Payment_Stddev_Fields = {
  __typename?: 'registry_payment_stddev_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Registry_Payment_Stddev_Pop_Fields = {
  __typename?: 'registry_payment_stddev_pop_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Registry_Payment_Stddev_Samp_Fields = {
  __typename?: 'registry_payment_stddev_samp_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "registry_payment" */
export type Registry_Payment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Registry_Payment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Registry_Payment_Stream_Cursor_Value_Input = {
  amount_currency?: InputMaybe<Scalars['currencycode']['input']>;
  amount_units?: InputMaybe<Scalars['Int']['input']>;
  billing_account?: InputMaybe<Scalars['String']['input']>;
  billing_account_schedule_id?: InputMaybe<Scalars['Int']['input']>;
  booking_time?: InputMaybe<Scalars['timestamp']['input']>;
  channel?: InputMaybe<Scalars['paymentchannel']['input']>;
  channel_reference_id?: InputMaybe<Scalars['String']['input']>;
  channel_transaction_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  created_by?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  payee_id?: InputMaybe<Scalars['String']['input']>;
  payee_id_type?: InputMaybe<Scalars['payeeidtype']['input']>;
  payee_type?: InputMaybe<Scalars['payeetype']['input']>;
  raw_request?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['paymentstatus']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate sum on columns */
export type Registry_Payment_Sum_Fields = {
  __typename?: 'registry_payment_sum_fields';
  amount_units?: Maybe<Scalars['Int']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "registry_payment" */
export enum Registry_Payment_Update_Column {
  /** column name */
  AmountCurrency = 'amount_currency',
  /** column name */
  AmountUnits = 'amount_units',
  /** column name */
  BillingAccount = 'billing_account',
  /** column name */
  BillingAccountScheduleId = 'billing_account_schedule_id',
  /** column name */
  BookingTime = 'booking_time',
  /** column name */
  Channel = 'channel',
  /** column name */
  ChannelReferenceId = 'channel_reference_id',
  /** column name */
  ChannelTransactionId = 'channel_transaction_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  Id = 'id',
  /** column name */
  PayeeId = 'payee_id',
  /** column name */
  PayeeIdType = 'payee_id_type',
  /** column name */
  PayeeType = 'payee_type',
  /** column name */
  RawRequest = 'raw_request',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Registry_Payment_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Registry_Payment_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Registry_Payment_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Registry_Payment_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Registry_Payment_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Registry_Payment_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Registry_Payment_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Registry_Payment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Registry_Payment_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Registry_Payment_Var_Pop_Fields = {
  __typename?: 'registry_payment_var_pop_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Registry_Payment_Var_Samp_Fields = {
  __typename?: 'registry_payment_var_samp_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Registry_Payment_Variance_Fields = {
  __typename?: 'registry_payment_variance_fields';
  amount_units?: Maybe<Scalars['Float']['output']>;
  billing_account_schedule_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "session_baskets" */
export type Session_Baskets = {
  __typename?: 'session_baskets';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  cashier_id: Scalars['uuid']['output'];
  /** An object relationship */
  checkout_basket?: Maybe<Checkout_Baskets>;
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at: Scalars['timestamp']['output'];
  id: Scalars['uuid']['output'];
  partner_id: Scalars['uuid']['output'];
  partner_name: Scalars['String']['output'];
  product: Scalars['jsonb']['output'];
  status: Scalars['String']['output'];
  updated_at: Scalars['timestamp']['output'];
};

/** columns and relationships of "session_baskets" */
export type Session_BasketsProductArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "session_baskets" */
export type Session_Baskets_Aggregate = {
  __typename?: 'session_baskets_aggregate';
  aggregate?: Maybe<Session_Baskets_Aggregate_Fields>;
  nodes: Array<Session_Baskets>;
};

/** aggregate fields of "session_baskets" */
export type Session_Baskets_Aggregate_Fields = {
  __typename?: 'session_baskets_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Session_Baskets_Max_Fields>;
  min?: Maybe<Session_Baskets_Min_Fields>;
};

/** aggregate fields of "session_baskets" */
export type Session_Baskets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Session_Baskets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Session_Baskets_Append_Input = {
  product?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "session_baskets". All fields are combined with a logical 'AND'. */
export type Session_Baskets_Bool_Exp = {
  _and?: InputMaybe<Array<Session_Baskets_Bool_Exp>>;
  _not?: InputMaybe<Session_Baskets_Bool_Exp>;
  _or?: InputMaybe<Array<Session_Baskets_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  cashier_id?: InputMaybe<Uuid_Comparison_Exp>;
  checkout_basket?: InputMaybe<Checkout_Baskets_Bool_Exp>;
  consumer_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  partner_id?: InputMaybe<Uuid_Comparison_Exp>;
  partner_name?: InputMaybe<String_Comparison_Exp>;
  product?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "session_baskets" */
export enum Session_Baskets_Constraint {
  /** unique or primary key constraint on columns "id" */
  SessionBasketsPkey = 'session_baskets_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Session_Baskets_Delete_At_Path_Input = {
  product?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Session_Baskets_Delete_Elem_Input = {
  product?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Session_Baskets_Delete_Key_Input = {
  product?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "session_baskets" */
export type Session_Baskets_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  cashier_id?: InputMaybe<Scalars['uuid']['input']>;
  checkout_basket?: InputMaybe<Checkout_Baskets_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  partner_name?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** aggregate max on columns */
export type Session_Baskets_Max_Fields = {
  __typename?: 'session_baskets_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  cashier_id?: Maybe<Scalars['uuid']['output']>;
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  partner_name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** aggregate min on columns */
export type Session_Baskets_Min_Fields = {
  __typename?: 'session_baskets_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  cashier_id?: Maybe<Scalars['uuid']['output']>;
  consumer_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  partner_id?: Maybe<Scalars['uuid']['output']>;
  partner_name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamp']['output']>;
};

/** response of any mutation on the table "session_baskets" */
export type Session_Baskets_Mutation_Response = {
  __typename?: 'session_baskets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Session_Baskets>;
};

/** input type for inserting object relation for remote table "session_baskets" */
export type Session_Baskets_Obj_Rel_Insert_Input = {
  data: Session_Baskets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Session_Baskets_On_Conflict>;
};

/** on_conflict condition type for table "session_baskets" */
export type Session_Baskets_On_Conflict = {
  constraint: Session_Baskets_Constraint;
  update_columns?: Array<Session_Baskets_Update_Column>;
  where?: InputMaybe<Session_Baskets_Bool_Exp>;
};

/** Ordering options when selecting data from "session_baskets". */
export type Session_Baskets_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  cashier_id?: InputMaybe<Order_By>;
  checkout_basket?: InputMaybe<Checkout_Baskets_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  partner_id?: InputMaybe<Order_By>;
  partner_name?: InputMaybe<Order_By>;
  product?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: session_baskets */
export type Session_Baskets_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Session_Baskets_Prepend_Input = {
  product?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "session_baskets" */
export enum Session_Baskets_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  CashierId = 'cashier_id',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  PartnerName = 'partner_name',
  /** column name */
  Product = 'product',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "session_baskets" */
export type Session_Baskets_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  cashier_id?: InputMaybe<Scalars['uuid']['input']>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  partner_name?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** Streaming cursor of the table "session_baskets" */
export type Session_Baskets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Session_Baskets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Session_Baskets_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  cashier_id?: InputMaybe<Scalars['uuid']['input']>;
  consumer_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  partner_id?: InputMaybe<Scalars['uuid']['input']>;
  partner_name?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamp']['input']>;
};

/** update columns of table "session_baskets" */
export enum Session_Baskets_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  CashierId = 'cashier_id',
  /** column name */
  ConsumerId = 'consumer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PartnerId = 'partner_id',
  /** column name */
  PartnerName = 'partner_name',
  /** column name */
  Product = 'product',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Session_Baskets_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Session_Baskets_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Session_Baskets_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Session_Baskets_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Session_Baskets_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Session_Baskets_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Session_Baskets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Session_Baskets_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "accounts.account" */
  accounts_account: Array<Accounts_Account>;
  /** fetch aggregated fields from the table: "accounts.account" */
  accounts_account_aggregate: Accounts_Account_Aggregate;
  /** fetch data from the table: "accounts.account" using primary key columns */
  accounts_account_by_pk?: Maybe<Accounts_Account>;
  /** fetch data from the table in a streaming manner: "accounts.account" */
  accounts_account_stream: Array<Accounts_Account>;
  /** fetch data from the table: "accounts.balances" */
  accounts_balances: Array<Accounts_Balances>;
  /** fetch aggregated fields from the table: "accounts.balances" */
  accounts_balances_aggregate: Accounts_Balances_Aggregate;
  /** fetch data from the table: "accounts.balances" using primary key columns */
  accounts_balances_by_pk?: Maybe<Accounts_Balances>;
  /** fetch data from the table in a streaming manner: "accounts.balances" */
  accounts_balances_stream: Array<Accounts_Balances>;
  /** fetch data from the table: "accounts.bank_account" */
  accounts_bank_account: Array<Accounts_Bank_Account>;
  /** fetch aggregated fields from the table: "accounts.bank_account" */
  accounts_bank_account_aggregate: Accounts_Bank_Account_Aggregate;
  /** fetch data from the table: "accounts.bank_account" using primary key columns */
  accounts_bank_account_by_pk?: Maybe<Accounts_Bank_Account>;
  /** fetch data from the table: "accounts.bank_account_related_accounts" */
  accounts_bank_account_related_accounts: Array<Accounts_Bank_Account_Related_Accounts>;
  /** fetch aggregated fields from the table: "accounts.bank_account_related_accounts" */
  accounts_bank_account_related_accounts_aggregate: Accounts_Bank_Account_Related_Accounts_Aggregate;
  /** fetch data from the table: "accounts.bank_account_related_accounts" using primary key columns */
  accounts_bank_account_related_accounts_by_pk?: Maybe<Accounts_Bank_Account_Related_Accounts>;
  /** fetch data from the table in a streaming manner: "accounts.bank_account_related_accounts" */
  accounts_bank_account_related_accounts_stream: Array<Accounts_Bank_Account_Related_Accounts>;
  /** fetch data from the table in a streaming manner: "accounts.bank_account" */
  accounts_bank_account_stream: Array<Accounts_Bank_Account>;
  /** fetch data from the table: "accounts.pool_accounts" */
  accounts_pool_accounts: Array<Accounts_Pool_Accounts>;
  /** fetch aggregated fields from the table: "accounts.pool_accounts" */
  accounts_pool_accounts_aggregate: Accounts_Pool_Accounts_Aggregate;
  /** fetch data from the table: "accounts.pool_accounts" using primary key columns */
  accounts_pool_accounts_by_pk?: Maybe<Accounts_Pool_Accounts>;
  /** fetch data from the table in a streaming manner: "accounts.pool_accounts" */
  accounts_pool_accounts_stream: Array<Accounts_Pool_Accounts>;
  /** fetch data from the table: "accounts.pools" */
  accounts_pools: Array<Accounts_Pools>;
  /** fetch aggregated fields from the table: "accounts.pools" */
  accounts_pools_aggregate: Accounts_Pools_Aggregate;
  /** fetch data from the table: "accounts.pools" using primary key columns */
  accounts_pools_by_pk?: Maybe<Accounts_Pools>;
  /** fetch data from the table in a streaming manner: "accounts.pools" */
  accounts_pools_stream: Array<Accounts_Pools>;
  /** An array relationship */
  areas: Array<Areas>;
  /** An aggregate relationship */
  areas_aggregate: Areas_Aggregate;
  /** fetch data from the table: "areas" using primary key columns */
  areas_by_pk?: Maybe<Areas>;
  /** fetch data from the table in a streaming manner: "areas" */
  areas_stream: Array<Areas>;
  /** fetch data from the table: "audit_logs" */
  audit_logs: Array<Audit_Logs>;
  /** fetch aggregated fields from the table: "audit_logs" */
  audit_logs_aggregate: Audit_Logs_Aggregate;
  /** fetch data from the table in a streaming manner: "audit_logs" */
  audit_logs_stream: Array<Audit_Logs>;
  /** fetch data from the table: "checkout_baskets" */
  checkout_baskets: Array<Checkout_Baskets>;
  /** fetch aggregated fields from the table: "checkout_baskets" */
  checkout_baskets_aggregate: Checkout_Baskets_Aggregate;
  /** fetch data from the table: "checkout_baskets" using primary key columns */
  checkout_baskets_by_pk?: Maybe<Checkout_Baskets>;
  /** fetch data from the table in a streaming manner: "checkout_baskets" */
  checkout_baskets_stream: Array<Checkout_Baskets>;
  /** An array relationship */
  cities: Array<Cities>;
  /** An aggregate relationship */
  cities_aggregate: Cities_Aggregate;
  /** fetch data from the table: "cities" using primary key columns */
  cities_by_pk?: Maybe<Cities>;
  /** fetch data from the table in a streaming manner: "cities" */
  cities_stream: Array<Cities>;
  /** fetch data from the table: "command" */
  command: Array<Command>;
  /** fetch aggregated fields from the table: "command" */
  command_aggregate: Command_Aggregate;
  /** fetch data from the table: "command" using primary key columns */
  command_by_pk?: Maybe<Command>;
  /** fetch data from the table in a streaming manner: "command" */
  command_stream: Array<Command>;
  /** fetch data from the table: "commercial_offer" */
  commercial_offer: Array<Commercial_Offer>;
  /** fetch aggregated fields from the table: "commercial_offer" */
  commercial_offer_aggregate: Commercial_Offer_Aggregate;
  /** fetch data from the table: "commercial_offer" using primary key columns */
  commercial_offer_by_pk?: Maybe<Commercial_Offer>;
  /** fetch data from the table in a streaming manner: "commercial_offer" */
  commercial_offer_stream: Array<Commercial_Offer>;
  /** fetch data from the table: "connectors.connector" */
  connectors_connector: Array<Connectors_Connector>;
  /** fetch aggregated fields from the table: "connectors.connector" */
  connectors_connector_aggregate: Connectors_Connector_Aggregate;
  /** fetch data from the table: "connectors.connector" using primary key columns */
  connectors_connector_by_pk?: Maybe<Connectors_Connector>;
  /** fetch data from the table in a streaming manner: "connectors.connector" */
  connectors_connector_stream: Array<Connectors_Connector>;
  /** fetch data from the table: "connectors.webhook" */
  connectors_webhook: Array<Connectors_Webhook>;
  /** fetch aggregated fields from the table: "connectors.webhook" */
  connectors_webhook_aggregate: Connectors_Webhook_Aggregate;
  /** fetch data from the table: "connectors.webhook" using primary key columns */
  connectors_webhook_by_pk?: Maybe<Connectors_Webhook>;
  /** fetch data from the table in a streaming manner: "connectors.webhook" */
  connectors_webhook_stream: Array<Connectors_Webhook>;
  /** fetch data from the table: "consumers" */
  consumers: Array<Consumers>;
  /** fetch aggregated fields from the table: "consumers" */
  consumers_aggregate: Consumers_Aggregate;
  /** fetch data from the table: "consumers" using primary key columns */
  consumers_by_pk?: Maybe<Consumers>;
  /** An array relationship */
  consumers_credit_limits: Array<Consumers_Credit_Limits>;
  /** An aggregate relationship */
  consumers_credit_limits_aggregate: Consumers_Credit_Limits_Aggregate;
  /** fetch data from the table: "consumers_credit_limits" using primary key columns */
  consumers_credit_limits_by_pk?: Maybe<Consumers_Credit_Limits>;
  /** fetch data from the table in a streaming manner: "consumers_credit_limits" */
  consumers_credit_limits_stream: Array<Consumers_Credit_Limits>;
  /** fetch data from the table in a streaming manner: "consumers" */
  consumers_stream: Array<Consumers>;
  /** fetch data from the table: "entry" */
  entry: Array<Entry>;
  /** fetch aggregated fields from the table: "entry" */
  entry_aggregate: Entry_Aggregate;
  /** fetch data from the table: "entry" using primary key columns */
  entry_by_pk?: Maybe<Entry>;
  /** fetch data from the table in a streaming manner: "entry" */
  entry_stream: Array<Entry>;
  /** fetch data from the table: "governorates" */
  governorates: Array<Governorates>;
  /** fetch aggregated fields from the table: "governorates" */
  governorates_aggregate: Governorates_Aggregate;
  /** fetch data from the table: "governorates" using primary key columns */
  governorates_by_pk?: Maybe<Governorates>;
  /** fetch data from the table in a streaming manner: "governorates" */
  governorates_stream: Array<Governorates>;
  /** fetch data from the table: "identities" */
  identities: Array<Identities>;
  /** fetch aggregated fields from the table: "identities" */
  identities_aggregate: Identities_Aggregate;
  /** fetch data from the table: "identities" using primary key columns */
  identities_by_pk?: Maybe<Identities>;
  /** fetch data from the table in a streaming manner: "identities" */
  identities_stream: Array<Identities>;
  /** fetch data from the table: "identity_verifiable_addresses" */
  identity_verifiable_addresses: Array<Identity_Verifiable_Addresses>;
  /** fetch aggregated fields from the table: "identity_verifiable_addresses" */
  identity_verifiable_addresses_aggregate: Identity_Verifiable_Addresses_Aggregate;
  /** fetch data from the table: "identity_verifiable_addresses" using primary key columns */
  identity_verifiable_addresses_by_pk?: Maybe<Identity_Verifiable_Addresses>;
  /** fetch data from the table in a streaming manner: "identity_verifiable_addresses" */
  identity_verifiable_addresses_stream: Array<Identity_Verifiable_Addresses>;
  /** fetch data from the table: "journal" */
  journal: Array<Journal>;
  /** fetch aggregated fields from the table: "journal" */
  journal_aggregate: Journal_Aggregate;
  /** fetch data from the table: "journal" using primary key columns */
  journal_by_pk?: Maybe<Journal>;
  /** fetch data from the table in a streaming manner: "journal" */
  journal_stream: Array<Journal>;
  /** fetch data from the table: "journal_voucher_entries" */
  journal_voucher_entries: Array<Journal_Voucher_Entries>;
  /** fetch aggregated fields from the table: "journal_voucher_entries" */
  journal_voucher_entries_aggregate: Journal_Voucher_Entries_Aggregate;
  /** fetch data from the table in a streaming manner: "journal_voucher_entries" */
  journal_voucher_entries_stream: Array<Journal_Voucher_Entries>;
  /** fetch data from the table: "keto_relation_tuples" */
  keto_relation_tuples: Array<Keto_Relation_Tuples>;
  /** fetch aggregated fields from the table: "keto_relation_tuples" */
  keto_relation_tuples_aggregate: Keto_Relation_Tuples_Aggregate;
  /** fetch data from the table: "keto_relation_tuples" using primary key columns */
  keto_relation_tuples_by_pk?: Maybe<Keto_Relation_Tuples>;
  /** fetch data from the table in a streaming manner: "keto_relation_tuples" */
  keto_relation_tuples_stream: Array<Keto_Relation_Tuples>;
  /** fetch data from the table: "keto_uuid_mappings" */
  keto_uuid_mappings: Array<Keto_Uuid_Mappings>;
  /** fetch aggregated fields from the table: "keto_uuid_mappings" */
  keto_uuid_mappings_aggregate: Keto_Uuid_Mappings_Aggregate;
  /** fetch data from the table: "keto_uuid_mappings" using primary key columns */
  keto_uuid_mappings_by_pk?: Maybe<Keto_Uuid_Mappings>;
  /** fetch data from the table in a streaming manner: "keto_uuid_mappings" */
  keto_uuid_mappings_stream: Array<Keto_Uuid_Mappings>;
  /** fetch data from the table: "loan" */
  loan: Array<Loan>;
  /** fetch aggregated fields from the table: "loan" */
  loan_aggregate: Loan_Aggregate;
  /** fetch data from the table: "loan" using primary key columns */
  loan_by_pk?: Maybe<Loan>;
  /** fetch data from the table: "loan_schedule" */
  loan_schedule: Array<Loan_Schedule>;
  /** fetch aggregated fields from the table: "loan_schedule" */
  loan_schedule_aggregate: Loan_Schedule_Aggregate;
  /** fetch data from the table: "loan_schedule" using primary key columns */
  loan_schedule_by_pk?: Maybe<Loan_Schedule>;
  /** fetch data from the table in a streaming manner: "loan_schedule" */
  loan_schedule_stream: Array<Loan_Schedule>;
  /** fetch data from the table: "loan_status" */
  loan_status: Array<Loan_Status>;
  /** fetch aggregated fields from the table: "loan_status" */
  loan_status_aggregate: Loan_Status_Aggregate;
  /** fetch data from the table: "loan_status" using primary key columns */
  loan_status_by_pk?: Maybe<Loan_Status>;
  /** fetch data from the table in a streaming manner: "loan_status" */
  loan_status_stream: Array<Loan_Status>;
  /** fetch data from the table in a streaming manner: "loan" */
  loan_stream: Array<Loan>;
  /** fetch data from the table: "merchant_payment" */
  merchant_payment: Array<Merchant_Payment>;
  /** fetch aggregated fields from the table: "merchant_payment" */
  merchant_payment_aggregate: Merchant_Payment_Aggregate;
  /** fetch data from the table: "merchant_payment" using primary key columns */
  merchant_payment_by_pk?: Maybe<Merchant_Payment>;
  /** fetch data from the table in a streaming manner: "merchant_payment" */
  merchant_payment_stream: Array<Merchant_Payment>;
  /** fetch data from the table: "merchant_transaction_slip" */
  merchant_transaction_slip: Array<Merchant_Transaction_Slip>;
  /** fetch aggregated fields from the table: "merchant_transaction_slip" */
  merchant_transaction_slip_aggregate: Merchant_Transaction_Slip_Aggregate;
  /** fetch data from the table: "merchant_transaction_slip" using primary key columns */
  merchant_transaction_slip_by_pk?: Maybe<Merchant_Transaction_Slip>;
  /** fetch data from the table in a streaming manner: "merchant_transaction_slip" */
  merchant_transaction_slip_stream: Array<Merchant_Transaction_Slip>;
  /** fetch data from the table: "partner" */
  partner: Array<Partner>;
  /** fetch aggregated fields from the table: "partner" */
  partner_aggregate: Partner_Aggregate;
  /** fetch data from the table: "partner_bank_account" */
  partner_bank_account: Array<Partner_Bank_Account>;
  /** fetch aggregated fields from the table: "partner_bank_account" */
  partner_bank_account_aggregate: Partner_Bank_Account_Aggregate;
  /** fetch data from the table: "partner_bank_account" using primary key columns */
  partner_bank_account_by_pk?: Maybe<Partner_Bank_Account>;
  /** fetch data from the table in a streaming manner: "partner_bank_account" */
  partner_bank_account_stream: Array<Partner_Bank_Account>;
  /** fetch data from the table: "partner_branch" */
  partner_branch: Array<Partner_Branch>;
  /** fetch aggregated fields from the table: "partner_branch" */
  partner_branch_aggregate: Partner_Branch_Aggregate;
  /** fetch data from the table: "partner_branch" using primary key columns */
  partner_branch_by_pk?: Maybe<Partner_Branch>;
  /** fetch data from the table in a streaming manner: "partner_branch" */
  partner_branch_stream: Array<Partner_Branch>;
  /** fetch data from the table: "partner" using primary key columns */
  partner_by_pk?: Maybe<Partner>;
  /** fetch data from the table in a streaming manner: "partner" */
  partner_stream: Array<Partner>;
  /** fetch data from the table: "partner_top" */
  partner_top: Array<Partner_Top>;
  /** fetch aggregated fields from the table: "partner_top" */
  partner_top_aggregate: Partner_Top_Aggregate;
  /** fetch data from the table: "partner_top" using primary key columns */
  partner_top_by_pk?: Maybe<Partner_Top>;
  /** fetch data from the table in a streaming manner: "partner_top" */
  partner_top_stream: Array<Partner_Top>;
  /** fetch data from the table: "partner_user_profile" */
  partner_user_profile: Array<Partner_User_Profile>;
  /** fetch aggregated fields from the table: "partner_user_profile" */
  partner_user_profile_aggregate: Partner_User_Profile_Aggregate;
  /** fetch data from the table: "partner_user_profile" using primary key columns */
  partner_user_profile_by_pk?: Maybe<Partner_User_Profile>;
  /** fetch data from the table in a streaming manner: "partner_user_profile" */
  partner_user_profile_stream: Array<Partner_User_Profile>;
  /** fetch data from the table: "party_account" */
  party_account: Array<Party_Account>;
  /** fetch aggregated fields from the table: "party_account" */
  party_account_aggregate: Party_Account_Aggregate;
  /** fetch data from the table: "party_account" using primary key columns */
  party_account_by_pk?: Maybe<Party_Account>;
  /** fetch data from the table in a streaming manner: "party_account" */
  party_account_stream: Array<Party_Account>;
  /** fetch data from the table: "payments.adjustment" */
  payments_adjustment: Array<Payments_Adjustment>;
  /** fetch aggregated fields from the table: "payments.adjustment" */
  payments_adjustment_aggregate: Payments_Adjustment_Aggregate;
  /** fetch data from the table: "payments.adjustment" using primary key columns */
  payments_adjustment_by_pk?: Maybe<Payments_Adjustment>;
  /** fetch data from the table in a streaming manner: "payments.adjustment" */
  payments_adjustment_stream: Array<Payments_Adjustment>;
  /** fetch data from the table: "payments.metadata" */
  payments_metadata: Array<Payments_Metadata>;
  /** fetch aggregated fields from the table: "payments.metadata" */
  payments_metadata_aggregate: Payments_Metadata_Aggregate;
  /** fetch data from the table: "payments.metadata" using primary key columns */
  payments_metadata_by_pk?: Maybe<Payments_Metadata>;
  /** fetch data from the table in a streaming manner: "payments.metadata" */
  payments_metadata_stream: Array<Payments_Metadata>;
  /** fetch data from the table: "payments.payment" */
  payments_payment: Array<Payments_Payment>;
  /** fetch aggregated fields from the table: "payments.payment" */
  payments_payment_aggregate: Payments_Payment_Aggregate;
  /** fetch data from the table: "payments.payment" using primary key columns */
  payments_payment_by_pk?: Maybe<Payments_Payment>;
  /** fetch data from the table in a streaming manner: "payments.payment" */
  payments_payment_stream: Array<Payments_Payment>;
  /** fetch data from the table: "payments.transfers" */
  payments_transfers: Array<Payments_Transfers>;
  /** fetch aggregated fields from the table: "payments.transfers" */
  payments_transfers_aggregate: Payments_Transfers_Aggregate;
  /** fetch data from the table: "payments.transfers" using primary key columns */
  payments_transfers_by_pk?: Maybe<Payments_Transfers>;
  /** fetch data from the table in a streaming manner: "payments.transfers" */
  payments_transfers_stream: Array<Payments_Transfers>;
  /** fetch data from the table: "registry_payment" */
  registry_payment: Array<Registry_Payment>;
  /** fetch aggregated fields from the table: "registry_payment" */
  registry_payment_aggregate: Registry_Payment_Aggregate;
  /** fetch data from the table: "registry_payment" using primary key columns */
  registry_payment_by_pk?: Maybe<Registry_Payment>;
  /** fetch data from the table in a streaming manner: "registry_payment" */
  registry_payment_stream: Array<Registry_Payment>;
  /** fetch data from the table: "session_baskets" */
  session_baskets: Array<Session_Baskets>;
  /** fetch aggregated fields from the table: "session_baskets" */
  session_baskets_aggregate: Session_Baskets_Aggregate;
  /** fetch data from the table: "session_baskets" using primary key columns */
  session_baskets_by_pk?: Maybe<Session_Baskets>;
  /** fetch data from the table in a streaming manner: "session_baskets" */
  session_baskets_stream: Array<Session_Baskets>;
  /** fetch data from the table: "transfers.transfer_initiation" */
  transfers_transfer_initiation: Array<Transfers_Transfer_Initiation>;
  /** fetch data from the table: "transfers.transfer_initiation_adjustments" */
  transfers_transfer_initiation_adjustments: Array<Transfers_Transfer_Initiation_Adjustments>;
  /** fetch aggregated fields from the table: "transfers.transfer_initiation_adjustments" */
  transfers_transfer_initiation_adjustments_aggregate: Transfers_Transfer_Initiation_Adjustments_Aggregate;
  /** fetch data from the table: "transfers.transfer_initiation_adjustments" using primary key columns */
  transfers_transfer_initiation_adjustments_by_pk?: Maybe<Transfers_Transfer_Initiation_Adjustments>;
  /** fetch data from the table in a streaming manner: "transfers.transfer_initiation_adjustments" */
  transfers_transfer_initiation_adjustments_stream: Array<Transfers_Transfer_Initiation_Adjustments>;
  /** fetch aggregated fields from the table: "transfers.transfer_initiation" */
  transfers_transfer_initiation_aggregate: Transfers_Transfer_Initiation_Aggregate;
  /** fetch data from the table: "transfers.transfer_initiation" using primary key columns */
  transfers_transfer_initiation_by_pk?: Maybe<Transfers_Transfer_Initiation>;
  /** fetch data from the table: "transfers.transfer_initiation_payments" */
  transfers_transfer_initiation_payments: Array<Transfers_Transfer_Initiation_Payments>;
  /** fetch aggregated fields from the table: "transfers.transfer_initiation_payments" */
  transfers_transfer_initiation_payments_aggregate: Transfers_Transfer_Initiation_Payments_Aggregate;
  /** fetch data from the table: "transfers.transfer_initiation_payments" using primary key columns */
  transfers_transfer_initiation_payments_by_pk?: Maybe<Transfers_Transfer_Initiation_Payments>;
  /** fetch data from the table in a streaming manner: "transfers.transfer_initiation_payments" */
  transfers_transfer_initiation_payments_stream: Array<Transfers_Transfer_Initiation_Payments>;
  /** fetch data from the table in a streaming manner: "transfers.transfer_initiation" */
  transfers_transfer_initiation_stream: Array<Transfers_Transfer_Initiation>;
  /** fetch data from the table: "transfers.transfer_reversal" */
  transfers_transfer_reversal: Array<Transfers_Transfer_Reversal>;
  /** fetch aggregated fields from the table: "transfers.transfer_reversal" */
  transfers_transfer_reversal_aggregate: Transfers_Transfer_Reversal_Aggregate;
  /** fetch data from the table: "transfers.transfer_reversal" using primary key columns */
  transfers_transfer_reversal_by_pk?: Maybe<Transfers_Transfer_Reversal>;
  /** fetch data from the table in a streaming manner: "transfers.transfer_reversal" */
  transfers_transfer_reversal_stream: Array<Transfers_Transfer_Reversal>;
};

export type Subscription_RootAccounts_AccountArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Account_Order_By>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

export type Subscription_RootAccounts_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Account_Order_By>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

export type Subscription_RootAccounts_Account_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootAccounts_Account_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Accounts_Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Account_Bool_Exp>;
};

export type Subscription_RootAccounts_BalancesArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Balances_Order_By>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

export type Subscription_RootAccounts_Balances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Balances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Balances_Order_By>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

export type Subscription_RootAccounts_Balances_By_PkArgs = {
  account_id: Scalars['String']['input'];
  created_at: Scalars['timestamptz']['input'];
  currency: Scalars['String']['input'];
};

export type Subscription_RootAccounts_Balances_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Accounts_Balances_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Balances_Bool_Exp>;
};

export type Subscription_RootAccounts_Bank_AccountArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
};

export type Subscription_RootAccounts_Bank_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
};

export type Subscription_RootAccounts_Bank_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootAccounts_Bank_Account_Related_AccountsArgs = {
  distinct_on?: InputMaybe<
    Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Bank_Account_Related_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_Bank_Account_Related_Accounts_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Accounts_Bank_Account_Related_Accounts_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<
      Array<Accounts_Bank_Account_Related_Accounts_Order_By>
    >;
    where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  };

export type Subscription_RootAccounts_Bank_Account_Related_Accounts_By_PkArgs =
  {
    id: Scalars['uuid']['input'];
  };

export type Subscription_RootAccounts_Bank_Account_Related_Accounts_StreamArgs =
  {
    batch_size: Scalars['Int']['input'];
    cursor: Array<
      InputMaybe<Accounts_Bank_Account_Related_Accounts_Stream_Cursor_Input>
    >;
    where?: InputMaybe<Accounts_Bank_Account_Related_Accounts_Bool_Exp>;
  };

export type Subscription_RootAccounts_Bank_Account_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Accounts_Bank_Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Bank_Account_Bool_Exp>;
};

export type Subscription_RootAccounts_Pool_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_Pool_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pool_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pool_Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_Pool_Accounts_By_PkArgs = {
  account_id: Scalars['String']['input'];
  pool_id: Scalars['uuid']['input'];
};

export type Subscription_RootAccounts_Pool_Accounts_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Accounts_Pool_Accounts_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Pool_Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_PoolsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pools_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pools_Order_By>>;
  where?: InputMaybe<Accounts_Pools_Bool_Exp>;
};

export type Subscription_RootAccounts_Pools_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Pools_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Accounts_Pools_Order_By>>;
  where?: InputMaybe<Accounts_Pools_Bool_Exp>;
};

export type Subscription_RootAccounts_Pools_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootAccounts_Pools_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Accounts_Pools_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Pools_Bool_Exp>;
};

export type Subscription_RootAreasArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

export type Subscription_RootAreas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Areas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Areas_Order_By>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

export type Subscription_RootAreas_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootAreas_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Areas_Stream_Cursor_Input>>;
  where?: InputMaybe<Areas_Bool_Exp>;
};

export type Subscription_RootAudit_LogsArgs = {
  distinct_on?: InputMaybe<Array<Audit_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Logs_Order_By>>;
  where?: InputMaybe<Audit_Logs_Bool_Exp>;
};

export type Subscription_RootAudit_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Audit_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Logs_Order_By>>;
  where?: InputMaybe<Audit_Logs_Bool_Exp>;
};

export type Subscription_RootAudit_Logs_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Audit_Logs_Stream_Cursor_Input>>;
  where?: InputMaybe<Audit_Logs_Bool_Exp>;
};

export type Subscription_RootCheckout_BasketsArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Baskets_Order_By>>;
  where?: InputMaybe<Checkout_Baskets_Bool_Exp>;
};

export type Subscription_RootCheckout_Baskets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Baskets_Order_By>>;
  where?: InputMaybe<Checkout_Baskets_Bool_Exp>;
};

export type Subscription_RootCheckout_Baskets_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootCheckout_Baskets_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Checkout_Baskets_Stream_Cursor_Input>>;
  where?: InputMaybe<Checkout_Baskets_Bool_Exp>;
};

export type Subscription_RootCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

export type Subscription_RootCities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

export type Subscription_RootCities_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootCities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cities_Stream_Cursor_Input>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

export type Subscription_RootCommandArgs = {
  distinct_on?: InputMaybe<Array<Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Command_Order_By>>;
  where?: InputMaybe<Command_Bool_Exp>;
};

export type Subscription_RootCommand_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Command_Order_By>>;
  where?: InputMaybe<Command_Bool_Exp>;
};

export type Subscription_RootCommand_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootCommand_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Command_Stream_Cursor_Input>>;
  where?: InputMaybe<Command_Bool_Exp>;
};

export type Subscription_RootCommercial_OfferArgs = {
  distinct_on?: InputMaybe<Array<Commercial_Offer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Commercial_Offer_Order_By>>;
  where?: InputMaybe<Commercial_Offer_Bool_Exp>;
};

export type Subscription_RootCommercial_Offer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Commercial_Offer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Commercial_Offer_Order_By>>;
  where?: InputMaybe<Commercial_Offer_Bool_Exp>;
};

export type Subscription_RootCommercial_Offer_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootCommercial_Offer_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Commercial_Offer_Stream_Cursor_Input>>;
  where?: InputMaybe<Commercial_Offer_Bool_Exp>;
};

export type Subscription_RootConnectors_ConnectorArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Connector_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Connector_Order_By>>;
  where?: InputMaybe<Connectors_Connector_Bool_Exp>;
};

export type Subscription_RootConnectors_Connector_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Connector_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Connector_Order_By>>;
  where?: InputMaybe<Connectors_Connector_Bool_Exp>;
};

export type Subscription_RootConnectors_Connector_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootConnectors_Connector_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Connectors_Connector_Stream_Cursor_Input>>;
  where?: InputMaybe<Connectors_Connector_Bool_Exp>;
};

export type Subscription_RootConnectors_WebhookArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Webhook_Order_By>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

export type Subscription_RootConnectors_Webhook_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Connectors_Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Connectors_Webhook_Order_By>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

export type Subscription_RootConnectors_Webhook_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootConnectors_Webhook_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Connectors_Webhook_Stream_Cursor_Input>>;
  where?: InputMaybe<Connectors_Webhook_Bool_Exp>;
};

export type Subscription_RootConsumersArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Order_By>>;
  where?: InputMaybe<Consumers_Bool_Exp>;
};

export type Subscription_RootConsumers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Order_By>>;
  where?: InputMaybe<Consumers_Bool_Exp>;
};

export type Subscription_RootConsumers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootConsumers_Credit_LimitsArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Credit_Limits_Order_By>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

export type Subscription_RootConsumers_Credit_Limits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumers_Credit_Limits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Consumers_Credit_Limits_Order_By>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

export type Subscription_RootConsumers_Credit_Limits_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootConsumers_Credit_Limits_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Consumers_Credit_Limits_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumers_Credit_Limits_Bool_Exp>;
};

export type Subscription_RootConsumers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Consumers_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumers_Bool_Exp>;
};

export type Subscription_RootEntryArgs = {
  distinct_on?: InputMaybe<Array<Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Entry_Order_By>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

export type Subscription_RootEntry_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Entry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Entry_Order_By>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

export type Subscription_RootEntry_By_PkArgs = {
  id: Scalars['bigint']['input'];
};

export type Subscription_RootEntry_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Entry_Stream_Cursor_Input>>;
  where?: InputMaybe<Entry_Bool_Exp>;
};

export type Subscription_RootGovernoratesArgs = {
  distinct_on?: InputMaybe<Array<Governorates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Governorates_Order_By>>;
  where?: InputMaybe<Governorates_Bool_Exp>;
};

export type Subscription_RootGovernorates_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Governorates_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Governorates_Order_By>>;
  where?: InputMaybe<Governorates_Bool_Exp>;
};

export type Subscription_RootGovernorates_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootGovernorates_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Governorates_Stream_Cursor_Input>>;
  where?: InputMaybe<Governorates_Bool_Exp>;
};

export type Subscription_RootIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

export type Subscription_RootIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identities_Order_By>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

export type Subscription_RootIdentities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootIdentities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Identities_Stream_Cursor_Input>>;
  where?: InputMaybe<Identities_Bool_Exp>;
};

export type Subscription_RootIdentity_Verifiable_AddressesArgs = {
  distinct_on?: InputMaybe<Array<Identity_Verifiable_Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identity_Verifiable_Addresses_Order_By>>;
  where?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
};

export type Subscription_RootIdentity_Verifiable_Addresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Verifiable_Addresses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Identity_Verifiable_Addresses_Order_By>>;
  where?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
};

export type Subscription_RootIdentity_Verifiable_Addresses_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootIdentity_Verifiable_Addresses_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Identity_Verifiable_Addresses_Stream_Cursor_Input>>;
  where?: InputMaybe<Identity_Verifiable_Addresses_Bool_Exp>;
};

export type Subscription_RootJournalArgs = {
  distinct_on?: InputMaybe<Array<Journal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Order_By>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

export type Subscription_RootJournal_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Order_By>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

export type Subscription_RootJournal_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootJournal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Journal_Stream_Cursor_Input>>;
  where?: InputMaybe<Journal_Bool_Exp>;
};

export type Subscription_RootJournal_Voucher_EntriesArgs = {
  distinct_on?: InputMaybe<Array<Journal_Voucher_Entries_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Voucher_Entries_Order_By>>;
  where?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
};

export type Subscription_RootJournal_Voucher_Entries_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Journal_Voucher_Entries_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Journal_Voucher_Entries_Order_By>>;
  where?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
};

export type Subscription_RootJournal_Voucher_Entries_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Journal_Voucher_Entries_Stream_Cursor_Input>>;
  where?: InputMaybe<Journal_Voucher_Entries_Bool_Exp>;
};

export type Subscription_RootKeto_Relation_TuplesArgs = {
  distinct_on?: InputMaybe<Array<Keto_Relation_Tuples_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Relation_Tuples_Order_By>>;
  where?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
};

export type Subscription_RootKeto_Relation_Tuples_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Keto_Relation_Tuples_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Relation_Tuples_Order_By>>;
  where?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
};

export type Subscription_RootKeto_Relation_Tuples_By_PkArgs = {
  nid: Scalars['uuid']['input'];
  shard_id: Scalars['uuid']['input'];
};

export type Subscription_RootKeto_Relation_Tuples_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Keto_Relation_Tuples_Stream_Cursor_Input>>;
  where?: InputMaybe<Keto_Relation_Tuples_Bool_Exp>;
};

export type Subscription_RootKeto_Uuid_MappingsArgs = {
  distinct_on?: InputMaybe<Array<Keto_Uuid_Mappings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Uuid_Mappings_Order_By>>;
  where?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
};

export type Subscription_RootKeto_Uuid_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Keto_Uuid_Mappings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Keto_Uuid_Mappings_Order_By>>;
  where?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
};

export type Subscription_RootKeto_Uuid_Mappings_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootKeto_Uuid_Mappings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Keto_Uuid_Mappings_Stream_Cursor_Input>>;
  where?: InputMaybe<Keto_Uuid_Mappings_Bool_Exp>;
};

export type Subscription_RootLoanArgs = {
  distinct_on?: InputMaybe<Array<Loan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Order_By>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

export type Subscription_RootLoan_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Order_By>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

export type Subscription_RootLoan_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootLoan_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Schedule_Order_By>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

export type Subscription_RootLoan_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Schedule_Order_By>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

export type Subscription_RootLoan_Schedule_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootLoan_Schedule_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Loan_Schedule_Stream_Cursor_Input>>;
  where?: InputMaybe<Loan_Schedule_Bool_Exp>;
};

export type Subscription_RootLoan_StatusArgs = {
  distinct_on?: InputMaybe<Array<Loan_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Status_Order_By>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

export type Subscription_RootLoan_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Loan_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Loan_Status_Order_By>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

export type Subscription_RootLoan_Status_By_PkArgs = {
  loan_id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type Subscription_RootLoan_Status_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Loan_Status_Stream_Cursor_Input>>;
  where?: InputMaybe<Loan_Status_Bool_Exp>;
};

export type Subscription_RootLoan_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Loan_Stream_Cursor_Input>>;
  where?: InputMaybe<Loan_Bool_Exp>;
};

export type Subscription_RootMerchant_PaymentArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Payment_Order_By>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

export type Subscription_RootMerchant_Payment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Payment_Order_By>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

export type Subscription_RootMerchant_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootMerchant_Payment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Merchant_Payment_Stream_Cursor_Input>>;
  where?: InputMaybe<Merchant_Payment_Bool_Exp>;
};

export type Subscription_RootMerchant_Transaction_SlipArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Transaction_Slip_Order_By>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

export type Subscription_RootMerchant_Transaction_Slip_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Merchant_Transaction_Slip_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Merchant_Transaction_Slip_Order_By>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

export type Subscription_RootMerchant_Transaction_Slip_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootMerchant_Transaction_Slip_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Merchant_Transaction_Slip_Stream_Cursor_Input>>;
  where?: InputMaybe<Merchant_Transaction_Slip_Bool_Exp>;
};

export type Subscription_RootPartnerArgs = {
  distinct_on?: InputMaybe<Array<Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Order_By>>;
  where?: InputMaybe<Partner_Bool_Exp>;
};

export type Subscription_RootPartner_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Order_By>>;
  where?: InputMaybe<Partner_Bool_Exp>;
};

export type Subscription_RootPartner_Bank_AccountArgs = {
  distinct_on?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Bank_Account_Order_By>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

export type Subscription_RootPartner_Bank_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Bank_Account_Order_By>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

export type Subscription_RootPartner_Bank_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPartner_Bank_Account_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Partner_Bank_Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Partner_Bank_Account_Bool_Exp>;
};

export type Subscription_RootPartner_BranchArgs = {
  distinct_on?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Branch_Order_By>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

export type Subscription_RootPartner_Branch_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Branch_Order_By>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

export type Subscription_RootPartner_Branch_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPartner_Branch_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Partner_Branch_Stream_Cursor_Input>>;
  where?: InputMaybe<Partner_Branch_Bool_Exp>;
};

export type Subscription_RootPartner_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPartner_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Partner_Stream_Cursor_Input>>;
  where?: InputMaybe<Partner_Bool_Exp>;
};

export type Subscription_RootPartner_TopArgs = {
  distinct_on?: InputMaybe<Array<Partner_Top_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Top_Order_By>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

export type Subscription_RootPartner_Top_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Top_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_Top_Order_By>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

export type Subscription_RootPartner_Top_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPartner_Top_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Partner_Top_Stream_Cursor_Input>>;
  where?: InputMaybe<Partner_Top_Bool_Exp>;
};

export type Subscription_RootPartner_User_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_User_Profile_Order_By>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

export type Subscription_RootPartner_User_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Partner_User_Profile_Order_By>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

export type Subscription_RootPartner_User_Profile_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPartner_User_Profile_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Partner_User_Profile_Stream_Cursor_Input>>;
  where?: InputMaybe<Partner_User_Profile_Bool_Exp>;
};

export type Subscription_RootParty_AccountArgs = {
  distinct_on?: InputMaybe<Array<Party_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Party_Account_Order_By>>;
  where?: InputMaybe<Party_Account_Bool_Exp>;
};

export type Subscription_RootParty_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Party_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Party_Account_Order_By>>;
  where?: InputMaybe<Party_Account_Bool_Exp>;
};

export type Subscription_RootParty_Account_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootParty_Account_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Party_Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Party_Account_Bool_Exp>;
};

export type Subscription_RootPayments_AdjustmentArgs = {
  distinct_on?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Adjustment_Order_By>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

export type Subscription_RootPayments_Adjustment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Adjustment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Adjustment_Order_By>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

export type Subscription_RootPayments_Adjustment_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPayments_Adjustment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Payments_Adjustment_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Adjustment_Bool_Exp>;
};

export type Subscription_RootPayments_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Metadata_Order_By>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

export type Subscription_RootPayments_Metadata_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Metadata_Order_By>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

export type Subscription_RootPayments_Metadata_By_PkArgs = {
  key: Scalars['String']['input'];
  payment_id: Scalars['String']['input'];
};

export type Subscription_RootPayments_Metadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Payments_Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Metadata_Bool_Exp>;
};

export type Subscription_RootPayments_PaymentArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

export type Subscription_RootPayments_Payment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Payment_Order_By>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

export type Subscription_RootPayments_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootPayments_Payment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Payments_Payment_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Payment_Bool_Exp>;
};

export type Subscription_RootPayments_TransfersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Transfers_Order_By>>;
  where?: InputMaybe<Payments_Transfers_Bool_Exp>;
};

export type Subscription_RootPayments_Transfers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Transfers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Payments_Transfers_Order_By>>;
  where?: InputMaybe<Payments_Transfers_Bool_Exp>;
};

export type Subscription_RootPayments_Transfers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPayments_Transfers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Payments_Transfers_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Transfers_Bool_Exp>;
};

export type Subscription_RootRegistry_PaymentArgs = {
  distinct_on?: InputMaybe<Array<Registry_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Registry_Payment_Order_By>>;
  where?: InputMaybe<Registry_Payment_Bool_Exp>;
};

export type Subscription_RootRegistry_Payment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Registry_Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Registry_Payment_Order_By>>;
  where?: InputMaybe<Registry_Payment_Bool_Exp>;
};

export type Subscription_RootRegistry_Payment_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootRegistry_Payment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Registry_Payment_Stream_Cursor_Input>>;
  where?: InputMaybe<Registry_Payment_Bool_Exp>;
};

export type Subscription_RootSession_BasketsArgs = {
  distinct_on?: InputMaybe<Array<Session_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Session_Baskets_Order_By>>;
  where?: InputMaybe<Session_Baskets_Bool_Exp>;
};

export type Subscription_RootSession_Baskets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Session_Baskets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Session_Baskets_Order_By>>;
  where?: InputMaybe<Session_Baskets_Bool_Exp>;
};

export type Subscription_RootSession_Baskets_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootSession_Baskets_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Session_Baskets_Stream_Cursor_Input>>;
  where?: InputMaybe<Session_Baskets_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_InitiationArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_Initiation_AdjustmentsArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Adjustments_Order_By>
  >;
  where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_Initiation_Adjustments_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Order_By>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
  };

export type Subscription_RootTransfers_Transfer_Initiation_Adjustments_By_PkArgs =
  {
    id: Scalars['uuid']['input'];
  };

export type Subscription_RootTransfers_Transfer_Initiation_Adjustments_StreamArgs =
  {
    batch_size: Scalars['Int']['input'];
    cursor: Array<
      InputMaybe<Transfers_Transfer_Initiation_Adjustments_Stream_Cursor_Input>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
  };

export type Subscription_RootTransfers_Transfer_Initiation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_Initiation_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootTransfers_Transfer_Initiation_PaymentsArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Payments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Payments_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_Initiation_Payments_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Payments_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Payments_Order_By>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
  };

export type Subscription_RootTransfers_Transfer_Initiation_Payments_By_PkArgs =
  {
    payment_id: Scalars['String']['input'];
    transfer_initiation_id: Scalars['String']['input'];
  };

export type Subscription_RootTransfers_Transfer_Initiation_Payments_StreamArgs =
  {
    batch_size: Scalars['Int']['input'];
    cursor: Array<
      InputMaybe<Transfers_Transfer_Initiation_Payments_Stream_Cursor_Input>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
  };

export type Subscription_RootTransfers_Transfer_Initiation_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Transfers_Transfer_Initiation_Stream_Cursor_Input>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_ReversalArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_Reversal_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

export type Subscription_RootTransfers_Transfer_Reversal_By_PkArgs = {
  id: Scalars['String']['input'];
};

export type Subscription_RootTransfers_Transfer_Reversal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Transfers_Transfer_Reversal_Stream_Cursor_Input>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** Boolean expression to compare columns of type "transfer_status". All fields are combined with logical 'AND'. */
export type Transfer_Status_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['transfer_status']['input']>;
  _gt?: InputMaybe<Scalars['transfer_status']['input']>;
  _gte?: InputMaybe<Scalars['transfer_status']['input']>;
  _in?: InputMaybe<Array<Scalars['transfer_status']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['transfer_status']['input']>;
  _lte?: InputMaybe<Scalars['transfer_status']['input']>;
  _neq?: InputMaybe<Scalars['transfer_status']['input']>;
  _nin?: InputMaybe<Array<Scalars['transfer_status']['input']>>;
};

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation = {
  __typename?: 'transfers_transfer_initiation';
  /** An object relationship */
  account: Accounts_Account;
  /** An object relationship */
  accountBySourceAccountId?: Maybe<Accounts_Account>;
  amount: Scalars['numeric']['output'];
  asset: Scalars['String']['output'];
  attempts: Scalars['Int']['output'];
  /** An object relationship */
  connector: Connectors_Connector;
  connector_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  destination_account_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  initial_amount: Scalars['numeric']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  provider: Scalars['connector_provider']['output'];
  scheduled_at?: Maybe<Scalars['timestamptz']['output']>;
  source_account_id?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  transfer_initiation_adjustments: Array<Transfers_Transfer_Initiation_Adjustments>;
  /** An aggregate relationship */
  transfer_initiation_adjustments_aggregate: Transfers_Transfer_Initiation_Adjustments_Aggregate;
  /** An array relationship */
  transfer_initiation_payments: Array<Transfers_Transfer_Initiation_Payments>;
  /** An aggregate relationship */
  transfer_initiation_payments_aggregate: Transfers_Transfer_Initiation_Payments_Aggregate;
  /** An array relationship */
  transfer_reversals: Array<Transfers_Transfer_Reversal>;
  /** An aggregate relationship */
  transfer_reversals_aggregate: Transfers_Transfer_Reversal_Aggregate;
  type: Scalars['Int']['output'];
};

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationTransfer_Initiation_AdjustmentsArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Adjustments_Order_By>
  >;
  where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
};

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationTransfer_Initiation_Adjustments_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Order_By>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
  };

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationTransfer_Initiation_PaymentsArgs = {
  distinct_on?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Payments_Select_Column>
  >;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Initiation_Payments_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
};

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationTransfer_Initiation_Payments_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Payments_Select_Column>
    >;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order_by?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Payments_Order_By>
    >;
    where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
  };

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationTransfer_ReversalsArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

/** columns and relationships of "transfers.transfer_initiation" */
export type Transfers_Transfer_InitiationTransfer_Reversals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transfers_Transfer_Reversal_Order_By>>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

/** columns and relationships of "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments = {
  __typename?: 'transfers_transfer_initiation_adjustments';
  created_at: Scalars['timestamptz']['output'];
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  status: Scalars['Int']['output'];
  /** An object relationship */
  transfer_initiation: Transfers_Transfer_Initiation;
  transfer_initiation_id: Scalars['String']['output'];
};

/** columns and relationships of "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_AdjustmentsMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Aggregate = {
  __typename?: 'transfers_transfer_initiation_adjustments_aggregate';
  aggregate?: Maybe<Transfers_Transfer_Initiation_Adjustments_Aggregate_Fields>;
  nodes: Array<Transfers_Transfer_Initiation_Adjustments>;
};

export type Transfers_Transfer_Initiation_Adjustments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Aggregate_Bool_Exp_Count>;
};

export type Transfers_Transfer_Initiation_Adjustments_Aggregate_Bool_Exp_Count =
  {
    arguments?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
    >;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
    filter?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
    predicate: Int_Comparison_Exp;
  };

/** aggregate fields of "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Aggregate_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_aggregate_fields';
  avg?: Maybe<Transfers_Transfer_Initiation_Adjustments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Transfers_Transfer_Initiation_Adjustments_Max_Fields>;
  min?: Maybe<Transfers_Transfer_Initiation_Adjustments_Min_Fields>;
  stddev?: Maybe<Transfers_Transfer_Initiation_Adjustments_Stddev_Fields>;
  stddev_pop?: Maybe<Transfers_Transfer_Initiation_Adjustments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transfers_Transfer_Initiation_Adjustments_Stddev_Samp_Fields>;
  sum?: Maybe<Transfers_Transfer_Initiation_Adjustments_Sum_Fields>;
  var_pop?: Maybe<Transfers_Transfer_Initiation_Adjustments_Var_Pop_Fields>;
  var_samp?: Maybe<Transfers_Transfer_Initiation_Adjustments_Var_Samp_Fields>;
  variance?: Maybe<Transfers_Transfer_Initiation_Adjustments_Variance_Fields>;
};

/** aggregate fields of "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Aggregate_FieldsCountArgs =
  {
    columns?: InputMaybe<
      Array<Transfers_Transfer_Initiation_Adjustments_Select_Column>
    >;
    distinct?: InputMaybe<Scalars['Boolean']['input']>;
  };

/** order by aggregate values of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Aggregate_Order_By = {
  avg?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Max_Order_By>;
  min?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Min_Order_By>;
  stddev?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Sum_Order_By>;
  var_pop?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Var_Samp_Order_By>;
  variance?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Transfers_Transfer_Initiation_Adjustments_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Arr_Rel_Insert_Input = {
  data: Array<Transfers_Transfer_Initiation_Adjustments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_On_Conflict>;
};

/** aggregate avg on columns */
export type Transfers_Transfer_Initiation_Adjustments_Avg_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_avg_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Avg_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "transfers.transfer_initiation_adjustments". All fields are combined with a logical 'AND'. */
export type Transfers_Transfer_Initiation_Adjustments_Bool_Exp = {
  _and?: InputMaybe<Array<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>>;
  _not?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
  _or?: InputMaybe<Array<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  transfer_initiation_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "transfers.transfer_initiation_adjustments" */
export enum Transfers_Transfer_Initiation_Adjustments_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransferInitiationAdjustmentsPk = 'transfer_initiation_adjustments_pk',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Transfers_Transfer_Initiation_Adjustments_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Transfers_Transfer_Initiation_Adjustments_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Transfers_Transfer_Initiation_Adjustments_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Inc_Input = {
  status?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Obj_Rel_Insert_Input>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Transfers_Transfer_Initiation_Adjustments_Max_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  transfer_initiation_id?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transfers_Transfer_Initiation_Adjustments_Min_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  transfer_initiation_id?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Mutation_Response = {
  __typename?: 'transfers_transfer_initiation_adjustments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Transfers_Transfer_Initiation_Adjustments>;
};

/** on_conflict condition type for table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_On_Conflict = {
  constraint: Transfers_Transfer_Initiation_Adjustments_Constraint;
  update_columns?: Array<Transfers_Transfer_Initiation_Adjustments_Update_Column>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
};

/** Ordering options when selecting data from "transfers.transfer_initiation_adjustments". */
export type Transfers_Transfer_Initiation_Adjustments_Order_By = {
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transfers.transfer_initiation_adjustments */
export type Transfers_Transfer_Initiation_Adjustments_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Transfers_Transfer_Initiation_Adjustments_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "transfers.transfer_initiation_adjustments" */
export enum Transfers_Transfer_Initiation_Adjustments_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Status = 'status',
  /** column name */
  TransferInitiationId = 'transfer_initiation_id',
}

/** input type for updating data in table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Transfers_Transfer_Initiation_Adjustments_Stddev_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_stddev_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Stddev_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transfers_Transfer_Initiation_Adjustments_Stddev_Pop_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_stddev_pop_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transfers_Transfer_Initiation_Adjustments_Stddev_Samp_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_stddev_samp_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "transfers_transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transfers_Transfer_Initiation_Adjustments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transfers_Transfer_Initiation_Adjustments_Stream_Cursor_Value_Input =
  {
    created_at?: InputMaybe<Scalars['timestamptz']['input']>;
    error?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['uuid']['input']>;
    metadata?: InputMaybe<Scalars['jsonb']['input']>;
    status?: InputMaybe<Scalars['Int']['input']>;
    transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
  };

/** aggregate sum on columns */
export type Transfers_Transfer_Initiation_Adjustments_Sum_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_sum_fields';
  status?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Sum_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** update columns of table "transfers.transfer_initiation_adjustments" */
export enum Transfers_Transfer_Initiation_Adjustments_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Status = 'status',
  /** column name */
  TransferInitiationId = 'transfer_initiation_id',
}

export type Transfers_Transfer_Initiation_Adjustments_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Transfers_Transfer_Initiation_Adjustments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transfers_Transfer_Initiation_Adjustments_Var_Pop_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_var_pop_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transfers_Transfer_Initiation_Adjustments_Var_Samp_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_var_samp_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transfers_Transfer_Initiation_Adjustments_Variance_Fields = {
  __typename?: 'transfers_transfer_initiation_adjustments_variance_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "transfers.transfer_initiation_adjustments" */
export type Transfers_Transfer_Initiation_Adjustments_Variance_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregated selection of "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Aggregate = {
  __typename?: 'transfers_transfer_initiation_aggregate';
  aggregate?: Maybe<Transfers_Transfer_Initiation_Aggregate_Fields>;
  nodes: Array<Transfers_Transfer_Initiation>;
};

export type Transfers_Transfer_Initiation_Aggregate_Bool_Exp = {
  count?: InputMaybe<Transfers_Transfer_Initiation_Aggregate_Bool_Exp_Count>;
};

export type Transfers_Transfer_Initiation_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Aggregate_Fields = {
  __typename?: 'transfers_transfer_initiation_aggregate_fields';
  avg?: Maybe<Transfers_Transfer_Initiation_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Transfers_Transfer_Initiation_Max_Fields>;
  min?: Maybe<Transfers_Transfer_Initiation_Min_Fields>;
  stddev?: Maybe<Transfers_Transfer_Initiation_Stddev_Fields>;
  stddev_pop?: Maybe<Transfers_Transfer_Initiation_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transfers_Transfer_Initiation_Stddev_Samp_Fields>;
  sum?: Maybe<Transfers_Transfer_Initiation_Sum_Fields>;
  var_pop?: Maybe<Transfers_Transfer_Initiation_Var_Pop_Fields>;
  var_samp?: Maybe<Transfers_Transfer_Initiation_Var_Samp_Fields>;
  variance?: Maybe<Transfers_Transfer_Initiation_Variance_Fields>;
};

/** aggregate fields of "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transfers_Transfer_Initiation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Aggregate_Order_By = {
  avg?: InputMaybe<Transfers_Transfer_Initiation_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transfers_Transfer_Initiation_Max_Order_By>;
  min?: InputMaybe<Transfers_Transfer_Initiation_Min_Order_By>;
  stddev?: InputMaybe<Transfers_Transfer_Initiation_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transfers_Transfer_Initiation_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transfers_Transfer_Initiation_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transfers_Transfer_Initiation_Sum_Order_By>;
  var_pop?: InputMaybe<Transfers_Transfer_Initiation_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transfers_Transfer_Initiation_Var_Samp_Order_By>;
  variance?: InputMaybe<Transfers_Transfer_Initiation_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Transfers_Transfer_Initiation_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Arr_Rel_Insert_Input = {
  data: Array<Transfers_Transfer_Initiation_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_On_Conflict>;
};

/** aggregate avg on columns */
export type Transfers_Transfer_Initiation_Avg_Fields = {
  __typename?: 'transfers_transfer_initiation_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "transfers.transfer_initiation". All fields are combined with a logical 'AND'. */
export type Transfers_Transfer_Initiation_Bool_Exp = {
  _and?: InputMaybe<Array<Transfers_Transfer_Initiation_Bool_Exp>>;
  _not?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  _or?: InputMaybe<Array<Transfers_Transfer_Initiation_Bool_Exp>>;
  account?: InputMaybe<Accounts_Account_Bool_Exp>;
  accountBySourceAccountId?: InputMaybe<Accounts_Account_Bool_Exp>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  asset?: InputMaybe<String_Comparison_Exp>;
  attempts?: InputMaybe<Int_Comparison_Exp>;
  connector?: InputMaybe<Connectors_Connector_Bool_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  destination_account_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  initial_amount?: InputMaybe<Numeric_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  provider?: InputMaybe<Connector_Provider_Comparison_Exp>;
  scheduled_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  source_account_id?: InputMaybe<String_Comparison_Exp>;
  transfer_initiation_adjustments?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Bool_Exp>;
  transfer_initiation_adjustments_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Aggregate_Bool_Exp>;
  transfer_initiation_payments?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
  transfer_initiation_payments_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Payments_Aggregate_Bool_Exp>;
  transfer_reversals?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
  transfer_reversals_aggregate?: InputMaybe<Transfers_Transfer_Reversal_Aggregate_Bool_Exp>;
  type?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "transfers.transfer_initiation" */
export enum Transfers_Transfer_Initiation_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransferInitiationPkey = 'transfer_initiation_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Transfers_Transfer_Initiation_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Transfers_Transfer_Initiation_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Transfers_Transfer_Initiation_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  attempts?: InputMaybe<Scalars['Int']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Insert_Input = {
  account?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  accountBySourceAccountId?: InputMaybe<Accounts_Account_Obj_Rel_Insert_Input>;
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  attempts?: InputMaybe<Scalars['Int']['input']>;
  connector?: InputMaybe<Connectors_Connector_Obj_Rel_Insert_Input>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  destination_account_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  provider?: InputMaybe<Scalars['connector_provider']['input']>;
  scheduled_at?: InputMaybe<Scalars['timestamptz']['input']>;
  source_account_id?: InputMaybe<Scalars['String']['input']>;
  transfer_initiation_adjustments?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Arr_Rel_Insert_Input>;
  transfer_initiation_payments?: InputMaybe<Transfers_Transfer_Initiation_Payments_Arr_Rel_Insert_Input>;
  transfer_reversals?: InputMaybe<Transfers_Transfer_Reversal_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Transfers_Transfer_Initiation_Max_Fields = {
  __typename?: 'transfers_transfer_initiation_max_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  attempts?: Maybe<Scalars['Int']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  destination_account_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  initial_amount?: Maybe<Scalars['numeric']['output']>;
  provider?: Maybe<Scalars['connector_provider']['output']>;
  scheduled_at?: Maybe<Scalars['timestamptz']['output']>;
  source_account_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  destination_account_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  scheduled_at?: InputMaybe<Order_By>;
  source_account_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transfers_Transfer_Initiation_Min_Fields = {
  __typename?: 'transfers_transfer_initiation_min_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  attempts?: Maybe<Scalars['Int']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  destination_account_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  initial_amount?: Maybe<Scalars['numeric']['output']>;
  provider?: Maybe<Scalars['connector_provider']['output']>;
  scheduled_at?: Maybe<Scalars['timestamptz']['output']>;
  source_account_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  destination_account_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  scheduled_at?: InputMaybe<Order_By>;
  source_account_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Mutation_Response = {
  __typename?: 'transfers_transfer_initiation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Transfers_Transfer_Initiation>;
};

/** input type for inserting object relation for remote table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Obj_Rel_Insert_Input = {
  data: Transfers_Transfer_Initiation_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_On_Conflict>;
};

/** on_conflict condition type for table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_On_Conflict = {
  constraint: Transfers_Transfer_Initiation_Constraint;
  update_columns?: Array<Transfers_Transfer_Initiation_Update_Column>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
};

/** Ordering options when selecting data from "transfers.transfer_initiation". */
export type Transfers_Transfer_Initiation_Order_By = {
  account?: InputMaybe<Accounts_Account_Order_By>;
  accountBySourceAccountId?: InputMaybe<Accounts_Account_Order_By>;
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  connector?: InputMaybe<Connectors_Connector_Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  destination_account_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  scheduled_at?: InputMaybe<Order_By>;
  source_account_id?: InputMaybe<Order_By>;
  transfer_initiation_adjustments_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Adjustments_Aggregate_Order_By>;
  transfer_initiation_payments_aggregate?: InputMaybe<Transfers_Transfer_Initiation_Payments_Aggregate_Order_By>;
  transfer_reversals_aggregate?: InputMaybe<Transfers_Transfer_Reversal_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
};

/** columns and relationships of "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments = {
  __typename?: 'transfers_transfer_initiation_payments';
  created_at: Scalars['timestamptz']['output'];
  error?: Maybe<Scalars['String']['output']>;
  payment_id: Scalars['String']['output'];
  status: Scalars['Int']['output'];
  /** An object relationship */
  transfer_initiation: Transfers_Transfer_Initiation;
  transfer_initiation_id: Scalars['String']['output'];
};

/** aggregated selection of "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Aggregate = {
  __typename?: 'transfers_transfer_initiation_payments_aggregate';
  aggregate?: Maybe<Transfers_Transfer_Initiation_Payments_Aggregate_Fields>;
  nodes: Array<Transfers_Transfer_Initiation_Payments>;
};

export type Transfers_Transfer_Initiation_Payments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Transfers_Transfer_Initiation_Payments_Aggregate_Bool_Exp_Count>;
};

export type Transfers_Transfer_Initiation_Payments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Payments_Select_Column>
  >;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Aggregate_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_aggregate_fields';
  avg?: Maybe<Transfers_Transfer_Initiation_Payments_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Transfers_Transfer_Initiation_Payments_Max_Fields>;
  min?: Maybe<Transfers_Transfer_Initiation_Payments_Min_Fields>;
  stddev?: Maybe<Transfers_Transfer_Initiation_Payments_Stddev_Fields>;
  stddev_pop?: Maybe<Transfers_Transfer_Initiation_Payments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transfers_Transfer_Initiation_Payments_Stddev_Samp_Fields>;
  sum?: Maybe<Transfers_Transfer_Initiation_Payments_Sum_Fields>;
  var_pop?: Maybe<Transfers_Transfer_Initiation_Payments_Var_Pop_Fields>;
  var_samp?: Maybe<Transfers_Transfer_Initiation_Payments_Var_Samp_Fields>;
  variance?: Maybe<Transfers_Transfer_Initiation_Payments_Variance_Fields>;
};

/** aggregate fields of "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<
    Array<Transfers_Transfer_Initiation_Payments_Select_Column>
  >;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Aggregate_Order_By = {
  avg?: InputMaybe<Transfers_Transfer_Initiation_Payments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transfers_Transfer_Initiation_Payments_Max_Order_By>;
  min?: InputMaybe<Transfers_Transfer_Initiation_Payments_Min_Order_By>;
  stddev?: InputMaybe<Transfers_Transfer_Initiation_Payments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transfers_Transfer_Initiation_Payments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transfers_Transfer_Initiation_Payments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transfers_Transfer_Initiation_Payments_Sum_Order_By>;
  var_pop?: InputMaybe<Transfers_Transfer_Initiation_Payments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transfers_Transfer_Initiation_Payments_Var_Samp_Order_By>;
  variance?: InputMaybe<Transfers_Transfer_Initiation_Payments_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Arr_Rel_Insert_Input = {
  data: Array<Transfers_Transfer_Initiation_Payments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transfers_Transfer_Initiation_Payments_On_Conflict>;
};

/** aggregate avg on columns */
export type Transfers_Transfer_Initiation_Payments_Avg_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_avg_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Avg_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "transfers.transfer_initiation_payments". All fields are combined with a logical 'AND'. */
export type Transfers_Transfer_Initiation_Payments_Bool_Exp = {
  _and?: InputMaybe<Array<Transfers_Transfer_Initiation_Payments_Bool_Exp>>;
  _not?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
  _or?: InputMaybe<Array<Transfers_Transfer_Initiation_Payments_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  payment_id?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  transfer_initiation_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "transfers.transfer_initiation_payments" */
export enum Transfers_Transfer_Initiation_Payments_Constraint {
  /** unique or primary key constraint on columns "transfer_initiation_id", "payment_id" */
  TransferInitiationPaymentsPkey = 'transfer_initiation_payments_pkey',
}

/** input type for incrementing numeric columns in table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Inc_Input = {
  status?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Obj_Rel_Insert_Input>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Transfers_Transfer_Initiation_Payments_Max_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  transfer_initiation_id?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transfers_Transfer_Initiation_Payments_Min_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  payment_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  transfer_initiation_id?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Mutation_Response = {
  __typename?: 'transfers_transfer_initiation_payments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Transfers_Transfer_Initiation_Payments>;
};

/** on_conflict condition type for table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_On_Conflict = {
  constraint: Transfers_Transfer_Initiation_Payments_Constraint;
  update_columns?: Array<Transfers_Transfer_Initiation_Payments_Update_Column>;
  where?: InputMaybe<Transfers_Transfer_Initiation_Payments_Bool_Exp>;
};

/** Ordering options when selecting data from "transfers.transfer_initiation_payments". */
export type Transfers_Transfer_Initiation_Payments_Order_By = {
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transfers.transfer_initiation_payments */
export type Transfers_Transfer_Initiation_Payments_Pk_Columns_Input = {
  payment_id: Scalars['String']['input'];
  transfer_initiation_id: Scalars['String']['input'];
};

/** select columns of table "transfers.transfer_initiation_payments" */
export enum Transfers_Transfer_Initiation_Payments_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Error = 'error',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  Status = 'status',
  /** column name */
  TransferInitiationId = 'transfer_initiation_id',
}

/** input type for updating data in table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Transfers_Transfer_Initiation_Payments_Stddev_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_stddev_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Stddev_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transfers_Transfer_Initiation_Payments_Stddev_Pop_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_stddev_pop_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Stddev_Pop_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transfers_Transfer_Initiation_Payments_Stddev_Samp_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_stddev_samp_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Stddev_Samp_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "transfers_transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transfers_Transfer_Initiation_Payments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transfers_Transfer_Initiation_Payments_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  payment_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Transfers_Transfer_Initiation_Payments_Sum_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_sum_fields';
  status?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Sum_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** update columns of table "transfers.transfer_initiation_payments" */
export enum Transfers_Transfer_Initiation_Payments_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Error = 'error',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  Status = 'status',
  /** column name */
  TransferInitiationId = 'transfer_initiation_id',
}

export type Transfers_Transfer_Initiation_Payments_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transfers_Transfer_Initiation_Payments_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transfers_Transfer_Initiation_Payments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Transfers_Transfer_Initiation_Payments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transfers_Transfer_Initiation_Payments_Var_Pop_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_var_pop_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Var_Pop_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transfers_Transfer_Initiation_Payments_Var_Samp_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_var_samp_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Var_Samp_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transfers_Transfer_Initiation_Payments_Variance_Fields = {
  __typename?: 'transfers_transfer_initiation_payments_variance_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "transfers.transfer_initiation_payments" */
export type Transfers_Transfer_Initiation_Payments_Variance_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transfers.transfer_initiation */
export type Transfers_Transfer_Initiation_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Transfers_Transfer_Initiation_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "transfers.transfer_initiation" */
export enum Transfers_Transfer_Initiation_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Asset = 'asset',
  /** column name */
  Attempts = 'attempts',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DestinationAccountId = 'destination_account_id',
  /** column name */
  Id = 'id',
  /** column name */
  InitialAmount = 'initial_amount',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Provider = 'provider',
  /** column name */
  ScheduledAt = 'scheduled_at',
  /** column name */
  SourceAccountId = 'source_account_id',
  /** column name */
  Type = 'type',
}

/** input type for updating data in table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Set_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  attempts?: InputMaybe<Scalars['Int']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  destination_account_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  provider?: InputMaybe<Scalars['connector_provider']['input']>;
  scheduled_at?: InputMaybe<Scalars['timestamptz']['input']>;
  source_account_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Transfers_Transfer_Initiation_Stddev_Fields = {
  __typename?: 'transfers_transfer_initiation_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transfers_Transfer_Initiation_Stddev_Pop_Fields = {
  __typename?: 'transfers_transfer_initiation_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transfers_Transfer_Initiation_Stddev_Samp_Fields = {
  __typename?: 'transfers_transfer_initiation_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "transfers_transfer_initiation" */
export type Transfers_Transfer_Initiation_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transfers_Transfer_Initiation_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transfers_Transfer_Initiation_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  attempts?: InputMaybe<Scalars['Int']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  destination_account_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  initial_amount?: InputMaybe<Scalars['numeric']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  provider?: InputMaybe<Scalars['connector_provider']['input']>;
  scheduled_at?: InputMaybe<Scalars['timestamptz']['input']>;
  source_account_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Transfers_Transfer_Initiation_Sum_Fields = {
  __typename?: 'transfers_transfer_initiation_sum_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  attempts?: Maybe<Scalars['Int']['output']>;
  initial_amount?: Maybe<Scalars['numeric']['output']>;
  type?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** update columns of table "transfers.transfer_initiation" */
export enum Transfers_Transfer_Initiation_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Asset = 'asset',
  /** column name */
  Attempts = 'attempts',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DestinationAccountId = 'destination_account_id',
  /** column name */
  Id = 'id',
  /** column name */
  InitialAmount = 'initial_amount',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Provider = 'provider',
  /** column name */
  ScheduledAt = 'scheduled_at',
  /** column name */
  SourceAccountId = 'source_account_id',
  /** column name */
  Type = 'type',
}

export type Transfers_Transfer_Initiation_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Transfers_Transfer_Initiation_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Transfers_Transfer_Initiation_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Transfers_Transfer_Initiation_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Transfers_Transfer_Initiation_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transfers_Transfer_Initiation_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Transfers_Transfer_Initiation_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transfers_Transfer_Initiation_Set_Input>;
  /** filter the rows which have to be updated */
  where: Transfers_Transfer_Initiation_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transfers_Transfer_Initiation_Var_Pop_Fields = {
  __typename?: 'transfers_transfer_initiation_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transfers_Transfer_Initiation_Var_Samp_Fields = {
  __typename?: 'transfers_transfer_initiation_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transfers_Transfer_Initiation_Variance_Fields = {
  __typename?: 'transfers_transfer_initiation_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['Float']['output']>;
  initial_amount?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "transfers.transfer_initiation" */
export type Transfers_Transfer_Initiation_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  initial_amount?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** columns and relationships of "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal = {
  __typename?: 'transfers_transfer_reversal';
  amount: Scalars['numeric']['output'];
  asset: Scalars['String']['output'];
  /** An object relationship */
  connector: Connectors_Connector;
  connector_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  description: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  metadata?: Maybe<Scalars['jsonb']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status: Scalars['Int']['output'];
  /** An object relationship */
  transfer_initiation: Transfers_Transfer_Initiation;
  transfer_initiation_id: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** columns and relationships of "transfers.transfer_reversal" */
export type Transfers_Transfer_ReversalMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Aggregate = {
  __typename?: 'transfers_transfer_reversal_aggregate';
  aggregate?: Maybe<Transfers_Transfer_Reversal_Aggregate_Fields>;
  nodes: Array<Transfers_Transfer_Reversal>;
};

export type Transfers_Transfer_Reversal_Aggregate_Bool_Exp = {
  count?: InputMaybe<Transfers_Transfer_Reversal_Aggregate_Bool_Exp_Count>;
};

export type Transfers_Transfer_Reversal_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Aggregate_Fields = {
  __typename?: 'transfers_transfer_reversal_aggregate_fields';
  avg?: Maybe<Transfers_Transfer_Reversal_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Transfers_Transfer_Reversal_Max_Fields>;
  min?: Maybe<Transfers_Transfer_Reversal_Min_Fields>;
  stddev?: Maybe<Transfers_Transfer_Reversal_Stddev_Fields>;
  stddev_pop?: Maybe<Transfers_Transfer_Reversal_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transfers_Transfer_Reversal_Stddev_Samp_Fields>;
  sum?: Maybe<Transfers_Transfer_Reversal_Sum_Fields>;
  var_pop?: Maybe<Transfers_Transfer_Reversal_Var_Pop_Fields>;
  var_samp?: Maybe<Transfers_Transfer_Reversal_Var_Samp_Fields>;
  variance?: Maybe<Transfers_Transfer_Reversal_Variance_Fields>;
};

/** aggregate fields of "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transfers_Transfer_Reversal_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Aggregate_Order_By = {
  avg?: InputMaybe<Transfers_Transfer_Reversal_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transfers_Transfer_Reversal_Max_Order_By>;
  min?: InputMaybe<Transfers_Transfer_Reversal_Min_Order_By>;
  stddev?: InputMaybe<Transfers_Transfer_Reversal_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transfers_Transfer_Reversal_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transfers_Transfer_Reversal_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transfers_Transfer_Reversal_Sum_Order_By>;
  var_pop?: InputMaybe<Transfers_Transfer_Reversal_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transfers_Transfer_Reversal_Var_Samp_Order_By>;
  variance?: InputMaybe<Transfers_Transfer_Reversal_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Transfers_Transfer_Reversal_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Arr_Rel_Insert_Input = {
  data: Array<Transfers_Transfer_Reversal_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transfers_Transfer_Reversal_On_Conflict>;
};

/** aggregate avg on columns */
export type Transfers_Transfer_Reversal_Avg_Fields = {
  __typename?: 'transfers_transfer_reversal_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "transfers.transfer_reversal". All fields are combined with a logical 'AND'. */
export type Transfers_Transfer_Reversal_Bool_Exp = {
  _and?: InputMaybe<Array<Transfers_Transfer_Reversal_Bool_Exp>>;
  _not?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
  _or?: InputMaybe<Array<Transfers_Transfer_Reversal_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  asset?: InputMaybe<String_Comparison_Exp>;
  connector?: InputMaybe<Connectors_Connector_Bool_Exp>;
  connector_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  reference?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Bool_Exp>;
  transfer_initiation_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "transfers.transfer_reversal" */
export enum Transfers_Transfer_Reversal_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransferReversalPkey = 'transfer_reversal_pkey',
  /** unique or primary key constraint on columns "transfer_initiation_id" */
  TransferReversalProcessingUniqueConstraint = 'transfer_reversal_processing_unique_constraint',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Transfers_Transfer_Reversal_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Transfers_Transfer_Reversal_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Transfers_Transfer_Reversal_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Insert_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  connector?: InputMaybe<Connectors_Connector_Obj_Rel_Insert_Input>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Obj_Rel_Insert_Input>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Transfers_Transfer_Reversal_Max_Fields = {
  __typename?: 'transfers_transfer_reversal_max_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  transfer_initiation_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transfers_Transfer_Reversal_Min_Fields = {
  __typename?: 'transfers_transfer_reversal_min_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  asset?: Maybe<Scalars['String']['output']>;
  connector_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  transfer_initiation_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Mutation_Response = {
  __typename?: 'transfers_transfer_reversal_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Transfers_Transfer_Reversal>;
};

/** on_conflict condition type for table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_On_Conflict = {
  constraint: Transfers_Transfer_Reversal_Constraint;
  update_columns?: Array<Transfers_Transfer_Reversal_Update_Column>;
  where?: InputMaybe<Transfers_Transfer_Reversal_Bool_Exp>;
};

/** Ordering options when selecting data from "transfers.transfer_reversal". */
export type Transfers_Transfer_Reversal_Order_By = {
  amount?: InputMaybe<Order_By>;
  asset?: InputMaybe<Order_By>;
  connector?: InputMaybe<Connectors_Connector_Order_By>;
  connector_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  reference?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transfer_initiation?: InputMaybe<Transfers_Transfer_Initiation_Order_By>;
  transfer_initiation_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transfers.transfer_reversal */
export type Transfers_Transfer_Reversal_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Transfers_Transfer_Reversal_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "transfers.transfer_reversal" */
export enum Transfers_Transfer_Reversal_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Asset = 'asset',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Reference = 'reference',
  /** column name */
  Status = 'status',
  /** column name */
  TransferInitiationId = 'transfer_initiation_id',
  /** column name */
  UpdatedAt = 'updated_at',
}

/** input type for updating data in table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Set_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Transfers_Transfer_Reversal_Stddev_Fields = {
  __typename?: 'transfers_transfer_reversal_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transfers_Transfer_Reversal_Stddev_Pop_Fields = {
  __typename?: 'transfers_transfer_reversal_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transfers_Transfer_Reversal_Stddev_Samp_Fields = {
  __typename?: 'transfers_transfer_reversal_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "transfers_transfer_reversal" */
export type Transfers_Transfer_Reversal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transfers_Transfer_Reversal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transfers_Transfer_Reversal_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  connector_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  transfer_initiation_id?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Transfers_Transfer_Reversal_Sum_Fields = {
  __typename?: 'transfers_transfer_reversal_sum_fields';
  amount?: Maybe<Scalars['numeric']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** update columns of table "transfers.transfer_reversal" */
export enum Transfers_Transfer_Reversal_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  Asset = 'asset',
  /** column name */
  ConnectorId = 'connector_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Reference = 'reference',
  /** column name */
  Status = 'status',
  /** column name */
  TransferInitiationId = 'transfer_initiation_id',
  /** column name */
  UpdatedAt = 'updated_at',
}

export type Transfers_Transfer_Reversal_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Transfers_Transfer_Reversal_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Transfers_Transfer_Reversal_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Transfers_Transfer_Reversal_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Transfers_Transfer_Reversal_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transfers_Transfer_Reversal_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Transfers_Transfer_Reversal_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transfers_Transfer_Reversal_Set_Input>;
  /** filter the rows which have to be updated */
  where: Transfers_Transfer_Reversal_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transfers_Transfer_Reversal_Var_Pop_Fields = {
  __typename?: 'transfers_transfer_reversal_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transfers_Transfer_Reversal_Var_Samp_Fields = {
  __typename?: 'transfers_transfer_reversal_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transfers_Transfer_Reversal_Variance_Fields = {
  __typename?: 'transfers_transfer_reversal_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "transfers.transfer_reversal" */
export type Transfers_Transfer_Reversal_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type GetConsumerLoansQueryVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
}>;

export type GetConsumerLoansQuery = {
  __typename?: 'query_root';
  consumers: Array<{
    __typename?: 'consumers';
    id: any;
    phone_number: string;
    full_name?: string | null;
    loans: Array<{
      __typename?: 'loan';
      id: string;
      loan_statuses: Array<{
        __typename?: 'loan_status';
        created_at: any;
        status: string;
      }>;
      loan_schedules: Array<{
        __typename?: 'loan_schedule';
        id: number;
        loan_id: string;
        paid_date?: any | null;
        created_at: any;
        due_principal: any;
        due_interest: any;
        due_late_fee?: any | null;
        due_date: any;
      }>;
    }>;
  }>;
};

export type GetConsumerFormanceAccountQueryVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
}>;

export type GetConsumerFormanceAccountQuery = {
  __typename?: 'query_root';
  consumers: Array<{
    __typename?: 'consumers';
    id: any;
    formanceAccount?: { __typename?: 'accounts_account'; id: string } | null;
  }>;
};

export const GetConsumerLoansDocument = gql`
  query getConsumerLoans($phoneNumber: String!) {
    consumers(where: { phone_number: { _eq: $phoneNumber } }) {
      id
      phone_number
      full_name
      loans(
        where: { loan_statuses_aggregate: { count: { predicate: { _eq: 1 } } } }
      ) {
        id
        loan_statuses(order_by: { created_at: desc }) {
          created_at
          status
        }
        loan_schedules(
          where: { paid_date: { _is_null: true } }
          order_by: { due_date: asc }
        ) {
          id
          loan_id
          paid_date
          created_at
          due_principal
          due_interest
          due_late_fee
          due_date
        }
      }
    }
  }
`;
export const GetConsumerFormanceAccountDocument = gql`
  query getConsumerFormanceAccount($phoneNumber: String!) {
    consumers(where: { phone_number: { _eq: $phoneNumber } }) {
      id
      formanceAccount {
        id
      }
    }
  }
`;
export type Requester<C = {}> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C,
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C>(requester: Requester<C>) {
  return {
    getConsumerLoans(
      variables: GetConsumerLoansQueryVariables,
      options?: C,
    ): Promise<GetConsumerLoansQuery> {
      return requester<GetConsumerLoansQuery, GetConsumerLoansQueryVariables>(
        GetConsumerLoansDocument,
        variables,
        options,
      ) as Promise<GetConsumerLoansQuery>;
    },
    getConsumerFormanceAccount(
      variables: GetConsumerFormanceAccountQueryVariables,
      options?: C,
    ): Promise<GetConsumerFormanceAccountQuery> {
      return requester<
        GetConsumerFormanceAccountQuery,
        GetConsumerFormanceAccountQueryVariables
      >(
        GetConsumerFormanceAccountDocument,
        variables,
        options,
      ) as Promise<GetConsumerFormanceAccountQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
