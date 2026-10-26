// Text for the generated MCP reference pages, one entry per locale.

export const labels = {
  en: {
    title: "MCP Tools",
    description: "Tools that Yorishiro exposes to MCP clients.",
    intro: `Yorishiro serves the Model Context Protocol over Streamable HTTP at \`/mcp\`. Send your API key in the \`Authorization: Bearer <api-key>\` header.

Every tool needs an API key with a minimum scope. Scopes are cumulative: \`read\` < \`write\` < \`schema\` < \`migration\`. A key with a higher scope can call every tool that needs a lower one. A call without enough scope returns a tool error, not a protocol error.

If your clients reach the server through a hostname other than \`localhost\`, add that hostname to \`YORISHIRO_MCP_ALLOWED_HOSTS\` (comma-separated). See [Configuration](../../configuration/).

Your MCP client lists the tools your server actually offers. This page lists the tools in the current release.`,
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

どのツールにも呼び出しに必要な最小のスコープがあります。スコープは \`read\`、\`write\`、\`schema\`、\`migration\` の順に高くなり、高いスコープのキーは低いスコープのツールもすべて呼び出せます。スコープが足りない場合は、プロトコルエラーではなくツールのエラーが返ります。

\`localhost\` 以外のホスト名でサーバーにアクセスするクライアントがある場合は、そのホスト名を \`YORISHIRO_MCP_ALLOWED_HOSTS\` にカンマ区切りで追加します。詳しくは[設定](../../configuration/)を参照してください。

実際に使えるツールは、MCPクライアントが一覧で取得できます。このページには現在のリリースのツールを載せています。

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
