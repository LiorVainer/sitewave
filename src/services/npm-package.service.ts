import axios from 'axios';
import type { NpmPackageResponse } from '@/models/npm-package.model';

class NpmPackageService {
    private baseUrl = '/api/npm-package';

    async getPackage(packageName: string): Promise<NpmPackageResponse> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: { packageName },
            });

            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to fetch package data');
            }

            // Convert date strings back to Date objects
            const data = response.data;
            return {
                ...data,
                lastPublish: new Date(data.lastPublish),
                versions: data.versions.map((version: any) => ({
                    ...version,
                    published: new Date(version.published),
                })),
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw error;
        }
    }
}

export const npmPackageService = new NpmPackageService();
