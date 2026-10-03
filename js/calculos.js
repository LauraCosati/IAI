/* Regras de cálculo. Funções puras: recebem dados e configuração, não tocam no DOM. */
import {TAREFAS, ECO_TAREFAS, AIS, NOTAS, CACHE, modelo} from "./dados.js";

/* ---------- prompt ---------- */

/* custo de um prompt em um modelo */
export function custo(m, s) {
  const mult = m.mult || 1;
  const tin = s.wIn * s.tpw * mult, tout = s.wOut * s.tpw * mult;
  let pin = m.pin, pout = m.pout, longo = false, fora = false;
  if (m.offIn && s.off) { pin = m.offIn; pout = m.offOut; fora = true; }
  if (m.longAt && tin > m.longAt) { pin = m.pinL; pout = m.poutL; longo = true; }
  const uIn = tin * pin / 1e6, uOut = tout * pout / 1e6, uReq = m.req || 0;
  const total = uIn + uOut + uReq, base = total * s.fx, iof = s.iof ? base * 0.035 : 0;
  return {tin, tout, pin, pout, uIn, uOut, uReq, usd: total, base, iof, brl: base + iof, longo, fora, mult};
}

export const precoPlano = (p, s) => p.brl !== undefined ? p.brl : p.usd * s.fx * (s.iof ? 1.035 : 1);

export const emReais = (u, s) => u * s.fx * (s.iof ? 1.035 : 1);

/* plano mais completo de uma IA que cabe no orçamento mensal, em reais */
export function planoSugerido(a, orc, s) {
  let best = a.ind[0];
  a.ind.forEach(p => { const v = precoPlano(p, s); if (v <= orc && v >= precoPlano(best, s)) best = p; });
  return {nome: best.n, reais: precoPlano(best, s)};
}

/* ---------- recomendação ---------- */

/* ordena as IAs pela nota na tarefa; empate se resolve pelo menor custo */
export function ranking(tid, eco, s) {
  const t = TAREFAS.find(x => x.id === tid);
  const idx = TAREFAS.indexOf(t);
  const sT = {wIn: t.win || 1, wOut: t.wout || 1, tpw: s.tpw, fx: s.fx, iof: s.iof, off: s.off};
  return AIS.map(a => {
    let bonus = 0;
    if (ECO_TAREFAS.includes(tid) && ((eco === "microsoft" && a.id === "copilot") || (eco === "google" && a.id === "gemini"))) bonus = 1.5;
    const ref = modelo(tid === "volume" ? a.eco : a.ref);
    const c = (ref && tid !== "imagem") ? custo(ref, sT).brl : null;
    return {a, base: NOTAS[a.id][idx], bonus, nota: NOTAS[a.id][idx] + bonus, ref, c};
  }).sort((x, y) => {
    if (y.nota !== x.nota) return y.nota - x.nota;
    return (x.c === null ? Infinity : x.c) - (y.c === null ? Infinity : y.c);
  });
}

/* ---------- multiagentes ---------- */

/* roda um agente: cada turno relê o contexto anterior, a saída anterior e o conteúdo novo */
export function rodar(m, turnos, s, cache) {
  const mult = m.mult || 1, k = CACHE[m.id];
  let ctxPrev = 0, outPrev = 0, tin = 0, tout = 0, tcache = 0, total = 0;
  turnos.forEach(t => {
    const lido = ctxPrev * mult, novo = (outPrev + t.novo) * mult, ctx = lido + novo, o = t.out * mult;
    let pin = m.pin, pout = m.pout, cr = k ? k.cr : null;
    if (m.offIn && s.off) { pin = m.offIn; pout = m.offOut; if (k && k.crOff) cr = k.crOff; }
    if (m.longAt && ctx > m.longAt) { pin = m.pinL; pout = m.poutL; if (k && k.crL) cr = k.crL; }
    if (cache && k) { total += lido * cr / 1e6 + novo * pin * k.cw / 1e6; tcache += lido; }
    else total += ctx * pin / 1e6;
    total += o * pout / 1e6; tin += ctx; tout += o;
    ctxPrev = ctxPrev + outPrev + t.novo; outPrev = t.out;
  });
  return {usd: total, tin, tout, tcache, chamadas: turnos.length};
}

export function turnosSub(c, fim) {
  const t = [{novo: c.base, out: c.out}];
  for (let i = 1; i < c.k; i++) t.push({novo: c.res, out: c.out});
  t.push({novo: c.res, out: fim});
  return t;
}

export function turnosOrq(c) {
  const t = [{novo: c.base, out: c.out}];
  for (let i = 2; i <= c.m; i++) t.push({novo: i === 2 ? c.n * c.sum : 0, out: i === c.m ? c.fin : c.out});
  return t;
}

export function orquestrar(c, s) {
  const o = rodar(modelo(c.orq), turnosOrq(c), s, c.cache), sb = rodar(modelo(c.sub), turnosSub(c, c.sum), s, c.cache);
  const nb = c.n * c.buscas, ub = nb * c.pb / 1000, total = o.usd + c.n * sb.usd + ub;
  return {o, sb, nb, ub, usd: total, brl: emReais(total, s), tokens: o.tin + o.tout + c.n * (sb.tin + sb.tout), chamadas: o.chamadas + c.n * sb.chamadas};
}
