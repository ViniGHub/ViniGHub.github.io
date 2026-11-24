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
