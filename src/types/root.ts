export interface ModeFields {
  act_agt: string;
  act_pat: string;
  pas_agt: string;
  pas_pat: string;
}

export interface ModeData {
  base: ModeFields;
  long?: ModeFields | null;
  strong?: ModeFields | null;
  redup?: ModeFields | null;
}

export interface Root {
  _id: string;
  root: string;
  prim: string;
  mode: ModeData;
}

export interface RootCreate {
  root: string;
  prim: string;
  mode: ModeData;
}

export interface RootUpdate {
  root?: string;
  prim?: string;
  mode?: ModeData;
}
