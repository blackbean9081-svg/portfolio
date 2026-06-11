import { useState } from 'react';
import CodeBlock from './CodeBlock.jsx';

// 오른쪽 기능 아코디언 한 칸.
// - rich=true: 헤더에 기능명 + 설명(func__head--rich)
// - rich=false: 헤더에 head 텍스트만 (정산 도메인)
// barName 미지정 시 name 을 사용. defaultOpen 으로 첫 항목만 펼침(결제).
export default function Func({
  name,
  head,
  desc,
  file,
  code,
  barName,
  rich = true,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bar = barName ?? name;

  return (
    <div className="func">
      <button
        className={
          'func__head' +
          (rich ? ' func__head--rich' : '') +
          (open ? ' is-open' : '')
        }
        onClick={() => setOpen((o) => !o)}
      >
        {rich ? (
          <span className="func__head-main">
            <span className="func__name">{name}</span>
            <span className="func__desc">{desc}</span>
          </span>
        ) : (
          head ?? name
        )}
        <span className="func__toggle">
          <span className="func__toggle-text">
            {open ? '코드 접기' : '코드 보기'}
          </span>
          <span className="func__arrow">▾</span>
        </span>
      </button>
      <div className="func__body" hidden={!open}>
        <div className="func__bar">
          <span className="func__bar-name">{bar}</span>
          <span className="func__bar-file">{file}</span>
        </div>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
