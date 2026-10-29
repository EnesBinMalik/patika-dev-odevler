const express = require('express');

const app = express();
const port = 3000;

// Ödev 7: GET isteği içerisinde blog içeriğini gönderme
// Hazırlayan / İmzası: ENES Öztürk
app.get('/', (req, res) => {
  const blog = {
    id: 1,
    title: 'Blog title',
    description: 'Blog description',
  };
  res.send(blog);
});

app.listen(port, () => {
  console.log(`CleanBlog sunucusu http://localhost:${port} adresinde başlatıldı.`);
});
