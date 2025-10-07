import { GoogleGenAI, Type, GenerateContentResponse, Content } from "@google/genai";
import type { IntelligenceBriefingReport, WebSource, DraftComparisonReport, InfographicData, IntelReport, ChartConfig, MethodologyReport, ForensicBudgetAnalysisReport, CommunicationsPackage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DATA_CORRECTION_INSTRUCTION = `You are a data correction AI. Your only job is to fix malformed data. The following is a response from another AI that failed to adhere to the required JSON schema. Your task is to analyze the text, extract the intended data, and re-format it into the correct, valid JSON structure. Do not add any new information. Do not apologize or explain. Respond ONLY with the corrected, valid JSON.`;

// --- Reusable Schema Definitions ---

const policyCredibilityScoreSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.NUMBER },
        components: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, enum: ['Draft Completeness', 'Enforcement Feasibility', 'Stakeholder Pushback Risk', 'Public Alignment'] },
                    score: { type: Type.NUMBER },
                    rationale: { type: Type.STRING }
                },
                required: ['name', 'score', 'rationale']
            }
        }
    },
    required: ['overallScore', 'components']
};

const recommendedPositioningSchema = {
    type: Type.OBJECT,
    properties: {
        stance: { type: Type.STRING },
        justification: { type: Type.ARRAY, items: { type: Type.STRING } },
        positioningReframe: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                rationale: { type: Type.STRING },
            },
            required: ['title', 'rationale']
        }
    },
    required: ['stance', 'justification', 'positioningReframe']
};

const internalStrategySchema = {
    type: Type.OBJECT,
    properties: {
        strategicNarrativeAngles: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    angle: { type: Type.STRING },
                    rationale: { type: Type.STRING },
                },
                required: ['angle', 'rationale']
            }
        },
        talkingPoints: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    audience: { type: Type.STRING, enum: ['Press', 'Parliament Floor', 'Community Organizers', 'Social Media Influencers'] },
                    points: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                point: { type: Type.STRING },
                                rationale: { type: Type.STRING },
                            },
                            required: ['point', 'rationale']
                        }
                    }
                },
                required: ['audience', 'points']
            }
        },
        rebuttals: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    opposingArgument: { type: Type.STRING },
                    suggestedRebuttal: { type: Type.STRING },
                },
                required: ['opposingArgument', 'suggestedRebuttal']
            }
        },
    },
    required: ['strategicNarrativeAngles', 'talkingPoints', 'rebuttals']
};

const socialMediaSentimentSchema = {
    type: Type.OBJECT,
    properties: {
        hashtag: { type: Type.STRING },
        proPercent: { type: Type.NUMBER },
        antiPercent: { type: Type.NUMBER },
        neutralPercent: { type: Type.NUMBER },
        argumentClusters: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    theme: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    representativeQuotes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['theme', 'summary', 'representativeQuotes']
            }
        },
        commonConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
        commonQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
        notableCampaigns: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['hashtag', 'proPercent', 'antiPercent', 'neutralPercent', 'commonConcerns']
};

const methodologyReportSchema = {
    type: Type.OBJECT,
    properties: {
        informationSources: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sourceType: { type: Type.STRING },
                    weightingRationale: { type: Type.STRING },
                },
                required: ['sourceType', 'weightingRationale']
            }
        },
        analyticalFrameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
        reasoningProcess: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialBiases: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    biasType: { type: Type.STRING },
                    mitigation: { type: Type.STRING },
                },
                required: ['biasType', 'mitigation']
            }
        },
        confidenceLevel: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                rationale: { type: Type.STRING },
            },
            required: ['score', 'rationale']
        },
    },
    required: ['informationSources', 'analyticalFrameworks', 'reasoningProcess', 'potentialBiases', 'confidenceLevel']
};

const networkGraphSchema = {
    type: Type.OBJECT,
    properties: {
        nodes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['Person', 'Organization', 'Location', 'Concept', 'Event', 'Legislation', 'PoliticalParty'] }
                },
                required: ['id', 'label', 'type']
            }
        },
        edges: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    from: { type: Type.STRING },
                    to: { type: Type.STRING },
                    label: { type: Type.STRING }
                },
                required: ['from', 'to', 'label']
            }
        }
    },
    required: ['nodes', 'edges']
};

