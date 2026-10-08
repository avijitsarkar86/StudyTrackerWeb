export const DAILY_BLOCKS = [
  { id: 'warmup', label: 'Warm-up / Exercise', time: '06:00-06:30', hours: 0.5, category: 'wellness', desc: 'Light stretching or a short jog. Wakes the body up and gets blood to the brain before the study session.' },
  { id: 'plant_care', label: 'Plant Care', time: '06:30-07:15', hours: 0.75, category: 'wellness', desc: 'Water and tend to the plants. A mindful, screen-free start that grounds you before Block 1.' },
  { id: 'vocab', label: 'Vocab Ritual', time: '07:45-08:15', hours: 0.5, category: 'study', desc: 'Learn 5 new words. Write each in a sentence. Review yesterday\'s 5 from your vocab journal.' },
  { id: 'block1', label: 'Block 1 - Primary GS', time: '08:15-10:45', hours: 2.5, category: 'study', isCore: true, desc: 'Your primary deep-read for the day. One subject, full focus, no multitasking. Follow today\'s rotation subject.' },
  { id: 'block1_c', label: 'Block 1 Consolidation', time: '10:45-11:15', hours: 0.5, category: 'study', desc: 'Right after Block 1 — close the book and write a 5-line summary from memory, create 5 flashcards, note open doubts. This seals the reading into short-term memory before the information fades.' },
  { id: 'block2', label: 'Block 2 - Compulsory Subject', time: '11:30-13:30', hours: 2.0, category: 'study', isCore: true, desc: 'Compulsory subject session following today\'s rotation. Focus on PYQs and active recall — not fresh reading.' },
  { id: 'block3', label: 'Block 3 - Secondary GS', time: '15:00-17:00', hours: 2.0, category: 'study', isCore: true, desc: 'Secondary GS subject for the day — a different subject from Block 1. Same level of focus required.' },
  { id: 'block4', label: 'Block 4 - Mathematics', time: '17:00-17:45', hours: 0.75, category: 'study', desc: 'Arithmetic, DI (Data Interpretation), and quantitative aptitude. Always timed — builds exam speed.' },
  { id: 'block5', label: 'Block 5 - Static GK', time: '17:45-18:00', hours: 0.25, category: 'study', desc: 'Quick flashcard pass on static GK: capitals, important articles, dates, awards. Recall only — no deep reading.' },
  { id: 'flute_pm', label: 'Flute - Evening', time: '18:00-18:30', hours: 0.5, category: 'wellness', desc: 'Not optional. 30 mins of flute is the mental reset that separates study mode from revision mode.' },
  { id: 'block6', label: 'Block 6 - Current Affairs', time: '18:30-19:15', hours: 0.75, category: 'study', desc: 'Read today\'s newspaper digest or CA module. Tag only what is relevant to WBCS or Misc syllabi.' },
  { id: 'block7', label: 'Block 7 - Spaced Revision', time: '19:15-20:15', hours: 1.0, category: 'study', desc: 'Review flashcards and notes from exactly 7 days ago — not today\'s content. This is the spaced repetition engine. Without it, material from week 1 will be 80% forgotten by week 5.' },
  { id: 'block8', label: 'Block 8 - Writing Practice', time: '22:00-22:30', hours: 0.5, category: 'study', desc: 'Write one GS answer in WBCS Mains format (150-250 words). Or one timed Bengali or English paragraph.' },
  { id: 'block9', label: 'Block 9 - Light Revision', time: '22:30-23:30', hours: 1.0, category: 'study', desc: 'Skim today\'s Block 1 and Block 3 notes. Do a 5-question self-test. No new material — only today\'s content.' },
];

