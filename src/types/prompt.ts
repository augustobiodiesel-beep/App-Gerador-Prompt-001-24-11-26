export type ResourceCategoryId =
  | 'didaticos'
  | 'avaliacoes'
  | 'documentais'
  | 'complementares';

export type EducationStageId =
  | 'educacao_infantil'
  | 'ef_anos_iniciais'
  | 'ef_anos_finais'
  | 'ensino_medio'
  | 'ensino_tecnico'
  | 'eja';

export type PromptDepth = 'direto' | 'estruturado' | 'avancado';

export type TargetAI = 'universal' | 'chatgpt' | 'gemini' | 'claude' | 'copilot';

export type BloomLevelId =
  | 'lembrar'
  | 'compreender'
  | 'aplicar'
  | 'analisar'
  | 'avaliar'
  | 'criar';

export interface BnccSkill {
  code: string;
  stage: EducationStageId;
  component: string;
  description: string;
}

export interface EducationStage {
  id: EducationStageId;
  label: string;
  shortLabel: string;
  badge: string;
  referenceLabel: string;
  officialDocument: string;
  officialDocumentUrl: string;
  yearsOrTracks: string[];
  components: string[];
}

export interface TemplateFieldOption {
  value: string;
  label: string;
}

export interface TemplateFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox' | 'chips';
  placeholder?: string;
  helperText?: string;
  defaultValue: string | boolean | string[];
  options?: TemplateFieldOption[];
  chipOptions?: string[];
  allowOther?: boolean;
  otherPlaceholder?: string;
  optional?: boolean;
}

export interface ResourceTemplate {
  id: string;
  category: ResourceCategoryId;
  name: string;
  shortName: string;
  description: string;
  badge?: string;
  isFeatured?: boolean;
  isEditorialSlides?: boolean;
  isDocumentWithPrivacy?: boolean;
  persona: string;
  outputDeliverables: string[];
  specificFields: TemplateFieldDefinition[];
}

export interface SlidePaletteOption {
  id: string;
  name: string;
  description: string;
  colors: string[];
  promptInstruction: string;
}

export interface SlideTypographyOption {
  id: string;
  name: string;
  displayFont: string;
  bodyFont: string;
  promptInstruction: string;
}

export interface SlidePromptConfig {
  slideCount: string;
  slideCountCustom?: string;
  audienceCustom: string;
  impactObjective: string;
  baseMaterial: string;
  aestheticStyle: 'editorial_minimalista' | 'ludico_editorial' | 'tecnico_moderno' | 'cientifico_clean';
  paletteId: string;
  customPaletteNote: string;
  typographyId: string;
  maxWordsPerSlide: string;
  maxWordsCustom?: string;
  includePhotographyRules: boolean;
  photoSources: string;
  includeNarrativeArc: boolean;
  narrativeCustomNotes: string;
  includeFiveLinePreview: boolean;
  includeSpeakerNotes: boolean;
  includeSelfReviewChecklist: boolean;
  alignWithBncc: boolean;
}

export interface DeviceSource {
  id: string;
  name: string;
  fileName: string;
  fileExt: string;
  sizeBytes?: number;
  authors?: string[];
  year?: string;
  source?: string;
  excerpt?: string;
  requiresManualAttach?: boolean;
}

export interface PromptFormState {
  category: ResourceCategoryId;
  templateId: string;
  selectedTemplateIds: string[];
  stage: EducationStageId | '';
  yearOrTrack: string;
  component: string;
  topic: string;
  selectedExtraDocs: string[];
  additionalDocuments: string;
  selectedDeviceSources: DeviceSource[];
  includeSourceExcerpts: boolean;
  bloomLevel: BloomLevelId;
  methodology: string;
  tone: string;
  outputFormat: string;
  durationOrExtent: string;
  classContext: string;
  inclusionEnabled: boolean;
  inclusionProfiles: string[];
  inclusionNotes: string;
  extraConstraints: string;
  depth: PromptDepth;
  targetAI: TargetAI;
  specificValues: Record<string, string | boolean | string[]>;
  slideConfig: SlidePromptConfig;
}

export interface SavedPrompt {
  id: string;
  title: string;
  promptText: string;
  isManuallyEdited: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  state: PromptFormState;
}

export interface QualityCheckItem {
  id: string;
  label: string;
  passed: boolean;
  tip: string;
  weight: number;
}

export interface PromptQualityAnalysis {
  score: number;
  level: 'Inicial' | 'Bom' | 'Excelente' | 'Exemplar';
  checks: QualityCheckItem[];
}

export interface DemoPreset {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
  category: ResourceCategoryId;
  state: Partial<PromptFormState> & {
    category: ResourceCategoryId;
    templateId: string;
  };
}