const argumentClaimSchema = {
    type: Type.OBJECT,
    properties: {
        claim: { type: Type.STRING },
        detail: { type: Type.STRING }
    },
    required: ['claim', 'detail']
};

const substrateArgumentGraphSchema = {
    type: Type.OBJECT,
    properties: {
        pro: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    frame: { type: Type.STRING },
                    claims: { type: Type.ARRAY, items: argumentClaimSchema }
                },
                required: ['title', 'frame', 'claims']
            }
        },
        con: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    frame: { type: Type.STRING },
                    claims: { type: Type.ARRAY, items: argumentClaimSchema }
                },
                required: ['title', 'frame', 'claims']
            }
        },
    },
    required: ['pro', 'con']
};

const riskImpactAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        publicHealth: { type: Type.STRING },
        economic: { type: Type.STRING },
        socialCohesion: { type: Type.STRING }
    },
    required: ['publicHealth', 'economic', 'socialCohesion']
};

const antiMonopolyAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        barriersToEntry: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { clause: { type: Type.STRING }, analysis: { type: Type.STRING } }, required: ['clause', 'analysis'] } },
        exploitationTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
        conflictsOfInterest: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { person: { type: Type.STRING }, role: { type: Type.STRING }, beneficiaryCompany: { type: Type.STRING }, relationshipToBeneficiary: { type: Type.STRING }, analysisOfConflict: { type: Type.STRING } }, required: ['person', 'role', 'beneficiaryCompany', 'relationshipToBeneficiary', 'analysisOfConflict'] } },
        shameReport: { type: Type.ARRAY, items: { type: Type.STRING } },
        victimsOfPolicy: { type: Type.ARRAY, items: { type: Type.STRING } },
        regulatoryDelayAnalysis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { tactic: { type: Type.STRING }, duration: { type: Type.STRING }, economicLoss: { type: Type.STRING } }, required: ['tactic', 'duration', 'economicLoss'] } },
        economicImpactCorrelation: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, analysis: { type: Type.STRING } }, required: ['topic', 'analysis'] } },
    },
    required: ['barriersToEntry', 'exploitationTactics', 'conflictsOfInterest', 'shameReport', 'victimsOfPolicy', 'regulatoryDelayAnalysis', 'economicImpactCorrelation']
};

const enhancedStakeholderSchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING },
        name: { type: Type.STRING },
        stance: { type: Type.STRING, enum: ['Pro', 'Con', 'Neutral'] },
        influenceLevel: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
        summary: { type: Type.STRING },
        politicalConnections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    person: { type: Type.STRING },
                    connection: { type: Type.STRING },
                    source: { type: Type.STRING }
                },
                required: ['person', 'connection', 'source']
            }
        },
    },
    required: ['category', 'name', 'stance', 'influenceLevel', 'summary', 'politicalConnections']
};

const enhancedPartyDraftComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        party: { type: Type.STRING },
        draftName: { type: Type.STRING },
        position: { type: Type.STRING },
        notableClause: { type: Type.STRING },
        riskPositioning: { type: Type.STRING },
        publicSupportRisk: { type: Type.STRING },
        strategicAdvantage: { type: Type.STRING }
    },
    required: ['party', 'draftName', 'position', 'notableClause', 'riskPositioning', 'publicSupportRisk']
};

const intelligenceBriefingReportSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        executiveSummary: { type: Type.STRING },
        policyCredibilityScore: policyCredibilityScoreSchema,
        recommendedPositioning: recommendedPositioningSchema,
        internalStrategy: internalStrategySchema,
        socialMediaSentiment: socialMediaSentimentSchema,
        partyDraftComparison: { type: Type.ARRAY, items: enhancedPartyDraftComparisonSchema },
        stakeholderAnalysis: { type: Type.ARRAY, items: enhancedStakeholderSchema },
        stakeholderNetworkGraph: networkGraphSchema,
        substrateArgumentGraph: substrateArgumentGraphSchema,
        riskImpactAnalysis: riskImpactAnalysisSchema,
        antiMonopolyAnalysis: antiMonopolyAnalysisSchema,
        methodology: methodologyReportSchema,
        simulatedOsintReport: { type: Type.STRING },
        simulatedCrawlerReport: { type: Type.STRING },
        aiAssumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
        'topic', 'executiveSummary', 'policyCredibilityScore', 'recommendedPositioning', 'internalStrategy',
        'socialMediaSentiment', 'partyDraftComparison', 'stakeholderAnalysis', 'stakeholderNetworkGraph',
        'substrateArgumentGraph', 'riskImpactAnalysis', 'methodology',
        'simulatedOsintReport', 'simulatedCrawlerReport', 'aiAssumptions'
    ]
};


