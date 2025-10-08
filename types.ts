// FIX: Import React to provide the 'React' namespace for types like React.ReactNode.
import React from 'react';
// FIX: Import ChartConfiguration from 'chart.js' to allow for strongly-typed chart configurations.
import { Chart as ChartJSChart, ChartConfiguration } from 'chart.js';

// --- CHARTING TYPES ---
// Use the actual Chart.js type for better type safety
export type ChartConfig = ChartJSChart['config'];

export interface WebSource {
  uri: string;
  title: string;
}

// --- TASK MANAGEMENT TYPES ---
export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed';
export interface GenerationTask {
    id: string;
    topic: string;
    status: TaskStatus;
    statusMessage: string;
    result?: IntelligenceBriefingReport;
    error?: string;
}

// --- COLLABORATION / FORUM TYPES ---
export interface DiscussionComment {
  id: string;
  author: string;
  timestamp: string;
  content: string;
}

export interface UserContribution {
    id: string;
    sectionId: string;
    authorId: string;
    authorName: string;
    timestamp: string;
    type: 'Finding' | 'Critique' | 'Suggestion' | 'AI Deep Dive';
    content: string;
    userQuestion?: string;
}

// --- NEW REPORT V4 TYPES ---

export interface PolicyCredibilityScore {
  overallScore: number;
  components: {
    name: 'Draft Completeness' | 'Enforcement Feasibility' | 'Stakeholder Pushback Risk' | 'Public Alignment';
    score: number;
    rationale: string;
  }[];
}

export interface RecommendedPositioning {
    stance: string;
    justification: string[];
    positioningReframe: {
        title: string;
        rationale: string;
    };
}

export interface InternalStrategy {
    talkingPoints: {
        audience: 'Press' | 'Parliament Floor' | 'Community Organizers' | 'Social Media Influencers';
        points: {
            point: string;
            rationale: string;
        }[];
    }[];
    rebuttals: {
        opposingArgument: string;
        suggestedRebuttal: string;
    }[];
    strategicNarrativeAngles: {
        angle: string;
        rationale: string;
    }[];
}

export interface SocialMediaSentiment {
    hashtag: string;
    proPercent: number;
    antiPercent: number;
    neutralPercent: number;
    argumentClusters?: {
        theme: string;
        summary: string;
        representativeQuotes: string[];
    }[];
    commonConcerns: string[];
    commonQuotes?: string[];
    notableCampaigns?: string[];
}

export interface EnhancedPartyDraftComparison {
    party: string;
    draftName: string;
    position: string;
    notableClause: string;
    riskPositioning: string;
    publicSupportRisk: string;
    strategicAdvantage?: string;
}

export interface FinancialSnapshot {
    performance: {
        year: string;
        revenue: string;
        netProfit: string;
    }[];
    redFlags: string[];
    majorInvestors: string[];
}

export interface DestabilizationTactic {
    vulnerability: string;
    vector: string;
    tactic: string;
    severity: 'Low' | 'Medium' | 'High';
}

export interface EnhancedStakeholder {
    category: string;
    name: string;
    stance: 'Pro' | 'Con' | 'Neutral';
    influenceLevel: 'High' | 'Medium' | 'Low';
    summary: string;
    politicalConnections: {
        person: string;
        connection: string;
        source: string;
    }[];
    financials?: FinancialSnapshot;
    destabilizationAnalysis?: DestabilizationTactic[];
}

export interface NetworkNode {
    id: string;
    label: string;
    type: 'Person' | 'Organization' | 'Location' | 'Concept' | 'Event' | 'Legislation' | 'PoliticalParty';
    stance?: 'Pro' | 'Con' | 'Neutral';
    influenceLevel?: 'High' | 'Medium' | 'Low';
}

export interface NetworkEdge {
    from: string;
    to: string;
    label: string;
}

