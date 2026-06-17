/* eslint-disable */
// Generates a Word document listing each required Arabic translation change
// with the full Before / After text for each.
// Run: node generate-translations-report.cjs
const fs = require("fs");
const path = require("path");

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  PageNumber,
  Header,
  Footer,
  Table,
  TableRow,
  TableCell,
} = require("docx");

const ACCENT = "0E4174";
const MUTED = "5F6F7A";
const SOFT_BG = "EEF3F8";
const BEFORE_BG = "FBEFEF";
const AFTER_BG = "EFF7EE";
const BORDER = "D5DCE4";

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
const cellBorders = {
  top: cellBorder,
  bottom: cellBorder,
  left: cellBorder,
  right: cellBorder,
};

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, color: ACCENT })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true })],
  });
}

function en(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text,
        bold: !!opts.bold,
        italics: !!opts.italic,
        color: opts.color,
        size: opts.size,
      }),
    ],
  });
}

function ar(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.RIGHT,
    bidirectional: true,
    children: [
      new TextRun({
        text,
        rightToLeft: true,
        font: "Arial",
        size: opts.size || 24, // 12pt
        bold: !!opts.bold,
      }),
    ],
  });
}

function spacer() {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun(" ")],
  });
}

// One-cell labelled box: Label (bold), then the Arabic text.
function labelledBox(label, arabicText, bg) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: bg, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    color: MUTED,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: arabicText,
                    rightToLeft: true,
                    font: "Arial",
                    size: 26, // 13pt for readability
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function beforeAfter(beforeText, afterText) {
  return [
    labelledBox("BEFORE", beforeText, BEFORE_BG),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun(" ")] }),
    labelledBox("AFTER", afterText, AFTER_BG),
    spacer(),
  ];
}

function requiredChange(lines) {
  // Renders the "Required change" block as italic muted text.
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: SOFT_BG, type: ShadingType.CLEAR, color: "auto" },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "Required change",
                    bold: true,
                    color: ACCENT,
                    size: 20,
                  }),
                ],
              }),
              ...lines.map(
                (line) =>
                  new Paragraph({
                    spacing: { after: 40 },
                    children: [new TextRun({ text: line, size: 22 })],
                  })
              ),
            ],
          }),
        ],
      }),
    ],
  });
}

const children = [];

// Title
children.push(
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: "Biznet Consulting",
        bold: true,
        size: 28,
        color: MUTED,
      }),
    ],
  })
);
children.push(
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: "Arabic Translation Changes — Before / After",
        bold: true,
        size: 44,
        color: ACCENT,
      }),
    ],
  })
);
children.push(
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text:
          "This document lists each Arabic translation change applied to the website. " +
          "For every section, the requested change is shown first, followed by the full Before " +
          "and After Arabic text.",
        italics: true,
        color: MUTED,
        size: 22,
      }),
    ],
  })
);

// ---------------------------------------------------------------------------
// 1. "Who We Are" Section
// ---------------------------------------------------------------------------
children.push(h1("1. \"Who We Are\" Section (من نحن)"));
children.push(
  requiredChange([
    "The heading should be changed from \"منو نحن\" (colloquial) to \"من نحن\" (formal).",
  ])
);
children.push(spacer());
children.push(h2("Heading label"));
children.push(...beforeAfter("منو نحن", "من نحن"));

// ---------------------------------------------------------------------------
// 2. "What We Do" Section
// ---------------------------------------------------------------------------
children.push(h1("2. \"What We Do\" Section (ماذا نعمل)"));
children.push(
  requiredChange([
    "The heading should be changed from \"ماذا نفعل\" to \"ماذا نعمل\".",
  ])
);
children.push(spacer());
children.push(h2("Heading label"));
children.push(...beforeAfter("ماذا نفعل؟", "ماذا نعمل؟"));

