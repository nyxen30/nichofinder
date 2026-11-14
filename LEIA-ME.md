# Niche Finder: como colocar no ar

O site mostra canais de vídeo longo criados há pouco tempo que já estão performando bem, em 5 idiomas e vários nichos. O Sem Superfície fica numa aba própria. Um robô no GitHub roda todo dia, busca os canais e atualiza o site sozinho.

Você só faz a configuração abaixo uma vez. Vá com calma, um passo de cada vez.

---

## Parte 1: subir os arquivos no GitHub

1. Entre em **github.com** e clique no **+** (canto superior direito) → **New repository**.
2. Nome: `niche-finder`. Marque **Public** e clique em **Create repository**.
   - Por que público: a Vercel gratuita só publica sozinha as atualizações feitas pelo robô se o repositório for público. A chave da API continua secreta (Parte 2), e o resto são dados públicos do YouTube.
3. Na página que abrir, clique no link **uploading an existing file**.
4. Descompacte o zip no seu computador. Abra a pasta `niche-finder-site` e **arraste tudo o que está dentro dela** para a página do GitHub.
   - ⚠️ Tem uma pasta chamada **`.github`** que pode estar escondida. No Windows, ative em Explorador → Exibir → **Itens ocultos**. No Mac, aperte **Cmd + Shift + .** na pasta.
5. Clique em **Commit changes**.
6. Confira se apareceram as pastas: `.github`, `config`, `scripts`, `site`, mais os arquivos `package.json` e `vercel.json`.

## Parte 2: guardar a chave da API no GitHub (com segurança)

A chave fica guardada no GitHub e nunca aparece no site.

1. Dentro do repositório, clique em **Settings** (aba de cima).
2. No menu da esquerda: **Secrets and variables** → **Actions**.
3. Clique em **New repository secret**.
4. Name: `YT_API_KEY`
5. Secret: cole a chave que você criou no Google Cloud.
6. Clique em **Add secret**.

## Parte 3: rodar o robô pela primeira vez

1. Clique na aba **Actions** do repositório.
2. Se aparecer um botão verde pedindo para ativar os workflows, clique nele.
3. Na esquerda, clique em **Atualizar Niche Finder**.
4. À direita, clique em **Run workflow** → **Run workflow** (botão verde).
5. Espere de 3 a 10 minutos. Quando ficar com ✅ verde, ele criou o arquivo `site/data/channels.json`.

Se ficar ❌ vermelho, clique na rodada, depois em **atualizar**, copie a mensagem de erro e me mande.

## Parte 4: publicar o site na Vercel

1. Entre em **vercel.com** → **Add New…** → **Project**.
2. Escolha o repositório `niche-finder` e clique em **Import**.
3. Não precisa mudar nada (o arquivo `vercel.json` já configura tudo). Clique em **Deploy**.
4. Pronto: a Vercel te dá o link do site.

Daqui pra frente o robô roda **todo dia às 06:17** (horário de Brasília). Cada vez que ele atualiza os dados, a Vercel publica o site de novo sozinha.

## Parte 5: ferramentas de IA (Roteiro, Thumbnail, Analisar vídeo)

Essas ferramentas rodam nas funções da pasta `api/` (no servidor da Vercel). As chaves ficam só na Vercel.

1. Pegue a chave do Gemini em **aistudio.google.com/apikey** → **Create API key**.
2. Na Vercel, abra o projeto → **Settings** → **Environment Variables** e crie três variáveis (marque Production, Preview e Development):
   - `GEMINI_API_KEY` = a chave do Gemini
   - `YT_API_KEY` = uma chave da YouTube Data API (pode ser a mesma do robô)
   - `SITE_PASSWORD` = uma senha que você inventar (é ela que o site pede)
3. Vá em **Deployments**, clique nos **⋯** do último deploy → **Redeploy**. Variáveis novas só valem depois de um deploy novo.
4. Abra o site, entre numa ferramenta e digite a senha. Ela fica guardada só no seu navegador.

Opcional: `GEMINI_MODEL` (padrão `gemini-3.8-flash`) e `GEMINI_IMAGE_MODEL` (padrão `gemini-nano-banana-2.1`) trocam o modelo sem mexer no código, se o Google mudar os nomes.

---

## Perguntas comuns

**O site começa com poucos canais?**
Sim. O seu nicho é buscado todo dia nos 5 idiomas. Os outros nichos entram em rodízio, cerca de 50 buscas por dia, e levam uns 4 dias para cobrir todos. Depois de uma semana o site já está cheio.

**Quero mais buscas por dia.**
A cota grátis do YouTube é de 10.000 unidades por chave por dia, e cada busca gasta 100. Para dobrar, crie uma segunda chave (de preferência em outro projeto do Google Cloud) e cadastre um secret chamado `YT_API_KEYS` com as duas chaves separadas por vírgula: `chave1,chave2`. O robô passa para a próxima chave quando uma acaba.

**Quero mudar ou adicionar nichos.**
Edite o arquivo `config/niches.mjs` direto no GitHub (clique no arquivo → ícone de lápis). Cada subnicho tem uma frase de busca por idioma. O seu nicho fica em `MY_NICHE`.

**Quero rodar na hora, sem esperar o dia seguinte.**
Vá em Actions → Atualizar Niche Finder → Run workflow.

**Os filtros do site:**
- *Canal criado há no máx.* e *1º vídeo há no máx.*: o padrão é 21 dias (3 semanas). Dá para abrir até 45.
- *Melhor vídeo com*: o mínimo de views do melhor vídeo longo do canal.
- Canais em que menos de 70% das views vêm de vídeos longos (4 min ou mais) são descartados como canais de Shorts.
- ⭐ *Salvar* guarda canais na aba **Salvos**, só no seu navegador.
