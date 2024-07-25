import {
  AZIData,
  CatnatData,
  CaviteData,
  InstallationsClasseesData,
  MVTData,
  PAPIData,
  PCSData,
  RadonData,
  RisquesData,
  SISData,
  TIMData,
  TRIData,
  ZonageSismiqueData,
} from './externalApi';

export interface GeorisqueAllData {
  ratesZoneInnondable?: number;
  ratesCatastropheNaturelle?: number;
  ratesInstallationClassees?: number;
  ratesRisqueLocaux?: number;
  ratesRisqueGeneraux?: number;
  ratesPolutionSol?: number;
  AZIData?: AZIData[];
  CatnatData?: CatnatData[];
  CaviteData?: CaviteData[];
  InstallationsClasseesData?: InstallationsClasseesData[];
  MVTData?: MVTData[];
  PAPIData?: PAPIData[];
  PCSData?: PCSData[];
  RadonData?: RadonData[];
  RisquesData?: RisquesData[];
  SISData?: SISData[];
  TIMData?: TIMData[];
  TRIData?: TRIData[];
  ZonageSismiqueData?: ZonageSismiqueData[];
}

export interface RatesGeoRisque {
  AZIData?: number;
  CatnatData?: number;
  InstallationsClasseesData?: number;
  MVTData?: number;
  RadonData?: number;
  RisquesData?: number;
  SISData?: number;
  TRIData?: number;
  ZonageSismiqueData?: number;
}
