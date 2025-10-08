import type { IntelligenceBriefingReport, PolicyCredibilityScore, EnhancedStakeholder, InternalStrategy, DraftComparisonReport, IntelReport, MethodologyReport, UserContribution, WebSource, ForensicBudgetAnalysisReport, RiskImpactAnalysis, AntiMonopolyAnalysis, EnhancedPartyDraftComparison, SubstrateArgumentGraph, SocialMediaSentiment } from '../types';

// --- TRANSLATION MAPS ---
const audienceMap: { [key: string]: string } = {
    'Press': 'สื่อมวลชน',
    'Parliament Floor': 'รัฐสภา',
    'Community Organizers': 'ผู้จัดงานในชุมชน',
    'Social Media Influencers': 'ผู้มีอิทธิพลบนโซเชียลมีเดีย'
};

// --- MODULAR MARKDOWN GENERATORS ---

export const generateMarkdownForCredibilityScore = (score: PolicyCredibilityScore): string => {
    let md = `## คะแนนความน่าเชื่อถือนโยบาย: ${score.overallScore}/100\n\n`;
    score.components.forEach(c => {
        md += `* **${c.name}:** ${c.score}/100\n  *เหตุผล: ${c.rationale}*\n`;
    });
    return md;
};

export const generateMarkdownForInternalStrategy = (strategy: InternalStrategy): string => {
    let md = '## สรุปกลยุทธ์ภายในและประเด็นพูดคุย\n\n';

    md += '### มุมมองการเล่าเรื่องเชิงกลยุทธ์\n';
    strategy.strategicNarrativeAngles.forEach(angle => {
        md += `* **มุมมอง:** ${angle.angle}\n  *เหตุผล: ${angle.rationale}*\n`;
    });
    md += '\n';

    md += '### ประเด็นพูดคุยสำหรับกลุ่มเป้าหมาย\n';
    strategy.talkingPoints.forEach(tp => {
        md += `#### สำหรับ: ${audienceMap[tp.audience as keyof typeof audienceMap] || tp.audience}\n`;
        tp.points.forEach(p => {
            md += `* **ประเด็น:** ${p.point}\n  *เหตุผล: ${p.rationale}*\n`;
        });
        md += '\n';
    });

    md += '### การเตรียมประเด็นโต้แย้ง\n';
    strategy.rebuttals.forEach(r => {
        md += `* **ถ้าเขาพูดว่า:** "${r.opposingArgument}"\n* **เราจะตอบว่า:** "${r.suggestedRebuttal}"\n\n`;
    });
    return md;
};

export const generateMarkdownForStakeholders = (stakeholders: EnhancedStakeholder[]): string => {
    let md = '## การวิเคราะห์ผู้มีส่วนได้ส่วนเสีย\n\n';
    stakeholders.forEach(s => {
        md += `### ${s.name} (${s.category})\n`;
        md += `* **จุดยืน:** ${s.stance}\n`;
        md += `* **ระดับอิทธิพล:** ${s.influenceLevel}\n`;
        md += `* **บทสรุป:** ${s.summary}\n`;
        if (s.politicalConnections && s.politicalConnections.length > 0) {
            md += `* **ความเชื่อมโยงทางการเมือง:**\n`;
            s.politicalConnections.forEach(pc => {
                md += `  - ${pc.person}: ${pc.connection} (ที่มา: ${pc.source})\n`;
            });
        }
        md += '\n';
    });
    return md;
}

export const generateMarkdownForAntiMonopolyAnalysis = (analysis: AntiMonopolyAnalysis): string => {
    let md = `## การวิเคราะห์การต่อต้านการผูกขาดและการทุจริต\n\n`;
    md += `### รายงานเปิดโปง\n`;
    analysis.shameReport.forEach(item => {
        md += `> ${item}\n\n`;
    });

    md += `### ผลประโยชน์ทับซ้อน\n`;
    analysis.conflictsOfInterest.forEach(item => {
        md += `* **บุคคล:** ${item.person} (${item.role})\n`;
        md += `* **เอื้อประโยชน์ให้:** ${item.beneficiaryCompany}\n`;
        md += `* **ความสัมพันธ์:** ${item.relationshipToBeneficiary}\n`;
        md += `* **บทวิเคราะห์:** ${item.analysisOfConflict}\n\n`;
    });

    md += `### กลไกการผูกขาด\n`;
    md += `**อุปสรรคในการเข้าสู่ตลาด:**\n`;
    analysis.barriersToEntry.forEach(item => {
        md += `- **ข้อกฎหมาย \`${item.clause}\`**: ${item.analysis}\n`;
    });
    md += `\n**กลยุทธ์การแสวงหาผลประโยชน์:**\n`;
    analysis.exploitationTactics.forEach(item => {
        md += `- ${item}\n`;
    });
    md += '\n';

    return md;
}


