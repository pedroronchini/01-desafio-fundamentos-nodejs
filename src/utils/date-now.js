export function dateNow() {
  const date = new Date();

  const options = { timeZone: 'America/Sao_Paulo', hour12: false };

  const year = date.toLocaleString('en-CA', { ...options, year: 'numeric' });
  const month = date.toLocaleString('en-CA', { ...options, month: '2-digit' });
  const day = date.toLocaleString('en-CA', { ...options, day: '2-digit' });
  const hours = date.toLocaleString('en-CA', { ...options, hour: '2-digit' });
  const minutes = date.toLocaleString('en-CA', { ...options, minute: '2-digit' });
  const seconds = date.toLocaleString('en-CA', { ...options, second: '2-digit' });

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}