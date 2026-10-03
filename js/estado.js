/* Leitura dos formulários. Converte o que está na tela em objetos de configuração. */
import {$, num, inteiro} from "./utils.js";

/* calculadora de prompt: também fornece câmbio, IOF e horário para as outras seções */
export function estado() {
  return {
    wIn: num("f-win", 1, 300000, 4000), wOut: num("f-wout", 1, 50000, 400),
    dia: num("f-dia", 1, 100000, 20), dias: num("f-dias", 1, 31, 22),
    fx: num("f-fx", 1, 20, 5.10), tpw: num("f-tpw", 1, 3, 1.5),
    iof: $("f-iof").checked, off: $("f-off").checked
  };
}

/* calculadora de multiagentes */
export function cfgAg() {
  return {
    orq: $("m-orq").value, sub: $("m-sub").value,
    n: inteiro("m-n", 1, 50, 3), k: inteiro("m-k", 1, 60, 10), buscas: inteiro("m-buscas", 0, 200, 5),
    mes: inteiro("m-mes", 1, 1000000, 100), cache: $("m-cache").checked,
    base: num("m-base", 100, 200000, 3000), res: num("m-res", 0, 200000, 2500),
    out: num("m-out", 1, 20000, 300), sum: num("m-sum", 1, 50000, 1000),
    m: inteiro("m-turnos", 2, 20, 3), fin: num("m-final", 1, 50000, 1500), pb: num("m-pbusca", 0, 100, 10)
  };
}
