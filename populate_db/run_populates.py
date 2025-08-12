import subprocess

subprocess.run(["python", "populate_db/populate_necessidades.py"], check=False)
subprocess.run(["python", "populate_db/populate_ocupacoes.py"], check=False)
