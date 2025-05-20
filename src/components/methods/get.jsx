
import {PROTOCOL, HOST, PORT, TOKEN} from "../../global"
import {TASK_OBJECT_KB, TASK_OBJECT_SM} from "../../global"

export const getTaskUsers = async (taskObject, setTaskUsers) =>{
    const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
    const response = await fetch(`${apiUrl}/skills/task_users/?auth_token=${TOKEN}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.ok) {
        const data = await response.json();
        setTaskUsers(data);
    }
}

export const getMistakes = async (setMistakes) =>{
    const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
    const response = await fetch(`${apiUrl}/mistakes/mistakes/?auth_token=${TOKEN}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.ok) {
        const data = await response.json();
        setMistakes(data);
    }
}
