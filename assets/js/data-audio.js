/* Audiobooks on Audiohat (audiohatdar.com) — rights: شركة سلاح التلميذ للطباعة والنشر.
   The site plays no sound of its own: the cassette's «استمع على Audiohat» key opens the episode's page there.
   Each entry: [Audiohat book slug (https://www.audiohatdar.com/books/<slug>), minutes or null].
   The 3rd item is unused; an optional 4th names the episode. The midnight list: [title, slug, minutes].
   Long issues are split into several episodes. Catalogue collected 2026-10-20. */
window.AKT = window.AKT || {};
window.AKT.audio = {
	base: 'https://www.audiohatdar.com/books/',
	author: 'https://www.audiohatdar.com/authors/د._أحمد_خالد_توفيق',
	issues: {
		"fantasia-1": [["01__قصة_لا_تنتهي_",113]],
		"fantasia-2": [["02__حكايات_من_والاشيا",110]],
		"fantasia-3": [["03__صفر_صفر_سبعة_",121]],
		"fantasia-4": [["04__إمبراطورية_النجوم",116]],
		"fantasia-5": [["05__ذات_مرة_في_الغرب_",null]],
		"fantasia-6": [["06__خيول_ورماح_",97]],
		"fantasia-7": [["07__ألعاب_إغريقية",100]],
		"fantasia-8": [["08__مملكة_الموتى",103]],
		"mwt-1": [["01_أسطورة_مصاص_الدماء_",null],["01_أسطورة_الرجل_الذئب_",70]],
		"mwt-2": [["02_أسطورة_النداهة_",132]],
		"mwt-3": [["03_أسطورة_وحش_البحيرة_",111]],
		"mwt-4": [["04_أسطورة_آكل_البشر_",109]],
		"mwt-5": [["05_أسطورة_الموتى_الأحياء_",136]],
		"mwt-6": [["06_أسطورة_رأس_ميدوسا_(الجزء_الأول)",76],["06_أسطورة_رأس_ميدوسا_(الجزء_الثاني)",75]],
		"mwt-7": [["07_أسطورة_حارس_الكهف_",139]],
		"mwt-8": [["08_أسطورة_أرض_أخرى_",115]],
		"mwt-9": [["09_أسطورة_لعنة_الفرعون_",126]],
		"mwt-10": [["10_أسطورة_حلقة_الرعب_(الجزء_الأول)",73],["10_أسطورة_حلقة_الرعب_(الجزء_الثاني)",68],["10_أسطورة_حلقة_الرعب_(الجزء_الثالث)",53]],
		"mwt-11": [["11_أسطورة_الكاهن_الأخير_",143]],
		"mwt-12": [["12_أسطورة_البيت_",122]],
		"mwt-13": [["13_أسطورة_اللهب_الأزرق_",91]],
		"mwt-14": [["14_أسطورة_رجل_الثلوج_",125]],
		"mwt-15": [["15_أسطورة_النبات_",128]],
		"mwt-16": [["16_أسطورة_النافاراي_",124]],
		"mwt-17": [["17_أسطورة_حسناء_المقبرة_",130]],
		"mwt-18": [["18_أسطورة_الغرباء_",112]],
		"mwt-19": [["19_أسطورة_بو_",122]],
		"mwt-20": [["20_حكايات_التاروت_",199]],
		"mwt-21": [["21_أسطورة_عدو_الشمس_",111]],
		"mwt-22": [["22_أسطورة_المينوتور_",142]],
		"mwt-23": [["23_أسطورة_رعب_المستنقعات_",114]],
		"mwt-24": [["24_أسطورة_إيجور_",108]],
		"mwt-25": [["25_أسطورة_الجنرال_العائد_",113]],
		"mwt-26": [["26_أسطورة_المواجهة_",105]],
		"mwt-27": [["27_أسطورتنا_",105]],
		"mwt-28": [["28_أسطورة_آخر_الليل_",102]],
		"mwt-29": [["29_أسطورة_الجاثوم_",120]],
		"mwt-31": [["31_أسطورتها_",123]],
		"mwt-32": [["32_أسطورة_رفعت_",129]],
		"mwt-33": [["33_أسطورة_أرض_المغول_",131]],
		"mwt-34": [["34_أسطورة_الشاحبين_(جزء_أول)",45],["34_أسطورة_الشاحبين_(جزء_ثاني)",58]],
		"mwt-35": [["35_أسطورة_دماء_دراكيولا_",92]],
		"mwt-36": [["36_أسطورة_الفصيلة_السادسة_",111]],
		"mwt-37": [["37_أسطورة_الدمية_",127]],
		"mwt-38": [["38_أسطورة_النصف_الآخر_",102]],
		"mwt-39": [["39_أسطورة_التوءمين_",117]],
		"mwt-40": [["40_وراء_الباب_المغلق__الجزء_الأول",null],["40_وراء_الباب_المغلق__الجزء_الثاني",56],["40_وراء_الباب_المغلق__الجزء_الثالث",55]],
		"mwt-41": [["41_أسطورة_فرانكنشتاين_",134]],
		"mwt-42": [["42_أسطورة_الكلمات_السبع_",131]],
		"mwt-43": [["43_أسطورة_تختلف_",87]],
		"mwt-44": [["44_أسطورة_رجل_بكين_",133]],
		"mwt-45": [["45_أسطورة_بيت_الأفاعي_",90]],
		"mwt-46": [["46_أسطورة_طفل_آخر_",134]],
		"mwt-47": [["47_أسطورة_المنزل_رقم_5_",128]],
		"mwt-48": [["48_أسطورة_المومياء_",134]],
		"mwt-49": [["49_أسطورة_العشيرة_",143]],
		"mwt-50": [["01_في_جانب_النجوم_",65],["02_في_جانب_النجوم_",56],["03_في_جانب_النجوم",48]],
		"mwt-51": [["51_أسطورة_الرقم_المشؤوم_",134]],
		"mwt-52": [["52_أسطورة_مملة_",141]],
		"mwt-53": [["53_أسطورة_النبوءة_",117]],
		"mwt-54": [["54_أسطورة_العراف_",131]],
		"mwt-55": [["55_أسطورة_فاي_99_",134]],
		"mwt-56": [["56_أسطورة_ملك_الذباب_",150]],
		"mwt-57": [["57_أسطورة_المقبرة_",146]],
		"mwt-58": [["58_أسطورة_أرض_العظايا_",135]],
		"mwt-59": [["59_أسطورة_رونيل_السوداء_",139]],
		"mwt-60": [["60_المتحف_الأسود_01",63],["60_المتحف_الأسود_02",62],["60_المتحف_الأسود_03",52]],
		"mwt-61": [["61_أسطورة_الشيء_",141]],
		"mwt-62": [["62_أسطورة_صندوق_بندورا_",140]],
		"mwt-63": [["63_أسطورة_المحركين_(أنت_لي)",67],["63_أسطورة_المحركين_(كونداليني)",58]],
		"mwt-64": [["أسطورتهم_(تحت_تصرفك)_64_",32],["أسطورتهم_(الشوارع_حواديت)_64",40],["أسطورتهم_(لك_يا_سيدتي)_64",34]],
		"mwt-65": [["65_أسطورة_العلامات_الدامية_(جزء_أول)",96],["65_أسطورة_العلامات_الدامية_(جزء_ثاني)",101],["65_أسطورة_العلامات_الدامية_(جزء_ثالث)",95]],
		"mwt-66": [["66_أسطورة_الرجال_الذين_لم_يعودوا_كذلك_(جزء_أول)",99],["66_أسطورة_الرجال_الذين_لم_يعودوا_كذلك_(جزء_ثاني)",97],["66_أسطورة_الرجال_الذين_لم_يعودوا_كذلك_(جزء_ثالث)",102]],
		"mwt-67": [["67_أسطورة_بيت_الأشباح_01",85],["67_أسطورة_بيت_الأشباح_02",93],["67_أسطورة_بيت_الأشباح_03",66]],
		"mwt-68": [["68_أسطورة_أرض_الظلام_01",102],["68_أسطورة_أرض_الظلام_02",109]],
		"mwt-69": [["69_أسطورة_نادي_الغيلان_01",93],["69_أسطورة_نادي_الغيلان_02",87],["69_أسطورة_نادي_الغيلان_03",98]],
		"mwt-71": [["71_أسطورة_الظلال_01",102],["71_أسطورة_الظلال_02",null]],
		"mwt-72": [["72_أسطورة_الطوطم_01",114],["72_أسطورة_الطوطم_02",130]],
		"mwt-73": [["73_أسطورة_شبه_مخيفة_01",126],["73_أسطورة_شبه_مخيفة_02",98]],
		"mwt-78": [["78_أسطورة_حامل_الضياء_(جزء_أول)",95],["78_أسطورة_حامل_الضياء_(جزء_ثاني)",87]],
		"mwt-79": [["79_أسطورة_حامل_الضياء_(جزء_ثالث)",94],["79_أسطورة_حامل_الضياء_(جزء_رابع)",95]]
	},
	/* Audiohat's own short-episode programme of his stories: [title, slug, minutes] */
	midnight: [
		["الزوجة تعرف أكثر","70_الزوجة_تعرف_أكثر",27],
		["تحت","70_تحت",19],
		["مرب فاضل","70_مرب_فاضل",16],
		["نوبتجية","70_نوبتجية",15],
		["موهبتي","70_موهبتي",13],
		["حكاية بيسة وسوسو","70_حكاية_بيسة_وسوسو",19],
		["الاخ السابع","70__الاخ_السابع",15],
		["محموووود","70_محموووود",15],
		["الزوج الذي عاد","30_الزوج_الذي_عاد",27],
		["فكرة غير عادية","30_فكرة_غير_عادية",19],
		["حكاية من المشرحة","30_حكاية_من_المشرحة",19],
		["الحافلة","30_الحافلة",24],
		["في غرفة نومي","70_في_غرفة_نومي",15],
		["قل لي يا أونكل","30_قل_لي_يا_أونكل",18],
		["زنزانة خريولسن - من أنا","70_زنزانة_خريولسن_-_من_أنا",14],
		["أكواريوم","70_أكواريوم",14],
		["بس بس ناو","30_بس_بس_ناو",23],
		["على الإيقاع","70_على_الإيقاع",18],
		["الشقة رقم 9","30_الشقة_رقم_9",18]
	]
};

