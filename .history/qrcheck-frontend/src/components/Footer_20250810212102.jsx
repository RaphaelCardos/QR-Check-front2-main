const Footer = () => {
  return (
    <footer className="bg-green-900 text-white p-6 z-20">
      <div className="container mx-auto">
        {/* Grid de logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center">
          <img
            src="/logo incubadora.png"
            alt="Incubadora IFES"
            className="h-16 object-contain"
          />
          <img
            src="/logo lair.png"
            alt="LAIR"
            className="h-16 object-contain"
          />
          <img
            src="/logo LEDS.png"
            alt="LEDS"
            className="h-16 object-contain"
          />
        </div>

        {/* Texto de direitos autorais */}
        <div className="mt-6 pt-6 border-t border-green-800 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} QRCheck. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
