import { Button, Form, Input, InputNumber, Table, Skeleton, Tabs } from "antd";
import { useState, useEffect } from "react";
import { getTaskUsers, getMistakes } from "./methods/get";
import { TASK_OBJECT_KB, TASK_OBJECT_SM } from "../global";

const Tasks = () => {
    const [taskusers, setTaskUsers] = useState();
    // def useState () -> [taskusers, setTaskUsers]

    useEffect(() => {
        setTimeout(() => getTaskUsers(TASK_OBJECT_KB, setTaskUsers), 10000);
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "task",
            render: (task) => task.task_name,
        },
        {
            title: "Desc",
            dataIndex: "task",
            key: "task",
            render: (task) => task.description,
        },
    ];

    if (taskusers) {
        return <Table dataSource={taskusers} columns={columns} />;
    } else {
        return <Skeleton active />;
    }
};

const Mistakes = () => {
    const [mistakes, setMistakes] = useState();
    // def useState () -> [taskusers, setTaskUsers]

    useEffect(() => {
        getMistakes(setMistakes);
    }, []);

    const mistakeTypeLabels = {
        1: 'Синтаксическая ошибка',
        2: 'Логическая ошибка',
        3: 'Лексическая ошибка',
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "task",
            key: "task",
            render: (task) => task.name,
        },
        {
            title: "tip",
            dataIndex: "tip",
            key: "tip",
        },
    ];  

    const items = (mistakes || []).map((mistake) => ({
        key: mistake.id.toString(),
        label: mistakeTypeLabels[mistake.mistake_type],
        children: <p>{"text"}</p>,
    }));

    if (mistakes) {
        return <Table dataSource={mistakes} columns={columns} />;
    } else {
        return <Skeleton active />;
    }
};

export const Window = () => {
    const items = [
        {
            key: "1",
            label: "Задания",
            children: <Tasks />,
        },
        {
            key: "2",
            label: "Ошибки",
            children: <Mistakes />,
        },
    ];
    return <Tabs defaultActiveKey="1" items={items} />;
};
