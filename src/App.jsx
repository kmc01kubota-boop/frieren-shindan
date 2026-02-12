import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, BookOpen, Clock, Heart, Shield, Compass,
  ChevronRight, RotateCcw, Share2, Star, Wind, Feather,
  Quote, ArrowRight, Crosshair, Flame, Swords
} from 'lucide-react';

/* ============================================================
   FEATURE FLAGS
   ============================================================ */
const SHOW_ADS = false;

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const C = {
  water:     '#0E7490',
  waterDark: '#164E63',
  waterDeep: '#0C4A6E',
  waterMid:  '#0891B2',
  waterPale: '#ECFEFF',
  waterSoft: '#CFFAFE',
  text:      '#1E293B',
  textSub:   '#475569',
  textMuted: '#94A3B8',
  bg:        '#FFFFFF',
  bgAlt:     '#F8FAFC',
  border:    '#E2E8F0',
  borderLight: '#F1F5F9',
};

/* ============================================================
   CHARACTER DATA
   ============================================================ */
const CHARACTERS = {
  frieren: {
    name: 'フリーレン',
    nameEn: 'Frieren',
    title: '果てなき探求者',
    titleEn: 'The Eternal Seeker',
    accent: '#0E7490',
    accentBg: 'rgba(14,116,144,0.06)',
    accentBorder: 'rgba(14,116,144,0.15)',
    description:
      'あなたは静かに、しかし誰よりも深く物事の本質を追求する人です。効率と合理性を重んじながらも、その奥底には計り知れない愛情が静かに流れています。\n\n大切なものの価値に、時間が経ってから気づくこともあるでしょう。しかしそれは弱さではありません。あなたが本当に深い場所で人と繋がっている証です。\n\n千年の時を超えてなお色褪せない絆を信じる力——それがあなたの魔法です。',
    traits: ['合理主義', '深い愛情', '専門性の追求', '静謐な強さ'],
    quote: '人を知ろうとすること——それが、魔法の始まりだ。',
    icon: Sparkles,
  },
  himmel: {
    name: 'ヒンメル',
    nameEn: 'Himmel',
    title: '希望を繋ぐ勇者',
    titleEn: 'The Hero of Hope',
    accent: '#2563EB',
    accentBg: 'rgba(37,99,235,0.06)',
    accentBorder: 'rgba(37,99,235,0.15)',
    description:
      'あなたは周囲に光を与え、人々の中にある最善の部分を引き出す存在です。自分のためではなく、未来の誰かのために今を全力で生きる。\n\nその姿勢が、あなたの周りの人たちに勇気と希望を与えています。自己犠牲ではなく、自己肯定の上に成り立つ利他主義——それがあなたの真の強さです。\n\n「僕のしたことは、きっと誰かが覚えていてくれる」——その信念が、世界を照らしています。',
    traits: ['利他主義', '自己肯定感', '未来志向', 'カリスマ性'],
    quote: '僕がしたことは、未来の誰かが覚えていてくれればいい。',
    icon: Star,
  },
  fern: {
    name: 'フェルン',
    nameEn: 'Fern',
    title: '秩序の守り手',
    titleEn: 'The Disciplined Guardian',
    accent: '#7C3AED',
    accentBg: 'rgba(124,58,237,0.06)',
    accentBorder: 'rgba(124,58,237,0.15)',
    description:
      'あなたは優れた実務能力と揺るぎない規律で、組織やチームの土台を支える存在です。感情に流されず、やるべきことを確実にこなす。\n\nその姿は時に厳しく映るかもしれませんが、それは大切な人を守るための愛情の表現に他なりません。\n\n現実を直視する勇気と、地道な努力を積み重ねる強さ。「当たり前」を「当たり前」にやり続けること——それがあなたの真価です。',
    traits: ['規律正しさ', '実務能力', '責任感', '確かな愛情'],
    quote: '当たり前のことを、当たり前にやるだけです。',
    icon: BookOpen,
  },
  stark: {
    name: 'シュタルク',
    nameEn: 'Stark',
    title: '不屈の挑戦者',
    titleEn: 'The Unyielding Challenger',
    accent: '#EA580C',
    accentBg: 'rgba(234,88,12,0.06)',
    accentBorder: 'rgba(234,88,12,0.15)',
    description:
      'あなたは自分の弱さを知っているからこそ、誰よりも強くなれる人です。恐怖を感じながらも一歩を踏み出す——その勇気は、生まれ持った才能よりもずっと尊いものです。\n\n謙虚さと真っ直ぐな心が、困難な状況でも折れない芯の強さを生み出しています。\n\n現場で最も頼りにされる真の実力者。「怖いのは当然だ。それでも前に進む」——その姿が、仲間を奮い立たせます。',
    traits: ['勇気', '謙虚さ', '成長意欲', '仲間への忠誠'],
    quote: '怖いのは当然だ。それでも前に進むから意味がある。',
    icon: Shield,
  },
  heiter: {
    name: 'ハイター',
    nameEn: 'Heiter',
    title: '慈愛の導き手',
    titleEn: 'The Gentle Mentor',
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.06)',
    accentBorder: 'rgba(5,150,105,0.15)',
    description:
      'あなたはユーモアと深い洞察力で、周囲の人々を導く精神的支柱です。酸いも甘いも噛み分けた経験が、あなたの言葉に重みと温かさを与えています。\n\n表面的には飄々としていても、その内側には確固たる信念と、次世代への深い愛情が宿っています。\n\n「何を残すかではなく、誰に託すか」——その問いの答えを、あなたは既に知っています。',
    traits: ['余裕', 'ユーモア', '洞察力', '次世代育成'],
    quote: '大切なのは、何を残すかではなく、誰に託すかだ。',
    icon: Feather,
  },
  eisen: {
    name: 'アイゼン',
    nameEn: 'Eisen',
    title: '不動の礎',
    titleEn: 'The Immovable Foundation',
    accent: '#78716C',
    accentBg: 'rgba(120,113,108,0.06)',
    accentBorder: 'rgba(120,113,108,0.15)',
    description:
      'あなたは言葉ではなく行動で信頼を勝ち取る、真の職人です。多くを語らずとも、揺るぎない信念と圧倒的な実力で結果を出し続ける。\n\nその姿を見て、周囲は安心し、自分も頑張ろうと思えるのです。\n\n年月を経て磨かれた技と精神——それはどんな言葉よりも雄弁に、あなたの生き様を物語っています。背中で語る、それがあなたの流儀です。',
    traits: ['寡黙な信頼', '職人気質', '揺るぎない信念', '圧倒的実力'],
    quote: '背中で語れ。言葉は、要らない。',
    icon: Compass,
  },
  kanone: {
    name: 'カノン',
    nameEn: 'Kanone',
    title: '秩序の執行者',
    titleEn: 'The Silent Executor',
    accent: '#6366F1',
    accentBg: 'rgba(99,102,241,0.06)',
    accentBorder: 'rgba(99,102,241,0.15)',
    description:
      'あなたは組織の中で完璧に役割を果たす、冷静なプロフェッショナルです。個人の感情や信念を押し殺してでも、与えられた任務を遂行する——その覚悟は、誰にでもできることではありません。\n\nそれは冷たさではなく、「守るべきもののために自分を律する」という、もう一つの愛の形です。\n\n秩序の中にこそ人を守る力がある——その信念が、あなたの行動を静かに、しかし確実に導いています。',
    traits: ['任務遂行', '自己犠牲', '冷静な判断', '組織への忠誠'],
    quote: '任務は任務だ。私情を挟む余地はない。',
    icon: Crosshair,
  },
  loewe: {
    name: 'レーヴェ',
    nameEn: 'Löwe',
    title: '不才の極致',
    titleEn: 'The Defiant Mortal',
    accent: '#DC2626',
    accentBg: 'rgba(220,38,38,0.06)',
    accentBorder: 'rgba(220,38,38,0.15)',
    description:
      'あなたは圧倒的な才能の壁の前でも、決して膝を折らない反骨の人です。魔法のような生まれ持った天賦がなくとも、己の肉体と技術だけを武器に、頂点に挑み続ける。\n\nその泥臭い努力は、華やかな才能以上に人の心を打ちます。「持たざる者」だからこそ見える景色がある。\n\n才能に恵まれなかったことを言い訳にしない。その生き様そのものが、不才の極致という名の才能です。',
    traits: ['反骨精神', '泥臭い努力', '技術至上主義', '才能への挑戦'],
    quote: '才能がないなら、この手で掴み取るまでだ。',
    icon: Flame,
  },
  wirbel: {
    name: 'ヴィアベル',
    nameEn: 'Wirbel',
    title: '灰色の守護者',
    titleEn: 'The Gray Guardian',
    accent: '#57534E',
    accentBg: 'rgba(87,83,78,0.06)',
    accentBorder: 'rgba(87,83,78,0.15)',
    description:
      'あなたは正義と現実の狭間で、誰よりも重い覚悟を背負って立つ人です。きれいごとだけでは守れないものがある——その真実を知った上で、汚れ役を引き受ける強さを持っています。\n\n清廉潔白な英雄ではなく、灰色の領域で泥にまみれながらも仲間を守り抜く。それが、あなたの選んだ正義の形です。\n\n「綺麗な手のままでは、誰も守れない」——その重い覚悟が、隊のみんなを生かしています。',
    traits: ['現実主義', '覚悟', '隊を守る責任', '灰色の正義'],
    quote: '綺麗な手のままでは、誰も守れない。',
    icon: Swords,
  },
};

