const Footer = () => {
  return (
    <footer className="bg-green-900 text-white p-6 z-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between">
          {/* Texto de direitos autorais */}
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} QRCheck. Todos os direitos reservados.
          </p>

          {/* Desenvolvido por + logos */}
          <div className="flex flex-col md:items-end">
            <span className="text-sm mb-2">Desenvolvido por:</span>
            <div className="flex gap-4">
              <img
                src="/logo incubadora.png"
                alt="Incubadora IFES"
                className="h-10 object-contain"
              />
              <img
                src="/logo lair.png"
                alt="LAIR"
                className="h-10 object-contain"
              />
              <img
                src="/logo LEDS.png"
                alt="LEDS"
                className="h-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
