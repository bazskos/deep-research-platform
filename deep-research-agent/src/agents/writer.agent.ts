import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../services/llm.service';
import { ResearchResult, WriterOutput } from '../common/types';

@Injectable()
export class WriterAgent {
  private readonly logger = new Logger(WriterAgent.name);

  constructor(private readonly llmService: LlmService) {}

  async write(query: string, results: ResearchResult[]): Promise<WriterOutput> {
    this.logger.log(`Writing final report for: "${query}"`);

    const prompt = this.buildPrompt(query, results);

    // Using a slightly higher temperature (0.7) for writing to make the text flow better
    const report = await this.llmService.generate(prompt, 0.7);

    this.logger.log('Report generated successfully');
    return { report };
  }

  private buildPrompt(query: string, results: ResearchResult[]): string {
    // We explicitly include the sources here so the Writer AI can cite them
    const researchSections = results
      .map((r) => {
        const sourceLinks =
          r.sources && r.sources.length > 0
            ? r.sources.map((s) => `- ${s.title}: ${s.url}`).join('\n')
            : '- No specific sources provided.';
        return `### ${r.topic}\n${r.summary}\n\nSources used for this topic:\n${sourceLinks}`;
      })
      .join('\n\n====================\n\n');

    return `You are a Professional Research Writer and Analyst AI.
Your task is to write a comprehensive, beautifully formatted report based EXCLUSIVELY on the data gathered by the research agents.

Original User Query: "${query}"

Research Data:
${researchSections}

MANDATORY MARKDOWN STRUCTURE:
Your response MUST STRICTLY follow this exact structure:

# [Main Title of the Research]

> [A short, 2-3 sentence Executive Summary highlighting the most important conclusion.]

## 📌 Introduction & Context
[Introduce the topic based on the data and explain its relevance.]

## 🔍 Key Findings
[Detail the core data and facts found by the researchers. Use subheadings (###) and bullet points to make it highly readable and well-structured.]

## 💡 Analysis & Conclusion
[Draw final, objective conclusions based on the provided data.]

## 🔗 References & Sources
[MANDATORY: List ALL the distinct sources and URLs provided in the Research Data section in a bulleted list. Format: * [Source Title](URL)]

RULES:
- DO NOT hallucinate or invent data, facts, or URLs. Rely strictly on the provided 'Research Data'.
- The tone must be professional, objective, and analytical.
- Your response MUST contain ONLY the Markdown text, with absolutely no conversational filler (no "Here is your report").`;
  }
}