export const generateMarkdownForDraftComparison = (report: DraftComparisonReport): string => {
    let md = `# เปรียบเทียบร่าง: ${report.title}\n\n`;
    md += `## บทสรุปสำหรับผู้บริหาร\n${report.executiveSummary}\n\n`;

    report.comparison.forEach(point => {
        md += `---\n\n## เปรียบเทียบรายประเด็น: ${point.theme}\n\n`;
        md += `### การวิเคราะห์\n`;
        md += `| แง่มุม | จุดยืนพรรคประชาชน | จุดยืนฝ่ายตรงข้าม |\n`;
        md += `|---|---|---|\n`;
        md += `| **จุดยืน** | ${point.peoplesPartyPosition.replace(/\n/g, '<br/>')} | ${point.opponentPosition.replace(/\n/g, '<br/>')} |\n`;
        md += `| **ข้อแตกต่างสำคัญ** | ${point.keyDifference.replace(/\n/g, '<br/>')} | - |\n\n`;
        
        md += `### 🏆 ความได้เปรียบเชิงกลยุทธ์\n`;
        md += `> ${point.strategicAdvantage}\n\n`;

        md += `### หลักฐานระดับมาตรา\n`;
        const ppClause = point.clauseComparison.find(c => c.draftIdentifier === "ร่างของพรรคประชาชน")?.clauseText || 'N/A';
        const oppClause = point.clauseComparison.find(c => c.draftIdentifier === "ร่างของฝ่ายตรงข้าม")?.clauseText || 'N/A';
        
        md += `**ร่างของพรรคประชาชน:**\n\`\`\`\n${ppClause}\n\`\`\`\n\n`;
        md += `**ร่างของฝ่ายตรงข้าม:**\n\`\`\`\n${oppClause}\n\`\`\`\n\n`;
    });

    return md;
};

export const generateMarkdownForMethodology = (methodology: MethodologyReport): string => {
    let md = `## ระเบียบวิธีวิเคราะห์ของ AI\n\n`;
    md += `### ระดับความเชื่อมั่น: ${methodology.confidenceLevel.score}/100\n*${methodology.confidenceLevel.rationale}*\n\n`;

    md += `### แหล่งข้อมูลและการให้น้ำหนัก\n`;
    methodology.informationSources.forEach(s => {
        md += `* **${s.sourceType}:** ${s.weightingRationale}\n`;
    });
    md += `\n`;

    md += `### กรอบการวิเคราะห์ที่ใช้\n`;
    methodology.analyticalFrameworks.forEach(f => {
        md += `* ${f}\n`;
    });
    md += `\n`;

    md += `### กระบวนการให้เหตุผล\n`;
    methodology.reasoningProcess.forEach((step, i) => {
        md += `${i + 1}. ${step}\n`;
    });
    md += `\n`;

    md += `### อคติที่รับทราบ\n`;
    methodology.potentialBiases.forEach(b => {
        md += `* **${b.biasType}:** ${b.mitigation}\n`;
    });

    return md;
};

