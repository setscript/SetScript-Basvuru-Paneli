# Discord Başvuru Paneli Botu

![Başvuru Paneli](https://socialify.git.ci/setscript/SetScript-Basvuru-Paneli/image?description=1&font=Inter&forks=1&language=1&name=1&owner=1&pattern=Floating+Cogs&stargazers=1&theme=Dark)

Discord Başvuru Paneli Botu, sunucularınızda kullanıcıların kolayca başvuru yapmasını sağlayan modern bir bot çözümüdür. Bot, kullanıcı dostu tasarımı ve gelişmiş özellikleriyle sunucunuzu profesyonel hale getirir.

## Özellikler

- Başvuru panelleri oluşturma
- Gelişmiş başvuru yönetimi
- Özelleştirilebilir ayarlar
- Hızlı kurulum ve yapılandırma
- Modern ve kullanıcı dostu arayüz

---

## Teknoloji Altyapısı

- **Backend**: Node.js
- **Database**: CroxyDB
- **Discord.js**: Etkileşimli bot komutları için
- **JavaScript**: Kodlama dili

---

## Başlangıç

### Gereksinimler

- Node.js (En son LTS sürümü)
- npm (Node.js ile birlikte gelir)
- Discord bot token

---

### Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/setscript/SetScript-Basvuru-Paneli.git
cd SetScript-Basvuru-Paneli
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Gerekli ayarları yapılandırın:
`config.json` dosyasını düzenleyerek Discord bot tokeninizi ve diğer ayarları girin.

4. Botu başlatın:
```bash
node start.bat
```

---

## Proje Yapısı

```
SetScript-Basvuru-Paneli/
├── commands/                 # Komut dosyaları
│   └── basvuru-panel.js      # Başvuru paneli komutları
├── croxydb/                  # Veritabanı dosyaları
│   └── croxydb.json          # JSON tabanlı veritabanı
├── events/                   # Etkinlik dosyaları
│   ├── interactionCreate.js  # Etkileşim olayları
│   └── ready.js              # Botun başlatılma olayı
├── config.json               # Bot yapılandırma dosyası
├── index.js                  # Ana bot dosyası
├── package.json              # Proje bağımlılıkları
├── package-lock.json         # Bağımlılık kilit dosyası
├── README.md                 # Proje açıklaması
└── start.bat                 # Windows için hızlı başlangıç dosyası
```

---

## Önemli Bilgiler

> **Not:**  
> - `config.json` dosyasını dikkatlice doldurun. Yanlış bilgiler botun çalışmamasına neden olabilir.  
> - Bot, başvuru panellerini ve kullanıcı verilerini `croxydb` kullanarak yönetir.  
> - Komutların doğru çalışması için yetkili rol ayarlarını yapmayı unutmayın.

---

## Katkıda Bulunma

Projenin geliştirilmesine katkı sağlamak isterseniz, Pull Request göndererek destek olabilirsiniz.

---

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için `LICENSE` dosyasına göz atabilirsiniz.

---

<p align="center">
  ❤️ SetScript@oktayyavuz tarafından geliştirildi
</p>
