# IAI?

E aí, qual IA faz esse trabalho? E quanto custa cada pergunta?

Site estático que compara as ferramentas de IA mais usadas, recomenda uma para cada tarefa e calcula em reais o custo de um prompt e de uma orquestração de multiagentes.

## Estrutura

```
index.html              Estrutura da página (só HTML, sem estilos nem scripts embutidos)
favicon.svg
css/
  variables.css         Cores, fontes e tema escuro (variáveis CSS)
  base.css              Reset e estilos dos elementos HTML (corpo, títulos, tabelas)
  layout.css            Topo, coluna central, seções e rodapé
  components.css        Peças reutilizadas: botões, formulários, cupom, barras
  sections.css          Estilos específicos de cada seção, na ordem da página
js/
  config.js             Endereço do proxy do assistente
  contexto-assistente.js  Instruções e ferramentas do assistente (usado também pelo worker)
  main.js               Ponto de entrada: monta as seções e liga os eventos
  dados.js              Tarefas, modelos, preços, planos e notas (edite aqui para atualizar)
  calculos.js           Regras de cálculo, sem acesso ao DOM
  estado.js             Lê os valores dos formulários
  utils.js              Atalhos de DOM e formatação de números em pt-BR
  secoes/
    escolher.js         Qual IA para qual trabalho
    assistente.js       Seu caso é mais específico? (chat)
    calcular.js         Quanto custa um prompt
    agentes.js          Quanto custa orquestrar multiagentes
    estaticas.js        Comparar, Uso no Brasil e Método (montadas uma vez)
worker/                 Proxy do assistente (Cloudflare Worker), guarda a chave do Gemini
```

## Como rodar

O JavaScript usa módulos ES (`<script type="module">`), que os navegadores não carregam
abrindo o arquivo direto do disco (`file://`). Sirva a pasta com qualquer servidor estático:

```sh
python3 -m http.server 8000
# ou
npx serve .
```

Depois abra http://localhost:8000.

No GitHub Pages, Netlify ou Vercel, basta publicar a pasta como está.

## Atualizar preços

Todos os números ficam em `js/dados.js`. Ao mudar um preço, atualize também a data em
`index.html` (seção de início) e em `js/secoes/assistente.js` (premissas enviadas ao assistente).

## Assistente

A seção "Perguntar" responde pelo nível gratuito da API do Gemini. O navegador não fala direto
com o Google: ele chama um proxy no Cloudflare Workers (pasta `worker/`), que guarda a chave,
monta as instruções com os dados do site e limita o uso por IP. Quando o Gemini pede uma conta,
o proxy devolve o pedido e o navegador executa as calculadoras da própria página.

```
navegador  →  worker (chave + instruções)  →  Gemini
    ↑   executa as calculadoras quando o Gemini pede   ↓
```

### Publicar o proxy

1. Crie uma chave gratuita em https://aistudio.google.com/apikey.
2. Crie uma conta gratuita na Cloudflare (https://dash.cloudflare.com/sign-up).
3. No terminal:
   ```sh
   cd worker
   npm install
   npx wrangler login
   npx wrangler secret put GEMINI_API_KEY   # cole a chave quando pedir
   npx wrangler deploy
   ```
4. O deploy mostra um endereço como `https://iai-assistente.SEU-USUARIO.workers.dev`.
   Cole esse endereço, terminado em `/chat`, em `js/config.js`.
5. Se o site não estiver em `https://lauracosati.github.io`, ajuste `ORIGENS` em `worker/wrangler.toml`
   e rode `npx wrangler deploy` de novo.

Enquanto `js/config.js` estiver vazio, a seção mostra que o assistente está fora do ar e o
resto do site funciona normalmente.

### Cuidados

- Nunca coloque a chave do Gemini em arquivos do site nem no repositório. Ela fica só no segredo do Worker.
- No nível gratuito, o Google pode usar o conteúdo das perguntas para melhorar os produtos. A página avisa o visitante.
- Os limites gratuitos (requisições por minuto e por dia) aparecem no AI Studio e mudam com o tempo.
  Para trocar o modelo, edite `GEMINI_MODEL` em `worker/wrangler.toml`.
- Para ver erros do proxy em tempo real: `npx wrangler tail`.
