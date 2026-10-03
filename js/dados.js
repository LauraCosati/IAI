/* Dados do site. Preços de API conferidos nas páginas oficiais em 2 out. 2026.
   Para atualizar preços, notas ou planos, edite apenas este arquivo. */

/* ---------- tarefas ---------- */
/* win e wout: palavras típicas de entrada e de saída de um prompt da tarefa */
export const TAREFAS = [
  {id:"escrita", nome:"Escrever e revisar textos", ex:"e-mails, relatórios, ofícios", curto:"Texto", win:300, wout:500},
  {id:"pesquisa", nome:"Pesquisar com fontes", ex:"levantar dados e referências", curto:"Pesquisa", win:100, wout:600},
  {id:"docs", nome:"Resumir documentos longos", ex:"um PDF de 10 páginas", curto:"Documentos", win:4000, wout:400},
  {id:"dados", nome:"Analisar dados e planilhas", ex:"tabelas, gráficos, fórmulas", curto:"Dados", win:2000, wout:500},
  {id:"codigo", nome:"Programar e automatizar", ex:"scripts, macros, sites", curto:"Código", win:1500, wout:800},
  {id:"imagem", nome:"Criar imagens", ex:"ilustrações, peças visuais", curto:"Imagem", win:0, wout:0},
  {id:"reunioes", nome:"Resumir reuniões", ex:"ata de uma hora de reunião", curto:"Reuniões", win:8000, wout:500},
  {id:"atual", nome:"Acompanhar o que acontece agora", ex:"notícias, redes sociais", curto:"Tempo real", win:100, wout:400},
  {id:"volume", nome:"Automatizar em grande volume", ex:"classificar milhares de textos", curto:"Volume", win:500, wout:200}
];
export const ECO_TAREFAS = ["escrita","docs","dados","reunioes"];

/* ---------- modelos de API, em US$ por milhão de tokens ---------- */
/* pin/pout = entrada/saída; pinL/poutL = contexto longo acima de longAt;
   offIn/offOut = fora do pico; req = taxa por requisição; mult = tokens a mais na contagem */
export const MODELOS = [
  {id:"astra", ia:"chatgpt", nome:"GPT-6 Astra", faixa:"Topo de linha", pin:10, pout:50, longAt:272000, pinL:20, poutL:75},
  {id:"sol", ia:"chatgpt", nome:"GPT-6.1 Sol", faixa:"Equilibrado", pin:2, pout:10, longAt:272000, pinL:4, poutL:15},
  {id:"luna", ia:"chatgpt", nome:"GPT-6 Luna", faixa:"Econômico", pin:0.10, pout:0.50, longAt:272000, pinL:0.20, poutL:0.75},
  {id:"fable", ia:"claude", nome:"Claude Fable 5.1", faixa:"Topo de linha", pin:10, pout:50, mult:1.3},
  {id:"opus", ia:"claude", nome:"Claude Opus 5.5", faixa:"Topo de linha", pin:4, pout:20, mult:1.3},
  {id:"sonnet", ia:"claude", nome:"Claude Sonnet 5.5", faixa:"Equilibrado", pin:2, pout:10, mult:1.3},
  {id:"haiku", ia:"claude", nome:"Claude Haiku 4.5", faixa:"Econômico", pin:1, pout:5},
  {id:"g31pro", ia:"gemini", nome:"Gemini 3.1 Pro", faixa:"Topo de linha", pin:2, pout:12, longAt:200000, pinL:4, poutL:18},
  {id:"g38flash", ia:"gemini", nome:"Gemini 3.8 Flash", faixa:"Equilibrado", pin:0.75, pout:3.75},
  {id:"g35lite", ia:"gemini", nome:"Gemini 3.5 Flash-Lite", faixa:"Econômico", pin:0.30, pout:2.50},
  {id:"grok", ia:"grok", nome:"Grok 4.7", faixa:"Topo de linha", pin:2, pout:6, longAt:200000, pinL:4, poutL:12},
  {id:"dspro", ia:"deepseek", nome:"DeepSeek V4 Pro", faixa:"Equilibrado", pin:1.32, pout:3.96, offIn:0.66, offOut:1.98},
  {id:"dsflash", ia:"deepseek", nome:"DeepSeek Flash", faixa:"Econômico", pin:0.30, pout:1.20, offIn:0.15, offOut:0.60},
  {id:"sonarpro", ia:"perplexity", nome:"Sonar Pro", faixa:"Com busca", pin:3, pout:15, req:0.006},
  {id:"sonar", ia:"perplexity", nome:"Sonar", faixa:"Com busca", pin:1, pout:1, req:0.005}
];