// --- Service Implementation ---

const _selfCorrectInvalidJson = async (invalidText: string, schema: any): Promise<any> => {
    const correctionPrompt = `
        The following response was malformed and failed JSON validation. Please correct it based on the required schema.

        Required Schema:
        \`\`\`json
        ${JSON.stringify(schema, null, 2)}
        \`\`\`

        Malformed Response to Correct:
        \`\`\`
        ${invalidText}
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: correctionPrompt,
            config: {
                systemInstruction: DATA_CORRECTION_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const correctedText = response.text.trim();
        return JSON.parse(correctedText);
    } catch (correctionError) {
        console.error("Self-correction failed:", correctionError);
        throw new Error("Self-correction failed. The AI could not recover the data structure from the malformed response.");
    }
};


const callGemini = async (prompt: string, systemInstruction: string, responseSchema: any, useSearch: boolean = false): Promise<any> => {
   try {
    const config: any = {
        systemInstruction,
    };
    
    if (useSearch) {
        config.tools = [{googleSearch: {}}];
    } else {
        config.responseMimeType = "application/json";
        config.responseSchema = responseSchema;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config
    });

    if (useSearch) {
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((c: any) => ({ uri: c.web?.uri, title: c.web?.title }))
            .filter((c: any) => c.uri) || [];
        return { summary: response.text.trim(), sources };
    }

    const text = response.text.trim();
    try {
        return JSON.parse(text);
    } catch (e) {
        console.warn("Initial JSON parsing failed, attempting self-correction.", text);
        return _selfCorrectInvalidJson(text, responseSchema);
    }
   } catch (error) {
     console.error("Gemini API call failed:", error);
     throw error;
   }
};

export const generateIntelligenceBriefing = async (
    topic: string, 
    onStatusUpdate?: (status: string) => void
): Promise<IntelligenceBriefingReport> => {
    const language = 'Thai';
    onStatusUpdate?.('Synthesizing intelligence briefing...');
    
    const systemInstruction = `You are an elite AI political strategist for a progressive political party in Thailand. Your task is to generate a comprehensive intelligence briefing on a legislative topic. Analyze the provided topic, identify stakeholders, risks, and strategic opportunities using your knowledge and simulated search capabilities. Your tone should be sharp, insightful, and actionable. The output must be in valid JSON format, adhering to the provided schema. The language of the response must be ${language}.`;

    const prompt = `Generate a full intelligence briefing on the topic: "${topic}". Your analysis must be deep and strategic, not just a summary.`;
    
    const briefing = await callGemini(prompt, systemInstruction, intelligenceBriefingReportSchema);
    
    onStatusUpdate?.('Finalizing report...');
    
    return briefing;
};

export const generateIntelReport = async (
    personName: string,
    onStatusUpdate?: (status: string) => void
): Promise<IntelReport> => {
    const language = 'Thai';
    onStatusUpdate?.('Initiating OSINT scan...');
    const systemInstruction = `You are an expert OSINT (Open-Source Intelligence) analyst. Generate a detailed intelligence dossier on the specified individual based on publicly available information. Focus on political and financial connections, risk factors, and network mapping. The output must be valid JSON. The language of the response must be ${language}.`;
    const prompt = `Generate an OSINT dossier for: ${personName}`;
    
    const intelReportSchema = {
        type: Type.OBJECT,
        properties: {
            profile: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                    aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
                    associatedCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    knownLocations: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'titles', 'aliases', 'associatedCompanies', 'knownLocations']
            },
            executiveSummary: { type: Type.STRING },
            riskAssessment: {
                type: Type.OBJECT,
                properties: {
                    level: { type: Type.STRING },
                    justification: { type: Type.STRING }
                },
                required: ['level', 'justification']
            },
            riskFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            networkGraph: networkGraphSchema,
            timeline: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        date: { type: Type.STRING },
                        event: { type: Type.STRING },
                    },
                    required: ['date', 'event']
                }
            },
            familyDetails: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        relation: { type: Type.STRING },
                        details: { type: Type.STRING },
                    },
                    required: ['name', 'relation', 'details']
                }
            },
            publicMentions: { type: Type.ARRAY, items: { type: Type.STRING } },
            methodology: methodologyReportSchema,
            sources: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        uri: { type: Type.STRING },
                        title: { type: Type.STRING },
                    },
                    required: ['uri', 'title']
                }
            },
        },
        required: ["profile", "executiveSummary", "riskAssessment", "riskFlags", "networkGraph", "timeline", "familyDetails", "publicMentions", "methodology", "sources"]
    };

    return callGemini(prompt, systemInstruction, intelReportSchema);
};

export async function* streamInvestigation(
    history: Content[]
): AsyncGenerator<string> {
    const systemInstruction = `You are an AI investigative assistant. Your role is to provide deep, insightful analysis based on the provided context and follow-up questions. Be concise but thorough. Use the context to answer questions, and identify gaps or contradictions. Do not repeat the context in your answer. Just provide the analysis.`;
    
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: history,
        config: { systemInstruction }
    });
    
    for await (const chunk of responseStream) {
        yield chunk.text;
    }
}

export const generateFollowUpQuestions = async (
    history: Content[]
): Promise<string[]> => {
    const systemInstruction = `You are an AI assistant that helps users dig deeper into a topic. Based on the provided conversation history, generate exactly 3 concise, insightful follow-up questions. The questions should be in Thai. Your output MUST be a valid JSON object following the schema.`;
    
    const prompt = `Here is the conversation history. Please generate 3 follow-up questions based on the last model response and the overall context.\n\nCONVERSATION:\n${history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n')}`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of exactly three follow-up question strings in Thai."
            }
        },
        required: ['questions']
    };

    try {
        const result = await callGemini(prompt, systemInstruction, schema);
        return result.questions || [];
    } catch (error) {
        console.error("Failed to generate follow-up questions:", error);
        return []; // Return empty array on failure
    }
};

