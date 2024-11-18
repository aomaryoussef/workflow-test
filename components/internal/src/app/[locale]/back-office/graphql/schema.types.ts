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
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  collateral_type: { input: any; output: any };
  consumer_group_member_role_type: { input: any; output: any };
  consumer_state_type: { input: any; output: any };
  date: { input: any; output: any };
  gender_type: { input: any; output: any };
  guarantor_deactivation_reason_type: { input: any; output: any };
  gurantor_relation_type: { input: any; output: any };
  json: { input: any; output: any };
  marital_status_type: { input: any; output: any };
  phone_type: { input: any; output: any };
  timestamp: { input: any; output: any };
  timestamptz: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "address" */
export type Address = {
  active_since_utc: Scalars["timestamptz"]["output"];
  active_until_utc: Scalars["timestamptz"]["output"];
  city: Scalars["String"]["output"];
  country?: Maybe<Scalars["String"]["output"]>;
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by: Scalars["String"]["output"];
  further_details?: Maybe<Scalars["json"]["output"]>;
  id: Scalars["String"]["output"];
  is_primary: Scalars["Boolean"]["output"];
  latitude?: Maybe<Scalars["String"]["output"]>;
  line_1: Scalars["String"]["output"];
  line_2?: Maybe<Scalars["String"]["output"]>;
  line_3?: Maybe<Scalars["String"]["output"]>;
  longitude?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  user_detail?: Maybe<User_Detail>;
  user_id?: Maybe<Scalars["String"]["output"]>;
  zip: Scalars["String"]["output"];
};

/** columns and relationships of "address" */
export type AddressFurther_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "address" */
export type Address_Aggregate = {
  aggregate?: Maybe<Address_Aggregate_Fields>;
  nodes: Array<Address>;
};

export type Address_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Address_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Address_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Address_Aggregate_Bool_Exp_Count>;
};

export type Address_Aggregate_Bool_Exp_Bool_And = {
  arguments: Address_Select_Column_Address_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Address_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Address_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Address_Select_Column_Address_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Address_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Address_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Address_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Address_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "address" */
export type Address_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Address_Max_Fields>;
  min?: Maybe<Address_Min_Fields>;
};

/** aggregate fields of "address" */
export type Address_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Address_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "address" */
export type Address_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Address_Max_Order_By>;
  min?: InputMaybe<Address_Min_Order_By>;
};

/** input type for inserting array relation for remote table "address" */
export type Address_Arr_Rel_Insert_Input = {
  data: Array<Address_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Address_On_Conflict>;
};

/** Boolean expression to filter rows from the table "address". All fields are combined with a logical 'AND'. */
export type Address_Bool_Exp = {
  _and?: InputMaybe<Array<Address_Bool_Exp>>;
  _not?: InputMaybe<Address_Bool_Exp>;
  _or?: InputMaybe<Array<Address_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  active_until_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  country?: InputMaybe<String_Comparison_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  further_details?: InputMaybe<Json_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_primary?: InputMaybe<Boolean_Comparison_Exp>;
  latitude?: InputMaybe<String_Comparison_Exp>;
  line_1?: InputMaybe<String_Comparison_Exp>;
  line_2?: InputMaybe<String_Comparison_Exp>;
  line_3?: InputMaybe<String_Comparison_Exp>;
  longitude?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
  user_detail?: InputMaybe<User_Detail_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
  zip?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "address" */
export type Address_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_address";

/** input type for inserting data into table "address" */
export type Address_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  further_details?: InputMaybe<Scalars["json"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  latitude?: InputMaybe<Scalars["String"]["input"]>;
  line_1?: InputMaybe<Scalars["String"]["input"]>;
  line_2?: InputMaybe<Scalars["String"]["input"]>;
  line_3?: InputMaybe<Scalars["String"]["input"]>;
  longitude?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  user_detail?: InputMaybe<User_Detail_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
  zip?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Address_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  latitude?: Maybe<Scalars["String"]["output"]>;
  line_1?: Maybe<Scalars["String"]["output"]>;
  line_2?: Maybe<Scalars["String"]["output"]>;
  line_3?: Maybe<Scalars["String"]["output"]>;
  longitude?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
  zip?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "address" */
export type Address_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  latitude?: InputMaybe<Order_By>;
  line_1?: InputMaybe<Order_By>;
  line_2?: InputMaybe<Order_By>;
  line_3?: InputMaybe<Order_By>;
  longitude?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  zip?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Address_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  latitude?: Maybe<Scalars["String"]["output"]>;
  line_1?: Maybe<Scalars["String"]["output"]>;
  line_2?: Maybe<Scalars["String"]["output"]>;
  line_3?: Maybe<Scalars["String"]["output"]>;
  longitude?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
  zip?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "address" */
export type Address_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  latitude?: InputMaybe<Order_By>;
  line_1?: InputMaybe<Order_By>;
  line_2?: InputMaybe<Order_By>;
  line_3?: InputMaybe<Order_By>;
  longitude?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  zip?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "address" */
export type Address_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Address>;
};

/** on_conflict condition type for table "address" */
export type Address_On_Conflict = {
  constraint: Address_Constraint;
  update_columns?: Array<Address_Update_Column>;
  where?: InputMaybe<Address_Bool_Exp>;
};

/** Ordering options when selecting data from "address". */
export type Address_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  further_details?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_primary?: InputMaybe<Order_By>;
  latitude?: InputMaybe<Order_By>;
  line_1?: InputMaybe<Order_By>;
  line_2?: InputMaybe<Order_By>;
  line_3?: InputMaybe<Order_By>;
  longitude?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  user_detail?: InputMaybe<User_Detail_Order_By>;
  user_id?: InputMaybe<Order_By>;
  zip?: InputMaybe<Order_By>;
};

/** primary key columns input for table: address */
export type Address_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "address" */
export type Address_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "city"
  /** column name */
  | "country"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "further_details"
  /** column name */
  | "id"
  /** column name */
  | "is_primary"
  /** column name */
  | "latitude"
  /** column name */
  | "line_1"
  /** column name */
  | "line_2"
  /** column name */
  | "line_3"
  /** column name */
  | "longitude"
  /** column name */
  | "state"
  /** column name */
  | "user_id"
  /** column name */
  | "zip";

/** select "address_aggregate_bool_exp_bool_and_arguments_columns" columns of table "address" */
export type Address_Select_Column_Address_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_primary";

/** select "address_aggregate_bool_exp_bool_or_arguments_columns" columns of table "address" */
export type Address_Select_Column_Address_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_primary";

/** input type for updating data in table "address" */
export type Address_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  further_details?: InputMaybe<Scalars["json"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  latitude?: InputMaybe<Scalars["String"]["input"]>;
  line_1?: InputMaybe<Scalars["String"]["input"]>;
  line_2?: InputMaybe<Scalars["String"]["input"]>;
  line_3?: InputMaybe<Scalars["String"]["input"]>;
  longitude?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
  zip?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "address" */
export type Address_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Address_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Address_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  further_details?: InputMaybe<Scalars["json"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  latitude?: InputMaybe<Scalars["String"]["input"]>;
  line_1?: InputMaybe<Scalars["String"]["input"]>;
  line_2?: InputMaybe<Scalars["String"]["input"]>;
  line_3?: InputMaybe<Scalars["String"]["input"]>;
  longitude?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
  zip?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "address" */
export type Address_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "city"
  /** column name */
  | "country"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "further_details"
  /** column name */
  | "id"
  /** column name */
  | "is_primary"
  /** column name */
  | "latitude"
  /** column name */
  | "line_1"
  /** column name */
  | "line_2"
  /** column name */
  | "line_3"
  /** column name */
  | "longitude"
  /** column name */
  | "state"
  /** column name */
  | "user_id"
  /** column name */
  | "zip";

export type Address_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Address_Set_Input>;
  /** filter the rows which have to be updated */
  where: Address_Bool_Exp;
};

/** columns and relationships of "collateral" */
export type Collateral = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc: Scalars["timestamptz"]["output"];
  collateral_digital_location?: Maybe<Scalars["String"]["output"]>;
  collateral_number: Scalars["String"]["output"];
  collateral_physical_location?: Maybe<Scalars["String"]["output"]>;
  collateral_type: Scalars["collateral_type"]["output"];
  /** An object relationship */
  consumer: Consumer;
  consumer_id: Scalars["String"]["output"];
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  updated_at_utc: Scalars["timestamptz"]["output"];
  updated_by: Scalars["String"]["output"];
};

/** aggregated selection of "collateral" */
export type Collateral_Aggregate = {
  aggregate?: Maybe<Collateral_Aggregate_Fields>;
  nodes: Array<Collateral>;
};

export type Collateral_Aggregate_Bool_Exp = {
  count?: InputMaybe<Collateral_Aggregate_Bool_Exp_Count>;
};

export type Collateral_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Collateral_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Collateral_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "collateral" */
export type Collateral_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Collateral_Max_Fields>;
  min?: Maybe<Collateral_Min_Fields>;
};

/** aggregate fields of "collateral" */
export type Collateral_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Collateral_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "collateral" */
export type Collateral_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Collateral_Max_Order_By>;
  min?: InputMaybe<Collateral_Min_Order_By>;
};

/** input type for inserting array relation for remote table "collateral" */
export type Collateral_Arr_Rel_Insert_Input = {
  data: Array<Collateral_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Collateral_On_Conflict>;
};

