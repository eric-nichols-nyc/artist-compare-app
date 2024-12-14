export function Sidebar() {
  const menuItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '📊', label: 'Analytics' },
    { icon: '🎵', label: 'Music' },
    { icon: '📍', label: 'Places' },
    { icon: '🌍', label: 'Global' },
    { icon: '⬇️', label: 'Downloads' },
  ]

  return (
    <nav className="w-16 bg-white border-r border-gray-200">
      <div className="flex flex-col items-center py-4 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
      </div>
    </nav>
  )
} 