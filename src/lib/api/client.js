/**
 * Client-side API client. All browser calls go through the Next.js BFF
 * (`/api/backend/*`) so JWTs stay in httpOnly cookies and never reach JS.
 */
export async function clientFetch(path, options = {}) {
    const { body, headers, ...rest } = options;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    try {
        const response = await fetch(`/api/backend${normalized}`, {
            ...rest,
            headers: { "Content-Type": "application/json", ...headers },
            body: body === undefined ? undefined : JSON.stringify(body),
            credentials: "same-origin",
        });
        const payload = (await response.json());
        return { ...payload, status: response.status };
    }
    catch {
        return {
            success: false,
            message: "Unable to reach the server. Please try again.",
            data: undefined,
        };
    }
}
