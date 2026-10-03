/* Seção "Quanto custa um prompt": ranking, cupom e assinatura × API. */
import {TAREFAS, MODELOS, ASSIN, modelo, ia} from "../dados.js";
import {custo, precoPlano} from "../calculos.js";
import {estado} from "../estado.js";
import {$, esc, dec, brl, usd, int} from "../utils.js";

let modeloSel = "g31pro";

export function selecionarModelo(id) { modeloSel = id; }

export function renderPreset() {
  const h = TAREFAS.filter(t => t.id !== "imagem").map(t =>
    '<option value="' + t.id + '">' + esc(t.nome) + " (" + int(t.win) + " palavras de entrada, " + int(t.wout) + " de saída)</option>"
  ).join("");
  $("f-preset").innerHTML = h + '<option value="livre">Personalizado</option>';
  $("f-preset").value = "docs";
}

function renderRanking(s, mes) {
  const linhas = MODELOS.map(m => ({m, c: custo(m, s)})).sort((a, b) => a.c.brl - b.c.brl);
  const max = linhas[linhas.length - 1].c.brl;
  $("rank").querySelector("tbody").innerHTML = linhas.map(({m, c}) => {
    const marca = (c.mult > 1 ? " †" : "") + (c.longo ? " ‡" : "") + (c.fora ? " §" : "");
    return '<tr class="' + (m.id === modeloSel ? "sel" : "") + '"><td><button type="button" class="pick" data-m="' + m.id + '" aria-pressed="' + (m.id === modeloSel) + '">' + esc(m.nome) + marca + '</button> <span class="emp">' + esc(ia(m.ia).emp) + '</span></td>' +
      '<td><span class="pill">' + esc(m.faixa) + '</span></td><td class="n">' + brl(c.brl) + '</td><td class="n">' + brl(c.brl * mes) + '</td>' +
      '<td class="barcell"><span class="track" title="' + esc(m.nome) + ": " + brl(c.brl) + ' por prompt"><span class="bar" style="width:' + (c.brl / max * 100).toFixed(2) + '%"></span></span></td></tr>';
  }).join("");
}

function renderCupom(s, mes) {
  const m = modelo(modeloSel), c = custo(m, s);
  let h = '<h3>IAI? · CUPOM DO PROMPT</h3><p class="sub">' + esc(m.nome) + " · " + esc(ia(m.ia).emp) + "</p><hr>" +
    '<div class="r"><span>ENTRADA ' + int(c.tin) + " tokens × " + usd(c.pin, 2) + "/M</span><span>" + usd(c.uIn, 4) + "</span></div>" +
    '<div class="r"><span>SAÍDA ' + int(c.tout) + " tokens × " + usd(c.pout, 2) + "/M</span><span>" + usd(c.uOut, 4) + "</span></div>" +
    (c.uReq ? '<div class="r"><span>TAXA DE BUSCA por requisição</span><span>' + usd(c.uReq, 4) + "</span></div>" : "") +
    '<hr><div class="r"><span>SUBTOTAL</span><span>' + usd(c.usd, 4) + "</span></div>" +
    '<div class="r"><span>CÂMBIO × R$ ' + dec(s.fx, 2) + "</span><span>R$ " + dec(c.base, 4) + "</span></div>" +
    (s.iof ? '<div class="r"><span>IOF 3,5%</span><span>R$ ' + dec(c.iof, 4) + "</span></div>" : "") +
    '<hr><div class="r tot"><span>POR PROMPT</span><span>' + brl(c.brl) + "</span></div>" +
    '<div class="r tot"><span>× ' + int(mes) + " POR MÊS</span><span>" + brl(c.brl * mes) + "</span></div>";
  const obs = [];
  if (c.mult > 1) obs.push("Tokens multiplicados por 1,3: contagem dos modelos novos da Anthropic.");
  if (c.longo) obs.push("Entrada acima de " + int(m.longAt) + " tokens: vale a tarifa de contexto longo.");
  if (c.fora) obs.push("Tarifa fora do pico, metade da cheia.");
  if (obs.length) h += '<p class="obs">' + esc(obs.join(" ")) + "</p>";
  $("cupom").innerHTML = h;
}

function renderAssinaturas(s, mes) {
  $("assin").querySelector("tbody").innerHTML = ASSIN.map(a => {
    const ref = modelo(a.ref), cp = custo(ref, s).brl, preco = precoPlano(a, s), api = cp * mes;
    const v = api < preco ? "<b>Pagar por uso</b> sai mais barato" : "<b>A assinatura</b> sai mais barata";
    return "<tr><td>" + esc(a.plano) + '</td><td class="n">' + brl(preco) + '</td><td class="n">' + brl(api) + ' <span class="emp">' + esc(ref.nome) + '</span></td><td class="n">' + int(preco / cp) + " prompts</td><td>" + v + "</td></tr>";
  }).join("");
}

export function renderCalc() {
  const s = estado(), mes = s.dia * s.dias;
  $("resumo").textContent = "Seu prompt tem cerca de " + int(s.wIn * s.tpw) + " tokens de entrada e " + int(s.wOut * s.tpw) + " de saída. São " + int(mes) + " prompts por mês.";
  renderRanking(s, mes);
  renderCupom(s, mes);
  renderAssinaturas(s, mes);
}

export function iniciarCalcular() {
  $("rank").addEventListener("click", e => {
    const b = e.target.closest(".pick"); if (!b) return;
    selecionarModelo(b.getAttribute("data-m"));
    renderCalc();
  });
}