/* Safari as radio drama on YouTube — the "Tasgeel - تسجيل" channel's playlist, one video per issue.
   Each entry: [YouTube video id] or [id, 0] when the uploader has switched off embedding
   (those open on YouTube instead of playing in the cassette). Checked 2026-10-20. */
window.AKT.audio.youtube = {
	channel: { name: "Tasgeel - تسجيل", url: "https://www.youtube.com/playlist?list=PLd2bItOIVSNnJ42x9WsGGOcDFYRRy2X5q" },
	issues: {
		"safari-1": [["rVfqKYAdS0E"],["EXslhnXCSw8"]],
		"safari-2": [["TBwDjsus-Wg"]],
		"safari-3": [["Z4LLY-RT4Rs"]],
		"safari-4": [["ZbzMmRQKIZk"]],
		"safari-5": [["dxKdnKMmU90"]],
		"safari-6": [["HjFQFYqiB9U"]],
		"safari-7": [["62_6ci6dw04"]],
		"safari-8": [["OFHdrjvNbvE"]],
		"safari-9": [["dVNAj7dt2dw"]],
		"safari-10": [["QHo7JM9i13g"]],
		"safari-11": [["zPXmUuNsA0c"]],
		"safari-12": [["v4T-pTaoRyA"]],
		"safari-13": [["-yH8r43SHy0"]],
		"safari-14": [["7_TCGXJpW5Y"]],
		"safari-15": [["aKhn-m4jq08"]],
		"safari-16": [["ClqI1f9epDA",0]],
		"safari-17": [["tv3kSOgj32c",0]],
		"safari-18": [["9VrpKqMiQr0",0]],
		"safari-19": [["somFMrN0bs4",0]],
		"safari-20": [["WIr2roWWgY4"]],
		"safari-21": [["6rm0wf_2BM0"]],
		"safari-22": [["51-FRUXSuEA",0]],
		"safari-23": [["nWptiWfaXGA"]],
		"safari-24": [["hzPfm2JsdnY"]],
		"safari-25": [["0SBg9FEgmdI"]],
		"safari-26": [["wng6F3U4Miw"]],
		"safari-27": [["02t0iuM2qug"]],
		"safari-28": [["ggfWPz-CF58",0]],
		"safari-29": [["D1kGFW3y_pg"]],
		"safari-30": [["PyZbow_SHZ8"]],
		"safari-31": [["ZUaUAS7El5Q"]],
		"safari-32": [["8LTX7EtT31o",0]],
		"safari-33": [["OYVtOgHY4k8"]],
		"safari-34": [["xc_oxQbjeXo"]],
		"safari-35": [["l8N12L3owPU"]],
		"safari-36": [["YZfHQWDeFgM"]],
		"safari-37": [["n1G_AWNPZg0"]],
		"safari-38": [["9dQWtT5clfk"]],
		"safari-39": [["hB9M-XDjwuA"]],
		"safari-40": [["rY4KfrLgvZU"]],
		"safari-41": [["qMWhlKj_NDY"]],
		"safari-42": [["CGZLKVdFV88"]],
		"safari-43": [["f4tfHeuvGVo"]],
		"safari-44": [["nHMiCmhfBrI"]],
		"safari-45": [["ewBybqeCcn4"]]
	}
};

