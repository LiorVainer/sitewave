import { z } from 'zod';

// Base metadata schema
export const NpmsPackageMetadataSchema = z.object({
    name: z.string(),
    version: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    author: z
        .object({
            name: z.string(),
            email: z.string().optional(),
        })
        .optional(),
    maintainers: z
        .array(
            z.object({
                username: z.string(),
                email: z.string().optional(),
            }),
        )
        .optional(),
    repository: z
        .object({
            type: z.string(),
            url: z.string(),
        })
        .optional(),
    links: z
        .object({
            npm: z.string().optional(),
            homepage: z.string().optional(),
            repository: z.string().optional(),
            bugs: z.string().optional(),
        })
        .optional(),
    license: z.string().optional(),
    dependencies: z.record(z.string()).optional(),
    devDependencies: z.record(z.string()).optional(),
    peerDependencies: z.record(z.string()).optional(),
});

// NPM data schema
export const NpmsPackageNpmSchema = z.object({
    downloads: z
        .array(
            z.object({
                from: z.string(),
                to: z.string(),
                count: z.number(),
            }),
        )
        .optional(),
    dependentsCount: z.number().optional(),
    starsCount: z.number().optional(),
});

// GitHub data schema
export const NpmsPackageGithubSchema = z.object({
    homepage: z.string().optional(),
    starsCount: z.number().optional(),
    forksCount: z.number().optional(),
    subscribersCount: z.number().optional(),
    issues: z
        .object({
            count: z.number(),
            openCount: z.number(),
            distribution: z.record(z.number()).optional(),
        })
        .optional(),
    contributors: z
        .array(
            z.object({
                username: z.string(),
                commitsCount: z.number(),
            }),
        )
        .optional(),
    commits: z
        .array(
            z.object({
                from: z.string(),
                to: z.string(),
                count: z.number(),
            }),
        )
        .optional(),
});

// Collected data schema
export const NpmsPackageCollectedSchema = z.object({
    metadata: NpmsPackageMetadataSchema,
    npm: NpmsPackageNpmSchema,
    github: NpmsPackageGithubSchema.optional(),
});

// Score schema
export const NpmsPackageScoreSchema = z.object({
    final: z.number(),
    detail: z.object({
        quality: z.number(),
        popularity: z.number(),
        maintenance: z.number(),
    }),
});

// Evaluation schema
export const NpmsPackageEvaluationSchema = z.object({
    quality: z.object({
        carefulness: z.number(),
        tests: z.number(),
        health: z.number(),
        branding: z.number(),
    }),
    popularity: z.object({
        communityInterest: z.number(),
        downloadsCount: z.number(),
        downloadsAcceleration: z.number(),
        dependentsCount: z.number(),
    }),
    maintenance: z.object({
        releasesFrequency: z.number(),
        commitsFrequency: z.number(),
        openIssues: z.number(),
        issuesDistribution: z.number(),
    }),
});

// Main package info schema
export const NpmsPackageInfoSchema = z.object({
    analyzedAt: z.string(),
    collected: NpmsPackageCollectedSchema,
    evaluation: NpmsPackageEvaluationSchema,
    score: NpmsPackageScoreSchema,
    error: z
        .object({
            code: z.string(),
            message: z.string(),
        })
        .optional(),
});

// Search result schema
export const NpmsSearchResultSchema = z.object({
    package: NpmsPackageMetadataSchema,
    flags: z
        .object({
            deprecated: z.string().optional(),
            unstable: z.boolean().optional(),
            insecure: z.boolean().optional(),
        })
        .optional(),
    score: NpmsPackageScoreSchema,
    searchScore: z.number(),
});

// Search response schema
export const NpmsSearchResponseSchema = z.object({
    total: z.number(),
    results: z.array(NpmsSearchResultSchema),
});

// Suggestion schema (extends search result)
export const NpmsSuggestionSchema = NpmsSearchResultSchema.extend({
    highlight: z.string().optional(),
});

// Export inferred types
export type NpmsPackageMetadata = z.infer<typeof NpmsPackageMetadataSchema>;
export type NpmsPackageNpm = z.infer<typeof NpmsPackageNpmSchema>;
export type NpmsPackageGithub = z.infer<typeof NpmsPackageGithubSchema>;
export type NpmsPackageCollected = z.infer<typeof NpmsPackageCollectedSchema>;
export type NpmsPackageScore = z.infer<typeof NpmsPackageScoreSchema>;
export type NpmsPackageEvaluation = z.infer<typeof NpmsPackageEvaluationSchema>;
export type NpmsPackageInfo = z.infer<typeof NpmsPackageInfoSchema>;
export type NpmsSearchResult = z.infer<typeof NpmsSearchResultSchema>;
export type NpmsSearchResponse = z.infer<typeof NpmsSearchResponseSchema>;
export type NpmsSuggestion = z.infer<typeof NpmsSuggestionSchema>;
