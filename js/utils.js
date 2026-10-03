/* Utilidades de DOM e de formatação de números em pt-BR. */

export const $ = id => document.getElementById(id);

export const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* casas decimais adequadas ao tamanho do valor */
export const casas = v => v === 0 ? 2 : (v < 0.01 ? 4 : (v < 1 ? 3 : 2));
export const dec = (v, d) => v.toLocaleString("pt-BR", {minimumFractionDigits: d, maximumFractionDigits: d});
export const brl = v => "R$ " + dec(v, casas(v));
export const usd = (v, d) => "US$ " + dec(v, d === undefined ? casas(v) : d);
export const int = v => Math.round(v).toLocaleString("pt-BR");

/* lê um campo numérico, com valor padrão e limites */
export function num(id, min, max, pad) {
  let v = parseFloat($(id).value);
  if (!isFinite(v)) v = pad;
  return Math.min(max, Math.max(min, v));
}
export const inteiro = (id, min, max, pad) => Math.round(num(id, min, max, pad));

export const todos = sel => Array.from(document.querySelectorAll(sel));