export interface NetworkGraphData {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

export interface ArgumentClaim {
    claim: string;
    detail: string;
}

export interface SubstrateArgumentGraph {
    pro: {
        title: string;
        frame: string;
        claims: ArgumentClaim[];
    }[];
    con: {
        title: string;
        frame: string;
        claims: ArgumentClaim[];
    }[];
}

export interface RiskImpactAnalysis {
    publicHealth: string;
    economic: string;
    socialCohesion: string;
}

export interface AntiMonopolyAnalysis {
    barriersToEntry: {
        clause: string;
        analysis: string;
    }[];
    exploitationTactics: string[];
    conflictsOfInterest: {
        person: string;
        role: string;
        beneficiaryCompany: string;
        relationshipToBeneficiary: string;
        analysisOfConflict: string;
    }[];
    shameReport: string[];
    victimsOfPolicy: string[];
    regulatoryDelayAnalysis: {
        tactic: string;
        duration: string;
        economicLoss: string;
    }[];
    economicImpactCorrelation: {
        topic: string;
        analysis: string;
    }[];
}

export interface MethodologyReport {
    informationSources: {
        sourceType: string;
        weightingRationale: string;
    }[];
    analyticalFrameworks: string[];
    reasoningProcess: string[];
    potentialBiases: {
        biasType: string;
        mitigation: string;
    }[];
    confidenceLevel: {
        score: number;
        rationale: string;
    };
}

export interface IntelligenceBriefingReport {
    id?: string;
    topic: string;
    executiveSummary: string;
    policyCredibilityScore: PolicyCredibilityScore;
    recommendedPositioning: RecommendedPositioning;
    internalStrategy: InternalStrategy;
    socialMediaSentiment: SocialMediaSentiment;
    partyDraftComparison: EnhancedPartyDraftComparison[];
    stakeholderAnalysis: EnhancedStakeholder[];
    stakeholderNetworkGraph: NetworkGraphData;
    substrateArgumentGraph: SubstrateArgumentGraph;
    riskImpactAnalysis: RiskImpactAnalysis;
    antiMonopolyAnalysis?: AntiMonopolyAnalysis;
    methodology: MethodologyReport;
    simulatedOsintReport: string;
    simulatedCrawlerReport: string;
    sources?: WebSource[];
    aiAssumptions?: string[];
    userContributions?: UserContribution[];
    discussion?: DiscussionComment[];
    appendix?: {
      title: string;
      content: string;
    }[];
}

// --- TYPES FOR INTEL REPORT ---

export interface IntelReportProfile {
    name: string;
    titles: string[];
    aliases: string[];
    associatedCompanies: string[];
    knownLocations: string[];
}
export interface IntelReportRiskAssessment {
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    justification: string;
}
export interface IntelReportTimelineItem {
    date: string;
    event: string;
}
export interface IntelReportFamilyDetail {
    name: string;
    relation: string;
    details: string;
}
export interface IntelReport {
    id?: string;
    profile: IntelReportProfile;
    executiveSummary: string;
    riskAssessment: IntelReportRiskAssessment;
    riskFlags: string[];
    networkGraph: NetworkGraphData;
    timeline: IntelReportTimelineItem[];
    familyDetails: IntelReportFamilyDetail[];
    publicMentions: string[];
    methodology: MethodologyReport;
    sources: WebSource[];
    appendix?: {
      title: string;
      content: string;
    }[];
    discussion?: DiscussionComment[];
}

// --- TYPES FOR DRAFT COMPARISON ---

export interface AnalyzedClause {
    draftIdentifier: string;
    clauseText: string;
}

export interface ThematicPointComparison {
    theme: string;
    peoplesPartyPosition: string;
    opponentPosition: string;
    keyDifference: string;
    strategicAdvantage: string;
    clauseComparison: AnalyzedClause[];
}

export interface DraftComparisonReport {
    title: string;
    executiveSummary: string;
    comparison: ThematicPointComparison[];
}

// --- TYPES FOR POLLING ---

export type Stance = 'strong-support' | 'support' | 'neutral' | 'oppose' | 'strong-oppose';

export interface StanceOption {
    id: Stance;
    label: string;
    color: string;
    icon: React.ReactNode;
}

export interface PollData {
    id: string;
    votes: { [userId: string]: Stance };
}

// --- TYPES FOR CONVERSATIONAL INVESTIGATION ---
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    hidden?: boolean;
}

// --- TYPES FOR DYNAMIC INFOGRAPHICS ---

export interface InfographicData {
    title: string;
    charts: {
        // FIX: Use the generic ChartConfiguration type to specify the exact chart type required by react-chartjs-2 components.
        // This resolves the TypeScript error where a broad chart data type was not assignable to a specific one (e.g., Doughnut or Bar).
        credibilityScore: ChartConfiguration<'doughnut'>;
        publicSentiment: ChartConfiguration<'bar'>;
    };
    keyTakeaways: string[];
}

export interface LegislativeResearchReport {
    summary: string;
    sources: WebSource[];
}

// --- TYPES FOR FORENSIC BUDGET ANALYSIS ---

export interface ForensicExecutiveSummary {
    title: string;
    overallFinding: string;
    quantifiedWasteExample: string;
    systemicIssueRate: string;
    potentialAnnualSavings: string;
}

export interface ForensicMethodology {
    title: string;
    steps: string[];
}

export interface ForensicFindingItem {
    priorityRank: number;
    itemCategory: string;
    standardSpecification: string;
    fmvBenchmarkPerUnit: number;
    totalUnitsSampled: number;
    totalBudgetedCostSampled: number;
    highestBMAUnitPriceFound: string;
    avgOverpaymentPerUnit: string;
    avgPercentOverFMV: string;
    totalSampleOverpayment: number;
    keyDistrictsInvolved: string[];
    notesFromBudgetDoc: string;
    killerQuestion: string;
    marketReferenceSource: string;
}

export interface ForensicFindingsTable {
    title: string;
    items: ForensicFindingItem[];
}

export interface ForensicCallToAction {
    title: string;
    keyDemands: string[];
    ourGoal: string;
}

export interface ForensicMarketReference {
    item: string;
    urls: string[];
}

export interface ForensicAppendix {
    title: string;
    references: ForensicMarketReference[];
}

export interface ForensicBudgetAnalysisReport {
    reportTitle: string;
    reportDate: string;
    preparedFor: string;
    executiveSummary: ForensicExecutiveSummary;
    methodology: ForensicMethodology;
    findingsComparisonTable: ForensicFindingsTable;
    callToAction: ForensicCallToAction;
    appendixMarketReferences: ForensicAppendix;
    disclaimer: string;
}

// --- TYPES FOR HUMAN FEEDBACK LOOP ---
export interface Feedback {
  id: string;
  timestamp: string;
  userId?: string;
  rating: 'good' | 'bad';
  comment?: string;
  context: {
    reportTopic: string;
    sectionTitle: string;
    content: any;
  };
}

// --- TYPES FOR COMMUNICATIONS WORKBENCH ---
export interface CommunicationsPackage {
    twitterThread: { tweet: string }[];
    facebookPost: string;
    pressReleaseSnippet: string;
}