/* Ponto de entrada: monta as seções e liga os eventos compartilhados. */
import {modelo, tarefa} from "./dados.js";
import {custo, ranking, rodar, orquestrar} from "./calculos.js";
import {estado, cfgAg, visitante} from "./estado.js";
import {$} from "./utils.js";
import {renderTarefas, renderEscolha, iniciarEscolher} from "./secoes/escolher.js";
import {renderPreset, renderCalc, iniciarCalcular} from "./secoes/calcular.js";
import {prepararAg, renderAg, iniciarAgentes} from "./secoes/agentes.js";
import {renderIAs, renderPesquisas, renderShare, renderMatriz} from "./secoes/estaticas.js";
import {iniciarAssistente} from "./secoes/assistente.js";
import {regras} from "./contexto-assistente.js";

/* câmbio, IOF e horário da calculadora valem para todas as seções */
function tudo() { renderCalc(); renderEscolha(); renderAg(); }

function iniciarCalculadoraPrompt() {
  $("f-preset").addEventListener("change", () => {
    const t = tarefa($("f-preset").value);
    if (t) { $("f-win").value = t.win; $("f-wout").value = t.wout; }
    tudo();
  });
  ["f-win", "f-wout"].forEach(id => $(id).addEventListener("input", () => { $("f-preset").value = "livre"; tudo(); }));
  ["f-dia", "f-dias", "f-fx", "f-tpw"].forEach(id => $(id).addEventListener("input", tudo));
  ["f-iof", "f-off"].forEach(id => $(id).addEventListener("change", tudo));
}

renderTarefas(); renderPreset(); renderIAs(); renderPesquisas(); renderShare(); renderMatriz(); prepararAg();
tudo();
iniciarAssistente();
iniciarEscolher();
iniciarCalculadoraPrompt();
iniciarCalcular();
iniciarAgentes();

/* acesso para depuração no console */
window.__iai = {custo, modelo, ranking, rodar, orquestrar, cfgAg, regras: () => regras(estado(), visitante()), estado};
