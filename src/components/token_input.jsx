import { Form, Input, Button } from "antd";
import { useNavigate, useSearchParams } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const login = () => {
    const token = form.getFieldValue("auth_token");
    if (token) {
      searchParams.set("auth_token", token);
      navigate(`/tasks?${searchParams.toString()}`);
    }
  };

  return (
    <Form form={form} layout="inline">
      <Form.Item
        label="Ключ доступа"
        name="auth_token"
        rules={[{ required: true, message: "Укажите ключ доступа" }]}
      >
        <Input placeholder="Введите ключ доступа" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={login}>
          Обновить
        </Button>
      </Form.Item>
    </Form>
  );
}
