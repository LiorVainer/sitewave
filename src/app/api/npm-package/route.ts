import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// query-registry SDK
import {
    getDailyPackageDownloads,
    getPackageDownloads,
    getPackageManifest,
    getPackageVersionsDownloads,
    getPackument,
    type Packument,
} from 'query-registry';

import {
    type Dependency,
    DependencySchema,
    type Dependent,
    DependentSchema,
    type MainPageData,
    MainPageDataSchema,
    type NpmPackage,
    NpmPackageSchema,
    type Version,
    VersionSchema,
} from '@/models/npm-package.model';

/** ==============================
 * Helpers
 * ============================== */
const DEPENDENTS_URL = (pkg: string) => `https://www.npmjs.com/package/${encodeURIComponent(pkg)}?activeTab=dependents`;

const toInt = (n: unknown) => {
    const v = typeof n === 'string' ? parseInt(n.replace(/[,\s]/g, ''), 10) : Number(n);
    return Number.isFinite(v) ? v : 0;
};

/**
 * Parse dependents from the npm website (HTML), since this isn't in the registry API.
 * Returns both the list and a best-effort count (from a "Dependents (N)" heading if present).
 */
async function scrapeDependents(packageName: string): Promise<{ dependents: Dependent[]; dependentCount: number }> {
    try {
        const { data: html } = await axios.get(DEPENDENTS_URL(packageName));
        const $ = cheerio.load(html);

        // Scope strictly to the Dependents tab
        const tab = $('#tabpanel-dependents');

        // 1) Count: e.g., "Dependents (106)" or "106 Dependents"
        const headingText = tab.find('h2, h3').first().text();
        const countMatch = headingText.match(/\(([\d,]+)\)/) || headingText.match(/([\d,]+)\s+Dependents/i);
        const extractedCount = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : 0;

        // 2) Names: list of package links inside the dependents UL
        //    - only take links to packages
        //    - ignore the "and more..." link (usually points to /browse/depended/<pkg>)
        const dependents = tab
            .find('ul.list.pl0 a[href^="/package/"]')
            .map((_, a) => {
                const name = $(a).text().trim();
                return name ? DependentSchema.parse({ name }) : null;
            })
            .get()
            .filter(Boolean) as Dependent[];

        const dependentCount = extractedCount || dependents.length;
        return { dependents, dependentCount };
    } catch {
        return { dependents: [], dependentCount: 0 };
    }
}

/**
 * Build versions[] from the packument (+ optional per-version recent downloads).
 * - `published` is taken from packument's `time[version]`
 * - `downloads` uses getPackageVersionsDownloads() 7-day data if available (else 0)
 */
async function buildVersionsFromPackument(pkg: string, packument: Packument): Promise<Version[]> {
    // Version publish times
    const versionTimes = packument.time ?? {};

    // 7-day per-version downloads (optional; if it errors we still return versions with 0 downloads)
    const versionDownloads: Record<string, number> = {};
    try {
        const versionsDl = await getPackageVersionsDownloads(pkg);
        // versionsDl.downloads: Array<{ version: string; downloads: number }>
        for (const [version, downloads] of Object.entries(versionsDl.downloads) ?? []) {
            versionDownloads[version] = downloads ?? 0;
        }
    } catch {
        // ignore
    }

    const versions: Version[] = Object.keys(packument.versions ?? {})
        .sort((a, b) => {
            const ta = versionTimes[a] ? new Date(versionTimes[a]!).getTime() : 0;
            const tb = versionTimes[b] ? new Date(versionTimes[b]!).getTime() : 0;
            return tb - ta; // newest first
        })
        .map((ver) => {
            const v: Version = VersionSchema.parse({
                version: ver,
                downloads: toInt(versionDownloads[ver] ?? 0), // 7-day downloads (not lifetime)
                published: versionTimes[ver] ? new Date(versionTimes[ver]!) : new Date(0),
            });
            return v;
        });

    return versions;
}

/**
 * Collect dependencies from the latest manifest.
 */
