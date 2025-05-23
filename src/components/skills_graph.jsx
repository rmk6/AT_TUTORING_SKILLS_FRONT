import { useSearchParams } from "react-router";
import { PROTOCOL, HOST, PORT } from "../global";

export default function SkillsGraph() {
  const [searchParams] = useSearchParams();
  const authToken = searchParams.get("auth_token");
  const apiUrl = `${PROTOCOL}://${HOST}:${PORT}/api`;
  const graphUrl = `${apiUrl}/skills/users/skills_graph/?auth_token=${authToken}`;
  const legendUrl = `${apiUrl}/skills/users/skills_graph_legend/?auth_token=${authToken}`;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <img
          src={graphUrl}
          style={{ width: "100%", height: "auto", display: "block" }}
          alt="Skills Graph"
        />
      </div>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <img
          src={legendUrl}
          style={{ width: "100%", height: "auto", display: "block" }}
          alt="Skills Legend"
        />
      </div>
    </div>
  );
}
