# Portfólio: protótipos e ideias

Protótipos em HTML puro feitos em 24/11/2026 para escolher a direção visual. O site de verdade sai em React com shadcn, skiper-ui, GSAP + ScrollTrigger e Lenis, e o avatar provisório (`bust.js`) dá lugar ao modelo 3D do Vinicius.

Para ver: sirva esta pasta (`python -m http.server 8765`) e abra `http://localhost:8765/b-engenharia-escura.html`.

| Arquivo | Direção | Situação |
|---|---|---|
| `b-engenharia-escura.html` | Engenharia escura: fundo escuro, mono, cada projeto explicado com um diagrama vivo | **Escolhida** em 24/11/2026 |
| `c-imersivo-3d.html` | Ambiente 3D: a página é uma cena, e o scroll leva a câmera pela mesa | **Guardada para o futuro**, a pedido do Vinicius |
| `a-caderno-tecnico.html` | Caderno técnico: papel claro, serifa, uma cor | Não escolhida |

## Ajustes pedidos no B (24/11/2026)

- Deixar claro, ao rolar, que o que vem são **projetos**: índice de projetos logo depois da abertura e cabeçalho "projeto 01/03" em cada um.
- **Sem tom de busca de vaga**: nada de "aberto a vagas" ou "vamos ver se encaixa". É um portfólio.

## Ideias v2 (24/11/2026, depois do site no ar)

Ele achou o site simples demais e o avatar fraco. O arquivo `ideias-v2.html` (com `head.js` e as capturas em `img/`) mostra as opções para ele escolher:

- **Avatar**, todos sobre a mesma cabeça esculpida em código:
  - **A · Escultura:** argila com moletom;
  - **B · Scan em pontos:** nuvem de pontos com linha de varredura;
  - **C · Curvas de nível:** fatias da cabeça, como um mapa topográfico.

  Com o GLB dele, o mesmo tratamento passa a valer para o rosto real.
- **Projetos que convidam a testar:**
  1. **Janela ao vivo:** a captura vira a demo de verdade, dentro de um iframe;
  2. **Mini-demo jogável:** o TicketFlow com o webhook repetido;
  3. **Vitrine em movimento:** a captura se endireita e troca de "antes" para "depois" com o scroll.
- **Extras:**
  - paleta de comandos (Ctrl+K);
  - página de estudo de caso por projeto;
  - "mexendo agora", com o último commit;
  - linha do tempo;
  - versão em inglês;
  - modo explorar 3D.

## Escolhas de 25/11/2026

O avatar já está no ar: é o GLB do Meshy, com só a cabeça seguindo o mouse. Para a vitrine e os extras, o Vinicius escolheu:

| O quê | Entra? | Observação |
|---|---|---|
| Janela ao vivo | Feito | agenda-ia e Sinal, que têm demo pública. O iframe libera microfone, câmera e captura de tela para o Sinal. |
| Mini-demo jogável | Feito | TicketFlow, que não tem demo pública: compra, webhook repetido e esgotado. |
| Vitrine em movimento | Não | Disputaria espaço com os diagramas presos. |
| Paleta Ctrl+K | Feito | cmdk (a base do Command do shadcn): ir para as seções, testar os projetos, abrir código e perfis, copiar o link. |
| "Mexendo agora" | Feito | Último commit público fora do próprio portfólio, numa linha dos fatos do topo. O feed de eventos do GitHub não traz mais os commits, então o site pede o repositório com push mais recente e o último commit dele. |
| Linha do tempo | Feito | Na seção Sobre, com as datas do currículo (Etec, FIAP, Ipem-SP, Class Solutions). Os empregos mostram a duração; os estudos, "concluído". |
| Estudo de caso por projeto | Feito | agenda-ia, TicketFlow e Sinal em /projetos/<id>/, com textos revisados por ele. O texto fica em `src/content/case-studies.ts`. |
| Versão em inglês | Feito | /en/ e /en/projects/<id>/, com chave pt/en na barra. Textos curtos lado a lado em `t('pt', 'en')`; estudos de caso em `src/content/case-studies.en.ts`. Quando um texto em português mudar, o inglês precisa acompanhar. |
| Modo explorar 3D | Depois | Continua guardado (ideia C). |

Os tratamentos de avatar do protótipo (escultura, pontos, curvas) ficaram de lado, porque o avatar texturizado do Meshy já entrou.

## Ideia C: o ambiente 3D (para depois)

A página inteira é uma cena 3D do "canto" do Vinicius: uma mesa com monitor, celular e um ingresso, e o avatar atrás dela. Rolar a página move a câmera por cinco paradas:

1. **Abertura:** a mesa inteira, com o avatar e o nome.
2. **Monitor:** a tela mostra o agenda-ia.
3. **Celular:** a tela mostra o Sinal.
4. **Ingresso em cima da mesa:** o TicketFlow.
5. **Rosto do avatar:** contato.

Cada parada tem um cartão de texto com fundo sólido no canto inferior esquerdo, para ficar legível sobre a cena. A cabeça do avatar segue o mouse, pisca e respira.

Para virar site de verdade:
- **Avatar:** trocar o busto provisório pelo GLB do Vinicius, gerado a partir de selfie no Avaturn ou no MetaPerson, com acabamento toon ou argila para combinar com a cena.
- **Telas:** usar capturas reais dos projetos como textura do monitor e do celular. Hoje são desenhos em canvas.
- **Celular e acessibilidade:** fazer uma versão leve para celular (imagens e rolagem comum, sem 3D) e um modo para quem desativa animações no sistema.
- **Peso:** carregar o 3D só depois do texto, com meta de Lighthouse acima de 90, e comprimir o GLB com Draco ou meshopt.
- **Convivência com o B:** pode entrar como uma página ou seção "modo explorar", sem substituir o site principal.
