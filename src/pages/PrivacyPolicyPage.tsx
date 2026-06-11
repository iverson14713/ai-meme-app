import { LegalPageLayout } from '../components/LegalPageLayout'

type PrivacyPolicyPageProps = {
  onBack: () => void
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="隱私權政策"
      onBack={onBack}
      footerNote="AI有點嘴不保證會改善你的人生，但可能讓你笑一下。"
    >
      <p className="legal-page__updated">最後更新：2026 年 6 月</p>

      <section className="legal-section">
        <h2>1. 概述</h2>
        <p>
          「AI有點嘴」（以下稱「本服務」）重視您的隱私。本政策說明我們如何收集、使用與保護與本服務相關的資訊。
        </p>
      </section>

      <section className="legal-section">
        <h2>2. 我們收集的資料</h2>
        <p>為提供 AI 分析與使用體驗，本服務可能處理以下資訊：</p>
        <ul>
          <li>
            <strong>使用者輸入問題</strong>：您在 App 中輸入的文字內容（例如人生抉擇、工作、感情等問題）。
          </li>
          <li>
            <strong>AI 分析結果</strong>：由 AI 產生的分析文字、結論與相關顯示內容。
          </li>
          <li>
            <strong>使用次數紀錄</strong>：例如每日使用額度、剩餘次數等，用於 Free / Pro 方案限制。
          </li>
          <li>
            <strong>LocalStorage 設定</strong>：儲存於您裝置瀏覽器中的偏好與狀態（例如 Pro 模式開關、使用次數計數、日期紀錄等）。
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. 資料如何使用</h2>
        <p>上述資料主要用於：</p>
        <ul>
          <li>產生 AI 分析回覆與分享內容</li>
          <li>管理每日使用額度與功能權限</li>
          <li>維持 App 基本運作與使用者設定</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. 第三方 AI 服務</h2>
        <p>
          本服務可能使用 OpenAI 等第三方人工智慧服務處理您的輸入內容，以產生分析結果。第三方服務有其各自的資料處理政策；我們會在合理範圍內選擇可信賴的服務提供者，並僅傳送提供功能所必要的內容。
        </p>
      </section>

      <section className="legal-section">
        <h2>5. 資料分享與出售</h2>
        <ul>
          <li>我們<strong>不出售</strong>您的個人資料。</li>
          <li>我們<strong>不主動分享</strong>您的個人資料予第三方作行銷用途。</li>
          <li>
            若法律要求、或為保護本服務與使用者安全所必要，我們可能在符合法令的前提下提供相關資訊。
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. 資料保存</h2>
        <p>
          使用次數與設定主要保存在您裝置的 LocalStorage 中。清除瀏覽器資料可能導致這些紀錄重置。伺服器端若處理 API 請求，相關紀錄依服務營運需要保存，我們不會無必要地長期保留可識別個人的內容。
        </p>
      </section>

      <section className="legal-section">
        <h2>7. 您的選擇</h2>
        <p>
          您可隨時停止使用本服務。若需清除本機設定，可清除瀏覽器的 LocalStorage 或網站資料。請注意，這可能重置您的使用次數與 Pro 測試設定。
        </p>
      </section>

      <section className="legal-section">
        <h2>8. 政策更新</h2>
        <p>
          我們可能不定期更新本政策。更新後繼續使用本服務，即表示您同意修訂後的內容。重大變更時，我們會於 App 內或相關頁面提示。
        </p>
      </section>
    </LegalPageLayout>
  )
}
