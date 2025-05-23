import {
  Collapse,
  Typography,
  Skeleton,
  message,
  theme
} from "antd";
import { useState, useEffect } from "react";
import { getTaskUsers } from "./methods/get";
import { CheckCircleOutlined, ClockCircleOutlined, CaretRightOutlined } from "@ant-design/icons";
import { useSearchParams, useLocation } from "react-router";
import { TASK_OBJECT_KB } from "../global";

const { useToken } = theme;
const { Title, Text } = Typography;

export const VariantKB = () => {
  const [taskusers, setTaskUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Получаем параметры из URL
  const taskObject = TASK_OBJECT_KB
  const authToken = searchParams.get("auth_token"); // Добавляем получение auth_token
  const variantNumber = location.pathname.split('/').pop() || '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Передаем auth_token в getTaskUsers
        await getTaskUsers([taskObject], setTaskUsers, authToken);
      } catch (error) {
        console.error("Error fetching task users:", error);
        message.error("Ошибка загрузки заданий");
      } finally {
        setLoading(false);
      }
    };

    if (authToken) { // Проверяем наличие токена перед запросом
      fetchData();
    } else {
      message.error("Отсутствует auth_token в URL");
      setLoading(false);
    }
  }, [taskObject, authToken]);

  const renderQuotedText = (text) => {
    if (!text) return null;
    const parts = text.split(/"([^"]*)"/);
    return (
      <span style={{ 
        whiteSpace: "normal", 
        wordWrap: "break-word",
        fontSize: "0.9em"
      }}>
        {parts.map((part, index) =>
          index % 2 === 1 ? (
            <strong
              key={index}
              style={{
                display: "inline",
                wordBreak: "break-word",
                hyphens: "auto",
                fontSize: "inherit"
              }}
            >
              "{part}"
            </strong>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  const panelStyle = {
    marginBottom: 12,
    background: token?.colorFillAlter || '#fafafa',
    borderRadius: token?.borderRadiusLG || 8,
    border: "none",
    fontSize: token?.fontSizeLG || 14,
  };

  const getTaskItems = () => {
    return taskusers.map((item, index) => {
      const objectReference = item.task?.object_reference;
      const displayReference = typeof objectReference === 'string' 
        ? objectReference 
        : objectReference?.url || objectReference?.href || '';

      return {
        key: index.toString(),
        label: (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8,
            fontSize: "0.9em"
          }}>
            {item.is_completed ? (
              <CheckCircleOutlined style={{ 
                color: "#52c41a",
                fontSize: "0.9em"
              }} />
            ) : (
              <ClockCircleOutlined style={{ 
                color: "#d9d9d9",
                fontSize: "0.9em"
              }} />
            )}
            {renderQuotedText(item.task?.task_name)}
            <span style={{ 
              marginLeft: "auto", 
              color: token?.colorTextSecondary || '#888',
              whiteSpace: "nowrap",
              fontSize: "0.9em"
            }}>
              Попыток: {item.attempts}
            </span>
          </div>
        ),
        children: (
          <div style={{ 
            padding: "8px 16px",
            fontSize: "0.9em"
          }}>
            <p><strong>Описание:</strong> {item.task?.description || 'Нет описания'}</p>
            {displayReference && (
              <p>
                <strong>Ссылка на материал:</strong>{" "}
                <a 
                  href={displayReference} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {displayReference}
                </a>
              </p>
            )}
          </div>
        ),
        style: panelStyle,
      };
    });
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  if (!authToken) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Text type="danger">Необходимо указать auth_token в параметрах URL</Text>
      </div>
    );
  }

  if (!taskusers || taskusers.length === 0) {
    return (
      <div style={{ padding: "16px" }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Вариант {variantNumber}
        </Title>
        <Text style={{ fontSize: "0.9em" }}>
          Нет доступных заданий для этого варианта
        </Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Вариант {variantNumber}
      </Title>
      
      <Text style={{ 
        display: 'block', 
        marginBottom: 24,
        fontSize: "0.9em"
      }}>
        Здесь находится описание заданий варианта. Выполните все задания последовательно.
      </Text>

      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ 
          background: token?.colorBgContainer || '#fff',
          fontSize: "0.9em"
        }}
        items={getTaskItems()}
      />
    </div>
  );
};