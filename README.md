# VidKH server — ដំឡើងលើ VPS (Ubuntu 22.04/24.04)

## 1. ដំឡើង Node.js និង nginx
```bash
sudo apt update && sudo apt install -y nodejs nginx certbot python3-certbot-nginx
node --version   # ត្រូវការ Node.js 18 ឡើងទៅ
sudo useradd --system --home /opt/vidkh vidkh
```

## 2. ដាក់ឯកសារ
```bash
sudo mkdir -p /opt/vidkh /var/lib/vidkh
sudo cp server.js /opt/vidkh/
sudo cp .env.example /opt/vidkh/.env   # កែតម្លៃក្នុង .env
sudo chown -R vidkh:vidkh /var/lib/vidkh
```
កែ `.env`: ដាក់ `GEMINI_API_KEY` និង `GEMINI_MODEL`។ **កុំដាក់ API key ក្នុងកូដ HTML។**

## 3. ចាប់ផ្តើម service
```bash
sudo cp vidkh.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now vidkh
curl http://127.0.0.1:3000/api/health   # ត្រូវឃើញ {"ok":true}
```

## 4. nginx + HTTPS
```bash
sudo cp nginx.conf /etc/nginx/sites-available/vidkh   # កែ server_name
sudo ln -s /etc/nginx/sites-available/vidkh /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.example
```

## 5. ផ្ទៀតផ្ទាត់
```bash
curl https://your-domain.example/api/health
```

## API សង្ខេប
| Method | Path | ការងារ |
|---|---|---|
| POST | /api/signup | បង្កើតគណនី (`name`, `password`) — ទទួលកាក់ដំបូង |
| POST | /api/login | ចូលគណនី |
| GET | /api/me | ពិនិត្យកាក់ (Header `Authorization: Bearer <token>`) |
| POST | /api/store | បង្ហោះ APK (`name`, `apk` base64, `photos` ៣ data URL) — កាក់ 50 |
| GET | /api/store | បញ្ជី APK |
| GET | /api/store/photo?id=&i= | រូបថត |
| GET | /api/store/download?id= | ទាញយក APK |
| POST | /api/ads | ដាក់ពាណិជ្ជកម្ម (`text`, `image` optional) — ខ្លី 20 / វែង 50 |
| GET | /api/ads | បញ្ជីពាណិជ្ជកម្ម (បង្ហាញ 300 វិនាទីម្តង) |
| POST | /api/ai | សួរ AI (`prompt`) — ត្រូវការ GEMINI_API_KEY |

## ចំណាំសុវត្ថិភាព
- Token ផ្ទុកជា SHA-256 ហើយពាក្យសម្ងាត់ប្រើ scrypt។ ប្រើ HTTPS ជានិច្ច។
- កាក់ត្រូវកត់ត្រាក្នុង `db.json` (បាត់ទិន្នន័យបើម៉ាស៊ីនខូច)។ ត្រូវ backup `/var/lib/vidkh` ជាទៀងទាត់។
- ការបង់លុយពិត និងការពិនិត្យ APK (antivirus) មិនបានបញ្ចូលទេ។
- Rate limit មិនបានបញ្ចូលទេ ត្រូវបន្ថែមមុនបើកឲ្យសាធារណៈ។
