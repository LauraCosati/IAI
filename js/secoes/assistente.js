/* Seção "Seu caso é mais específico?": assistente que responde pelo Gemini, por meio do
   proxy em worker/. As calculadoras rodam aqui no navegador quando o modelo pede. */
import {executarFerramenta} from "../contexto-assistente.js";
import {estado, cfgAg, visitante} from "../estado.js";
import {$, esc, todos} from "../utils.js";
import {URL_ASSISTENTE} from "../config.js";

const SUGESTOES = [
  "Preciso revisar um contrato de 80 páginas com dados pessoais. Qual IA usar?",
  "Quanto custa classificar 5.000 e-mails por mês?",
  "Vale montar multiagentes para uma pesquisa de mercado?",
  "Minha equipe usa Microsoft 365. Copilot ou ChatGPT?"
];

const ERROS = {
  rate_limited: "Muitas perguntas em pouco tempo ou limite gratuito do dia atingido. Tente de novo mais tarde.",
  refused: "O assistente não pôde responder a essa pergunta. Tente reformular.",
  empty_completion: "Não veio resposta. Tente uma pergunta mais simples.",
  prompt_too_large: "A conversa ficou longa demais. Recarregue a página e pergunte de novo."
};
const MAX_FERRAMENTAS = 4; /* rodadas de cálculo por pergunta */
const HISTORICO = 8;       /* mensagens anteriores enviadas junto com a pergunta */

/* conversa visível: só perguntas e respostas finais, sem as rodadas de ferramenta */
let conversa = [], ctl = null, ocupado = false;

/* ---------- comunicação com o proxy ---------- */

class ErroAssistente extends Error {
  constructor(code) { super(code); this.code = code; }
}

async function chamarProxy(contents, signal) {
  const s = estado();
  let r;
  try {
    r = await fetch(URL_ASSISTENTE, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents, premissas: {fx: s.fx, iof: s.iof, tpw: s.tpw, off: s.off}, visitante: visitante()}),
      signal
    });
  } catch (e) {
    throw new ErroAssistente(e.name === "AbortError" ? "cancelled" : "upstream_error");
  }
  const dados = await r.json().catch(() => ({}));
  if (dados.erro) throw new ErroAssistente(dados.erro);
  if (!r.ok || !dados.conteudo) throw new ErroAssistente("upstream_error");
  return dados;
}

/* pergunta, executa as ferramentas pedidas e devolve a resposta final em texto */
async function responder(signal) {
  const contents = conversa.slice(-HISTORICO);
  while (contents[0].role !== "user") contents.shift();
  for (let rodada = 0; ; rodada++) {
    const {conteudo, fim} = await chamarProxy(contents, signal);
    const chamadas = conteudo.parts.filter(p => p.functionCall).map(p => p.functionCall);
    if (!chamadas.length || rodada >= MAX_FERRAMENTAS) {
      const texto = conteudo.parts.filter(p => p.text && !p.thought).map(p => p.text).join("").trim();
      if (!texto) throw new ErroAssistente("empty_completion");
      return {texto, cortada: fim === "MAX_TOKENS"};
    }
    contents.push(conteudo);
    const s = estado(), ag = cfgAg(), v = visitante();
    contents.push({role: "user", parts: chamadas.map(c => ({functionResponse: executarFerramenta(c, s, ag, v)}))});
  }
}

/* ---------- interface ---------- */

function bolha(tipo, texto) {
  const d = document.createElement("div");
  d.className = "msg " + tipo; d.textContent = texto;
  $("msgs").appendChild(d);
  return d;
}

function indisponivel() {
  $("ask").hidden = true;
  todos("#sug button").forEach(b => { b.disabled = true; });
  $("q-estado").hidden = false;
  $("q-estado").textContent = "O assistente está fora do ar no momento. O resto da página funciona normalmente.";
}

function emAndamento(sim) {
  ocupado = sim; $("q-enviar").hidden = sim; $("q-parar").hidden = !sim;
  todos("#sug button").forEach(b => { b.disabled = sim; });
}

async function perguntar(texto) {
  texto = String(texto || "").trim();
  if (!URL_ASSISTENTE || ocupado || !texto) return;
  bolha("u", texto); conversa.push({role: "user", parts: [{text: texto}]}); $("q").value = "";
  const b = bolha("a", "Pensando…"); emAndamento(true); ctl = new AbortController();
  try {
    const r = await responder(ctl.signal);
    b.textContent = r.texto + (r.cortada ? "\n\n(Resposta cortada. Peça menos de cada vez.)" : "");
    conversa.push({role: "model", parts: [{text: r.texto}]});
  } catch (e) {
    b.remove();
    conversa.pop(); /* tira a pergunta sem resposta para manter a alternância */
    const cod = e.code || "upstream_error";
    if (cod !== "cancelled") bolha("e", ERROS[cod] || "Falha de conexão. Tente de novo.");
  } finally {
    emAndamento(false);
  }
}

export function iniciarAssistente() {
  $("sug").innerHTML = SUGESTOES.map((t, i) => '<button type="button" id="sug-' + i + '">' + esc(t) + "</button>").join("");
  $("sug").addEventListener("click", e => { const b = e.target.closest("button"); if (b && !b.disabled) perguntar(b.textContent); });
  $("ask").addEventListener("submit", e => { e.preventDefault(); perguntar($("q").value); });
  $("q").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); perguntar($("q").value); } });
  $("q-parar").addEventListener("click", () => { if (ctl) ctl.abort(); });
  if (!URL_ASSISTENTE) { indisponivel(); return; }
  $("q-enviar").disabled = false; $("q-estado").hidden = true;
}
