import { LegalPageLayout } from '../components/LegalPageLayout'

export function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="服務條款"
      documentTitle="服務條款 · AI有點嘴"
      footerNote="AI有點嘴不保證會改善你的人生，但可能讓你笑一下。"
    >
      <p className="legal-page__updated">最後更新：2026 年 6 月</p>

      <section className="legal-section">
        <h2>1. 接受條款</h2>
        <p>
          使用「AI有點嘴」（以下稱「本服務」）即表示您同意本服務條款。若您不同意，請停止使用本服務。
        </p>
      </section>

      <section className="legal-section">
        <h2>2. 服務性質</h2>
        <p>
          本服務<strong>僅供娛樂用途</strong>，旨在以幽默、吐槽、諷刺等方式提供 AI 生成內容，供使用者娛樂、分享與紓壓。本服務並非專業諮詢平台。
        </p>
      </section>

      <section className="legal-section">
        <h2>3. AI 內容免責</h2>
        <ul>
          <li>AI 產生的內容<strong>可能不準確、不完整或帶有偏誤</strong>，請勿視為事實或專業意見。</li>
          <li>
            本服務<strong>不構成</strong>投資、感情、醫療、法律、職涯或其他專業建議。
          </li>
          <li>任何重要決定，請<strong>自行判斷</strong>並諮詢合格專業人士。</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. 內容風格聲明</h2>
        <p>本服務可能產生以下性質的內容：</p>
        <ul>
          <li>吐槽、幽默、諷刺、誇飾或迷因式表述</li>
          <li>不同 AI 人格下的誇張或戲劇化語氣</li>
        </ul>
        <p>
          上述內容<strong>不代表</strong>對您的真實評價，也不代表開發團隊對您個人的任何立場。請以娛樂心態理解，勿過度解讀。
        </p>
      </section>

      <section className="legal-section">
        <h2>5. 使用者責任</h2>
        <ul>
          <li>您應對自己輸入的內容與使用行為負責。</li>
          <li>請勿利用本服務從事違法、騷擾、歧視或侵害他人權益之行為。</li>
          <li>請勿輸入您無權分享或涉及他人隱私的敏感資訊。</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. 使用限制</h2>
        <p>
          本服務可能設有 Free / Pro 等使用額度與功能限制。我們保留調整方案、限制、功能與可用性之權利，無需事先個別通知。
        </p>
      </section>

      <section className="legal-section">
        <h2>7. 智慧財產權</h2>
        <p>
          本服務之介面、品牌、程式與相關素材受適用法律保護。未經授權，請勿複製、改作或商用本服務之核心內容。您對自行輸入之內容保留相應權利；使用本服務所產生之 AI 回覆，其使用與分享請遵守適用法令與本平台規範。
        </p>
      </section>

      <section className="legal-section">
        <h2>8. 服務變更與終止</h2>
        <p>
          我們可能因維護、更新、法律或營運需要，暫停、修改或終止全部或部分服務，且不對因此產生之不便負擔超出法律規定之責任。
        </p>
      </section>

      <section className="legal-section">
        <h2>9. 責任限制</h2>
        <p>
          在法律允許的最大範圍內，本服務按「現狀」提供。對於因使用或無法使用本服務所生之任何直接、間接、附帶或衍生損害，我們不負賠償責任，除非依法不得排除。
        </p>
      </section>

      <section className="legal-section">
        <h2>10. 條款更新</h2>
        <p>
          我們可能更新本條款。更新後您繼續使用本服務，即視為接受修訂內容。請定期查閱本頁面。
        </p>
      </section>
    </LegalPageLayout>
  )
}