// ---------------------------------------------------------------------------
// 3. "Our Scope of Work" paragraph
// ---------------------------------------------------------------------------
children.push(h1("3. \"Our Scope of Work\" Paragraph (فقرة مجال عملنا)"));
children.push(
  requiredChange([
    "At the end of the paragraph, the phrase \"نصقل التوجه\" should be changed to \"نصقل المهارات ونتخذ...\".",
  ])
);
children.push(spacer());
children.push(h2("Paragraph"));
children.push(
  ...beforeAfter(
    "نجمع بين الاستراتيجية، والتطوير، والعمارة، والإنشاء، والعلامة التجارية، والتنفيذ تحت توجُّهٍ واضح. ومن وحي «الفِراسة»، فلسفة البصيرة الإماراتية، ننطلق بإدراكٍ عميق نستبق به الاحتياجات، ونصقل التوجُّه، ونتّخذ القرارات بثقةٍ محسوبة.",
    "نجمع بين الإستراتيجية، والتطوير، والعمارة، والإنشاء، والعلامة التجارية، والتنفيذ تحت توجُّهٍ واضح. ومن وحي «الفِراسة»، فلسفة البصيرة الإماراتية، ننطلق بإدراكٍ عميق نستبق به الاحتياجات، ونصقل المهارات، ونتّخذ القرارات بثقةٍ محسوبة."
  )
);

// ---------------------------------------------------------------------------
// 4. "What We Do" paragraph
// ---------------------------------------------------------------------------
children.push(h1("4. \"What We Do\" Paragraph (فقرة ماذا نعمل)"));
children.push(
  requiredChange([
    "At the beginning of the text, \"نحول الطموح إلى واقع\", a comma should be used instead of a period.",
    "In the sentence \"نحول المشاريع التجارية والسكنية،\", the comma should be removed so the text flows naturally.",
    "The phrase \"تربط بيزنت....\" should be corrected to \"بيزنت تربط بين الإستراتيجية والتنفيذ.\".",
  ])
);
children.push(spacer());
children.push(h2("Paragraph"));
children.push(
  ...beforeAfter(
    "نحوّل الطموح إلى واقع. من تطوير وإدارة المشاريع التجارية والسكنية، إلى العلامة التجارية، والتموضع في السوق، وإنشاءات قطاع الضيافة، وتأسيس الأعمال، ودراسات الجدوى، تربط بِيزنت بين الاستراتيجية والتنفيذ لتقديم مشاريع مجدية، ومتميّزة، ومصمَّمة لسوقها.",
    "نحوّل الطموح إلى واقع، من تطوير وإدارة المشاريع التجارية والسكنية إلى العلامة التجارية، والتموضع في السوق، وإنشاءات قطاع الضيافة، وتأسيس الأعمال، ودراسات الجدوى. بِيزنت تربط بين الإستراتيجية والتنفيذ لتقديم مشاريع مجدية، ومتميّزة، ومصمَّمة لسوقها."
  )
);

// ---------------------------------------------------------------------------
// 5. "A Tour in Biznet"
// ---------------------------------------------------------------------------
children.push(h1("5. \"A Tour in Biznet\" (جولة في بيزنت)"));
children.push(
  requiredChange([
    "There is no need to place department names at the top, as they are already displayed under each section.",
    "It is suggested to start with \"Our Services\" (خدماتنا) first, followed by \"Latest Projects\" (أحدث المشاريع).",
    "Add the Hamza (همزة) to the words \"الإستشارات\" (Consultations) and \"الإشتراك\" (Subscription).",
    "Change \"يمكنني الإلغاء\" (I can cancel) to \"يمكنك الإلغاء\" (You can cancel).",
  ])
);
children.push(spacer());

children.push(h2("Section lead (intro line at the top)"));
children.push(
  ...beforeAfter(
    "جولة في بِيزنت — المشاريع، والخدمات، والرؤى، وأبرز ما يُكتب عنها.",
    "جولة في بِيزنت."
  )
);

children.push(h2("Card 01 (was \"أحدث المشاريع\", now \"خدماتنا\")"));
children.push(
  ...beforeAfter(
    "01 — أحدث المشاريع\nنظرة أقرب على المشاريع التطويرية والمحطّات التي تُشكِّل حضور بِيزنت المتنامي.",
    "01 — خدماتنا\nخدمات إستشارية متكاملة مصمَّمة لنقل المشاريع من الفكرة إلى الإنجاز بدقّةٍ وهدفٍ واضح."
  )
);

children.push(h2("Card 02 (was \"خدماتنا\", now \"أحدث المشاريع\")"));
children.push(
  ...beforeAfter(
    "02 — خدماتنا\nخدمات استشارية متكاملة مصمَّمة لنقل المشاريع من الفكرة إلى الإنجاز بدقّةٍ وهدفٍ واضح.",
    "02 — أحدث المشاريع\nنظرة أقرب على المشاريع التطويرية والمحطّات التي تُشكِّل حضور بِيزنت المتنامي."
  )
);

