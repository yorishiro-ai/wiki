// Text for the generated MCP reference pages, one entry per locale.

export const labels = {
  en: {
    title: "MCP Tools",
    description: "Tools that Yorishiro exposes to MCP clients.",
    intro: (
      version,
      community,
      enterprise,
    ) => `Use this list to check tool names, inputs, and permissions. For examples of what to ask your assistant, see [Use Yorishiro with your AI assistant](../../guides/using-yorishiro/).

Yorishiro \`${version}\` lists ${community} Community tools and ${enterprise} additional Enterprise tools. Check your MCP client for the tools your server offers. The scope column shows the credential requirement; the description lists additional requirements such as IAM permission, an audit grant, or a licence. See [API keys](../../guides/api-keys/) for choosing and configuring a key.`,
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
    intro: (
      version,
      community,
      enterprise,
    ) => `ツール名、入力項目、必要な権限を確認するための一覧です。アシスタントへの依頼例は[AIアシスタントで使う](../../guides/using-yorishiro/)を参照してください。

Yorishiro \`${version}\` のCommunity共通${community}件とEnterprise専用${enterprise}件を掲載しています。接続先で使えるツールはMCPクライアントで確認してください。スコープ欄にはキーに必要な権限、説明欄にはIAMの許可、監査権限、ライセンスなどの追加条件を記載しています。キーの選び方と設定は[APIキー](../../guides/api-keys/)を参照してください。

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