export const generateMarkdownForIntelReport = (report: IntelReport): string => {
    let md = `# แฟ้มข้อมูลข่าวกรองไซเบอร์: ${report.profile.name}\n\n`;

    md += `## บทสรุปสำหรับผู้บริหาร\n${report.executiveSummary}\n\n`;

    md += `## การประเมินความเสี่ยง\n`;
    md += `* **ระดับ:** ${report.riskAssessment.level}\n`;
    md += `* **เหตุผล:** ${report.riskAssessment.justification}\n\n`;

    md += '## ข้อมูลบุคคล\n';
    md += `* **ตำแหน่ง:** ${report.profile.titles.join(', ')}\n`;
    md += `* **ชื่ออื่น:** ${report.profile.aliases.join(', ')}\n`;
    md += `* **บริษัทที่เกี่ยวข้อง:** ${report.profile.associatedCompanies.join(', ')}\n`;
    md += `* **สถานที่ที่รู้จัก:** ${report.profile.knownLocations.join('; ')}\n\n`;
    
    md += `## สัญญาณความเสี่ยง\n`;
    if (report.riskFlags.length > 0) {
        report.riskFlags.forEach(flag => {
            md += `* ${flag}\n`;
        });
    } else {
        md += `_ไม่พบสัญญาณความเสี่ยง_\n`;
    }
    md += '\n';

    md += `## เส้นเวลา\n`;
    if (report.timeline.length > 0) {
        report.timeline.forEach(item => {
            md += `* **${item.date}:** ${item.event}\n`;
        });
    } else {
        md += `_ไม่มีข้อมูลเส้นเวลา_\n`;
    }
    md += '\n';

    md += `## รายละเอียดครอบครัว\n`;
    if (report.familyDetails.length > 0) {
        report.familyDetails.forEach(item => {
            md += `* **${item.name} (${item.relation}):** ${item.details}\n`;
        });
    } else {
        md += `_ไม่มีข้อมูลครอบครัว_\n`;
    }
    md += '\n';
    
    md += `## การกล่าวถึงในที่สาธารณะ\n`;
    if (report.publicMentions.length > 0) {
        report.publicMentions.forEach(mention => {
            md += `* ${mention}\n`;
        });
    } else {
        md += `_ไม่พบการกล่าวถึงในที่สาธารณะ_\n`;
    }
    md += '\n';

    if (report.methodology) {
        md += generateMarkdownForMethodology(report.methodology) + '\n---\n\n';
    }

    if (report.sources && report.sources.length > 0) {
        md += `## แหล่งข้อมูล\n`;
        report.sources.forEach(s => {
            md += `* [${s.title || s.uri}](${s.uri})\n`;
        });
    }

    return md;
};

export const generateMarkdownForForensicBudgetAnalysis = (report: ForensicBudgetAnalysisReport): string => {
    let md = `# ${report.reportTitle}\n\n`;
    md += `**วันที่:** ${report.reportDate} | **จัดทำเพื่อ:** ${report.preparedFor}\n\n`;

    md += `## ${report.executiveSummary.title}\n`;
    md += `* **ข้อค้นพบโดยรวม:** ${report.executiveSummary.overallFinding}\n`;
    md += `* **ตัวอย่างการสิ้นเปลือง:** ${report.executiveSummary.quantifiedWasteExample}\n`;
    md += `* **อัตราปัญหาเชิงระบบ:** ${report.executiveSummary.systemicIssueRate}\n`;
    md += `* **ศักยภาพการประหยัดต่อปี:** ${report.executiveSummary.potentialAnnualSavings}\n\n`;

    md += `## ${report.methodology.title}\n`;
    report.methodology.steps.forEach(step => {
        md += `1. ${step}\n`;
    });
    md += `\n---\n\n`;
    
    md += `## ${report.findingsComparisonTable.title}\n\n`;
    report.findingsComparisonTable.items.forEach(item => {
        md += `### ${item.priorityRank}. ${item.itemCategory}\n`;
        md += `| รายละเอียด | ค่า |\n`;
        md += `|---|---|\n`;
        md += `| **คุณสมบัติมาตรฐาน** | ${item.standardSpecification} |\n`;
        md += `| **ราคาตลาด (FMV)/หน่วย** | ${item.fmvBenchmarkPerUnit.toLocaleString()} บาท |\n`;
        md += `| **ราคาจัดซื้อสูงสุดที่พบ** | ${item.highestBMAUnitPriceFound} บาท |\n`;
        md += `| **ส่วนต่างเฉลี่ย/หน่วย** | ${item.avgOverpaymentPerUnit} บาท |\n`;
        md += `| **% ที่จ่ายเกิน FMV** | ${item.avgPercentOverFMV}% |\n`;
        md += `| **มูลค่าจ่ายเกิน (ตัวอย่าง)** | **${item.totalSampleOverpayment.toLocaleString()} บาท** |\n`;
        md += `| **เขตที่เกี่ยวข้อง** | ${item.keyDistrictsInvolved.join(', ')} |\n`;
        md += `| **หมายเหตุ** | ${item.notesFromBudgetDoc} |\n`;
        md += `| **แหล่งอ้างอิงราคา** | ${item.marketReferenceSource} |\n\n`;
        md += `**คำถามสังหาร:**\n`;
        md += `> ${item.killerQuestion}\n\n`;
        md += `---\n\n`;
    });

    md += `## ${report.callToAction.title}\n`;
    report.callToAction.keyDemands.forEach(demand => {
        md += `* ${demand}\n`;
    });
    md += `\n**เป้าหมายของเรา:** ${report.callToAction.ourGoal}\n\n`;

    md += `## ${report.appendixMarketReferences.title}\n`;
    report.appendixMarketReferences.references.forEach(ref => {
        md += `* **${ref.item}:**\n`;
        ref.urls.forEach(url => {
            md += `  - ${url}\n`;
        });
    });
    md += `\n`;

    md += `**คำชี้แจง:**\n*${report.disclaimer}*\n`;
    
    return md;
};