export const generateDeeperAnalysis = async (
    topic: string,
    existingSummary: string
): Promise<{ analysis: string; sources: WebSource[] }> => {
    const language = 'Thai';
    const systemInstruction = `You are an AI investigative journalist for a progressive political party in Thailand. Your task is to perform a deep search on a given topic, finding new information, recent developments, or critical perspectives that may have been missed in an initial summary. Provide a concise but insightful analysis and cite your sources. The language of the response must be ${language}.`;
    
    const prompt = `
        Perform a deeper investigation into the topic: "${topic}".
        An existing summary has been provided for context. Do not repeat information already present in the summary. Focus on finding what's new, what's missing, or alternative viewpoints.

        Existing Summary:
        ---
        ${existingSummary}
        ---
    `;

    const result = await callGemini(prompt, systemInstruction, {}, true);
    
    return {
        analysis: result.summary,
        sources: result.sources,
    };
};

export const generateDraftComparison = async (
    draftA: string,
    draftB: string,
    topic: string,
    onStatusUpdate?: (status: string) => void
): Promise<DraftComparisonReport> => {
    const language = 'Thai';
    onStatusUpdate?.('Analyzing draft structures...');
    const systemInstruction = `You are a legislative comparison analyst. Your task is to compare two legal drafts, identify key differences, and determine the strategic advantage of the "People's Party Draft". Your analysis must be sharp and politically astute. Output in valid JSON. The language of the response must be ${language}.`;
    const prompt = `
        Topic: ${topic}
        
        People's Party Draft:
        ${draftA}
        
        Opponent's Draft:
        ${draftB}
        
        Generate the comparison report.
    `;
    const comparisonSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            comparison: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        theme: { type: Type.STRING },
                        peoplesPartyPosition: { type: Type.STRING },
                        opponentPosition: { type: Type.STRING },
                        keyDifference: { type: Type.STRING },
                        strategicAdvantage: { type: Type.STRING },
                        clauseComparison: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    draftIdentifier: { type: Type.STRING },
                                    clauseText: { type: Type.STRING },
                                },
                                required: ['draftIdentifier', 'clauseText']
                            }
                        },
                    },
                    required: ['theme', 'peoplesPartyPosition', 'opponentPosition', 'keyDifference', 'strategicAdvantage', 'clauseComparison']
                }
            }
        },
        required: ["title", "executiveSummary", "comparison"]
    };
    return callGemini(prompt, systemInstruction, comparisonSchema);
};

