import fs from 'fs';

export const convertToPostman = ( history ) => {
    const cleanedData = deduplicatedHistory(history);

    return {
        info: {
            name: "Postman Simplified | Auto-Generated API Collection",
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item: cleanedData.map(req => ({
            name: `${req.method} ${req.path}`,
            request: {
                method: req.method,
                header: Object.entries(req.headers).map(([key, value]) => ({
                    key: key,
                    value: value
                })),
                url: {
                    raw: `{{baseUrl}}${req.path}`,
                    host: ["{{baseUrl}}"],
                    path: req.path.split('/').filter(p => p)
                },
                body: req.body ? {
                    mode: "raw",
                    raw: JSON.stringify(req.body, null, 2),
                    options: { raw: { language: "json" } }
                } : undefined
            }
        }))
    };
};

const deduplicatedHistory = ( history ) =>{
    const uniqueRequests = new Map();

    history.forEach(req => {
        const key = `${req.method}:${req.path}`;

        if(!uniqueRequests.has(key)){
            uniqueRequests.set(key,req);
        }
        else{
            if(req.body && !uniqueRequests.get(key).body){
                uniqueRequests.set(key,req);
            }
        }
    });
    return Array.from(uniqueRequests.values());
}