export const SATURDAY_BLOCKS = [
  { id: 'morning_r', label: 'Morning Routine', time: '06:00-07:45', hours: 1.75, category: 'wellness', desc: 'Warmup, plant care, light breakfast. Get yourself into exam mindset before the mock starts.' },
  { id: 'prelims', label: 'Full Prelims Mock (200 MCQs)', time: '08:00-10:00', hours: 2.0, category: 'mock', isCore: true, desc: 'Full WBCS or Misc Prelims mock — 200 MCQs, 2 hours, strict exam conditions. No breaks, no phone, no peeking.' },
  { id: 'mains_sim', label: 'Mains Paper / 2nd Mock', time: '10:30-12:30', hours: 2.0, category: 'mock', desc: 'Second mock or a Mains simulation paper. Alternate between WBCS and Misc formats each week.' },
  { id: 'error_a', label: 'Mandatory Error Analysis', time: '15:00-17:00', hours: 2.0, category: 'study', isCore: true, desc: 'Two hours on every wrong answer from today\'s mock. Find the exact reason, note it in the error log. This session is more valuable than the mock itself.' },
  { id: 'flute_pm', label: 'Flute - Evening', time: '17:00-17:30', hours: 0.5, category: 'wellness', desc: 'Evening flute. Transition out of mock-day intensity before targeted revision.' },
  { id: 'tgt_rev', label: 'Targeted Revision', time: '17:30-19:30', hours: 2.0, category: 'study', desc: 'Deep revision of the specific topics that showed up in today\'s errors. Strike while the iron is hot.' },
  { id: 'math_booster_sat', label: 'Math Booster (DI / Arithmetic)', time: '22:00-22:45', hours: 0.75, category: 'study', desc: 'DI sets and arithmetic problems, strictly timed. Builds the calculation speed needed for the actual exam.' },
  { id: 'light_ca', label: 'Light CA / Flashcards', time: '22:45-23:30', hours: 0.75, category: 'study', desc: 'Light current affairs review with flashcards only. No heavy reading on mock evening — the brain needs partial rest.' },
];

export const SUNDAY_BLOCKS = [
  { id: 'plant_care', label: 'Plant Care (Extended)', time: '06:30-07:30', hours: 1.0, category: 'wellness', desc: 'Extended plant care — longer, slower, more mindful. The one morning this week without a clock watching you.' },
  { id: 'vocab', label: 'Vocab Ritual (Light)', time: '08:00-08:30', hours: 0.5, category: 'study', desc: 'Review the entire week\'s new vocabulary. No new words today — only recall and strengthen what you already learned.' },
  { id: 'eng_paper', label: 'English Descriptive Paper', time: '08:30-10:30', hours: 2.0, category: 'study', isCore: true, desc: 'Timed English descriptive paper (valid for both WBCS and Misc). One essay + one letter or passage. Strict timer, no extensions.' },
  { id: 'ben_paper', label: 'Bengali Paper (Timed)', time: '10:30-12:30', hours: 2.0, category: 'study', isCore: true, desc: 'Timed Bengali paper. One essay, one passage, one translation. Treat it exactly like the real exam room.' },
  { id: 'weak_area', label: 'Weak Area Deep-Dive', time: '12:30-13:30', hours: 1.0, category: 'study', desc: 'Deep-dive into your single biggest weak area from this week\'s error log. One topic, focused, no switching.' },
  { id: 'comp_subject_sun', label: 'Compulsory Subject Analysis', time: '15:00-17:00', hours: 2.0, category: 'study', desc: 'Sunday review of the week\'s compulsory subject content. Self-test, flashcard review, and gap identification.' },
  { id: 'flute_pm', label: 'Flute - Evening', time: '17:00-17:30', hours: 0.5, category: 'wellness', desc: 'Last mindful moment before you plan the next week. Do not skip this.' },
  { id: 'math_review_sun', label: 'Math Error Review', time: '22:00-22:30', hours: 0.5, category: 'study', desc: 'Review this week\'s Math errors. Understand the pattern behind each mistake — don\'t just redo the problem.' },
  { id: 'wk_plan', label: 'Next Week Planning', time: '22:30-23:00', hours: 0.5, category: 'planning', desc: 'Set specific goals for each block next week. Check the WEEK_PLAN chapter target. No vague plans — write exact pages or topics.' },
];

export const WEEKLY_ROTATION = {
  Monday: { block1: 'Indian History - Ancient & Medieval', block3: 'Indian Polity - Constitution, FR, DPSP' },
  Tuesday: { block1: 'Indian History - Modern & Freedom Struggle', block3: 'Indian Polity - Parliament, Judiciary, Local Bodies' },
  Wednesday: { block1: 'Geography - Physical India', block3: 'Indian Economy - Planning, Agriculture' },
  Thursday: { block1: 'Geography - West Bengal + Districts', block3: 'RBI, Banking, WB Economy & Budget' },
  Friday: { block1: 'General Science (Physics, Chemistry, Biology)', block3: 'Environment, Ecology, Computer Awareness' },
};

export const BLOCK2_ROTATION = {
  Monday: { module: 'Polity', practice: 'PYQs + 5-line recall summary' },
  Tuesday: { module: 'History', practice: 'Timeline drills + 10 MCQs' },
  Wednesday: { module: 'Geography', practice: 'Map work + location-based recall' },
  Thursday: { module: 'Economy', practice: 'Data interpretation + current affairs links' },
  Friday: { module: 'Science', practice: 'Fact recall + formula/diagram practice' },
};

