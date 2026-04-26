import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "六君子湯 | RIKKUNSHITO",
  description:
    "胃のもたれ、食欲不振に。八つの生薬で構成される伝統的な漢方処方「六君子湯」の効能・構成生薬・服用方法を一覧できる情報サイト。",
};

const HERBS = [
  {
    kanji: "人参",
    reading: "ニンジン",
    role: "補気・健脾",
    desc: "気を補い、消化機能の中枢である「脾」を立て直す主薬。",
  },
  {
    kanji: "白朮",
    reading: "ビャクジュツ",
    role: "健脾・燥湿",
    desc: "脾を強化し、体内の余分な水分を取り除く。",
  },
  {
    kanji: "茯苓",
    reading: "ブクリョウ",
    role: "健脾・利水",
    desc: "穏やかに利水し、胃腸の停滞をほどく。",
  },
  {
    kanji: "甘草",
    reading: "カンゾウ",
    role: "補気・調和",
    desc: "他の生薬の作用を調和し、急迫した症状を緩める。",
  },
  {
    kanji: "陳皮",
    reading: "チンピ",
    role: "理気・健脾",
    desc: "気のめぐりを整え、もたれや張りを和らげる。",
  },
  {
    kanji: "半夏",
    reading: "ハンゲ",
    role: "燥湿化痰・止嘔",
    desc: "痰湿をさばき、吐き気を鎮める。",
  },
  {
    kanji: "大棗",
    reading: "タイソウ",
    role: "補気・調和",
    desc: "脾胃を養い、薬性をやさしく整える。",
  },
  {
    kanji: "生姜",
    reading: "ショウキョウ",
    role: "温中・止嘔",
    desc: "胃を温め、吐き気・冷えを和らげる。",
  },
] as const;

const INDICATIONS = [
  "胃炎",
  "胃腸虚弱",
  "胃下垂",
  "消化不良",
  "食欲不振",
  "胃痛",
  "嘔吐",
] as const;

const SOURCES = [
  {
    name: "クラシエ｜漢方セラピー 六君子湯",
    url: "https://www.kracie.co.jp/ph/k-therapy/prescription/rikkunsito.html",
  },
  {
    name: "ツムラ｜六君子湯エキス顆粒（一般用）",
    url: "https://www.tsumura.co.jp/brand/products/kampo/043.html",
  },
  {
    name: "日経メディカル｜ツムラ六君子湯エキス顆粒（医療用）",
    url: "https://medical.nikkeibp.co.jp/inc/all/drugdic/prd/52/5200141D1034.html",
  },
  {
    name: "kamponavi｜六君子湯",
    url: "https://www.kamponavi.com/med/1003",
  },
  {
    name: "名城大学｜漢方処方解説（8）六君子湯",
    url: "https://www.meijo-u.ac.jp/sp/harbal_medicine/2016/028.html",
  },
] as const;

function Package() {
  return (
    <div className="relative aspect-[2/5] w-64 shrink-0 overflow-hidden rounded-3xl border border-amber-200/20 bg-gradient-to-b from-emerald-950 via-[#0a1f15] to-neutral-950 shadow-[0_20px_80px_-20px_rgba(217,191,107,0.45)] sm:w-72">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,#fef3c7_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-4 rounded-2xl border border-amber-200/20" />
      <div className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-amber-200/40" />
      <div className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-amber-200/40" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-amber-200/40" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-amber-200/40" />

      <div className="relative flex h-full flex-col items-center justify-between px-7 py-9">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200/40 bg-gradient-to-br from-amber-200/15 to-amber-200/0">
            <span className="text-sm font-light text-amber-200">漢</span>
          </div>
          <p className="text-[0.55rem] font-light tracking-[0.5em] text-amber-200/70">
            KAMPO
          </p>
          <div className="h-px w-8 bg-amber-200/30" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div
            className="text-5xl font-light leading-[1.05] text-amber-50"
            style={{ writingMode: "vertical-rl", letterSpacing: "0.18em" }}
          >
            六君子湯
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-px w-10 bg-amber-200/40" />
            <p className="text-[0.55rem] font-light tracking-[0.45em] text-amber-200/70">
              RIKKUNSHITO
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[0.65rem] tracking-[0.3em] text-amber-100/80">
              胃腸虚弱
            </p>
            <p className="text-[0.65rem] tracking-[0.3em] text-amber-100/80">
              食欲不振
            </p>
          </div>
          <div className="flex items-center gap-3 text-[0.5rem] tracking-[0.35em] text-amber-200/50">
            <span>NO.43</span>
            <span className="h-2 w-px bg-amber-200/30" />
            <span>八味</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  ja,
  en,
}: {
  readonly ja: string;
  readonly en: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <h2 className="text-2xl font-light tracking-wide text-amber-50 sm:text-3xl">
        {ja}
      </h2>
      <p className="text-[0.55rem] font-light tracking-[0.4em] text-amber-200/50">
        {en}
      </p>
    </div>
  );
}

