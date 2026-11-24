# Como gerar o avatar 3D

O site espera um arquivo **GLB**, o formato 3D padrão da web, com o seu rosto. O caminho mais simples hoje é o **Avaturn**, que faz o avatar a partir de selfies e exporta GLB com esqueleto e expressões faciais (ARKit). A alternativa é o **MetaPerson**, da Avatar SDK. O Ready Player Me, que era o mais usado, encerrou o serviço público em 31/01/2026.

## Antes de começar

- **Atenção à privacidade.** O GLB vai ficar público no site, e qualquer pessoa pode baixá-lo. É um modelo do seu rosto. Também leia os termos do serviço antes de enviar as fotos.
- **Fotos:**
  - luz de frente e uniforme (de dia, de frente para uma janela);
  - fundo liso;
  - rosto neutro, olhos abertos e sem óculos;
  - cabelo sem cobrir a testa e as orelhas;
  - celular na altura dos olhos.

## Estilo animado (pedido de 24/11/2026)

O Avaturn ficou realista demais. Há três caminhos para um avatar seu com cara de personagem de animação.

### 1. Foto → ilustração no estilo animação → 3D (recomendado)

O modelo continua reconhecível como você, mas desenhado como personagem. Leva cerca de 20 minutos.

1. **Ilustração:** num gerador de imagens (ChatGPT, Gemini etc.), envie uma foto boa (veja "Fotos" abaixo) e peça algo como:
   > Transforme esta foto num personagem 3D no estilo de filme de animação: traços simplificados, olhos um pouco maiores, pele lisa, cores suaves. Mantenha o rosto reconhecível (formato do rosto, cabelo, sobrancelhas, barba se houver). Busto de frente, cabeça e ombros, expressão neutra com leve sorriso, camiseta lisa escura, fundo cinza liso, luz suave de estúdio.

   Gere algumas variações e escolha a mais parecida com você.
2. **Modelo 3D:** no **Meshy** (https://www.meshy.ai) ou no **Tripo** (https://www.tripo3d.ai), use **Image to 3D** com essa ilustração. Escolha a melhor das variações, gere a textura e baixe em **GLB**.
   - **No Meshy grátis, escolha o modelo "Meshy 6 Lite"** na área **Modelo** (seletor no alto do painel esquerdo). Só ele tem download grátis (10 por mês, em 11/2026). O Agente e os modelos Meshy 6 e 7.1 geram, mas o botão Baixar pede assinatura.
   - Custo do Lite: 10 créditos a malha e mais 10 a textura (botão **Textura** embaixo do modelo).
3. **Só a cabeça se mexe**, mesmo sem esqueleto: o site acha o pescoço na malha e gira só o que está acima dele (veja "Depois que o GLB existir"). Se o modelo vier com **Rig** (esqueleto automático, que exige corpo inteiro), o site usa o osso da cabeça.

**Limites:**
- Os planos gratuitos têm cota de créditos e de downloads.
- Os modelos do plano gratuito saem com licença CC BY 4.0, que pede crédito. O rodapé do site já mostra "avatar 3D gerado no Meshy · CC BY 4.0" sempre que há um modelo.
- Esse modelo não traz expressões. Piscar e sorrir só seriam possíveis com um modelo feito à mão (caminhos 2 e 3).

### 2. VRoid Studio (estilo anime, o mais vivo)

1. Baixe o **VRoid Studio** (gratuito, para Windows) e monte um personagem parecido com você pelos controles de rosto, cabelo e roupa. Não precisa enviar foto para lugar nenhum.
2. Exporte em **VRM**, um GLB com padrões extras para avatar.
3. No site, com o three-vrm:
   - os olhos acompanham o mouse;
   - o personagem pisca e sorri;
   - o cabelo balança com o movimento, por física.

   É o avatar mais animado das opções. O traço, porém, é de anime.

### 3. Encomendar a um artista

Peça um "stylized 3D bust from photo" no Fiverr, no ArtStation ou no Behance, com entrega em **GLB** e blendshapes de piscar e sorrir. É o resultado mais bonito e único, com custo e prazo de alguns dias.

## Avaturn (realista)

1. Abra **https://hub.avaturn.me** e entre com Google, e-mail ou como convidado (*Sign In as Guest*). Para conseguir exportar depois, prefira uma conta.
2. Crie o avatar e siga as instruções da tela para tirar as selfies. Normalmente são de frente e dos lados, e dá para tirar pelo celular.
3. Ajuste cabelo, roupa e corpo. Para o site só importa o busto, então capriche no cabelo e na gola. Uma camiseta ou moletom lisos funcionam melhor com os acabamentos da página.
4. Para baixar, o Avaturn libera o GLB pelo Discord dele:
   - entre no servidor pelo link **Join Us** da tela de login (hoje é https://discord.com/invite/2xmxXv2SQk);
   - no canal **#bot**, digite `/` e escolha **/avaturn**;
   - clique em **Export GLB**.
5. Salve o arquivo como `public/models/avatar.glb` neste projeto, ou só me avise onde ficou.

## MetaPerson (alternativa)

1. Abra o MetaPerson Creator (https://avatarsdk.com/metaperson-creator/).
2. Envie uma selfie. O rosto é reconstruído em cerca de um minuto.
3. Ajuste e exporte em **GLB**. Segundo o próprio site, o primeiro avatar é gratuito na exportação padrão (LOD1, texturas JPG de 1K); os seguintes usam créditos.

## Depois que o GLB existir (minha parte)

- **Comprimir** com gltf-transform. O modelo atual passou de 9,1 MB para 421 KB com este comando (malha de 117 mil para 47 mil triângulos, texturas WebP de 1024, meshopt):

  ```powershell
  npx @gltf-transform/cli@4 optimize entrada.glb public/models/avatar.glb --compress meshopt --texture-compress webp --texture-size 1024 --simplify-ratio 0.4 --simplify-error 0.001
  ```

  O `Avatar.tsx` já liga o decodificador meshopt no carregador.
- **Enquadrar:** o site encaixa o busto pela altura e pela largura do quadro e esconde o corte da base num degradê.
- **Cabeça que segue o mouse sem esqueleto:** o `Avatar.tsx` procura o pescoço (a fatia mais estreita da malha entre os ombros e o queixo) e, no shader, gira só o que fica acima dele. A rotação some ao longo do pescoço, então a camiseta não se mexe.
- **Aplicar o acabamento escolhido** (escultura, scan em pontos ou curvas de nível) e **animar**:
  - a cabeça segue o mouse;
  - o rosto pisca e sorri, usando as expressões do arquivo;
  - o corpo respira.
- **Celular e "menos animação":** uma imagem estática no lugar do 3D quando fizer sentido.
