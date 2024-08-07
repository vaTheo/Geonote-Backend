import { EauPotableData } from './eau';

export const paramAnalyseEau: EauPotableData[] = [
  {
    libelle_parametre: 'pH',
    name: 'pH',
    unite: 'pH',
    min: 6.5,
    max: 9.0,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: "Température de l'eau",
    name: 'Température',
    unite: '°C',
    min: 0,
    max: 25,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Turbidité néphélométrique NFU',
    name: 'Turbidité',
    unite: 'NFU',
    min: 0,
    max: 1.0,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Escherichia coli /100ml - MF',
    name: 'Escherichia coli',
    unite: 'n/100mL',
    min: 0,
    max: 0,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Entérocoques /100ml-MS',
    name: 'Entérocoques',
    unite: 'n/100mL',
    min: 0,
    max: 0,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Bactéries coliformes /100ml-MS',
    name: 'Bactéries',
    unite: 'n/100mL',
    min: 0,
    max: 50,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },

  {
    libelle_parametre: 'Ammonium (en NH4)',
    name: 'Ammonium',
    unite: 'mg/L',
    min: 0,
    max: 0.1,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Chlore total',
    name: 'Chlore',
    unite: 'mg/L',
    min: 0,
    max: 0.5,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },

  {
    libelle_parametre: 'Nitrates (en NO3)',
    name: 'Nitrates',
    unite: 'mg/L',
    min: 0,
    max: 50,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Hydrocarbures polycycliques aromatiques (4 substances)',
    name: 'Hydrocarbures',
    unite: 'µg/L',
    min: 0,
    max: 0.1,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Chlorure de vinyl monomère',
    name: 'Chlorure vinyl',
    unite: 'µg/L',
    min: 0,
    max: 0.5,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Fer total',
    name: 'Fer',
    unite: 'µg/L',
    min: 0,
    max: 200,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
  {
    libelle_parametre: 'Conductivité à 25°C',
    name: 'Conductivité',
    unite: 'µS/cm',
    min: 200,
    max: 1100,
    totalAverage: 0,
    countValue: 0,
    good: false,
  },
];
