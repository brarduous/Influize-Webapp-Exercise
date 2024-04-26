import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const api_key = process.env.REACT_APP_API_KEY;

//function to create a new session and retrieve data, including session_id, user_id and and status (e.g. 'initialized')
export async function createSession(flow_id:Number){
    //connect to influize ai api with authorization token
    const response = await axios.post(`${baseURL}v0/flow/session?flow_id=${flow_id}`, null, {
        headers: {
            'accept': 'application/json',
            'Authorization':  'Bearer ' + api_key,
        }
    }).then(function(response){
        return response.data;
    });
    return response;

  
}

//function to retrieve array of active sessions
export async function getActiveSessions(){
    //connect to influize ai api with authorization token
    axios.get(`${baseURL}v0/flow/sessions?is_active=true`, {
        headers: {
            'accept': 'application/json',
            'Authorization':  'Bearer ' + api_key,
        }
    }).then((response)=>{
        console.log(response.data);
        return response.data;
    });
}
//function to retrieve all steps with descriptions for the onboarding process
export async function getAllSteps(session_id:Number){
    //connect to influize ai api with authorization token
    const response = axios.get(`${baseURL}v0/flow/${session_id}/steps`, {
        headers: {
            'accept': 'application/json',
            'Authorization':  'Bearer ' + api_key
        }}).then((response)=>{
            return response.data;
        });
        return response;
    }
//function to retrieve step number for current session in the onboarding process
export async function getCurrentStep(session_id:Number){
    //connect to influize ai api with authorization token
    const response = axios.get(`${baseURL}v0/flow/${session_id}`, {
        headers: {
            'accept': 'application/json',
            'Authorization':  'Bearer ' + api_key,
        }
    }).then((response)=>{
        return response.data;
    });
    return response;
}

//function to progress to the next step in the onboarding process
export async function advanceStep(session_id:Number){
    //connect to influize ai api with authorization token
    const response = axios.post(`${baseURL}v0/flow/${session_id}/step/advance`, null, {
        headers: {
            'accept': 'application/json',
            'Authorization':  'Bearer ' + api_key
        }
    }).then((response)=>{
        return response.data;
    });
    return response;
}

//function to retrieve step data for current session and current step # in the onboarding process
export async function getStep(session_id:Number, step:Number){
    //connect to influize ai api with authorization token
    const response =  axios.get(`${baseURL}v0/flow/${session_id}/${step}`, {
        headers: {
            'accept': 'application/json',
            'Authorization':  'Bearer ' + api_key,
        }
    }).then((response)=>{
        return response.data;
    });
    return response;
}

//function to send step results to the influize ai api
export async function sendStepResults(session_id:Number, step:Number, results:any){
    //connect to influize ai api with authorization token
    const response = axios.put(`${baseURL}v0/flow/${session_id}/${step}`, results, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':  'Bearer ' + api_key
        }
    }).then((response)=>{     
        return response.data;
    });

}