import { AppOutline } from 'antd-mobile-icons';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export function HomeButton(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={`bg-[#0d63f844] border border-[#0d63f8] backdrop-blur-xs text-white rounded-sm p-1 ${props.className}`}
    >
      <AppOutline fontSize={18} />
    </div>
  );
}