children.push(h2("Card 04 — Press Releases (Hamza on الإستشارات)"));
children.push(
  ...beforeAfter(
    "أحدث الإعلانات، والتكريمات، والشراكات، ومستجدّات القيادة من بِيزنت للاستشارات.",
    "أحدث الإعلانات، والتكريمات، والشراكات، ومستجدّات القيادة من بِيزنت للإستشارات."
  )
);

children.push(h2("Footer consent (يمكنني → يمكنك, hamza on اشتراك / استشارات)"));
children.push(
  ...beforeAfter(
    "أوافق على تلقّي رسائل تسويقية من بِيزنت للاستشارات، ويمكنني إلغاء الاشتراك في أيّ وقت. اطّلع على سياسة الخصوصية.",
    "أوافق على تلقّي رسائل تسويقية من بِيزنت للإستشارات، ويمكنك إلغاء الإشتراك في أيّ وقت. اطّلع على سياسة الخصوصية."
  )
);

children.push(h2("Subscribe loading state (hamza on اشتراك)"));
children.push(...beforeAfter("جارٍ الاشتراك...", "جارٍ الإشتراك..."));

children.push(h2("Consent required error (hamza on اشتراك)"));
children.push(
  ...beforeAfter(
    "يُرجى تأكيد الموافقة لإتمام الاشتراك.",
    "يُرجى تأكيد الموافقة لإتمام الإشتراك."
  )
);

children.push(h2("Subscribed success message (hamza on اشتراك)"));
children.push(
  ...beforeAfter(
    "تمّ اشتراكك — رسالة الترحيب في طريقها إليك.",
    "تمّ إشتراكك — رسالة الترحيب في طريقها إليك."
  )
);

// ---------------------------------------------------------------------------
// 6. Newsletter
// ---------------------------------------------------------------------------
children.push(h1("6. Newsletter (النشرة الإخبارية)"));
children.push(
  requiredChange([
    "Change \"رؤى المشاريع\" to \"رؤية المشاريع\".",
    "Remove the letter Waw (و) before the word \"الإصدارات\".",
  ])
);
children.push(spacer());
children.push(h2("Newsletter intro copy"));
children.push(
  ...beforeAfter(
    "اشترك لتصلك رؤى المشاريع، والإصدارات، والإعلانات.",
    "اشترك لتصلك رؤية المشاريع، الإصدارات، والإعلانات."
  )
);

// ---------------------------------------------------------------------------
// 7. Our Services
// ---------------------------------------------------------------------------
children.push(h1("7. Our Services (خدماتنا)"));
children.push(
  requiredChange([
    "Add a Hamza to \"استشارية\" so it becomes \"إستشارية\".",
    "Change \"المشاريع المتينة\" to \"المشاريع القوية\".",
    "Branding and Positioning slide rewording.",
    "Business Formation and Feasibility slide rewording.",
  ])
);
children.push(spacer());

children.push(h2("Who We Are — Slide 2 label (\"إستشارات متكاملة\")"));
children.push(...beforeAfter("استشارات متكاملة", "إستشارات متكاملة"));

children.push(h2("Branding and Positioning Slide"));
children.push(
  ...beforeAfter(
    "تبدأ سمعة المشروع بالتشكّل قبل أن يدخل السوق. نُدرك كيف ينبغي أن يُسمَّى، ويُموضَع، ويُقدَّم، ويُتواصَل بشأنه — لنصوغ هويةً واضحةً تخاطب الجمهور المنشود بثقةٍ وتميّز.",
    "تبدأ سمعة المشروع بالتشكّل قبل أن يدخل السوق. نعرف كيف ينبغي أن يُسمَّى، ويتموضع، ويتقدّم، ونتواصل بشأنه — لنصوغ هويةً واضحةً تخاطب الجمهور المنشود بثقةٍ وتميّز."
  )
);

children.push(h2("Business Formation and Feasibility Slide"));
children.push(
  ...beforeAfter(
    "تحتاج المشاريع المتينة إلى أساسٍ سليم. ندعم تأسيس الشركات، ودخول الأسواق، ودراسات الجدوى، والتخطيط المالي، وتقييم الاستثمار، بما يساعد عملاءنا على اتخاذ قراراتٍ مدروسة قبل تخصيص رأس المال، والوقت، والموارد.",
    "تحتاج المشاريع القوية إلى أساسٍ سليم. ندعم تأسيس الشركات، ودخول الأسواق، ودراسات الجدوى، والتخطيط المالي، وتقييم الاستثمار، بما يساعد عملاءنا على اتخاذ قراراتٍ مدروسة قبل تخصيص رأس المال، والوقت، والموارد."
  )
);

