import home from '../assets/figma-v2/b3e82.svg';
import book from '../assets/figma-v2/0975b.svg';
import calendar from '../assets/figma-v2/3d858.svg';
import chart from '../assets/figma-v2/5eb5d.svg';
import wallet from '../assets/figma-v2/8b38a.svg';
import users from '../assets/figma-v2/b4407.svg';
import file from '../assets/figma-v2/1f3a3.svg';
import search from '../assets/figma-v2/5bebb.svg';
import bell from '../assets/figma-v2/6116d.svg';
import completed from '../assets/figma-v2/5fce4.svg';
import due from '../assets/figma-v2/0c7ed.svg';
import actionChart from '../assets/figma-v2/992b3.svg';
import actionCalendar from '../assets/figma-v2/4b9be.svg';
import actionBook from '../assets/figma-v2/00c80.svg';
import actionFile from '../assets/figma-v2/77a90.svg';

const assets = { home, book, calendar, chart, wallet, users, file, search, bell, completed, due };
const actionAssets = {
  chart: actionChart,
  calendar: actionCalendar,
  book: actionBook,
  file: actionFile,
};
export type V2IconName = keyof typeof assets;
export function V2Icon({
  name,
  tone = 'navigation',
}: {
  name: V2IconName;
  tone?: 'navigation' | 'action';
}) {
  const src =
    tone === 'action' && name in actionAssets
      ? actionAssets[name as keyof typeof actionAssets]
      : assets[name];
  return <img src={src} width="20" height="20" alt="" className="v2-icon" aria-hidden="true" />;
}
