/* Seção "Quanto custa orquestrar multiagentes". */
import {PARES, MOD_AG, modelo, ia} from "../dados.js";
import {rodar, turnosSub, orquestrar, emReais} from "../calculos.js";
import {estado, cfgAg} from "../estado.js";
import {$, esc, dec, brl, usd, int} from "../utils.js";

const vezes = v => v < 10 ? dec(v, 1) + " vezes" : int(v) + " vezes";

export function prepararAg() {
  const h = MOD_AG.map(m => '<option value="' + m.id + '">' + esc(m.nome) + " (" + esc(ia(m.ia).emp) + ")</option>").join("");
  $("m-orq").innerHTML = h; $("m-sub").innerHTML = h;
  $("m-orq").value = "sol"; $("m-sub").value = "luna";
}

function renderCupom(s, c, r) {
  const mo = modelo(c.orq), ms = modelo(c.sub);
  const base = emReais(r.usd, {fx: s.fx, iof: false});
  let h = '<h3>IAI? · CUPOM DA ORQUESTRAÇÃO</h3><p class="sub">1 orquestrador e ' + c.n + " subagente" + (c.n > 1 ? "s" : "") + "</p><hr>" +
    '<div class="r"><span>ORQUESTRADOR ' + esc(mo.nome) + "</span><span>" + usd(r.o.usd, 4) + "</span></div>" +
    '<p class="d">' + r.o.chamadas + " chamadas · " + int(r.o.tin) + " tokens de entrada · " + int(r.o.tout) + " de saída</p>" +
    '<div class="r"><span>' + c.n + " × SUBAGENTE " + esc(ms.nome) + "</span><span>" + usd(c.n * r.sb.usd, 4) + "</span></div>" +
    '<p class="d">' + r.sb.chamadas + " chamadas cada · " + int(r.sb.tin) + " tokens de entrada · " + int(r.sb.tout) + " de saída, por subagente</p>" +
    '<div class="r"><span>BUSCAS ' + int(r.nb) + " × " + usd(c.pb, 2) + "/mil</span><span>" + usd(r.ub, 4) + "</span></div>" +
    '<hr><div class="r"><span>SUBTOTAL</span><span>' + usd(r.usd, 4) + "</span></div>" +
    '<div class="r"><span>CÂMBIO × R$ ' + dec(s.fx, 2) + "</span><span>R$ " + dec(base, 4) + "</span></div>" +
    (s.iof ? '<div class="r"><span>IOF 3,5%</span><span>R$ ' + dec(base * 0.035, 4) + "</span></div>" : "") +
    '<hr><div class="r tot"><span>POR TAREFA</span><span>' + brl(r.brl) + "</span></div>" +
    '<div class="r tot"><span>× ' + int(c.mes) + " POR MÊS</span><span>" + brl(r.brl * c.mes) + "</span></div>";
  const obs = [], tinTotal = r.o.tin + c.n * r.sb.tin, lido = r.o.tcache + c.n * r.sb.tcache;
  if (c.cache) obs.push(dec(lido / tinTotal * 100, 0) + "% da entrada foi lida do cache.");
  if (r.ub > r.usd / 2) obs.push("As buscas respondem por mais da metade do custo.");
  if ((mo.mult || 1) > 1 || (ms.mult || 1) > 1) obs.push("Modelos novos da Anthropic com 30% mais tokens.");
  if (obs.length) h += '<p class="obs">' + esc(obs.join(" ")) + "</p>";
  $("cupom-ag").innerHTML = h;
}

/* prompt simples × agente único × multiagentes, no modelo do orquestrador */
function renderArquiteturas(s, c, r) {
  const mo = modelo(c.orq);
  const simples = rodar(mo, [{novo: c.base, out: c.fin}], s, false);
  const unico = rodar(mo, turnosSub(c, c.fin), s, c.cache), unicoUsd = unico.usd + c.buscas * c.pb / 1000;
  const L = [
    ["Prompt simples", 1, simples.tin + simples.tout, simples.usd],
    ["Agente único, " + c.k + " passos", unico.chamadas, unico.tin + unico.tout, unicoUsd],
    ["Multiagentes, " + c.n + " subagente" + (c.n > 1 ? "s" : ""), r.chamadas, r.tokens, r.usd]
  ];
  $("arq").querySelector("tbody").innerHTML = L.map((x, i) =>
    "<tr><td>" + (i === 2 ? "<b>" + esc(x[0]) + "</b>" : esc(x[0])) + '</td><td class="n">' + int(x[1]) + '</td><td class="n">' + int(x[2]) + '</td><td class="n">' + brl(emReais(x[3], s)) + '</td><td class="n">' + (i === 0 ? "—" : vezes(x[3] / simples.usd)) + "</td></tr>"
  ).join("");
}

function renderFornecedores(s, c) {
  $("forn").querySelector("tbody").innerHTML = PARES.map(p => {
    const x = orquestrar({...c, orq: p[1], sub: p[2]}, s), sel = (c.orq === p[1] && c.sub === p[2]);
    return '<tr class="' + (sel ? "sel" : "") + '"><td><button type="button" class="pick" data-o="' + p[1] + '" data-s="' + p[2] + '" aria-pressed="' + sel + '">' + p[0] + "</button></td><td>" + esc(modelo(p[1]).nome) + "</td><td>" + esc(modelo(p[2]).nome) + '</td><td class="n">' + brl(x.brl) + '</td><td class="n">' + brl(x.brl * c.mes) + "</td></tr>";
  }).join("");
}

export function renderAg() {
  const s = estado(), c = cfgAg(), r = orquestrar(c, s);
  renderCupom(s, c, r);
  renderArquiteturas(s, c, r);
  renderFornecedores(s, c);
}

export function iniciarAgentes() {
  ["m-orq", "m-sub", "m-cache"].forEach(id => $(id).addEventListener("change", renderAg));
  ["m-n", "m-k", "m-buscas", "m-mes", "m-base", "m-res", "m-out", "m-sum", "m-turnos", "m-final", "m-pbusca"]
    .forEach(id => $(id).addEventListener("input", renderAg));
  $("forn").addEventListener("click", e => {
    const b = e.target.closest(".pick"); if (!b) return;
    $("m-orq").value = b.getAttribute("data-o"); $("m-sub").value = b.getAttribute("data-s");
    renderAg();
  });
}
