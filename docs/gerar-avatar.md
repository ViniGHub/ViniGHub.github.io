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

## Avaturn (recomendado)

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

- **Comprimir** com gltf-transform (Draco ou meshopt), para o arquivo ficar com poucos MB.
- **Enquadrar** só cabeça e ombros, deixando o resto do corpo de fora.
- **Aplicar o acabamento escolhido** (escultura, scan em pontos ou curvas de nível) e **animar**:
  - a cabeça segue o mouse;
  - o rosto pisca e sorri, usando as expressões do arquivo;
  - o corpo respira.
- **Celular e "menos animação":** uma imagem estática no lugar do 3D quando fizer sentido.