/* ---------- ferramentas de IA ---------- */
export const AIS = [
  {id:"chatgpt", nome:"ChatGPT", emp:"OpenAI", ref:"sol", eco:"luna",
   geral:"Generalista competente em quase tudo, com o maior número de usuários.",
   pq:{dados:"Roda código para analisar a planilha que você envia e devolve tabelas e gráficos.", codigo:"Tem o Codex, agente de programação da OpenAI.", imagem:"Gera e edita imagens no próprio chat."},
   pts:["É a mais usada: 79,4% do mercado de chatbots na web (Statcounter, ago. 2026) e 46,4% nos aplicativos (Sensor Tower, mai. 2026).","Reúne texto, análise de dados com execução de código, imagens e voz no mesmo aplicativo.","Tem o plano Go, vendido em reais por R$ 39,99, entre o gratuito e o Plus."],
   quando:"Quando o trabalho varia muito no mesmo dia: redigir, analisar uma planilha, gerar uma imagem.",
   atencao:"Na API, o GPT-6 Astra custa 100 vezes o GPT-6 Luna. Escolher o modelo errado multiplica a conta.",
   planos:["Gratuito","Go · R$ 39,99 por mês","Plus · US$ 20 por mês (cerca de R$ 100)","Pro · US$ 100 ou US$ 200 por mês"],
   ind:[{n:"Gratuito",brl:0},{n:"Go",brl:39.99},{n:"Plus",usd:20}]},
  {id:"gemini", nome:"Gemini", emp:"Google", ref:"g31pro", eco:"g35lite",
   geral:"Forte em material longo e integrado aos aplicativos do Google.",
   pq:{docs:"Lê até 1 milhão de tokens de uma vez, o suficiente para um processo inteiro.", imagem:"Gera imagens e vídeo no mesmo aplicativo.", reunioes:"Resume reuniões do Meet para quem usa Google Workspace.", volume:"O Flash-Lite custa US$ 0,30 e US$ 2,50 por milhão de tokens, e a API tem nível gratuito para testar."},
   pts:["Funciona dentro do Gmail, Docs, Planilhas e Meet.","Lê até 1 milhão de tokens de uma vez.","A assinatura é cobrada em reais no Brasil, sem IOF."],
   quando:"Quando a equipe vive no Gmail, Docs e Planilhas, ou quando o material é muito longo.",
   atencao:"No nível gratuito da API, o Google usa o conteúdo para melhorar os produtos. O preço do Gemini 3.8 Flash dobra em 1º de janeiro de 2027.",
   planos:["Gratuito","Google AI Plus · R$ 25 por mês (preço de lançamento, out. 2025)","Google AI Pro · R$ 96,99 por mês","Google AI Ultra · R$ 779,90 por mês"],
   ind:[{n:"Gratuito",brl:0},{n:"Google AI Plus",brl:25},{n:"Google AI Pro",brl:96.99}]},
  {id:"claude", nome:"Claude", emp:"Anthropic", ref:"sonnet", eco:"haiku",
   geral:"Forte em texto, código e documentos longos.",
   pq:{escrita:"Tem reputação forte em redação longa e em seguir instruções de estilo e formato.", pesquisa:"Faz busca na web e pesquisa em várias etapas com citações.", docs:"Cobra o mesmo preço por token até 1 milhão de tokens, sem tarifa de texto longo.", dados:"Analisa arquivos enviados e executa código para gerar tabelas e gráficos.", codigo:"Tem o Claude Code, agente de programação incluído no plano Pro."},
   pts:["Tem reputação forte em redação longa, programação e uso profissional. Chegou a 10,3% dos aplicativos de IA (Sensor Tower, mai. 2026).","Cobra o mesmo preço por token até 1 milhão de tokens de contexto, sem tarifa de texto longo.","O plano Pro inclui o Claude Code, agente de programação."],
   quando:"Quando o resultado é um texto longo, um documento formal ou código que precisa sair certo.",
   atencao:"Não tem gerador de imagens próprio. Os modelos mais novos contam cerca de 30% mais tokens para o mesmo texto, segundo a própria Anthropic.",
   planos:["Gratuito","Pro · US$ 20 por mês (US$ 17 no anual; cerca de R$ 110 pelo site no Brasil)","Max · a partir de US$ 100 por mês"],
   ind:[{n:"Gratuito",brl:0},{n:"Pro",usd:20}]},
  {id:"copilot", nome:"Copilot", emp:"Microsoft", ref:null, eco:null,
   geral:"Faz sentido para quem já trabalha no Microsoft 365.",
   pq:{dados:"Trabalha direto na planilha do Excel, sem exportar nada.", reunioes:"Resume reuniões do Teams e consulta e-mails e arquivos da organização."},
   pts:["Fica dentro do Word, Excel, Outlook, Teams e PowerPoint e consulta os arquivos e e-mails da organização.","Segue as regras de segurança e privacidade já configuradas no Microsoft 365.","De cerca de 450 milhões de usuários comerciais do Microsoft 365, 15 milhões pagam pelo Copilot (3,3%)."],
   quando:"Quando a organização já paga Microsoft 365 e o trabalho acontece no Word, Excel, Outlook e Teams.",
   atencao:"Não tem preço por prompt nem por token. É assinatura por usuário, somada à licença do Microsoft 365.",
   planos:["Copilot gratuito","Microsoft 365 Premium · US$ 19,99 por mês (pessoal)","Microsoft 365 Copilot · US$ 30 por usuário por mês (empresas; US$ 21 para pequenas e médias)"],
   ind:[{n:"Copilot gratuito",brl:0},{n:"Microsoft 365 Premium",usd:19.99}]},
  {id:"perplexity", nome:"Perplexity", emp:"Perplexity AI", ref:"sonarpro", eco:"sonar",
   geral:"Especialista em busca com fontes.",
   pq:{pesquisa:"Cada resposta vem com as fontes numeradas, o que facilita conferir e citar.", atual:"Busca na web a cada pergunta, então responde sobre o que saiu hoje."},
   pts:["Funciona como um buscador que responde com as fontes numeradas.","No plano Pro dá para escolher modelos de outras empresas.","Na API, cada chamada paga os tokens mais uma taxa de busca de US$ 5 a US$ 14 por mil requisições."],
   quando:"Quando a resposta precisa de fonte para ser conferida ou citada.",
   atencao:"Rende menos em texto criativo e em tarefas abertas do que um chatbot generalista.",
   planos:["Gratuito","Pro · US$ 20 por mês","Max · US$ 200 por mês"],
   ind:[{n:"Gratuito",brl:0},{n:"Pro",usd:20}]},
  {id:"deepseek", nome:"DeepSeek", emp:"DeepSeek", ref:"dspro", eco:"dsflash",
   geral:"A opção de menor custo por token.",
   pq:{codigo:"Custa centavos por tarefa de código, e a API aceita os formatos da OpenAI e da Anthropic.", volume:"Tem o menor preço por token da lista. No horário comercial de Brasília vale a tarifa fora do pico, pela metade."},
   pts:["Tem o menor preço por token desta lista.","Cobra metade fora do pico. O pico vai de 22h a 1h e de 3h a 7h no horário de Brasília, então o horário comercial brasileiro paga a tarifa baixa.","A API aceita os formatos da OpenAI e da Anthropic, o que facilita trocar de fornecedor."],
   quando:"Quando o volume é alto e o orçamento é curto, por exemplo classificar milhares de textos.",
   atencao:"Não tem integração com pacote de escritório. O modelo Pro não lê imagens.",
   planos:["Chat gratuito","API paga por uso"],
   ind:[{n:"Chat gratuito",brl:0}]},
  {id:"grok", nome:"Grok", emp:"xAI", ref:"grok", eco:"grok",
   geral:"Ligado ao X e ao que acontece em tempo real.",
   pq:{imagem:"Gera imagens e vídeos com o Grok Imagine.", atual:"Busca publicações do X em tempo real, útil para acompanhar repercussão."},
   pts:["Busca publicações do X em tempo real.","Usa um único modelo para tudo, com a saída mais barata entre os modelos topo de linha: US$ 6 por milhão de tokens.","Gera imagens e vídeos com o Grok Imagine."],
   quando:"Quando importa o que está sendo dito agora, principalmente no X.",
   atencao:"A assinatura SuperGrok custa cerca de US$ 30 por mês, acima dos US$ 20 das concorrentes. O contexto é de 500 mil tokens, metade do das rivais.",
   planos:["Gratuito com limites","SuperGrok · cerca de US$ 30 por mês","SuperGrok Heavy · cerca de US$ 300 por mês"],
   ind:[{n:"Gratuito com limites",brl:0},{n:"SuperGrok",usd:30}]}
];

