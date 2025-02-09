import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { parse } from 'csv-parse';

// Caso esteja utilizando uma versão do Node inferior à 18, 
// instale o 'node-fetch' (npm install node-fetch) e descomente a linha abaixo:
// import fetch from 'node-fetch';

function importCSV() {
  const csvFilePath = new URL('./assets/tasks.csv', import.meta.url);;

  // Lê o conteúdo do arquivo CSV utilizando a API de promessas do fs
  readFile(csvFilePath, 'utf8')
    .then(content => {
      // Cria um stream a partir do conteúdo lido.  
      // Usamos um array com uma única string para garantir que o stream emita o conteúdo por completo.
      const stream = Readable.from([content]);

      // Configura o parser para ignorar a primeira linha (cabeçalho) e tratar os delimitadores
      const parser = stream.pipe(
        parse({
          delimiter: ',',
          from_line: 2, // pula o cabeçalho
          trim: true,
        })
      );

      // Itera de forma assíncrona sobre cada registro do CSV
      (async () => {
        for await (const record of parser) {
          const [title, description] = record;

          // Realiza a requisição POST utilizando fetch com encadeamento then
          fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
          })
            .then(response => {
              if (!response.ok) {
                // Se a resposta não for bem-sucedida, lança um erro
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text();
            })
            .then(data => {
              console.log(`Task "${title}" criada com sucesso!`, data);
            })
            .catch(error => {
              console.error(`Erro ao criar a task "${title}": ${error.message}`);
            });
        }
      })();
    })
    .catch(error => {
      console.error('Erro ao ler o arquivo CSV:', error);
    });
}

importCSV();
