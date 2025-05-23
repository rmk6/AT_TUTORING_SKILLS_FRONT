import { Collapse, Typography, Skeleton, message, theme, Space } from "antd";
import { useState, useEffect } from "react";
import { getTaskUsers, getUsers } from "./methods/get";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { useSearchParams, useLocation } from "react-router";
import { TASK_OBJECT_KB } from "../global";

const { useToken } = theme;
const { Title, Text } = Typography;

export const VariantDescription = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { token } = useToken();
  const authToken = searchParams.get("auth_token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        await getUsers(setUserData, authToken);
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Ошибка загрузки данных пользователя");
      } finally {
        setLoading(false);
      }
    };
    if (authToken) {
      fetchUserData();
    } else {
      message.error("Отсутствует auth_token в URL");
      setLoading(false);
    }
  }, [authToken]);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  if (!authToken) {
    return (
      <div style={{ padding: "12px", textAlign: "center" }}>
        <Text type="danger">
          Необходимо указать auth_token в параметрах URL
        </Text>
      </div>
    );
  }

  if (!userData || userData.length === 0) {
    return (
      <div style={{ padding: "12px" }}>
        <Text style={{ fontSize: "0.95em" }}>
          Вариант не назначен или данные отсутствуют
        </Text>
      </div>
    );
  }

  const variant = userData[0]?.variant;

  return (
    <div
      style={{
        padding: "12px 16px",
        marginBottom: "8px",
        marginTop: 0,  
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Title level={4} style={{ marginBottom: 8, marginTop: 0,  fontSize: "1em" }}>
        Вам назначен следующий вариант : "{variant?.name || "Не назначен"}"
      </Title>
      <Text style={{ fontSize: "0.95em" }}>
        {variant?.kb_description || "Описание варианта отсутствует"}
      </Text>
    </div>
  );
};

export const TasksKB = () => {
  const [taskusers, setTaskUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const taskObject = TASK_OBJECT_KB;
  const authToken = searchParams.get("auth_token");
  const variantNumber = location.pathname.split("/").pop() || "1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        debugger;
        await getTaskUsers([taskObject], setTaskUsers, authToken);
        debugger;
      } catch (error) {
        console.error("Error fetching task users:", error);
        message.error("Ошибка загрузки заданий");
      } finally {
        setLoading(false);
      }
    };
    if (authToken) {
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
      <span
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          fontSize: "0.95em",
        }}
      >
        {parts.map((part, index) =>
          index % 2 === 1 ? (
            <strong
              key={index}
              style={{
                display: "inline",
                wordBreak: "break-word",
                hyphens: "auto",
                fontSize: "inherit",
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
    marginBottom: 8,
    background: token.colorFillAlter,
    borderRadius: token.borderRadius,
    border: "none",
    fontSize: "0.95em",
  };

  const getTaskItems = () => {
    return taskusers.map((item, index) => {
      const objectReference = item.task?.object_reference;
      const displayReference =
        typeof objectReference === "string"
          ? objectReference
          : objectReference?.url || objectReference?.href || "";
      return {
        key: index.toString(),
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.95em",
            }}
          >
            {item.is_completed ? (
              <CheckCircleOutlined
                style={{
                  color: token.colorSuccess,
                  fontSize: "0.95em",
                }}
              />
            ) : (
              <ClockCircleOutlined
                style={{
                  color: token.colorTextDisabled,
                  fontSize: "0.95em",
                }}
              />
            )}
            {renderQuotedText(item.task?.task_name)}
            <span
              style={{
                marginLeft: "auto",
                color: token.colorTextSecondary,
                whiteSpace: "nowrap",
                fontSize: "0.95em",
              }}
            >
              Попыток: {item.attempts}
            </span>
          </div>
        ),
        children: (
          <div
            style={{
              padding: "8px 12px",
              fontSize: "0.95em",
            }}
          >
            <p>
              <strong>Описание:</strong>{" "}
              {item.task?.description || "Нет описания"}
            </p>
            {displayReference && (
              <p style={{ marginBottom: 0 }}>
                <strong>Ссылка на материал:</strong>{" "}
                <a
                  href={displayReference}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: "break-all" }}
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
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!authToken) {
    return (
      <div style={{ padding: "12px", textAlign: "center" }}>
        <Text type="danger">
          Необходимо указать auth_token в параметрах URL
        </Text>
      </div>
    );
  }

  if (!taskusers || taskusers.length === 0) {
    return (
      <div
        style={{
          padding: "12px 16px",
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text style={{ fontSize: "0.95em" }}>
          Нет доступных заданий для этого варианта
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px 16px",
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Title level={3} style={{ marginBottom: 8,marginTop: 0,   fontSize: "1em" }}>
        Задания:
      </Title>

      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{
          background: "transparent",
          fontSize: "0.95em",
        }}
        items={getTaskItems()}
      />
    </div>
  );
};

export const VariantKB = () => {
  const { token } = useToken();
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "16px",
      }}
    >
      <Space
        direction="vertical"
        size="small"
        style={{
          width: "100%",
          gap: "12px !important",
        }}
      >
        <VariantDescription />
        <TasksKB />
      </Space>
    </div>
  );
};
