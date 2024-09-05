export class HttpClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request(method: string, endpoint: string, body?: any, headers: Record<string, string> = {}): Promise<any> {
        const url = `${this.baseUrl}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, ${error}`);
            }
            return await response.json();
        } catch (error) {
            console.error('HTTP request failed:', error);
            throw error;
        }
    }

    // GET 请求
    async get(endpoint: string, headers: Record<string, string> = {}): Promise<any> {
        return this.request('GET', endpoint, undefined, headers);
    }

    // POST 请求
    async post(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<any> {
        return this.request('POST', endpoint, body, headers);
    }

    // PUT 请求
    async put(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<any> {
        return this.request('PUT', endpoint, body, headers);
    }

    // DELETE 请求
    async delete(endpoint: string, headers: Record<string, string> = {}): Promise<any> {
        return this.request('DELETE', endpoint, undefined, headers);
    }
}