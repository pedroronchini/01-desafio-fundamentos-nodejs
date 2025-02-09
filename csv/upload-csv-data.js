export async function uploadCsvData(csvStream) {
  for await (const record of csvStream) {
    console.log(record)
    // await fetch('http://localhost:3333/tasks', {
    //   method: 'POST',
    //   body: record,
    //   headers: { 'Content-Type': 'application/json' },
    //   duplex: 'half',
    // })
    //   .then(response => response.text())
    //   .then(data => {
    //     console.log(data)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   });
  }
}