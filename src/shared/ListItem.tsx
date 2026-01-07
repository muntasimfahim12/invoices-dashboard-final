export default function ListItem({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <li className="flex justify-between items-center text-sm">
      <span className="text-slate-800 font-medium">{title}</span>
      <span className="text-slate-500">{meta}</span>
    </li>
  );
}