// Working-professional variant: ~8.75h study + 4h work window, math increased to 1h
export const DAILY_BLOCKS_WORKING = [
  { id: 'warmup', label: 'Warm-up / Exercise', time: '06:00-06:30', hours: 0.5, category: 'wellness', desc: 'Light stretching or a short jog. Wakes the body up and gets blood to the brain before the study session.' },
  { id: 'plant_care', label: 'Plant Care', time: '06:30-07:00', hours: 0.5, category: 'wellness', desc: 'Water and tend to the plants. Mindful and screen-free before Block 1.' },
  { id: 'vocab', label: 'Vocab Ritual', time: '07:30-08:00', hours: 0.5, category: 'study', desc: 'Learn 5 new words. Write each in a sentence. Review yesterday\'s 5 from your vocab journal.' },
  { id: 'block1', label: 'Block 1 - Primary GS', time: '08:00-10:00', hours: 2.0, category: 'study', isCore: true, desc: 'Your primary deep-read for the day. One subject, full focus. Follow today\'s rotation subject.' },
  { id: 'block1_c', label: 'Block 1 Consolidation', time: '10:00-10:15', hours: 0.25, category: 'study', desc: 'Close the book — write a 5-line summary from memory, note 3 doubts, add 3 flashcards. Do this before work or the content fades.' },
  { id: 'work', label: 'Professional Work', time: '10:30-14:30', hours: 4.0, category: 'work', desc: 'Dedicated professional work window. Keep study materials away. A clean break makes the afternoon session sharper.' },
  { id: 'block2', label: 'Block 2 - Compulsory Subject', time: '15:00-16:30', hours: 1.5, category: 'study', isCore: true, desc: 'Compulsory subject session following today\'s rotation. PYQs and active recall — not fresh reading.' },
  { id: 'block3', label: 'Block 3 - Secondary GS', time: '16:30-18:00', hours: 1.5, category: 'study', isCore: true, desc: 'Secondary GS subject for the day — different from Block 1. Same level of focus required.' },
  { id: 'flute_pm', label: 'Flute - Evening', time: '18:00-18:30', hours: 0.5, category: 'wellness', desc: 'Not optional. 30 mins of flute is the mental reset between study and revision mode.' },
  { id: 'block4', label: 'Block 4 - Mathematics', time: '18:30-19:30', hours: 1.0, category: 'study', desc: 'Arithmetic, DI (Data Interpretation), quantitative aptitude. Always timed — builds exam speed.' },
  { id: 'block6', label: 'Block 6 - Current Affairs', time: '19:30-20:15', hours: 0.75, category: 'study', desc: 'Today\'s newspaper digest or CA module. Tag only what is relevant to WBCS or Misc syllabi.' },
  { id: 'block7', label: 'Block 7 - Spaced Revision', time: '20:15-21:15', hours: 1.0, category: 'study', desc: 'Review flashcards and notes from exactly 7 days ago — not today\'s content. This is how you stop forgetting what you read in week 1 by the time week 5 arrives.' },
  { id: 'block8', label: 'Block 8 - Writing Practice', time: '22:00-22:30', hours: 0.5, category: 'study', desc: 'Write one GS answer in WBCS Mains format (150-250 words). Or one timed Bengali or English paragraph.' },
  { id: 'block9', label: 'Block 9 - Light Revision', time: '22:30-23:00', hours: 0.5, category: 'study', desc: 'Skim today\'s Block 1 and Block 3 notes. Do a 5-question self-test. No new material — only today\'s content.' },
];

export const PHASE3_OVERRIDE = {
  13: 'Computer Awareness (Exam MCQ Pattern Focus)',
  14: 'Office Procedure & Admin (WB Service Rules, RTI Act)',
  15: 'Basic Law & Acts (Contract Act, CPC, WB Municipal Act)',
  16: 'WB Local Govt - DM/SDO/BDO, Panchayati Raj, District Admin',
};

export const PHASES = [
  { phase: 1, weeks: [1, 6], name: 'Foundation Reading', shortName: 'Foundation', color: '#1f7cff', period: 'Sep 2026', goal: 'First reading. Concept clarity only.' },
  { phase: 2, weeks: [7, 12], name: 'PYQ Depth + 2nd Reading', shortName: 'PYQ Depth', color: '#b057d6', period: 'Oct-Nov 2026', goal: 'Second reading + active recall. Mocks begin.' },
  { phase: 3, weeks: [13, 18], name: 'Writing + Misc-Only', shortName: 'Writing+Misc', color: '#ff9f1a', period: 'Dec 2026-Jan 2027', goal: 'Mains writing + Misc-only syllabus.' },
  { phase: 4, weeks: [19, 24], name: 'Full Dual Simulation', shortName: 'Simulation', color: '#ef4f5f', period: 'Feb 2027', goal: 'Peak performance. Revision + mocks only.' },
  { phase: 5, weeks: [25, 26], name: 'Buffer - Exam Ready', shortName: 'Buffer', color: '#27b06e', period: 'Mar 2027', goal: 'Light revision, rest, logistics check.' },
];