export const generateForensicBudgetAnalysis = async (
    budgetData: string,
    onStatusUpdate?: (status: string) => void
): Promise<ForensicBudgetAnalysisReport> => {
    const language = 'Thai';
    onStatusUpdate?.('Cross-referencing market data...');
    const systemInstruction = `You are a forensic accountant and anti-corruption AI. Analyze the provided budget data, identify items with unusually high costs compared to fair market value (FMV), and structure the findings into a formal report. Generate a "killer question" for each suspicious item. Output must be valid JSON. The language of the response must be ${language}.`;
    const prompt = `Analyze this budget data: \n${budgetData}`;
    const forensicSchema = {
        type: Type.OBJECT,
        properties: {
            reportTitle: { type: Type.STRING },
            reportDate: { type: Type.STRING },
            preparedFor: { type: Type.STRING },
            executiveSummary: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    overallFinding: { type: Type.STRING },
                    quantifiedWasteExample: { type: Type.STRING },
                    systemicIssueRate: { type: Type.STRING },
                    potentialAnnualSavings: { type: Type.STRING },
                },
                required: ['title', 'overallFinding', 'quantifiedWasteExample', 'systemicIssueRate', 'potentialAnnualSavings']
            },
            methodology: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'steps']
            },
            findingsComparisonTable: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                priorityRank: { type: Type.INTEGER },
                                itemCategory: { type: Type.STRING },
                                standardSpecification: { type: Type.STRING },
                                fmvBenchmarkPerUnit: { type: Type.NUMBER },
                                totalUnitsSampled: { type: Type.INTEGER },
                                totalBudgetedCostSampled: { type: Type.NUMBER },
                                highestBMAUnitPriceFound: { type: Type.STRING },
                                avgOverpaymentPerUnit: { type: Type.STRING },
                                avgPercentOverFMV: { type: Type.STRING },
                                totalSampleOverpayment: { type: Type.NUMBER },
                                keyDistrictsInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
                                notesFromBudgetDoc: { type: Type.STRING },
                                killerQuestion: { type: Type.STRING },
                                marketReferenceSource: { type: Type.STRING },
                            },
                            required: ['priorityRank', 'itemCategory', 'standardSpecification', 'fmvBenchmarkPerUnit', 'totalUnitsSampled', 'totalBudgetedCostSampled', 'highestBMAUnitPriceFound', 'avgOverpaymentPerUnit', 'avgPercentOverFMV', 'totalSampleOverpayment', 'keyDistrictsInvolved', 'notesFromBudgetDoc', 'killerQuestion', 'marketReferenceSource']
                        }
                    },
                },
                required: ['title', 'items']
            },
            callToAction: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    keyDemands: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ourGoal: { type: Type.STRING },
                },
                required: ['title', 'keyDemands', 'ourGoal']
            },
            appendixMarketReferences: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    references: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                item: { type: Type.STRING },
                                urls: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                            required: ['item', 'urls']
                        }
                    },
                },
                required: ['title', 'references']
            },
            disclaimer: { type: Type.STRING },
        },
        required: ["reportTitle", "reportDate", "preparedFor", "executiveSummary", "methodology", "findingsComparisonTable", "callToAction", "appendixMarketReferences", "disclaimer"]
    };
    return callGemini(prompt, systemInstruction, forensicSchema);
};

export const generateCommunicationsPackage = async (
    topic: string,
    context: string,
    onStatusUpdate?: (status: string) => void
): Promise<CommunicationsPackage> => {
    const language = 'Thai';
    onStatusUpdate?.('Drafting communication angles...');
    const systemInstruction = `You are a political communications expert for a progressive party. Based on the topic and context, create a communications package including a Twitter thread, a Facebook post, and a press release snippet. The tone should be engaging, persuasive, and aligned with the party's values. Output must be valid JSON. The language of the response must be ${language}.`;
    const prompt = `
        Topic: ${topic}
        Context/Summary: ${context}
        Generate the communications package.
    `;
    const commsSchema = {
        type: Type.OBJECT,
        properties: {
            twitterThread: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { tweet: { type: Type.STRING } }, required: ['tweet'] } },
            facebookPost: { type: Type.STRING },
            pressReleaseSnippet: { type: Type.STRING },
        },
        required: ['twitterThread', 'facebookPost', 'pressReleaseSnippet']
    };
    return callGemini(prompt, systemInstruction, commsSchema);
};

