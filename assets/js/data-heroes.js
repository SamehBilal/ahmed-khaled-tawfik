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

/* Alaa's places: each card draws the outline of its country (or countries), a dot where the place lies (from Natural Earth via
   github.com/johan/world.geo.json, drawn in a 24-unit box like the pin it replaces) */
(function (A) {
	var maps = {
		21: { d: 'M18.6 9.3L19.3 10.3L18.4 10.8L18.1 11.3L17.7 11.3L17.5 12.2L17.1 12.7L16.9 13.5L16.4 13.9L14.6 12.7L14.6 12L10.1 9.5L9.9 9.4L9.9 8.1L10.3 7.6L10.9 6.8L11.3 5.9L10.8 4.5L10.6 3.9L10.1 3L10.8 2.3L11.6 1.5L12.3 1.7L12.3 2.4L12.7 2.8L13.5 2.8L15.1 3.8L15.5 3.8L15.7 3.8L16 3.9L16.8 4L17.2 3.5L18.3 3L18.8 3.4L19.6 3.4L18.6 4.8L18.6 9.3ZM9.9 9.4L10.1 9.5L14.6 12L14.6 12.7L16.4 13.9L15.8 15.4L15.9 16.1L16.7 16.6L16.7 16.9L16.4 17.6L16.4 18L16.4 18.6L16.8 19.3L17.3 20.5L17.7 20.8L16.8 21.5L15.4 22L14.7 21.9L14.3 22.3L13.4 22.3L13.1 22.5L11.7 22.2L10.7 22.3L10.4 20.6L10 20L9.7 19.7L8.5 19.5L7.9 19.1L7.1 18.9L6.6 18.7L6.1 18.4L5.4 16.8L4.7 16.2L4.5 15.5L4.6 14.8L4.4 13.7L4.9 13.6L5.3 13.2L5.8 12.6L6.1 12.3L6.1 11.9L5.8 11.6L5.8 11.2L6.1 11L6.2 10.3L5.7 9.6L6.1 9.4L7.5 9.5L9.9 9.4Z', dot: [11.4, 10] },
		25: { d: 'M10.2 1.6L10.6 1.8L17.5 5.8L17.6 6.9L20.4 8.8L19.5 11.2L19.6 12.3L20.8 13L20.9 13.5L20.4 14.6L20.5 15.2L20.3 16.1L21 17.3L21.8 19.2L22.5 19.7L21 20.8L18.9 21.5L17.7 21.5L17.1 22.1L15.7 22.1L15.2 22.4L12.9 21.8L11.5 22L11 19.4L10.3 18.5L9.9 17.9L8 17.6L7 17L5.7 16.7L5 16.3L4.2 15.9L3.1 13.4L2 12.4L1.7 11.2L1.8 10.2L1.5 8.5L2.3 8.4L3 7.7L3.7 6.7L4.2 6.3L4.2 5.6L3.8 5.2L3.7 4.4L4.2 4.2L4.3 3.1L3.6 2L4.2 1.8L6.3 1.8L10.2 1.6Z', dot: [16.8, 5.7] },
		28: { d: 'M18.4 14.6L19.7 16.3L18.2 17.1L17.7 18L16.9 18.2L16.6 19.6L16 20.4L15.6 21.8L14.7 22.5L11.8 20.4L11.6 19.2L4.2 15L3.8 14.8L3.8 12.6L4.4 11.8L5.4 10.4L6.1 8.9L5.2 6.6L5 5.5L4 4.1L5.3 2.9L6.7 1.5L7.8 1.8L7.8 3L8.5 3.7L9.9 3.7L12.5 5.4L13.2 5.5L13.6 5.4L14.1 5.6L15.5 5.8L16.1 4.9L18 4.1L18.8 4.8L20.2 4.8L18.4 7.1L18.4 14.6Z', dot: [8.3, 5.4] },
		33: { d: 'M20.8 13.2L20.6 13.4L20 14.1L19.7 14.9L19 15.9L17.5 17.4L16.6 18.3L15.7 18.9L14.3 19.5L13.7 19.6L13.5 20L12.7 19.8L12.1 20L10.7 19.8L10 19.9L9.4 19.9L8.1 20.4L7 20.7L6.2 21.2L5.7 21.2L5.1 20.7L4.7 20.7L4.1 20.1L4.1 20.3L3.9 19.9L3.9 19L3.5 18L3.9 17.8L3.9 16.7L3.1 15.3L2.4 14.1L2.4 14.1L1.5 12.2L2.1 11.5L2.6 11.9L2.8 12.5L3.4 12.6L4.2 12.9L4.9 12.8L6 12L6 6.6L6.4 6.9L7.1 8.2L7 9.1L7.3 9.6L8.2 9.5L8.8 8.8L9.4 8.4L9.8 7.7L10.4 7.4L10.9 7.5L11.5 8L12.6 8L13.4 7.7L13.5 7.2L13.7 6.5L14.4 6.4L14.8 5.9L15.2 4.9L16.4 3.8L18.2 2.8L18.7 2.8L19.3 3L19.7 2.8L20.4 3L21 5L21.4 6.1L21.1 7.7L21.2 8.2L20.6 7.9L20.2 8L20.1 8.5L19.8 9L19.8 9.5L20.5 10.3L21.3 10.1L21.5 9.5L22.5 9.5L22.2 10.6L22 11.8L21.7 12.4L20.8 13.2ZM17.6 12.7L17 12.3L16.4 12.6L15.8 13.1L15.1 14.1L16 15.2L16.5 15L16.7 14.6L17.4 14.3L17.6 13.9L18 13.2L17.6 12.7Z', dot: [20.7, 11.6] },
		34: { d: 'M20.8 13.2L20.6 13.4L20 14.1L19.7 14.9L19 15.9L17.5 17.4L16.6 18.3L15.7 18.9L14.3 19.5L13.7 19.6L13.5 20L12.7 19.8L12.1 20L10.7 19.8L10 19.9L9.4 19.9L8.1 20.4L7 20.7L6.2 21.2L5.7 21.2L5.1 20.7L4.7 20.7L4.1 20.1L4.1 20.3L3.9 19.9L3.9 19L3.5 18L3.9 17.8L3.9 16.7L3.1 15.3L2.4 14.1L2.4 14.1L1.5 12.2L2.1 11.5L2.6 11.9L2.8 12.5L3.4 12.6L4.2 12.9L4.9 12.8L6 12L6 6.6L6.4 6.9L7.1 8.2L7 9.1L7.3 9.6L8.2 9.5L8.8 8.8L9.4 8.4L9.8 7.7L10.4 7.4L10.9 7.5L11.5 8L12.6 8L13.4 7.7L13.5 7.2L13.7 6.5L14.4 6.4L14.8 5.9L15.2 4.9L16.4 3.8L18.2 2.8L18.7 2.8L19.3 3L19.7 2.8L20.4 3L21 5L21.4 6.1L21.1 7.7L21.2 8.2L20.6 7.9L20.2 8L20.1 8.5L19.8 9L19.8 9.5L20.5 10.3L21.3 10.1L21.5 9.5L22.5 9.5L22.2 10.6L22 11.8L21.7 12.4L20.8 13.2ZM17.6 12.7L17 12.3L16.4 12.6L15.8 13.1L15.1 14.1L16 15.2L16.5 15L16.7 14.6L17.4 14.3L17.6 13.9L18 13.2L17.6 12.7Z', dot: [20.2, 14] },
		52: { d: 'M22.1 3.7L22.1 5L22.5 5.1L22.1 5.5L21.7 5.8L21.3 6.4L21.1 6.9L21 7.8L20.7 8.2L20.7 9.1L20.4 9.4L20.4 10L20.2 10.1L20.1 10.7L20.4 11.2L20.5 12.6L20.7 13.6L20.6 14.1L20.8 14.8L21.4 15.4L22 16.8L21.6 16.7L20.1 16.9L19.8 17L19.5 17.7L19.7 18.2L19.5 19.5L19.4 20.6L19.7 20.8L20.5 21.3L20.8 21.1L20.9 22.3L20 22.2L19.6 21.6L19.2 21.2L18.3 21L18.1 20.4L17.4 20.8L16.5 20.6L16.1 20.1L15.4 20L14.9 20L14.9 19.7L14.5 19.7L14 19.6L13.3 19.8L12.8 19.7L12.5 19.9L12.6 18.5L12.2 18.1L12.1 17.4L12.3 16.8L12.1 16.3L12.1 15.6L10.7 15.7L10.8 15.3L10.2 15.3L10.2 15.5L9.5 15.5L9.2 16.1L9.1 16.4L8.4 16.3L8.1 16.4L7.4 16.5L6.9 15.9L6.7 15.6L6.4 14.9L6.1 14.1L2.8 14.1L2.4 14.2L2.1 14.2L1.7 14.3L1.5 14L1.8 13.9L1.8 13.4L2 13.1L2.4 12.9L2.7 13L3.1 12.6L3.7 12.6L3.7 12.9L4.2 13.1L4.8 12.4L5.4 11.8L5.7 11.5L5.7 10.6L6.2 9.5L6.7 8.9L7.4 8.4L7.5 8L7.6 7.6L7.7 7.2L7.7 6.6L7.8 5.6L8 4.9L8.4 4.4L8.4 3.7L8.5 2.9L9 2.3L9.6 2L10.5 2.4L11.2 2.8L12 2.9L12.8 3.1L13.1 2.4L13.3 2.3L13.8 2.5L15 1.9L15.5 2.1L15.8 2.1L16 1.8L16.4 1.7L17.2 1.9L17.9 1.9L18.3 1.8L19 2.7L19.5 2.8L19.8 2.6L20.3 2.7L20.9 2.5L21.2 2.9L22.1 3.7Z', dot: [15.9, 7] }
	};
	(((A.heroes || {}).alaa || {}).places || []).forEach(function (p) { if (maps[p.issue] && !p.map) p.map = maps[p.issue]; });
})(window.AKT);