/* Ma Wara' al-Tabi'a special issue 1, «في كهوف دراجوسان» — an interactive gamebook, dramatised by
   Audiohat on its YouTube channel, one video per cave. Entries: [videoId, embeddable (1/0), label]. Checked 2026-10-20. */
window.AKT.audio.youtube.channels = window.AKT.audio.youtube.channels || {};
window.AKT.audio.youtube.channels["mwt-s1"] = { name: "أوديوهات – كتب صوتية درامية", url: "https://www.youtube.com/playlist?list=PLUyXOmCVyikFTVOW5xfa7gQKQYs8UVweQ" };
window.AKT.audio.youtube.issues["mwt-s1"] = [
	["KZkQXbcA9J0",1,"البداية · خريطة الطريق"],
	["T0iaR729H-w",1,"كهف 12"],
	["zwvUFYIKu3c",1,"كهف 17 · أن أتبعه"],
	["tgszwQJ5AH4",1,"كهف 20"],
	["8A2O6LL1xhY",1,"كهف 27 · تاريخ اليوم يقبل القسمة على اثنين"],
	["wRmo4aMCviU",1,"كهف 29 · فشلت فى حل اللغز"],
	["3MvD4TrKGW8",1,"كهف 30 · أن أعود"],
	["-Tt__TK5aRU",1,"كهف 31"],
	["PmqEjsE8wyY",1,"كهف 35"],
	["gjwFKhTtdhQ",1,"كهف 36 · اللدغة سامة"],
	["ymuT8RNAZuE",1,"كهف 41 · الممر الأيمن"],
	["I6LJxj7-_dA",1,"كهف 43 · توصلت الى الجواب"],
	["yt9ML-bot1U",1,"كهف 48"],
	["4oSPAnlHbT8",1,"كهف 49"],
	["Ncf1t_cEQo0",1,"كهف 50"],
	["-mZVRkEeGtk",1,"كهف 51"],
	["NQ_tzI8LTn0",1,"كهف 63"],
	["pgykCzpTUBc",1,"كهف 64 · اللدغة غير سامة"],
	["jXFiu0F-3v8",1,"كهف 73 · القلادة معك"],
	["UC4z1DhaUCs",1,"كهف 78 · الممر الأيسر"],
	["3HAAr7oHYTM",1,"كهف 84 · لم تصل الى شيء"],
	["OkXVoFK3iW8",1,"كهف 90 · دوروثي"],
	["bulg0l00BZA",1,"كهف 93"],
	["1YjPtoxCAZE",1,"كهف 95 · اجتياز الباب"],
	["vkgvxy7ioM4",1,"كهف 103 · جرب أى رقم"],
	["rZDmpNZBNpw",1,"كهف 106 · اليوم هو الثلاثاء أو الجمعة"],
	["zLu2rKrRndM",1,"كهف 109"],
	["fOowQtmPv8M",1,"كهف 110 · لو غلبك النوم"],
	["PvXNr7X_PN4",1,"كهف 123"],
	["YOj8Q11kB68",1,"كهف 128 · الحل الثاني"],
	["ViY0ctOYlCo",1,"كهف 130 · تاريخ اليوم لا يقبل القسمة على اثنين"],
	["zftiJ0C-sVY",1,"كهف 135"],
	["mcMxpmaJvVc",1,"كهف 142 · لو كنت قوي الارادة"],
	["khciSiLbZns",1,"كهف 150 · تقرأ بعد العاشرة مساءا"],
	["q4vtPkkJRno",1,"كهف 158"],
	["kVwRsWhczhA",1,"كهف 162 · اليوم هو الأحد أو الأربعاء"],
	["SB4OmDAYLoU",1,"كهف 163 · تمثال السيد الأزرق"],
	["SfcpcaAtz04",1,"كهف 164 · أن أرحل من هنا"],
	["1XXL2Yvw6Uw",1,"كهف 167 · الكتابة الى أعلى"],
	["KiO3wil6KHc",1,"كهف 170"],
	["APbU2IRd8MA",1,"كهف 176 · الصندوق الثاني"],
	["uIXNTB80OVw",1,"كهف 188 · أبقى مع الفتاة"],
	["SZxkyrV3l-M",1,"كهف 196 · تقرأ قبل العاشرة مساءا"],
	["CmJ0jVTWQqM",1,"كهف 199"],
	["vjg007otiL8",1,"كهف 200 · أرتميس"],
	["Mm5MKArIM2c",1,"كهف 206 · تمثال التوازن الذهبي"],
	["NYubgjA6-Z4",1,"كهف 210 · اذا كنت فتاة"],
	["ewVNAwoV3gc",1,"كهف 213 · أن أنزل"],
	["UDf2mCritO4",1,"كهف 215 · ساقي سليمة"],
	["4E20N9w44-M",1,"كهف 221 · ساقي قد كسرت"],
	["wkP019Pe9qw",1,"كهف 227 · اذا كنت فتى"],
	["UZrEAFQUXUs",1,"كهف 242 · القلادة ليست معك"],
	["FLVOfMF7TSw",1,"كهف 243 · اليوم هو السبت أو الأثنين أو الخميس"],
	["wsBTNbaToUQ",1,"كهف 249 · أن أبقى هنا"],
	["nrrc30PaNbU",1,"كهف 252 · حللت اللغز"],
	["zTLUJ1JlrMk",1,"كهف 254 · الحل الأول"],
	["F9IQ_54U1jY",1,"كهف 261 · معك خاتم عشتار"],
	["G8xNlNQjXsI",1,"كهف 263 · الصندوق الأول"],
	["D7U_SdqvFjk",1,"كهف 266 · الكتابة الى أسفل"]
];

