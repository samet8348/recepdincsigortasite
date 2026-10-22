# Recep Dinç Sigorta — Kurumsal Web Sitesi

Kurumsal ana sayfa ve ayrı, birbirine bağlı sigorta rehber sayfaları içerir. Tasarım, kullanıcı tarafından sağlanan Recep Dinç Sigorta logosu ve kurumsal lacivert renkleriyle hazırlanmıştır.

## Sayfalar
- `index.html`: ana sayfa, sigorta branşları, rehber bağlantıları, teklif formu, kurum anlatımı ve harita bölümü
- `trafik-sigortasi.html`: zorunlu trafik sigortası ürün rehberi
- `imm-sigortasi.html`: İMM / İhtiyari Mali Mesuliyet ürün rehberi; 2026 trafik sigortası limitleri, limit aşımı riski, sık sorulan sorular ve WhatsApp teklif bağlantısı
- `kasko-sigortasi.html`: kasko ürün rehberi
- `konut-sigortasi.html`: konut sigortası ürün rehberi
- `dask.html`: DASK / Zorunlu Deprem Sigortası rehberi
- `is-yeri-sigortasi.html`: iş yeri sigortası ürün rehberi
- `tamamlayici-saglik-sigortasi.html`: tamamlayıcı sağlık sigortası rehberi, SGK ve anlaşmalı kurum ağı, teminatlar, bekleme süreleri ve SSS
- `ozel-saglik-sigortasi.html`: özel sağlık sigortası rehberi, ayakta/yatarak tedavi, kurum ağı, limitler ve SSS
- `diger-sigorta-cozumleri.html`: ferdi kaza, nakliyat, seyahat sağlık, sorumluluk, tarım/TARSİM ve diğer ihtiyaçlar için rehber
- `bize-ulasin.html`: ofis adresi, gömülü Google Maps haritası ve yol tarifi bağlantısı
- `duyurular.html`: müşterilere açık güncel duyurular ve kampanya listesi
- `duyuru-yonetimi.html`: duyuru/kampanya oluşturmak, düzenlemek, silmek ve yayın JSON dosyası indirmek için yönetim aracı
- `duyurular.json`: web sitesinde yayınlanan kampanya verileri
- `announcements.js`, `campaign-manager.js`: duyuruların gösterimi ve yönetim aracı davranışları
- `style.css`: responsive kurumsal tasarım
- `script.js`: mobil menü, teklif formu ve WhatsApp akışları
- `assets/recep-dinc-sigorta-logo.png`: sağlanan kurumsal logo
- `sitemap.xml`, `robots.txt`: arama motorlarının sayfaları keşfetmesine yardımcı olacak dosyalar

## SEO temel hazırlıkları
Her ürün sayfasında özgün title ve meta description, canonical, Open Graph etiketleri, hiyerarşik başlıklar, ilgili sayfalara dahili bağlantılar, BreadcrumbList ve Service yapılandırılmış verileri bulunur. Sık sorulan sorular da sayfa içeriğine eklenmiştir. Bu teknik hazırlıklar taranabilirliği ve içeriğin anlaşılmasını destekler; arama motorlarında indekslenme veya belirli sıralama garantisi vermez.

## Önizleme
Yerel olarak `index.html` dosyasını açın. Ürün kartlarındaki “Ürün bilgileri” bağlantıları ayrı ürün sayfalarına gider. Yerel dosya olarak açıldığında harita, Google Fonts ve harici fotoğraf alanı için internet bağlantısı gerekir.

## Yayına almadan önce
1. Tüm HTML dosyalarını, `style.css`, `script.js`, `assets/` klasörünü, `robots.txt` ve `sitemap.xml` dosyalarını aynı site kök dizinine yükleyin.
2. `script.js` içindeki `WHATSAPP_NUMBER` alanının `905336344466` olarak doğru kaldığını yayına almadan önce kontrol edin.
3. Site canlı olarak açıldıktan sonra Google Search Console'da alan adını doğrulayın, `https://www.recepdincsigorta.com/sitemap.xml` adresini gönderin ve indeksleme durumunu takip edin.
4. Alan adınızın www / www olmayan sürümünü tek bir kanonik sürüme yönlendirin. DNS, HTTPS ve canonical URL'lerin gerçek yayın yapılandırmasıyla uyumlu olduğunu kontrol edin.
5. İletişim/aydınlatma metinlerini, çerezleri ve veri işleme süreçlerini işletme uygulamalarınıza göre gözden geçirin.

## Adres
Recep Dinç Sigorta — Orta Mahalle Soğan Pazarı Caddesi No:57/101, Adapazarı/Sakarya.

Ürün açıklamaları genel bilgilendirme amaçlıdır; teminatlar, limitler, istisnalar, prim ve kabul koşulları şirket ve poliçe şartlarına göre değişebilir.


Güncel tasarım: masaüstü ve mobilde ayrı düzenlenen hızlı iletişim şeridi, doğrudan ofis araması ve WhatsApp teklif bağlantısı içerir.


