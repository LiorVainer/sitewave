import { z } from 'zod';

/** ---------- Core (unchanged or slightly tightened) ---------- */

// If you want to be stricter, you can add .int().nonnegative() on numeric fields.
export const MainPageDataSchema = z.object({
    weeklyDownloads: z.number().int().nonnegative(),
    lastPublish: z.date(),
    githubLink: z.string().optional().default(''), // safer when repo url is missing
});

export const DependencySchema = z.object({
    name: z.string().min(1),
});

export const DependentSchema = z.object({
    name: z.string().min(1),
});

export const VersionSchema = z.object({
    version: z.string().min(1),
    // this is "downloads in last 7 days for that version" (from query-registry),
    // not lifetime; still a nonnegative int
    downloads: z.number().int().nonnegative(),
    published: z.date(),
});

export const NpmPackageSchema = MainPageDataSchema.extend({
    dependencies: z.array(DependencySchema),
    dependents: z.array(DependentSchema),
    versions: z.array(VersionSchema),
});

export type MainPageData = z.infer<typeof MainPageDataSchema>;
export type Dependency = z.infer<typeof DependencySchema>;
export type Dependent = z.infer<typeof DependentSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type NpmPackage = z.infer<typeof NpmPackageSchema>;

/** ---------- Additions for the new route shape ---------- */

// Daily downloads series for graphing last month
export const DailyDownloadSchema = z.object({
    day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD expected'),
    downloads: z.number().int().nonnegative(),
});
export type DailyDownload = z.infer<typeof DailyDownloadSchema>;

// Full API response = core + extras your route now returns
export const NpmPackageResponseSchema = NpmPackageSchema.extend({
    packageName: z.string().min(1),
    dependencyCount: z.number().int().nonnegative(),
    dependentCount: z.number().int().nonnegative(),
    dailyDownloadsLastMonth: z.array(DailyDownloadSchema),
});
export type NpmPackageResponse = z.infer<typeof NpmPackageResponseSchema>;
