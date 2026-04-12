export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AnonymizePatientInput = {
  id: Scalars['ID']['input'];
};

export type Consult = {
  __typename?: 'Consult';
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  patient_id: Scalars['ID']['output'];
  status: EConsultStatus;
  tenant_ref: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
};

export type ConsultByOrderId = {
  __typename?: 'ConsultByOrderId';
  notes?: Maybe<Scalars['String']['output']>;
};

export type ConsultComplaint = {
  __typename?: 'ConsultComplaint';
  key: Scalars['String']['output'];
  since: Scalars['String']['output'];
};

export type ConsultComplaintInput = {
  key: Scalars['String']['input'];
  since: Scalars['String']['input'];
};

export type ConsultEssentialInfoQuestion = {
  __typename?: 'ConsultEssentialInfoQuestion';
  checked: Scalars['Boolean']['output'];
  predefined_question: Scalars['String']['output'];
};

export type ConsultEssentialInfoQuestionInput = {
  checked: Scalars['Boolean']['input'];
  predefined_question: Scalars['String']['input'];
};

export type ConsultExtended = {
  __typename?: 'ConsultExtended';
  active_assessment?: Maybe<Scalars['String']['output']>;
  additional_tests?: Maybe<Scalars['String']['output']>;
  average_pain_score?: Maybe<Scalars['Int']['output']>;
  complaints?: Maybe<Array<ConsultComplaint>>;
  conclusion?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  diagnosis?: Maybe<Scalars['String']['output']>;
  dynamic_analyse_left?: Maybe<Scalars['String']['output']>;
  dynamic_analyse_remark?: Maybe<Scalars['String']['output']>;
  dynamic_analyse_right?: Maybe<Scalars['String']['output']>;
  enable_reminder?: Maybe<Scalars['Boolean']['output']>;
  essential_info?: Maybe<Array<ConsultEssentialInfoQuestion>>;
  essential_info_notes?: Maybe<Scalars['String']['output']>;
  evaluation_average_pain_score?: Maybe<Scalars['Int']['output']>;
  evaluation_date?: Maybe<Scalars['String']['output']>;
  evaluation_maximum_pain_score?: Maybe<Scalars['Int']['output']>;
  evaluation_name?: Maybe<Scalars['String']['output']>;
  evaluation_notes?: Maybe<Scalars['String']['output']>;
  evaluation_psk_hobby?: Maybe<Scalars['Int']['output']>;
  evaluation_psk_sport?: Maybe<Scalars['Int']['output']>;
  evaluation_psk_work?: Maybe<Scalars['Int']['output']>;
  exercises?: Maybe<Scalars['String']['output']>;
  follow_up_comments?: Maybe<Scalars['String']['output']>;
  follow_up_vas_score?: Maybe<Scalars['Int']['output']>;
  foot_type_left?: Maybe<Scalars['String']['output']>;
  foot_type_right?: Maybe<Scalars['String']['output']>;
  forefoot_angle_left?: Maybe<Scalars['String']['output']>;
  forefoot_angle_right?: Maybe<Scalars['String']['output']>;
  general_inspection?: Maybe<Scalars['String']['output']>;
  hips_left?: Maybe<Scalars['String']['output']>;
  hips_right?: Maybe<Scalars['String']['output']>;
  hobbies?: Maybe<Array<ConsultHobby>>;
  id: Scalars['ID']['output'];
  insole_existing?: Maybe<Scalars['String']['output']>;
  insole_notes?: Maybe<Scalars['String']['output']>;
  kneeing_in_left?: Maybe<Scalars['Boolean']['output']>;
  kneeing_in_right?: Maybe<Scalars['Boolean']['output']>;
  knees_left?: Maybe<Scalars['String']['output']>;
  knees_right?: Maybe<Scalars['String']['output']>;
  main_goal?: Maybe<Scalars['String']['output']>;
  maximum_pain_score?: Maybe<Scalars['Int']['output']>;
  medical_history?: Maybe<Scalars['String']['output']>;
  months_before_reminder?: Maybe<Scalars['Int']['output']>;
  mt1_2_mobility_left?: Maybe<Scalars['String']['output']>;
  mt1_2_mobility_right?: Maybe<Scalars['String']['output']>;
  mtp1_dorsalflexi_rom_left?: Maybe<Scalars['String']['output']>;
  mtp1_dorsalflexi_rom_right?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  occupations?: Maybe<Array<ConsultOccupation>>;
  one_leg_ankle_coordination_left?: Maybe<Scalars['Int']['output']>;
  one_leg_ankle_coordination_right?: Maybe<Scalars['Int']['output']>;
  one_leg_body_coordination_left?: Maybe<Scalars['Int']['output']>;
  one_leg_body_coordination_right?: Maybe<Scalars['Int']['output']>;
  one_leg_general_coordination_left?: Maybe<Scalars['Int']['output']>;
  one_leg_general_coordination_right?: Maybe<Scalars['Int']['output']>;
  one_leg_knee_coordination_left?: Maybe<Scalars['Int']['output']>;
  one_leg_knee_coordination_right?: Maybe<Scalars['Int']['output']>;
  passive_assessment?: Maybe<Scalars['String']['output']>;
  pathologies?: Maybe<Array<ConsultPathology>>;
  patient_id: Scalars['ID']['output'];
  pelvis_left?: Maybe<Scalars['String']['output']>;
  pelvis_right?: Maybe<Scalars['String']['output']>;
  physical_age?: Maybe<Scalars['String']['output']>;
  posture?: Maybe<Scalars['String']['output']>;
  profile_b_diagnosis?: Maybe<Scalars['String']['output']>;
  profile_b_foot_type_left?: Maybe<EFootType>;
  profile_b_foot_type_right?: Maybe<EFootType>;
  profile_b_notes?: Maybe<Scalars['String']['output']>;
  reason_visit?: Maybe<Scalars['String']['output']>;
  recovery?: Maybe<Scalars['String']['output']>;
  referrals?: Maybe<Scalars['String']['output']>;
  referring_practitioner?: Maybe<Scalars['String']['output']>;
  referring_via?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  resistance_tests?: Maybe<Scalars['String']['output']>;
  satisfaction?: Maybe<Scalars['String']['output']>;
  scan_2d_templates?: Maybe<Array<Scalars['String']['output']>>;
  scan_3d_templates?: Maybe<Array<Scalars['String']['output']>>;
  scan_pp_templates?: Maybe<Array<Scalars['String']['output']>>;
  sensitive_to_stress?: Maybe<Scalars['String']['output']>;
  shoe_advise?: Maybe<Scalars['String']['output']>;
  shoes?: Maybe<Array<ConsultShoeInspection>>;
  sports?: Maybe<Array<ConsultSport>>;
  squat_left?: Maybe<Scalars['Int']['output']>;
  squat_right?: Maybe<Scalars['Int']['output']>;
  status: EConsultStatus;
  tenant_ref: Scalars['ID']['output'];
  tibia_left?: Maybe<Scalars['String']['output']>;
  tibia_right?: Maybe<Scalars['String']['output']>;
  trendelenburg_left?: Maybe<Scalars['Boolean']['output']>;
  trendelenburg_right?: Maybe<Scalars['Boolean']['output']>;
  user_id: Scalars['ID']['output'];
  vas_score?: Maybe<Scalars['Int']['output']>;
  walk_run_technic?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type ConsultExtendedInput = {
  active_assessment?: InputMaybe<Scalars['String']['input']>;
  additional_tests?: InputMaybe<Scalars['String']['input']>;
  average_pain_score?: InputMaybe<Scalars['Int']['input']>;
  complaints?: InputMaybe<Array<ConsultComplaintInput>>;
  conclusion?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  diagnosis?: InputMaybe<Scalars['String']['input']>;
  dynamic_analyse_left?: InputMaybe<Scalars['String']['input']>;
  dynamic_analyse_remark?: InputMaybe<Scalars['String']['input']>;
  dynamic_analyse_right?: InputMaybe<Scalars['String']['input']>;
  enable_reminder?: InputMaybe<Scalars['Boolean']['input']>;
  essential_info?: InputMaybe<Array<ConsultEssentialInfoQuestionInput>>;
  essential_info_notes?: InputMaybe<Scalars['String']['input']>;
  evaluation_average_pain_score?: InputMaybe<Scalars['Int']['input']>;
  evaluation_date?: InputMaybe<Scalars['String']['input']>;
  evaluation_maximum_pain_score?: InputMaybe<Scalars['Int']['input']>;
  evaluation_name?: InputMaybe<Scalars['String']['input']>;
  evaluation_notes?: InputMaybe<Scalars['String']['input']>;
  evaluation_psk_hobby?: InputMaybe<Scalars['Int']['input']>;
  evaluation_psk_sport?: InputMaybe<Scalars['Int']['input']>;
  evaluation_psk_work?: InputMaybe<Scalars['Int']['input']>;
  exercises?: InputMaybe<Scalars['String']['input']>;
  follow_up_comments?: InputMaybe<Scalars['String']['input']>;
  follow_up_vas_score?: InputMaybe<Scalars['Int']['input']>;
  foot_type_left?: InputMaybe<Scalars['String']['input']>;
  foot_type_right?: InputMaybe<Scalars['String']['input']>;
  forefoot_angle_left?: InputMaybe<Scalars['String']['input']>;
  forefoot_angle_right?: InputMaybe<Scalars['String']['input']>;
  general_inspection?: InputMaybe<Scalars['String']['input']>;
  hips_left?: InputMaybe<Scalars['String']['input']>;
  hips_right?: InputMaybe<Scalars['String']['input']>;
  hobbies?: InputMaybe<Array<ConsultHobbyInput>>;
  id: Scalars['ID']['input'];
  insole_existing?: InputMaybe<Scalars['String']['input']>;
  insole_notes?: InputMaybe<Scalars['String']['input']>;
  kneeing_in_left?: InputMaybe<Scalars['Boolean']['input']>;
  kneeing_in_right?: InputMaybe<Scalars['Boolean']['input']>;
  knees_left?: InputMaybe<Scalars['String']['input']>;
  knees_right?: InputMaybe<Scalars['String']['input']>;
  main_goal?: InputMaybe<Scalars['String']['input']>;
  maximum_pain_score?: InputMaybe<Scalars['Int']['input']>;
  medical_history?: InputMaybe<Scalars['String']['input']>;
  months_before_reminder?: InputMaybe<Scalars['Int']['input']>;
  mt1_2_mobility_left?: InputMaybe<Scalars['String']['input']>;
  mt1_2_mobility_right?: InputMaybe<Scalars['String']['input']>;
  mtp1_dorsalflexi_rom_left?: InputMaybe<Scalars['String']['input']>;
  mtp1_dorsalflexi_rom_right?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  occupations?: InputMaybe<Array<ConsultOccupationInput>>;
  one_leg_ankle_coordination_left?: InputMaybe<Scalars['Int']['input']>;
  one_leg_ankle_coordination_right?: InputMaybe<Scalars['Int']['input']>;
  one_leg_body_coordination_left?: InputMaybe<Scalars['Int']['input']>;
  one_leg_body_coordination_right?: InputMaybe<Scalars['Int']['input']>;
  one_leg_general_coordination_left?: InputMaybe<Scalars['Int']['input']>;
  one_leg_general_coordination_right?: InputMaybe<Scalars['Int']['input']>;
  one_leg_knee_coordination_left?: InputMaybe<Scalars['Int']['input']>;
  one_leg_knee_coordination_right?: InputMaybe<Scalars['Int']['input']>;
  passive_assessment?: InputMaybe<Scalars['String']['input']>;
  pathologies?: InputMaybe<Array<ConsultPathologyInput>>;
  patient_id: Scalars['ID']['input'];
  pelvis_left?: InputMaybe<Scalars['String']['input']>;
  pelvis_right?: InputMaybe<Scalars['String']['input']>;
  physical_age?: InputMaybe<Scalars['String']['input']>;
  posture?: InputMaybe<Scalars['String']['input']>;
  profile_b_diagnosis?: InputMaybe<Scalars['String']['input']>;
  profile_b_foot_type_left?: InputMaybe<EFootType>;
  profile_b_foot_type_right?: InputMaybe<EFootType>;
  profile_b_notes?: InputMaybe<Scalars['String']['input']>;
  reason_visit?: InputMaybe<Scalars['String']['input']>;
  recovery?: InputMaybe<Scalars['String']['input']>;
  referrals?: InputMaybe<Scalars['String']['input']>;
  referring_practitioner?: InputMaybe<Scalars['String']['input']>;
  referring_via?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  resistance_tests?: InputMaybe<Scalars['String']['input']>;
  satisfaction?: InputMaybe<Scalars['String']['input']>;
  scan_2d_templates?: InputMaybe<Array<Scalars['String']['input']>>;
  scan_3d_templates?: InputMaybe<Array<Scalars['String']['input']>>;
  scan_pp_templates?: InputMaybe<Array<Scalars['String']['input']>>;
  sensitive_to_stress?: InputMaybe<Scalars['String']['input']>;
  shoe_advise?: InputMaybe<Scalars['String']['input']>;
  shoes?: InputMaybe<Array<ConsultShoeInspectionInput>>;
  sports?: InputMaybe<Array<ConsultSportInput>>;
  squat_left?: InputMaybe<Scalars['Int']['input']>;
  squat_right?: InputMaybe<Scalars['Int']['input']>;
  status: EConsultStatus;
  tenant_ref: Scalars['ID']['input'];
  tibia_left?: InputMaybe<Scalars['String']['input']>;
  tibia_right?: InputMaybe<Scalars['String']['input']>;
  trendelenburg_left?: InputMaybe<Scalars['Boolean']['input']>;
  trendelenburg_right?: InputMaybe<Scalars['Boolean']['input']>;
  user_id: Scalars['ID']['input'];
  vas_score?: InputMaybe<Scalars['Int']['input']>;
  walk_run_technic?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type ConsultHobby = {
  __typename?: 'ConsultHobby';
  key: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type ConsultHobbyInput = {
  key: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};

export type ConsultInput = {
  date: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  patient_id: Scalars['ID']['input'];
  status: EConsultStatus;
  tenant_ref: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};

export type ConsultOccupation = {
  __typename?: 'ConsultOccupation';
  key: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type ConsultOccupationInput = {
  key: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};

export type ConsultOption = {
  __typename?: 'ConsultOption';
  entity: EConsultOptionEntity;
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
};

export type ConsultPathology = {
  __typename?: 'ConsultPathology';
  key: Scalars['String']['output'];
};

export type ConsultPathologyInput = {
  key: Scalars['String']['input'];
};

export type ConsultShoeInspection = {
  __typename?: 'ConsultShoeInspection';
  brand: Scalars['String']['output'];
  model: Scalars['String']['output'];
  size: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ConsultShoeInspectionInput = {
  brand: Scalars['String']['input'];
  model: Scalars['String']['input'];
  size: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type ConsultSport = {
  __typename?: 'ConsultSport';
  frequency: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type ConsultSportInput = {
  frequency: Scalars['Int']['input'];
  key: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};

export type Counter = {
  __typename?: 'Counter';
  counter: Scalars['Int']['output'];
  counter_type: ECounterType;
  manager_tenant_id: Scalars['ID']['output'];
};

export type CountriesResponseItem = {
  __typename?: 'CountriesResponseItem';
  countryCode: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
};

export type CreateInsolePlanFromDataInput = {
  bottom_finish?: InputMaybe<EBottomFinish>;
  cad_model?: InputMaybe<Scalars['String']['input']>;
  consult_id: Scalars['ID']['input'];
  core_material?: InputMaybe<Scalars['String']['input']>;
  created_at: Scalars['String']['input'];
  deliver_top_cover_material_separately?: InputMaybe<Scalars['Boolean']['input']>;
  elements?: InputMaybe<Array<InsolePlanElementInput>>;
  finishing_by?: InputMaybe<EFinishingBy>;
  fore_foot_lateral_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  fore_foot_lateral_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  fore_foot_medial_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  fore_foot_medial_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  ground_sole_pattern?: InputMaybe<Scalars['String']['input']>;
  ground_sole_thickness_left?: InputMaybe<Scalars['Float']['input']>;
  ground_sole_thickness_right?: InputMaybe<Scalars['Float']['input']>;
  heel_lift_left?: InputMaybe<Scalars['Float']['input']>;
  heel_lift_right?: InputMaybe<Scalars['Float']['input']>;
  hind_foot_left?: InputMaybe<Scalars['Float']['input']>;
  hind_foot_right?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  infill?: InputMaybe<EInfill>;
  insole_type?: InputMaybe<EInsoleType>;
  manager_tenant_ref: Scalars['ID']['input'];
  middle_hind_foot_left?: InputMaybe<Scalars['Float']['input']>;
  middle_hind_foot_right?: InputMaybe<Scalars['Float']['input']>;
  modelling_required?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  patient_id: Scalars['ID']['input'];
  production_method?: InputMaybe<EProductionMethod>;
  production_notes?: InputMaybe<Scalars['String']['input']>;
  rear_foot_lateral_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  rear_foot_lateral_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  rear_foot_medial_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  rear_foot_medial_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  side?: InputMaybe<ESide>;
  size?: InputMaybe<Scalars['Float']['input']>;
  sole_lateral_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  sole_lateral_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  sole_medial_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  sole_medial_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  top_cover_material?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['ID']['input'];
  workshop?: InputMaybe<Scalars['String']['input']>;
  workshop_tenant_ref: Scalars['ID']['input'];
};

export type CreateInsolePlanInput = {
  consult_id: Scalars['ID']['input'];
  fore_foot_lateral_rotation_left: Scalars['Float']['input'];
  fore_foot_lateral_rotation_right: Scalars['Float']['input'];
  fore_foot_medial_rotation_left: Scalars['Float']['input'];
  fore_foot_medial_rotation_right: Scalars['Float']['input'];
  ground_sole_thickness_left: Scalars['Float']['input'];
  ground_sole_thickness_right: Scalars['Float']['input'];
  heel_lift_left: Scalars['Float']['input'];
  heel_lift_right: Scalars['Float']['input'];
  hind_foot_left: Scalars['Float']['input'];
  hind_foot_right: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  manager_tenant_ref: Scalars['ID']['input'];
  middle_hind_foot_left: Scalars['Float']['input'];
  middle_hind_foot_right: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  patient_id: Scalars['ID']['input'];
  rear_foot_lateral_rotation_left: Scalars['Float']['input'];
  rear_foot_lateral_rotation_right: Scalars['Float']['input'];
  rear_foot_medial_rotation_left: Scalars['Float']['input'];
  rear_foot_medial_rotation_right: Scalars['Float']['input'];
  sole_lateral_rotation_left: Scalars['Float']['input'];
  sole_lateral_rotation_right: Scalars['Float']['input'];
  sole_medial_rotation_left: Scalars['Float']['input'];
  sole_medial_rotation_right: Scalars['Float']['input'];
  user_id: Scalars['ID']['input'];
};

export type CreateOrderInput = {
  attachments?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  confirmed_at?: InputMaybe<Scalars['String']['input']>;
  consult_id: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  insole_plan_id: Scalars['ID']['input'];
  is_urgent?: InputMaybe<Scalars['Boolean']['input']>;
  manager_tenant_id: Scalars['ID']['input'];
  manager_tenant_name: Scalars['String']['input'];
  manager_tenant_ref: Scalars['String']['input'];
  manager_user_id: Scalars['ID']['input'];
  material?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  patient_id: Scalars['ID']['input'];
  production_method: EProductionMethod;
  scan_2d_templates?: InputMaybe<Array<Scalars['String']['input']>>;
  scan_3d_templates?: InputMaybe<Array<Scalars['String']['input']>>;
  scan_pp_templates?: InputMaybe<Array<Scalars['String']['input']>>;
  shipping_target: EShippingTarget;
  status: EOrderStatus;
  version_number: Scalars['Int']['input'];
  workshop_tenant_id: Scalars['ID']['input'];
  workshop_tenant_ref: Scalars['String']['input'];
};

export type CreatePatientInput = {
  bsn_number?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  date_of_birth: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  external_id?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EPatientGender>;
  health_insurance_number?: InputMaybe<Scalars['String']['input']>;
  health_insurer?: InputMaybe<Scalars['String']['input']>;
  house_number?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  id_number?: InputMaybe<Scalars['String']['input']>;
  id_type?: InputMaybe<EPatientIdType>;
  initials?: InputMaybe<Scalars['String']['input']>;
  last_name: Scalars['String']['input'];
  middle_name?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  patient_number?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  salutation?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<EPatientStatus>;
  street?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['ID']['input'];
  tenant_ref: Scalars['ID']['input'];
  title?: InputMaybe<EPatientTitle>;
};

export type CreateScanInput = {
  cad_template_url_left?: InputMaybe<Scalars['String']['input']>;
  cad_template_url_right?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  device: EScanDevice;
  dicom_url_both?: InputMaybe<Scalars['String']['input']>;
  dicom_url_left?: InputMaybe<Scalars['String']['input']>;
  dicom_url_right?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  modality: EScanModality;
  original_url_both?: InputMaybe<Scalars['String']['input']>;
  original_url_left?: InputMaybe<Scalars['String']['input']>;
  original_url_right?: InputMaybe<Scalars['String']['input']>;
  patient_id: Scalars['ID']['input'];
  pixels_per_inch: Scalars['Float']['input'];
  tenant_ref: Scalars['ID']['input'];
  thumbnail_url_both?: InputMaybe<Scalars['String']['input']>;
  thumbnail_url_left?: InputMaybe<Scalars['String']['input']>;
  thumbnail_url_right?: InputMaybe<Scalars['String']['input']>;
  toolstate_url_both?: InputMaybe<Scalars['String']['input']>;
  toolstate_url_left?: InputMaybe<Scalars['String']['input']>;
  toolstate_url_right?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  poolType: Scalars['String']['input'];
  tenant_ref?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type DeleteInsolePlanResponse = {
  __typename?: 'DeleteInsolePlanResponse';
  id: Scalars['ID']['output'];
};

export type DiagnoseChapter = {
  __typename?: 'DiagnoseChapter';
  content: Scalars['String']['output'];
  heading: Scalars['String']['output'];
};

export type DiagnoseInfoData = {
  __typename?: 'DiagnoseInfoData';
  chapters: Array<DiagnoseChapter>;
  title: Scalars['String']['output'];
};

export type DiagnoseInfoResponse = {
  __typename?: 'DiagnoseInfoResponse';
  info?: Maybe<DiagnoseInfoData>;
  key: Scalars['String']['output'];
};

export type DuplicateInsolePlanInput = {
  insole_plan_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export enum EBottomFinish {
  AdlSmall = 'ADL_SMALL',
  Classic = 'CLASSIC',
  Durea = 'DUREA',
  DureaWide = 'DUREA_WIDE',
  FinnComfortFr = 'FINN_COMFORT_FR',
  FinnComfortUk = 'FINN_COMFORT_UK',
  GentlemenTrendy = 'GENTLEMEN_TRENDY',
  LadiesTrendy = 'LADIES_TRENDY',
  Sport = 'SPORT'
}

export enum EConsultOptionEntity {
  Complaint = 'COMPLAINT',
  ComplaintSince = 'COMPLAINT_SINCE',
  Diagnosis = 'DIAGNOSIS',
  DynamicAnalyse = 'DYNAMIC_ANALYSE',
  EssentialInformation = 'ESSENTIAL_INFORMATION',
  ExistingInsole = 'EXISTING_INSOLE',
  FootType = 'FOOT_TYPE',
  ForefootAngle = 'FOREFOOT_ANGLE',
  Hips = 'HIPS',
  Mtp_1DorsalflexiRom = 'MTP_1_DORSALFLEXI_ROM',
  Mt_1_2Mobility = 'MT_1_2_MOBILITY',
  Pathologies = 'PATHOLOGIES',
  Pelvis = 'PELVIS',
  PhysicalAge = 'PHYSICAL_AGE',
  Posture = 'POSTURE',
  ReasonVisit = 'REASON_VISIT',
  Recovery = 'RECOVERY',
  ReferredVia = 'REFERRED_VIA',
  Satisfaction = 'SATISFACTION',
  SensitiveToStress = 'SENSITIVE_TO_STRESS',
  ShoeType = 'SHOE_TYPE',
  Sport = 'SPORT',
  Tibia = 'TIBIA',
  WalkRunTechnic = 'WALK_RUN_TECHNIC'
}

export enum EConsultStatus {
  Closed = 'CLOSED',
  DiagnoseDone = 'DIAGNOSE_DONE',
  Draft = 'DRAFT',
  FollowUpDone = 'FOLLOW_UP_DONE',
  OrderCreated = 'ORDER_CREATED'
}

export enum ECounterType {
  Order = 'ORDER',
  Patient = 'PATIENT'
}

export enum EFinishingBy {
  Insolution = 'INSOLUTION',
  Practitioner = 'PRACTITIONER'
}

export enum EFootType {
  Cavus = 'CAVUS',
  Planus = 'PLANUS',
  Rectus = 'RECTUS'
}

export enum EGroundSolePatternGroup {
  Gzp = 'GZP',
  Gzppz = 'GZPPZ',
  Gzpvso = 'GZPVSO'
}

export enum EInfill {
  ExtraHard = 'EXTRA_HARD',
  ExtraSoft = 'EXTRA_SOFT',
  ExtraSoftForefootHardHindfoot = 'EXTRA_SOFT_FOREFOOT_HARD_HINDFOOT',
  Hard = 'HARD',
  Medium = 'MEDIUM',
  MediumForefootSupersoftHindfoot = 'MEDIUM_FOREFOOT_SUPERSOFT_HINDFOOT',
  Soft = 'SOFT',
  SupersoftForefootHardHindfoot = 'SUPERSOFT_FOREFOOT_HARD_HINDFOOT',
  SuperSoft = 'SUPER_SOFT',
  SuperSoftForefootMediumHindfoot = 'SUPER_SOFT_FOREFOOT_MEDIUM_HINDFOOT'
}

export enum EInsoleElementInfill {
  ExtraHard = 'EXTRA_HARD',
  ExtraSoft = 'EXTRA_SOFT',
  Hard = 'HARD',
  Medium = 'MEDIUM',
  Soft = 'SOFT',
  SuperSoft = 'SUPER_SOFT'
}

export enum EInsoleType {
  Maximum = 'MAXIMUM',
  Minimum = 'MINIMUM',
  Normal = 'NORMAL',
  Sport = 'SPORT'
}

export enum EManagerOrderStatus {
  AdditionalInformationNeeded = 'ADDITIONAL_INFORMATION_NEEDED',
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  InProduction = 'IN_PRODUCTION',
  New = 'NEW',
  Shipped = 'SHIPPED',
  ToBeChecked = 'TO_BE_CHECKED'
}

export enum EOrderStatus {
  AdditionalInformationNeeded = 'ADDITIONAL_INFORMATION_NEEDED',
  Cancelled = 'CANCELLED',
  Checked = 'CHECKED',
  Draft = 'DRAFT',
  InProduction = 'IN_PRODUCTION',
  ManualFinishing = 'MANUAL_FINISHING',
  NeedsModelling = 'NEEDS_MODELLING',
  New = 'NEW',
  Rework = 'REWORK',
  Shipped = 'SHIPPED',
  ToBeChecked = 'TO_BE_CHECKED'
}

export enum EPatientGender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN'
}

export enum EPatientIdType {
  DriverLicense = 'DRIVER_LICENSE',
  IdCard = 'ID_CARD',
  InsuranceCard = 'INSURANCE_CARD',
  Other = 'OTHER',
  Passport = 'PASSPORT',
  ResidencePermit = 'RESIDENCE_PERMIT'
}

export enum EPatientStatus {
  Active = 'ACTIVE',
  Anonymized = 'ANONYMIZED',
  Inactive = 'INACTIVE'
}

export enum EPatientTitle {
  Dr = 'DR',
  Miss = 'MISS',
  Mr = 'MR',
  Mrs = 'MRS',
  Ms = 'MS',
  Mx = 'MX',
  Other = 'OTHER',
  Prof = 'PROF'
}

export enum EProductionMethod {
  Hybrid = 'HYBRID',
  Milling = 'MILLING',
  Printing = 'PRINTING'
}

export enum EScanDevice {
  ExternalImport = 'EXTERNAL_IMPORT',
  PressurePlateMultiStep = 'PRESSURE_PLATE_MULTI_STEP',
  PressurePlateSingleStep = 'PRESSURE_PLATE_SINGLE_STEP',
  Scanner_2D = 'SCANNER_2D',
  Scanner_3D = 'SCANNER_3D'
}

export enum EScanModality {
  Blueprint = 'BLUEPRINT',
  Feetscan = 'FEETSCAN',
  Foambox = 'FOAMBOX',
  Footscan = 'FOOTSCAN',
  GaitAnalysis = 'GAIT_ANALYSIS',
  StaticPosture = 'STATIC_POSTURE'
}

export enum EScanStatus {
  OrderCreated = 'ORDER_CREATED'
}

export enum EShippingTarget {
  Patient = 'PATIENT',
  Tenant = 'TENANT'
}

export enum EShoeSizeSystem {
  Eu = 'EU',
  Uk = 'UK',
  Us = 'US'
}

export enum ESide {
  Both = 'BOTH',
  Left = 'LEFT',
  Right = 'RIGHT'
}

export enum ESignedUrlMethod {
  Get = 'GET',
  Put = 'PUT'
}

export enum ETenantProfile {
  A = 'A',
  B = 'B'
}

export type GroundSolePatternsResponseItem = {
  __typename?: 'GroundSolePatternsResponseItem';
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  shoesize_max?: Maybe<Scalars['Float']['output']>;
  shoesize_min?: Maybe<Scalars['Float']['output']>;
  shoesize_system?: Maybe<Scalars['String']['output']>;
};

export type InsoleElement = {
  __typename?: 'InsoleElement';
  height_adjustable?: Maybe<Scalars['Boolean']['output']>;
  height_default?: Maybe<Scalars['Float']['output']>;
  height_max?: Maybe<Scalars['Float']['output']>;
  height_min?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  library: Scalars['String']['output'];
  manual: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type InsoleElementIdsToHide = {
  __typename?: 'InsoleElementIdsToHide';
  id: Scalars['ID']['output'];
  ids: Array<Scalars['ID']['output']>;
};

export type InsoleMaterialsResponseItem = {
  __typename?: 'InsoleMaterialsResponseItem';
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  production_method: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
};

export type InsolePlan = {
  __typename?: 'InsolePlan';
  bottom_finish?: Maybe<EBottomFinish>;
  cad_model?: Maybe<Scalars['String']['output']>;
  consult_id: Scalars['ID']['output'];
  core_material?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  deliver_top_cover_material_separately?: Maybe<Scalars['Boolean']['output']>;
  elements?: Maybe<Array<InsolePlanElement>>;
  finishing_by?: Maybe<EFinishingBy>;
  fore_foot_lateral_rotation_left?: Maybe<Scalars['Float']['output']>;
  fore_foot_lateral_rotation_right?: Maybe<Scalars['Float']['output']>;
  fore_foot_medial_rotation_left?: Maybe<Scalars['Float']['output']>;
  fore_foot_medial_rotation_right?: Maybe<Scalars['Float']['output']>;
  ground_sole_pattern?: Maybe<Scalars['String']['output']>;
  ground_sole_thickness_left?: Maybe<Scalars['Float']['output']>;
  ground_sole_thickness_right?: Maybe<Scalars['Float']['output']>;
  heel_lift_left?: Maybe<Scalars['Float']['output']>;
  heel_lift_right?: Maybe<Scalars['Float']['output']>;
  hind_foot_left?: Maybe<Scalars['Float']['output']>;
  hind_foot_right?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  infill?: Maybe<EInfill>;
  insole_type?: Maybe<EInsoleType>;
  manager_tenant_ref: Scalars['ID']['output'];
  middle_hind_foot_left?: Maybe<Scalars['Float']['output']>;
  middle_hind_foot_right?: Maybe<Scalars['Float']['output']>;
  modelling_required?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  patient_id: Scalars['ID']['output'];
  production_method?: Maybe<EProductionMethod>;
  production_notes?: Maybe<Scalars['String']['output']>;
  rear_foot_lateral_rotation_left?: Maybe<Scalars['Float']['output']>;
  rear_foot_lateral_rotation_right?: Maybe<Scalars['Float']['output']>;
  rear_foot_medial_rotation_left?: Maybe<Scalars['Float']['output']>;
  rear_foot_medial_rotation_right?: Maybe<Scalars['Float']['output']>;
  side?: Maybe<ESide>;
  size?: Maybe<Scalars['Float']['output']>;
  size_system?: Maybe<EShoeSizeSystem>;
  sole_lateral_rotation_left?: Maybe<Scalars['Float']['output']>;
  sole_lateral_rotation_right?: Maybe<Scalars['Float']['output']>;
  sole_medial_rotation_left?: Maybe<Scalars['Float']['output']>;
  sole_medial_rotation_right?: Maybe<Scalars['Float']['output']>;
  top_cover_material?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['ID']['output'];
  workshop?: Maybe<Scalars['String']['output']>;
  workshop_tenant_ref?: Maybe<Scalars['ID']['output']>;
};

export type InsolePlanElement = {
  __typename?: 'InsolePlanElement';
  deliver_separately?: Maybe<Scalars['Boolean']['output']>;
  height_left?: Maybe<Scalars['Float']['output']>;
  height_right?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  infill_left?: Maybe<EInsoleElementInfill>;
  infill_right?: Maybe<EInsoleElementInfill>;
  left: Scalars['Boolean']['output'];
  right: Scalars['Boolean']['output'];
};

export type InsolePlanElementInput = {
  deliver_separately?: InputMaybe<Scalars['Boolean']['input']>;
  height_left?: InputMaybe<Scalars['Float']['input']>;
  height_right?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  infill_left?: InputMaybe<EInsoleElementInfill>;
  infill_right?: InputMaybe<EInsoleElementInfill>;
  left: Scalars['Boolean']['input'];
  right: Scalars['Boolean']['input'];
};

export type InsolePlanPreselection = {
  __typename?: 'InsolePlanPreselection';
  diagnosis?: Maybe<Scalars['String']['output']>;
  element_ids: Array<Scalars['ID']['output']>;
  foot_type?: Maybe<Scalars['String']['output']>;
  fore_foot_lateral_rotation: Scalars['Float']['output'];
  fore_foot_medial_rotation: Scalars['Float']['output'];
  ground_sole_thickness: Scalars['Float']['output'];
  heel_lift: Scalars['Float']['output'];
  hind_foot: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  insole_type?: Maybe<Scalars['String']['output']>;
  middle_hind_foot: Scalars['Float']['output'];
  rear_foot_lateral_rotation: Scalars['Float']['output'];
  rear_foot_medial_rotation: Scalars['Float']['output'];
  sole_lateral_rotation: Scalars['Float']['output'];
  sole_medial_rotation: Scalars['Float']['output'];
};

export type InsoleTopcoversResponseItem = {
  __typename?: 'InsoleTopcoversResponseItem';
  img_url?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  anonymizePatient?: Maybe<Patient>;
  createConsult?: Maybe<Consult>;
  createDownloadFilePresignedUrl: SignedUrlResult;
  createDraftOrder?: Maybe<Order>;
  createInsolePlan: InsolePlan;
  createInsolePlanFromData: InsolePlan;
  createOrder?: Maybe<UpdateConsultStatusResult>;
  createPatient?: Maybe<Patient>;
  createScan: Scan;
  createUploadFilePresignedUrl: SignedUrlResult;
  createUser: CreateUserResponse;
  deleteInsolePlan: DeleteInsolePlanResponse;
  duplicateInsolePlan: InsolePlan;
  notifyOrderChanged?: Maybe<OrderChangedEvent>;
  updateConsult?: Maybe<ConsultExtended>;
  updateConsultStatus?: Maybe<UpdateConsultStatusResult>;
  updateInsolePlan: InsolePlan;
  updateOrder?: Maybe<Order>;
  updatePatient?: Maybe<Patient>;
  updateScan: Scan;
};


export type MutationAnonymizePatientArgs = {
  input?: InputMaybe<AnonymizePatientInput>;
};


export type MutationCreateConsultArgs = {
  input?: InputMaybe<ConsultInput>;
};


export type MutationCreateDownloadFilePresignedUrlArgs = {
  key: Scalars['String']['input'];
};


export type MutationCreateDraftOrderArgs = {
  input?: InputMaybe<CreateOrderInput>;
};


export type MutationCreateInsolePlanArgs = {
  input: CreateInsolePlanInput;
};


export type MutationCreateInsolePlanFromDataArgs = {
  input: CreateInsolePlanFromDataInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreatePatientArgs = {
  input?: InputMaybe<CreatePatientInput>;
};


export type MutationCreateScanArgs = {
  input: CreateScanInput;
};


export type MutationCreateUploadFilePresignedUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  tenant_ref: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteInsolePlanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDuplicateInsolePlanArgs = {
  input: DuplicateInsolePlanInput;
};


export type MutationNotifyOrderChangedArgs = {
  input: NotifyOrderChangedInput;
};


export type MutationUpdateConsultArgs = {
  input: ConsultExtendedInput;
};


export type MutationUpdateConsultStatusArgs = {
  input: UpdateConsultStatusInput;
};


export type MutationUpdateInsolePlanArgs = {
  input: UpdateInsolePlanInput;
};


export type MutationUpdateOrderArgs = {
  input: UpdateOrderInput;
};


export type MutationUpdatePatientArgs = {
  input?: InputMaybe<UpdatePatientInput>;
};


export type MutationUpdateScanArgs = {
  input: UpdateScanInput;
};

export type NotifyOrderChangedInput = {
  event_type: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  status: EOrderStatus;
  tenant_id: Scalars['ID']['input'];
};

export type Order = {
  __typename?: 'Order';
  attachments?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  confirmed_at?: Maybe<Scalars['String']['output']>;
  consult_id: Scalars['ID']['output'];
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  insole_plan_id: Scalars['ID']['output'];
  is_urgent?: Maybe<Scalars['Boolean']['output']>;
  manager_tenant_id: Scalars['ID']['output'];
  manager_tenant_name: Scalars['String']['output'];
  manager_tenant_ref: Scalars['String']['output'];
  manager_user_id: Scalars['ID']['output'];
  material?: Maybe<Scalars['String']['output']>;
  order_number: Scalars['String']['output'];
  patient_id: Scalars['String']['output'];
  production_method: EProductionMethod;
  rework_reason?: Maybe<Scalars['String']['output']>;
  scan_2d_templates?: Maybe<Array<Scalars['String']['output']>>;
  scan_3d_templates?: Maybe<Array<Scalars['String']['output']>>;
  scan_pp_templates?: Maybe<Array<Scalars['String']['output']>>;
  search_terms: Scalars['String']['output'];
  shipping_target: EShippingTarget;
  status: EOrderStatus;
  version_number: Scalars['Int']['output'];
  workshop_tenant_id: Scalars['ID']['output'];
  workshop_tenant_ref: Scalars['String']['output'];
};

export type OrderChangedEvent = {
  __typename?: 'OrderChangedEvent';
  event_type: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: EOrderStatus;
  tenant_id: Scalars['ID']['output'];
};

export type OrdersConnection = {
  __typename?: 'OrdersConnection';
  items: Array<Order>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Patient = {
  __typename?: 'Patient';
  anonymized_at?: Maybe<Scalars['String']['output']>;
  anonymized_by?: Maybe<Scalars['String']['output']>;
  bsn_number?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  date_of_birth: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  external_id?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<EPatientGender>;
  health_insurance_number?: Maybe<Scalars['String']['output']>;
  health_insurer?: Maybe<Scalars['String']['output']>;
  house_number?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  id_number?: Maybe<Scalars['String']['output']>;
  id_type?: Maybe<EPatientIdType>;
  initials?: Maybe<Scalars['String']['output']>;
  last_name: Scalars['String']['output'];
  middle_name?: Maybe<Scalars['String']['output']>;
  mobile?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  patient_number: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  salutation?: Maybe<Scalars['String']['output']>;
  search_terms?: Maybe<Scalars['String']['output']>;
  status?: Maybe<EPatientStatus>;
  street?: Maybe<Scalars['String']['output']>;
  tenant_id: Scalars['ID']['output'];
  tenant_ref: Scalars['ID']['output'];
  title?: Maybe<EPatientTitle>;
};

export type PatientByOrderId = {
  __typename?: 'PatientByOrderId';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  external_id?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  house_number?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  initials?: Maybe<Scalars['String']['output']>;
  last_name: Scalars['String']['output'];
  middle_name?: Maybe<Scalars['String']['output']>;
  patient_number: Scalars['String']['output'];
  postal_code?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  salutation?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  title?: Maybe<EPatientTitle>;
};

export type PatientConnection = {
  __typename?: 'PatientConnection';
  items: Array<Patient>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type PatientsCount = {
  __typename?: 'PatientsCount';
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getConsultById: ConsultExtended;
  getConsultByOrderId?: Maybe<ConsultByOrderId>;
  getCounterByManagerTenantId?: Maybe<Counter>;
  getDiagnoseInfo?: Maybe<DiagnoseInfoResponse>;
  getInsolePlanById?: Maybe<InsolePlan>;
  getOrderById?: Maybe<Order>;
  getOrdersByInsolePlanId: Array<Order>;
  getPatientById?: Maybe<Patient>;
  getPatientByOrderId?: Maybe<PatientByOrderId>;
  getPatientsCountByTenantId: PatientsCount;
  getScanById?: Maybe<Scan>;
  listConsultOptions: Array<ConsultOption>;
  listConsultsByPatientId: Array<Consult>;
  listCountries: Array<CountriesResponseItem>;
  listGroundSolePatterns: Array<GroundSolePatternsResponseItem>;
  listInsoleElementIdsToHide: Array<InsoleElementIdsToHide>;
  listInsoleElements: Array<InsoleElement>;
  listInsoleElementsByTenantId: Array<InsoleElement>;
  listInsoleMaterials: Array<InsoleMaterialsResponseItem>;
  listInsolePlanPreselections: Array<InsolePlanPreselection>;
  listInsolePlansByConsultId: Array<InsolePlan>;
  listInsoleTopcovers: Array<InsoleTopcoversResponseItem>;
  listOrdersByManagerTenantId: OrdersConnection;
  listOrdersByManagerTenantIdAndSearchTerms: OrdersConnection;
  listOrdersByPatientId: OrdersConnection;
  listOrdersByPatientIdAndSearchTerms: OrdersConnection;
  listOrdersByWorkshopTenantId: OrdersConnection;
  listOrdersByWorkshopTenantIdAndSearchTerms: OrdersConnection;
  listPatientsBySearchTerms: PatientConnection;
  listPatientsByTenantId: Array<Patient>;
  listReworkReasons: Array<ReworkReason>;
  listScansByIds: Array<Scan>;
  listScansByOrderId_v2: Array<Scan>;
  listScansByPatientId: ScanConnection;
  listTenantParents: Array<Tenant>;
  listTenants: Array<Tenant>;
  listTenantsByWorkshopTenantId: Array<Tenant>;
};


export type QueryGetConsultByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetConsultByOrderIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCounterByManagerTenantIdArgs = {
  counter_type: ECounterType;
  manager_tenant_id: Scalars['ID']['input'];
};


export type QueryGetDiagnoseInfoArgs = {
  key: Scalars['String']['input'];
  language: Scalars['String']['input'];
};


export type QueryGetInsolePlanByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetOrdersByInsolePlanIdArgs = {
  insole_plan_id: Scalars['ID']['input'];
};


export type QueryGetPatientByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPatientByOrderIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPatientsCountByTenantIdArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['ID']['input'];
};


export type QueryGetScanByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListConsultOptionsArgs = {
  language: Scalars['String']['input'];
};


export type QueryListConsultsByPatientIdArgs = {
  patient_id: Scalars['ID']['input'];
};


export type QueryListCountriesArgs = {
  language: Scalars['String']['input'];
};


export type QueryListGroundSolePatternsArgs = {
  language: Scalars['String']['input'];
};


export type QueryListInsoleElementsArgs = {
  language: Scalars['String']['input'];
};


export type QueryListInsoleElementsByTenantIdArgs = {
  language: Scalars['String']['input'];
  tenant_id: Scalars['ID']['input'];
};


export type QueryListInsoleMaterialsArgs = {
  language: Scalars['String']['input'];
};


export type QueryListInsolePlansByConsultIdArgs = {
  consult_id: Scalars['ID']['input'];
};


export type QueryListInsoleTopcoversArgs = {
  language: Scalars['String']['input'];
};


export type QueryListOrdersByManagerTenantIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  manager_tenant_id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListOrdersByManagerTenantIdAndSearchTermsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  manager_tenant_id: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search_terms?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListOrdersByPatientIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  patient_id: Scalars['ID']['input'];
};


export type QueryListOrdersByPatientIdAndSearchTermsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  patient_id: Scalars['ID']['input'];
  search_terms?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListOrdersByWorkshopTenantIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  workshop_tenant_id: Scalars['ID']['input'];
};


export type QueryListOrdersByWorkshopTenantIdAndSearchTermsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search_terms?: InputMaybe<Scalars['String']['input']>;
  workshop_tenant_id: Scalars['ID']['input'];
};


export type QueryListPatientsBySearchTermsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search_terms?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['ID']['input'];
};


export type QueryListPatientsByTenantIdArgs = {
  tenant_id: Scalars['ID']['input'];
};


export type QueryListReworkReasonsArgs = {
  language: Scalars['String']['input'];
};


export type QueryListScansByIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryListScansByOrderId_V2Args = {
  order_id: Scalars['ID']['input'];
};


export type QueryListScansByPatientIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  patient_id: Scalars['ID']['input'];
};


export type QueryListTenantsByWorkshopTenantIdArgs = {
  workshop_tenant_id: Scalars['ID']['input'];
};

export type ReworkReason = {
  __typename?: 'ReworkReason';
  current_status: EOrderStatus;
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
};

export type Scan = {
  __typename?: 'Scan';
  cad_template_url_left?: Maybe<Scalars['String']['output']>;
  cad_template_url_right?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  device: EScanDevice;
  dicom_url_both?: Maybe<Scalars['String']['output']>;
  dicom_url_left?: Maybe<Scalars['String']['output']>;
  dicom_url_right?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  modality: EScanModality;
  original_url_both?: Maybe<Scalars['String']['output']>;
  original_url_left?: Maybe<Scalars['String']['output']>;
  original_url_right?: Maybe<Scalars['String']['output']>;
  patient_id: Scalars['ID']['output'];
  pixels_per_inch: Scalars['Float']['output'];
  status?: Maybe<EScanStatus>;
  tenant_ref: Scalars['ID']['output'];
  thumbnail_url_both?: Maybe<Scalars['String']['output']>;
  thumbnail_url_left?: Maybe<Scalars['String']['output']>;
  thumbnail_url_right?: Maybe<Scalars['String']['output']>;
  toolstate_url_both?: Maybe<Scalars['String']['output']>;
  toolstate_url_left?: Maybe<Scalars['String']['output']>;
  toolstate_url_right?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['ID']['output'];
};

export type ScanConnection = {
  __typename?: 'ScanConnection';
  items: Array<Scan>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type SignedUrlResult = {
  __typename?: 'SignedUrlResult';
  bucket: Scalars['String']['output'];
  expiresIn: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  method: ESignedUrlMethod;
  url: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onOrderChanged?: Maybe<OrderChangedEvent>;
};


export type SubscriptionOnOrderChangedArgs = {
  tenant_id: Scalars['ID']['input'];
};

export type Tenant = {
  __typename?: 'Tenant';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  house_number?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  insole_element_libraries?: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
  parent_id?: Maybe<Scalars['ID']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<ETenantProfile>;
  street?: Maybe<Scalars['String']['output']>;
  tenant_ref: Scalars['ID']['output'];
  workshop_milling_tenant_id?: Maybe<Scalars['ID']['output']>;
  workshop_milling_tenant_name?: Maybe<Scalars['String']['output']>;
  workshop_milling_tenant_ref?: Maybe<Scalars['ID']['output']>;
  workshop_printing_tenant_id?: Maybe<Scalars['ID']['output']>;
  workshop_printing_tenant_name?: Maybe<Scalars['String']['output']>;
  workshop_printing_tenant_ref?: Maybe<Scalars['ID']['output']>;
};

export type UpdateConsultStatusInput = {
  consult_id: Scalars['ID']['input'];
  status: EOrderStatus;
};

export type UpdateConsultStatusResult = {
  __typename?: 'UpdateConsultStatusResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdateInsolePlanInput = {
  bottom_finish?: InputMaybe<EBottomFinish>;
  cad_model?: InputMaybe<Scalars['String']['input']>;
  consult_id: Scalars['ID']['input'];
  core_material?: InputMaybe<Scalars['String']['input']>;
  created_at: Scalars['String']['input'];
  deliver_top_cover_material_separately?: InputMaybe<Scalars['Boolean']['input']>;
  elements?: InputMaybe<Array<InsolePlanElementInput>>;
  finishing_by?: InputMaybe<EFinishingBy>;
  fore_foot_lateral_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  fore_foot_lateral_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  fore_foot_medial_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  fore_foot_medial_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  ground_sole_pattern?: InputMaybe<Scalars['String']['input']>;
  ground_sole_thickness_left?: InputMaybe<Scalars['Float']['input']>;
  ground_sole_thickness_right?: InputMaybe<Scalars['Float']['input']>;
  heel_lift_left?: InputMaybe<Scalars['Float']['input']>;
  heel_lift_right?: InputMaybe<Scalars['Float']['input']>;
  hind_foot_left?: InputMaybe<Scalars['Float']['input']>;
  hind_foot_right?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  infill?: InputMaybe<EInfill>;
  insole_type?: InputMaybe<EInsoleType>;
  manager_tenant_ref: Scalars['ID']['input'];
  middle_hind_foot_left?: InputMaybe<Scalars['Float']['input']>;
  middle_hind_foot_right?: InputMaybe<Scalars['Float']['input']>;
  modelling_required?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  patient_id: Scalars['ID']['input'];
  production_method?: InputMaybe<EProductionMethod>;
  production_notes?: InputMaybe<Scalars['String']['input']>;
  rear_foot_lateral_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  rear_foot_lateral_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  rear_foot_medial_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  rear_foot_medial_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  side?: InputMaybe<ESide>;
  size?: InputMaybe<Scalars['Float']['input']>;
  size_system?: InputMaybe<EShoeSizeSystem>;
  sole_lateral_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  sole_lateral_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  sole_medial_rotation_left?: InputMaybe<Scalars['Float']['input']>;
  sole_medial_rotation_right?: InputMaybe<Scalars['Float']['input']>;
  top_cover_material?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['ID']['input'];
  workshop?: InputMaybe<Scalars['String']['input']>;
  workshop_tenant_ref: Scalars['ID']['input'];
};

export type UpdateOrderInput = {
  attachments?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  confirmed_at?: InputMaybe<Scalars['String']['input']>;
  consult_id?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  insole_plan_id?: InputMaybe<Scalars['ID']['input']>;
  is_urgent?: InputMaybe<Scalars['Boolean']['input']>;
  manager_tenant_id?: InputMaybe<Scalars['ID']['input']>;
  manager_tenant_ref?: InputMaybe<Scalars['ID']['input']>;
  manager_user_id?: InputMaybe<Scalars['ID']['input']>;
  material?: InputMaybe<Scalars['String']['input']>;
  order_number?: InputMaybe<Scalars['String']['input']>;
  production_method?: InputMaybe<EProductionMethod>;
  rework_reason?: InputMaybe<Scalars['String']['input']>;
  search_terms?: InputMaybe<Scalars['String']['input']>;
  shipping_target?: InputMaybe<EShippingTarget>;
  status?: InputMaybe<EOrderStatus>;
  version_number?: InputMaybe<Scalars['Int']['input']>;
  workshop_tenant_id?: InputMaybe<Scalars['ID']['input']>;
  workshop_tenant_ref?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdatePatientInput = {
  bsn_number?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  date_of_birth: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  external_id?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<EPatientGender>;
  health_insurance_number?: InputMaybe<Scalars['String']['input']>;
  health_insurer?: InputMaybe<Scalars['String']['input']>;
  house_number?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  id_number?: InputMaybe<Scalars['String']['input']>;
  id_type?: InputMaybe<EPatientIdType>;
  initials?: InputMaybe<Scalars['String']['input']>;
  last_name: Scalars['String']['input'];
  middle_name?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  patient_number: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  salutation?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<EPatientStatus>;
  street?: InputMaybe<Scalars['String']['input']>;
  tenant_id: Scalars['ID']['input'];
  tenant_ref: Scalars['ID']['input'];
  title?: InputMaybe<EPatientTitle>;
};

export type UpdateScanInput = {
  cad_template_url_left?: InputMaybe<Scalars['String']['input']>;
  cad_template_url_right?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  device: EScanDevice;
  dicom_url_both?: InputMaybe<Scalars['String']['input']>;
  dicom_url_left?: InputMaybe<Scalars['String']['input']>;
  dicom_url_right?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  modality: EScanModality;
  original_url_both?: InputMaybe<Scalars['String']['input']>;
  original_url_left?: InputMaybe<Scalars['String']['input']>;
  original_url_right?: InputMaybe<Scalars['String']['input']>;
  patient_id: Scalars['ID']['input'];
  pixels_per_inch: Scalars['Float']['input'];
  tenant_ref: Scalars['ID']['input'];
  thumbnail_url_both?: InputMaybe<Scalars['String']['input']>;
  thumbnail_url_left?: InputMaybe<Scalars['String']['input']>;
  thumbnail_url_right?: InputMaybe<Scalars['String']['input']>;
  toolstate_url_both?: InputMaybe<Scalars['String']['input']>;
  toolstate_url_left?: InputMaybe<Scalars['String']['input']>;
  toolstate_url_right?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};