/* Audiohat's own picture for each audiobook (from his author pages there), cropped square: slug → thumbnail.
   The audio page shows it beside the row and on the tape; without one it uses the YouTube still or the book cover. */
window.AKT.audio.thumbs = {
	"01__قصة_لا_تنتهي_": "assets/img/audio/fantasia-1.webp",
	"02__حكايات_من_والاشيا": "assets/img/audio/fantasia-2.webp",
	"03__صفر_صفر_سبعة_": "assets/img/audio/fantasia-3.webp",
	"04__إمبراطورية_النجوم": "assets/img/audio/fantasia-4.webp",
	"05__ذات_مرة_في_الغرب_": "assets/img/audio/fantasia-5.webp",
	"06__خيول_ورماح_": "assets/img/audio/fantasia-6.webp",
	"07__ألعاب_إغريقية": "assets/img/audio/fantasia-7.webp",
	"08__مملكة_الموتى": "assets/img/audio/fantasia-8.webp",
	"01_أسطورة_مصاص_الدماء_": "assets/img/audio/mwt-1-1.webp",
	"01_أسطورة_الرجل_الذئب_": "assets/img/audio/mwt-1-2.webp",
	"02_أسطورة_النداهة_": "assets/img/audio/mwt-2.webp",
	"03_أسطورة_وحش_البحيرة_": "assets/img/audio/mwt-3.webp",
	"04_أسطورة_آكل_البشر_": "assets/img/audio/mwt-4.webp",
	"05_أسطورة_الموتى_الأحياء_": "assets/img/audio/mwt-5.webp",
	"06_أسطورة_رأس_ميدوسا_(الجزء_الأول)": "assets/img/audio/mwt-6-1.webp",
	"06_أسطورة_رأس_ميدوسا_(الجزء_الثاني)": "assets/img/audio/mwt-6-2.webp",
	"07_أسطورة_حارس_الكهف_": "assets/img/audio/mwt-7.webp",
	"08_أسطورة_أرض_أخرى_": "assets/img/audio/mwt-8.webp",
	"09_أسطورة_لعنة_الفرعون_": "assets/img/audio/mwt-9.webp",
	"10_أسطورة_حلقة_الرعب_(الجزء_الأول)": "assets/img/audio/mwt-10-1.webp",
	"10_أسطورة_حلقة_الرعب_(الجزء_الثاني)": "assets/img/audio/mwt-10-2.webp",
	"10_أسطورة_حلقة_الرعب_(الجزء_الثالث)": "assets/img/audio/mwt-10-3.webp",
	"11_أسطورة_الكاهن_الأخير_": "assets/img/audio/mwt-11.webp",
	"12_أسطورة_البيت_": "assets/img/audio/mwt-12.webp",
	"13_أسطورة_اللهب_الأزرق_": "assets/img/audio/mwt-13.webp",
	"14_أسطورة_رجل_الثلوج_": "assets/img/audio/mwt-14.webp",
	"15_أسطورة_النبات_": "assets/img/audio/mwt-15.webp",
	"16_أسطورة_النافاراي_": "assets/img/audio/mwt-16.webp",
	"17_أسطورة_حسناء_المقبرة_": "assets/img/audio/mwt-17.webp",
	"18_أسطورة_الغرباء_": "assets/img/audio/mwt-18.webp",
	"19_أسطورة_بو_": "assets/img/audio/mwt-19.webp",
	"20_حكايات_التاروت_": "assets/img/audio/mwt-20.webp",
	"21_أسطورة_عدو_الشمس_": "assets/img/audio/mwt-21.webp",
	"22_أسطورة_المينوتور_": "assets/img/audio/mwt-22.webp",
	"23_أسطورة_رعب_المستنقعات_": "assets/img/audio/mwt-23.webp",
	"24_أسطورة_إيجور_": "assets/img/audio/mwt-24.webp",
	"25_أسطورة_الجنرال_العائد_": "assets/img/audio/mwt-25.webp",
	"26_أسطورة_المواجهة_": "assets/img/audio/mwt-26.webp",
	"27_أسطورتنا_": "assets/img/audio/mwt-27.webp",
	"28_أسطورة_آخر_الليل_": "assets/img/audio/mwt-28.webp",
	"29_أسطورة_الجاثوم_": "assets/img/audio/mwt-29.webp",
	"31_أسطورتها_": "assets/img/audio/mwt-31.webp",
	"32_أسطورة_رفعت_": "assets/img/audio/mwt-32.webp",
	"33_أسطورة_أرض_المغول_": "assets/img/audio/mwt-33.webp",
	"34_أسطورة_الشاحبين_(جزء_أول)": "assets/img/audio/mwt-34-1.webp",
	"34_أسطورة_الشاحبين_(جزء_ثاني)": "assets/img/audio/mwt-34-2.webp",
	"35_أسطورة_دماء_دراكيولا_": "assets/img/audio/mwt-35.webp",
	"36_أسطورة_الفصيلة_السادسة_": "assets/img/audio/mwt-36.webp",
	"37_أسطورة_الدمية_": "assets/img/audio/mwt-37.webp",
	"38_أسطورة_النصف_الآخر_": "assets/img/audio/mwt-38.webp",
	"39_أسطورة_التوءمين_": "assets/img/audio/mwt-39.webp",
	"40_وراء_الباب_المغلق__الجزء_الأول": "assets/img/audio/mwt-40-1.webp",
	"40_وراء_الباب_المغلق__الجزء_الثاني": "assets/img/audio/mwt-40-2.webp",
	"40_وراء_الباب_المغلق__الجزء_الثالث": "assets/img/audio/mwt-40-3.webp",
	"41_أسطورة_فرانكنشتاين_": "assets/img/audio/mwt-41.webp",
	"42_أسطورة_الكلمات_السبع_": "assets/img/audio/mwt-42.webp",
	"43_أسطورة_تختلف_": "assets/img/audio/mwt-43.webp",
	"44_أسطورة_رجل_بكين_": "assets/img/audio/mwt-44.webp",
	"45_أسطورة_بيت_الأفاعي_": "assets/img/audio/mwt-45.webp",
	"46_أسطورة_طفل_آخر_": "assets/img/audio/mwt-46.webp",
	"47_أسطورة_المنزل_رقم_5_": "assets/img/audio/mwt-47.webp",
	"48_أسطورة_المومياء_": "assets/img/audio/mwt-48.webp",
	"49_أسطورة_العشيرة_": "assets/img/audio/mwt-49.webp",
	"01_في_جانب_النجوم_": "assets/img/audio/mwt-50-1.webp",
	"02_في_جانب_النجوم_": "assets/img/audio/mwt-50-2.webp",
	"03_في_جانب_النجوم": "assets/img/audio/mwt-50-3.webp",
	"51_أسطورة_الرقم_المشؤوم_": "assets/img/audio/mwt-51.webp",
	"52_أسطورة_مملة_": "assets/img/audio/mwt-52.webp",
	"53_أسطورة_النبوءة_": "assets/img/audio/mwt-53.webp",
	"54_أسطورة_العراف_": "assets/img/audio/mwt-54.webp",
	"55_أسطورة_فاي_99_": "assets/img/audio/mwt-55.webp",
	"56_أسطورة_ملك_الذباب_": "assets/img/audio/mwt-56.webp",
	"57_أسطورة_المقبرة_": "assets/img/audio/mwt-57.webp",
	"58_أسطورة_أرض_العظايا_": "assets/img/audio/mwt-58.webp",
	"59_أسطورة_رونيل_السوداء_": "assets/img/audio/mwt-59.webp",
	"60_المتحف_الأسود_01": "assets/img/audio/mwt-60-1.webp",
	"60_المتحف_الأسود_02": "assets/img/audio/mwt-60-1.webp",
	"60_المتحف_الأسود_03": "assets/img/audio/mwt-60-1.webp",
	"61_أسطورة_الشيء_": "assets/img/audio/mwt-61.webp",
	"62_أسطورة_صندوق_بندورا_": "assets/img/audio/mwt-62.webp",
	"63_أسطورة_المحركين_(أنت_لي)": "assets/img/audio/mwt-63-1.webp",
	"63_أسطورة_المحركين_(كونداليني)": "assets/img/audio/mwt-63-2.webp",
	"أسطورتهم_(تحت_تصرفك)_64_": "assets/img/audio/mwt-64-1.webp",
	"أسطورتهم_(الشوارع_حواديت)_64": "assets/img/audio/mwt-64-2.webp",
	"أسطورتهم_(لك_يا_سيدتي)_64": "assets/img/audio/mwt-64-3.webp",
	"65_أسطورة_العلامات_الدامية_(جزء_أول)": "assets/img/audio/mwt-65-1.webp",
	"65_أسطورة_العلامات_الدامية_(جزء_ثاني)": "assets/img/audio/mwt-65-2.webp",
	"65_أسطورة_العلامات_الدامية_(جزء_ثالث)": "assets/img/audio/mwt-65-3.webp",
	"66_أسطورة_الرجال_الذين_لم_يعودوا_كذلك_(جزء_أول)": "assets/img/audio/mwt-66-1.webp",
	"66_أسطورة_الرجال_الذين_لم_يعودوا_كذلك_(جزء_ثاني)": "assets/img/audio/mwt-66-1.webp",
	"66_أسطورة_الرجال_الذين_لم_يعودوا_كذلك_(جزء_ثالث)": "assets/img/audio/mwt-66-1.webp",
	"67_أسطورة_بيت_الأشباح_01": "assets/img/audio/mwt-67-1.webp",
	"67_أسطورة_بيت_الأشباح_02": "assets/img/audio/mwt-67-2.webp",
	"67_أسطورة_بيت_الأشباح_03": "assets/img/audio/mwt-67-3.webp",
	"68_أسطورة_أرض_الظلام_01": "assets/img/audio/mwt-68-1.webp",
	"68_أسطورة_أرض_الظلام_02": "assets/img/audio/mwt-68-2.webp",
	"69_أسطورة_نادي_الغيلان_01": "assets/img/audio/mwt-69-1.webp",
	"69_أسطورة_نادي_الغيلان_02": "assets/img/audio/mwt-69-2.webp",
	"69_أسطورة_نادي_الغيلان_03": "assets/img/audio/mwt-69-3.webp",
	"71_أسطورة_الظلال_01": "assets/img/audio/mwt-71-1.webp",
	"71_أسطورة_الظلال_02": "assets/img/audio/mwt-71-2.webp",
	"72_أسطورة_الطوطم_01": "assets/img/audio/mwt-72-1.webp",
	"72_أسطورة_الطوطم_02": "assets/img/audio/mwt-72-2.webp",
	"73_أسطورة_شبه_مخيفة_01": "assets/img/audio/mwt-73-1.webp",
	"73_أسطورة_شبه_مخيفة_02": "assets/img/audio/mwt-73-2.webp",
	"78_أسطورة_حامل_الضياء_(جزء_أول)": "assets/img/audio/mwt-78-1.webp",
	"78_أسطورة_حامل_الضياء_(جزء_ثاني)": "assets/img/audio/mwt-78-2.webp",
	"79_أسطورة_حامل_الضياء_(جزء_ثالث)": "assets/img/audio/mwt-79-1.webp",
	"79_أسطورة_حامل_الضياء_(جزء_رابع)": "assets/img/audio/mwt-79-2.webp",
	"70_الزوجة_تعرف_أكثر": "assets/img/audio/mid-1.webp",
	"70_تحت": "assets/img/audio/mid-2.webp",
	"70_مرب_فاضل": "assets/img/audio/mid-3.webp",
	"70_نوبتجية": "assets/img/audio/mid-4.webp",
	"70_حكاية_بيسة_وسوسو": "assets/img/audio/mid-6.webp",
	"70__الاخ_السابع": "assets/img/audio/mid-7.webp",
	"70_محموووود": "assets/img/audio/mid-8.webp",
	"30_الزوج_الذي_عاد": "assets/img/audio/mid-9.webp",
	"30_فكرة_غير_عادية": "assets/img/audio/mid-10.webp",
	"30_حكاية_من_المشرحة": "assets/img/audio/mid-11.webp",
	"30_الحافلة": "assets/img/audio/mid-12.webp",
	"70_في_غرفة_نومي": "assets/img/audio/mid-13.webp",
	"30_قل_لي_يا_أونكل": "assets/img/audio/mid-14.webp",
	"70_زنزانة_خريولسن_-_من_أنا": "assets/img/audio/mid-15.webp",
	"70_أكواريوم": "assets/img/audio/mid-16.webp",
	"30_بس_بس_ناو": "assets/img/audio/mid-17.webp",
	"70_على_الإيقاع": "assets/img/audio/mid-18.webp",
	"30_الشقة_رقم_9": "assets/img/audio/mid-19.webp"
};