export const MOCK_WEEKS = {
  wbcs: [7, 9, 11, 13, 15, 19, 23],
  misc: [8, 10, 12, 14, 16, 20, 24],
};

export const SCORE_TARGETS = {
  2: { wbcs: [90, 110], misc: [100, 120], label: 'Building Base' },
  3: { wbcs: [110, 125], misc: [120, 135], label: 'Consolidating' },
  4: { wbcs: [130, 150], misc: [140, 155], label: 'Peak Readiness' },
};

export const WEEK_PLAN = [
  { week: 1, topic: 'Laxmikanth Ch 1-20 (Constitution, FR, DPSP) · NCERT History Gr.6-8' },
  { week: 2, topic: 'Laxmikanth Ch 21-40 (Parliament, Executive) · Bipan Chandra Modern Ch 1-10' },
  { week: 3, topic: 'NCERT History 6-8 full revision + timeline maps · Laxmikanth Ch 41-60' },
  { week: 4, topic: 'Bipan Chandra: Freedom Struggle + key events · Laxmikanth full revision' },
  { week: 5, topic: 'NCERT Geography 11-12 (Physical India, maps) · Ramesh Singh Ch 1-5' },
  { week: 6, topic: 'WB Geography + Districts + rivers + admin map · WB Economy & Budget basics' },
  { week: 7, topic: 'Geography 2nd reading + WBCS PYQs · Economy PYQs (WBCS & Misc)' },
  { week: 8, topic: 'RBI, Banking + current monetary policy · WB Budget & Economy PYQs' },
  { week: 9, topic: 'Lucent + NCERT 9-10: Physics & Chemistry · NCERT 9-10: Biology + facts' },
  { week: 10, topic: 'Shankar IAS Environment (all chapters) · Science PYQs — both exams' },
  { week: 11, topic: 'Polity 2nd reading + WBCS PYQs (10 years) · History 2nd reading + PYQs' },
  { week: 12, topic: 'Geography 2nd reading + Misc PYQs · Economy 2nd reading + Misc PYQs' },
  { week: 13, topic: 'Computer Awareness (MCQ focus)' },
  { week: 14, topic: 'Office Procedure & Admin' },
  { week: 15, topic: 'Basic Law & Acts' },
  { week: 16, topic: 'WB Local Govt Deep-Dive' },
  { week: 17, topic: 'English Mains - timed papers' },
  { week: 18, topic: 'Bengali Mains - timed papers' },
  { week: 19, topic: 'History + Polity final revision' },
  { week: 20, topic: 'Geography + Economy final revision' },
  { week: 21, topic: 'Science + Environment + Computer Awareness' },
  { week: 22, topic: 'Full compulsory revision + timed answers' },
  { week: 23, topic: '3 WBCS mocks + 3 Misc mocks' },
  { week: 24, topic: 'Final error logs review' },
  { week: 25, topic: '2 mocks + rest + light CA' },
  { week: 26, topic: 'Final mock + rest + logistics' },
];

export const MILESTONES = [
  { week: 6, title: 'Phase 1 Complete', body: 'Foundation reading done.' },
  { week: 12, title: 'Phase 2 Complete', body: 'Both PYQ tracks solved.' },
  { week: 16, title: 'Misc-Only Syllabus Done', body: 'All Misc-only topics covered.' },
  { week: 18, title: 'Phase 3 Complete', body: 'Writing fluency established.' },
  { week: 24, title: 'Simulation Complete', body: 'Error logs closed and revised.' },
  { week: 26, title: 'Exam Ready', body: 'All prep complete. Rest and perform.' },
];

export const ERROR_TYPES = {
  A: { label: 'Knowledge Gap', color: '#ef4f5f' },
  B: { label: 'Silly Mistake', color: '#ff9f1a' },
  C: { label: 'Trap Question', color: '#b057d6' },
};

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NON_NEGOTIABLE_RULES = [
  'Never leave Block 2 empty.',
  'Maintain separate WBCS and Misc error logs.',
  'Misc-only topics in Weeks 13-16 are mandatory.',
  'No new topics after Week 24. Revision only.',
  'Writing practice continues every night.',
  'Track mocks every Saturday.',
];
