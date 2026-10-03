/* Seções que só dependem dos dados e são montadas uma vez: comparar, uso e método. */
import {AIS, MODELOS, NOTAS, DADOS, PESQUISAS, SHARE, TAREFAS} from "../dados.js";
import {$, esc, dec} from "../utils.js";

/* "As sete mais usadas, lado a lado" */
export function renderIAs() {
  $("ias").innerHTML = AIS.map(a => {
    const ms = MODELOS.filter(m => m.ia === a.id);
    const api = ms.length
      ? '<h4>API, em US$ por milhão de tokens</h4><table><thead><tr><th>Modelo</th><th class="n">Entrada</th><th class="n">Saída</th></tr></thead><tbody>' +
        ms.map(m => "<tr><td>" + esc(m.nome) + '</td><td class="n">' + dec(m.pin, 2) + '</td><td class="n">' + dec(m.pout, 2) + "</td></tr>").join("") + "</tbody></table>"
      : '<h4>API</h4><p>Não é vendido por token.</p>';
    return '<article class="ia"><div><h3>' + esc(a.nome) + '</h3><p class="emp">' + esc(a.emp) + '</p></div>' +
      '<div class="ia-txt"><ul>' + a.pts.map(p => "<li>" + esc(p) + "</li>").join("") + "</ul>" +
      '<p><span class="k">Use quando</span>' + esc(a.quando) + '</p><p><span class="k">Atenção</span>' + esc(a.atencao) + '</p><p><span class="k">Seus dados</span>' + esc(DADOS[a.id]) + "</p></div>" +
      '<div class="ia-preco"><h4>Assinatura</h4><ul>' + a.planos.map(p => "<li>" + esc(p) + "</li>").join("") + "</ul>" + api + "</div></article>";
  }).join("");
}

/* "Quem usa IA no trabalho": números das pesquisas */
export function renderPesquisas() {
  $("stats").innerHTML = PESQUISAS.map(p => '<div><dt class="num">' + esc(p.valor) + "</dt><dd>" + esc(p.texto) + "</dd></div>").join("");
}

/* "Quem usa IA no trabalho": barras de participação */
export function renderShare() {
  $("share").innerHTML = SHARE.map(([nome, v]) =>
    '<div class="sh"><span>' + esc(nome) + '</span><span class="track" title="' + esc(nome) + ": " + dec(v, 2) + '%"><span class="bar" style="width:' + v + '%"></span></span><span class="v">' + dec(v, v < 1 ? 2 : 1) + "%</span></div>"
  ).join("");
}

/* "Método e fontes": matriz de notas */
export function renderMatriz() {
  const t = $("matriz");
  t.querySelector("thead").innerHTML = "<tr><th>Nota de 0 a 5</th>" + TAREFAS.map(x => '<th class="n c">' + esc(x.curto) + "</th>").join("") + "</tr>";
  t.querySelector("tbody").innerHTML = AIS.map(a =>
    "<tr><td><b>" + esc(a.nome) + "</b></td>" + NOTAS[a.id].map(n => '<td class="c" style="--s:' + n + '">' + n + "</td>").join("") + "</tr>"
  ).join("");
}
