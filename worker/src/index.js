/* Proxy do assistente do IAI? (Cloudflare Worker).
   Recebe a conversa do site, acrescenta as instruções e as ferramentas e chama o Gemini.
   A chave fica no segredo GEMINI_API_KEY e nunca chega ao navegador. */
import {regras, FERRAMENTAS, PACOTES} from "../../js/contexto-assistente.js";
import {TAREFAS} from "../../js/dados.js";

const LIMITE_CORPO = 60000;    /* bytes por requisição */
const LIMITE_TURNOS = 30;      /* mensagens na conversa, contando as de ferramenta */
const LIMITE_TEXTO = 4000;     /* caracteres por trecho de texto */
const NOMES = FERRAMENTAS.map(f => f.name);

function cabecalhos(origem) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origem,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

const resposta = (corpo, status, origem) => new Response(JSON.stringify(corpo), {status, headers: cabecalhos(origem)});

const faixa = (v, min, max, pad) => {
  const n = Number(v);
  return isFinite(n) ? Math.min(max, Math.max(min, n)) : pad;
};

/* mantém só os campos que o Gemini espera, com tamanhos limitados */
function limparParte(p) {
  if (!p || typeof p !== "object") return null;
  const o = {};
  if (typeof p.text === "string") o.text = p.text.slice(0, LIMITE_TEXTO);
  if (p.functionCall && NOMES.includes(p.functionCall.name)) {
    o.functionCall = {name: p.functionCall.name, args: p.functionCall.args || {}};
  }
  if (p.functionResponse && NOMES.includes(p.functionResponse.name)) {
    o.functionResponse = {name: p.functionResponse.name, response: p.functionResponse.response || {}};
  }
  if (typeof p.thoughtSignature === "string") o.thoughtSignature = p.thoughtSignature;
  if (p.thought === true) o.thought = true;
  return Object.keys(o).length ? o : null;
}

function limparConversa(contents) {
  if (!Array.isArray(contents) || !contents.length || contents.length > LIMITE_TURNOS) return null;
  const limpa = [];
  for (const c of contents) {
    if (!c || (c.role !== "user" && c.role !== "model") || !Array.isArray(c.parts)) return null;
    const parts = c.parts.slice(0, 8).map(limparParte).filter(Boolean);
    if (!parts.length) return null;
    limpa.push({role: c.role, parts});
  }
  if (limpa[0].role !== "user" || limpa[limpa.length - 1].role !== "user") return null;
  return limpa;
}

export default {
  async fetch(req, env) {
    const origem = req.headers.get("Origin") || "";
    const permitidas = (env.ORIGENS || "").split(",").map(s => s.trim()).filter(Boolean);
    if (!permitidas.includes(origem)) return resposta({erro: "origem_nao_permitida"}, 403, "null");
    if (req.method === "OPTIONS") return new Response(null, {status: 204, headers: cabecalhos(origem)});
    if (new URL(req.url).pathname !== "/chat") return resposta({erro: "nao_encontrado"}, 404, origem);
    if (req.method !== "POST") return resposta({erro: "metodo"}, 405, origem);

    if (env.LIMITE) {
      const {success} = await env.LIMITE.limit({key: req.headers.get("CF-Connecting-IP") || "anon"});
      if (!success) return resposta({erro: "rate_limited"}, 429, origem);
    }

    const bruto = await req.text();
    if (bruto.length > LIMITE_CORPO) return resposta({erro: "prompt_too_large"}, 413, origem);
    let corpo;
    try { corpo = JSON.parse(bruto); } catch { return resposta({erro: "requisicao_invalida"}, 400, origem); }
    const contents = limparConversa(corpo.contents);
    if (!contents) return resposta({erro: "requisicao_invalida"}, 400, origem);
    const p = corpo.premissas || {};
    const premissas = {fx: faixa(p.fx, 1, 20, 5.10), iof: p.iof !== false, tpw: faixa(p.tpw, 1, 3, 1.5), off: p.off !== false};
    const v = corpo.visitante || {};
    const visitante = {
      tarefa: TAREFAS.some(t => t.id === v.tarefa) ? v.tarefa : "docs",
      pacote: Object.hasOwn(PACOTES, v.pacote) ? v.pacote : "nenhum",
      orcamento: faixa(v.orcamento, 0, 100000, 130),
      sensivel: v.sensivel === true
    };

    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(env.GEMINI_MODEL || "gemini-flash-latest") + ":generateContent";
    let r;
    try {
      r = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY},
        body: JSON.stringify({
          systemInstruction: {parts: [{text: regras(premissas, visitante)}]},
          contents,
          tools: [{functionDeclarations: FERRAMENTAS}],
          generationConfig: {maxOutputTokens: 4096}
        })
      });
    } catch {
      return resposta({erro: "upstream_error"}, 502, origem);
    }
    if (r.status === 429) return resposta({erro: "rate_limited"}, 429, origem);
    if (!r.ok) {
      console.log("Gemini", r.status, (await r.text()).slice(0, 500));
      return resposta({erro: "upstream_error"}, 502, origem);
    }

    const dados = await r.json();
    if (dados.promptFeedback && dados.promptFeedback.blockReason) return resposta({erro: "refused"}, 200, origem);
    const cand = (dados.candidates || [])[0];
    if (!cand || !cand.content || !Array.isArray(cand.content.parts)) {
      const fim = cand && cand.finishReason;
      return resposta({erro: fim && fim !== "STOP" && fim !== "MAX_TOKENS" ? "refused" : "empty_completion"}, 200, origem);
    }
    return resposta({conteudo: {role: "model", parts: cand.content.parts}, fim: cand.finishReason || "STOP"}, 200, origem);
  }
};
