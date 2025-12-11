export interface ModeFields {
  prim: string | null;
  act_agt: string | null;
  act_pat: string | null;
  pas_agt: string | null;
  pas_pat: string | null;
}

export interface ModeData {
  base: ModeFields;
  long?: ModeFields | null;
  strong?: ModeFields | null;
}

export interface Root {
  _id: string;
  root: string;
  mode: ModeData;
}

export interface RootCreate {
  root: string;
  mode: ModeData;
}

export interface RootUpdate {
  root?: string;
  mode?: ModeData;
}