export default function RikkunshitoPage() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-950 text-amber-50">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,80,55,0.4),transparent)]" />

      <header className="relative border-b border-amber-200/10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-light tracking-[0.4em] text-amber-200/70">
              KAMPO
            </span>
            <span className="text-amber-200/30">/</span>
            <span className="text-xs font-light tracking-[0.3em] text-amber-100/70">
              RIKKUNSHITO
            </span>
          </div>
        </div>
      </header>

      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:flex-row sm:items-center sm:gap-16 sm:py-24">
        <Package />
        <div className="flex flex-col gap-6">
          <p className="text-[0.65rem] tracking-[0.5em] text-amber-200/60">
            漢 方 処 方 解 説
          </p>
          <h1 className="text-5xl font-light leading-[1.05] tracking-wide sm:text-6xl">
            六君子湯
            <span className="ml-3 text-base text-amber-200/60">
              りっくんしとう
            </span>
          </h1>
          <p className="text-lg font-light leading-relaxed text-amber-100/80 sm:text-xl">
            胃のもたれに、八つの生薬。
            <br />
            気を補い、めぐらせ、湿をさばく。
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-amber-100/60">
            体力中等度以下で胃腸が弱く、食欲がなく、みぞおちがつかえ、疲れやすく、
            手足が冷えやすい方の胃炎・消化不良・食欲不振などに用いられる、
            日本でもっとも処方頻度の高い漢方の一つです。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["第43番", "八味処方", "食前・食間"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-amber-200/20 bg-amber-200/5 px-3 py-1 text-[0.7rem] tracking-widest text-amber-100/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 py-12">
        <SectionHeading ja="効能・効果" en="EFFICACY" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <p className="rounded-2xl border border-amber-200/10 bg-zinc-900/40 p-6 text-sm leading-relaxed text-amber-100/80">
            「気」が滞り胃腸機能が落ちている状態に対し、気を補ってめぐらせる処方。
            食欲不振・吐き気・胃もたれ・消化不良・胸やけなど、
            <span className="text-amber-200">胃腸虚弱に伴う幅広い不調</span>
            に用いられます。
          </p>
          <p className="rounded-2xl border border-amber-200/10 bg-zinc-900/40 p-6 text-sm leading-relaxed text-amber-100/80">
            機能性ディスペプシアへの効果が研究されており、食欲を促す消化管ホルモン
            <span className="text-amber-200">「グレリン」の分泌促進作用</span>
            が報告されている近代的にも注目される処方です。
          </p>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 py-12">
        <SectionHeading ja="構成生薬" en="EIGHT HERBS" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-amber-100/60">
          「四君子湯」の六味に「二陳湯」の要素を加えた、
          補気と理気・化湿の絶妙なバランス。
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HERBS.map((herb, i) => (
            <article
              key={herb.kanji}
              className="group relative overflow-hidden rounded-2xl border border-amber-200/10 bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 p-5 transition hover:border-amber-200/30"
            >
              <span className="absolute right-3 top-3 text-[0.55rem] tracking-widest text-amber-200/30">
                0{i + 1}
              </span>
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-2xl font-light text-amber-50">
                    {herb.kanji}
                  </h3>
                  <p className="mt-1 text-[0.6rem] tracking-[0.25em] text-amber-200/60">
                    {herb.reading}
                  </p>
                </div>
                <p className="text-[0.65rem] tracking-widest text-amber-200/80">
                  {herb.role}
                </p>
                <p className="text-xs leading-relaxed text-amber-100/60">
                  {herb.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 py-12">
        <SectionHeading ja="適応症" en="INDICATIONS" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-amber-100/60">
          体力中等度以下で胃腸が弱く、食欲がなく、みぞおちがつかえ、
          疲れやすく、貧血性で手足が冷えやすい方の——
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {INDICATIONS.map((item) => (
            <span
              key={item}
              className="rounded-full border border-amber-200/20 bg-amber-200/5 px-5 py-2 text-sm tracking-wider text-amber-100/90"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 py-12">
        <SectionHeading ja="服用と注意" en="DOSAGE & NOTES" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <article className="rounded-2xl border border-amber-200/10 bg-zinc-900/40 p-6">
            <h3 className="text-sm tracking-[0.3em] text-amber-200/80">
              服 用 方 法
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-amber-100/70">
              <li>• 1日2〜3回に分けて服用</li>
              <li>• 食前または食間に水または白湯で</li>
              <li>• 軽症は数日〜1週間で実感、慢性症状は数週間〜数ヶ月</li>
              <li>• 用法用量は商品・症状により異なるため添付文書に従う</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-amber-200/10 bg-zinc-900/40 p-6">
            <h3 className="text-sm tracking-[0.3em] text-amber-200/80">
              副 作 用 ・ 注 意
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-amber-100/70">
              <li>
                • 比較的副作用は少ないが、湿疹・赤み・かゆみが出ることがある
              </li>
              <li>
                • まれに偽アルドステロン症（むくみ・筋脱力）、ミオパチー、肝機能障害（頻度不明）
              </li>
              <li>
                • 異常を感じたら服用を中止し、医師・薬剤師に相談
              </li>
              <li>• 妊娠・授乳中、他の薬を服用中の方は事前に相談</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-amber-200/15 bg-gradient-to-br from-emerald-950/40 via-zinc-900/40 to-neutral-950 p-6 sm:p-8">
          <p className="text-[0.65rem] tracking-[0.4em] text-amber-200/60">
            DISCLAIMER
          </p>
          <p className="mt-3 text-xs leading-relaxed text-amber-100/60">
            本サイトの情報は公開された製薬会社・解説情報の要約です。診断・治療を目的としたものではなく、
            実際の服用にあたっては医師・薬剤師・添付文書の指示に従ってください。
          </p>
        </div>
      </section>

      <footer className="relative border-t border-amber-200/10">
        <div className="mx-auto w-full max-w-5xl px-6 py-10">
          <p className="text-[0.6rem] tracking-[0.4em] text-amber-200/50">
            SOURCES
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-100/60 transition hover:text-amber-200"
                >
                  → {s.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[0.55rem] tracking-[0.4em] text-amber-200/30">
            © KAMPO ARCHIVE
          </p>
        </div>
      </footer>
    </div>
  );
}