export const generateMarkdownForArgumentGraph = (graph: SubstrateArgumentGraph): string => {
    let md = `## กราฟโครงสร้างข้อโต้แย้ง\n\n`;

    md += `### ✅ ข้อโต้แย้งฝ่ายสนับสนุน\n\n`;
    (graph.pro || []).forEach(arg => {
        md += `#### ${arg.title}\n`;
        md += `*กรอบการนำเสนอ: ${arg.frame}*\n\n`;
        arg.claims.forEach(claim => {
            md += `- **ข้อกล่าวอ้าง:** ${claim.claim}\n`;
            md += `  - **รายละเอียด:** ${claim.detail}\n`;
        });
        md += `\n`;
    });

    md += `### ❌ ข้อโต้แย้งฝ่ายคัดค้าน\n\n`;
    (graph.con || []).forEach(arg => {
        md += `#### ${arg.title}\n`;
        md += `*กรอบการนำเสนอ: ${arg.frame}*\n\n`;
        arg.claims.forEach(claim => {
            md += `- **ข้อกล่าวอ้าง:** ${claim.claim}\n`;
            md += `  - **รายละเอียด:** ${claim.detail}\n`;
        });
        md += `\n`;
    });
    
    return md;
};

export const generateMarkdownForPartyComparison = (comparison: EnhancedPartyDraftComparison[]): string => {
    let md = `## การเปรียบเทียบร่างของพรรค\n\n`;
    md += `| พรรค | จุดยืน | การวางตำแหน่งความเสี่ยง | ข้อกฎหมายที่น่าสังเกต |\n`;
    md += `|---|---|---|---|\n`;
    (comparison || []).forEach(p => {
        md += `| ${p.party} | ${p.position} | ${p.riskPositioning} | ${p.notableClause} |\n`;
    });
    return md;
};

export const generateMarkdownForSocialMediaSentiment = (sm: SocialMediaSentiment): string => {
    if (!sm) return '';
    let md = `## ภูมิทัศน์การถกเถียงในที่สาธารณะ (ผ่าน ${sm.hashtag})\n\n`;
    md += `* **ความรู้สึก:** สนับสนุน ${sm.proPercent}%, คัดค้าน ${sm.antiPercent}%, เป็นกลาง ${sm.neutralPercent}%\n`;
    
    if (sm.commonConcerns && sm.commonConcerns.length > 0) {
        md += `* **ข้อกังวลที่ถูกกล่าวถึงมากที่สุด:**\n`;
        sm.commonConcerns.forEach(c => md += `  * ${c}\n`);
    }

    if (sm.argumentClusters && sm.argumentClusters.length > 0) {
        md += `\n### กลุ่มข้อโต้แย้งหลัก\n`;
        sm.argumentClusters.forEach(cluster => {
            md += `#### ${cluster.theme}\n`;
            md += `> *${cluster.summary}*\n\n`;
            (cluster.representativeQuotes || []).forEach(quote => {
                md += `* "${quote}"\n`;
            });
            md += '\n';
        });
    }

    return md;
};

export const generateMarkdownForRiskImpactAnalysis = (analysis: RiskImpactAnalysis): string => {
    if (!analysis) return '';
    let md = `## การวิเคราะห์ความเสี่ยงและผลกระทบ\n\n`;
    md += `### สาธารณสุข\n${analysis.publicHealth}\n\n`;
    md += `### เศรษฐกิจ\n${analysis.economic}\n\n`;
    md += `### ความสมานฉันท์ทางสังคม\n${analysis.socialCohesion}\n\n`;
    return md;
};


// --- MAIN REPORT GENERATOR ---