## Acenteliklerimiz alanı
Ana sayfada yedi sigorta şirketi logosu ve en sonda TARSİM logosu bulunur. Kartlar bağlantı içermez ve herhangi bir şirkete yönlendirme yapmaz. Masaüstünde logolar gri/soluk görünür, üzerine gelindiğinde yumuşak geçişle renklenir. Dokunmatik ekranlarda logoya dokunarak renkli görünüm etkinleşebilir. TARSİM, Tarım Sigortaları Havuzu olarak ayrıca etiketlenmiştir. Quick Sigorta logosu yerel `assets/quick-sigorta-logo.png` dosyasından yüklenir; harici alan adına bağlı değildir.

## Ürün sırası ve teklif akışı
Ana sayfa ürün kartları sırası: Trafik, İMM, Kasko, Konut, DASK, İş Yeri, Tamamlayıcı Sağlık, Özel Sağlık ve Diğer Sigorta İhtiyaçları. Tamamlayıcı Sağlık, Özel Sağlık ve İMM kartlarından ayrı bilgi sayfalarına gidilir. “Diğer Sigorta İhtiyaçları” rehberinde ferdi kaza, nakliyat, seyahat sağlık, sorumluluk, tarım/TARSİM ve işletmelere yönelik diğer ürünler açıklanır. Teklifler şimdilik WhatsApp mesajı olarak hazırlanır; kullanıcı gönderimi WhatsApp içinde tamamlar.

Quick Sigorta logosu `assets/quick-sigorta-logo.png` ve SVG yedeğiyle yerel pakete dahildir; ana sayfada yükleme için internet bağlantısına ihtiyaç duymaz.

Quick Sigorta markası yerel PNG dosyasından gösterilir; böylece dış sunucu erişim sorunu nedeniyle logonun kaybolması önlenir.


Quick Sigorta logo is included as a local cropped PNG at `assets/quick-sigorta-logo.png`, using the logo supplied for this update.


## Teklif formu ve WhatsApp
Ana sayfadaki form alanları yazılabilir ve seçilebilir. “Talebimi WhatsApp'tan İlet” hızlı düğmesi, girilmiş alanları mesaj taslağına aktarır; alanlar boşsa genel bir mesaj hazırlar. Ziyaretçi WhatsApp ekranında Gönder düğmesine kendisi basar; site teklifleri kendi sunucusunda saklamaz. Kişisel bilgiler içeren hızlı mesaj için onay kutusu işaretlenmelidir.

## Paket dosyaları
Bu pakette `style.css`, `script.js` ve `assets/` klasörü bulunur. Tüm HTML sayfaları bu ortak CSS ve JS dosyalarını kullanır; paket bütün olarak yüklenmelidir.


## Tema seçenekleri ve ürün görselleri
Ana sayfada dokuz sigorta ürün kartının ölçüleri korunarak kartların sağ alt alanına ürün fotoğrafları eklendi. Aynı fotoğraflar “Her ürün için ayrı bilgi sayfası” rehber bağlantılarında küçük görseller olarak kullanılır. Fotoğraflar `assets/products/` içinde yerel olarak paketlenmiştir.

Site ilk kez açık temayla açılır; ziyaretçi üst menüdeki tema düğmesiyle koyu temayı seçebilir. Seçim aynı tarayıcıda sayfalar arasında hatırlanır. Seçim aynı tarayıcıda tüm sayfalarda hatırlanır. Mobil menüde de tema seçimi bulunur. Teklif formunda yalnızca “Talebimi WhatsApp'tan İlet” ana düğmesi gösterilir; form alanları boş olsa da genel bir talep mesajı hazırlanabilir. WhatsApp mesajı kullanıcı tarafından WhatsApp ekranında gönderilir.


## Duyurular ve kampanyalar yönetimi
- Menüdeki “Duyurular & Kampanyalar” bağlantısı, `duyurular.html` sayfasını açar. Ana sayfada, yayında ve tarih aralığı geçerli duyurular olduğunda kısa bir kampanya alanı görünür.
- Duyuru oluşturmak için `duyuru-yonetimi.html` dosyasını açın. Başlık, tür, başlangıç/bitiş tarihi, kart görseli, kısa açıklama ve detay girebilirsiniz. İndirimleri açıklama metninde duyurabilirsiniz; indirim kodu/kupon alanı yoktur. Hazır görsel seçebilir veya bilgisayarınızdan görsel yükleyebilirsiniz. Yüklenen görsel optimize edilerek yayın JSON dosyasına dahil edilir. Taslaklar tarayıcınızda saklanır.
- Statik HTML sitede panelin sunucuya doğrudan yazma yetkisi yoktur. Değişiklikleri tüm ziyaretçilere yayınlamak için panelde “Yayın dosyasını indir (duyurular.json)” düğmesine basın ve indirilen `duyurular.json` dosyasını hosting ana dizinine yükleyip mevcut dosyanın üzerine yazın. Böylece her kampanyada HTML düzenlemeniz gerekmez.
- `duyuru-yonetimi.html` bir sunucu oturum açma sistemi değildir. Doğrudan sunucuya kaydetme ve güvenli yönetici girişi için hostingte sunucu taraflı API/CMS veya erişim koruması kurulmalıdır. `noindex` ve `robots.txt` erişim güvenliği sağlamaz.
