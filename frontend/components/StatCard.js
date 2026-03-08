const colorMap = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  default: 'text-white',
}

export default function StatCard({ title, value, icon, color = 'default', truncate = false }) {
  const valueColor = colorMap[color] || colorMap.default

  return (
    <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{title}</p>
          <p
            className={`text-xl font-bold leading-tight ${valueColor} ${
              truncate ? 'truncate font-mono text-sm' : ''
            }`}
            title={truncate ? String(value) : undefined}
          >
            {value ?? '—'}
          </p>
        </div>
        {icon && (
          <div className="text-2xl flex-shrink-0">{icon}</div>
        )}
      </div>
    </div>
  )
}
