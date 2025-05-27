import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import os
from typing import Dict, List

class SchoolDataImporter:
    def __init__(self, db_connection_string: str):
        """
        Inicializa o importador de dados escolares
        
        Args:
            db_connection_string: String de conexão PostgreSQL
        """
        self.engine = create_engine(db_connection_string)
        
    def create_table_name(self, municipality: str, school: str, table_type: str) -> str:
        """
        Gera nome da tabela seguindo o padrão especificado
        
        Args:
            municipality: Nome do município
            school: Nome da escola
            table_type: Tipo da tabela (notas, frequencia, etc.)
            
        Returns:
            Nome da tabela formatado
        """
        # Limpar e formatar nomes
        municipality_clean = municipality.lower().replace(' ', '_')
        school_clean = school.lower().replace(' ', '_').replace('.', '')
        
        return f"trusted_SP_{municipality_clean}_funcional_{school_clean}_{table_type}"
    
    def import_grades_from_excel(self, excel_path: str, municipality: str, school: str) -> bool:
        """
        Importa notas de um arquivo Excel para o banco de dados
        
        Args:
            excel_path: Caminho para o arquivo Excel
            municipality: Nome do município
            school: Nome da escola
            
        Returns:
            True se importação foi bem-sucedida
        """
        try:
            # Ler arquivo Excel
            df = pd.read_excel(excel_path, sheet_name=0)
            
            # Processar dados
            processed_data = self.process_grades_data(df)
            
            # Nome da tabela
            table_name = self.create_table_name(municipality, school, "notas")
            
            # Inserir no banco
            processed_data.to_sql(
                table_name, 
                self.engine, 
                if_exists='append', 
                index=False
            )
            
            print(f"Dados importados com sucesso para a tabela: {table_name}")
            return True
            
        except Exception as e:
            print(f"Erro na importação: {str(e)}")
            return False
    
    def process_grades_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Processa dados de notas do DataFrame
        
        Args:
            df: DataFrame com dados brutos
            
        Returns:
            DataFrame processado
        """
        # Renomear colunas para padrão
        column_mapping = {
            'Nome': 'nome_aluno',
            'Matrícula': 'matricula',
            '1º Bimestre': 'bimestre1',
            '2º Bimestre': 'bimestre2',
            '3º Bimestre': 'bimestre3',
            '4º Bimestre': 'bimestre4'
        }
        
        df_processed = df.rename(columns=column_mapping)
        
        # Calcular média final
        grade_columns = ['bimestre1', 'bimestre2', 'bimestre3', 'bimestre4']
        df_processed['media_final'] = df_processed[grade_columns].mean(axis=1, skipna=True)
        
        # Determinar status
        df_processed['status'] = df_processed['media_final'].apply(
            lambda x: 'Aprovado' if x >= 7.0 else 'Recuperação' if x >= 5.0 else 'Reprovado'
        )
        
        return df_processed
    
    def create_database_structure(self, municipality: str, school: str):
        """
        Cria estrutura de tabelas para uma nova escola
        
        Args:
            municipality: Nome do município
            school: Nome da escola
        """
        tables_sql = {
            'alunos': f"""
                CREATE TABLE IF NOT EXISTS raw_{municipality}_cadastro_alunos (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    nome VARCHAR(255) NOT NULL,
                    matricula VARCHAR(50) UNIQUE NOT NULL,
                    cpf VARCHAR(14),
                    data_nascimento DATE,
                    turma VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """,
            'notas': f"""
                CREATE TABLE IF NOT EXISTS {self.create_table_name(municipality, school, 'notas')} (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    aluno_id UUID REFERENCES raw_{municipality}_cadastro_alunos(id),
                    disciplina VARCHAR(50) NOT NULL,
                    bimestre1 NUMERIC(3,1),
                    bimestre2 NUMERIC(3,1),
                    bimestre3 NUMERIC(3,1),
                    bimestre4 NUMERIC(3,1),
                    media_final NUMERIC(3,1) GENERATED ALWAYS AS (
                        (COALESCE(bimestre1, 0) + COALESCE(bimestre2, 0) + 
                         COALESCE(bimestre3, 0) + COALESCE(bimestre4, 0)) / 
                        NULLIF((CASE WHEN bimestre1 IS NOT NULL THEN 1 ELSE 0 END +
                                CASE WHEN bimestre2 IS NOT NULL THEN 1 ELSE 0 END +
                                CASE WHEN bimestre3 IS NOT NULL THEN 1 ELSE 0 END +
                                CASE WHEN bimestre4 IS NOT NULL THEN 1 ELSE 0 END), 0)
                    ) STORED,
                    status VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """,
            'frequencia': f"""
                CREATE TABLE IF NOT EXISTS {self.create_table_name(municipality, school, 'frequencia')} (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    aluno_id UUID REFERENCES raw_{municipality}_cadastro_alunos(id),
                    data_aula DATE NOT NULL,
                    disciplina VARCHAR(50) NOT NULL,
                    status VARCHAR(10) CHECK (status IN ('presente', 'ausente', 'atrasado')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """
        }
        
        try:
            with self.engine.connect() as conn:
                for table_name, sql in tables_sql.items():
                    conn.execute(sql)
                    print(f"Tabela {table_name} criada/verificada com sucesso")
        except Exception as e:
            print(f"Erro ao criar estrutura: {str(e)}")

# Exemplo de uso
if __name__ == "__main__":
    # String de conexão (substitua pelos dados reais)
    db_string = "postgresql://user:password@localhost:5432/escola_db"
    
    # Inicializar importador
    importer = SchoolDataImporter(db_string)
    
    # Criar estrutura para nova escola
    importer.create_database_structure("campinas", "EMEF_Jardim")
    
    # Simular importação de dados
    print("Sistema de importação de dados escolares inicializado!")
    print("Estrutura de banco criada seguindo o padrão especificado.")
    print("Pronto para importar dados de planilhas Excel.")
