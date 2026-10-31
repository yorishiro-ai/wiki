// Text for the generated MCP reference pages, one entry per locale.

export const labels = {
  en: {
    title: "MCP Tools",
    description: "Tools that Yorishiro exposes to MCP clients.",
    intro: `Yorishiro serves the Model Context Protocol over Streamable HTTP at \`/mcp\`. Send your API key in the \`Authorization: Bearer <api-key>\` header.

Content scopes are cumulative: \`read\` < \`write\` < \`schema\` < \`migration\`. The independent \`audit\` grant is not part of that ladder. Scope alone does not authorize an operation: tenant/workspace roles, resource access, credential binding and licence requirements still apply. See [Access management](../../guides/access-management/) and [API keys](../../guides/api-keys/).

For a restricted listener behind another hostname, configure \`YORISHIRO_MCP_ALLOWED_HOSTS\`. Wildcard listeners accept any MCP Host. Browser origins are configured separately. See [Configuration](../../configuration/).

Start with \`whoami\`, \`discover_workspaces\` and \`capabilities\` to inspect the current context. Capability \`scope_satisfied\` and \`grants_satisfied\` flags describe credential requirements only; they do not guarantee role, resource or licence authorization. Inspect JSON-RPC errors and tool-result \`isError\` even when HTTP status is 200.

This reference follows product \`develop\` at PR #598 (merge \`a598d46\`): 88 tools, comprising 67 Community and 21 Enterprise tools. Runtime tool discovery remains authoritative; older releases may offer fewer tools. Management MCP coverage does not include all REST operations. See [Management boundaries](../../guides/access-management/#management-boundaries).`,
    tools: "Tools",
    overview: ["Tool", "Edition", "Scope", "Purpose"],
    community: "Community tools",
    editions: ["Community", "Enterprise"],
    enterprise: "Enterprise tools",
    enterpriseNote: "These tools are available in the Enterprise edition only.",
    params: ["Parameter", "Type", "Required", "Description"],
    yes: "Yes",
    no: "No",
    scope: "Required scope",
    noParams: "This tool takes no parameters.",
    note: "",
  },
  ja: {
    title: "MCPツール",
    description: "YorishiroがMCPクライアントに公開するツールの一覧です。",
    intro: `YorishiroはModel Context ProtocolをStreamable HTTPで \`/mcp\` に公開します。APIキーは \`Authorization: Bearer <api-key>\` ヘッダーで送ります。

コンテンツのスコープは \`read\`、\`write\`、\`schema\`、\`migration\` の順に高くなります。独立した \`audit\` grantはこの順序に含まれません。スコープだけでは操作は許可されず、テナントとワークスペースの役割、対象へのアクセス、キーの対象範囲、ライセンスの条件も適用されます。[アクセス管理](../../guides/access-management/)と[APIキー](../../guides/api-keys/)を参照してください。

限定した待受アドレスを別のホスト名経由で使う場合は、\`YORISHIRO_MCP_ALLOWED_HOSTS\` を設定します。ワイルドカードで待ち受ける場合は任意のMCP Hostを受け付けます。ブラウザーの接続元は別の設定です。詳しくは[設定](../../configuration/)を参照してください。

最初に \`whoami\`、\`discover_workspaces\`、\`capabilities\` で現在の接続先と権限を確認します。capabilitiesの \`scope_satisfied\` と \`grants_satisfied\` はキーの要件を満たすかどうかだけを示し、役割、対象へのアクセス、ライセンスによる許可を保証しません。HTTPステータスが200でも、JSON-RPCエラーとツールの戻り値の \`isError\` を確認してください。

このリファレンスはPR #598のマージ時点（\`a598d46\`）のproduct \`develop\` に対応し、Community 67、Enterprise 21の計88ツールを掲載しています。実際の提供ツールは接続先から取得してください。古いリリースでは使えるツールが少ない場合があります。管理MCPがすべてのREST操作に対応するわけではありません。[管理操作の境界](../../guides/access-management/#管理操作の境界)を参照してください。

ツールとパラメーターの説明は、サーバーが返す英語のまま掲載しています。`,
    tools: "ツール",
    overview: ["ツール", "エディション", "スコープ", "用途"],
    community: "Communityのツール",
    editions: ["Community", "Enterprise"],
    enterprise: "Enterpriseのツール",
    enterpriseNote: "これらのツールはEnterprise版でのみ使えます。",
    params: ["パラメーター", "型", "必須", "説明"],
    yes: "はい",
    no: "いいえ",
    scope: "必要なスコープ",
    noParams: "このツールにパラメーターはありません。",
    note: "",
  },
};