/* Ma Wara' al-Tabi'a special issue 2, «36» — a choose-your-path book (12 plots in 36 chapters), on Audiohat in
   13 episodes: the introduction, then each ally (Ezzat, Maggie, Hen Cho Kan) against each of four dangers.
   Keyed both as the audio page reads a series' special issue (mwt-s2) and as its own page does (specials-2). Checked 2026-10-25. */
(function (A) {
	var eps = [["(36)_-_مقدمة", 1, "", "مقدمة لا بد منها"]];
	[["عزت", "عزت"], ["ماجي", "ماجي"], ["هن_تشو_كان", "هن تشو كان"]].forEach(function (ally, i) {
		var mins = [[23, 2, 2, 2], [2, 21, 1, 2], [22, 2, 1, 2]][i];
		[["مصاصو_دماء", "مصاصو دماء"], ["تعويذة_قديمة_منسية_كالعادة", "تعويذة قديمة منسية كالعادة"], ["الموتى_الذين_ليسوا_كذلك", "الموتى الذين ليسوا كذلك"], ["عراف_شرير", "عراف شرير"]].forEach(function (p, k) {
			/* Audiohat's slugs for «عراف شرير» end in an underscore, except Hen Cho Kan's */
			var slug = "(36)_-_" + ally[0] + "_-_" + p[0] + (k === 3 && i < 2 ? "_" : "");
			eps.push([slug, mins[k], "", ally[1] + " · " + p[1]]);
		});
	});
	A.audio.issues["mwt-s2"] = eps;
	A.audio.issues["specials-2"] = eps;
})(window.AKT);