/* ============================================================
   QUESTIONS DATA
   ============================================================ */
const QUESTIONS = [
  {
    id: 1,
    category: '仕事の流儀',
    text: '長年取り組んできたプロジェクトが\nようやく完了した。\nそのとき、最初に浮かぶ感情は？',
    icon: Clock,
    answers: [
      { text: '「次はもっと上手くやれる」と、既に改善点を考えている', scores: { frieren: 5, fern: 2, eisen: 2, kanone: 1 } },
      { text: '関わった全員の顔を思い浮かべ、感謝が込み上げる', scores: { himmel: 5, heiter: 2, stark: 1, wirbel: 1 } },
      { text: '達成の安堵と共に、もう少し早くできたはずだと省みる', scores: { fern: 5, frieren: 2, stark: 1, kanone: 2 } },
      { text: '「自分にもできた」という静かな自信が、胸に灯る', scores: { stark: 5, eisen: 2, himmel: 1, loewe: 2 } },
    ],
  },
  {
    id: 2,
    category: '人との距離感',
    text: '信頼していた人が、あなたの知らないところで\n重大な決断をしていた。\nあなたの反応は？',
    icon: Heart,
    answers: [
      { text: 'なぜ相談してくれなかったのか、理由を冷静に分析する', scores: { frieren: 5, fern: 2, kanone: 1 } },
      { text: 'その人なりの事情があったはずだと、まず信じてみる', scores: { himmel: 4, heiter: 3, stark: 1 } },
      { text: '率直に不満を伝え、今後のルールを提案する', scores: { fern: 5, eisen: 2, kanone: 2 } },
      { text: '静かに距離を置き、行動で判断する時間を設ける', scores: { eisen: 5, frieren: 2, stark: 1, wirbel: 2 } },
    ],
  },
  {
    id: 3,
    category: '時間の捉え方',
    text: '「あなたにとって"時間"とは何ですか」\nと問われたら、どう答える？',
    icon: Clock,
    answers: [
      { text: '取り返しがつかないからこそ、一瞬一瞬を味わうもの', scores: { himmel: 5, stark: 2, loewe: 1 } },
      { text: '過去の蓄積が、未来の可能性を広げていく連続体', scores: { frieren: 5, eisen: 2, heiter: 1 } },
      { text: '有限だからこそ、優先順位をつけて管理すべきリソース', scores: { fern: 5, frieren: 2, kanone: 2 } },
      { text: '人と人との間に流れる、目に見えない絆のようなもの', scores: { heiter: 5, himmel: 3, wirbel: 1 } },
    ],
  },
  {
    id: 4,
    category: 'リーダーシップ',
    text: '後輩が大きなミスをした。\nあなたが最初にすることは？',
    icon: BookOpen,
    answers: [
      { text: 'ミスの原因を一緒に分析し、再発防止策を考える', scores: { frieren: 4, fern: 3, eisen: 1, kanone: 1 } },
      { text: '「大丈夫、ここからどう挽回するかが大事だ」と励ます', scores: { himmel: 5, heiter: 2, stark: 1 } },
      { text: 'まず自分がリカバリーし、後から振り返りの場を設ける', scores: { fern: 4, eisen: 3, stark: 1, wirbel: 2 } },
      { text: '自分の過去の失敗談を話し、「誰にでもある」と安心させる', scores: { heiter: 5, himmel: 2, stark: 1, loewe: 1 } },
    ],
  },
  {
    id: 5,
    category: '休息と充電',
    text: '休日の過ごし方として、\n最も心が安らぐのは？',
    icon: Wind,
    answers: [
      { text: '誰にも邪魔されず、好きな分野の知識を深める時間', scores: { frieren: 5, eisen: 2 } },
      { text: '気の合う仲間と、何気ない会話を楽しむひととき', scores: { himmel: 4, heiter: 3, stark: 1, wirbel: 1 } },
      { text: '溜まった仕事を片付け、環境を整えること', scores: { fern: 5, eisen: 1, kanone: 2 } },
      { text: '新しい場所を訪れ、知らない世界に触れる冒険', scores: { stark: 4, himmel: 2, heiter: 2, loewe: 1 } },
    ],
  },
  {
    id: 6,
    category: '意思決定',
    text: 'チーム内で意見が\n真っ二つに割れている。\nあなたはどう動く？',
    icon: Compass,
    answers: [
      { text: 'データと事実に基づき、最も合理的な選択肢を提示する', scores: { frieren: 5, fern: 2, kanone: 1 } },
      { text: '全員が納得できる第三の道を、対話の中から見つけ出す', scores: { himmel: 5, heiter: 2 } },
      { text: '議論を整理し、期限を決めて決断を促す', scores: { fern: 5, eisen: 2, kanone: 2 } },
      { text: '静かに両方の意見を聞き、最後に信念を一言だけ述べる', scores: { eisen: 5, heiter: 2, frieren: 1, wirbel: 1 } },
    ],
  },
  {
    id: 7,
    category: '人生哲学',
    text: '人生で最も大切にしていることを\nひとつだけ挙げるとしたら？',
    icon: Heart,
    answers: [
      { text: '真実を追求し、本質を見極める力', scores: { frieren: 5, eisen: 2 } },
      { text: '誰かの記憶に残る、意味のある生き方', scores: { himmel: 5, heiter: 2, loewe: 1 } },
      { text: '約束を守り、信頼関係を積み重ねること', scores: { fern: 4, eisen: 3, stark: 1, kanone: 1 } },
      { text: '困難から逃げず、自分自身を超え続けること', scores: { stark: 5, himmel: 1, eisen: 2, loewe: 2 } },
    ],
  },
  {
    id: 8,
    category: '過去の思い出',
    text: '「あの人がいなければ今の自分はない」\n——その人はどんな存在？',
    icon: Star,
    answers: [
      { text: '言葉少なに、ただ隣にいてくれた人', scores: { eisen: 5, frieren: 3, wirbel: 1 } },
      { text: '自分の可能性を信じ、背中を押してくれた人', scores: { himmel: 5, stark: 2, heiter: 1, loewe: 1 } },
      { text: '厳しくも温かく、正しい道を示してくれた人', scores: { fern: 3, heiter: 4, eisen: 1, kanone: 1 } },
      { text: '一緒に悩み、一緒に乗り越えてくれた戦友', scores: { stark: 4, himmel: 2, fern: 2, wirbel: 2 } },
    ],
  },
  {
    id: 9,
    category: '未来への手紙',
    text: '10年後の自分に手紙を書くとしたら、\n最も伝えたいことは？',
    icon: Feather,
    answers: [
      { text: '「あの日知りたかったことの答えは見つかっただろうか」', scores: { frieren: 5, heiter: 2 } },
      { text: '「あなたの周りの人たちは、笑っているだろうか」', scores: { himmel: 5, heiter: 2, stark: 1, wirbel: 1 } },
      { text: '「やるべきことを、最後までやり遂げただろうか」', scores: { fern: 5, eisen: 3, kanone: 2 } },
      { text: '「あの時の自分を、誇りに思えているだろうか」', scores: { stark: 5, himmel: 2, loewe: 2 } },
    ],
  },
  {
    id: 10,
    category: '旅の果てに',
    text: '長い旅の終わりに、\nあなたが最も持ち帰りたいものは？',
    icon: Sparkles,
    answers: [
      { text: '世界の仕組みに対する、より深い理解', scores: { frieren: 5, eisen: 1 } },
      { text: '共に歩いた仲間たちとの、かけがえのない記憶', scores: { himmel: 5, stark: 2, heiter: 1, wirbel: 1 } },
      { text: '確かな成長の実感と、次に繋がる教訓', scores: { fern: 3, stark: 3, eisen: 2, loewe: 2 } },
      { text: '誰かに受け継がれていく、静かな希望', scores: { heiter: 5, himmel: 2, frieren: 1, kanone: 1 } },
    ],
  },
  {
    id: 11,
    category: '組織と信念',
    text: '所属する組織の方針と、\nあなた個人の信念が\n真っ向から対立した。どうする？',
    icon: Crosshair,
    answers: [
      { text: '組織の決定に従う。個人の感情より、全体の秩序が優先だ', scores: { kanone: 5, fern: 3, eisen: 1 } },
      { text: '自分の信念を貫く。組織に従って魂を売ることはできない', scores: { loewe: 4, stark: 3, himmel: 2 } },
      { text: '表向きは従いつつ、内側からルールを変える方法を探る', scores: { wirbel: 5, heiter: 2, frieren: 1 } },
      { text: '対話を重ね、組織と信念の両方を活かす道を見つける', scores: { himmel: 5, heiter: 3, fern: 1 } },
    ],
  },
  {
    id: 12,
    category: '才能と努力',
    text: '圧倒的な才能を持つ人物が\n目の前に現れた。\nあなたはどう向き合う？',
    icon: Flame,
    answers: [
      { text: 'その才能の構造を分析し、自分なりに再現を試みる', scores: { frieren: 5, fern: 2, kanone: 1 } },
      { text: '才能では敵わなくとも、自分だけの武器を磨いて挑む', scores: { loewe: 5, stark: 3, eisen: 1 } },
      { text: '素直に敬意を払い、その人から学べることを吸収する', scores: { stark: 4, himmel: 3, heiter: 1, fern: 1 } },
      { text: '才能は才能、自分は自分。与えられた持ち場で全力を尽くす', scores: { kanone: 4, eisen: 3, wirbel: 2 } },
    ],
  },
  {
    id: 13,
    category: '守るための覚悟',
    text: '大切な人たちを守るためには、\n自分の手を汚す必要がある。\nあなたの選択は？',
    icon: Swords,
    answers: [
      { text: '迷わず引き受ける。誰かがやらねばならないなら、自分がやる', scores: { wirbel: 5, eisen: 3, kanone: 2 } },
      { text: '手を汚さずに守る方法を、最後まで模索する', scores: { himmel: 5, frieren: 2, heiter: 1 } },
      { text: '引き受けるが、その代償を背負う覚悟を仲間にも伝える', scores: { stark: 4, wirbel: 2, loewe: 2, heiter: 1 } },
      { text: '汚れ仕事の構造自体を変えられないか、知恵を絞る', scores: { heiter: 4, frieren: 3, fern: 2 } },
    ],
  },
];