/*            escrita pesq docs dados cod img reun atual vol */
export const NOTAS = {
  chatgpt:   [4,4,4,5,5,5,3,3,4],
  gemini:    [4,4,5,4,4,5,4,3,5],
  claude:    [5,4,5,4,5,1,2,2,3],
  copilot:   [3,3,3,4,3,3,5,2,1],
  perplexity:[2,5,3,2,2,1,1,5,2],
  deepseek:  [3,2,3,3,4,0,1,1,5],
  grok:      [3,3,3,3,3,4,1,5,3]
};

export const DADOS = {
  chatgpt:"No plano individual, as conversas treinam os modelos por padrão e dá para desativar. Nos planos corporativos e na API, não.",
  gemini:"No aplicativo, as conversas treinam os modelos por padrão e parte passa por revisão humana. No Workspace, não. Na API, só o nível gratuito usa o conteúdo.",
  claude:"No plano individual, as conversas só treinam os modelos se o usuário permitir. Nos planos comerciais e na API, não por padrão.",
  copilot:"O Microsoft 365 Copilot não usa prompts, respostas nem dados da organização para treinar modelos.",
  perplexity:"As buscas são usadas para melhorar os modelos por padrão e dá para desativar nas configurações.",
  deepseek:"Usa as entradas para treinar modelos, com direito de recusa. Os dados ficam armazenados na China.",
  grok:"As conversas treinam os modelos por padrão e dá para desativar. Clientes empresariais ficam de fora."
};