/* «في كهوف دراجوسان»'s videos on its own page too (specials-1), not only on the audio page (mwt-s1) */
(function (Y) {
	Y.issues["specials-1"] = Y.issues["mwt-s1"];
	Y.channels["specials-1"] = Y.channels["mwt-s1"];
})(window.AKT.audio.youtube);

/* «ثلاثة» (كتاب الصيف) read on YouTube by Dubvo, the audio publisher. Checked 2026-10-25. */
(function (Y) {
	Y.channels["sayf-1"] = { name: "دار النشر الصوتية - Dubvo", url: "https://www.youtube.com/@DubvoTV" };
	Y.issues["sayf-1"] = [["0xkoQGo8jFk", 1, "ثلاثة · Dubvo"]];
})(window.AKT.audio.youtube);

/* His books and stories read by Eslam Adel on his YouTube channel (the playlist «أحمد خالد توفيق | بصوت إسلام عادل», without its
   «قوس قزح» promo). Checked 2026-10-26. Each entry: [videoId, minutes, title, the book of his it is, or comes from]. Each one with a book
   also plays on that book's page (issues["work:<id>"]). */
(function (Y) {
	Y.eslamAdel = {
		channel: { name: "Eslam Adel - إسلام عادل", url: "https://www.youtube.com/playlist?list=PLuHVxnWJnT_CBZHyxrIJKtKqYz_ddozPc" },
		eps: [
			["HeiSMU-3hLY", 46, { ar: "أكواريل", en: "Aquarelle" }, "aquarelle"],
			["5cv8hK7WbPA", 169, { ar: "لا مكان للملل", en: "No Room for Boredom" }, "lamakan"],
			["IC0ctW0dCIc", 154, { ar: "قوس قزح (مع تامر إبراهيم)", en: "Rainbow (with Tamer Ibrahim)" }, "qaws"],
			["k4ezyZiW5ww", 77, { ar: "رسائل المحبة", en: "Letters of Love" }],
			["Qi960s8yc_s", 49, { ar: "الشيء في الصندوق", en: "The Thing in the Box" }],
			["8DcoubXqEm8", 37, { ar: "حقيقة ما حدث", en: "What Really Happened" }],
			["89b6ti3Aac4", 45, { ar: "أنا أتذكر", en: "I Remember" }],
			["H7Aa2xOC4Nc", 140, { ar: "زغازيغ", en: "Zaghazigh" }, "zaghazigh"],
			["BjvlK5vLPiA", 15, { ar: "كلام عجائز", en: "Old Wives' Talk" }],
			["U5WoQztjZJs", 34, { ar: "كراهية", en: "Hatred" }],
			["e0oyMk2XENo", 202, { ar: "مقالات مجمعة (١)", en: "Collected essays (1)" }],
			["jLLkZpA71F4", 203, { ar: "مقالات مجمعة (٢)", en: "Collected essays (2)" }],
			["FlWWUO5TjYo", 16, { ar: "غير المدعو (دراما صوتية)", en: "The Uninvited (audio drama)" }],
			["qyz_gSeUF8g", 12, { ar: "خدمة لمدام إيفون", en: "A Favor for Madame Yvonne" }, "aql"],
			["bEvxEkO13Xk", 12, { ar: "الثقوبة", en: "Al-Thaqouba" }],
			["LfzwoYc7104", 57, { ar: "قصة الرواية", en: "The Novel's Story" }]
		]
	};
	Y.eslamAdel.eps.forEach(function (ep) {
		if (!ep[3]) return;
		Y.issues['work:' + ep[3]] = [[ep[0], 1, ep[2].ar + ' · بصوت إسلام عادل']];
		Y.channels['work:' + ep[3]] = Y.eslamAdel.channel;
	});
})(window.AKT.audio.youtube);

