export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 px-4 py-6 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} PropertyHub</p>

      <p className="mt-1">
        Built by <span className="text-gray-300">Željko Cvitković</span>
      </p>

      <p className="mt-1">
        <a
          href="https://github.com/Zcvitk"
          target="_blank"
          className="transition hover:text-yellow-400"
        >
          GitHub
        </a>
      </p>
      <p className="mt-1">
        <a
          href="https://www.linkedin.com/in/%C5%BEeljko-c-693832182"
          target="_blank"
          className="transition hover:text-yellow-400"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
