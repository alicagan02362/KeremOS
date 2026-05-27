# 🐻 KeremOS Geliştirme ve Canlıya Alma Rehberi

Bu rehber, **Kerci nano-57** gücüyle çalışan **KeremOS v9.5 Neural Island** projesini hem kendi bilgisayarında nasıl çalıştıracağını hem de GitHub'a yükleyip tüm dünyaya nasıl açacağını adım adım göstermektedir.

---

## 🛠️ Yöntem 1: Yerel Bilgisayarda Çalıştırma (Geliştirici Yolu)

Projeyi kendi bilgisayar ortamında tamamen kontrol etmek ve kod üzerinde değişiklikler yapmak için en kararlı yöntem budur.

### Adım 1: Node.js Kurulumu

Projenin çalışması için bilgisayarında Node.js yüklü olmalıdır. Eğer yüklü değilse, [nodejs.org](https://nodejs.org/) adresine giderek **LTS (Kararlı)** sürümünü indirip kurun.

### Adım 2: Vite + React Projesi Oluşturma

Terminali (Komut Satırını) açın ve projenin kurulmasını istediğiniz dizine giderek aşağıdaki komutları sırasıyla çalıştırın:

```bash
# Yeni bir Vite React projesi oluşturur
npm create vite@latest keremos -- --template react

# Proje klasörünün içine girer
cd keremos

```

### Adım 3: Gerekli Paketlerin Yüklenmesi

KeremOS bünyesindeki ikon kütüphanesini ve ses motorunun kararlı çalışmasını sağlamak için terminalde şu komutu çalıştırın:

```bash
npm install
npm install lucide-react

```

### Adım 4: Tailwind CSS Kurulumu & Yapılandırması

Projedeki modern arayüz tasarımlarının (cam efekti, gölgelendirmeler) yüklenebilmesi için Tailwind CSS entegrasyonunu yapın:

```bash
# Tailwind ve gerekli araçları kurar
npm install -D tailwindcss postcss autoprefixer

# Yapılandırma dosyalarını oluşturur
npx tailwindcss init -p

```

Oluşan `tailwind.config.js` dosyasını açın ve `content` kısmını aşağıdaki gibi güncelleyin:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

Ardından, `src/index.css` dosyasının içindeki her şeyi silip en üstüne şu 3 satırı ekleyin:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

# Adım 5: Kodun Entegre Edilmesi ve Çalıştırılması

1. Proje klasöründeki `src/App.jsx` dosyasını açın.
2. İçindeki tüm eski kodları silin.
3. Ürettiğimiz **`keremos.jsx` kodunun tamamını** buraya yapıştırıp kaydedin.
4. Terminale geri dönüp şu komutla sistemi ayağa kaldırın:

```bash
npm run dev

```

> 🌐 Terminal ekranında çıkan yerel adrese (Örn: `http://localhost:5173`) tarayıcından girerek KeremOS'u kilit ekranından itibaren canlı olarak kullanabilirsin!

---

## ⚡ Yöntem 2: Bulut Üzerinde Hızlı Deneme (Kurulumsuz Yol)

Bilgisayarına hiçbir program indirmeden, kodu saniyeler içinde tarayıcıda çalıştırmak ve test etmek için bu yöntemi kullanabilirsin.

* **Adım 1:** [StackBlitz](https://stackblitz.com/) veya [CodeSandbox](https://www.google.com/search?q=https://codesandbox.co/) sitesine gidin.
* **Adım 2:** Yeni bir **Vite React** projesi (Workspace) başlatın.
* **Adım 3:** Sol menüde yer alan paket yönetim alanından (Dependencies) `lucide-react` paketini aratıp projeye dahil edin.
* **Adım 4:** Projedeki varsayılan `App.jsx` dosyasının içeriğini silip KeremOS kodlarını yapıştırın. Sağ taraftaki sanal ekranda sistem anında çalışacaktır.

---

## 🚀 Yöntem 3: GitHub & Vercel ile Tüm Dünyaya Dağıtım (Portfolyo)

Projeni GitHub'a yükledikten sonra, insanların hiçbir şey indirmeden tarayıcı üzerinden KeremOS'u canlı canlı deneyimlemesini (Live Demo) sağlayabilirsin.

### Adım 1: Kodları GitHub'a Yükleme

1. [GitHub](https://github.com/) üzerinde `keremos` adında yeni bir genel (Public) depo (Repository) açın.
2. Bilgisayarındaki proje klasörünü bu depoya bağlayıp kodları `main` dalına (branch) gönderin (`git push`).

### Adım 2: Vercel Entegrasyonu

1. [Vercel](https://vercel.com/) sitesine gidin ve GitHub hesabınızla ücretsiz üye olun.
2. Giriş yaptıktan sonra panelden **"Add New" > "Project"** butonuna tıklayın.
3. Listeden GitHub'a yüklediğiniz `keremos` deposunu bulun ve yanındaki **"Import"** butonuna basın.
4. **Framework Preset** kısmının *Vite* olarak seçili olduğunu onaylayın ve hiçbir ayara dokunmadan **"Deploy"** butonuna tıklayın.

> 🏆 Yaklaşık 20-30 saniye sonra Vercel sana `keremos.vercel.app` gibi harika bir canlı web sitesi linki verecektir. Bu linki GitHub deponun açıklama kısmına koyarak portfolyonu herkese gösterebilirsin!

---

## 📊 Yöntem Karşılaştırma Tablosu

| Özellik | Yöntem 1: Yerel PC | Yöntem 2: Sandbox | Yöntem 3: Vercel (Canlı) |
| --- | --- | --- | --- |
| **Kurulum Gereksinimi** | Node.js ve Terminal gerekir | Gerekmez (Online) | Sadece GitHub hesabı gerekir |
| **Kullanım Amacı** | Kod geliştirme ve test | Hızlı önizleme yapma | Portfolyo ve başkalarıyla paylaşım |
| **Hız / Performans** | Tamamen bilgisayar gücünde | Bulut sunucusuna bağlı | Optimize ve çok hızlı |
