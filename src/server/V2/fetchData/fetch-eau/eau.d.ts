export interface EauPotableData {
  libelle_parametre: string;
  unite: string;
  name:string;
  min: number;
  max: number;
  totalAverage: number;
  countValue: number;
  good: boolean | null;
}
export interface CoursEauData {
  libelle_parametre: string;
  unite: string;
  name:string;
  min: number;
  max: number;
  totalAverage: number;
  countValue: number;
  good: boolean | null;
}
export interface RatesEau {
  eauPotable?: number;
  coursEau?: number;
}
export interface EauAllData {
  rateEauPotable?: number;
  rateCoursEau?: number;
  eauPotable?: EauPotableData[];
  coursEau?: CoursEauData[];
}



