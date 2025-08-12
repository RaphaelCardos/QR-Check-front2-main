# QRCheck - Setup do Projeto

Um guia rápido e simples para a criação do ambiente de desenvolvimento do projeto **QRCheck (2025)**.

---

## 1. Preparação do ambiente de desenvolvimento

### 1.1. Instalação do Python 3.13.x

- **Download do Interpretador Python v3.13.x**: [Baixar aqui](https://www.python.org/downloads/release/python-3131/)
- Durante a instalação, marque a opção **"Add Python 3.13 to PATH"**.
- Opcionalmente, instale o launcher para todos os usuários.

> **Dica:** Caso já tenha outras versões do Python instaladas, pode utilizar o **Pyenv** para gerenciá-las.

### 1.2. Instalação do Visual Studio Code

- **Download do VS Code**: [Baixar aqui](https://code.visualstudio.com/Download)
- Instale a **extensão do Python** antes de começar o desenvolvimento.

### 1.3. Instalação do Poetry

Poetry gerencia as dependências do projeto e garante compatibilidade entre sistemas operacionais.

```sh
pip install poetry
```

Para criar um ambiente virtual dentro do projeto:
```sh
poetry config virtualenvs.in-project true
```

---

## 2. Clonagem do Projeto

Há duas formas principais:
1. **GitHub Desktop (GUI)** - Interface gráfica
2. **Git Bash (CLI)** - Linha de comando

### 2.1. Clonagem pelo GitHub Desktop
- **Download**: [Baixar aqui](https://desktop.github.com/download/)
- Faça login no GitHub e vá até a página do repositório.
- Clique em **"Clone" > "Open with GitHub Desktop"**.
- Confirme a clonagem clicando em **"Clone"** no aplicativo.

> **Importante:** Lembre-se de onde o repositório foi salvo para abri-lo no VS Code.

---

## 3. Instalação das Dependências

Abra o **VS Code**, navegue até o diretório do projeto e execute:

```sh
poetry install
```

Para visualizar as dependências instaladas:
```sh
poetry show
```

> **Aviso:** Sempre instale novas dependências com:
```sh
poetry add nome_da_dependencia
```

---

## 4. Configuração do PostgreSQL

### 4.1. Instalação

- **Download do PostgreSQL**: [Baixar aqui](https://www.postgresql.org/download/)
- Durante a instalação, defina uma senha de superusuário e mantenha a porta padrão **5432**.
- Após a instalação, abra o **pgAdmin 4** e insira a senha definida.

### 4.2. Configuração do Banco de Dados

1. No **pgAdmin 4**, expanda "Servers" e clique com o botão direito em **PostgreSQL 17**.
2. Vá em **Create > Login/Group Role...**:
   - Nome: `qrcheck`
   - Aba "Definition" > Password: `ifes*lableds_2025*`
   - Aba "Privileges": Ative todas as permissões.
3. Vá em **Create > Database...**:
   - Nome: `qrdatabase`
   - Owner: `qrcheck`

---

## 5. Estruturando o Banco de Dados com Alembic

Alembic gerencia migrações de banco de dados.

- **Antes de rodar o código pela primeira vez:**
  ```sh
  alembic upgrade head
  ```

- **Se houver alterações feitas por outro colaborador:**
  ```sh
  alembic upgrade head
  ```

- **Se você realizou alterações nos schemas:**
  ```sh
  alembic revision --autogenerate -m "Descrição da alteração"
  alembic upgrade head
  ```

- **Para verificar em qual migration está:**
  ```sh
  alembic current
  ```

> **Atenção:** Evite alterações manuais no banco via pgAdmin para não comprometer o Alembic.

---

## 6. Execução do Código

### 6.1. Inicialização

Para popular no banco de dados as tabelas de 'ocupações' e 'necessidades específicas': 

```sh
task populate
```

Para iniciar a aplicação:

```sh
task run
```

Para encerrar a aplicação: **`Ctrl+C`**

### 6.2. Acessar a documentação da API

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 6.3. Melhorando o código

- **Análise de sintaxe:**
  ```sh
  task lint
  ```
- **Formatação baseada em boas práticas:**
  ```sh
  task format
  ```

---

## 7. Principais Pacotes Instalados

- **FastAPI** - Framework para APIs REST.
- **Uvicorn** - Servidor ASGI de alto desempenho.
- **Taskipy** - Automatiza scripts no terminal.
- **Pydantic** - Validação de dados.
- **Jinja2** - Templates HTML dinâmicos.
- **Ruff** - Ferramenta para formatação e linting de código.
- **PostgreSQL (psycopg2-binary)** - Conexão com banco de dados.
- **SQLAlchemy** - ORM para manipulação de dados.
- **Alembic** - Gerenciamento de migrações do banco.
- **PyJWT** - Implementação de JSON Web Token (JWT).
- **Pwdlib[argon2]** - Criptografia HASH para senhas.

Para visualizar todos os pacotes:
```sh
poetry show
