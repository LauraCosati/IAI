/* Seção "Qual IA para qual trabalho". */
import {TAREFAS, tarefa} from "../dados.js";
import {ranking, planoSugerido} from "../calculos.js";
import {estado} from "../estado.js";
import {$, esc, dec, brl, todos} from "../utils.js";
import {renderCalc, selecionarModelo} from "./calcular.js";

let tarefaSel = "docs";
let primeira = null; /* primeira escolha exibida, usada pelo botão "Abrir a conta" */

function pontos(n) {
  let h = '<span class="pontos" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>';
  return h + "</span>";
}
const notaTxt = r => pontos(r.base) + dec(r.base, 0) + " de 5" + (r.bonus ? " + " + dec(r.bonus, 1) + " de integração" : "");

function porque(r, tid) {
  const t = (r.a.pq && r.a.pq[tid]) || r.a.geral;
  return (r.bonus ? "Já está dentro dos aplicativos que você usa. " : "") + t;
}

function planoSug(a, orc, s) {
  const p = planoSugerido(a, orc, s);
  return p.nome + (p.reais > 0 ? " · " + brl(p.reais) + " por mês" : "");
}

function custoTxt(r, tid) {
  if (tid === "imagem") return "Imagem é cobrada por imagem gerada, não por token";
  if (!r.ref) return "Só por assinatura, sem preço por token";
  return brl(r.c) + " por prompt típico, pela API (" + r.ref.nome + ")";
}

export function renderTarefas() {
  $("tarefas").innerHTML = TAREFAS.map(t =>
    '<button type="button" class="tarefa" id="t-' + t.id + '" data-t="' + t.id + '" aria-pressed="' + (t.id === tarefaSel) + '"><strong>' + esc(t.nome) + '</strong><span>' + esc(t.ex) + '</span></button>'
  ).join("");
}

export function renderEscolha() {
  const s = estado();
  const eco = document.querySelector('input[name="eco"]:checked').value;
  const orc = parseFloat(document.querySelector('input[name="orc"]:checked').value);
  const r = ranking(tarefaSel, eco, s), top = r[0];
  const podeCalc = tarefaSel !== "imagem" && top.ref;
  primeira = top;
  let h = '<div class="pick1"><span class="tag">Primeira escolha</span><div><h3>' + esc(top.a.nome) + '</h3><p class="emp">' + esc(top.a.emp) + '</p></div>' +
    '<p class="porque">' + esc(porque(top, tarefaSel)) + '</p>' +
    '<dl class="fatos"><div><dt>Nota para a tarefa</dt><dd>' + notaTxt(top) + '</dd></div><div><dt>Plano sugerido</dt><dd>' + esc(planoSug(top.a, orc, s)) + '</dd></div><div><dt>Custo de referência</dt><dd>' + esc(custoTxt(top, tarefaSel)) + '</dd></div></dl>' +
    (podeCalc ? '<button type="button" class="btn" id="ir-calc">Abrir a conta desse prompt</button>' : '') + '</div>';
  h += '<div class="alts"><h4>Também servem</h4>';
  r.slice(1, 4).forEach(x => {
    h += '<div class="alt"><h5>' + esc(x.a.nome) + '<small>' + esc(x.a.emp) + '</small></h5><span class="nota">' + notaTxt(x) + '</span><p>' + esc(porque(x, tarefaSel)) + ' Plano sugerido: ' + esc(planoSug(x.a, orc, s)) + '.</p></div>';
  });
  h += "</div>";
  $("resultado").innerHTML = h;
  $("aviso").hidden = !$("sensivel").checked;
}

/* leva a tarefa e o modelo da primeira escolha para a calculadora */
function abrirConta() {
  const t = tarefa(tarefaSel);
  $("f-preset").value = t.id; $("f-win").value = t.win; $("f-wout").value = t.wout;
  selecionarModelo(primeira.ref.id);
  renderCalc();
  $("calcular").scrollIntoView();
}

export function iniciarEscolher() {
  $("tarefas").addEventListener("click", e => {
    const b = e.target.closest(".tarefa"); if (!b) return;
    tarefaSel = b.getAttribute("data-t");
    todos(".tarefa").forEach(x => x.setAttribute("aria-pressed", x === b));
    renderEscolha();
  });
  $("resultado").addEventListener("click", e => {
    if (e.target.closest("#ir-calc")) abrirConta();
  });
  todos('input[name="eco"],input[name="orc"],#sensivel').forEach(i => i.addEventListener("change", renderEscolha));
}