// ---------------------------------------------------------------------------
// 8. Legacy in Progress
// ---------------------------------------------------------------------------
children.push(h1("8. Legacy in Progress (إرث قيد التشكُّل)"));
children.push(
  requiredChange([
    "Change \"تخطيط متأن\" to \"تخطيط متأني.\".",
  ])
);
children.push(spacer());

children.push(h2("Explore grid — Legacy card description"));
children.push(
  ...beforeAfter(
    "مشاريع تطويرية تتشكّل بهدفٍ واضح، وتخطيطٍ متأنٍّ، ورؤيةٍ بعيدة المدى للقيمة والأثر والإرث.",
    "مشاريع تطويرية تتشكّل بهدفٍ واضح، وتخطيطٍ متأني، ورؤيةٍ بعيدة المدى للقيمة والأثر والإرث."
  )
);

children.push(h2("Upcoming projects paragraph (same phrase)"));
children.push(
  ...beforeAfter(
    "نتعامل مع مشاريعنا القادمة بتخطيطٍ متأنٍّ، وفهمٍ عميق للسوق، وتنفيذٍ منضبط. من المجتمعات السكنية والوجهات التجارية، إلى مفاهيم الضيافة والعقارات الخاصّة، نعتني بكلّ تفصيل منذ المراحل الأولى.",
    "نتعامل مع مشاريعنا القادمة بتخطيطٍ متأني، وفهمٍ عميق للسوق، وتنفيذٍ منضبط. من المجتمعات السكنية والوجهات التجارية، إلى مفاهيم الضيافة والعقارات الخاصّة، نعتني بكلّ تفصيل منذ المراحل الأولى."
  )
);

// ---------------------------------------------------------------------------
// 9. Press Releases
// ---------------------------------------------------------------------------
children.push(h1("9. Press Releases (البيانات الصحفية)"));
children.push(
  requiredChange([
    "Change \"انضم إلى القائمة لتصلك كل جديد\" to \"انضم إلى القائمة ليصلك كل جديد\".",
  ])
);
children.push(spacer());

children.push(h2("Press Release card description"));
children.push(
  ...beforeAfter(
    "إعلاناتٌ، وتكريماتٌ، وشراكاتٌ، ومستجدّاتٌ قيادية في طريقها إليك. انضمّ إلى القائمة لتصلك كلّ جديدٍ فور نشره.",
    "إعلاناتٌ، وتكريماتٌ، وشراكاتٌ، ومستجدّاتٌ قيادية في طريقها إليك. انضمّ إلى القائمة ليصلك كلّ جديدٍ فور نشره."
  )
);

// ---------------------------------------------------------------------------
// 10. The Visionary
// ---------------------------------------------------------------------------
children.push(h1("10. The Visionary (صاحب الرؤية)"));
children.push(
  requiredChange([
    "The text direction must be right-to-left.",
    "The picture is too dark.",
    "Remove the Shadda (شدة) from the name \"الحمّادي\" → \"الحمادي\".",
  ])
);
children.push(spacer());

children.push(h2("CEO name (homepage Visionary section)"));
children.push(...beforeAfter("إسماعيل الحمّادي", "إسماعيل الحمادي"));

children.push(h2("CEO name (CEO landing page)"));
children.push(...beforeAfter("إسماعيل الحمّادي", "إسماعيل الحمادي"));

// ---------------------------------------------------------------------------
// 11. Hamza sweep across Privacy Policy & Terms (added per follow-up)
// ---------------------------------------------------------------------------
children.push(
  h1("11. Hamza Sweep — Privacy Policy & Terms (consistency follow-up)")
);
children.push(
  requiredChange([
    "Apply the same hamza rule (الـ → الإ on استشارات / اشتراك / استشارية / استشارة / استثمارية) across all remaining body copy in Privacy Policy and Terms & Conditions.",
  ])
);
children.push(spacer());