/** Boolean expression to filter rows from the table "collateral". All fields are combined with a logical 'AND'. */
export type Collateral_Bool_Exp = {
  _and?: InputMaybe<Array<Collateral_Bool_Exp>>;
  _not?: InputMaybe<Collateral_Bool_Exp>;
  _or?: InputMaybe<Array<Collateral_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  active_until_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  collateral_digital_location?: InputMaybe<String_Comparison_Exp>;
  collateral_number?: InputMaybe<String_Comparison_Exp>;
  collateral_physical_location?: InputMaybe<String_Comparison_Exp>;
  collateral_type?: InputMaybe<Collateral_Type_Comparison_Exp>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  updated_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "collateral" */
export type Collateral_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_collateral";

/** input type for inserting data into table "collateral" */
export type Collateral_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  collateral_digital_location?: InputMaybe<Scalars["String"]["input"]>;
  collateral_number?: InputMaybe<Scalars["String"]["input"]>;
  collateral_physical_location?: InputMaybe<Scalars["String"]["input"]>;
  collateral_type?: InputMaybe<Scalars["collateral_type"]["input"]>;
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  updated_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Collateral_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  collateral_digital_location?: Maybe<Scalars["String"]["output"]>;
  collateral_number?: Maybe<Scalars["String"]["output"]>;
  collateral_physical_location?: Maybe<Scalars["String"]["output"]>;
  collateral_type?: Maybe<Scalars["collateral_type"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  updated_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_by?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "collateral" */
export type Collateral_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  collateral_digital_location?: InputMaybe<Order_By>;
  collateral_number?: InputMaybe<Order_By>;
  collateral_physical_location?: InputMaybe<Order_By>;
  collateral_type?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at_utc?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Collateral_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  collateral_digital_location?: Maybe<Scalars["String"]["output"]>;
  collateral_number?: Maybe<Scalars["String"]["output"]>;
  collateral_physical_location?: Maybe<Scalars["String"]["output"]>;
  collateral_type?: Maybe<Scalars["collateral_type"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  updated_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_by?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "collateral" */
export type Collateral_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  collateral_digital_location?: InputMaybe<Order_By>;
  collateral_number?: InputMaybe<Order_By>;
  collateral_physical_location?: InputMaybe<Order_By>;
  collateral_type?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at_utc?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "collateral" */
export type Collateral_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Collateral>;
};

/** on_conflict condition type for table "collateral" */
export type Collateral_On_Conflict = {
  constraint: Collateral_Constraint;
  update_columns?: Array<Collateral_Update_Column>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

/** Ordering options when selecting data from "collateral". */
export type Collateral_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  collateral_digital_location?: InputMaybe<Order_By>;
  collateral_number?: InputMaybe<Order_By>;
  collateral_physical_location?: InputMaybe<Order_By>;
  collateral_type?: InputMaybe<Order_By>;
  consumer?: InputMaybe<Consumer_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at_utc?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: collateral */
export type Collateral_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "collateral" */
export type Collateral_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "collateral_digital_location"
  /** column name */
  | "collateral_number"
  /** column name */
  | "collateral_physical_location"
  /** column name */
  | "collateral_type"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "updated_at_utc"
  /** column name */
  | "updated_by";

/** input type for updating data in table "collateral" */
export type Collateral_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  collateral_digital_location?: InputMaybe<Scalars["String"]["input"]>;
  collateral_number?: InputMaybe<Scalars["String"]["input"]>;
  collateral_physical_location?: InputMaybe<Scalars["String"]["input"]>;
  collateral_type?: InputMaybe<Scalars["collateral_type"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  updated_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "collateral" */
export type Collateral_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Collateral_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Collateral_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  collateral_digital_location?: InputMaybe<Scalars["String"]["input"]>;
  collateral_number?: InputMaybe<Scalars["String"]["input"]>;
  collateral_physical_location?: InputMaybe<Scalars["String"]["input"]>;
  collateral_type?: InputMaybe<Scalars["collateral_type"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  updated_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to compare columns of type "collateral_type". All fields are combined with logical 'AND'. */
export type Collateral_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["collateral_type"]["input"]>;
  _gt?: InputMaybe<Scalars["collateral_type"]["input"]>;
  _gte?: InputMaybe<Scalars["collateral_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["collateral_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["collateral_type"]["input"]>;
  _lte?: InputMaybe<Scalars["collateral_type"]["input"]>;
  _neq?: InputMaybe<Scalars["collateral_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["collateral_type"]["input"]>>;
};

/** update columns of table "collateral" */
export type Collateral_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "collateral_digital_location"
  /** column name */
  | "collateral_number"
  /** column name */
  | "collateral_physical_location"
  /** column name */
  | "collateral_type"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "updated_at_utc"
  /** column name */
  | "updated_by";

export type Collateral_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Collateral_Set_Input>;
  /** filter the rows which have to be updated */
  where: Collateral_Bool_Exp;
};

/** columns and relationships of "company" */
export type Company = {
  /** An array relationship */
  consumer_kycs: Array<Consumer_Kyc>;
  /** An aggregate relationship */
  consumer_kycs_aggregate: Consumer_Kyc_Aggregate;
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  is_active: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
};

/** columns and relationships of "company" */
export type CompanyConsumer_KycsArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

/** columns and relationships of "company" */
export type CompanyConsumer_Kycs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

/** aggregated selection of "company" */
export type Company_Aggregate = {
  aggregate?: Maybe<Company_Aggregate_Fields>;
  nodes: Array<Company>;
};

/** aggregate fields of "company" */
export type Company_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Company_Max_Fields>;
  min?: Maybe<Company_Min_Fields>;
};

/** aggregate fields of "company" */
export type Company_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Company_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "company". All fields are combined with a logical 'AND'. */
export type Company_Bool_Exp = {
  _and?: InputMaybe<Array<Company_Bool_Exp>>;
  _not?: InputMaybe<Company_Bool_Exp>;
  _or?: InputMaybe<Array<Company_Bool_Exp>>;
  consumer_kycs?: InputMaybe<Consumer_Kyc_Bool_Exp>;
  consumer_kycs_aggregate?: InputMaybe<Consumer_Kyc_Aggregate_Bool_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "company" */
export type Company_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_company";

/** input type for inserting data into table "company" */
export type Company_Insert_Input = {
  consumer_kycs?: InputMaybe<Consumer_Kyc_Arr_Rel_Insert_Input>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Company_Max_Fields = {
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Company_Min_Fields = {
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "company" */
export type Company_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Company>;
};

/** input type for inserting object relation for remote table "company" */
export type Company_Obj_Rel_Insert_Input = {
  data: Company_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Company_On_Conflict>;
};

/** on_conflict condition type for table "company" */
export type Company_On_Conflict = {
  constraint: Company_Constraint;
  update_columns?: Array<Company_Update_Column>;
  where?: InputMaybe<Company_Bool_Exp>;
};

/** Ordering options when selecting data from "company". */
export type Company_Order_By = {
  consumer_kycs_aggregate?: InputMaybe<Consumer_Kyc_Aggregate_Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: company */
export type Company_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "company" */
export type Company_Select_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "is_active"
  /** column name */
  | "name";

/** input type for updating data in table "company" */
export type Company_Set_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "company" */
export type Company_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Company_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Company_Stream_Cursor_Value_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "company" */
export type Company_Update_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "is_active"
  /** column name */
  | "name";

export type Company_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Company_Set_Input>;
  /** filter the rows which have to be updated */
  where: Company_Bool_Exp;
};

/** columns and relationships of "consumer" */
export type Consumer = {
  /** An array relationship */
  collaterals: Array<Collateral>;
  /** An aggregate relationship */
  collaterals_aggregate: Collateral_Aggregate;
  /** An array relationship */
  consumer_group_members: Array<Consumer_Group_Member>;
  /** An aggregate relationship */
  consumer_group_members_aggregate: Consumer_Group_Member_Aggregate;
  /** An array relationship */
  consumer_kycs: Array<Consumer_Kyc>;
  /** An aggregate relationship */
  consumer_kycs_aggregate: Consumer_Kyc_Aggregate;
  /** An array relationship */
  consumer_states: Array<Consumer_State>;
  /** An aggregate relationship */
  consumer_states_aggregate: Consumer_State_Aggregate;
  /** An array relationship */
  consumer_user_mappings: Array<Consumer_User_Mapping>;
  /** An aggregate relationship */
  consumer_user_mappings_aggregate: Consumer_User_Mapping_Aggregate;
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by: Scalars["String"]["output"];
  /** An array relationship */
  credit_limits: Array<Credit_Limit>;
  /** An aggregate relationship */
  credit_limits_aggregate: Credit_Limit_Aggregate;
  /** An array relationship */
  guarantors: Array<Guarantor>;
  /** An aggregate relationship */
  guarantors_aggregate: Guarantor_Aggregate;
  id: Scalars["String"]["output"];
  identity_id?: Maybe<Scalars["String"]["output"]>;
  metadata: Scalars["json"]["output"];
  updated_at_utc: Scalars["timestamptz"]["output"];
  updated_by: Scalars["String"]["output"];
};

/** columns and relationships of "consumer" */
export type ConsumerCollateralsArgs = {
  distinct_on?: InputMaybe<Array<Collateral_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Collateral_Order_By>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerCollaterals_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collateral_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Collateral_Order_By>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_Group_MembersArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_Group_Members_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_KycsArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_Kycs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_StatesArgs = {
  distinct_on?: InputMaybe<Array<Consumer_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_State_Order_By>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_State_Order_By>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_User_MappingsArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerConsumer_User_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerCredit_LimitsArgs = {
  distinct_on?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Credit_Limit_Order_By>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerCredit_Limits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Credit_Limit_Order_By>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerGuarantorsArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_Order_By>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerGuarantors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_Order_By>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

/** columns and relationships of "consumer" */
export type ConsumerMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "consumer" */
export type Consumer_Aggregate = {
  aggregate?: Maybe<Consumer_Aggregate_Fields>;
  nodes: Array<Consumer>;
};

/** aggregate fields of "consumer" */
export type Consumer_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_Max_Fields>;
  min?: Maybe<Consumer_Min_Fields>;
};

/** aggregate fields of "consumer" */
export type Consumer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** columns and relationships of "consumer_application" */
export type Consumer_Application = {
  /** An array relationship */
  consumer_application_states: Array<Consumer_Application_State>;
  /** An aggregate relationship */
  consumer_application_states_aggregate: Consumer_Application_State_Aggregate;
  created_at_utc: Scalars["timestamp"]["output"];
  created_by?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
};

/** columns and relationships of "consumer_application" */
export type Consumer_ApplicationConsumer_Application_StatesArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_State_Order_By>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

/** columns and relationships of "consumer_application" */
export type Consumer_ApplicationConsumer_Application_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_State_Order_By>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

/** aggregated selection of "consumer_application" */
export type Consumer_Application_Aggregate = {
  aggregate?: Maybe<Consumer_Application_Aggregate_Fields>;
  nodes: Array<Consumer_Application>;
};

/** aggregate fields of "consumer_application" */
export type Consumer_Application_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_Application_Max_Fields>;
  min?: Maybe<Consumer_Application_Min_Fields>;
};

/** aggregate fields of "consumer_application" */
export type Consumer_Application_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_Application_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "consumer_application". All fields are combined with a logical 'AND'. */
export type Consumer_Application_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_Application_Bool_Exp>>;
  _not?: InputMaybe<Consumer_Application_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_Application_Bool_Exp>>;
  consumer_application_states?: InputMaybe<Consumer_Application_State_Bool_Exp>;
  consumer_application_states_aggregate?: InputMaybe<Consumer_Application_State_Aggregate_Bool_Exp>;
  created_at_utc?: InputMaybe<Timestamp_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_application" */
export type Consumer_Application_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_consumer_application_1";

/** input type for inserting data into table "consumer_application" */
export type Consumer_Application_Insert_Input = {
  consumer_application_states?: InputMaybe<Consumer_Application_State_Arr_Rel_Insert_Input>;
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_Application_Max_Fields = {
  created_at_utc?: Maybe<Scalars["timestamp"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Consumer_Application_Min_Fields = {
  created_at_utc?: Maybe<Scalars["timestamp"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "consumer_application" */
export type Consumer_Application_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_Application>;
};

/** input type for inserting object relation for remote table "consumer_application" */
export type Consumer_Application_Obj_Rel_Insert_Input = {
  data: Consumer_Application_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_Application_On_Conflict>;
};

/** on_conflict condition type for table "consumer_application" */
export type Consumer_Application_On_Conflict = {
  constraint: Consumer_Application_Constraint;
  update_columns?: Array<Consumer_Application_Update_Column>;
  where?: InputMaybe<Consumer_Application_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_application". */
export type Consumer_Application_Order_By = {
  consumer_application_states_aggregate?: InputMaybe<Consumer_Application_State_Aggregate_Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_application */
export type Consumer_Application_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "consumer_application" */
export type Consumer_Application_Select_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id";

/** input type for updating data in table "consumer_application" */
export type Consumer_Application_Set_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "consumer_application_state" */
export type Consumer_Application_State = {
  active_since_utc: Scalars["timestamptz"]["output"];
  application_id?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  consumer_application?: Maybe<Consumer_Application>;
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  statue?: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "consumer_application_state" */
export type Consumer_Application_State_Aggregate = {
  aggregate?: Maybe<Consumer_Application_State_Aggregate_Fields>;
  nodes: Array<Consumer_Application_State>;
};

export type Consumer_Application_State_Aggregate_Bool_Exp = {
  count?: InputMaybe<Consumer_Application_State_Aggregate_Bool_Exp_Count>;
};

export type Consumer_Application_State_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Consumer_Application_State_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "consumer_application_state" */
export type Consumer_Application_State_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_Application_State_Max_Fields>;
  min?: Maybe<Consumer_Application_State_Min_Fields>;
};

/** aggregate fields of "consumer_application_state" */
export type Consumer_Application_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "consumer_application_state" */
export type Consumer_Application_State_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Consumer_Application_State_Max_Order_By>;
  min?: InputMaybe<Consumer_Application_State_Min_Order_By>;
};

/** input type for inserting array relation for remote table "consumer_application_state" */
export type Consumer_Application_State_Arr_Rel_Insert_Input = {
  data: Array<Consumer_Application_State_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_Application_State_On_Conflict>;
};

/** Boolean expression to filter rows from the table "consumer_application_state". All fields are combined with a logical 'AND'. */
export type Consumer_Application_State_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_Application_State_Bool_Exp>>;
  _not?: InputMaybe<Consumer_Application_State_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_Application_State_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  application_id?: InputMaybe<String_Comparison_Exp>;
  consumer_application?: InputMaybe<Consumer_Application_Bool_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  statue?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_application_state" */
export type Consumer_Application_State_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_consumer_application_state";

/** input type for inserting data into table "consumer_application_state" */
export type Consumer_Application_State_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  application_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer_application?: InputMaybe<Consumer_Application_Obj_Rel_Insert_Input>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  statue?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_Application_State_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  application_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  statue?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "consumer_application_state" */
export type Consumer_Application_State_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  application_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  statue?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Consumer_Application_State_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  application_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  statue?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "consumer_application_state" */
export type Consumer_Application_State_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  application_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  statue?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "consumer_application_state" */
export type Consumer_Application_State_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_Application_State>;
};

/** on_conflict condition type for table "consumer_application_state" */
export type Consumer_Application_State_On_Conflict = {
  constraint: Consumer_Application_State_Constraint;
  update_columns?: Array<Consumer_Application_State_Update_Column>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_application_state". */
export type Consumer_Application_State_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  application_id?: InputMaybe<Order_By>;
  consumer_application?: InputMaybe<Consumer_Application_Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  statue?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_application_state */
export type Consumer_Application_State_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "consumer_application_state" */
export type Consumer_Application_State_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "application_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "statue";

/** input type for updating data in table "consumer_application_state" */
export type Consumer_Application_State_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  application_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  statue?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "consumer_application_state" */
export type Consumer_Application_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_Application_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_Application_State_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  application_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  statue?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "consumer_application_state" */
export type Consumer_Application_State_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "application_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "statue";

export type Consumer_Application_State_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_Application_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_Application_State_Bool_Exp;
};

/** Streaming cursor of the table "consumer_application" */
export type Consumer_Application_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_Application_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_Application_Stream_Cursor_Value_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "consumer_application" */
export type Consumer_Application_Update_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id";

export type Consumer_Application_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_Application_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_Application_Bool_Exp;
};

/** Boolean expression to filter rows from the table "consumer". All fields are combined with a logical 'AND'. */
export type Consumer_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_Bool_Exp>>;
  _not?: InputMaybe<Consumer_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_Bool_Exp>>;
  collaterals?: InputMaybe<Collateral_Bool_Exp>;
  collaterals_aggregate?: InputMaybe<Collateral_Aggregate_Bool_Exp>;
  consumer_group_members?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
  consumer_group_members_aggregate?: InputMaybe<Consumer_Group_Member_Aggregate_Bool_Exp>;
  consumer_kycs?: InputMaybe<Consumer_Kyc_Bool_Exp>;
  consumer_kycs_aggregate?: InputMaybe<Consumer_Kyc_Aggregate_Bool_Exp>;
  consumer_states?: InputMaybe<Consumer_State_Bool_Exp>;
  consumer_states_aggregate?: InputMaybe<Consumer_State_Aggregate_Bool_Exp>;
  consumer_user_mappings?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
  consumer_user_mappings_aggregate?: InputMaybe<Consumer_User_Mapping_Aggregate_Bool_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  credit_limits?: InputMaybe<Credit_Limit_Bool_Exp>;
  credit_limits_aggregate?: InputMaybe<Credit_Limit_Aggregate_Bool_Exp>;
  guarantors?: InputMaybe<Guarantor_Bool_Exp>;
  guarantors_aggregate?: InputMaybe<Guarantor_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  identity_id?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Json_Comparison_Exp>;
  updated_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer" */
export type Consumer_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_consumers_1";

/** columns and relationships of "consumer_group" */
export type Consumer_Group = {
  active_since_utc: Scalars["timestamptz"]["output"];
  active_until_utc: Scalars["timestamptz"]["output"];
  /** An array relationship */
  consumer_group_members: Array<Consumer_Group_Member>;
  /** An aggregate relationship */
  consumer_group_members_aggregate: Consumer_Group_Member_Aggregate;
  id: Scalars["String"]["output"];
};

/** columns and relationships of "consumer_group" */
export type Consumer_GroupConsumer_Group_MembersArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

/** columns and relationships of "consumer_group" */
export type Consumer_GroupConsumer_Group_Members_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

/** aggregated selection of "consumer_group" */
export type Consumer_Group_Aggregate = {
  aggregate?: Maybe<Consumer_Group_Aggregate_Fields>;
  nodes: Array<Consumer_Group>;
};

/** aggregate fields of "consumer_group" */
export type Consumer_Group_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_Group_Max_Fields>;
  min?: Maybe<Consumer_Group_Min_Fields>;
};

/** aggregate fields of "consumer_group" */
export type Consumer_Group_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_Group_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "consumer_group". All fields are combined with a logical 'AND'. */
export type Consumer_Group_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_Group_Bool_Exp>>;
  _not?: InputMaybe<Consumer_Group_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_Group_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  active_until_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  consumer_group_members?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
  consumer_group_members_aggregate?: InputMaybe<Consumer_Group_Member_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_group" */
export type Consumer_Group_Constraint =
  /** unique or primary key constraint on columns "id" */
  "consumer_group_pkey";

/** input type for inserting data into table "consumer_group" */
export type Consumer_Group_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer_group_members?: InputMaybe<Consumer_Group_Member_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_Group_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
};

/** columns and relationships of "consumer_group_member" */
export type Consumer_Group_Member = {
  /** An object relationship */
  consumer: Consumer;
  /** An object relationship */
  consumer_group: Consumer_Group;
  consumer_group_id: Scalars["String"]["output"];
  consumer_id: Scalars["String"]["output"];
  role: Scalars["consumer_group_member_role_type"]["output"];
};

/** aggregated selection of "consumer_group_member" */
export type Consumer_Group_Member_Aggregate = {
  aggregate?: Maybe<Consumer_Group_Member_Aggregate_Fields>;
  nodes: Array<Consumer_Group_Member>;
};

export type Consumer_Group_Member_Aggregate_Bool_Exp = {
  count?: InputMaybe<Consumer_Group_Member_Aggregate_Bool_Exp_Count>;
};

export type Consumer_Group_Member_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "consumer_group_member" */
export type Consumer_Group_Member_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_Group_Member_Max_Fields>;
  min?: Maybe<Consumer_Group_Member_Min_Fields>;
};

/** aggregate fields of "consumer_group_member" */
export type Consumer_Group_Member_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "consumer_group_member" */
export type Consumer_Group_Member_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Consumer_Group_Member_Max_Order_By>;
  min?: InputMaybe<Consumer_Group_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "consumer_group_member" */
export type Consumer_Group_Member_Arr_Rel_Insert_Input = {
  data: Array<Consumer_Group_Member_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_Group_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "consumer_group_member". All fields are combined with a logical 'AND'. */
export type Consumer_Group_Member_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_Group_Member_Bool_Exp>>;
  _not?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_Group_Member_Bool_Exp>>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  consumer_group?: InputMaybe<Consumer_Group_Bool_Exp>;
  consumer_group_id?: InputMaybe<String_Comparison_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  role?: InputMaybe<Consumer_Group_Member_Role_Type_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_group_member" */
export type Consumer_Group_Member_Constraint =
  /** unique or primary key constraint on columns "consumer_group_id", "consumer_id" */
  "consumer_group_member_pkey";

/** input type for inserting data into table "consumer_group_member" */
export type Consumer_Group_Member_Insert_Input = {
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  consumer_group?: InputMaybe<Consumer_Group_Obj_Rel_Insert_Input>;
  consumer_group_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_Group_Member_Max_Fields = {
  consumer_group_id?: Maybe<Scalars["String"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["consumer_group_member_role_type"]["output"]>;
};

/** order by max() on columns of table "consumer_group_member" */
export type Consumer_Group_Member_Max_Order_By = {
  consumer_group_id?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Consumer_Group_Member_Min_Fields = {
  consumer_group_id?: Maybe<Scalars["String"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["consumer_group_member_role_type"]["output"]>;
};

/** order by min() on columns of table "consumer_group_member" */
export type Consumer_Group_Member_Min_Order_By = {
  consumer_group_id?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "consumer_group_member" */
export type Consumer_Group_Member_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_Group_Member>;
};

/** on_conflict condition type for table "consumer_group_member" */
export type Consumer_Group_Member_On_Conflict = {
  constraint: Consumer_Group_Member_Constraint;
  update_columns?: Array<Consumer_Group_Member_Update_Column>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_group_member". */
export type Consumer_Group_Member_Order_By = {
  consumer?: InputMaybe<Consumer_Order_By>;
  consumer_group?: InputMaybe<Consumer_Group_Order_By>;
  consumer_group_id?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_group_member */
export type Consumer_Group_Member_Pk_Columns_Input = {
  consumer_group_id: Scalars["String"]["input"];
  consumer_id: Scalars["String"]["input"];
};

/** Boolean expression to compare columns of type "consumer_group_member_role_type". All fields are combined with logical 'AND'. */
export type Consumer_Group_Member_Role_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
  _gt?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
  _gte?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["consumer_group_member_role_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
  _lte?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
  _neq?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["consumer_group_member_role_type"]["input"]>>;
};

/** select columns of table "consumer_group_member" */
export type Consumer_Group_Member_Select_Column =
  /** column name */
  | "consumer_group_id"
  /** column name */
  | "consumer_id"
  /** column name */
  | "role";

/** input type for updating data in table "consumer_group_member" */
export type Consumer_Group_Member_Set_Input = {
  consumer_group_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
};

/** Streaming cursor of the table "consumer_group_member" */
export type Consumer_Group_Member_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_Group_Member_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_Group_Member_Stream_Cursor_Value_Input = {
  consumer_group_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["consumer_group_member_role_type"]["input"]>;
};

/** update columns of table "consumer_group_member" */
export type Consumer_Group_Member_Update_Column =
  /** column name */
  | "consumer_group_id"
  /** column name */
  | "consumer_id"
  /** column name */
  | "role";

export type Consumer_Group_Member_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_Group_Member_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_Group_Member_Bool_Exp;
};

/** aggregate min on columns */
export type Consumer_Group_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "consumer_group" */
export type Consumer_Group_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_Group>;
};

/** input type for inserting object relation for remote table "consumer_group" */
export type Consumer_Group_Obj_Rel_Insert_Input = {
  data: Consumer_Group_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_Group_On_Conflict>;
};

/** on_conflict condition type for table "consumer_group" */
export type Consumer_Group_On_Conflict = {
  constraint: Consumer_Group_Constraint;
  update_columns?: Array<Consumer_Group_Update_Column>;
  where?: InputMaybe<Consumer_Group_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_group". */
export type Consumer_Group_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  consumer_group_members_aggregate?: InputMaybe<Consumer_Group_Member_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_group */
export type Consumer_Group_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "consumer_group" */
export type Consumer_Group_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "id";

/** input type for updating data in table "consumer_group" */
export type Consumer_Group_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "consumer_group" */
export type Consumer_Group_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_Group_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_Group_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "consumer_group" */
export type Consumer_Group_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "id";

export type Consumer_Group_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_Group_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_Group_Bool_Exp;
};

/** input type for inserting data into table "consumer" */
export type Consumer_Insert_Input = {
  collaterals?: InputMaybe<Collateral_Arr_Rel_Insert_Input>;
  consumer_group_members?: InputMaybe<Consumer_Group_Member_Arr_Rel_Insert_Input>;
  consumer_kycs?: InputMaybe<Consumer_Kyc_Arr_Rel_Insert_Input>;
  consumer_states?: InputMaybe<Consumer_State_Arr_Rel_Insert_Input>;
  consumer_user_mappings?: InputMaybe<Consumer_User_Mapping_Arr_Rel_Insert_Input>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  credit_limits?: InputMaybe<Credit_Limit_Arr_Rel_Insert_Input>;
  guarantors?: InputMaybe<Guarantor_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  identity_id?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["json"]["input"]>;
  updated_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "consumer_kyc" */
export type Consumer_Kyc = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc: Scalars["timestamptz"]["output"];
  additional_income_units?: Maybe<Scalars["Int"]["output"]>;
  car_type?: Maybe<Scalars["String"]["output"]>;
  city_of_birth?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  company?: Maybe<Company>;
  company_id?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  consumer: Consumer;
  consumer_id: Scalars["String"]["output"];
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  insurance_type?: Maybe<Scalars["String"]["output"]>;
  job_title?: Maybe<Scalars["String"]["output"]>;
  primary_income_units?: Maybe<Scalars["Int"]["output"]>;
  work_type?: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "consumer_kyc" */
export type Consumer_Kyc_Aggregate = {
  aggregate?: Maybe<Consumer_Kyc_Aggregate_Fields>;
  nodes: Array<Consumer_Kyc>;
};

export type Consumer_Kyc_Aggregate_Bool_Exp = {
  count?: InputMaybe<Consumer_Kyc_Aggregate_Bool_Exp_Count>;
};

export type Consumer_Kyc_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Consumer_Kyc_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "consumer_kyc" */
export type Consumer_Kyc_Aggregate_Fields = {
  avg?: Maybe<Consumer_Kyc_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_Kyc_Max_Fields>;
  min?: Maybe<Consumer_Kyc_Min_Fields>;
  stddev?: Maybe<Consumer_Kyc_Stddev_Fields>;
  stddev_pop?: Maybe<Consumer_Kyc_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Consumer_Kyc_Stddev_Samp_Fields>;
  sum?: Maybe<Consumer_Kyc_Sum_Fields>;
  var_pop?: Maybe<Consumer_Kyc_Var_Pop_Fields>;
  var_samp?: Maybe<Consumer_Kyc_Var_Samp_Fields>;
  variance?: Maybe<Consumer_Kyc_Variance_Fields>;
};

/** aggregate fields of "consumer_kyc" */
export type Consumer_Kyc_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "consumer_kyc" */
export type Consumer_Kyc_Aggregate_Order_By = {
  avg?: InputMaybe<Consumer_Kyc_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Consumer_Kyc_Max_Order_By>;
  min?: InputMaybe<Consumer_Kyc_Min_Order_By>;
  stddev?: InputMaybe<Consumer_Kyc_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Consumer_Kyc_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Consumer_Kyc_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Consumer_Kyc_Sum_Order_By>;
  var_pop?: InputMaybe<Consumer_Kyc_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Consumer_Kyc_Var_Samp_Order_By>;
  variance?: InputMaybe<Consumer_Kyc_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "consumer_kyc" */
export type Consumer_Kyc_Arr_Rel_Insert_Input = {
  data: Array<Consumer_Kyc_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_Kyc_On_Conflict>;
};

/** aggregate avg on columns */
export type Consumer_Kyc_Avg_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Avg_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "consumer_kyc". All fields are combined with a logical 'AND'. */
export type Consumer_Kyc_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_Kyc_Bool_Exp>>;
  _not?: InputMaybe<Consumer_Kyc_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_Kyc_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  active_until_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  additional_income_units?: InputMaybe<Int_Comparison_Exp>;
  car_type?: InputMaybe<String_Comparison_Exp>;
  city_of_birth?: InputMaybe<String_Comparison_Exp>;
  company?: InputMaybe<Company_Bool_Exp>;
  company_id?: InputMaybe<String_Comparison_Exp>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  insurance_type?: InputMaybe<String_Comparison_Exp>;
  job_title?: InputMaybe<String_Comparison_Exp>;
  primary_income_units?: InputMaybe<Int_Comparison_Exp>;
  work_type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_kyc" */
export type Consumer_Kyc_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_consumer_kyc";

/** input type for incrementing numeric columns in table "consumer_kyc" */
export type Consumer_Kyc_Inc_Input = {
  additional_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  primary_income_units?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "consumer_kyc" */
export type Consumer_Kyc_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  additional_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  car_type?: InputMaybe<Scalars["String"]["input"]>;
  city_of_birth?: InputMaybe<Scalars["String"]["input"]>;
  company?: InputMaybe<Company_Obj_Rel_Insert_Input>;
  company_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  insurance_type?: InputMaybe<Scalars["String"]["input"]>;
  job_title?: InputMaybe<Scalars["String"]["input"]>;
  primary_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  work_type?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_Kyc_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  additional_income_units?: Maybe<Scalars["Int"]["output"]>;
  car_type?: Maybe<Scalars["String"]["output"]>;
  city_of_birth?: Maybe<Scalars["String"]["output"]>;
  company_id?: Maybe<Scalars["String"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  insurance_type?: Maybe<Scalars["String"]["output"]>;
  job_title?: Maybe<Scalars["String"]["output"]>;
  primary_income_units?: Maybe<Scalars["Int"]["output"]>;
  work_type?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  additional_income_units?: InputMaybe<Order_By>;
  car_type?: InputMaybe<Order_By>;
  city_of_birth?: InputMaybe<Order_By>;
  company_id?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  insurance_type?: InputMaybe<Order_By>;
  job_title?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
  work_type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Consumer_Kyc_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  additional_income_units?: Maybe<Scalars["Int"]["output"]>;
  car_type?: Maybe<Scalars["String"]["output"]>;
  city_of_birth?: Maybe<Scalars["String"]["output"]>;
  company_id?: Maybe<Scalars["String"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  insurance_type?: Maybe<Scalars["String"]["output"]>;
  job_title?: Maybe<Scalars["String"]["output"]>;
  primary_income_units?: Maybe<Scalars["Int"]["output"]>;
  work_type?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  additional_income_units?: InputMaybe<Order_By>;
  car_type?: InputMaybe<Order_By>;
  city_of_birth?: InputMaybe<Order_By>;
  company_id?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  insurance_type?: InputMaybe<Order_By>;
  job_title?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
  work_type?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "consumer_kyc" */
export type Consumer_Kyc_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_Kyc>;
};

/** on_conflict condition type for table "consumer_kyc" */
export type Consumer_Kyc_On_Conflict = {
  constraint: Consumer_Kyc_Constraint;
  update_columns?: Array<Consumer_Kyc_Update_Column>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_kyc". */
export type Consumer_Kyc_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  additional_income_units?: InputMaybe<Order_By>;
  car_type?: InputMaybe<Order_By>;
  city_of_birth?: InputMaybe<Order_By>;
  company?: InputMaybe<Company_Order_By>;
  company_id?: InputMaybe<Order_By>;
  consumer?: InputMaybe<Consumer_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  insurance_type?: InputMaybe<Order_By>;
  job_title?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
  work_type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_kyc */
export type Consumer_Kyc_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "consumer_kyc" */
export type Consumer_Kyc_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "additional_income_units"
  /** column name */
  | "car_type"
  /** column name */
  | "city_of_birth"
  /** column name */
  | "company_id"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "insurance_type"
  /** column name */
  | "job_title"
  /** column name */
  | "primary_income_units"
  /** column name */
  | "work_type";

/** input type for updating data in table "consumer_kyc" */
export type Consumer_Kyc_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  additional_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  car_type?: InputMaybe<Scalars["String"]["input"]>;
  city_of_birth?: InputMaybe<Scalars["String"]["input"]>;
  company_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  insurance_type?: InputMaybe<Scalars["String"]["input"]>;
  job_title?: InputMaybe<Scalars["String"]["input"]>;
  primary_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  work_type?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Consumer_Kyc_Stddev_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Stddev_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Consumer_Kyc_Stddev_Pop_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Stddev_Pop_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Consumer_Kyc_Stddev_Samp_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Stddev_Samp_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "consumer_kyc" */
export type Consumer_Kyc_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_Kyc_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_Kyc_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  additional_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  car_type?: InputMaybe<Scalars["String"]["input"]>;
  city_of_birth?: InputMaybe<Scalars["String"]["input"]>;
  company_id?: InputMaybe<Scalars["String"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  insurance_type?: InputMaybe<Scalars["String"]["input"]>;
  job_title?: InputMaybe<Scalars["String"]["input"]>;
  primary_income_units?: InputMaybe<Scalars["Int"]["input"]>;
  work_type?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Consumer_Kyc_Sum_Fields = {
  additional_income_units?: Maybe<Scalars["Int"]["output"]>;
  primary_income_units?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Sum_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** update columns of table "consumer_kyc" */
export type Consumer_Kyc_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "additional_income_units"
  /** column name */
  | "car_type"
  /** column name */
  | "city_of_birth"
  /** column name */
  | "company_id"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "insurance_type"
  /** column name */
  | "job_title"
  /** column name */
  | "primary_income_units"
  /** column name */
  | "work_type";

export type Consumer_Kyc_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Consumer_Kyc_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_Kyc_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_Kyc_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Consumer_Kyc_Var_Pop_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Var_Pop_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Consumer_Kyc_Var_Samp_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Var_Samp_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Consumer_Kyc_Variance_Fields = {
  additional_income_units?: Maybe<Scalars["Float"]["output"]>;
  primary_income_units?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "consumer_kyc" */
export type Consumer_Kyc_Variance_Order_By = {
  additional_income_units?: InputMaybe<Order_By>;
  primary_income_units?: InputMaybe<Order_By>;
};

/** aggregate max on columns */
export type Consumer_Max_Fields = {
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  identity_id?: Maybe<Scalars["String"]["output"]>;
  updated_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_by?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Consumer_Min_Fields = {
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  identity_id?: Maybe<Scalars["String"]["output"]>;
  updated_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_by?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "consumer" */
export type Consumer_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer>;
};

/** input type for inserting object relation for remote table "consumer" */
export type Consumer_Obj_Rel_Insert_Input = {
  data: Consumer_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_On_Conflict>;
};

/** on_conflict condition type for table "consumer" */
export type Consumer_On_Conflict = {
  constraint: Consumer_Constraint;
  update_columns?: Array<Consumer_Update_Column>;
  where?: InputMaybe<Consumer_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer". */
export type Consumer_Order_By = {
  collaterals_aggregate?: InputMaybe<Collateral_Aggregate_Order_By>;
  consumer_group_members_aggregate?: InputMaybe<Consumer_Group_Member_Aggregate_Order_By>;
  consumer_kycs_aggregate?: InputMaybe<Consumer_Kyc_Aggregate_Order_By>;
  consumer_states_aggregate?: InputMaybe<Consumer_State_Aggregate_Order_By>;
  consumer_user_mappings_aggregate?: InputMaybe<Consumer_User_Mapping_Aggregate_Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  credit_limits_aggregate?: InputMaybe<Credit_Limit_Aggregate_Order_By>;
  guarantors_aggregate?: InputMaybe<Guarantor_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  updated_at_utc?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer */
export type Consumer_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "consumer" */
export type Consumer_Select_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "identity_id"
  /** column name */
  | "metadata"
  /** column name */
  | "updated_at_utc"
  /** column name */
  | "updated_by";

/** input type for updating data in table "consumer" */
export type Consumer_Set_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  identity_id?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["json"]["input"]>;
  updated_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "consumer_state" */
export type Consumer_State = {
  active_since_utc: Scalars["timestamptz"]["output"];
  /** An object relationship */
  consumer: Consumer;
  consumer_id: Scalars["String"]["output"];
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  state: Scalars["consumer_state_type"]["output"];
};

/** aggregated selection of "consumer_state" */
export type Consumer_State_Aggregate = {
  aggregate?: Maybe<Consumer_State_Aggregate_Fields>;
  nodes: Array<Consumer_State>;
};

export type Consumer_State_Aggregate_Bool_Exp = {
  count?: InputMaybe<Consumer_State_Aggregate_Bool_Exp_Count>;
};

export type Consumer_State_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Consumer_State_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Consumer_State_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "consumer_state" */
export type Consumer_State_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_State_Max_Fields>;
  min?: Maybe<Consumer_State_Min_Fields>;
};

/** aggregate fields of "consumer_state" */
export type Consumer_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_State_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "consumer_state" */
export type Consumer_State_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Consumer_State_Max_Order_By>;
  min?: InputMaybe<Consumer_State_Min_Order_By>;
};

/** input type for inserting array relation for remote table "consumer_state" */
export type Consumer_State_Arr_Rel_Insert_Input = {
  data: Array<Consumer_State_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_State_On_Conflict>;
};

/** Boolean expression to filter rows from the table "consumer_state". All fields are combined with a logical 'AND'. */
export type Consumer_State_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_State_Bool_Exp>>;
  _not?: InputMaybe<Consumer_State_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_State_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<Consumer_State_Type_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_state" */
export type Consumer_State_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_consumer_state";

/** input type for inserting data into table "consumer_state" */
export type Consumer_State_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_State_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["consumer_state_type"]["output"]>;
};

/** order by max() on columns of table "consumer_state" */
export type Consumer_State_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Consumer_State_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["consumer_state_type"]["output"]>;
};

/** order by min() on columns of table "consumer_state" */
export type Consumer_State_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "consumer_state" */
export type Consumer_State_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_State>;
};

/** on_conflict condition type for table "consumer_state" */
export type Consumer_State_On_Conflict = {
  constraint: Consumer_State_Constraint;
  update_columns?: Array<Consumer_State_Update_Column>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_state". */
export type Consumer_State_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  consumer?: InputMaybe<Consumer_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_state */
export type Consumer_State_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "consumer_state" */
export type Consumer_State_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "state";

/** input type for updating data in table "consumer_state" */
export type Consumer_State_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
};

/** Streaming cursor of the table "consumer_state" */
export type Consumer_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_State_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
};

/** Boolean expression to compare columns of type "consumer_state_type". All fields are combined with logical 'AND'. */
export type Consumer_State_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
  _gt?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
  _gte?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["consumer_state_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
  _lte?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
  _neq?: InputMaybe<Scalars["consumer_state_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["consumer_state_type"]["input"]>>;
};

/** update columns of table "consumer_state" */
export type Consumer_State_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "state";

export type Consumer_State_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_State_Bool_Exp;
};

/** Streaming cursor of the table "consumer" */
export type Consumer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_Stream_Cursor_Value_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  identity_id?: InputMaybe<Scalars["String"]["input"]>;
  metadata?: InputMaybe<Scalars["json"]["input"]>;
  updated_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "consumer" */
export type Consumer_Update_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "identity_id"
  /** column name */
  | "metadata"
  /** column name */
  | "updated_at_utc"
  /** column name */
  | "updated_by";

export type Consumer_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_Bool_Exp;
};

/** columns and relationships of "consumer_user_mapping" */
export type Consumer_User_Mapping = {
  /** An object relationship */
  consumer: Consumer;
  consumer_id: Scalars["String"]["output"];
  /** An object relationship */
  user_detail: User_Detail;
  user_id: Scalars["String"]["output"];
};

/** aggregated selection of "consumer_user_mapping" */
export type Consumer_User_Mapping_Aggregate = {
  aggregate?: Maybe<Consumer_User_Mapping_Aggregate_Fields>;
  nodes: Array<Consumer_User_Mapping>;
};

export type Consumer_User_Mapping_Aggregate_Bool_Exp = {
  count?: InputMaybe<Consumer_User_Mapping_Aggregate_Bool_Exp_Count>;
};

export type Consumer_User_Mapping_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "consumer_user_mapping" */
export type Consumer_User_Mapping_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Consumer_User_Mapping_Max_Fields>;
  min?: Maybe<Consumer_User_Mapping_Min_Fields>;
};

/** aggregate fields of "consumer_user_mapping" */
export type Consumer_User_Mapping_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "consumer_user_mapping" */
export type Consumer_User_Mapping_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Consumer_User_Mapping_Max_Order_By>;
  min?: InputMaybe<Consumer_User_Mapping_Min_Order_By>;
};

/** input type for inserting array relation for remote table "consumer_user_mapping" */
export type Consumer_User_Mapping_Arr_Rel_Insert_Input = {
  data: Array<Consumer_User_Mapping_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Consumer_User_Mapping_On_Conflict>;
};

/** Boolean expression to filter rows from the table "consumer_user_mapping". All fields are combined with a logical 'AND'. */
export type Consumer_User_Mapping_Bool_Exp = {
  _and?: InputMaybe<Array<Consumer_User_Mapping_Bool_Exp>>;
  _not?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
  _or?: InputMaybe<Array<Consumer_User_Mapping_Bool_Exp>>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  user_detail?: InputMaybe<User_Detail_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "consumer_user_mapping" */
export type Consumer_User_Mapping_Constraint =
  /** unique or primary key constraint on columns "user_id", "consumer_id" */
  "consumer_user_mapping_pkey";

/** input type for inserting data into table "consumer_user_mapping" */
export type Consumer_User_Mapping_Insert_Input = {
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  user_detail?: InputMaybe<User_Detail_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Consumer_User_Mapping_Max_Fields = {
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "consumer_user_mapping" */
export type Consumer_User_Mapping_Max_Order_By = {
  consumer_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Consumer_User_Mapping_Min_Fields = {
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "consumer_user_mapping" */
export type Consumer_User_Mapping_Min_Order_By = {
  consumer_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "consumer_user_mapping" */
export type Consumer_User_Mapping_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Consumer_User_Mapping>;
};

/** on_conflict condition type for table "consumer_user_mapping" */
export type Consumer_User_Mapping_On_Conflict = {
  constraint: Consumer_User_Mapping_Constraint;
  update_columns?: Array<Consumer_User_Mapping_Update_Column>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

/** Ordering options when selecting data from "consumer_user_mapping". */
export type Consumer_User_Mapping_Order_By = {
  consumer?: InputMaybe<Consumer_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  user_detail?: InputMaybe<User_Detail_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: consumer_user_mapping */
export type Consumer_User_Mapping_Pk_Columns_Input = {
  consumer_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

/** select columns of table "consumer_user_mapping" */
export type Consumer_User_Mapping_Select_Column =
  /** column name */
  | "consumer_id"
  /** column name */
  | "user_id";

/** input type for updating data in table "consumer_user_mapping" */
export type Consumer_User_Mapping_Set_Input = {
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "consumer_user_mapping" */
export type Consumer_User_Mapping_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Consumer_User_Mapping_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Consumer_User_Mapping_Stream_Cursor_Value_Input = {
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "consumer_user_mapping" */
export type Consumer_User_Mapping_Update_Column =
  /** column name */
  | "consumer_id"
  /** column name */
  | "user_id";

export type Consumer_User_Mapping_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Consumer_User_Mapping_Set_Input>;
  /** filter the rows which have to be updated */
  where: Consumer_User_Mapping_Bool_Exp;
};

/** columns and relationships of "credit_limit" */
export type Credit_Limit = {
  active_since_utc: Scalars["timestamptz"]["output"];
  /** An object relationship */
  consumer: Consumer;
  consumer_id: Scalars["String"]["output"];
  created_at_utc: Scalars["timestamptz"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  monthly_max_limit: Scalars["Int"]["output"];
  scoring_file_id: Scalars["String"]["output"];
  total_max_limit: Scalars["Int"]["output"];
};

/** aggregated selection of "credit_limit" */
export type Credit_Limit_Aggregate = {
  aggregate?: Maybe<Credit_Limit_Aggregate_Fields>;
  nodes: Array<Credit_Limit>;
};

export type Credit_Limit_Aggregate_Bool_Exp = {
  count?: InputMaybe<Credit_Limit_Aggregate_Bool_Exp_Count>;
};

export type Credit_Limit_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Credit_Limit_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "credit_limit" */
export type Credit_Limit_Aggregate_Fields = {
  avg?: Maybe<Credit_Limit_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Credit_Limit_Max_Fields>;
  min?: Maybe<Credit_Limit_Min_Fields>;
  stddev?: Maybe<Credit_Limit_Stddev_Fields>;
  stddev_pop?: Maybe<Credit_Limit_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Credit_Limit_Stddev_Samp_Fields>;
  sum?: Maybe<Credit_Limit_Sum_Fields>;
  var_pop?: Maybe<Credit_Limit_Var_Pop_Fields>;
  var_samp?: Maybe<Credit_Limit_Var_Samp_Fields>;
  variance?: Maybe<Credit_Limit_Variance_Fields>;
};

/** aggregate fields of "credit_limit" */
export type Credit_Limit_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "credit_limit" */
export type Credit_Limit_Aggregate_Order_By = {
  avg?: InputMaybe<Credit_Limit_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Credit_Limit_Max_Order_By>;
  min?: InputMaybe<Credit_Limit_Min_Order_By>;
  stddev?: InputMaybe<Credit_Limit_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Credit_Limit_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Credit_Limit_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Credit_Limit_Sum_Order_By>;
  var_pop?: InputMaybe<Credit_Limit_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Credit_Limit_Var_Samp_Order_By>;
  variance?: InputMaybe<Credit_Limit_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "credit_limit" */
export type Credit_Limit_Arr_Rel_Insert_Input = {
  data: Array<Credit_Limit_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Credit_Limit_On_Conflict>;
};

/** aggregate avg on columns */
export type Credit_Limit_Avg_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "credit_limit" */
export type Credit_Limit_Avg_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "credit_limit". All fields are combined with a logical 'AND'. */
export type Credit_Limit_Bool_Exp = {
  _and?: InputMaybe<Array<Credit_Limit_Bool_Exp>>;
  _not?: InputMaybe<Credit_Limit_Bool_Exp>;
  _or?: InputMaybe<Array<Credit_Limit_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  consumer_id?: InputMaybe<String_Comparison_Exp>;
  created_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  monthly_max_limit?: InputMaybe<Int_Comparison_Exp>;
  scoring_file_id?: InputMaybe<String_Comparison_Exp>;
  total_max_limit?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "credit_limit" */
export type Credit_Limit_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_credit_limit";

/** input type for incrementing numeric columns in table "credit_limit" */
export type Credit_Limit_Inc_Input = {
  monthly_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
  total_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "credit_limit" */
export type Credit_Limit_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  monthly_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
  scoring_file_id?: InputMaybe<Scalars["String"]["input"]>;
  total_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type Credit_Limit_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  monthly_max_limit?: Maybe<Scalars["Int"]["output"]>;
  scoring_file_id?: Maybe<Scalars["String"]["output"]>;
  total_max_limit?: Maybe<Scalars["Int"]["output"]>;
};

/** order by max() on columns of table "credit_limit" */
export type Credit_Limit_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  monthly_max_limit?: InputMaybe<Order_By>;
  scoring_file_id?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Credit_Limit_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  consumer_id?: Maybe<Scalars["String"]["output"]>;
  created_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  monthly_max_limit?: Maybe<Scalars["Int"]["output"]>;
  scoring_file_id?: Maybe<Scalars["String"]["output"]>;
  total_max_limit?: Maybe<Scalars["Int"]["output"]>;
};

/** order by min() on columns of table "credit_limit" */
export type Credit_Limit_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  monthly_max_limit?: InputMaybe<Order_By>;
  scoring_file_id?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "credit_limit" */
export type Credit_Limit_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Credit_Limit>;
};

/** on_conflict condition type for table "credit_limit" */
export type Credit_Limit_On_Conflict = {
  constraint: Credit_Limit_Constraint;
  update_columns?: Array<Credit_Limit_Update_Column>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

/** Ordering options when selecting data from "credit_limit". */
export type Credit_Limit_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  consumer?: InputMaybe<Consumer_Order_By>;
  consumer_id?: InputMaybe<Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  monthly_max_limit?: InputMaybe<Order_By>;
  scoring_file_id?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** primary key columns input for table: credit_limit */
export type Credit_Limit_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "credit_limit" */
export type Credit_Limit_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "monthly_max_limit"
  /** column name */
  | "scoring_file_id"
  /** column name */
  | "total_max_limit";

/** input type for updating data in table "credit_limit" */
export type Credit_Limit_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  monthly_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
  scoring_file_id?: InputMaybe<Scalars["String"]["input"]>;
  total_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type Credit_Limit_Stddev_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "credit_limit" */
export type Credit_Limit_Stddev_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Credit_Limit_Stddev_Pop_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "credit_limit" */
export type Credit_Limit_Stddev_Pop_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Credit_Limit_Stddev_Samp_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "credit_limit" */
export type Credit_Limit_Stddev_Samp_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "credit_limit" */
export type Credit_Limit_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Credit_Limit_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Credit_Limit_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  monthly_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
  scoring_file_id?: InputMaybe<Scalars["String"]["input"]>;
  total_max_limit?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type Credit_Limit_Sum_Fields = {
  monthly_max_limit?: Maybe<Scalars["Int"]["output"]>;
  total_max_limit?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "credit_limit" */
export type Credit_Limit_Sum_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** update columns of table "credit_limit" */
export type Credit_Limit_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "consumer_id"
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "monthly_max_limit"
  /** column name */
  | "scoring_file_id"
  /** column name */
  | "total_max_limit";

export type Credit_Limit_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Credit_Limit_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Credit_Limit_Set_Input>;
  /** filter the rows which have to be updated */
  where: Credit_Limit_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Credit_Limit_Var_Pop_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "credit_limit" */
export type Credit_Limit_Var_Pop_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Credit_Limit_Var_Samp_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "credit_limit" */
export type Credit_Limit_Var_Samp_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Credit_Limit_Variance_Fields = {
  monthly_max_limit?: Maybe<Scalars["Float"]["output"]>;
  total_max_limit?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "credit_limit" */
export type Credit_Limit_Variance_Order_By = {
  monthly_max_limit?: InputMaybe<Order_By>;
  total_max_limit?: InputMaybe<Order_By>;
};

/** ordering argument of a cursor */
export type Cursor_Ordering =
  /** ascending ordering of the cursor */
  | "ASC"
  /** descending ordering of the cursor */
  | "DESC";

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["date"]["input"]>;
  _gt?: InputMaybe<Scalars["date"]["input"]>;
  _gte?: InputMaybe<Scalars["date"]["input"]>;
  _in?: InputMaybe<Array<Scalars["date"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["date"]["input"]>;
  _lte?: InputMaybe<Scalars["date"]["input"]>;
  _neq?: InputMaybe<Scalars["date"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["date"]["input"]>>;
};

/** Boolean expression to compare columns of type "gender_type". All fields are combined with logical 'AND'. */
export type Gender_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["gender_type"]["input"]>;
  _gt?: InputMaybe<Scalars["gender_type"]["input"]>;
  _gte?: InputMaybe<Scalars["gender_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["gender_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["gender_type"]["input"]>;
  _lte?: InputMaybe<Scalars["gender_type"]["input"]>;
  _neq?: InputMaybe<Scalars["gender_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["gender_type"]["input"]>>;
};

/** columns and relationships of "guarantor" */
export type Guarantor = {
  active_since_utc: Scalars["timestamptz"]["output"];
  active_until_utc: Scalars["timestamptz"]["output"];
  /** An object relationship */
  consumer: Consumer;
  guarantor_of: Scalars["String"]["output"];
  guarantor_relation: Scalars["gurantor_relation_type"]["output"];
  /** An array relationship */
  guarantor_user_mappings: Array<Guarantor_User_Mapping>;
  /** An aggregate relationship */
  guarantor_user_mappings_aggregate: Guarantor_User_Mapping_Aggregate;
  id: Scalars["String"]["output"];
  reason_of_deactivation?: Maybe<
    Scalars["guarantor_deactivation_reason_type"]["output"]
  >;
};

/** columns and relationships of "guarantor" */
export type GuarantorGuarantor_User_MappingsArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "guarantor" */
export type GuarantorGuarantor_User_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

/** aggregated selection of "guarantor" */
export type Guarantor_Aggregate = {
  aggregate?: Maybe<Guarantor_Aggregate_Fields>;
  nodes: Array<Guarantor>;
};

export type Guarantor_Aggregate_Bool_Exp = {
  count?: InputMaybe<Guarantor_Aggregate_Bool_Exp_Count>;
};

export type Guarantor_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Guarantor_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Guarantor_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "guarantor" */
export type Guarantor_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Guarantor_Max_Fields>;
  min?: Maybe<Guarantor_Min_Fields>;
};

/** aggregate fields of "guarantor" */
export type Guarantor_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Guarantor_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "guarantor" */
export type Guarantor_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Guarantor_Max_Order_By>;
  min?: InputMaybe<Guarantor_Min_Order_By>;
};

/** input type for inserting array relation for remote table "guarantor" */
export type Guarantor_Arr_Rel_Insert_Input = {
  data: Array<Guarantor_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Guarantor_On_Conflict>;
};

/** Boolean expression to filter rows from the table "guarantor". All fields are combined with a logical 'AND'. */
export type Guarantor_Bool_Exp = {
  _and?: InputMaybe<Array<Guarantor_Bool_Exp>>;
  _not?: InputMaybe<Guarantor_Bool_Exp>;
  _or?: InputMaybe<Array<Guarantor_Bool_Exp>>;
  active_since_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  active_until_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  consumer?: InputMaybe<Consumer_Bool_Exp>;
  guarantor_of?: InputMaybe<String_Comparison_Exp>;
  guarantor_relation?: InputMaybe<Gurantor_Relation_Type_Comparison_Exp>;
  guarantor_user_mappings?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
  guarantor_user_mappings_aggregate?: InputMaybe<Guarantor_User_Mapping_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  reason_of_deactivation?: InputMaybe<Guarantor_Deactivation_Reason_Type_Comparison_Exp>;
};

/** unique or primary key constraints on table "guarantor" */
export type Guarantor_Constraint =
  /** unique or primary key constraint on columns "id" */
  "guarantor_pkey";

/** Boolean expression to compare columns of type "guarantor_deactivation_reason_type". All fields are combined with logical 'AND'. */
export type Guarantor_Deactivation_Reason_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["guarantor_deactivation_reason_type"]["input"]>;
  _gt?: InputMaybe<Scalars["guarantor_deactivation_reason_type"]["input"]>;
  _gte?: InputMaybe<Scalars["guarantor_deactivation_reason_type"]["input"]>;
  _in?: InputMaybe<
    Array<Scalars["guarantor_deactivation_reason_type"]["input"]>
  >;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["guarantor_deactivation_reason_type"]["input"]>;
  _lte?: InputMaybe<Scalars["guarantor_deactivation_reason_type"]["input"]>;
  _neq?: InputMaybe<Scalars["guarantor_deactivation_reason_type"]["input"]>;
  _nin?: InputMaybe<
    Array<Scalars["guarantor_deactivation_reason_type"]["input"]>
  >;
};

/** input type for inserting data into table "guarantor" */
export type Guarantor_Insert_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  consumer?: InputMaybe<Consumer_Obj_Rel_Insert_Input>;
  guarantor_of?: InputMaybe<Scalars["String"]["input"]>;
  guarantor_relation?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  guarantor_user_mappings?: InputMaybe<Guarantor_User_Mapping_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  reason_of_deactivation?: InputMaybe<
    Scalars["guarantor_deactivation_reason_type"]["input"]
  >;
};

/** aggregate max on columns */
export type Guarantor_Max_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  guarantor_of?: Maybe<Scalars["String"]["output"]>;
  guarantor_relation?: Maybe<Scalars["gurantor_relation_type"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  reason_of_deactivation?: Maybe<
    Scalars["guarantor_deactivation_reason_type"]["output"]
  >;
};

/** order by max() on columns of table "guarantor" */
export type Guarantor_Max_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  guarantor_of?: InputMaybe<Order_By>;
  guarantor_relation?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reason_of_deactivation?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Guarantor_Min_Fields = {
  active_since_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  active_until_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  guarantor_of?: Maybe<Scalars["String"]["output"]>;
  guarantor_relation?: Maybe<Scalars["gurantor_relation_type"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  reason_of_deactivation?: Maybe<
    Scalars["guarantor_deactivation_reason_type"]["output"]
  >;
};

/** order by min() on columns of table "guarantor" */
export type Guarantor_Min_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  guarantor_of?: InputMaybe<Order_By>;
  guarantor_relation?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  reason_of_deactivation?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "guarantor" */
export type Guarantor_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Guarantor>;
};

/** input type for inserting object relation for remote table "guarantor" */
export type Guarantor_Obj_Rel_Insert_Input = {
  data: Guarantor_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Guarantor_On_Conflict>;
};

/** on_conflict condition type for table "guarantor" */
export type Guarantor_On_Conflict = {
  constraint: Guarantor_Constraint;
  update_columns?: Array<Guarantor_Update_Column>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

/** Ordering options when selecting data from "guarantor". */
export type Guarantor_Order_By = {
  active_since_utc?: InputMaybe<Order_By>;
  active_until_utc?: InputMaybe<Order_By>;
  consumer?: InputMaybe<Consumer_Order_By>;
  guarantor_of?: InputMaybe<Order_By>;
  guarantor_relation?: InputMaybe<Order_By>;
  guarantor_user_mappings_aggregate?: InputMaybe<Guarantor_User_Mapping_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  reason_of_deactivation?: InputMaybe<Order_By>;
};

/** primary key columns input for table: guarantor */
export type Guarantor_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "guarantor" */
export type Guarantor_Select_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "guarantor_of"
  /** column name */
  | "guarantor_relation"
  /** column name */
  | "id"
  /** column name */
  | "reason_of_deactivation";

/** input type for updating data in table "guarantor" */
export type Guarantor_Set_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  guarantor_of?: InputMaybe<Scalars["String"]["input"]>;
  guarantor_relation?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  reason_of_deactivation?: InputMaybe<
    Scalars["guarantor_deactivation_reason_type"]["input"]
  >;
};

/** Streaming cursor of the table "guarantor" */
export type Guarantor_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Guarantor_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Guarantor_Stream_Cursor_Value_Input = {
  active_since_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  active_until_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  guarantor_of?: InputMaybe<Scalars["String"]["input"]>;
  guarantor_relation?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  reason_of_deactivation?: InputMaybe<
    Scalars["guarantor_deactivation_reason_type"]["input"]
  >;
};

/** update columns of table "guarantor" */
export type Guarantor_Update_Column =
  /** column name */
  | "active_since_utc"
  /** column name */
  | "active_until_utc"
  /** column name */
  | "guarantor_of"
  /** column name */
  | "guarantor_relation"
  /** column name */
  | "id"
  /** column name */
  | "reason_of_deactivation";

export type Guarantor_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Guarantor_Set_Input>;
  /** filter the rows which have to be updated */
  where: Guarantor_Bool_Exp;
};

/** columns and relationships of "guarantor_user_mapping" */
export type Guarantor_User_Mapping = {
  /** An object relationship */
  guarantor: Guarantor;
  guarantor_id: Scalars["String"]["output"];
  /** An object relationship */
  user_detail: User_Detail;
  user_id: Scalars["String"]["output"];
};

/** aggregated selection of "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Aggregate = {
  aggregate?: Maybe<Guarantor_User_Mapping_Aggregate_Fields>;
  nodes: Array<Guarantor_User_Mapping>;
};

export type Guarantor_User_Mapping_Aggregate_Bool_Exp = {
  count?: InputMaybe<Guarantor_User_Mapping_Aggregate_Bool_Exp_Count>;
};

export type Guarantor_User_Mapping_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Guarantor_User_Mapping_Max_Fields>;
  min?: Maybe<Guarantor_User_Mapping_Min_Fields>;
};

/** aggregate fields of "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Guarantor_User_Mapping_Max_Order_By>;
  min?: InputMaybe<Guarantor_User_Mapping_Min_Order_By>;
};

/** input type for inserting array relation for remote table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Arr_Rel_Insert_Input = {
  data: Array<Guarantor_User_Mapping_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Guarantor_User_Mapping_On_Conflict>;
};

/** Boolean expression to filter rows from the table "guarantor_user_mapping". All fields are combined with a logical 'AND'. */
export type Guarantor_User_Mapping_Bool_Exp = {
  _and?: InputMaybe<Array<Guarantor_User_Mapping_Bool_Exp>>;
  _not?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
  _or?: InputMaybe<Array<Guarantor_User_Mapping_Bool_Exp>>;
  guarantor?: InputMaybe<Guarantor_Bool_Exp>;
  guarantor_id?: InputMaybe<String_Comparison_Exp>;
  user_detail?: InputMaybe<User_Detail_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Constraint =
  /** unique or primary key constraint on columns "user_id", "guarantor_id" */
  "guarantor_user_mapping_pkey";

/** input type for inserting data into table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Insert_Input = {
  guarantor?: InputMaybe<Guarantor_Obj_Rel_Insert_Input>;
  guarantor_id?: InputMaybe<Scalars["String"]["input"]>;
  user_detail?: InputMaybe<User_Detail_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Guarantor_User_Mapping_Max_Fields = {
  guarantor_id?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Max_Order_By = {
  guarantor_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Guarantor_User_Mapping_Min_Fields = {
  guarantor_id?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Min_Order_By = {
  guarantor_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Guarantor_User_Mapping>;
};

/** on_conflict condition type for table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_On_Conflict = {
  constraint: Guarantor_User_Mapping_Constraint;
  update_columns?: Array<Guarantor_User_Mapping_Update_Column>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

/** Ordering options when selecting data from "guarantor_user_mapping". */
export type Guarantor_User_Mapping_Order_By = {
  guarantor?: InputMaybe<Guarantor_Order_By>;
  guarantor_id?: InputMaybe<Order_By>;
  user_detail?: InputMaybe<User_Detail_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: guarantor_user_mapping */
export type Guarantor_User_Mapping_Pk_Columns_Input = {
  guarantor_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

/** select columns of table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Select_Column =
  /** column name */
  | "guarantor_id"
  /** column name */
  | "user_id";

/** input type for updating data in table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Set_Input = {
  guarantor_id?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Guarantor_User_Mapping_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Guarantor_User_Mapping_Stream_Cursor_Value_Input = {
  guarantor_id?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "guarantor_user_mapping" */
export type Guarantor_User_Mapping_Update_Column =
  /** column name */
  | "guarantor_id"
  /** column name */
  | "user_id";

export type Guarantor_User_Mapping_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Guarantor_User_Mapping_Set_Input>;
  /** filter the rows which have to be updated */
  where: Guarantor_User_Mapping_Bool_Exp;
};

/** Boolean expression to compare columns of type "gurantor_relation_type". All fields are combined with logical 'AND'. */
export type Gurantor_Relation_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  _gt?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  _gte?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["gurantor_relation_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  _lte?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  _neq?: InputMaybe<Scalars["gurantor_relation_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["gurantor_relation_type"]["input"]>>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["json"]["input"]>;
  _gt?: InputMaybe<Scalars["json"]["input"]>;
  _gte?: InputMaybe<Scalars["json"]["input"]>;
  _in?: InputMaybe<Array<Scalars["json"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["json"]["input"]>;
  _lte?: InputMaybe<Scalars["json"]["input"]>;
  _neq?: InputMaybe<Scalars["json"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["json"]["input"]>>;
};

/** Boolean expression to compare columns of type "marital_status_type". All fields are combined with logical 'AND'. */
export type Marital_Status_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  _gt?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  _gte?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["marital_status_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  _lte?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  _neq?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["marital_status_type"]["input"]>>;
};

/** mutation root */
export type Mutation_Root = {
  /** delete data from the table: "address" */
  delete_address?: Maybe<Address_Mutation_Response>;
  /** delete single row from the table: "address" */
  delete_address_by_pk?: Maybe<Address>;
  /** delete data from the table: "collateral" */
  delete_collateral?: Maybe<Collateral_Mutation_Response>;
  /** delete single row from the table: "collateral" */
  delete_collateral_by_pk?: Maybe<Collateral>;
  /** delete data from the table: "company" */
  delete_company?: Maybe<Company_Mutation_Response>;
  /** delete single row from the table: "company" */
  delete_company_by_pk?: Maybe<Company>;
  /** delete data from the table: "consumer" */
  delete_consumer?: Maybe<Consumer_Mutation_Response>;
  /** delete data from the table: "consumer_application" */
  delete_consumer_application?: Maybe<Consumer_Application_Mutation_Response>;
  /** delete single row from the table: "consumer_application" */
  delete_consumer_application_by_pk?: Maybe<Consumer_Application>;
  /** delete data from the table: "consumer_application_state" */
  delete_consumer_application_state?: Maybe<Consumer_Application_State_Mutation_Response>;
  /** delete single row from the table: "consumer_application_state" */
  delete_consumer_application_state_by_pk?: Maybe<Consumer_Application_State>;
  /** delete single row from the table: "consumer" */
  delete_consumer_by_pk?: Maybe<Consumer>;
  /** delete data from the table: "consumer_group" */
  delete_consumer_group?: Maybe<Consumer_Group_Mutation_Response>;
  /** delete single row from the table: "consumer_group" */
  delete_consumer_group_by_pk?: Maybe<Consumer_Group>;
  /** delete data from the table: "consumer_group_member" */
  delete_consumer_group_member?: Maybe<Consumer_Group_Member_Mutation_Response>;
  /** delete single row from the table: "consumer_group_member" */
  delete_consumer_group_member_by_pk?: Maybe<Consumer_Group_Member>;
  /** delete data from the table: "consumer_kyc" */
  delete_consumer_kyc?: Maybe<Consumer_Kyc_Mutation_Response>;
  /** delete single row from the table: "consumer_kyc" */
  delete_consumer_kyc_by_pk?: Maybe<Consumer_Kyc>;
  /** delete data from the table: "consumer_state" */
  delete_consumer_state?: Maybe<Consumer_State_Mutation_Response>;
  /** delete single row from the table: "consumer_state" */
  delete_consumer_state_by_pk?: Maybe<Consumer_State>;
  /** delete data from the table: "consumer_user_mapping" */
  delete_consumer_user_mapping?: Maybe<Consumer_User_Mapping_Mutation_Response>;
  /** delete single row from the table: "consumer_user_mapping" */
  delete_consumer_user_mapping_by_pk?: Maybe<Consumer_User_Mapping>;
  /** delete data from the table: "credit_limit" */
  delete_credit_limit?: Maybe<Credit_Limit_Mutation_Response>;
  /** delete single row from the table: "credit_limit" */
  delete_credit_limit_by_pk?: Maybe<Credit_Limit>;
  /** delete data from the table: "guarantor" */
  delete_guarantor?: Maybe<Guarantor_Mutation_Response>;
  /** delete single row from the table: "guarantor" */
  delete_guarantor_by_pk?: Maybe<Guarantor>;
  /** delete data from the table: "guarantor_user_mapping" */
  delete_guarantor_user_mapping?: Maybe<Guarantor_User_Mapping_Mutation_Response>;
  /** delete single row from the table: "guarantor_user_mapping" */
  delete_guarantor_user_mapping_by_pk?: Maybe<Guarantor_User_Mapping>;
  /** delete data from the table: "phone" */
  delete_phone?: Maybe<Phone_Mutation_Response>;
  /** delete single row from the table: "phone" */
  delete_phone_by_pk?: Maybe<Phone>;
  /** delete data from the table: "user_detail" */
  delete_user_detail?: Maybe<User_Detail_Mutation_Response>;
  /** delete single row from the table: "user_detail" */
  delete_user_detail_by_pk?: Maybe<User_Detail>;
  /** insert data into the table: "address" */
  insert_address?: Maybe<Address_Mutation_Response>;
  /** insert a single row into the table: "address" */
  insert_address_one?: Maybe<Address>;
  /** insert data into the table: "collateral" */
  insert_collateral?: Maybe<Collateral_Mutation_Response>;
  /** insert a single row into the table: "collateral" */
  insert_collateral_one?: Maybe<Collateral>;
  /** insert data into the table: "company" */
  insert_company?: Maybe<Company_Mutation_Response>;
  /** insert a single row into the table: "company" */
  insert_company_one?: Maybe<Company>;
  /** insert data into the table: "consumer" */
  insert_consumer?: Maybe<Consumer_Mutation_Response>;
  /** insert data into the table: "consumer_application" */
  insert_consumer_application?: Maybe<Consumer_Application_Mutation_Response>;
  /** insert a single row into the table: "consumer_application" */
  insert_consumer_application_one?: Maybe<Consumer_Application>;
  /** insert data into the table: "consumer_application_state" */
  insert_consumer_application_state?: Maybe<Consumer_Application_State_Mutation_Response>;
  /** insert a single row into the table: "consumer_application_state" */
  insert_consumer_application_state_one?: Maybe<Consumer_Application_State>;
  /** insert data into the table: "consumer_group" */
  insert_consumer_group?: Maybe<Consumer_Group_Mutation_Response>;
  /** insert data into the table: "consumer_group_member" */
  insert_consumer_group_member?: Maybe<Consumer_Group_Member_Mutation_Response>;
  /** insert a single row into the table: "consumer_group_member" */
  insert_consumer_group_member_one?: Maybe<Consumer_Group_Member>;
  /** insert a single row into the table: "consumer_group" */
  insert_consumer_group_one?: Maybe<Consumer_Group>;
  /** insert data into the table: "consumer_kyc" */
  insert_consumer_kyc?: Maybe<Consumer_Kyc_Mutation_Response>;
  /** insert a single row into the table: "consumer_kyc" */
  insert_consumer_kyc_one?: Maybe<Consumer_Kyc>;
  /** insert a single row into the table: "consumer" */
  insert_consumer_one?: Maybe<Consumer>;
  /** insert data into the table: "consumer_state" */
  insert_consumer_state?: Maybe<Consumer_State_Mutation_Response>;
  /** insert a single row into the table: "consumer_state" */
  insert_consumer_state_one?: Maybe<Consumer_State>;
  /** insert data into the table: "consumer_user_mapping" */
  insert_consumer_user_mapping?: Maybe<Consumer_User_Mapping_Mutation_Response>;
  /** insert a single row into the table: "consumer_user_mapping" */
  insert_consumer_user_mapping_one?: Maybe<Consumer_User_Mapping>;
  /** insert data into the table: "credit_limit" */
  insert_credit_limit?: Maybe<Credit_Limit_Mutation_Response>;
  /** insert a single row into the table: "credit_limit" */
  insert_credit_limit_one?: Maybe<Credit_Limit>;
  /** insert data into the table: "guarantor" */
  insert_guarantor?: Maybe<Guarantor_Mutation_Response>;
  /** insert a single row into the table: "guarantor" */
  insert_guarantor_one?: Maybe<Guarantor>;
  /** insert data into the table: "guarantor_user_mapping" */
  insert_guarantor_user_mapping?: Maybe<Guarantor_User_Mapping_Mutation_Response>;
  /** insert a single row into the table: "guarantor_user_mapping" */
  insert_guarantor_user_mapping_one?: Maybe<Guarantor_User_Mapping>;
  /** insert data into the table: "phone" */
  insert_phone?: Maybe<Phone_Mutation_Response>;
  /** insert a single row into the table: "phone" */
  insert_phone_one?: Maybe<Phone>;
  /** insert data into the table: "user_detail" */
  insert_user_detail?: Maybe<User_Detail_Mutation_Response>;
  /** insert a single row into the table: "user_detail" */
  insert_user_detail_one?: Maybe<User_Detail>;
  /** update data of the table: "address" */
  update_address?: Maybe<Address_Mutation_Response>;
  /** update single row of the table: "address" */
  update_address_by_pk?: Maybe<Address>;
  /** update multiples rows of table: "address" */
  update_address_many?: Maybe<Array<Maybe<Address_Mutation_Response>>>;
  /** update data of the table: "collateral" */
  update_collateral?: Maybe<Collateral_Mutation_Response>;
  /** update single row of the table: "collateral" */
  update_collateral_by_pk?: Maybe<Collateral>;
  /** update multiples rows of table: "collateral" */
  update_collateral_many?: Maybe<Array<Maybe<Collateral_Mutation_Response>>>;
  /** update data of the table: "company" */
  update_company?: Maybe<Company_Mutation_Response>;
  /** update single row of the table: "company" */
  update_company_by_pk?: Maybe<Company>;
  /** update multiples rows of table: "company" */
  update_company_many?: Maybe<Array<Maybe<Company_Mutation_Response>>>;
  /** update data of the table: "consumer" */
  update_consumer?: Maybe<Consumer_Mutation_Response>;
  /** update data of the table: "consumer_application" */
  update_consumer_application?: Maybe<Consumer_Application_Mutation_Response>;
  /** update single row of the table: "consumer_application" */
  update_consumer_application_by_pk?: Maybe<Consumer_Application>;
  /** update multiples rows of table: "consumer_application" */
  update_consumer_application_many?: Maybe<
    Array<Maybe<Consumer_Application_Mutation_Response>>
  >;
  /** update data of the table: "consumer_application_state" */
  update_consumer_application_state?: Maybe<Consumer_Application_State_Mutation_Response>;
  /** update single row of the table: "consumer_application_state" */
  update_consumer_application_state_by_pk?: Maybe<Consumer_Application_State>;
  /** update multiples rows of table: "consumer_application_state" */
  update_consumer_application_state_many?: Maybe<
    Array<Maybe<Consumer_Application_State_Mutation_Response>>
  >;
  /** update single row of the table: "consumer" */
  update_consumer_by_pk?: Maybe<Consumer>;
  /** update data of the table: "consumer_group" */
  update_consumer_group?: Maybe<Consumer_Group_Mutation_Response>;
  /** update single row of the table: "consumer_group" */
  update_consumer_group_by_pk?: Maybe<Consumer_Group>;
  /** update multiples rows of table: "consumer_group" */
  update_consumer_group_many?: Maybe<
    Array<Maybe<Consumer_Group_Mutation_Response>>
  >;
  /** update data of the table: "consumer_group_member" */
  update_consumer_group_member?: Maybe<Consumer_Group_Member_Mutation_Response>;
  /** update single row of the table: "consumer_group_member" */
  update_consumer_group_member_by_pk?: Maybe<Consumer_Group_Member>;
  /** update multiples rows of table: "consumer_group_member" */
  update_consumer_group_member_many?: Maybe<
    Array<Maybe<Consumer_Group_Member_Mutation_Response>>
  >;
  /** update data of the table: "consumer_kyc" */
  update_consumer_kyc?: Maybe<Consumer_Kyc_Mutation_Response>;
  /** update single row of the table: "consumer_kyc" */
  update_consumer_kyc_by_pk?: Maybe<Consumer_Kyc>;
  /** update multiples rows of table: "consumer_kyc" */
  update_consumer_kyc_many?: Maybe<
    Array<Maybe<Consumer_Kyc_Mutation_Response>>
  >;
  /** update multiples rows of table: "consumer" */
  update_consumer_many?: Maybe<Array<Maybe<Consumer_Mutation_Response>>>;
  /** update data of the table: "consumer_state" */
  update_consumer_state?: Maybe<Consumer_State_Mutation_Response>;
  /** update single row of the table: "consumer_state" */
  update_consumer_state_by_pk?: Maybe<Consumer_State>;
  /** update multiples rows of table: "consumer_state" */
  update_consumer_state_many?: Maybe<
    Array<Maybe<Consumer_State_Mutation_Response>>
  >;
  /** update data of the table: "consumer_user_mapping" */
  update_consumer_user_mapping?: Maybe<Consumer_User_Mapping_Mutation_Response>;
  /** update single row of the table: "consumer_user_mapping" */
  update_consumer_user_mapping_by_pk?: Maybe<Consumer_User_Mapping>;
  /** update multiples rows of table: "consumer_user_mapping" */
  update_consumer_user_mapping_many?: Maybe<
    Array<Maybe<Consumer_User_Mapping_Mutation_Response>>
  >;
  /** update data of the table: "credit_limit" */
  update_credit_limit?: Maybe<Credit_Limit_Mutation_Response>;
  /** update single row of the table: "credit_limit" */
  update_credit_limit_by_pk?: Maybe<Credit_Limit>;
  /** update multiples rows of table: "credit_limit" */
  update_credit_limit_many?: Maybe<
    Array<Maybe<Credit_Limit_Mutation_Response>>
  >;
  /** update data of the table: "guarantor" */
  update_guarantor?: Maybe<Guarantor_Mutation_Response>;
  /** update single row of the table: "guarantor" */
  update_guarantor_by_pk?: Maybe<Guarantor>;
  /** update multiples rows of table: "guarantor" */
  update_guarantor_many?: Maybe<Array<Maybe<Guarantor_Mutation_Response>>>;
  /** update data of the table: "guarantor_user_mapping" */
  update_guarantor_user_mapping?: Maybe<Guarantor_User_Mapping_Mutation_Response>;
  /** update single row of the table: "guarantor_user_mapping" */
  update_guarantor_user_mapping_by_pk?: Maybe<Guarantor_User_Mapping>;
  /** update multiples rows of table: "guarantor_user_mapping" */
  update_guarantor_user_mapping_many?: Maybe<
    Array<Maybe<Guarantor_User_Mapping_Mutation_Response>>
  >;
  /** update data of the table: "phone" */
  update_phone?: Maybe<Phone_Mutation_Response>;
  /** update single row of the table: "phone" */
  update_phone_by_pk?: Maybe<Phone>;
  /** update multiples rows of table: "phone" */
  update_phone_many?: Maybe<Array<Maybe<Phone_Mutation_Response>>>;
  /** update data of the table: "user_detail" */
  update_user_detail?: Maybe<User_Detail_Mutation_Response>;
  /** update single row of the table: "user_detail" */
  update_user_detail_by_pk?: Maybe<User_Detail>;
  /** update multiples rows of table: "user_detail" */
  update_user_detail_many?: Maybe<Array<Maybe<User_Detail_Mutation_Response>>>;
};

/** mutation root */
export type Mutation_RootDelete_AddressArgs = {
  where: Address_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Address_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_CollateralArgs = {
  where: Collateral_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Collateral_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_CompanyArgs = {
  where: Company_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Company_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_ConsumerArgs = {
  where: Consumer_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_ApplicationArgs = {
  where: Consumer_Application_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Application_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Application_StateArgs = {
  where: Consumer_Application_State_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Application_State_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_GroupArgs = {
  where: Consumer_Group_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Group_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Group_MemberArgs = {
  where: Consumer_Group_Member_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Group_Member_By_PkArgs = {
  consumer_group_id: Scalars["String"]["input"];
  consumer_id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_KycArgs = {
  where: Consumer_Kyc_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_Kyc_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_StateArgs = {
  where: Consumer_State_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_State_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Consumer_User_MappingArgs = {
  where: Consumer_User_Mapping_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Consumer_User_Mapping_By_PkArgs = {
  consumer_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Credit_LimitArgs = {
  where: Credit_Limit_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Credit_Limit_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_GuarantorArgs = {
  where: Guarantor_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Guarantor_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Guarantor_User_MappingArgs = {
  where: Guarantor_User_Mapping_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Guarantor_User_Mapping_By_PkArgs = {
  guarantor_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_PhoneArgs = {
  where: Phone_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Phone_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_User_DetailArgs = {
  where: User_Detail_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_User_Detail_By_PkArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootInsert_AddressArgs = {
  objects: Array<Address_Insert_Input>;
  on_conflict?: InputMaybe<Address_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Address_OneArgs = {
  object: Address_Insert_Input;
  on_conflict?: InputMaybe<Address_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_CollateralArgs = {
  objects: Array<Collateral_Insert_Input>;
  on_conflict?: InputMaybe<Collateral_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Collateral_OneArgs = {
  object: Collateral_Insert_Input;
  on_conflict?: InputMaybe<Collateral_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_CompanyArgs = {
  objects: Array<Company_Insert_Input>;
  on_conflict?: InputMaybe<Company_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Company_OneArgs = {
  object: Company_Insert_Input;
  on_conflict?: InputMaybe<Company_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ConsumerArgs = {
  objects: Array<Consumer_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_ApplicationArgs = {
  objects: Array<Consumer_Application_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_Application_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Application_OneArgs = {
  object: Consumer_Application_Insert_Input;
  on_conflict?: InputMaybe<Consumer_Application_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Application_StateArgs = {
  objects: Array<Consumer_Application_State_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_Application_State_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Application_State_OneArgs = {
  object: Consumer_Application_State_Insert_Input;
  on_conflict?: InputMaybe<Consumer_Application_State_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_GroupArgs = {
  objects: Array<Consumer_Group_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_Group_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Group_MemberArgs = {
  objects: Array<Consumer_Group_Member_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_Group_Member_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Group_Member_OneArgs = {
  object: Consumer_Group_Member_Insert_Input;
  on_conflict?: InputMaybe<Consumer_Group_Member_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Group_OneArgs = {
  object: Consumer_Group_Insert_Input;
  on_conflict?: InputMaybe<Consumer_Group_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_KycArgs = {
  objects: Array<Consumer_Kyc_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_Kyc_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_Kyc_OneArgs = {
  object: Consumer_Kyc_Insert_Input;
  on_conflict?: InputMaybe<Consumer_Kyc_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_OneArgs = {
  object: Consumer_Insert_Input;
  on_conflict?: InputMaybe<Consumer_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_StateArgs = {
  objects: Array<Consumer_State_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_State_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_State_OneArgs = {
  object: Consumer_State_Insert_Input;
  on_conflict?: InputMaybe<Consumer_State_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_User_MappingArgs = {
  objects: Array<Consumer_User_Mapping_Insert_Input>;
  on_conflict?: InputMaybe<Consumer_User_Mapping_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Consumer_User_Mapping_OneArgs = {
  object: Consumer_User_Mapping_Insert_Input;
  on_conflict?: InputMaybe<Consumer_User_Mapping_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Credit_LimitArgs = {
  objects: Array<Credit_Limit_Insert_Input>;
  on_conflict?: InputMaybe<Credit_Limit_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Credit_Limit_OneArgs = {
  object: Credit_Limit_Insert_Input;
  on_conflict?: InputMaybe<Credit_Limit_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_GuarantorArgs = {
  objects: Array<Guarantor_Insert_Input>;
  on_conflict?: InputMaybe<Guarantor_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Guarantor_OneArgs = {
  object: Guarantor_Insert_Input;
  on_conflict?: InputMaybe<Guarantor_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Guarantor_User_MappingArgs = {
  objects: Array<Guarantor_User_Mapping_Insert_Input>;
  on_conflict?: InputMaybe<Guarantor_User_Mapping_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Guarantor_User_Mapping_OneArgs = {
  object: Guarantor_User_Mapping_Insert_Input;
  on_conflict?: InputMaybe<Guarantor_User_Mapping_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_PhoneArgs = {
  objects: Array<Phone_Insert_Input>;
  on_conflict?: InputMaybe<Phone_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Phone_OneArgs = {
  object: Phone_Insert_Input;
  on_conflict?: InputMaybe<Phone_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_User_DetailArgs = {
  objects: Array<User_Detail_Insert_Input>;
  on_conflict?: InputMaybe<User_Detail_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_User_Detail_OneArgs = {
  object: User_Detail_Insert_Input;
  on_conflict?: InputMaybe<User_Detail_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_AddressArgs = {
  _set?: InputMaybe<Address_Set_Input>;
  where: Address_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Address_By_PkArgs = {
  _set?: InputMaybe<Address_Set_Input>;
  pk_columns: Address_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Address_ManyArgs = {
  updates: Array<Address_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_CollateralArgs = {
  _set?: InputMaybe<Collateral_Set_Input>;
  where: Collateral_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Collateral_By_PkArgs = {
  _set?: InputMaybe<Collateral_Set_Input>;
  pk_columns: Collateral_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Collateral_ManyArgs = {
  updates: Array<Collateral_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_CompanyArgs = {
  _set?: InputMaybe<Company_Set_Input>;
  where: Company_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Company_By_PkArgs = {
  _set?: InputMaybe<Company_Set_Input>;
  pk_columns: Company_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Company_ManyArgs = {
  updates: Array<Company_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ConsumerArgs = {
  _set?: InputMaybe<Consumer_Set_Input>;
  where: Consumer_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_ApplicationArgs = {
  _set?: InputMaybe<Consumer_Application_Set_Input>;
  where: Consumer_Application_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Application_By_PkArgs = {
  _set?: InputMaybe<Consumer_Application_Set_Input>;
  pk_columns: Consumer_Application_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Application_ManyArgs = {
  updates: Array<Consumer_Application_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Application_StateArgs = {
  _set?: InputMaybe<Consumer_Application_State_Set_Input>;
  where: Consumer_Application_State_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Application_State_By_PkArgs = {
  _set?: InputMaybe<Consumer_Application_State_Set_Input>;
  pk_columns: Consumer_Application_State_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Application_State_ManyArgs = {
  updates: Array<Consumer_Application_State_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_By_PkArgs = {
  _set?: InputMaybe<Consumer_Set_Input>;
  pk_columns: Consumer_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_GroupArgs = {
  _set?: InputMaybe<Consumer_Group_Set_Input>;
  where: Consumer_Group_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Group_By_PkArgs = {
  _set?: InputMaybe<Consumer_Group_Set_Input>;
  pk_columns: Consumer_Group_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Group_ManyArgs = {
  updates: Array<Consumer_Group_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Group_MemberArgs = {
  _set?: InputMaybe<Consumer_Group_Member_Set_Input>;
  where: Consumer_Group_Member_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Group_Member_By_PkArgs = {
  _set?: InputMaybe<Consumer_Group_Member_Set_Input>;
  pk_columns: Consumer_Group_Member_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Group_Member_ManyArgs = {
  updates: Array<Consumer_Group_Member_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_KycArgs = {
  _inc?: InputMaybe<Consumer_Kyc_Inc_Input>;
  _set?: InputMaybe<Consumer_Kyc_Set_Input>;
  where: Consumer_Kyc_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Kyc_By_PkArgs = {
  _inc?: InputMaybe<Consumer_Kyc_Inc_Input>;
  _set?: InputMaybe<Consumer_Kyc_Set_Input>;
  pk_columns: Consumer_Kyc_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_Kyc_ManyArgs = {
  updates: Array<Consumer_Kyc_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_ManyArgs = {
  updates: Array<Consumer_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_StateArgs = {
  _set?: InputMaybe<Consumer_State_Set_Input>;
  where: Consumer_State_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_State_By_PkArgs = {
  _set?: InputMaybe<Consumer_State_Set_Input>;
  pk_columns: Consumer_State_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_State_ManyArgs = {
  updates: Array<Consumer_State_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_User_MappingArgs = {
  _set?: InputMaybe<Consumer_User_Mapping_Set_Input>;
  where: Consumer_User_Mapping_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_User_Mapping_By_PkArgs = {
  _set?: InputMaybe<Consumer_User_Mapping_Set_Input>;
  pk_columns: Consumer_User_Mapping_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Consumer_User_Mapping_ManyArgs = {
  updates: Array<Consumer_User_Mapping_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Credit_LimitArgs = {
  _inc?: InputMaybe<Credit_Limit_Inc_Input>;
  _set?: InputMaybe<Credit_Limit_Set_Input>;
  where: Credit_Limit_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Credit_Limit_By_PkArgs = {
  _inc?: InputMaybe<Credit_Limit_Inc_Input>;
  _set?: InputMaybe<Credit_Limit_Set_Input>;
  pk_columns: Credit_Limit_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Credit_Limit_ManyArgs = {
  updates: Array<Credit_Limit_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_GuarantorArgs = {
  _set?: InputMaybe<Guarantor_Set_Input>;
  where: Guarantor_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Guarantor_By_PkArgs = {
  _set?: InputMaybe<Guarantor_Set_Input>;
  pk_columns: Guarantor_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Guarantor_ManyArgs = {
  updates: Array<Guarantor_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Guarantor_User_MappingArgs = {
  _set?: InputMaybe<Guarantor_User_Mapping_Set_Input>;
  where: Guarantor_User_Mapping_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Guarantor_User_Mapping_By_PkArgs = {
  _set?: InputMaybe<Guarantor_User_Mapping_Set_Input>;
  pk_columns: Guarantor_User_Mapping_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Guarantor_User_Mapping_ManyArgs = {
  updates: Array<Guarantor_User_Mapping_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_PhoneArgs = {
  _set?: InputMaybe<Phone_Set_Input>;
  where: Phone_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Phone_By_PkArgs = {
  _set?: InputMaybe<Phone_Set_Input>;
  pk_columns: Phone_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Phone_ManyArgs = {
  updates: Array<Phone_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_User_DetailArgs = {
  _set?: InputMaybe<User_Detail_Set_Input>;
  where: User_Detail_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_User_Detail_By_PkArgs = {
  _set?: InputMaybe<User_Detail_Set_Input>;
  pk_columns: User_Detail_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_User_Detail_ManyArgs = {
  updates: Array<User_Detail_Updates>;
};

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | "asc"
  /** in ascending order, nulls first */
  | "asc_nulls_first"
  /** in ascending order, nulls last */
  | "asc_nulls_last"
  /** in descending order, nulls first */
  | "desc"
  /** in descending order, nulls first */
  | "desc_nulls_first"
  /** in descending order, nulls last */
  | "desc_nulls_last";

/** columns and relationships of "phone" */
export type Phone = {
  created_at_utc: Scalars["timestamp"]["output"];
  created_by: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  is_active: Scalars["Boolean"]["output"];
  is_primary: Scalars["Boolean"]["output"];
  phone_number_e164?: Maybe<Scalars["String"]["output"]>;
  phone_type: Scalars["phone_type"]["output"];
  /** An object relationship */
  user_detail?: Maybe<User_Detail>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "phone" */
export type Phone_Aggregate = {
  aggregate?: Maybe<Phone_Aggregate_Fields>;
  nodes: Array<Phone>;
};

export type Phone_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Phone_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Phone_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Phone_Aggregate_Bool_Exp_Count>;
};

export type Phone_Aggregate_Bool_Exp_Bool_And = {
  arguments: Phone_Select_Column_Phone_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Phone_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Phone_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Phone_Select_Column_Phone_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Phone_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Phone_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Phone_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Phone_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "phone" */
export type Phone_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<Phone_Max_Fields>;
  min?: Maybe<Phone_Min_Fields>;
};

/** aggregate fields of "phone" */
export type Phone_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Phone_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "phone" */
export type Phone_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Phone_Max_Order_By>;
  min?: InputMaybe<Phone_Min_Order_By>;
};

/** input type for inserting array relation for remote table "phone" */
export type Phone_Arr_Rel_Insert_Input = {
  data: Array<Phone_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Phone_On_Conflict>;
};

/** Boolean expression to filter rows from the table "phone". All fields are combined with a logical 'AND'. */
export type Phone_Bool_Exp = {
  _and?: InputMaybe<Array<Phone_Bool_Exp>>;
  _not?: InputMaybe<Phone_Bool_Exp>;
  _or?: InputMaybe<Array<Phone_Bool_Exp>>;
  created_at_utc?: InputMaybe<Timestamp_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_primary?: InputMaybe<Boolean_Comparison_Exp>;
  phone_number_e164?: InputMaybe<String_Comparison_Exp>;
  phone_type?: InputMaybe<Phone_Type_Comparison_Exp>;
  user_detail?: InputMaybe<User_Detail_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "phone" */
export type Phone_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_phone";

/** input type for inserting data into table "phone" */
export type Phone_Insert_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  phone_number_e164?: InputMaybe<Scalars["String"]["input"]>;
  phone_type?: InputMaybe<Scalars["phone_type"]["input"]>;
  user_detail?: InputMaybe<User_Detail_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Phone_Max_Fields = {
  created_at_utc?: Maybe<Scalars["timestamp"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  phone_number_e164?: Maybe<Scalars["String"]["output"]>;
  phone_type?: Maybe<Scalars["phone_type"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "phone" */
export type Phone_Max_Order_By = {
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  phone_number_e164?: InputMaybe<Order_By>;
  phone_type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Phone_Min_Fields = {
  created_at_utc?: Maybe<Scalars["timestamp"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  phone_number_e164?: Maybe<Scalars["String"]["output"]>;
  phone_type?: Maybe<Scalars["phone_type"]["output"]>;
  user_id?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "phone" */
export type Phone_Min_Order_By = {
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  phone_number_e164?: InputMaybe<Order_By>;
  phone_type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "phone" */
export type Phone_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Phone>;
};

/** on_conflict condition type for table "phone" */
export type Phone_On_Conflict = {
  constraint: Phone_Constraint;
  update_columns?: Array<Phone_Update_Column>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

/** Ordering options when selecting data from "phone". */
export type Phone_Order_By = {
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_primary?: InputMaybe<Order_By>;
  phone_number_e164?: InputMaybe<Order_By>;
  phone_type?: InputMaybe<Order_By>;
  user_detail?: InputMaybe<User_Detail_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: phone */
export type Phone_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "phone" */
export type Phone_Select_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "is_active"
  /** column name */
  | "is_primary"
  /** column name */
  | "phone_number_e164"
  /** column name */
  | "phone_type"
  /** column name */
  | "user_id";

/** select "phone_aggregate_bool_exp_bool_and_arguments_columns" columns of table "phone" */
export type Phone_Select_Column_Phone_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "is_active"
  /** column name */
  | "is_primary";

/** select "phone_aggregate_bool_exp_bool_or_arguments_columns" columns of table "phone" */
export type Phone_Select_Column_Phone_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "is_active"
  /** column name */
  | "is_primary";

/** input type for updating data in table "phone" */
export type Phone_Set_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  phone_number_e164?: InputMaybe<Scalars["String"]["input"]>;
  phone_type?: InputMaybe<Scalars["phone_type"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "phone" */
export type Phone_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Phone_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Phone_Stream_Cursor_Value_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  is_primary?: InputMaybe<Scalars["Boolean"]["input"]>;
  phone_number_e164?: InputMaybe<Scalars["String"]["input"]>;
  phone_type?: InputMaybe<Scalars["phone_type"]["input"]>;
  user_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** Boolean expression to compare columns of type "phone_type". All fields are combined with logical 'AND'. */
export type Phone_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["phone_type"]["input"]>;
  _gt?: InputMaybe<Scalars["phone_type"]["input"]>;
  _gte?: InputMaybe<Scalars["phone_type"]["input"]>;
  _in?: InputMaybe<Array<Scalars["phone_type"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["phone_type"]["input"]>;
  _lte?: InputMaybe<Scalars["phone_type"]["input"]>;
  _neq?: InputMaybe<Scalars["phone_type"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["phone_type"]["input"]>>;
};

/** update columns of table "phone" */
export type Phone_Update_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "id"
  /** column name */
  | "is_active"
  /** column name */
  | "is_primary"
  /** column name */
  | "phone_number_e164"
  /** column name */
  | "phone_type"
  /** column name */
  | "user_id";

export type Phone_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Phone_Set_Input>;
  /** filter the rows which have to be updated */
  where: Phone_Bool_Exp;
};

export type Query_Root = {
  /** fetch data from the table: "address" */
  address: Array<Address>;
  /** fetch aggregated fields from the table: "address" */
  address_aggregate: Address_Aggregate;
  /** fetch data from the table: "address" using primary key columns */
  address_by_pk?: Maybe<Address>;
  /** fetch data from the table: "collateral" */
  collateral: Array<Collateral>;
  /** fetch aggregated fields from the table: "collateral" */
  collateral_aggregate: Collateral_Aggregate;
  /** fetch data from the table: "collateral" using primary key columns */
  collateral_by_pk?: Maybe<Collateral>;
  /** fetch data from the table: "company" */
  company: Array<Company>;
  /** fetch aggregated fields from the table: "company" */
  company_aggregate: Company_Aggregate;
  /** fetch data from the table: "company" using primary key columns */
  company_by_pk?: Maybe<Company>;
  /** fetch data from the table: "consumer" */
  consumer: Array<Consumer>;
  /** fetch aggregated fields from the table: "consumer" */
  consumer_aggregate: Consumer_Aggregate;
  /** fetch data from the table: "consumer_application" */
  consumer_application: Array<Consumer_Application>;
  /** fetch aggregated fields from the table: "consumer_application" */
  consumer_application_aggregate: Consumer_Application_Aggregate;
  /** fetch data from the table: "consumer_application" using primary key columns */
  consumer_application_by_pk?: Maybe<Consumer_Application>;
  /** fetch data from the table: "consumer_application_state" */
  consumer_application_state: Array<Consumer_Application_State>;
  /** fetch aggregated fields from the table: "consumer_application_state" */
  consumer_application_state_aggregate: Consumer_Application_State_Aggregate;
  /** fetch data from the table: "consumer_application_state" using primary key columns */
  consumer_application_state_by_pk?: Maybe<Consumer_Application_State>;
  /** fetch data from the table: "consumer" using primary key columns */
  consumer_by_pk?: Maybe<Consumer>;
  /** fetch data from the table: "consumer_group" */
  consumer_group: Array<Consumer_Group>;
  /** fetch aggregated fields from the table: "consumer_group" */
  consumer_group_aggregate: Consumer_Group_Aggregate;
  /** fetch data from the table: "consumer_group" using primary key columns */
  consumer_group_by_pk?: Maybe<Consumer_Group>;
  /** fetch data from the table: "consumer_group_member" */
  consumer_group_member: Array<Consumer_Group_Member>;
  /** fetch aggregated fields from the table: "consumer_group_member" */
  consumer_group_member_aggregate: Consumer_Group_Member_Aggregate;
  /** fetch data from the table: "consumer_group_member" using primary key columns */
  consumer_group_member_by_pk?: Maybe<Consumer_Group_Member>;
  /** fetch data from the table: "consumer_kyc" */
  consumer_kyc: Array<Consumer_Kyc>;
  /** fetch aggregated fields from the table: "consumer_kyc" */
  consumer_kyc_aggregate: Consumer_Kyc_Aggregate;
  /** fetch data from the table: "consumer_kyc" using primary key columns */
  consumer_kyc_by_pk?: Maybe<Consumer_Kyc>;
  /** fetch data from the table: "consumer_state" */
  consumer_state: Array<Consumer_State>;
  /** fetch aggregated fields from the table: "consumer_state" */
  consumer_state_aggregate: Consumer_State_Aggregate;
  /** fetch data from the table: "consumer_state" using primary key columns */
  consumer_state_by_pk?: Maybe<Consumer_State>;
  /** fetch data from the table: "consumer_user_mapping" */
  consumer_user_mapping: Array<Consumer_User_Mapping>;
  /** fetch aggregated fields from the table: "consumer_user_mapping" */
  consumer_user_mapping_aggregate: Consumer_User_Mapping_Aggregate;
  /** fetch data from the table: "consumer_user_mapping" using primary key columns */
  consumer_user_mapping_by_pk?: Maybe<Consumer_User_Mapping>;
  /** fetch data from the table: "credit_limit" */
  credit_limit: Array<Credit_Limit>;
  /** fetch aggregated fields from the table: "credit_limit" */
  credit_limit_aggregate: Credit_Limit_Aggregate;
  /** fetch data from the table: "credit_limit" using primary key columns */
  credit_limit_by_pk?: Maybe<Credit_Limit>;
  /** fetch data from the table: "guarantor" */
  guarantor: Array<Guarantor>;
  /** fetch aggregated fields from the table: "guarantor" */
  guarantor_aggregate: Guarantor_Aggregate;
  /** fetch data from the table: "guarantor" using primary key columns */
  guarantor_by_pk?: Maybe<Guarantor>;
  /** fetch data from the table: "guarantor_user_mapping" */
  guarantor_user_mapping: Array<Guarantor_User_Mapping>;
  /** fetch aggregated fields from the table: "guarantor_user_mapping" */
  guarantor_user_mapping_aggregate: Guarantor_User_Mapping_Aggregate;
  /** fetch data from the table: "guarantor_user_mapping" using primary key columns */
  guarantor_user_mapping_by_pk?: Maybe<Guarantor_User_Mapping>;
  /** fetch data from the table: "phone" */
  phone: Array<Phone>;
  /** fetch aggregated fields from the table: "phone" */
  phone_aggregate: Phone_Aggregate;
  /** fetch data from the table: "phone" using primary key columns */
  phone_by_pk?: Maybe<Phone>;
  /** fetch data from the table: "user_detail" */
  user_detail: Array<User_Detail>;
  /** fetch aggregated fields from the table: "user_detail" */
  user_detail_aggregate: User_Detail_Aggregate;
  /** fetch data from the table: "user_detail" using primary key columns */
  user_detail_by_pk?: Maybe<User_Detail>;
};

export type Query_RootAddressArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

export type Query_RootAddress_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

export type Query_RootAddress_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootCollateralArgs = {
  distinct_on?: InputMaybe<Array<Collateral_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Collateral_Order_By>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

export type Query_RootCollateral_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collateral_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Collateral_Order_By>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

export type Query_RootCollateral_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootCompanyArgs = {
  distinct_on?: InputMaybe<Array<Company_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Company_Order_By>>;
  where?: InputMaybe<Company_Bool_Exp>;
};

export type Query_RootCompany_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Company_Order_By>>;
  where?: InputMaybe<Company_Bool_Exp>;
};

export type Query_RootCompany_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumerArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Order_By>>;
  where?: InputMaybe<Consumer_Bool_Exp>;
};

export type Query_RootConsumer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Order_By>>;
  where?: InputMaybe<Consumer_Bool_Exp>;
};

export type Query_RootConsumer_ApplicationArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_Order_By>>;
  where?: InputMaybe<Consumer_Application_Bool_Exp>;
};

export type Query_RootConsumer_Application_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_Order_By>>;
  where?: InputMaybe<Consumer_Application_Bool_Exp>;
};

export type Query_RootConsumer_Application_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumer_Application_StateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_State_Order_By>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

export type Query_RootConsumer_Application_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_State_Order_By>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

export type Query_RootConsumer_Application_State_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumer_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumer_GroupArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Order_By>>;
  where?: InputMaybe<Consumer_Group_Bool_Exp>;
};

export type Query_RootConsumer_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Order_By>>;
  where?: InputMaybe<Consumer_Group_Bool_Exp>;
};

export type Query_RootConsumer_Group_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumer_Group_MemberArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

export type Query_RootConsumer_Group_Member_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

export type Query_RootConsumer_Group_Member_By_PkArgs = {
  consumer_group_id: Scalars["String"]["input"];
  consumer_id: Scalars["String"]["input"];
};

export type Query_RootConsumer_KycArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

export type Query_RootConsumer_Kyc_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

export type Query_RootConsumer_Kyc_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumer_StateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_State_Order_By>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

export type Query_RootConsumer_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_State_Order_By>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

export type Query_RootConsumer_State_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootConsumer_User_MappingArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

export type Query_RootConsumer_User_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

export type Query_RootConsumer_User_Mapping_By_PkArgs = {
  consumer_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

export type Query_RootCredit_LimitArgs = {
  distinct_on?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Credit_Limit_Order_By>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

export type Query_RootCredit_Limit_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Credit_Limit_Order_By>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

export type Query_RootCredit_Limit_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootGuarantorArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_Order_By>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

export type Query_RootGuarantor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_Order_By>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

export type Query_RootGuarantor_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootGuarantor_User_MappingArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

export type Query_RootGuarantor_User_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

export type Query_RootGuarantor_User_Mapping_By_PkArgs = {
  guarantor_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

export type Query_RootPhoneArgs = {
  distinct_on?: InputMaybe<Array<Phone_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Phone_Order_By>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

export type Query_RootPhone_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Phone_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Phone_Order_By>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

export type Query_RootPhone_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootUser_DetailArgs = {
  distinct_on?: InputMaybe<Array<User_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Detail_Order_By>>;
  where?: InputMaybe<User_Detail_Bool_Exp>;
};

export type Query_RootUser_Detail_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Detail_Order_By>>;
  where?: InputMaybe<User_Detail_Bool_Exp>;
};

export type Query_RootUser_Detail_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_Root = {
  /** fetch data from the table: "address" */
  address: Array<Address>;
  /** fetch aggregated fields from the table: "address" */
  address_aggregate: Address_Aggregate;
  /** fetch data from the table: "address" using primary key columns */
  address_by_pk?: Maybe<Address>;
  /** fetch data from the table in a streaming manner: "address" */
  address_stream: Array<Address>;
  /** fetch data from the table: "collateral" */
  collateral: Array<Collateral>;
  /** fetch aggregated fields from the table: "collateral" */
  collateral_aggregate: Collateral_Aggregate;
  /** fetch data from the table: "collateral" using primary key columns */
  collateral_by_pk?: Maybe<Collateral>;
  /** fetch data from the table in a streaming manner: "collateral" */
  collateral_stream: Array<Collateral>;
  /** fetch data from the table: "company" */
  company: Array<Company>;
  /** fetch aggregated fields from the table: "company" */
  company_aggregate: Company_Aggregate;
  /** fetch data from the table: "company" using primary key columns */
  company_by_pk?: Maybe<Company>;
  /** fetch data from the table in a streaming manner: "company" */
  company_stream: Array<Company>;
  /** fetch data from the table: "consumer" */
  consumer: Array<Consumer>;
  /** fetch aggregated fields from the table: "consumer" */
  consumer_aggregate: Consumer_Aggregate;
  /** fetch data from the table: "consumer_application" */
  consumer_application: Array<Consumer_Application>;
  /** fetch aggregated fields from the table: "consumer_application" */
  consumer_application_aggregate: Consumer_Application_Aggregate;
  /** fetch data from the table: "consumer_application" using primary key columns */
  consumer_application_by_pk?: Maybe<Consumer_Application>;
  /** fetch data from the table: "consumer_application_state" */
  consumer_application_state: Array<Consumer_Application_State>;
  /** fetch aggregated fields from the table: "consumer_application_state" */
  consumer_application_state_aggregate: Consumer_Application_State_Aggregate;
  /** fetch data from the table: "consumer_application_state" using primary key columns */
  consumer_application_state_by_pk?: Maybe<Consumer_Application_State>;
  /** fetch data from the table in a streaming manner: "consumer_application_state" */
  consumer_application_state_stream: Array<Consumer_Application_State>;
  /** fetch data from the table in a streaming manner: "consumer_application" */
  consumer_application_stream: Array<Consumer_Application>;
  /** fetch data from the table: "consumer" using primary key columns */
  consumer_by_pk?: Maybe<Consumer>;
  /** fetch data from the table: "consumer_group" */
  consumer_group: Array<Consumer_Group>;
  /** fetch aggregated fields from the table: "consumer_group" */
  consumer_group_aggregate: Consumer_Group_Aggregate;
  /** fetch data from the table: "consumer_group" using primary key columns */
  consumer_group_by_pk?: Maybe<Consumer_Group>;
  /** fetch data from the table: "consumer_group_member" */
  consumer_group_member: Array<Consumer_Group_Member>;
  /** fetch aggregated fields from the table: "consumer_group_member" */
  consumer_group_member_aggregate: Consumer_Group_Member_Aggregate;
  /** fetch data from the table: "consumer_group_member" using primary key columns */
  consumer_group_member_by_pk?: Maybe<Consumer_Group_Member>;
  /** fetch data from the table in a streaming manner: "consumer_group_member" */
  consumer_group_member_stream: Array<Consumer_Group_Member>;
  /** fetch data from the table in a streaming manner: "consumer_group" */
  consumer_group_stream: Array<Consumer_Group>;
  /** fetch data from the table: "consumer_kyc" */
  consumer_kyc: Array<Consumer_Kyc>;
  /** fetch aggregated fields from the table: "consumer_kyc" */
  consumer_kyc_aggregate: Consumer_Kyc_Aggregate;
  /** fetch data from the table: "consumer_kyc" using primary key columns */
  consumer_kyc_by_pk?: Maybe<Consumer_Kyc>;
  /** fetch data from the table in a streaming manner: "consumer_kyc" */
  consumer_kyc_stream: Array<Consumer_Kyc>;
  /** fetch data from the table: "consumer_state" */
  consumer_state: Array<Consumer_State>;
  /** fetch aggregated fields from the table: "consumer_state" */
  consumer_state_aggregate: Consumer_State_Aggregate;
  /** fetch data from the table: "consumer_state" using primary key columns */
  consumer_state_by_pk?: Maybe<Consumer_State>;
  /** fetch data from the table in a streaming manner: "consumer_state" */
  consumer_state_stream: Array<Consumer_State>;
  /** fetch data from the table in a streaming manner: "consumer" */
  consumer_stream: Array<Consumer>;
  /** fetch data from the table: "consumer_user_mapping" */
  consumer_user_mapping: Array<Consumer_User_Mapping>;
  /** fetch aggregated fields from the table: "consumer_user_mapping" */
  consumer_user_mapping_aggregate: Consumer_User_Mapping_Aggregate;
  /** fetch data from the table: "consumer_user_mapping" using primary key columns */
  consumer_user_mapping_by_pk?: Maybe<Consumer_User_Mapping>;
  /** fetch data from the table in a streaming manner: "consumer_user_mapping" */
  consumer_user_mapping_stream: Array<Consumer_User_Mapping>;
  /** fetch data from the table: "credit_limit" */
  credit_limit: Array<Credit_Limit>;
  /** fetch aggregated fields from the table: "credit_limit" */
  credit_limit_aggregate: Credit_Limit_Aggregate;
  /** fetch data from the table: "credit_limit" using primary key columns */
  credit_limit_by_pk?: Maybe<Credit_Limit>;
  /** fetch data from the table in a streaming manner: "credit_limit" */
  credit_limit_stream: Array<Credit_Limit>;
  /** fetch data from the table: "guarantor" */
  guarantor: Array<Guarantor>;
  /** fetch aggregated fields from the table: "guarantor" */
  guarantor_aggregate: Guarantor_Aggregate;
  /** fetch data from the table: "guarantor" using primary key columns */
  guarantor_by_pk?: Maybe<Guarantor>;
  /** fetch data from the table in a streaming manner: "guarantor" */
  guarantor_stream: Array<Guarantor>;
  /** fetch data from the table: "guarantor_user_mapping" */
  guarantor_user_mapping: Array<Guarantor_User_Mapping>;
  /** fetch aggregated fields from the table: "guarantor_user_mapping" */
  guarantor_user_mapping_aggregate: Guarantor_User_Mapping_Aggregate;
  /** fetch data from the table: "guarantor_user_mapping" using primary key columns */
  guarantor_user_mapping_by_pk?: Maybe<Guarantor_User_Mapping>;
  /** fetch data from the table in a streaming manner: "guarantor_user_mapping" */
  guarantor_user_mapping_stream: Array<Guarantor_User_Mapping>;
  /** fetch data from the table: "phone" */
  phone: Array<Phone>;
  /** fetch aggregated fields from the table: "phone" */
  phone_aggregate: Phone_Aggregate;
  /** fetch data from the table: "phone" using primary key columns */
  phone_by_pk?: Maybe<Phone>;
  /** fetch data from the table in a streaming manner: "phone" */
  phone_stream: Array<Phone>;
  /** fetch data from the table: "user_detail" */
  user_detail: Array<User_Detail>;
  /** fetch aggregated fields from the table: "user_detail" */
  user_detail_aggregate: User_Detail_Aggregate;
  /** fetch data from the table: "user_detail" using primary key columns */
  user_detail_by_pk?: Maybe<User_Detail>;
  /** fetch data from the table in a streaming manner: "user_detail" */
  user_detail_stream: Array<User_Detail>;
};

export type Subscription_RootAddressArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

export type Subscription_RootAddress_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

export type Subscription_RootAddress_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootAddress_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Address_Stream_Cursor_Input>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

export type Subscription_RootCollateralArgs = {
  distinct_on?: InputMaybe<Array<Collateral_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Collateral_Order_By>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

export type Subscription_RootCollateral_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collateral_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Collateral_Order_By>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

export type Subscription_RootCollateral_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootCollateral_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Collateral_Stream_Cursor_Input>>;
  where?: InputMaybe<Collateral_Bool_Exp>;
};

export type Subscription_RootCompanyArgs = {
  distinct_on?: InputMaybe<Array<Company_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Company_Order_By>>;
  where?: InputMaybe<Company_Bool_Exp>;
};

export type Subscription_RootCompany_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Company_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Company_Order_By>>;
  where?: InputMaybe<Company_Bool_Exp>;
};

export type Subscription_RootCompany_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootCompany_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Company_Stream_Cursor_Input>>;
  where?: InputMaybe<Company_Bool_Exp>;
};

export type Subscription_RootConsumerArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Order_By>>;
  where?: InputMaybe<Consumer_Bool_Exp>;
};

export type Subscription_RootConsumer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Order_By>>;
  where?: InputMaybe<Consumer_Bool_Exp>;
};

export type Subscription_RootConsumer_ApplicationArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_Order_By>>;
  where?: InputMaybe<Consumer_Application_Bool_Exp>;
};

export type Subscription_RootConsumer_Application_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_Order_By>>;
  where?: InputMaybe<Consumer_Application_Bool_Exp>;
};

export type Subscription_RootConsumer_Application_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_Application_StateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_State_Order_By>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

export type Subscription_RootConsumer_Application_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Application_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Application_State_Order_By>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

export type Subscription_RootConsumer_Application_State_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_Application_State_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_Application_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_Application_State_Bool_Exp>;
};

export type Subscription_RootConsumer_Application_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_Application_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_Application_Bool_Exp>;
};

export type Subscription_RootConsumer_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_GroupArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Order_By>>;
  where?: InputMaybe<Consumer_Group_Bool_Exp>;
};

export type Subscription_RootConsumer_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Order_By>>;
  where?: InputMaybe<Consumer_Group_Bool_Exp>;
};

export type Subscription_RootConsumer_Group_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_Group_MemberArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

export type Subscription_RootConsumer_Group_Member_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Group_Member_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Group_Member_Order_By>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

export type Subscription_RootConsumer_Group_Member_By_PkArgs = {
  consumer_group_id: Scalars["String"]["input"];
  consumer_id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_Group_Member_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_Group_Member_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_Group_Member_Bool_Exp>;
};

export type Subscription_RootConsumer_Group_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_Group_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_Group_Bool_Exp>;
};

export type Subscription_RootConsumer_KycArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

export type Subscription_RootConsumer_Kyc_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_Kyc_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_Kyc_Order_By>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

export type Subscription_RootConsumer_Kyc_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_Kyc_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_Kyc_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_Kyc_Bool_Exp>;
};

export type Subscription_RootConsumer_StateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_State_Order_By>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

export type Subscription_RootConsumer_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_State_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_State_Order_By>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

export type Subscription_RootConsumer_State_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_State_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_State_Bool_Exp>;
};

export type Subscription_RootConsumer_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_Bool_Exp>;
};

export type Subscription_RootConsumer_User_MappingArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

export type Subscription_RootConsumer_User_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

export type Subscription_RootConsumer_User_Mapping_By_PkArgs = {
  consumer_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

export type Subscription_RootConsumer_User_Mapping_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Consumer_User_Mapping_Stream_Cursor_Input>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

export type Subscription_RootCredit_LimitArgs = {
  distinct_on?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Credit_Limit_Order_By>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

export type Subscription_RootCredit_Limit_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Credit_Limit_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Credit_Limit_Order_By>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

export type Subscription_RootCredit_Limit_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootCredit_Limit_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Credit_Limit_Stream_Cursor_Input>>;
  where?: InputMaybe<Credit_Limit_Bool_Exp>;
};

export type Subscription_RootGuarantorArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_Order_By>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

export type Subscription_RootGuarantor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_Order_By>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

export type Subscription_RootGuarantor_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootGuarantor_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Guarantor_Stream_Cursor_Input>>;
  where?: InputMaybe<Guarantor_Bool_Exp>;
};

export type Subscription_RootGuarantor_User_MappingArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

export type Subscription_RootGuarantor_User_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

export type Subscription_RootGuarantor_User_Mapping_By_PkArgs = {
  guarantor_id: Scalars["String"]["input"];
  user_id: Scalars["String"]["input"];
};

export type Subscription_RootGuarantor_User_Mapping_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Guarantor_User_Mapping_Stream_Cursor_Input>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

export type Subscription_RootPhoneArgs = {
  distinct_on?: InputMaybe<Array<Phone_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Phone_Order_By>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

export type Subscription_RootPhone_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Phone_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Phone_Order_By>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

export type Subscription_RootPhone_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootPhone_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Phone_Stream_Cursor_Input>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

export type Subscription_RootUser_DetailArgs = {
  distinct_on?: InputMaybe<Array<User_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Detail_Order_By>>;
  where?: InputMaybe<User_Detail_Bool_Exp>;
};

export type Subscription_RootUser_Detail_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<User_Detail_Order_By>>;
  where?: InputMaybe<User_Detail_Bool_Exp>;
};

export type Subscription_RootUser_Detail_By_PkArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootUser_Detail_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<User_Detail_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Detail_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** columns and relationships of "user_detail" */
export type User_Detail = {
  /** An array relationship */
  addresses: Array<Address>;
  /** An aggregate relationship */
  addresses_aggregate: Address_Aggregate;
  /** An array relationship */
  consumer_user_mappings: Array<Consumer_User_Mapping>;
  /** An aggregate relationship */
  consumer_user_mappings_aggregate: Consumer_User_Mapping_Aggregate;
  created_at_utc: Scalars["timestamp"]["output"];
  created_by: Scalars["String"]["output"];
  date_of_birth: Scalars["date"]["output"];
  first_name: Scalars["String"]["output"];
  gender: Scalars["gender_type"]["output"];
  /** An array relationship */
  guarantor_user_mappings: Array<Guarantor_User_Mapping>;
  /** An aggregate relationship */
  guarantor_user_mappings_aggregate: Guarantor_User_Mapping_Aggregate;
  id: Scalars["String"]["output"];
  last_name: Scalars["String"]["output"];
  marital_status: Scalars["marital_status_type"]["output"];
  middle_name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  phones: Array<Phone>;
  /** An aggregate relationship */
  phones_aggregate: Phone_Aggregate;
  update_at_utc: Scalars["timestamptz"]["output"];
  updated_by: Scalars["String"]["output"];
};

/** columns and relationships of "user_detail" */
export type User_DetailAddressesArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailAddresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailConsumer_User_MappingsArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailConsumer_User_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Consumer_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Consumer_User_Mapping_Order_By>>;
  where?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailGuarantor_User_MappingsArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailGuarantor_User_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Guarantor_User_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Guarantor_User_Mapping_Order_By>>;
  where?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailPhonesArgs = {
  distinct_on?: InputMaybe<Array<Phone_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Phone_Order_By>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

/** columns and relationships of "user_detail" */
export type User_DetailPhones_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Phone_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Phone_Order_By>>;
  where?: InputMaybe<Phone_Bool_Exp>;
};

/** aggregated selection of "user_detail" */
export type User_Detail_Aggregate = {
  aggregate?: Maybe<User_Detail_Aggregate_Fields>;
  nodes: Array<User_Detail>;
};

/** aggregate fields of "user_detail" */
export type User_Detail_Aggregate_Fields = {
  count: Scalars["Int"]["output"];
  max?: Maybe<User_Detail_Max_Fields>;
  min?: Maybe<User_Detail_Min_Fields>;
};

/** aggregate fields of "user_detail" */
export type User_Detail_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Detail_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "user_detail". All fields are combined with a logical 'AND'. */
export type User_Detail_Bool_Exp = {
  _and?: InputMaybe<Array<User_Detail_Bool_Exp>>;
  _not?: InputMaybe<User_Detail_Bool_Exp>;
  _or?: InputMaybe<Array<User_Detail_Bool_Exp>>;
  addresses?: InputMaybe<Address_Bool_Exp>;
  addresses_aggregate?: InputMaybe<Address_Aggregate_Bool_Exp>;
  consumer_user_mappings?: InputMaybe<Consumer_User_Mapping_Bool_Exp>;
  consumer_user_mappings_aggregate?: InputMaybe<Consumer_User_Mapping_Aggregate_Bool_Exp>;
  created_at_utc?: InputMaybe<Timestamp_Comparison_Exp>;
  created_by?: InputMaybe<String_Comparison_Exp>;
  date_of_birth?: InputMaybe<Date_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  gender?: InputMaybe<Gender_Type_Comparison_Exp>;
  guarantor_user_mappings?: InputMaybe<Guarantor_User_Mapping_Bool_Exp>;
  guarantor_user_mappings_aggregate?: InputMaybe<Guarantor_User_Mapping_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  marital_status?: InputMaybe<Marital_Status_Type_Comparison_Exp>;
  middle_name?: InputMaybe<String_Comparison_Exp>;
  phones?: InputMaybe<Phone_Bool_Exp>;
  phones_aggregate?: InputMaybe<Phone_Aggregate_Bool_Exp>;
  update_at_utc?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_detail" */
export type User_Detail_Constraint =
  /** unique or primary key constraint on columns "id" */
  "pk_user_detail";

/** input type for inserting data into table "user_detail" */
export type User_Detail_Insert_Input = {
  addresses?: InputMaybe<Address_Arr_Rel_Insert_Input>;
  consumer_user_mappings?: InputMaybe<Consumer_User_Mapping_Arr_Rel_Insert_Input>;
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  date_of_birth?: InputMaybe<Scalars["date"]["input"]>;
  first_name?: InputMaybe<Scalars["String"]["input"]>;
  gender?: InputMaybe<Scalars["gender_type"]["input"]>;
  guarantor_user_mappings?: InputMaybe<Guarantor_User_Mapping_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  last_name?: InputMaybe<Scalars["String"]["input"]>;
  marital_status?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  middle_name?: InputMaybe<Scalars["String"]["input"]>;
  phones?: InputMaybe<Phone_Arr_Rel_Insert_Input>;
  update_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type User_Detail_Max_Fields = {
  created_at_utc?: Maybe<Scalars["timestamp"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  date_of_birth?: Maybe<Scalars["date"]["output"]>;
  first_name?: Maybe<Scalars["String"]["output"]>;
  gender?: Maybe<Scalars["gender_type"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  last_name?: Maybe<Scalars["String"]["output"]>;
  marital_status?: Maybe<Scalars["marital_status_type"]["output"]>;
  middle_name?: Maybe<Scalars["String"]["output"]>;
  update_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_by?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type User_Detail_Min_Fields = {
  created_at_utc?: Maybe<Scalars["timestamp"]["output"]>;
  created_by?: Maybe<Scalars["String"]["output"]>;
  date_of_birth?: Maybe<Scalars["date"]["output"]>;
  first_name?: Maybe<Scalars["String"]["output"]>;
  gender?: Maybe<Scalars["gender_type"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  last_name?: Maybe<Scalars["String"]["output"]>;
  marital_status?: Maybe<Scalars["marital_status_type"]["output"]>;
  middle_name?: Maybe<Scalars["String"]["output"]>;
  update_at_utc?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_by?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "user_detail" */
export type User_Detail_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<User_Detail>;
};

/** input type for inserting object relation for remote table "user_detail" */
export type User_Detail_Obj_Rel_Insert_Input = {
  data: User_Detail_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_Detail_On_Conflict>;
};

/** on_conflict condition type for table "user_detail" */
export type User_Detail_On_Conflict = {
  constraint: User_Detail_Constraint;
  update_columns?: Array<User_Detail_Update_Column>;
  where?: InputMaybe<User_Detail_Bool_Exp>;
};

/** Ordering options when selecting data from "user_detail". */
export type User_Detail_Order_By = {
  addresses_aggregate?: InputMaybe<Address_Aggregate_Order_By>;
  consumer_user_mappings_aggregate?: InputMaybe<Consumer_User_Mapping_Aggregate_Order_By>;
  created_at_utc?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  date_of_birth?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  guarantor_user_mappings_aggregate?: InputMaybe<Guarantor_User_Mapping_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  marital_status?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  phones_aggregate?: InputMaybe<Phone_Aggregate_Order_By>;
  update_at_utc?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_detail */
export type User_Detail_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "user_detail" */
export type User_Detail_Select_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "date_of_birth"
  /** column name */
  | "first_name"
  /** column name */
  | "gender"
  /** column name */
  | "id"
  /** column name */
  | "last_name"
  /** column name */
  | "marital_status"
  /** column name */
  | "middle_name"
  /** column name */
  | "update_at_utc"
  /** column name */
  | "updated_by";

/** input type for updating data in table "user_detail" */
export type User_Detail_Set_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  date_of_birth?: InputMaybe<Scalars["date"]["input"]>;
  first_name?: InputMaybe<Scalars["String"]["input"]>;
  gender?: InputMaybe<Scalars["gender_type"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  last_name?: InputMaybe<Scalars["String"]["input"]>;
  marital_status?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  middle_name?: InputMaybe<Scalars["String"]["input"]>;
  update_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "user_detail" */
export type User_Detail_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Detail_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Detail_Stream_Cursor_Value_Input = {
  created_at_utc?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_by?: InputMaybe<Scalars["String"]["input"]>;
  date_of_birth?: InputMaybe<Scalars["date"]["input"]>;
  first_name?: InputMaybe<Scalars["String"]["input"]>;
  gender?: InputMaybe<Scalars["gender_type"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  last_name?: InputMaybe<Scalars["String"]["input"]>;
  marital_status?: InputMaybe<Scalars["marital_status_type"]["input"]>;
  middle_name?: InputMaybe<Scalars["String"]["input"]>;
  update_at_utc?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_by?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "user_detail" */
export type User_Detail_Update_Column =
  /** column name */
  | "created_at_utc"
  /** column name */
  | "created_by"
  /** column name */
  | "date_of_birth"
  /** column name */
  | "first_name"
  /** column name */
  | "gender"
  /** column name */
  | "id"
  /** column name */
  | "last_name"
  /** column name */
  | "marital_status"
  /** column name */
  | "middle_name"
  /** column name */
  | "update_at_utc"
  /** column name */
  | "updated_by";

export type User_Detail_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Detail_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Detail_Bool_Exp;
};
