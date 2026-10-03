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

A seção "Perguntar" usa `window.claude`, disponível quando a página é aberta como Artifact
no Claude. Em outros lugares, ela mostra que o assistente está indisponível e o resto do
site funciona normalmente.