/* ---------- assinaturas e participação de mercado ---------- */
export const ASSIN = [
  {plano:"ChatGPT Plus", usd:20, ref:"sol"},
  {plano:"Claude Pro", usd:20, ref:"sonnet"},
  {plano:"Google AI Pro", brl:96.99, ref:"g31pro"},
  {plano:"Perplexity Pro", usd:20, ref:"sonarpro"},
  {plano:"SuperGrok", usd:30, ref:"grok"}
];

/* pesquisas de uso de IA no trabalho, no Brasil */
export const PESQUISAS = [
  {valor:"24%", texto:"dos brasileiros que conhecem IA já a usaram no trabalho. Eram 17% um ano antes. Datafolha, jun. 2026."},
  {valor:"35%", texto:"dos profissionais usam IA todo dia no trabalho. Eram 17% dezoito meses antes. LinkedIn, set. a dez. 2025."},
  {valor:"58%", texto:"dos profissionais já recorreram a ferramentas de IA. Catho, Pesquisa de Tendências 2026."},
  {valor:"27%", texto:"dos usuários brasileiros de IA estão no nível avançado, contra 16% na média mundial. Microsoft Work Trend Index 2026."}
];

/* participação dos chatbots na web (Statcounter, ago. 2026), em % */
export const SHARE = [["ChatGPT",79.4],["Gemini",10.9],["Perplexity",4.31],["Copilot",2.79],["Claude",2.57],["DeepSeek",0.02]];

/* ---------- multiagentes ---------- */
/* cr = tarifa de leitura de cache (US$ por milhão); cw = multiplicador de gravação sobre a entrada */
export const CACHE = {
  astra:{cr:1,crL:2,cw:1.25}, sol:{cr:0.10,crL:0.20,cw:1.25}, luna:{cr:0.01,crL:0.02,cw:1.25},
  fable:{cr:0.25,cw:1.25}, opus:{cr:0.20,cw:1.25}, sonnet:{cr:0.20,cw:1.25}, haiku:{cr:0.10,cw:1.25},
  g31pro:{cr:0.20,crL:0.40,cw:1}, g38flash:{cr:0.075,cw:1}, g35lite:{cr:0.03,cw:1},
  grok:{cr:0.50,crL:1,cw:1}, dspro:{cr:0.044,crOff:0.022,cw:1}, dsflash:{cr:0.006,crOff:0.003,cw:1}
};
export const PARES = [["OpenAI","sol","luna"],["Anthropic","sonnet","haiku"],["Google","g31pro","g35lite"],["DeepSeek","dspro","dsflash"],["xAI","grok","grok"]];
export const MOD_AG = MODELOS.filter(m => m.ia !== "perplexity");

/* ---------- buscas ---------- */
export const modelo = id => MODELOS.find(m => m.id === id) || null;
export const ia = id => AIS.find(a => a.id === id) || null;
export const tarefa = id => TAREFAS.find(t => t.id === id);