children.push(
  h2("Privacy Policy — intro (and many other بِيزنت للاستشارات references)")
);
children.push(
  ...beforeAfter(
    "كيف تجمع بِيزنت للاستشارات المعلومات التي تشاركها معنا، وتستخدمها، وتحميها. نتعامل مع كلّ تفصيلٍ بالحرص والتحفّظ ذاتَيهما اللذين نتعامل بهما مع العمل نفسه.",
    "كيف تجمع بِيزنت للإستشارات المعلومات التي تشاركها معنا، وتستخدمها، وتحميها. نتعامل مع كلّ تفصيلٍ بالحرص والتحفّظ ذاتَيهما اللذين نتعامل بهما مع العمل نفسه."
  )
);

children.push(h2("Privacy Policy Section 01 (اشتراك / استشارة)"));
children.push(
  ...beforeAfter(
    "نجمع المعلومات التي تختار مشاركتها معنا — وتشمل عادةً اسمك، وبريدك الإلكتروني، ورقم هاتفك، وتفاصيل شركتك، وسياق استفسارك — وذلك عند التواصل معنا، أو الاشتراك في نشرتنا الإخبارية، أو الاستعانة بنا في استشارة.",
    "نجمع المعلومات التي تختار مشاركتها معنا — وتشمل عادةً اسمك، وبريدك الإلكتروني، ورقم هاتفك، وتفاصيل شركتك، وسياق استفسارك — وذلك عند التواصل معنا، أو الإشتراك في نشرتنا الإخبارية، أو الاستعانة بنا في إستشارة."
  )
);

children.push(h2("Privacy Policy Section 07 (إلغاء الاشتراك)"));
children.push(
  ...beforeAfter(
    "يحقّ لك طلب الاطّلاع على البيانات الشخصية التي نحتفظ بها عنك، أو طلب تصحيحها أو تحديثها، أو حذفها متى كان ذلك ممكناً. كما يحقّ لك إلغاء الاشتراك في مراسلاتنا في أيّ وقت عبر الرابط المُرفَق في كلّ رسالة.",
    "يحقّ لك طلب الاطّلاع على البيانات الشخصية التي نحتفظ بها عنك، أو طلب تصحيحها أو تحديثها، أو حذفها متى كان ذلك ممكناً. كما يحقّ لك إلغاء الإشتراك في مراسلاتنا في أيّ وقت عبر الرابط المُرفَق في كلّ رسالة."
  )
);

children.push(h2("Terms Section 05 — Disclaimer title and body"));
children.push(
  ...beforeAfter(
    "إخلاء مسؤولية الاستشارات والمشورة\nلا تُشكِّل المعلومات المنشورة على هذا الموقع خدماتٍ استشارية قانونية، أو مالية، أو استثمارية، أو مهنية، ما لم يُتَّفق على ذلك رسمياً بموجب تعاقدٍ خطّي.",
    "إخلاء مسؤولية الإستشارات والمشورة\nلا تُشكِّل المعلومات المنشورة على هذا الموقع خدماتٍ إستشارية قانونية، أو مالية، أو إستثمارية، أو مهنية، ما لم يُتَّفق على ذلك رسمياً بموجب تعاقدٍ خطّي."
  )
);

children.push(h2("CEO landing page — subscribe success"));
children.push(...beforeAfter("شكراً لاشتراكك.", "شكراً لإشتراكك."));

children.push(h2("Navbar tag (currently unused in UI, aligned for consistency)"));
children.push(...beforeAfter("ما نقدّمه", "ماذا نعمل"));

// ---------------------------------------------------------------------------
// Document assembly
// ---------------------------------------------------------------------------

const doc = new Document({
  creator: "Biznet Phase 1",
  title: "Biznet Arabic Translation Changes — Before / After",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, color: ACCENT, font: "Calibri" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, color: "1F2A3A", font: "Calibri" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Biznet Consulting — Arabic Translation Changes",
                  color: MUTED,
                  size: 18,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", color: MUTED, size: 18 }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  color: MUTED,
                  size: 18,
                }),
                new TextRun({ text: " of ", color: MUTED, size: 18 }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  color: MUTED,
                  size: 18,
                }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

const outPath = path.join(
  __dirname,
  "Biznet-Arabic-Translation-Changes.docx"
);

Packer.toBuffer(doc)
  .then((buf) => {
    fs.writeFileSync(outPath, buf);
    console.log("Wrote", outPath, "(", buf.length, "bytes )");
  })
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