/* Fantasia as radio drama on YouTube, from Dubvo's playlist «سلسلة فانتازيا بالترتيب» (issues 1–40, 53 and 63, with
   «حكايات من والاشيا» in two parts and an earlier first half of «حب في أغسطس»), the special issue «30» and a second «ثلاثة»;
   its three trailers left out, and the 11 videos YouTube hides as unavailable. Checked 2026-10-28, all embeddable.
   Entries: [videoId, 1, label, minutes]. */
(function (Y) {
	var ch = { name: "دار النشر الصوتية - Dubvo", url: "https://www.youtube.com/playlist?list=PLBYDwVauAIiUy8nnNKydnbsp6qCWoNMzO" };
	Y.dubvoFantasia = ch;
	var D = "دراما إذاعية · Dubvo";
	var fan = {
		1: [["R0lWlYxkXQY", 106]], 2: [["0k9tUeGp_eo", 55, "الجزء الأول · Dubvo"], ["02Z8CZOS-2U", 49, "الجزء الثاني · Dubvo"]],
		3: [["pJ1NMwL61sU", 98]], 4: [["_ZDv9NDs1z0", 101]], 5: [["F2LVviY_77k", 85]], 6: [["_KWs61JHGhU", 98]], 7: [["OPIqNEIf9Bs", 90]],
		8: [["Z4vU4yzW_zc", 87]], 9: [["aHoLvLfxqmI", 113]], 10: [["vgw74vtbqjs", 126]], 11: [["mZxE0WCFKtU", 99]], 12: [["gqHkP4aOEgg", 79]],
		13: [["nLjcAFqJ7W8", 79]], 14: [["VpBypGGO9rY", 78]], 15: [["ajaduH82fTg", 82]], 16: [["08kCHUgTG4w", 95]], 17: [["6FEPdpNBGoQ", 102]],
		18: [["PPR_HV9VLQU", 99]], 19: [["mFV3xuga6xQ", 106]], 20: [["CsPZqfM8pbo", 99]], 21: [["ZEzcxi50zXQ", 107]], 22: [["1XSWTt2OE7c", 103]],
		23: [["VFj8_a5H3UQ", 108]], 24: [["m96h8KEU_No", 117]], 25: [["gLyQ46GTY5w", 101]], 26: [["QixYjDRrXqI", 119]], 27: [["qcDD6t_hQtU", 126]],
		28: [["YwiCGj8VtBE", 117]], 29: [["pH-gOq6xsO0", 134]], 30: [["17AcjFEgeGo", 125]], 31: [["EoJr46J51qY", 118]], 32: [["NjzN8E4Zav4", 124]],
		33: [["vpHnmlVlPOI", 136]], 34: [["rSWD64NqUiQ", 139]], 35: [["ZsjU3PLlDwc", 139]],
		36: [["y2tCM6YzIvo", 119], ["sC55Pi5H36Q", 43, "قراءة سابقة · الجزء الأول · Dubvo"]],
		37: [["PNffINKesOI", 151]], 38: [["f1mP-zEW8XY", 145]], 39: [["GYUDzJoFlzw", 142]], 40: [["SFs2yHipaMc", 164]],
		53: [["utIKreeVH7s", 102]], 63: [["8lRZDgm8qPM", 131]]
	};
	Object.keys(fan).forEach(function (n) {
		Y.issues['fantasia-' + n] = fan[n].map(function (v) { return [v[0], 1, v[2] || D, v[1]]; });
		Y.channels['fantasia-' + n] = ch;
	});
	/* «30», a special issue of all three series: on its own page (specials-10) and under each series on the audio page */
	['specials-10', 'mwt-s10', 'fantasia-s10', 'safari-s10'].forEach(function (k) { Y.issues[k] = [["FP6WpjDPxPs", 1, "العدد الخاص · Dubvo", 112]]; Y.channels[k] = ch; });
	Y.issues['sayf-1'] = (Y.issues['sayf-1'] || []).concat([["RIU8JZUJr8s", 1, "ثلاثة · قراءة أخرى · Dubvo", 47]]);
})(window.AKT.audio.youtube);