async function getLatestDependencies(
    pkg: string,
    packument: Packument,
): Promise<{
    dependencies: Dependency[];
    dependencyCount: number;
    lastPublish: Date;
}> {
    const latestTag = packument['dist-tags']?.latest;
    const latestManifest = latestTag
        ? await getPackageManifest(pkg, latestTag)
        : // Fallback: pick the newest version key if dist-tags missing
          await (async () => {
              const versions = Object.keys(packument.versions ?? {});
              if (!versions.length) return undefined;
              const newest = versions.sort((a, b) => {
                  const ta = packument.time?.[a] ? new Date(packument.time[a]!).getTime() : 0;
                  const tb = packument.time?.[b] ? new Date(packument.time[b]!).getTime() : 0;
                  return tb - ta;
              })[0];
              return getPackageManifest(pkg, newest);
          })();

    const depsObj = latestManifest?.dependencies ?? {};
    const dependencies = Object.keys(depsObj).map((name) => DependencySchema.parse({ name }));
    const dependencyCount = dependencies.length;

    // lastPublish: prefer packument.time.modified; else latest version time
    let lastPublish = new Date();
    if (packument.time?.modified) lastPublish = new Date(packument.time.modified);
    else if (latestManifest?.version && packument.time?.[latestManifest.version]) {
        lastPublish = new Date(packument.time[latestManifest.version]!);
    }

    return { dependencies, dependencyCount, lastPublish };
}

/**
 * Main fetcher: uses query-registry for downloads + metadata, and HTML only for dependents.
 */
async function fetchPackageInfo(packageName: string) {
    // 1) Packument (metadata: repo, times, versions)
    const packument = await getPackument(packageName);

    // 2) Latest manifest: dependencies + last publish
    const { dependencies, dependencyCount, lastPublish } = await getLatestDependencies(packageName, packument);

    // 3) Repo / GitHub link
    const githubLink =
        packument.repository && typeof packument.repository === 'object' ? (packument.repository.url ?? '') : '';

    // 4) Weekly downloads (total for last-week)
    const weeklyDownloadsResp = await getPackageDownloads(packageName, 'last-week');
    const weeklyDownloads = toInt(weeklyDownloadsResp.downloads);

    // 5) Daily downloads series for last month (for graph)
    const dailySeriesResp = await getDailyPackageDownloads(packageName, 'last-month');
    // dailySeriesResp.downloads: Array<{ day: string (YYYY-MM-DD), downloads: number }>
    const dailyDownloadsLastMonth = dailySeriesResp.downloads ?? [];

    // 6) Versions[] with per-version 7-day downloads + publish dates
    const versions = await buildVersionsFromPackument(packageName, packument);

    // 7) Dependents (HTML)
    const { dependents, dependentCount } = await scrapeDependents(packageName);

    // Compose main page data (validate via Zod)
    const mainData: MainPageData = MainPageDataSchema.parse({
        weeklyDownloads,
        lastPublish,
        githubLink: githubLink || '',
    });

    // Validate arrays
    const validDependencies = dependencies.map((d) => DependencySchema.parse(d));
    const validDependents = dependents.map((d) => DependentSchema.parse(d));
    const validVersions = versions.map((v) => VersionSchema.parse(v));

    // Validate core package structure
    const validatedCore: NpmPackage = NpmPackageSchema.parse({
        ...mainData,
        dependencies: validDependencies,
        dependents: validDependents,
        versions: validVersions,
    });

    // Return augmented payload (safe to add fields on top of the validated core)
    return {
        packageName,
        dependencyCount,
        dependentCount,
        dailyDownloadsLastMonth, // <-- ready for charting
        ...validatedCore,
    };
}

/** ==============================
 * Route handlers
 * ============================== */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const packageName = searchParams.get('packageName');

    if (!packageName || typeof packageName !== 'string') {
        return NextResponse.json({ error: 'Please provide a valid NPM package name.' }, { status: 400 });
    }

    try {
        const data = await fetchPackageInfo(packageName);
        return NextResponse.json(data);
    } catch (error) {
        console.error('GET npm-package error:', error);
        return NextResponse.json({ error: `Failed to fetch data for ${packageName}.` }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { packageName } = body ?? {};

        if (!packageName || typeof packageName !== 'string') {
            return NextResponse.json({ error: 'Please provide a valid NPM package name.' }, { status: 400 });
        }

        const data = await fetchPackageInfo(packageName);
        return NextResponse.json(data);
    } catch (error) {
        console.error('POST npm-package error:', error);
        return NextResponse.json({ error: 'Invalid JSON body or fetch failure.' }, { status: 400 });
    }
}
