export type Category =
  | "adjective"
  | "adverb"
  | "conjunction"
  | "interjection"
  | "noun"
  | "prefix"
  | "pronoun"
  | "quantifier"
  | "suffix"
  | "verb";

export type NounType = "primary" | "radical" | "deverbal";

export interface NounFields {
  abs_plural: string;
  abs_plural2: string | null;
  erg_plural: string;
  gen_plural: string;
  dat_plural: string;
  par: string;
}

export interface VerbFields {
  inf_i: string;
  prog_stem: string;
  perf_stem: string;
  n_part: string;
  t_part: string;
  s_part: string;
  v_part: string;
}

export interface Translation {
  _id: string;
  kelma: string;
  english: string;
  root: string;
  swadesh: boolean;
  cat: Category;
  noun_type?: NounType;
  noun_fields?: NounFields;
  verb_fields?: VerbFields;
}

export interface TranslationCreate {
  kelma: string;
  english: string;
  root: string;
  swadesh: boolean;
  cat: Category;
  noun_type?: NounType;
  noun_fields?: NounFields;
  verb_fields?: VerbFields;
}

export interface TranslationUpdate {
  kelma?: string;
  english?: string;
  root?: string;
  swadesh?: boolean;
  cat?: Category;
  noun_type?: NounType;
  noun_fields?: NounFields;
  verb_fields?: VerbFields;
}