export const generateMarkdownForIntelligenceBriefing = (report: IntelligenceBriefingReport): string => {
    let md = `# บทสรุปข่าวกรอง: ${report.topic}\n\n`;
    md += `## บทสรุปสำหรับผู้บริหาร\n${report.executiveSummary}\n\n`;

    md += generateMarkdownForCredibilityScore(report.policyCredibilityScore) + '\n---\n\n';
    
    md += `## จุดยืนและกรอบยุทธศาสตร์ที่แนะนำ\n`;
    md += `**จุดยืน:** ${report.recommendedPositioning.stance}\n`;
    md += `**เหตุผล:**\n`;
    report.recommendedPositioning.justification.forEach(j => md += `* ${j}\n`);
    md += `**กรอบยุทธศาสตร์ใหม่: "${report.recommendedPositioning.positioningReframe.title}"**\n`;
    md += `*เหตุผล: ${report.recommendedPositioning.positioningReframe.rationale}*\n\n`;
    md += '---\n\n';

    if (report.internalStrategy) md += generateMarkdownForInternalStrategy(report.internalStrategy) + '\n---\n\n';
    if (report.stakeholderAnalysis) md += generateMarkdownForStakeholders(report.stakeholderAnalysis) + '\n---\n\n';
    if (report.antiMonopolyAnalysis) md += generateMarkdownForAntiMonopolyAnalysis(report.antiMonopolyAnalysis) + '\n---\n\n';

    if (report.partyDraftComparison && report.partyDraftComparison.length > 0) {
        md += generateMarkdownForPartyComparison(report.partyDraftComparison) + '\n---\n\n';
    }

    if (report.substrateArgumentGraph) {
        md += generateMarkdownForArgumentGraph(report.substrateArgumentGraph) + '\n---\n\n';
    }

    if (report.riskImpactAnalysis) {
        md += generateMarkdownForRiskImpactAnalysis(report.riskImpactAnalysis) + '\n---\n\n';
    }
    
    if (report.socialMediaSentiment) {
        md += generateMarkdownForSocialMediaSentiment(report.socialMediaSentiment) + '\n---\n\n';
    }

    if (report.methodology) {
        md += generateMarkdownForMethodology(report.methodology) + '\n---\n\n';
    }
    
    md += `## รายงานข่าวกรองจำลอง\n\n`;
    md += `### รายงาน OSINT\n\n${report.simulatedOsintReport}\n\n`;
    md += `### Crawler รัฐสภา\n\n${report.simulatedCrawlerReport}\n\n`;
    

    if (report.sources && report.sources.length > 0) {
        md += `## แหล่งอ้างอิง\n`;
        report.sources.forEach((s, i) => {
            md += `${i + 1}. [${s.title || s.uri}](${s.uri})\n`;
        });
    }

    return md;
}

export const generateHtmlForIntelligenceBriefing = (report: IntelligenceBriefingReport): string => {
    let body = `<h1>บทสรุปข่าวกรอง: ${report.topic}</h1>`;
    body += `<h2>บทสรุปสำหรับผู้บริหาร</h2><p>${report.executiveSummary}</p>`;
    body += `<h2>จุดยืนและกรอบยุทธศาสตร์ที่แนะนำ</h2>`;
    body += `<p><strong>จุดยืน:</strong> ${report.recommendedPositioning.stance}</p>`;
    body += `<h3>เหตุผลสนับสนุน:</h3><ul>${report.recommendedPositioning.justification.map(j => `<li>${j}</li>`).join('')}</ul>`;
    
    if (report.sources && report.sources.length > 0) {
        body += `<h2>แหล่งอ้างอิง</h2><ol>`;
        report.sources.forEach((s, i) => {
            body += `<li id="source-${i+1}"><a href="${s.uri}" target="_blank">${s.title || s.uri}</a></li>`;
        });
        body += `</ol>`;
    }
    
    return `
        <html>
        <head>
            <style>
                body { font-family: 'Kanit', sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: auto; padding: 20px; }
                h1, h2, h3 { color: #111; font-weight: 600; }
                h1 { font-size: 2.2em; color: #F58220; border-bottom: 2px solid #F58220; padding-bottom: 10px; }
                h2 { font-size: 1.6em; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 30px; margin-bottom: 20px; }
                h3 { font-size: 1.3em; margin-top: 25px; margin-bottom: 10px; color: #222; }
                blockquote { border-left: 4px solid #ccc; padding-left: 15px; color: #666; font-style: italic; }
                ul, ol { padding-left: 20px; }
                li { margin-bottom: 8px; }
                a { color: #1a0dab; text-decoration: none; }
                a:hover { text-decoration: underline; }
                sup a { text-decoration: none; color: #1a0dab; font-weight: bold; }
            </style>
        </head>
        <body>${body}</body>
        </html>
    `;
};