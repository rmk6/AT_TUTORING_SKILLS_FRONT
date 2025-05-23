import { PROTOCOL, HOST, PORT, TOKEN } from "../../global";
import { TASK_OBJECT_KB, TASK_OBJECT_SM } from "../../global";

export const getTaskUsers = async (taskObjects, setTaskUsers, auth_token) => {
  const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
  const url = `${apiUrl}/skills/task_users/?auth_token=${auth_token}${
    taskObjects.length > 0
      ? `&task__task_object__in=${taskObjects.join(",")}`
      : ""
  }`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    setTaskUsers(data);
  }
};

export const getMistakes = async (task, setMistakes,auth_token) => {
  const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
//   debugger;
  const url =  `${apiUrl}/mistakes/mistakes/?auth_token=${auth_token}${
    task
      ? `&task_id__in=${task}`
      : ""
  }`;
  const response = await fetch(
    url,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Не удалось загрузить список ошибок");
  }
  const data = await response.json();
  debugger;
  setMistakes(data);
};
