/* «حكايات القرّاء»: the invitation to write one — a few questions, then by email or on GitHub, published only with leave.
   On its own page (reader-stories.html) and as a step of «تواصل وساهم» (info.js). */
window.ReaderStories = {
	/* the questions a story can answer, and the email that carries them */
	ask: function () {
		var L = window.App.L;
		return [
			[L('البداية', 'The start'), L('ما أول ما قرأته له؟ متى وأين، ومن أعطاك إياه؟', 'What did you read of his first? When and where, and who gave it to you?')],
			[L('الأثر', 'What it did'), L('ماذا غيّر فيك؟ كتاب، أو عادة، أو طريق في حياتك؟', 'What did it change in you — a book, a habit, a path in your life?')],
			[L('اللقاء', 'Meeting him'), L('هل رأيته في ندوة أو حفل توقيع، أو كتبت له وردّ عليك؟', 'Did you see him at a talk or a signing, or write to him and hear back?')],
			[L('الوداع', 'Goodbye'), L('أين كنت يوم عرفت برحيله؟', 'Where were you the day you heard he had died?')]
		];
	},
	mailto: function () {
		var A = window.App, L = A.L;
		var body = L('اسمك كما تحب أن يُذكر (أو حروفه الأولى):\n\nمدينتك (إن أحببت):\n\nالعام الذي قرأته فيه أول مرة:\n\nأول كتاب أو عدد:\n\nحكايتك:\n\n\nهل توافق على نشرها في الموقع؟ (نعم / لا)\n',
			'Your name as you’d like it shown (or your initials):\n\nYour city (if you like):\n\nThe year you first read him:\n\nThe first book or issue:\n\nYour story:\n\n\nMay we publish it on the site? (yes / no)\n');
		return 'mailto:' + A.EMAIL + '?subject=' + encodeURIComponent(L('حكايتي مع العرّاب', 'My story with the Godfather')) + '&body=' + encodeURIComponent(body);
	},
	github: function () {
		var A = window.App, L = A.L;
		return A.REPO + '/issues/new?labels=' + encodeURIComponent('reader-story') + '&title=' + encodeURIComponent(L('حكاية قارئ: ', 'Reader’s story: ')) +
			'&body=' + encodeURIComponent(L('الاسم كما يُذكر:\nالمدينة:\nأول قراءة (العام والكتاب):\n\nالحكاية:\n\n\nأوافق على نشرها في الموقع: نعم', 'Name as shown:\nCity:\nFirst read (year and book):\n\nThe story:\n\n\nI agree to its publication on the site: yes'));
	},
	/* the invitation, here and as a step of «تواصل وساهم» */
	invite: function (short) {
		var A = window.App, e = A.esc, L = A.L, self = this;
		return '<div class="rs-invite">' +
			(short ? '' : '<h2>' + e(L('اكتب حكايتك', 'Write your story')) + '</h2>') +
			'<ol class="rs-ask">' + self.ask().map(function (q, i) { return '<li><b>' + e(q[0]) + '</b><span>' + e(q[1]) + '</span></li>'; }).join('') + '</ol>' +
			'<p class="rs-act"><a class="buy-btn" href="' + e(self.mailto()) + '">' + e(L('أرسل حكايتك بالبريد', 'Send your story by email')) + '</a>' +
				'<a class="buy-btn" href="' + e(self.github()) + '" target="_blank" rel="noopener">' + e(L('أو على GitHub ↗', 'or on GitHub ↗')) + '</a></p>' +
			'<p class="info-note">' + e(L('لا تُنشر حكاية إلا بإذن صاحبها، وباسمه كما يريد أو بحروفه الأولى. قد نختصر الطويل منها، ونرسل إليك النص قبل نشره. البريد لا يُنشر.',
				'No story goes up without its sender’s leave, under the name they choose or their initials. Long ones may be shortened, and you will see the text before it is published. Emails are never shown.')) + '</p>' +
		'</div>';
	}
};
