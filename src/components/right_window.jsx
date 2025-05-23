import {
  Collapse,
  theme,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Table,
  Skeleton,
  Tabs,
  List,
  Card,
  message,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import { getTaskUsers, getMistakes } from "./methods/get";
import { updateMistakeTipStatus } from "./methods/patch";
import { TASK_OBJECT_KB, TASK_OBJECT_SM } from "../global";
import {
  ClockCircleOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useMatches, useNavigate, useSearchParams } from "react-router";
import SkillsGraph from "./skills_graph";
// import { ClockCircleOutlined, CheckCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
const { useToken } = theme;

export const TasksList = () => {
  const [taskusers, setTaskUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const [searchParams] = useSearchParams();
  const taskObject = searchParams.get("task_object");
  const auth_token = searchParams.get("auth_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTaskUsers([taskObject], setTaskUsers, auth_token);
      } catch (error) {
        console.error("Error fetching task users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderQuotedText = (text) => {
    const parts = text.split(/"([^"]*)"/);
    return (
      <span
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          fontSize: "0.9em", // Уменьшаем размер текста
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
                fontSize: "inherit", // Наследуем уменьшенный размер
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
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
    fontSize: token.fontSizeLG, // Убрали +2, чтобы сделать текст меньше
  };

  const getTaskItems = () => {
    return taskusers.map((item, index) => ({
      key: index.toString(),
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {item.is_completed ? (
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
          ) : (
            <ClockCircleOutlined style={{ color: "#d9d9d9" }} /> // Серая иконка часов
          )}
          {renderQuotedText(item.task.task_name)}
          <span
            style={{
              marginLeft: "auto",
              color: token.colorTextSecondary,
              whiteSpace: "nowrap",
            }}
          >
            Попыток: {item.attempts}
          </span>
        </div>
      ),
      children: (
        <div style={{ padding: "8px 16px" }}>
          <p>
            <strong>Описание:</strong> {item.task.description}
          </p>
        </div>
      ),
      style: panelStyle,
    }));
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  if (!taskusers || taskusers.length === 0) {
    return <div style={{ fontSize: "0.9em" }}>Нет доступных заданий</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{
          background: token.colorBgContainer,
          fontSize: "0.9em", // Уменьшаем базовый размер для Collapse
        }}
        items={getTaskItems()}
      />
    </div>
  );
};

// Функция для преобразования типа ошибки в текст
const getMistakeTypeText = (type) => {
  switch (type) {
    case 1:
      return "синтаксическая";
    case 2:
      return "логическая";
    case 3:
      return "лексическая";
    default:
      return `неизвестный тип (${type})`;
  }
};

export const MistakesList = () => {
  const [mistakes, setMistakes] = useState([]);
  const [taskUsers, setTaskUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);
  const { token } = useToken();

  const [searchParams] = useSearchParams();

  const task = searchParams.get("task_id__in");
  const auth_token = searchParams.get("auth_token");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        debugger;
        await Promise.all([
          getMistakes(task, setMistakes, auth_token),
          getTaskUsers(TASK_OBJECT_KB, setTaskUsers, auth_token),
        ]);
        debugger;
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [task]);

  const isTaskCompleted = (mistakeTaskId) => {
    const taskUser = taskUsers.find((tu) => tu.task.id === mistakeTaskId);
    return taskUser?.is_completed || false;
  };

  const handleToggleMistake = async (mistakeId) => {
    try {
      setLoadingId(mistakeId);
      const mistake = mistakes.find((m) => m.id === mistakeId);

      if (!mistake.is_tip_shown) {
        await updateMistakeTipStatus(mistakeId);
        setMistakes((prev) =>
          prev.map((m) =>
            m.id === mistakeId ? { ...m, is_tip_shown: true } : m
          )
        );
      }

      setActiveKeys((prevKeys) =>
        prevKeys.includes(mistakeId.toString())
          ? prevKeys.filter((key) => key !== mistakeId.toString())
          : [...prevKeys, mistakeId.toString()]
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const panelStyle = {
    marginBottom: 12,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
    fontSize: token.fontSizeLG + 2,
  };

  const getMistakeItems = () => {
    // Сортируем ошибки: сначала невыполненные (красные), затем выполненные (зеленые)
    const sortedMistakes = [...mistakes].sort((a, b) => {
      const aCompleted = isTaskCompleted(a.task.id);
      const bCompleted = isTaskCompleted(b.task.id);
      return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
    });

    return sortedMistakes.map((mistake) => {
      const isActive = activeKeys.includes(mistake.id.toString());
      const completed = isTaskCompleted(mistake.task.id);
      const mistakeTypeText = getMistakeTypeText(mistake.mistake_type);

      return {
        key: mistake.id.toString(),
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {completed ? (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
            )}
            {`Ошибка: ${mistake.task.task_name}`}
          </div>
        ),
        children: (
          <div style={{ padding: "8px 16px" }}>
            <p>
              <strong>Подсказка:</strong> {mistake.tip}
            </p>
            <p>
              <strong>Тип ошибки:</strong> {mistakeTypeText}
            </p>
            <p>
              <strong>Штрафные баллы:</strong> {mistake.fine}
            </p>
          </div>
        ),
        extra: (
          <Button
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMistake(mistake.id);
            }}
            loading={loadingId === mistake.id}
          >
            {isActive ? "Скрыть" : "Показать"}
          </Button>
        ),
        style: panelStyle,
        showArrow: false,
      };
    });
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (mistakes.length === 0) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        Нет данных об ошибках
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <Collapse
        bordered={false}
        activeKey={activeKeys}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ background: token.colorBgContainer }}
        items={getMistakeItems()}
        onChange={(keys) => setActiveKeys(keys)}
      />
    </div>
  );
};
export const Window = () => {
  const matches = useMatches();
  const pathname = (matches[0]?.pathname || "tasks").replace("/", "");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const items = [
    {
      key: "tasks",
      label: "Задания",
      children: <TasksList />,
    },
    {
      key: "mistakes",
      label: "Ошибки",
      children: <MistakesList />,
    },
    {
      key: "skills",
      label: "Текущая модель обучаемого",
      children: <SkillsGraph />,
    }
  ];
  debugger;

  useEffect(() => {
    if (!searchParams.has("auth_token")) {
      navigate("/");
    }
  }, []);

  return (
    <Tabs
      onTabClick={(activeKey) => {
        navigate(`/${activeKey}?${searchParams.toString()}`);
      }}
      defaultActiveKey={pathname}
      items={items}
    />
  );
};
