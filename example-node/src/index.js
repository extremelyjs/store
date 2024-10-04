import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const delay = ms => new Promise(resolve => {
    setTimeout(resolve, ms);
});

app.get('/', async (req, res) => {
    await delay(5000);
    res.send(req.query);
});

app.get('/music', async (req, res) => {
    await delay(5000);
    res.send({
        id: 2,
        url: 'https://music.163.com/song/media/outer/url?id=2.mp3',
        title: '3',
        artist: '艺术家',
    }
    );
});

app.get('/test', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Login Form</title>
      </head>
      <body>
          账号: <input type="text" name="username"><br>
          密码: <input type="password" name="password"><br>
          <button id="login">登录</button>
      </body>
      <script>
          const username = document.querySelector('input[name="username"]');
          const password = document.querySelector('input[name="password"]');
          function login() {
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            }).then(res => res.json()).then(({code, msg}) => {
                alert(msg);
            });
          }
          document.querySelector('#login').addEventListener('click', login);
      </script>
      </html>
  `);
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (username === 'admin' && password === '123456') {
        res.send({
            code: 200,
            msg: '登录成功',
            data: {
                token: '<KEY>',
            },
        });
    }
    res.send({
        code: 403,
        msg: '登录失败',
    });
});

app.listen(3000, () => {
    console.info('Example app listening on port 3000!');
});
