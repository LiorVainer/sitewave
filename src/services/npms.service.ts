import axios from 'axios';
import type { NpmsPackageInfo, NpmsSearchResponse } from '@/models/npms.model';

class NpmsApiService {
    private baseUrl = '/api/npms';

    async searchPackages(query: string, size: number = 20): Promise<NpmsSearchResponse> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    action: 'search',
                    q: query,
                    size: size.toString(),
                },
            });

            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to search packages');
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw error;
        }
    }

    async getPackageInfo(packageName: string): Promise<NpmsPackageInfo> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    action: 'info',
                    package: packageName,
                },
            });

            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to fetch package info');
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || error.message);
            }
            throw error;
        }
    }
}

export const npmsApiService = new NpmsApiService();
