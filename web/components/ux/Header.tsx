export default function Header() {
  const menus = [
    { name: "Home", href: "/" },
    { name: "Community", href: "/community" },
    { name: "Ranking", href: "/ranking" },
    { name: "Simulation", href: "/simulation" },
    { name: "About", href: "/about" },
  ];

  return (
    <div class="bg-gray-800 bg-opacity-70 w-full py-2 px-8 flex flex-col md:flex-row gap-4">
      <div class="flex items-center flex-1">
        <div class="text-2xl ml-1 font-semibold text-white">
          💹 Etoro Copy Investment
        </div>
      </div>
      <ul class="flex items-center gap-6">
        {menus.map((menu) => (
          <li>
            <a
              href={menu.href}
              class="text-gray-200 hover:text-gray-700 py-1 border-gray-500"
            >
              {menu.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