/* ============================================================
   SVG COMPONENTS
   ============================================================ */

// 蒼月草 (Blue Moonwort) - Start screen hero
function BlueMoonwortHero() {
  return (
    <div className="relative w-32 h-44 sm:w-40 sm:h-52 mx-auto my-6 sm:my-8">
      {/* Outer glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full animate-pulse-glow" style={{ background: 'radial-gradient(circle, rgba(14,116,144,0.12) 0%, transparent 70%)' }} />
      </div>
      <svg viewBox="0 0 160 210" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="rgba(14,116,144,0.20)" />
            <stop offset="100%" stopColor="rgba(14,116,144,0)" />
          </radialGradient>
          <radialGradient id="hero-petal" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(14,116,144,0.35)" />
            <stop offset="50%" stopColor="rgba(14,116,144,0.18)" />
            <stop offset="100%" stopColor="rgba(14,116,144,0.03)" />
          </radialGradient>
          <linearGradient id="hero-stem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14,116,144,0.25)" />
            <stop offset="100%" stopColor="rgba(14,116,144,0.05)" />
          </linearGradient>
        </defs>
        {/* Ambient glow */}
        <circle cx="80" cy="72" r="48" fill="url(#hero-glow)" />
        {/* Petals */}
        {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((angle, i) => (
          <ellipse
            key={i}
            cx="80" cy="72"
            rx="10" ry="26"
            fill="url(#hero-petal)"
            transform={`rotate(${angle} 80 72) translate(0 -16)`}
            style={{ opacity: 0.7 + (i % 2) * 0.15 }}
          />
        ))}
        {/* Center */}
        <circle cx="80" cy="72" r="7" fill="rgba(14,116,144,0.25)" />
        <circle cx="80" cy="72" r="3.5" fill="rgba(14,116,144,0.40)" />
        {/* Stem */}
        <path d="M80 98 Q80 140 80 195" stroke="url(#hero-stem)" strokeWidth="1.5" fill="none" />
        {/* Leaves */}
        <ellipse cx="72" cy="145" rx="9" ry="4" fill="rgba(14,116,144,0.10)" transform="rotate(-25 72 145)" />
        <ellipse cx="90" cy="162" rx="8" ry="3.5" fill="rgba(14,116,144,0.08)" transform="rotate(20 90 162)" />
      </svg>
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
            background: `rgba(14,116,144,${0.15 + Math.random() * 0.2})`,
            left: `${30 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 30}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3.5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Decorative divider
function Divider({ color = C.water, className = '' }) {
  return (
    <svg viewBox="0 0 240 16" className={`w-36 sm:w-44 mx-auto ${className}`} xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="8" x2="95" y2="8" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <circle cx="108" cy="8" r="1.5" fill={color} opacity="0.2" />
      <circle cx="120" cy="8" r="2.5" fill={color} opacity="0.35" />
      <circle cx="132" cy="8" r="1.5" fill={color} opacity="0.2" />
      <line x1="145" y1="8" x2="240" y2="8" stroke={color} strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

// Magic analysis circle
function MagicCircle() {
  return (
    <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto">
      {/* Outer ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-magic-spin" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="none" stroke={C.water} strokeWidth="0.5" opacity="0.2" />
        <circle cx="100" cy="100" r="90" fill="none" stroke={C.water} strokeWidth="0.5" opacity="0.3"
          strokeDasharray="8 12" />
        {/* Rune markers */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 100 + 90 * Math.cos(rad);
          const y = 100 + 90 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="2.5" fill={C.water} opacity="0.3" />;
        })}
      </svg>
      {/* Inner ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-magic-spin-reverse" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="65" fill="none" stroke={C.water} strokeWidth="0.5" opacity="0.2" />
        <circle cx="100" cy="100" r="65" fill="none" stroke={C.water} strokeWidth="0.5" opacity="0.25"
          strokeDasharray="4 8" />
        {/* Inner rune markers */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 100 + 65 * Math.cos(rad);
          const y = 100 + 65 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="1.5" fill={C.water} opacity="0.25" />;
        })}
      </svg>
      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full animate-pulse-glow" style={{ background: `radial-gradient(circle, rgba(14,116,144,0.15) 0%, transparent 70%)` }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles size={20} className="sm:hidden opacity-40" style={{ color: C.water }} />
        <Sparkles size={24} className="hidden sm:block opacity-40" style={{ color: C.water }} />
      </div>
    </div>
  );
}


/* ============================================================
   SCREEN: START
   ============================================================ */
function StartScreen({ onStart }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-5 py-12 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-md w-full text-center">
        {/* Main title */}
        <motion.h1
          className="text-[1.65rem] sm:text-3xl md:text-[2.5rem] font-semibold tracking-[0.12em] sm:tracking-[0.18em] leading-tight mb-2"
          style={{ color: C.waterDark }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          葬送のフリーレン
        </motion.h1>
        <motion.h2
          className="text-base sm:text-lg md:text-xl tracking-[0.2em] sm:tracking-[0.25em] mb-1"
          style={{ color: C.water }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          キャラクター診断
        </motion.h2>

        {/* Moonwort illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <BlueMoonwortHero />
        </motion.div>

        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Divider className="mb-5 sm:mb-6" />
          <p className="text-[15px] sm:text-base leading-relaxed tracking-wide mb-1" style={{ color: C.textSub }}>
            13の問いが、あなたの内に眠る
          </p>
          <p className="text-[15px] sm:text-base leading-relaxed tracking-wide mb-8 sm:mb-10" style={{ color: C.textSub }}>
            冒険者の魂を呼び覚ます ——
          </p>
        </motion.div>

        {/* CTA button */}
        <motion.button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 px-8 sm:px-10 py-4 sm:py-[1.125rem] rounded-full text-[15px] sm:text-base leading-normal tracking-[0.15em] sm:tracking-[0.2em] cursor-pointer transition-all duration-500 overflow-hidden border"
          style={{
            color: C.water,
            borderColor: C.water,
            background: 'transparent',
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.water;
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = C.water;
          }}
        >
          診断をはじめるよ
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </motion.button>

        {/* Footer note */}
        <motion.p
          className="mt-6 sm:mt-8 text-xs tracking-wider"
          style={{ color: C.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          所要時間 約3分 ・ 全13問
        </motion.p>
      </div>
    </motion.div>
  );
}


/* ============================================================
   SCREEN: QUESTION
   ============================================================ */
function QuestionScreen({ question, questionIndex, totalQuestions, onAnswer }) {
  const IconComp = question.icon;
  const [selected, setSelected] = useState(null);

  const handleSelect = (index, scores) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => {
      onAnswer(scores);
    }, 400);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-5 py-8 sm:py-10"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="mb-7 sm:mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: C.textMuted }}>
              Question {String(questionIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-[11px] sm:text-xs tracking-widest" style={{ color: C.textMuted }}>
              {questionIndex + 1} / {totalQuestions}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-[2px] rounded-full" style={{ background: C.borderLight }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: C.water }}
              initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Category badge */}
        <motion.div
          className="flex items-center gap-2 mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-1.5 rounded-md" style={{ background: C.waterPale }}>
            <IconComp size={14} className="sm:hidden" style={{ color: C.water }} />
            <IconComp size={16} className="hidden sm:block" style={{ color: C.water }} />
          </div>
          <span className="text-[13px] sm:text-sm tracking-widest" style={{ color: C.water }}>
            {question.category}
          </span>
        </motion.div>

        {/* Question text */}
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl leading-[1.85] sm:leading-[1.9] tracking-wide mb-8 sm:mb-10 whitespace-pre-line"
          style={{ color: C.text }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {question.text}
        </motion.h2>

        {/* Answer options */}
        <div className="space-y-5 sm:space-y-6">
          {question.answers.map((answer, index) => {
            const isSelected = selected === index;
            const isOther = selected !== null && selected !== index;
            return (
              <motion.button
                key={index}
                onClick={() => handleSelect(index, answer.scores)}
                disabled={selected !== null}
                className="group w-full text-left px-4 py-[18px] sm:p-5 md:p-6 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden"
                style={{
                  borderColor: isSelected ? C.water : C.border,
                  background: isSelected ? C.waterPale : C.bg,
                  opacity: isOther ? 0.4 : 1,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: isOther ? 0.4 : 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.06, duration: 0.35 }}
                whileHover={selected === null ? { borderColor: C.water, background: C.waterPale } : {}}
                whileTap={selected === null ? { scale: 0.985 } : {}}
              >
                <span className="flex items-start gap-3 sm:gap-3.5">
                  <span
                    className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center text-[11px] sm:text-xs mt-0.5 transition-all duration-300"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      borderColor: isSelected ? C.water : C.border,
                      color: isSelected ? '#FFFFFF' : C.textMuted,
                      background: isSelected ? C.water : 'transparent',
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className="text-[14px] sm:text-[15px] leading-relaxed tracking-wide transition-colors duration-300"
                    style={{ color: isSelected ? C.waterDark : C.text }}
                  >
                    {answer.text}
                  </span>
                </span>
                {/* Select indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ArrowRight size={14} className="sm:hidden" style={{ color: C.water }} />
                    <ArrowRight size={16} className="hidden sm:block" style={{ color: C.water }} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}


/* ============================================================
   SCREEN: ANALYZING
   ============================================================ */
function AnalyzingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { target: 30, delay: 400 },
      { target: 55, delay: 900 },
      { target: 78, delay: 1500 },
      { target: 92, delay: 2200 },
      { target: 100, delay: 2800 },
    ];
    const timers = steps.map(({ target, delay }) =>
      setTimeout(() => setProgress(target), delay)
    );
    const done = setTimeout(onComplete, 3400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [onComplete]);

  const messages = [
    '回答を分析しています…',
    '冒険者の資質を判定中…',
    '魂の共鳴を探しています…',
    'あなたの物語を紡いでいます…',
  ];
  const msgIndex = progress < 30 ? 0 : progress < 55 ? 1 : progress < 78 ? 2 : 3;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-5 py-12 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-sm w-full text-center">
        <motion.p
          className="text-[11px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase mb-8 sm:mb-10"
          style={{ fontFamily: "'Cinzel', serif", color: C.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Analyzing
        </motion.p>

        <MagicCircle />

        <motion.div
          className="mt-8 sm:mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              className="text-[15px] sm:text-base tracking-widest mb-5 sm:mb-6"
              style={{ color: C.textSub }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-40 sm:w-48 mx-auto h-[2px] rounded-full" style={{ background: C.borderLight }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: C.water }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs mt-3 tracking-wider" style={{ color: C.textMuted }}>
            {progress}%
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}


/* ============================================================
   SCREEN: RESULT
   ============================================================ */
function ResultScreen({ characterKey, onReset }) {
  const char = CHARACTERS[characterKey];
  const IconComp = char.icon;

  const shareText = `葬送のフリーレン キャラクター診断の結果は「${char.name}」（${char.title}）でした！\n\n「${char.quote}」`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '葬送のフリーレン キャラクター診断', text: shareText });
      } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('結果をクリップボードにコピーしました！');
      } catch { /* fallback */ }
    }
  };

  const handleXShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLineShare = () => {
    const url = `https://line.me/R/share?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen px-4 sm:px-5 py-10 sm:py-12 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-lg w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[11px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-2" style={{ fontFamily: "'Cinzel', serif", color: C.textMuted }}>
            Your Result
          </p>
          <p className="text-[15px] sm:text-base tracking-widest" style={{ color: C.textSub }}>
            あなたの中に眠る冒険者は ——
          </p>
        </motion.div>

        {/* Main result card */}
        <motion.div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: char.accentBorder, background: C.bg }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top accent bar */}
          <div className="h-1" style={{ background: char.accent }} />

          <div className="px-6 py-7 sm:p-8 md:p-10 text-center">
            {/* Icon */}
            <motion.div
              className="inline-flex p-3 sm:p-4 rounded-full mb-4 sm:mb-5"
              style={{ background: char.accentBg, border: `1px solid ${char.accentBorder}` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 18 }}
            >
              <IconComp size={24} className="sm:hidden" style={{ color: char.accent }} />
              <IconComp size={28} className="hidden sm:block" style={{ color: char.accent }} />
            </motion.div>

            {/* Character name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[0.12em] sm:tracking-[0.15em] mb-1" style={{ color: char.accent }}>
                {char.name}
              </h2>
              <p className="text-[13px] sm:text-sm tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-1" style={{ fontFamily: "'Cinzel', serif", color: C.textMuted }}>
                {char.nameEn}
              </p>
            </motion.div>

            <Divider color={char.accent} className="my-5 sm:my-6" />

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <p className="text-lg sm:text-xl tracking-[0.1em] sm:tracking-[0.12em] mb-0.5" style={{ color: C.text }}>
                {char.title}
              </p>
              <p className="text-[11px] sm:text-xs tracking-[0.35em] sm:tracking-[0.4em] uppercase mb-5 sm:mb-6" style={{ fontFamily: "'Cinzel', serif", color: C.textMuted }}>
                {char.titleEn}
              </p>
            </motion.div>

            {/* Traits */}
            <motion.div
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {char.traits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[13px] sm:text-sm tracking-wider border"
                  style={{
                    borderColor: char.accentBorder,
                    color: char.accent,
                    background: char.accentBg,
                  }}
                >
                  {trait}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              className="text-left mb-8 sm:mb-10 px-1 sm:px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25 }}
            >
              {char.description.split('\n\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[14px] sm:text-[15px] leading-[2.0] sm:leading-[2.1] tracking-wide"
                  style={{ color: C.textSub, marginBottom: i < char.description.split('\n\n').length - 1 ? '1.4em' : 0 }}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.div
              className="rounded-xl px-5 py-5 sm:px-6 sm:py-6 mx-1 sm:mx-2"
              style={{ background: char.accentBg, border: `1px solid ${char.accentBorder}` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Quote size={14} className="sm:hidden mx-auto mb-2.5 opacity-30" style={{ color: char.accent }} />
              <Quote size={16} className="hidden sm:block mx-auto mb-2.5 opacity-30" style={{ color: char.accent }} />
              <p className="text-[14px] sm:text-[15px] leading-[1.9] tracking-wide italic text-center" style={{ color: char.accent }}>
                {char.quote}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col gap-2.5 sm:gap-3 mt-6 sm:mt-8 justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          {/* Share row: X + LINE side by side */}
          <div className="flex gap-2.5 sm:gap-3">
            {/* X (Twitter) Share */}
            <button
              onClick={handleXShare}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full text-[14px] sm:text-[15px] tracking-wider transition-all duration-300 cursor-pointer border"
              style={{ color: '#FFFFFF', background: '#0f1419', borderColor: '#0f1419' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              Xでシェア
            </button>

            {/* LINE Share */}
            <button
              onClick={handleLineShare}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full text-[14px] sm:text-[15px] tracking-wider transition-all duration-300 cursor-pointer border"
              style={{ color: '#FFFFFF', background: '#06C755', borderColor: '#06C755' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
              LINEでシェア
            </button>
          </div>

          {/* Generic Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full text-[14px] sm:text-[15px] tracking-wider transition-all duration-300 cursor-pointer border"
            style={{ color: C.water, borderColor: C.water, background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.waterPale; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Share2 size={15} />
            結果をシェア
          </button>

          {/* Retry */}
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full text-[14px] sm:text-[15px] tracking-wider transition-all duration-300 cursor-pointer border"
            style={{ color: C.textMuted, borderColor: C.border, background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.textSub; e.currentTarget.style.color = C.textSub; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
          >
            <RotateCcw size={15} />
            もう一度診断する
          </button>
        </motion.div>

        {/* Ad Slot (hidden by default) */}
        {SHOW_ADS && (
          <motion.div
            className="mt-6 sm:mt-8 rounded-xl border p-5 sm:p-6 text-center"
            style={{ borderColor: C.borderLight, background: C.bgAlt }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            <p className="text-xs tracking-wider" style={{ color: C.textMuted }}>— AD —</p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          className="text-center mt-8 sm:mt-10 text-xs tracking-wider"
          style={{ color: C.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          葬送のフリーレン キャラクター診断
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
        >
          <a
            href="https://mote-iq.com"
            target="_blank"
            rel="noopener"
            className="text-xs tracking-wider underline decoration-dotted underline-offset-2 transition-colors"
            style={{ color: C.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.textSub}
            onMouseLeave={(e) => e.currentTarget.style.color = C.textMuted}
          >
            モテIQ｜大人の魅力診断
          </a>
          <a
            href="https://jujutsu-shindan.vercel.app"
            target="_blank"
            rel="noopener"
            className="text-xs tracking-wider underline decoration-dotted underline-offset-2 transition-colors"
            style={{ color: C.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.textSub}
            onMouseLeave={(e) => e.currentTarget.style.color = C.textMuted}
          >
            呪術廻戦キャラ診断
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}


/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [screen, setScreen] = useState('start');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ frieren: 0, himmel: 0, fern: 0, stark: 0, heiter: 0, eisen: 0, kanone: 0, loewe: 0, wirbel: 0 });
  const [result, setResult] = useState(null);
  const finalScoresRef = useRef(null);
  const questionIndexRef = useRef(0);

  // Keep ref in sync with state
  useEffect(() => {
    questionIndexRef.current = questionIndex;
  }, [questionIndex]);

  const handleStart = useCallback(() => {
    setScreen('quiz');
    setQuestionIndex(0);
    questionIndexRef.current = 0;
    setScores({ frieren: 0, himmel: 0, fern: 0, stark: 0, heiter: 0, eisen: 0, kanone: 0, loewe: 0, wirbel: 0 });
    setResult(null);
    finalScoresRef.current = null;
    window.scrollTo(0, 0);
  }, []);

  const handleAnswer = useCallback((answerScores) => {
    const currentIndex = questionIndexRef.current;
    const isLast = currentIndex + 1 >= QUESTIONS.length;

    setScores(prev => {
      const newScores = { ...prev };
      for (const [char, score] of Object.entries(answerScores)) {
        newScores[char] = (newScores[char] || 0) + score;
      }
      if (isLast) {
        finalScoresRef.current = newScores;
      }
      return newScores;
    });

    if (isLast) {
      setScreen('analyzing');
    } else {
      const next = currentIndex + 1;
      questionIndexRef.current = next;
      setQuestionIndex(next);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleAnalysisComplete = useCallback(() => {
    const s = finalScoresRef.current;
    if (!s) return;
    const winner = Object.entries(s).reduce(
      (max, [key, val]) => (val > max[1] ? [key, val] : max),
      ['frieren', 0]
    );
    setResult(winner[0]);
    setScreen('result');
    window.scrollTo(0, 0);
  }, []);

  const handleReset = useCallback(() => {
    setScreen('start');
    setQuestionIndex(0);
    questionIndexRef.current = 0;
    setScores({ frieren: 0, himmel: 0, fern: 0, stark: 0, heiter: 0, eisen: 0, kanone: 0, loewe: 0, wirbel: 0 });
    setResult(null);
    finalScoresRef.current = null;
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <StartScreen key="start" onStart={handleStart} />
        )}
        {screen === 'quiz' && (
          <QuestionScreen
            key={`q-${questionIndex}`}
            question={QUESTIONS[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={QUESTIONS.length}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'analyzing' && (
          <AnalyzingScreen key="analyzing" onComplete={handleAnalysisComplete} />
        )}
        {screen === 'result' && result && (
          <ResultScreen key="result" characterKey={result} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  );
}
