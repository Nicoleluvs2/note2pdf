const noteBox = document.getElementById('note');
const output = document.getElementById('output');
const styleBox = document.getElementById('style');

document.getElementById('generate').addEventListener('click', async () => {
  output.innerHTML = '⏳ Formatting... please wait.';
  const res = await fetch('/.netlify/functions/formatNote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      note: noteBox.value,
      style: styleBox.value
    })
  });
  const data = await res.json();
  output.innerHTML = data.html || '❌ Error formatting note';
});

document.getElementById('download').addEventListener('click', () => {
  if (!output.innerHTML.trim()) return alert('No content to download');
  html2pdf().from(output).save('note2pdf.pdf');
});
