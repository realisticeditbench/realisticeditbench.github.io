// RealisticEditBench Leaderboard Data
// Prior-Edits-Only prompt, oracle-based context (paper Table II & Table IV, Fig. 4)

const PAPER_DATE = "2026-1-30";

function entry(model, resolvedRate, organization, orgType, flags = {}) {
    return {
        model,
        resolvedRate,
        organization,
        orgType,
        date: PAPER_DATE,
        details: "#",
        ...flags
    };
}

const leaderboardData = {
    "20": [
        entry("SWE-Agent+Claude-Sonnet-4.5", 36.24, "Anthropic", "anthropic", { isBest: true }),
        entry("SWE-Agent+DeepSeek-V3.2", 31.46, "DeepSeek", "deepseek", { isSecondBest: true }),
        entry("SWE-Agent+Gemini-2.5-Pro", 25.42, "Google", "google"),
        entry("SWE-Agent+GPT-5-Codex", 20.79, "OpenAI", "openai"),
        entry("Claude-Sonnet-4.5", 17.98, "Anthropic", "anthropic"),
        entry("Gemini-2.5-Pro", 15.17, "Google", "google"),
        entry("GPT-5-Codex", 12.92, "OpenAI", "openai"),
        entry("Cursor Tab", 12.50, "Cursor", "cursor"),
        entry("SWE-Agent+Qwen3-235B-A22B", 11.24, "Alibaba", "alibaba"),
        entry("DeepSeek-V3.2", 10.96, "DeepSeek", "deepseek"),
        entry("Agentless+Claude-Sonnet-4.5", 8.29, "Anthropic", "anthropic"),
        entry("Agentless+Gemini-2.5-Pro", 7.87, "Google", "google"),
        entry("Agentless+DeepSeek-V3.2", 7.44, "DeepSeek", "deepseek"),
        entry("Agentless+GPT-5-Codex", 6.32, "OpenAI", "openai"),
        entry("Agentless+Qwen3-235B-A22B", 4.21, "Alibaba", "alibaba"),
        entry("Qwen3-235B-A22B", 0.56, "Alibaba", "alibaba")
    ],
    "40": [
        entry("Claude-Sonnet-4.5", 33.57, "Anthropic", "anthropic", { isBest: true }),
        entry("Gemini-2.5-Pro", 19.38, "Google", "google", { isSecondBest: true }),
        entry("GPT-5-Codex", 15.31, "OpenAI", "openai"),
        entry("DeepSeek-V3.2", 14.19, "DeepSeek", "deepseek"),
        entry("Qwen3-235B-A22B", 1.97, "Alibaba", "alibaba")
    ],
    "60": [
        entry("Claude-Sonnet-4.5", 42.70, "Anthropic", "anthropic", { isBest: true }),
        entry("GPT-5-Codex", 21.49, "OpenAI", "openai", { isSecondBest: true }),
        entry("Gemini-2.5-Pro", 21.21, "Google", "google"),
        entry("DeepSeek-V3.2", 21.07, "DeepSeek", "deepseek"),
        entry("Qwen3-235B-A22B", 1.40, "Alibaba", "alibaba")
    ],
    "80": [
        entry("Claude-Sonnet-4.5", 50.28, "Anthropic", "anthropic", { isBest: true }),
        entry("Gemini-2.5-Pro", 29.63, "Google", "google", { isSecondBest: true }),
        entry("DeepSeek-V3.2", 25.28, "DeepSeek", "deepseek"),
        entry("GPT-5-Codex", 23.60, "OpenAI", "openai"),
        entry("Qwen3-235B-A22B", 2.39, "Alibaba", "alibaba")
    ]
};
