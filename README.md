# PromptDocente · Caderno de Contexto (PROFCOMP-MA / UFMA)

Aplicativo web responsivo gerador de prompts pedagógicos estruturados para professores da **Educação Básica** (Educação Infantil, Ensino Fundamental I e II, Ensino Médio Regular, Ensino Médio Técnico e EJA), alinhado à **BNCC**, **CNCT** e às **DCNs da EJA**.

🔗 **Aplicativo publicado:** https://promptdocente-profcomp-ufma.vercel.app

## Principais Recursos

- **16 modelos em 4 categorias:**
  - *Recursos Didáticos*: Plano de Aula Completo, Sequência Didática Multiaulas, Roteiro de Atividade Prática e Apostila/Guia de Estudo.
  - *Avaliações e Rubricas*: Prova Formal, Banco de Questões Comentadas, Rubrica Avaliativa Analítica e Gabarito Comentado com Devolutiva Formativa.
  - *Documentos Pedagógicos e Institucionais*: PEI / Adaptação Curricular Inclusiva, Relatório Descritivo / Parecer Pedagógico, Projeto Pedagógico Interdisciplinar e Documento Institucional (Ata, Ofício, Comunicado) — com diretrizes automáticas de **proteção LGPD**.
  - *Materiais Complementares*: **Slides Editoriais Premium (Direção de Arte)**, Estudo de Caso, Atividade Gamificada/Jogo Didático e Sala de Aula Invertida.
- **Comando fixo de consulta oficial:** orienta a IA a consultar o documento oficial da etapa (BNCC, BNCC Computação, CNCT ou DCNs da EJA), selecionar automaticamente competências e habilidades adequadas e formular objetivos de aprendizagem com **intencionalidade pedagógica**.
- **Campo opcional de documentos complementares:** permite indicar DCTMA, SAEB, ENEM, LBI, PNLD, PPP da escola ou PDFs anexados na conversa.
- **Prompt em camadas expansíveis + curadoria docente (INST-04):** visualização com notas explicativas, ajuste fino manual, biblioteca local com favoritos e backup em `.json`.
- **Links diretos para 32 IAs gratuitas:** incluindo 13 IAs chinesas (DeepSeek, Qwen, Kimi, GLM/Z.ai, ERNIE, Doubao, Cici, Tencent Yuanbao, MiniMax, StepFun, Baixiaoying, Manus, SkyWork), IAs globais, ferramentas de slides/estudo e Maritaca AI (Brasil).
- **Identidade visual UFMA / PROFCOMP-MA (2024):** modo escuro e modo claro.

## Como executar localmente

```bash
npm install
npm run dev
```

Para rodar os testes e gerar a build de produção:

```bash
npm test
npm run build
```

## Créditos e Referências

- **Produto Educacional:** desenvolvido no âmbito do **PROFCOMP-MA / Universidade Federal do Maranhão (UFMA)** ([Página Oficial SIGAA](https://sigaa.ufma.br/sigaa/public/programa/apresentacao_stricto.jsf?lc=pt_BR&idPrograma=1997) · [Portal UFMA](https://portalpadrao.ufma.br/)).
- **Atribuição do Modelo Base:** adaptado do Recurso Educacional Aberto [Geradores de Prompts de AI para Professores](https://educ.nekoweb.org/geradores/home.html) — © 2025 Sérgio Araújo (**Licença CC BY-NC-SA 4.0**), publicado na [Plataforma MEC RED (ID 364756)](https://plataformaintegrada.mec.gov.br/recurso/364756).
