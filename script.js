const input = document.getElementById('noteInput');
const processBtn = document.getElementById('processBtn');
const output = document.getElementById('output');
const downloadBtn = document.getElementById('downloadBtn');

processBtn.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) {
    alert('Please paste your note first!');
    return;
  }

  output.innerHTML = "⏳ Restructuring your note... please wait.";

  try {
    const response = await fetch("/.netlify/functions/ai", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    const data = await response.json();

    output.innerHTML = `<h2>Reformatted Notes</h2><p>${data.result.replace(/\n/g, '<br>')}</p>`;
    downloadBtn.style.display = 'block';
  } catch (err) {
    output.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});

downloadBtn.addEventListener('click', () => {
  const element = document.getElementById('output');
  html2pdf().from(element).save('restructured-note.pdf');
});
