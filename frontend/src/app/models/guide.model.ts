export type GuideColumn = {
  title: string;
  items: string[];
};

export type GuideStep = {
  title: string;
  text: string;
};

export type GuideBenefit = {
  icon: string;
  title: string;
  text: string;
};

export type GuideData = {
  theme: string;
  title: string;
  subtitle: string;
  intro?: string;
  layout?: 'standard' | 'info';
  colorLabel?: string;
  colorText?: string;
  listTitle: string;
  sections: GuideColumn[];
  stepsTitle: string;
  steps: GuideStep[];
  cycleTitle: string;
  cycleText: string;
  benefitsTitle: string;
  benefits: GuideBenefit[];
  extraLists?: GuideColumn[];
  footerText: string;
  colorBoxes?: { className: string; text: string }[];
};