export const generateInfographicData = async (
    report: IntelligenceBriefingReport,
    onStatusUpdate?: (status: string) => void
): Promise<InfographicData> => {
    onStatusUpdate?.('Visualizing key data points...');
    const systemInstruction = `You are a data visualization AI. Your task is to transform a complex intelligence report into a simple, compelling infographic data structure. Summarize the key data points into charts and provide sharp, strategic takeaways. Output must be valid JSON.`;

    const prompt = `
    Based on this report, create data for an infographic.
    - The title should be engaging.
    - The credibilityScore chart should be a doughnut chart with two datasets: one for the score, one for the remaining part to 100.
    - The publicSentiment chart should be a bar chart showing pro, anti, and neutral percentages.
    - The keyTakeaways should be 3-4 sharp, actionable bullet points derived from the report's executive summary and recommended positioning.
    
    Report:
    ${JSON.stringify({
        topic: report.topic,
        executiveSummary: report.executiveSummary,
        policyCredibilityScore: report.policyCredibilityScore,
        socialMediaSentiment: report.socialMediaSentiment,
        recommendedPositioning: report.recommendedPositioning,
    }, null, 2)}
    `;

    const chartConfigSchema = {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING },
            data: {
                type: Type.OBJECT,
                properties: {
                    labels: { type: Type.ARRAY, items: { type: Type.STRING } },
                    datasets: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                data: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                                backgroundColor: { type: Type.ARRAY, items: { type: Type.STRING } },
                            },
                            required: ['label', 'data', 'backgroundColor']
                        }
                    },
                },
                required: ['labels', 'datasets']
            },
        },
        required: ["type", "data"]
    };
    
    const infographicSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            charts: {
                type: Type.OBJECT,
                properties: {
                    credibilityScore: chartConfigSchema,
                    publicSentiment: chartConfigSchema,
                },
                required: ['credibilityScore', 'publicSentiment']
            },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'charts', 'keyTakeaways']
    };
    return callGemini(prompt, systemInstruction, infographicSchema);
};

// --- EVENT DETAILS EXTRACTION ---
const EVENT_EXTRACTION_INSTRUCTION = `You are an API that extracts event details from text and converts them into a structured JSON object. Today is ${new Date().toDateString()}. The user is in timezone ${Intl.DateTimeFormat().resolvedOptions().timeZone}. Interpret dates and times relative to now. If a specific time is not mentioned, suggest a reasonable default (e.g., 10:00 AM). The event duration should be 1 hour unless specified otherwise. Your response must be only the valid JSON object.`;

interface EventDetailsResult {
    title: string;
    description: string;
    location: string;
    suggestedDateTime: string;
}

const eventExtractionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise, descriptive title for the event." },
        description: { type: Type.STRING, description: "A detailed description of the event, including the original text." },
        location: { type: Type.STRING, description: "The suggested location for the event. Default to 'Parliament House, Bangkok' if not specified." },
        suggestedDateTime: { type: Type.STRING, description: "The suggested start date and time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)." }
    },
    required: ['title', 'description', 'location', 'suggestedDateTime']
};

export const extractEventDetails = async (text: string, reportTopic: string): Promise<EventDetailsResult> => {
    const prompt = `
        Based on the following text, extract details for a calendar event. The event is related to the report topic "${reportTopic}".

        Text:
        """
        ${text}
        """
    `;

    const result = await callGemini(prompt, EVENT_EXTRACTION_INSTRUCTION, eventExtractionSchema);
    
    if (isNaN(new Date(result.suggestedDateTime).getTime())) {
        console.warn("Gemini returned an invalid date format, creating a default.");
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        result.suggestedDateTime = tomorrow.toISOString();
    }
    
    return result;
};