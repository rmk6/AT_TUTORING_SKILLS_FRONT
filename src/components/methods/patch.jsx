
import {PROTOCOL, HOST, PORT, TOKEN} from "../../global"

export const updateMistakeTipStatus = async (mistakeId) => {
  try {
    const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
    const response = await fetch(`${apiUrl}/mistakes/mistakes/${mistakeId}/?auth_token=${TOKEN}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_tip_shown: true })
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при обновлении статуса подсказки');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при обновлении ошибки:', error);
    throw error;
  }
};