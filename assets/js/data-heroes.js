/* Character pages — the extra, themed sections of the three series heroes.
 * Groups list issue numbers of the hero's series, sorted by what the issue title says
 * (a vampire, an epidemic, a myth...). Every other character gets a plain page. */
window.AKT = window.AKT || {};

window.AKT.heroes = {
  "refaat": {
    "theme": "ghosts",
    "eyebrow": { "ar": "حارس الأساطير", "en": "Keeper of legends" },
    "intro": {
      "ar": "لا يؤمن رفعت إسماعيل بالأشباح، ولا بمصاصي الدماء، ولا باللعنات. ومع ذلك يجدها في طريقه مرة بعد مرة: في قرية مصرية، أو قلعة أوروبية، أو أرض لا وجود لها على الخرائط. ثمانون «أسطورة» يرويها بنفسه، ساخرًا من خوفه قبل أن يسخر من أي شيء آخر.",
      "en": "Refaat Ismail doesn't believe in ghosts, vampires or curses. And yet he keeps meeting them: in an Egyptian village, a European castle, or a land that is on no map. Eighty \"legends\", told by the man himself, who mocks his own fear before he mocks anything else."
    },
    "sectionTitle": { "ar": "دفتر الكائنات", "en": "The bestiary" },
    "sectionText": { "ar": "بعض ما واجهه، مصنّفًا بحسب عناوين الأعداد. اضغط على عدد لتفتح صفحته.", "en": "Some of what he faced, sorted by the issue titles. Open an issue to read about it." },
    "groups": [
      { "title": { "ar": "مصاصو الدماء والموتى الأحياء", "en": "Vampires and the undead" }, "issues": [1, 5, 35, 41, 48] },
      { "title": { "ar": "وحوش ومخلوقات", "en": "Monsters and creatures" }, "issues": [3, 4, 6, 14, 22, 23, 61] },
      { "title": { "ar": "بيوت مسكونة", "en": "Haunted houses" }, "issues": [12, 47, 67] },
      { "title": { "ar": "لعنات وكهنة ومومياوات", "en": "Curses, priests and mummies" }, "issues": [9, 11, 48, 72] },
      { "title": { "ar": "من الفولكلور المصري والعربي", "en": "From Egyptian and Arab folklore" }, "issues": [2, 29] },
      { "title": { "ar": "عوالم أخرى", "en": "Other worlds" }, "text": { "ar": "رحلاته مع سالم وسلمى إلى أراضٍ موازية.", "en": "His journeys with Salem and Salma into parallel lands." }, "issues": [8, 33, 58, 68] },
      { "title": { "ar": "في مواجهة لوسيفر", "en": "Against Lucifer" }, "issues": [20, 35, 62, 79] }
    ]
  },
  "alaa": {
    "theme": "medicine",
    "eyebrow": { "ar": "طبيب في أفريقيا", "en": "A doctor in Africa" },
    "intro": {
      "ar": "ترك علاء عبد العظيم مصر إلى الكاميرون ليعمل في «سافاري»، منظمة طبية دولية تطارد الأمراض في أنحاء أفريقيا. هنا الطب الاستوائي الذي تخصص فيه المؤلف نفسه: أوبئة وطفيليات وتجارب محرّمة، وناس وقبائل وأماكن، يحكيها علاء غالبًا في رسائله إلى بلده.",
      "en": "Alaa Abdel Azim left Egypt for Cameroon to work for Safari, an international medical organisation that hunts diseases across Africa. This is the tropical medicine the author himself specialised in: epidemics, parasites and forbidden experiments, and the peoples and places of the continent, often told in Alaa's letters home."
    },
    "sectionTitle": { "ar": "ملفات الحالات", "en": "Case files" },
    "sectionText": { "ar": "أعداد السلسلة مصنّفة بحسب عناوينها: الأمراض، والأماكن، والعلم حين يخرج عن السيطرة.", "en": "The series' issues, sorted by their titles: the diseases, the places, and science out of control." },
    "groups": [
      { "kind": "disease", "title": { "ar": "أوبئة وأمراض", "en": "Epidemics and diseases" }, "issues": [1, 13, 20, 27, 32, 46, 49, 53] },
      { "kind": "place", "title": { "ar": "أماكن وشعوب أفريقية", "en": "African places and peoples" }, "issues": [21, 25, 28, 33, 34, 52] },
      { "kind": "lab", "title": { "ar": "حين يخرج العلم عن السيطرة", "en": "Science out of control" }, "issues": [5, 17, 41, 47] },
      { "kind": "wild", "title": { "ar": "البرية", "en": "The wild" }, "issues": [11, 18, 40, 51] }
    ],
    "places": [
      { "issue": 25, "name": { "ar": "كليمنجارو", "en": "Kilimanjaro" }, "where": { "ar": "تنزانيا", "en": "Tanzania" } },
      { "issue": 28, "name": { "ar": "توركانا", "en": "Turkana" }, "where": { "ar": "كينيا", "en": "Kenya" } },
      { "issue": 21, "name": { "ar": "الماساي", "en": "The Maasai" }, "where": { "ar": "كينيا وتنزانيا", "en": "Kenya and Tanzania" } },
      { "issue": 33, "name": { "ar": "الزولو", "en": "The Zulu" }, "where": { "ar": "جنوب أفريقيا", "en": "South Africa" } },
      { "issue": 34, "name": { "ar": "الناتال", "en": "Natal" }, "where": { "ar": "جنوب أفريقيا", "en": "South Africa" } },
      { "issue": 52, "name": { "ar": "الكونغو", "en": "The Congo" }, "where": { "ar": "وسط أفريقيا", "en": "Central Africa" } }
    ]
  },
  "abeer": {
    "theme": "fantasy",
    "eyebrow": { "ar": "عابرة الحكايات", "en": "Walker between stories" },
    "intro": {
      "ar": "عبير عبد الرحمن قارئة نهمة بخيال واسع، وجهاز «DG-2» الذي اخترعه المهندس شريف يفتح لها باب الحكايات التي قرأتها لتعيشها من الداخل: خيال علمي وأساطير، وتاريخ وأدب وسينما. في كل عدد بابٌ جديد، ودليلٌ يشبه مدرّسة اللغة العربية القديمة.",
      "en": "Abeer Abdel Rahman is a voracious reader with a wide imagination, and the DG-2 machine invented by engineer Sherif opens the door to the stories she has read so she can live them from inside: science fiction and myth, history, literature and film. Every issue is a new door, with a guide who resembles her old Arabic teacher."
    },
    "sectionTitle": { "ar": "الأبواب", "en": "The doors" },
    "sectionText": { "ar": "العوالم التي دخلتها، مصنّفة بحسب عناوين الأعداد.", "en": "The worlds she entered, sorted by the issue titles." },
    "groups": [
      { "kind": "scifi", "title": { "ar": "خيال علمي وأبطال خارقون", "en": "Science fiction and superheroes" }, "issues": [4, 13, 14, 23, 29, 40] },
      { "kind": "myth", "title": { "ar": "أساطير وملاحم", "en": "Myths and epics" }, "issues": [7, 25, 39, 41, 43, 56, 58] },
      { "kind": "lit", "title": { "ar": "في صحبة الكُتّاب", "en": "In the company of writers" }, "issues": [1, 10, 31, 60] },
      { "kind": "history", "title": { "ar": "صفحات من التاريخ", "en": "Pages of history" }, "issues": [15, 27, 28, 33, 45, 49, 51] },
      { "kind": "film", "title": { "ar": "سينما وحكايات مصوّرة", "en": "Cinema and comics" }, "issues": [3, 5, 17, 18, 21, 24, 34] }
    ]
  }
};
