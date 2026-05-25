import fetch from 'node-fetch';
const RESEND_API_KEY = 're_3BRF52cA_MDqUopA8zx84snUQqC7QjN4E';
async function testEmail() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'BIBAZ <noreply@majedahmed.space>',
      to: 'delivered@resend.dev',
      subject: 'Test Email from BIBAZ',
      html: '<strong>It works!</strong>'
    })
  });
  const data = await res.json();
  console.log(data);
}
testEmail();
