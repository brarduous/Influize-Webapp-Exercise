

const api_key = process.env.API_KEY;

export function createSession(flow_id:Number){
    var session_data = fetch(`https://mvp-api.influize.io/v0/flow/session?flow_id=${flow_id}`, {
        method:'POST',
        headers: {
            'accept': 'application/json',
            'Authorization':  `Bearer ${api_key}`
        }
    });
    return session_data;
}