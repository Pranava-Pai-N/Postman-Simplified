import fs from 'fs';
import path from 'path';

export const requestInterceptor = (options = { filePath: 'api_history.json' }) => {
    const absolutePath = path.resolve(process.cwd(), options.filePath);
    
    let history = [];
    if (fs.existsSync(absolutePath)) {
        try {
            history = JSON.parse(fs.readFileSync(absolutePath, 'utf-8') || "[]");
        } catch (e) {
            history = [];
        }
    }

    const uniqueKeys = new Map(history.map(req => [`${req.method}:${req.path}`, true]));

    return (req, res, next) => {
        try {
            const key = `${req.method}:${req.path}`;

            if (!uniqueKeys.has(key) || req.method !== 'GET') {
                const details = {
                    method: req.method,
                    path: req.path,
                    headers: req.headers,
                    body: req.method === "GET" ? null : req.body,
                    time: new Date().toISOString()
                };

                history.push(details);
                uniqueKeys.set(key, true);

                fs.writeFileSync(absolutePath, JSON.stringify(history, null, 2));
            }
            
            next();
        } catch (error) {
            console.error("Interceptor failed:", error.message);
            next();
        }
    };
};